import { getAllCoupons } from "@/actions/admin/coupons";
import CouponForm from "./_components/CouponForm";
import CouponsList from "./_components/CouponsList";

export const metadata = { title: "Coupons" };

export default async function AdminCouponsPage() {
  const coupons = await getAllCoupons();

  return (
    <div>
      <div className="mb-8 border-b border-gold-400/10 pb-6">
        <h1 className="font-display text-3xl font-light text-ink">
          Discount <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gold-600 via-gold-500 to-gold-700">Coupons</span>
        </h1>
        <p className="text-sm text-ink/50 font-light mt-1">Discount codes customers can apply at checkout.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
        <div className="order-2 min-w-0 lg:order-1">
          <CouponsList coupons={coupons} />
        </div>
        <div className="order-1 min-w-0 lg:order-2">
          <CouponForm />
        </div>
      </div>
    </div>
  );
}
