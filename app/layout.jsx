import { Plus_Jakarta_Sans, Jost } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/context/ToastContext";
import { WishlistProvider } from "@/context/WishlistContext";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import BottomNav from "@/components/BottomNav";
import CartDrawer from "@/components/CartDrawer";
import { settingsToBrand } from "@/lib/constants";
import { getQuantityDiscountSettings } from "@/actions/admin/quantityDiscount";
import { getSiteSettings } from "@/actions/settings";

const display = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const body = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

export async function generateMetadata() {
  const brandInfo = settingsToBrand(await getSiteSettings());
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
    title: {
      default: `${brandInfo.name} — Custom Tailoring at Your Doorstep`,
      template: `%s — ${brandInfo.name}`,
    },
    description:
      "Perfect fitting from the comfort of your home — send your fabric or choose from our premium collection, share your measurements, and get it stitched and delivered to your door.",
    icons: {
      icon: "/logo.png",
      apple: "/logo.png",
    },
  };
}

export default async function RootLayout({ children }) {
  const quantityDiscount = await getQuantityDiscountSettings();

  return (
    <html lang="en" className={`${display.variable} ${body.variable} overflow-x-clip`}>
      <body className="overflow-x-clip">
        <ToastProvider>
          <WishlistProvider>
            <CartProvider>
              <div className="relative flex min-h-screen w-full flex-col overflow-x-clip pb-16 sm:pb-0">
                {children}
              </div>
              <CartDrawer quantityDiscount={quantityDiscount} />
              <FloatingWhatsApp />
              <BottomNav />
            </CartProvider>
          </WishlistProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
