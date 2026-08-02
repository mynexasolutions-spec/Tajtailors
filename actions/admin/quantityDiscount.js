"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { QUANTITY_DISCOUNT_DEFAULTS } from "@/lib/constants";

export async function getQuantityDiscountSettings() {
  try {
    const supabase = createAdminClient();
    const { data } = await supabase.from("settings").select("quantity_discount").eq("id", 1).maybeSingle();
    return data?.quantity_discount || QUANTITY_DISCOUNT_DEFAULTS;
  } catch (err) {
    console.warn("Quantity discount settings unavailable, using defaults:", err?.message || err);
    return QUANTITY_DISCOUNT_DEFAULTS;
  }
}

export async function updateQuantityDiscountSettings(_prevState, formData) {
  const supabase = createAdminClient();

  const enabled = formData.get("enabled") === "on";
  let tiers;
  try {
    tiers = JSON.parse(formData.get("tiers") || "[]");
  } catch {
    return { error: "Invalid tier data." };
  }

  tiers = tiers
    .map((t) => ({ min_quantity: Number(t.min_quantity), discount: Number(t.discount) }))
    .filter((t) => Number.isFinite(t.min_quantity) && t.min_quantity > 0 && Number.isFinite(t.discount) && t.discount >= 0);

  if (tiers.length === 0) {
    return { error: "Add at least one valid tier." };
  }

  const quantity_discount = { enabled, tiers };

  const { error } = await supabase.from("settings").update({ quantity_discount }).eq("id", 1);
  if (error) return { error: error.message };

  revalidatePath("/admin/settings/quantity-discount");
  revalidatePath("/cart");
  revalidatePath("/checkout");
  return { success: true };
}
