"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function submitReview(productId, rating, reviewText) {
  if (!rating || rating < 1 || rating > 5) {
    return { success: false, error: "Please choose a rating between 1 and 5." };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Please log in to leave a review.", requiresLogin: true };
    }

    const { data: existing } = await supabase
      .from("reviews")
      .select("id")
      .eq("product_id", productId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing) {
      return { success: false, error: "You've already reviewed this product.", alreadyReviewed: true };
    }

    const { error } = await supabase.from("reviews").insert({
      product_id: productId,
      user_id: user.id,
      rating,
      review_text: reviewText || null,
      is_approved: false,
    });

    if (error) return { success: false, error: error.message };
  } catch (err) {
    console.warn("Review submission unavailable:", err?.message || err);
    return { success: false, error: "Reviews are temporarily unavailable. Please try again shortly." };
  }

  revalidatePath(`/shop`);
  return { success: true };
}
