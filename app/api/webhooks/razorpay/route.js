import { NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("[Razorpay Webhook Error]: RAZORPAY_WEBHOOK_SECRET is not configured on server.");
      return NextResponse.json(
        { success: false, error: "Webhook secret is not configured on server environment" },
        { status: 500 }
      );
    }

    if (!signature) {
      console.error("[Razorpay Webhook Error]: Missing x-razorpay-signature header.");
      return NextResponse.json(
        { success: false, error: "Missing x-razorpay-signature header" },
        { status: 400 }
      );
    }

    // Verify HMAC SHA-256 signature
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    const signatureBuffer = Buffer.from(signature, "utf8");
    const expectedBuffer = Buffer.from(expectedSignature, "utf8");

    let isValid = false;
    if (signatureBuffer.length === expectedBuffer.length) {
      isValid = crypto.timingSafeEqual(signatureBuffer, expectedBuffer);
    }

    if (!isValid) {
      console.error("[Razorpay Webhook Error]: Signature mismatch. Untrusted webhook payload received.");
      return NextResponse.json(
        { success: false, error: "Invalid webhook signature" },
        { status: 400 }
      );
    }

    // Parse verified payload
    const eventData = JSON.parse(rawBody);
    const event = eventData.event;
    const payload = eventData.payload;

    console.log(`[Razorpay Webhook]: Received valid event '${event}'`);

    const supabaseAdmin = createAdminClient();

    switch (event) {
      case "payment.captured": {
        const payment = payload?.payment?.entity;
        if (!payment) break;

        const razorpayPaymentId = payment.id;
        const razorpayOrderId = payment.order_id;
        const internalOrderId = payment.notes?.internal_order_id || payment.notes?.order_id || payment.receipt;

        console.log(`[Razorpay Webhook]: Processing payment.captured for payment ${razorpayPaymentId}, order ${razorpayOrderId}, internal order ${internalOrderId}`);

        if (internalOrderId) {
          // Fetch order to see if it is already paid
          const { data: order, error: fetchError } = await supabaseAdmin
            .from("orders")
            .select("id, payment_status, order_items(variant_id, quantity)")
            .eq("id", internalOrderId)
            .maybeSingle();

          if (fetchError) {
            console.error("[Razorpay Webhook Error]: Failed fetching order details:", fetchError.message);
            break;
          }

          if (order && order.payment_status !== "paid") {
            // Update order status to paid and processing
            const { error: updateErr } = await supabaseAdmin
              .from("orders")
              .update({
                payment_status: "paid",
                order_status: "processing",
                razorpay_payment_id: razorpayPaymentId,
                updated_at: new Date().toISOString(),
              })
              .eq("id", internalOrderId);

            if (updateErr) {
              console.error("[Razorpay Webhook Error]: DB update failed for payment.captured:", updateErr.message);
            } else {
              console.log(`[Razorpay Webhook]: Order payment status updated to paid and order status to processing.`);

              // Decrement Stock
              const orderItems = order.order_items || [];
              for (const item of orderItems) {
                if (!item.variant_id) continue;
                const { data: variant } = await supabaseAdmin
                  .from("product_variants")
                  .select("stock_quantity")
                  .eq("id", item.variant_id)
                  .maybeSingle();
                if (variant) {
                  await supabaseAdmin
                    .from("product_variants")
                    .update({ stock_quantity: Math.max(0, variant.stock_quantity - item.quantity) })
                    .eq("id", item.variant_id);
                }
              }
            }
          }
        }
        break;
      }

      case "payment.failed": {
        const payment = payload?.payment?.entity;
        if (!payment) break;

        const razorpayPaymentId = payment.id;
        const internalOrderId = payment.notes?.internal_order_id || payment.notes?.order_id || payment.receipt;
        const errorDescription = payment.error_description || "Payment transaction failed";

        console.log(`[Razorpay Webhook]: Processing payment.failed for payment ${razorpayPaymentId}, reason: ${errorDescription}`);

        if (internalOrderId) {
          const { error: updateErr } = await supabaseAdmin
            .from("orders")
            .update({
              payment_status: "failed",
              updated_at: new Date().toISOString(),
            })
            .eq("id", internalOrderId);

          if (updateErr) {
            console.error("[Razorpay Webhook Error]: DB update failed for payment.failed:", updateErr.message);
          }
        }
        break;
      }

      case "order.paid": {
        const orderEntity = payload?.order?.entity;
        if (!orderEntity) break;

        const razorpayOrderId = orderEntity.id;
        const internalOrderId = orderEntity.receipt || orderEntity.notes?.internal_order_id || orderEntity.notes?.order_id;

        console.log(`[Razorpay Webhook]: Processing order.paid for razorpay order ${razorpayOrderId}, internal order ${internalOrderId}`);

        if (internalOrderId) {
          const { data: order, error: fetchError } = await supabaseAdmin
            .from("orders")
            .select("id, payment_status, order_items(variant_id, quantity)")
            .eq("id", internalOrderId)
            .maybeSingle();

          if (fetchError) {
            console.error("[Razorpay Webhook Error]: Failed fetching order details:", fetchError.message);
            break;
          }

          if (order && order.payment_status !== "paid") {
            const { error: updateErr } = await supabaseAdmin
              .from("orders")
              .update({
                payment_status: "paid",
                order_status: "processing",
                updated_at: new Date().toISOString(),
              })
              .eq("id", internalOrderId);

            if (updateErr) {
              console.error("[Razorpay Webhook Error]: DB update failed for order.paid:", updateErr.message);
            } else {
              console.log(`[Razorpay Webhook]: Order payment status updated to paid and order status to processing.`);

              // Decrement Stock
              const orderItems = order.order_items || [];
              for (const item of orderItems) {
                if (!item.variant_id) continue;
                const { data: variant } = await supabaseAdmin
                  .from("product_variants")
                  .select("stock_quantity")
                  .eq("id", item.variant_id)
                  .maybeSingle();
                if (variant) {
                  await supabaseAdmin
                    .from("product_variants")
                    .update({ stock_quantity: Math.max(0, variant.stock_quantity - item.quantity) })
                    .eq("id", item.variant_id);
                }
              }
            }
          }
        }
        break;
      }

      default:
        console.log(`[Razorpay Webhook]: Unhandled event type '${event}' acknowledged.`);
        break;
    }

    return NextResponse.json({ success: true, event }, { status: 200 });
  } catch (error) {
    console.error("[Razorpay Webhook Critical Error]:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
