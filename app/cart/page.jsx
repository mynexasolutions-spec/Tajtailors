import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import CartView from "./_components/CartView";
import { getQuantityDiscountSettings } from "@/actions/admin/quantityDiscount";

export const metadata = { title: "Your Bag" };

export default async function CartPage() {
  const quantityDiscount = await getQuantityDiscountSettings();

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen pb-24 pt-14">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <h1 className="section-heading mb-10">Your Bag</h1>
          <CartView quantityDiscount={quantityDiscount} />
        </div>
      </main>
      <Footer />
    </>
  );
}
