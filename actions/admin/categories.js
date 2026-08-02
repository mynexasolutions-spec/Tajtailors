"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function getAllCategoriesAdmin() {
  const supabase = createAdminClient();
  const [{ data: categories }, { data: products }] = await Promise.all([
    supabase.from("categories").select("*").order("sort_order", { ascending: true }),
    supabase.from("products").select("category_id"),
  ]);

  const counts = {};
  for (const p of products || []) {
    if (p.category_id) counts[p.category_id] = (counts[p.category_id] || 0) + 1;
  }

  return (categories || []).map((c) => ({ ...c, product_count: counts[c.id] || 0 }));
}

export async function getCategoryById(id) {
  const supabase = createAdminClient();
  const { data } = await supabase.from("categories").select("*").eq("id", id).maybeSingle();
  return data;
}

export async function createCategory(_prevState, formData) {
  const supabase = createAdminClient();
  const name = formData.get("name");
  if (!name) return { error: "Name is required." };

  const { error } = await supabase.from("categories").insert({
    name,
    slug: slugify(name),
    description: formData.get("description") || null,
    image_url: formData.get("image_url") || null,
    sort_order: Number(formData.get("sort_order") || 0),
    is_active: formData.get("is_active") === "on",
  });

  if (error) return { error: error.message };
  revalidatePath("/admin/categories");
  revalidatePath("/shop");
  revalidateTag("categories");
  redirect("/admin/categories");
}

export async function updateCategory(_prevState, formData) {
  const supabase = createAdminClient();
  const id = formData.get("id");
  const name = formData.get("name");
  if (!id || !name) return { error: "Name is required." };

  const { error } = await supabase
    .from("categories")
    .update({
      name,
      slug: slugify(name),
      description: formData.get("description") || null,
      image_url: formData.get("image_url") || null,
      sort_order: Number(formData.get("sort_order") || 0),
      is_active: formData.get("is_active") === "on",
    })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/categories");
  revalidatePath("/shop");
  revalidateTag("categories");
  redirect("/admin/categories");
}

export async function deleteCategory(id) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/categories");
  revalidatePath("/shop");
  revalidateTag("categories");
  return { success: true };
}
