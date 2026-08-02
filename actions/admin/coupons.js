"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function getAllCoupons() {
  const supabase = createAdminClient();
  const { data } = await supabase.from("coupons").select("*").order("created_at", { ascending: false });
  return data || [];
}

export async function createCoupon(_prevState, formData) {
  const supabase = createAdminClient();
  const code = formData.get("code")?.trim().toUpperCase();
  const type = formData.get("type");
  const value = Number(formData.get("value"));

  if (!code || !value) return { error: "Code and value are required." };

  const { error } = await supabase.from("coupons").insert({
    code,
    type,
    value,
    min_purchase: Number(formData.get("min_purchase") || 0),
    expires_at: formData.get("expires_at") || null,
    is_active: true,
  });

  if (error) return { error: error.message.includes("duplicate") ? "This coupon code already exists." : error.message };
  revalidatePath("/admin/settings/coupons");
  return { success: true };
}

export async function toggleCoupon(id, isActive) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("coupons").update({ is_active: isActive }).eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/settings/coupons");
  return { success: true };
}

export async function deleteCoupon(id) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("coupons").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/settings/coupons");
  return { success: true };
}
