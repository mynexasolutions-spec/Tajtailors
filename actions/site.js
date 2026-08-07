"use server";

import { unstable_cache } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";

const getActiveAnnouncementCached = unstable_cache(
  async () => {
    try {
      const supabase = createPublicClient();
      const { data } = await supabase
        .from("announcements")
        .select("message")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      return data?.message || null;
    } catch (err) {
      console.warn("Announcement unavailable:", err?.message || err);
      return null;
    }
  },
  ["active-announcement"],
  { revalidate: 120, tags: ["announcements"] }
);

const getActiveHeroSlidesCached = unstable_cache(
  async () => {
    try {
      const supabase = createPublicClient();
      const { data } = await supabase
        .from("hero_slides")
        .select("id, image_url, title, subtitle, button_text, button_link")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      return data || [];
    } catch (err) {
      console.warn("Hero slides unavailable:", err?.message || err);
      return [];
    }
  },
  ["active-hero-slides"],
  { revalidate: 120, tags: ["hero-slides"] }
);

const getActiveTestimonialsCached = unstable_cache(
  async () => {
    try {
      const supabase = createPublicClient();
      const { data } = await supabase
        .from("testimonials")
        .select("id, customer_name, location, review_text, rating, image_url")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      return data || [];
    } catch (err) {
      console.warn("Testimonials unavailable:", err?.message || err);
      return [];
    }
  },
  ["active-testimonials"],
  { revalidate: 120, tags: ["testimonials"] }
);

export async function getActiveAnnouncement() {
  return getActiveAnnouncementCached();
}

export async function getActiveHeroSlides() {
  return getActiveHeroSlidesCached();
}

export async function getActiveTestimonials() {
  return getActiveTestimonialsCached();
}

export async function getFeaturedGarmentTypes() {
  try {
    const supabase = createPublicClient();
    const [{ data: garmentTypes }, { data: products }] = await Promise.all([
      supabase
        .from("garment_types")
        .select("id, key, label, image_url, fields, style_options")
        .eq("is_active", true)
        .eq("is_featured", true)
        .order("sort_order", { ascending: true }),
      supabase
        .from("products")
        .select("garment_type")
        .eq("product_type", "outfit")
        .eq("is_active", true)
    ]);

    const counts = {};
    for (const p of products || []) {
      if (p.garment_type) counts[p.garment_type] = (counts[p.garment_type] || 0) + 1;
    }

    return (garmentTypes || []).map((g) => ({
      ...g,
      product_count: counts[g.key] || 0
    }));
  } catch (err) {
    console.warn("Featured garment types unavailable:", err?.message || err);
    return [];
  }
}
