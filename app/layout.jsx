import { Plus_Jakarta_Sans, Jost } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/context/ToastContext";
import { WishlistProvider } from "@/context/WishlistContext";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import CartDrawer from "@/components/CartDrawer";
import { BRAND } from "@/lib/constants";
import { getQuantityDiscountSettings } from "@/actions/admin/quantityDiscount";

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

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: `${BRAND.name} — Custom Tailoring at Your Doorstep`,
    template: `%s — ${BRAND.name}`,
  },
  description:
    "Ghar baithe perfect fitting — send your fabric or choose from our premium collection, share your measurements, and get it stitched and delivered to your door.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default async function RootLayout({ children }) {
  const quantityDiscount = await getQuantityDiscountSettings();

  return (
    <html lang="en" className={`${display.variable} ${body.variable} overflow-x-hidden`}>
      <body className="overflow-x-hidden">
        <ToastProvider>
          <WishlistProvider>
            <CartProvider>
              <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
                {children}
              </div>
              <CartDrawer quantityDiscount={quantityDiscount} />
              <FloatingWhatsApp />
            </CartProvider>
          </WishlistProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
