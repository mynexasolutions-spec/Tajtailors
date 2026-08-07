import { Suspense } from "react";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import LoginForm from "./_components/LoginForm";
import { getSiteSettings } from "@/actions/settings";
import { settingsToBrand } from "@/lib/constants";

export const metadata = { title: "Log In" };

export default async function LoginPage() {
  const brandInfo = settingsToBrand(await getSiteSettings());
  return (
    <>
      <SiteHeader />
      <main className="relative flex min-h-[85vh] items-center justify-center bg-ivory px-6 py-20 overflow-hidden">
        {/* Background Ambient Glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute -top-[10%] left-[-20%] w-[500px] h-[500px] rounded-full bg-gold-500/10 blur-[120px]" />
          <div className="absolute -bottom-[10%] right-[-20%] w-[500px] h-[500px] rounded-full bg-gold-400/10 blur-[120px]" />
          <div className="absolute top-[45%] left-[45%] w-[400px] h-[400px] rounded-full bg-gold-300/10 blur-[130px]" />
        </div>

        <div className="relative z-10 flex w-full items-center justify-center">
          <Suspense fallback={null}>
            <LoginForm brandInfo={brandInfo} />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
