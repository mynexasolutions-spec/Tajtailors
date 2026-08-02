"use server";

import { unstable_cache, revalidateTag } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

// Default settings (fallback if table doesn't exist, and to backfill any
// keys that don't have a row in the DB yet).
const DEFAULT_SETTINGS = {
  brand_name: { value: "Taj Tailor", category: "brand", description: "Brand name" },
  tagline: { value: "Ghar Baithe Perfect Fitting", category: "brand", description: "Brand tagline" },
  email: { value: "tajtailor@gmail.com", category: "contact", description: "Business email" },
  whatsapp_number: { value: "911234567890", category: "contact", description: "WhatsApp number (with country code, no spaces)" },
  whatsapp_display: { value: "+91 12345 67890", category: "contact", description: "WhatsApp display format" },
  call_number: { value: "911234567890", category: "contact", description: "Call button number (with country code, no spaces)" },
  call_display: { value: "+91 12345 67890", category: "contact", description: "Call button display format" },
  instagram_url: { value: "https://www.instagram.com/", category: "social", description: "Instagram profile URL" },
  facebook_url: { value: "https://www.facebook.com/", category: "social", description: "Facebook profile URL" },
  youtube_url: { value: "https://youtube.com/", category: "social", description: "YouTube channel URL" },
  cod_enabled: { value: "true", category: "payment", description: "Allow Cash on Delivery at checkout" },
  online_payment_enabled: { value: "true", category: "payment", description: "Allow online payment (Razorpay) at checkout" },

  home_hero_badge_text: { value: "Taj Tailor", category: "home_hero", description: "Hero — badge text above the title" },
  home_hero_rating_value: { value: "4.8", category: "home_hero", description: "Hero — star rating (e.g. 4.8)" },
  home_hero_reviews_text: { value: "500+ Happy Customers", category: "home_hero", description: "Hero — reviews text shown next to the rating" },
  home_hero_shipped_text: { value: "5,000+ Orders Delivered Pan-India", category: "home_hero", description: "Hero — orders delivered stat" },
  home_hero_enabled: { value: "true", category: "home_hero", description: "Show the hero banner on the homepage" },

  home_marquee_items: {
    value: "*Free Doorstep Pickup\nPremium Handpicked Fabrics\nPerfect Fitting, Guaranteed\n*Pan-India Delivery\nExpert Master Tailors\nCash on Delivery Available",
    category: "home_sections",
    description: "Marquee Strip — one item per line, start a line with * to highlight it in gold",
  },
  home_marquee_enabled: { value: "true", category: "home_sections", description: "Show the Marquee Strip on the homepage" },

  home_threeways_enabled: { value: "true", category: "home_sections", description: "Show the '3 Easy Ways' section on the homepage" },
  home_threeways_heading: { value: "3 Easy Ways, Just For You", category: "home_sections", description: "3 Easy Ways — heading" },
  home_threeways_1_title: { value: "Stitch My Fabric", category: "home_sections", description: "3 Easy Ways — card 1 title" },
  home_threeways_1_desc: { value: "Send us your fabric, share your measurements, and we'll stitch it to perfection and deliver it home.", category: "home_sections", description: "3 Easy Ways — card 1 description" },
  home_threeways_1_button: { value: "Order Now", category: "home_sections", description: "3 Easy Ways — card 1 button text" },
  home_threeways_2_title: { value: "Buy Fabric & Stitch", category: "home_sections", description: "3 Easy Ways — card 2 title" },
  home_threeways_2_desc: { value: "Choose from our premium fabrics, share your measurements, and we'll stitch and deliver it to you.", category: "home_sections", description: "3 Easy Ways — card 2 description" },
  home_threeways_2_button: { value: "Choose Fabric", category: "home_sections", description: "3 Easy Ways — card 2 button text" },
  home_threeways_3_title: { value: "Ready-Made Kurtas", category: "home_sections", description: "3 Easy Ways — card 3 title" },
  home_threeways_3_desc: { value: "Order ready-made kurtas in your size and get them delivered right to your doorstep.", category: "home_sections", description: "3 Easy Ways — card 3 description" },
  home_threeways_3_button: { value: "Shop Now", category: "home_sections", description: "3 Easy Ways — card 3 button text" },

  home_howitworks_enabled: { value: "true", category: "home_sections", description: "Show the 'How It Works' section on the homepage" },
  home_howitworks_heading: { value: "How It Works", category: "home_sections", description: "How It Works — heading (last word highlighted in gold)" },
  home_howitworks_1_title: { value: "Place Your Order", category: "home_sections", description: "How It Works — step 1 title" },
  home_howitworks_1_desc: { value: "Choose your preferred option and place your order.", category: "home_sections", description: "How It Works — step 1 description" },
  home_howitworks_2_title: { value: "Share Measurements", category: "home_sections", description: "How It Works — step 2 title" },
  home_howitworks_2_desc: { value: "Share your measurements using our guide, or send them to us.", category: "home_sections", description: "How It Works — step 2 description" },
  home_howitworks_3_title: { value: "Courier Pickup", category: "home_sections", description: "How It Works — step 3 title" },
  home_howitworks_3_desc: { value: "Our courier picks up your fabric right from your home.", category: "home_sections", description: "How It Works — step 3 description" },
  home_howitworks_4_title: { value: "Stitching & Quality Check", category: "home_sections", description: "How It Works — step 4 title" },
  home_howitworks_4_desc: { value: "We stitch it to perfection and run a full quality check.", category: "home_sections", description: "How It Works — step 4 description" },
  home_howitworks_5_title: { value: "Delivery at Your Doorstep", category: "home_sections", description: "How It Works — step 5 title" },
  home_howitworks_5_desc: { value: "It's delivered straight to your doorstep by courier.", category: "home_sections", description: "How It Works — step 5 description" },

  home_fabrics_enabled: { value: "true", category: "home_sections", description: "Show the 'Premium Fabrics' section on the homepage" },
  home_fabrics_eyebrow: { value: "Handpicked Materials", category: "home_sections", description: "Premium Fabrics — small label above the heading" },
  home_fabrics_heading: { value: "Our Premium Fabrics", category: "home_sections", description: "Premium Fabrics — heading" },

  home_kurtas_enabled: { value: "true", category: "home_sections", description: "Show the 'Kurta Collection' section on the homepage" },
  home_kurtas_eyebrow: { value: "Ready When You Are", category: "home_sections", description: "Kurta Collection — small label above the heading" },
  home_kurtas_heading: { value: "Ready-Made Kurta Collection", category: "home_sections", description: "Kurta Collection — heading" },

  home_spotlight_enabled: { value: "true", category: "home_sections", description: "Show the Featured Spotlight section on the homepage" },
  home_spotlight_eyebrow: { value: "Signature Piece", category: "home_sections", description: "Featured Spotlight — small label above the product name (e.g. 'Our Specialty', 'Customer Favorite')" },

  home_trustbar_enabled: { value: "true", category: "home_sections", description: "Show the trust bar strip on the homepage" },
  home_trustbar_1_title: { value: "Free Pickup & Delivery", category: "home_sections", description: "Trust Bar — item 1 title" },
  home_trustbar_1_desc: { value: "All Over India", category: "home_sections", description: "Trust Bar — item 1 description" },
  home_trustbar_2_title: { value: "Premium Quality", category: "home_sections", description: "Trust Bar — item 2 title" },
  home_trustbar_2_desc: { value: "Fabric & Stitching", category: "home_sections", description: "Trust Bar — item 2 description" },
  home_trustbar_3_title: { value: "Perfect Fitting", category: "home_sections", description: "Trust Bar — item 3 title" },
  home_trustbar_3_desc: { value: "Guaranteed", category: "home_sections", description: "Trust Bar — item 3 description" },
  home_trustbar_4_title: { value: "Secure Payment", category: "home_sections", description: "Trust Bar — item 4 title" },
  home_trustbar_4_desc: { value: "100% Safe", category: "home_sections", description: "Trust Bar — item 4 description" },
  home_trustbar_5_title: { value: "Customer Support", category: "home_sections", description: "Trust Bar — item 5 title" },
  home_trustbar_5_desc: { value: "24/7 Available", category: "home_sections", description: "Trust Bar — item 5 description" },
};

const getSiteSettingsCached = unstable_cache(
  async () => {
    try {
      // Uses the service-role client (not createPublicClient) because the
      // "site_settings public read" RLS policy isn't reliably present on
      // every environment — this table has no sensitive data, so bypassing
      // RLS for this read-only, unstable_cache'd fetch is safe.
      const supabase = createAdminClient();
      const { data, error } = await supabase
        .from("site_settings")
        .select("key, value, category, description")
        .order("category", { ascending: true });

      if (error) {
        console.warn("Site settings table not found or error reading, using defaults:", error.message);
        return DEFAULT_SETTINGS;
      }

      const settings = {};
      (data || []).forEach((item) => {
        settings[item.key] = {
          value: item.value,
          category: item.category,
          description: item.description,
        };
      });

      // Backfill any keys that don't have a DB row yet (e.g. newly added
      // settings on an existing install) so they still show up with a
      // sensible default until an admin explicitly saves them.
      Object.entries(DEFAULT_SETTINGS).forEach(([key, meta]) => {
        if (!settings[key]) settings[key] = meta;
      });

      return settings;
    } catch (err) {
      console.warn("Site settings unavailable, using defaults:", err?.message || err);
      return DEFAULT_SETTINGS;
    }
  },
  ["site-settings"],
  { revalidate: 120, tags: ["site-settings"] }
);

export async function getSiteSettings() {
  return getSiteSettingsCached();
}

export async function isCodEnabled() {
  const settings = await getSiteSettings();
  return settings.cod_enabled?.value !== "false";
}

export async function isOnlinePaymentEnabled() {
  const settings = await getSiteSettings();
  return settings.online_payment_enabled?.value !== "false";
}

export async function updateSiteSetting(key, value) {
  try {
    const supabase = createAdminClient();
    const meta = DEFAULT_SETTINGS[key];
    const payload = { key, value, updated_at: new Date().toISOString() };
    if (meta) {
      payload.category = meta.category;
      payload.description = meta.description;
    }

    const { error } = await supabase.from("site_settings").upsert(payload, { onConflict: "key" });

    if (error) throw error;
    revalidateTag("site-settings");
    return { success: true };
  } catch (err) {
    console.error("Update site setting error:", err);
    return { success: false, error: err.message };
  }
}
