"use server";

import { unstable_cache } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";

const FALLBACK_CATEGORIES = [
  { id: "cat-fabrics", name: "Fabrics", slug: "fabrics", description: "Premium fabrics sold by the meter.", image_url: null },
  { id: "cat-kurtas", name: "Ready-Made Kurtas", slug: "ready-made-kurtas", description: "Ready-to-wear kurtas in standard sizes.", image_url: null },
];

const getActiveCategoriesCached = unstable_cache(
  async () => {
    try {
      const supabase = createPublicClient();
      const { data } = await supabase
        .from("categories")
        .select("id, name, slug, description, image_url")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      return data && data.length > 0 ? data : FALLBACK_CATEGORIES;
    } catch (err) {
      console.warn("Categories unavailable, using fallback:", err?.message || err);
      return FALLBACK_CATEGORIES;
    }
  },
  ["active-categories"],
  { revalidate: 120, tags: ["categories"] }
);

export async function getActiveCategories() {
  return getActiveCategoriesCached();
}
