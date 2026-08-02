"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath, revalidateTag } from "next/cache";

export async function getAllHeroSlides() {
  const supabase = createAdminClient();
  const { data } = await supabase.from("hero_slides").select("*").order("display_order", { ascending: true });
  return data || [];
}

export async function createHeroSlide(slide) {
  const supabase = createAdminClient();
  if (!slide.image_url) return { success: false, error: "An image is required." };

  const { data: existing } = await supabase.from("hero_slides").select("display_order").order("display_order", { ascending: false }).limit(1);
  const nextOrder = existing?.[0] ? existing[0].display_order + 1 : 0;

  const { error } = await supabase.from("hero_slides").insert({
    image_url: slide.image_url,
    title: slide.title || null,
    subtitle: slide.subtitle || null,
    button_text: slide.button_text || null,
    button_link: slide.button_link || null,
    display_order: nextOrder,
  });

  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/hero-slides");
  revalidatePath("/");
  revalidateTag("hero-slides");
  return { success: true };
}

export async function updateHeroSlide(id, slide) {
  const supabase = createAdminClient();
  if (!slide.image_url) return { success: false, error: "An image is required." };

  const { error } = await supabase
    .from("hero_slides")
    .update({
      image_url: slide.image_url,
      title: slide.title || null,
      subtitle: slide.subtitle || null,
      button_text: slide.button_text || null,
      button_link: slide.button_link || null,
    })
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/hero-slides");
  revalidatePath("/");
  revalidateTag("hero-slides");
  return { success: true };
}

export async function toggleHeroSlide(id, isActive) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("hero_slides").update({ is_active: isActive }).eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/hero-slides");
  revalidatePath("/");
  revalidateTag("hero-slides");
  return { success: true };
}

export async function deleteHeroSlide(id) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("hero_slides").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/hero-slides");
  revalidatePath("/");
  revalidateTag("hero-slides");
  return { success: true };
}
