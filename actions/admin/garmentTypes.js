"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/(^_|_$)/g, "");
}

const MEASUREMENT_KINDS = ["kurta", "pajama", "pant", "kurta_pajama_set", "kurta_pant_set", "custom"];

function parseJsonField(formData, key) {
  try {
    return JSON.parse(formData.get(key) || "[]");
  } catch {
    return [];
  }
}

export async function getAllGarmentTypesAdmin() {
  const supabase = createAdminClient();
  const [{ data: garmentTypes }, { data: products }] = await Promise.all([
    supabase.from("garment_types").select("*").order("sort_order", { ascending: true }),
    supabase.from("products").select("garment_type").eq("product_type", "outfit"),
  ]);

  const counts = {};
  for (const p of products || []) {
    if (p.garment_type) counts[p.garment_type] = (counts[p.garment_type] || 0) + 1;
  }

  return (garmentTypes || []).map((g) => ({ ...g, product_count: counts[g.key] || 0 }));
}

export async function getGarmentTypeById(id) {
  const supabase = createAdminClient();
  const { data } = await supabase.from("garment_types").select("*").eq("id", id).maybeSingle();
  return data;
}

export async function createGarmentType(_prevState, formData) {
  const supabase = createAdminClient();
  const label = formData.get("label");
  if (!label) return { error: "Label is required." };

  const measurementKind = formData.get("measurement_kind") || "custom";
  if (!MEASUREMENT_KINDS.includes(measurementKind)) return { error: "Invalid measurement kind." };

  const { error } = await supabase.from("garment_types").insert({
    key: slugify(label),
    label,
    measurement_kind: measurementKind,
    image_url: formData.get("image_url") || null,
    fields: parseJsonField(formData, "fields"),
    sort_order: Number(formData.get("sort_order") || 0),
    is_active: formData.get("is_active") === "on",
  });

  if (error) return { error: error.code === "23505" ? "A garment type with this name already exists." : error.message };
  revalidatePath("/admin/garment-types");
  revalidatePath("/shop");
  revalidateTag("garment_types");
  redirect("/admin/garment-types");
}

export async function updateGarmentType(_prevState, formData) {
  const supabase = createAdminClient();
  const id = formData.get("id");
  const label = formData.get("label");
  if (!id || !label) return { error: "Label is required." };

  const measurementKind = formData.get("measurement_kind") || "custom";
  if (!MEASUREMENT_KINDS.includes(measurementKind)) return { error: "Invalid measurement kind." };

  const { error } = await supabase
    .from("garment_types")
    .update({
      label,
      measurement_kind: measurementKind,
      image_url: formData.get("image_url") || null,
      fields: parseJsonField(formData, "fields"),
      sort_order: Number(formData.get("sort_order") || 0),
      is_active: formData.get("is_active") === "on",
    })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/garment-types");
  revalidatePath("/shop");
  revalidateTag("garment_types");
  redirect("/admin/garment-types");
}

export async function deleteGarmentType(id) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("garment_types").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/garment-types");
  revalidatePath("/shop");
  revalidateTag("garment_types");
  return { success: true };
}
