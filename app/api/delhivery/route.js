import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createShipment, createReversePickup, trackShipment, checkServiceability } from "@/lib/delhivery";
import { DEFAULT_PACKAGE } from "@/lib/constants";

async function getAuth() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { user: null, isAdmin: false };

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  return { user, isAdmin: profile?.role === "admin" };
}

async function loadOrderForShipping(orderId) {
  const admin = createAdminClient();
  const { data: order } = await admin
    .from("orders")
    .select(
      `id, order_number, user_id, total_amount, payment_method, tracking_number,
       addresses:addresses!address_id ( full_name, phone, address_line_1, address_line_2, city, state, postal_code ),
       order_items ( quantity, product_variants ( weight_grams ) )`
    )
    .eq("id", orderId)
    .maybeSingle();
  return order;
}

function estimateWeightGrams(order) {
  const itemsWeight = (order.order_items || []).reduce((sum, item) => {
    const unitWeight = item.product_variants?.weight_grams || DEFAULT_PACKAGE.itemWeightGrams;
    return sum + unitWeight * item.quantity;
  }, 0);
  return itemsWeight + DEFAULT_PACKAGE.packagingOverheadGrams;
}

async function loadOrderForPickup(orderId) {
  const admin = createAdminClient();
  const { data: order } = await admin
    .from("orders")
    .select(
      `id, order_number, user_id, payment_method, pickup_required, pickup_waybill,
       pickup_address:addresses!pickup_address_id ( full_name, phone, address_line_1, address_line_2, city, state, postal_code )`
    )
    .eq("id", orderId)
    .maybeSingle();
  return order;
}

export async function POST(request) {
  const { action, payload } = (await request.json()) || {};
  if (!action) return Response.json({ success: false, error: "action is required." }, { status: 400 });

  const { user, isAdmin } = await getAuth();
  if (!user) return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });

  try {
    if (action === "create_shipment") {
      if (!isAdmin) return Response.json({ success: false, error: "Forbidden" }, { status: 403 });

      const { orderId, weightGrams, lengthCm, widthCm, heightCm } = payload || {};
      if (!orderId) return Response.json({ success: false, error: "orderId is required." }, { status: 400 });

      const order = await loadOrderForShipping(orderId);
      if (!order) return Response.json({ success: false, error: "Order not found." }, { status: 404 });
      if (order.tracking_number) {
        return Response.json({ success: false, error: "This order is already booked with a courier." }, { status: 400 });
      }
      if (!order.addresses) return Response.json({ success: false, error: "Order has no shipping address." }, { status: 400 });

      const weight = weightGrams || estimateWeightGrams(order);
      const result = await createShipment({
        order,
        address: order.addresses,
        weightKg: weight / 1000,
        lengthCm: lengthCm || DEFAULT_PACKAGE.lengthCm,
        widthCm: widthCm || DEFAULT_PACKAGE.breadthCm,
        heightCm: heightCm || DEFAULT_PACKAGE.heightCm,
      });

      const admin = createAdminClient();
      await admin
        .from("orders")
        .update({
          tracking_number: result.waybill,
          tracking_url: result.trackingUrl,
          courier_name: "Delhivery",
          order_status: "shipped",
          shipped_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);

      return Response.json({ success: true, waybill: result.waybill, trackingUrl: result.trackingUrl });
    }

    if (action === "track_shipment") {
      const { orderId } = payload || {};
      if (!orderId) return Response.json({ success: false, error: "orderId is required." }, { status: 400 });

      const admin = createAdminClient();
      let query = admin.from("orders").select("id, user_id, tracking_number").eq("id", orderId);
      if (!isAdmin) query = query.eq("user_id", user.id);
      const { data: order } = await query.maybeSingle();

      if (!order) return Response.json({ success: false, error: "Order not found." }, { status: 404 });
      if (!order.tracking_number) {
        return Response.json({ success: false, error: "This order hasn't shipped yet." }, { status: 404 });
      }

      const data = await trackShipment(order.tracking_number);
      const shipment = data?.ShipmentData?.[0]?.Shipment;
      const status = shipment?.Status?.Status;

      if (status) {
        const statusLower = status.toLowerCase();
        const updatePayload = { shipment_status: status };
        if (statusLower === "delivered") {
          updatePayload.order_status = "delivered";
        } else if (statusLower.includes("cancel") || statusLower === "rto") {
          // Delhivery can cancel or return-to-origin a shipment on their own
          // side (e.g. failed delivery attempts, courier-initiated cancel) —
          // reflect that back so the customer and admin see it as cancelled
          // instead of the order silently staying "shipped" forever.
          updatePayload.order_status = "cancelled";
          updatePayload.cancelled_at = new Date().toISOString();
        }
        await admin.from("orders").update(updatePayload).eq("id", orderId);
      }

      return Response.json({ success: true, tracking: data });
    }

    if (action === "create_reverse_pickup") {
      if (!isAdmin) return Response.json({ success: false, error: "Forbidden" }, { status: 403 });

      const { orderId, weightGrams, lengthCm, widthCm, heightCm } = payload || {};
      if (!orderId) return Response.json({ success: false, error: "orderId is required." }, { status: 400 });

      const order = await loadOrderForPickup(orderId);
      if (!order) return Response.json({ success: false, error: "Order not found." }, { status: 404 });
      if (!order.pickup_required) {
        return Response.json({ success: false, error: "This order has no pickup requested." }, { status: 400 });
      }
      if (order.pickup_waybill) {
        return Response.json({ success: false, error: "Pickup is already booked with a courier." }, { status: 400 });
      }
      if (!order.pickup_address) {
        return Response.json({ success: false, error: "Order has no pickup address." }, { status: 400 });
      }

      const result = await createReversePickup({
        order,
        address: order.pickup_address,
        weightKg: (weightGrams || DEFAULT_PACKAGE.itemWeightGrams + DEFAULT_PACKAGE.packagingOverheadGrams) / 1000,
        lengthCm: lengthCm || DEFAULT_PACKAGE.lengthCm,
        widthCm: widthCm || DEFAULT_PACKAGE.breadthCm,
        heightCm: heightCm || DEFAULT_PACKAGE.heightCm,
      });

      const admin = createAdminClient();
      await admin
        .from("orders")
        .update({
          pickup_waybill: result.waybill,
          pickup_tracking_url: result.trackingUrl,
          pickup_status: "requested",
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);

      return Response.json({ success: true, waybill: result.waybill, trackingUrl: result.trackingUrl });
    }

    if (action === "track_reverse_pickup") {
      const { orderId } = payload || {};
      if (!orderId) return Response.json({ success: false, error: "orderId is required." }, { status: 400 });

      const admin = createAdminClient();
      let query = admin.from("orders").select("id, user_id, pickup_waybill, pickup_status").eq("id", orderId);
      if (!isAdmin) query = query.eq("user_id", user.id);
      const { data: order } = await query.maybeSingle();

      if (!order) return Response.json({ success: false, error: "Order not found." }, { status: 404 });
      if (!order.pickup_waybill) {
        return Response.json({ success: false, error: "Pickup hasn't been booked yet." }, { status: 404 });
      }

      const data = await trackShipment(order.pickup_waybill);
      const shipment = data?.ShipmentData?.[0]?.Shipment;
      const status = shipment?.Status?.Status;

      if (status && order.pickup_status !== "received") {
        const statusLower = status.toLowerCase();
        const pickupStatus =
          statusLower === "delivered"
            ? "received"
            : statusLower.includes("cancel") || statusLower === "rto"
              ? "failed"
              : "picked_up";
        await admin.from("orders").update({ pickup_status: pickupStatus }).eq("id", orderId);
      }

      return Response.json({ success: true, tracking: data });
    }

    if (action === "mark_pickup_received") {
      if (!isAdmin) return Response.json({ success: false, error: "Forbidden" }, { status: 403 });

      const { orderId } = payload || {};
      if (!orderId) return Response.json({ success: false, error: "orderId is required." }, { status: 400 });

      const admin = createAdminClient();
      const { error } = await admin
        .from("orders")
        .update({ pickup_status: "received", updated_at: new Date().toISOString() })
        .eq("id", orderId);

      if (error) return Response.json({ success: false, error: error.message }, { status: 500 });
      return Response.json({ success: true });
    }

    if (action === "check_serviceability") {
      if (!isAdmin) return Response.json({ success: false, error: "Forbidden" }, { status: 403 });

      const { pincode } = payload || {};
      if (!pincode) return Response.json({ success: false, error: "pincode is required." }, { status: 400 });

      const data = await checkServiceability(pincode);
      return Response.json({ success: true, data });
    }

    return Response.json({ success: false, error: "Invalid action type." }, { status: 400 });
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 502 });
  }
}
