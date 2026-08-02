import PolicyLayout from "@/components/PolicyLayout";
import { BRAND } from "@/lib/constants";
import { ShieldCheck } from "lucide-react";

export const metadata = { title: "Privacy Policy" };

export default function PrivacyPolicyPage() {
  return (
    <PolicyLayout title="Privacy Policy" updated="July 2026" icon={ShieldCheck}>
      <p>{BRAND.name} ("we", "us") respects your privacy. This policy explains what information we collect and how it's used.</p>
      <h2 className="font-display text-xl font-medium text-gold-200">Information We Collect</h2>
      <p>When you create an account or place an order, we collect your name, email, phone number, and shipping address. We do not store your card or UPI details — payments are processed securely by Razorpay.</p>
      <h2 className="font-display text-xl font-medium text-gold-200">How We Use It</h2>
      <p>We use your information to process orders, communicate delivery updates via WhatsApp or email, and improve our products. We do not sell your data to third parties.</p>
      <h2 className="font-display text-xl font-medium text-gold-200">Cookies</h2>
      <p>We use essential cookies to keep you logged in and to remember items in your bag. We don't use third-party advertising trackers.</p>
      <h2 className="font-display text-xl font-medium text-gold-200">Your Rights</h2>
      <p>You can request access to, or deletion of, your account data at any time by emailing {BRAND.email}.</p>
    </PolicyLayout>
  );
}
