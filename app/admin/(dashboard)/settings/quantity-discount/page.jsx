import { getQuantityDiscountSettings } from "@/actions/admin/quantityDiscount";
import QuantityDiscountForm from "./_components/QuantityDiscountForm";

export const metadata = { title: "Quantity Discount Settings" };

export default async function AdminQuantityDiscountPage() {
  const settings = await getQuantityDiscountSettings();

  return (
    <div>
      <div className="mb-8 border-b border-gold-400/10 pb-6">
        <h1 className="font-display text-3xl font-light text-ink">
          Quantity{" "}
          <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gold-600 via-gold-500 to-gold-700">
            Discount
          </span>
        </h1>
        <p className="text-sm text-ink/50 font-light mt-1">
          Automatic discount based on total cart quantity — applies store-wide, no coupon code required.
        </p>
      </div>
      <QuantityDiscountForm settings={settings} />
    </div>
  );
}
