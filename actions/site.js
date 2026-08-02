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
