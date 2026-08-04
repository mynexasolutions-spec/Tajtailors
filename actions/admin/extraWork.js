"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function getAllExtraWorkAdmin() {
  const supabase = createAdminClient();
  const { data } = await supabase.from("extra_work_options").select("*").order("sort_order", { ascending: true });
  return data || [];
}

// Replaces the whole list in one go (like the product form's variants/FAQs
// editors) — simpler than per-row CRUD for a short admin-managed list, while
// still preserving each row's id so it doesn't shift under a live cart.
export async function saveExtraWorkOptions(options) {
  const supabase = createAdminClient();

  const { data: existing, error: fetchError } = await supabase.from("extra_work_options").select("id");
  if (fetchError) return { error: fetchError.message };
  const existingIds = new Set((existing || []).map((r) => r.id));
  const keepIds = new Set();

  for (let i = 0; i < options.length; i++) {
    const o = options[i];
    if (!o.label || !o.label.trim()) continue;
    const payload = {
      label: o.label.trim(),
      price: Number(o.price) || 0,
      sort_order: i,
      is_active: o.is_active !== false,
    };

    if (o.id && existingIds.has(o.id)) {
      keepIds.add(o.id);
      const { error } = await supabase.from("extra_work_options").update(payload).eq("id", o.id);
      if (error) return { error: error.message };
    } else {
      const { data, error } = await supabase.from("extra_work_options").insert(payload).select("id").single();
      if (error) return { error: error.message };
      keepIds.add(data.id);
    }
  }

  const toDelete = [...existingIds].filter((id) => !keepIds.has(id));
  if (toDelete.length) {
    const { error } = await supabase.from("extra_work_options").delete().in("id", toDelete);
    if (error) return { error: error.message };
  }

  revalidatePath("/admin/extra-work");
  revalidatePath("/shop");
  return { success: true };
}
