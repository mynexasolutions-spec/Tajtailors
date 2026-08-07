import PolicyLayout from "@/components/PolicyLayout";
import { settingsToBrand } from "@/lib/constants";
import { getSiteSettings } from "@/actions/settings";
import { RefreshCcw } from "lucide-react";

export const metadata = { title: "Refund Policy" };

export default async function RefundPolicyPage() {
  const brandInfo = settingsToBrand(await getSiteSettings());
  return (
    <PolicyLayout title="Refund &amp; Return Policy" updated="July 2026" icon={RefreshCcw}>
      <p>Because stitched garments are custom-made to your measurements, we're unable to accept returns once stitching has started — but we stand behind our fit and quality on every order.</p>
      <h2 className="font-display text-xl font-medium text-gold-200">Fit Issues</h2>
      <p>If a stitched piece doesn't fit as expected, contact us within 7 days of delivery. We'll arrange free alterations, or a re-stitch at no extra cost, based on the measurements or reference garment you originally provided.</p>
      <h2 className="font-display text-xl font-medium text-gold-200">Ready-Made Kurtas</h2>
      <p>Ready-made kurtas can be exchanged for a different size within 7 days of delivery, provided the item is unworn and unwashed with tags intact.</p>
      <h2 className="font-display text-xl font-medium text-gold-200">Damaged or Incorrect Orders</h2>
      <p>If your order arrives damaged or different from what you ordered, contact us within 48 hours of delivery with photos of the product and packaging. We'll send a free replacement or issue a full refund.</p>
      <h2 className="font-display text-xl font-medium text-gold-200">Cancellations</h2>
      <p>Orders can be cancelled free of charge any time before stitching begins or the item is dispatched. Once stitching has started or the order has shipped, it can no longer be cancelled.</p>
      <h2 className="font-display text-xl font-medium text-gold-200">Refund Timeline</h2>
      <p>Approved refunds for prepaid orders are credited to your original payment method within 5-7 business days.</p>
      <p>For any of the above, reach us at {brandInfo.email} or on WhatsApp at {brandInfo.whatsappDisplay}.</p>
    </PolicyLayout>
  );
}
