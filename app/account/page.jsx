import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/actions/auth";
import AccountTabs from "./_components/AccountTabs";
import { LogOut } from "lucide-react";

export const metadata = { title: "My Account" };

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, phone")
    .eq("id", user.id)
    .maybeSingle();

  const { data: orders } = await supabase
    .from("orders")
    .select("id, order_number, total_amount, order_status, payment_status, payment_method, created_at, order_items ( product_name, variant_name, quantity )")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <>
      <SiteHeader />
      <main className="relative min-h-screen overflow-hidden bg-ivory pb-24 pt-14">
        {/* Ambient background glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[5%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gold-500/10 blur-[120px]" />
          <div className="absolute top-[35%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gold-400/10 blur-[150px]" />
          <div className="absolute bottom-[5%] left-[20%] w-[500px] h-[500px] rounded-full bg-gold-600/10 blur-[130px]" />
        </div>

        <div className="relative mx-auto max-w-3xl px-5 md:px-8">
          <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 border-b border-gold-400/15 pb-8">
            <div className="min-w-0">
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-ink">
                My{" "}
                <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gold-600 via-gold-500 to-gold-700">
                  Account
                </span>
              </h1>
              <p className="mt-3 text-sm sm:text-base text-ink/55 font-light break-words">
                {profile?.full_name || "Taj Tailor Customer"} · {profile?.email}
              </p>
            </div>
            <form action={logout} className="sm:shrink-0">
              <button
                type="submit"
                className="group flex w-fit items-center justify-center gap-2 rounded-full border border-red-500/25 bg-red-500/5 px-5 py-3 text-xs font-semibold uppercase tracking-widest text-red-600 transition-all duration-300 hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-700 hover:-translate-y-0.5"
              >
                <LogOut className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                Log Out
              </button>
            </form>
          </div>

          <AccountTabs profile={profile} orders={orders} />
        </div>
      </main>
      <Footer />
    </>
  );
}
