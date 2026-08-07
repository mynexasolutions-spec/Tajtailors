"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath, revalidateTag } from "next/cache";

export async function getAllOrdersAdmin() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("orders")
    .select("id, order_number, total_amount, order_status, payment_status, payment_method, created_at, profiles ( full_name, email )")
    // Razorpay orders are created up front (before the payment modal even
    // opens) so a receipt id exists to hand to Razorpay — but that means an
    // abandoned/cancelled checkout would otherwise sit in the list forever
    // as a ghost "pending" order. Hide those until the webhook resolves
    // them to paid or failed; COD orders are legitimately pending and stay.
    .or("payment_method.neq.RAZORPAY,payment_status.neq.pending")
    .order("created_at", { ascending: false });

  return data || [];
}

export async function getOrderById(id) {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("orders")
    .select(`
      id, order_number, subtotal, shipping_cost, discount_amount, coupon_discount, quantity_discount, coupon_code, total_amount,
      payment_method, payment_status, order_status, created_at,
      pickup_required, pickup_preferred_date, pickup_notes,
      tracking_number, courier_name, tracking_url, shipment_status,
      pickup_waybill, pickup_tracking_url, pickup_status,
      razorpay_payment_id, razorpay_order_id,
      profiles ( full_name, email, phone ),
      delivery_address:addresses!address_id ( full_name, phone, address_line_1, address_line_2, city, state, postal_code, country ),
      pickup_address:addresses!pickup_address_id ( full_name, phone, address_line_1, address_line_2, city, state, postal_code, country ),
      order_items (
        id, product_name, variant_name, price_at_purchase, quantity, line_total,
        fabric_meters, measurement_type, measurements, notes,
        products:products!product_id ( featured_image_url ),
        fabric:products!fabric_product_id ( name, product_code )
      )
    `)
    .eq("id", id)
    .maybeSingle();

  return data;
}

export async function updateOrderStatus(orderId, orderStatus) {
  const supabase = createAdminClient();
  const payload = { order_status: orderStatus, updated_at: new Date().toISOString() };
  if (orderStatus === "cancelled") payload.cancelled_at = new Date().toISOString();

  const { error } = await supabase.from("orders").update(payload).eq("id", orderId);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  return { success: true };
}

export async function updatePaymentStatus(orderId, paymentStatus) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("orders")
    .update({ payment_status: paymentStatus, updated_at: new Date().toISOString() })
    .eq("id", orderId);

  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  return { success: true };
}
