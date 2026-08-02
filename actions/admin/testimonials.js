"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath, revalidateTag } from "next/cache";

export async function getAllTestimonials() {
  const supabase = createAdminClient();
  const { data } = await supabase.from("testimonials").select("*").order("display_order", { ascending: true });
  return data || [];
}

export async function createTestimonial(testimonial) {
  const supabase = createAdminClient();
  if (!testimonial.customer_name || !testimonial.review_text) {
    return { success: false, error: "Customer name and review text are required." };
  }

  const { data: existing } = await supabase
    .from("testimonials")
    .select("id")
    .order("display_order", { ascending: false })
    .limit(1);
  const nextOrder = existing?.[0] ? existing[0].display_order + 1 : 0;

  const { error } = await supabase.from("testimonials").insert({
    customer_name: testimonial.customer_name,
    location: testimonial.location || null,
    review_text: testimonial.review_text,
    rating: testimonial.rating || 5,
    image_url: testimonial.image_url || null,
    display_order: nextOrder,
  });

  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  revalidateTag("testimonials");
  return { success: true };
}

export async function updateTestimonial(id, testimonial) {
  const supabase = createAdminClient();
  if (!testimonial.customer_name || !testimonial.review_text) {
    return { success: false, error: "Customer name and review text are required." };
  }

  const { error } = await supabase
    .from("testimonials")
    .update({
      customer_name: testimonial.customer_name,
      location: testimonial.location || null,
      review_text: testimonial.review_text,
      rating: testimonial.rating || 5,
      image_url: testimonial.image_url || null,
    })
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  revalidateTag("testimonials");
  return { success: true };
}

export async function toggleTestimonial(id, isActive) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("testimonials").update({ is_active: isActive }).eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  revalidateTag("testimonials");
  return { success: true };
}

export async function deleteTestimonial(id) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  revalidateTag("testimonials");
  return { success: true };
}
