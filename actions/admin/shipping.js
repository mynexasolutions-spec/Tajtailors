"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { SHIPPING_DEFAULTS } from "@/lib/constants";

export async function getShippingSettings() {
  const supabase = createAdminClient();
  const { data } = await supabase.from("settings").select("shipping").eq("id", 1).maybeSingle();
  return data?.shipping || SHIPPING_DEFAULTS;
}

export async function updateShippingSettings(_prevState, formData) {
  const supabase = createAdminClient();
  const shipping = {
    flat_rate: Number(formData.get("flat_rate") || 0),
    free_threshold: Number(formData.get("free_threshold") || 0),
    cod_charge: Number(formData.get("cod_charge") || 0),
  };

  const { error } = await supabase.from("settings").update({ shipping }).eq("id", 1);
  if (error) return { error: error.message };

  revalidatePath("/admin/settings/shipping");
  revalidatePath("/checkout");
  return { success: true };
}
