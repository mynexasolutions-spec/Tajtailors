import PolicyLayout from "@/components/PolicyLayout";
import { settingsToBrand } from "@/lib/constants";
import { getSiteSettings } from "@/actions/settings";
import { FileText } from "lucide-react";

export const metadata = { title: "Terms of Service" };

export default async function TermsPage() {
  const brandInfo = settingsToBrand(await getSiteSettings());
  return (
    <PolicyLayout title="Terms of Service" updated="July 2026" icon={FileText}>
      <p>By using our website and placing an order with {brandInfo.name}, you agree to the following terms.</p>
      <h2 className="font-display text-xl font-medium text-gold-200">Orders &amp; Pricing</h2>
      <p>All prices are listed in Indian Rupees (INR) and include applicable taxes unless stated otherwise. We reserve the right to correct pricing errors and to limit order quantities.</p>
      <h2 className="font-display text-xl font-medium text-gold-200">Measurements &amp; Stitching</h2>
      <p>Garments are stitched to the measurements you share with us, whether entered manually or taken from a reference garment you send. We take reasonable care to match your measurements exactly, but a small fitting variance can occur — please share notes on fit preference at checkout to help our tailors get it right.</p>
      <h2 className="font-display text-xl font-medium text-gold-200">Fabric Pickup</h2>
      <p>When you send your own fabric or a reference garment for stitching, please pack it securely for courier pickup. We are not responsible for damage caused by inadequate packaging before it reaches us.</p>
      <h2 className="font-display text-xl font-medium text-gold-200">Accounts</h2>
      <p>You're responsible for keeping your account credentials secure and for all activity under your account.</p>
      <h2 className="font-display text-xl font-medium text-gold-200">Governing Law</h2>
      <p>These terms are governed by the laws of India. Any disputes will be subject to the jurisdiction of the courts where {brandInfo.name} operates.</p>
      <p>Questions? Write to {brandInfo.email}.</p>
    </PolicyLayout>
  );
}
