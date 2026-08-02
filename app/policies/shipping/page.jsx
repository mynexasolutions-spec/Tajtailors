import PolicyLayout from "@/components/PolicyLayout";
import { BRAND } from "@/lib/constants";
import { Truck } from "lucide-react";

export const metadata = { title: "Shipping Policy" };

export default function ShippingPolicyPage() {
  return (
    <PolicyLayout title="Shipping Policy" updated="July 2026" icon={Truck}>
      <p>We ship across India from our fulfillment location. Orders are packed with care to protect glass bottles and caps during transit.</p>
      <h2 className="font-display text-xl font-medium text-gold-200">Processing Time</h2>
      <p>Orders are processed and handed to our courier partner within 1-2 business days of confirmation. You'll receive a WhatsApp or email update once your order ships.</p>
      <h2 className="font-display text-xl font-medium text-gold-200">Delivery Time</h2>
      <p>Most orders arrive within 3-6 business days depending on your city and courier serviceability. Remote pin codes may take slightly longer.</p>
      <h2 className="font-display text-xl font-medium text-gold-200">Shipping Charges</h2>
      <p>Shipping is free on prepaid and COD orders above our free-shipping threshold, shown at checkout. A flat shipping fee applies below that, and a small COD handling fee applies to Cash on Delivery orders.</p>
      <h2 className="font-display text-xl font-medium text-gold-200">Questions About Your Order</h2>
      <p>Write to us at {BRAND.email} or message us on WhatsApp at {BRAND.whatsappDisplay} with your order number.</p>
    </PolicyLayout>
  );
}
