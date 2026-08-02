"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function getAllReviewsAdmin() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("reviews")
    .select("id, rating, review_text, is_approved, created_at, products ( name ), profiles ( full_name, email )")
    .order("created_at", { ascending: false });

  return data || [];
}

async function recomputeProductRating(supabase, productId) {
  const { data: approved } = await supabase
    .from("reviews")
    .select("rating")
    .eq("product_id", productId)
    .eq("is_approved", true);

  const count = approved?.length || 0;
  const average = count > 0 ? approved.reduce((sum, r) => sum + r.rating, 0) / count : 0;

  await supabase
    .from("products")
    .update({ average_rating: Math.round(average * 10) / 10, review_count: count })
    .eq("id", productId);
}

export async function approveReview(reviewId) {
  const supabase = createAdminClient();
  const { data: review } = await supabase.from("reviews").select("product_id").eq("id", reviewId).maybeSingle();
  if (!review) return { success: false, error: "Review not found." };

  const { error } = await supabase.from("reviews").update({ is_approved: true }).eq("id", reviewId);
  if (error) return { success: false, error: error.message };

  await recomputeProductRating(supabase, review.product_id);
  revalidatePath("/admin/reviews");
  revalidatePath("/shop");
  return { success: true };
}

export async function deleteReview(reviewId) {
  const supabase = createAdminClient();
  const { data: review } = await supabase.from("reviews").select("product_id, is_approved").eq("id", reviewId).maybeSingle();
  if (!review) return { success: false, error: "Review not found." };

  const { error } = await supabase.from("reviews").delete().eq("id", reviewId);
  if (error) return { success: false, error: error.message };

  if (review.is_approved) await recomputeProductRating(supabase, review.product_id);
  revalidatePath("/admin/reviews");
  revalidatePath("/shop");
  return { success: true };
}
