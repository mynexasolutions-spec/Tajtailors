"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { validateVariants } from "@/lib/productValidation";

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function getAllProductsAdmin() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("products")
    .select("id, name, slug, is_active, is_featured, featured_image_url, categories ( name ), product_variants ( price, stock_quantity )")
    .order("created_at", { ascending: false });

  return (data || []).map((p) => ({
    ...p,
    categoryName: p.categories?.name,
    minPrice: p.product_variants?.length ? Math.min(...p.product_variants.map((v) => v.price)) : null,
    totalStock: (p.product_variants || []).reduce((sum, v) => sum + v.stock_quantity, 0),
  }));
}

export async function getProductForEdit(id) {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("products")
    .select(`
      *,
      product_images ( id, image_url, sort_order, variant_name ),
      product_variants ( id, variant_name, price, original_price, stock_quantity, is_active, color_hex ),
      product_faqs ( id, question, answer, display_order )
    `)
    .eq("id", id)
    .maybeSingle();

  if (data?.product_type === "outfit") {
    const { data: links } = await supabase
      .from("product_fabric_links")
      .select("fabric_product_id")
      .eq("outfit_product_id", id);
    data.fabricLinkIds = (links || []).map((l) => l.fabric_product_id);
  }

  return data;
}

export async function getAllFabricsAdmin() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("products")
    .select("id, name")
    .eq("product_type", "fabric")
    .eq("is_active", true)
    .order("name", { ascending: true });
  return data || [];
}

async function syncFabricLinks(supabase, outfitProductId, fabricIds) {
  await supabase.from("product_fabric_links").delete().eq("outfit_product_id", outfitProductId);
  if (fabricIds?.length) {
    await supabase.from("product_fabric_links").insert(
      fabricIds.map((fabricId) => ({ outfit_product_id: outfitProductId, fabric_product_id: fabricId }))
    );
  }
}

async function syncChildren(supabase, productId, { images, variants, faqs }) {
  await supabase.from("product_images").delete().eq("product_id", productId);
  if (images?.length) {
    await supabase.from("product_images").insert(
      images.map((img, i) => ({
        product_id: productId,
        image_url: img.url,
        variant_name: img.size || null,
        sort_order: i,
      }))
    );
  }

  await supabase.from("product_variants").delete().eq("product_id", productId);
  if (variants?.length) {
    await supabase.from("product_variants").insert(
      variants.map((v) => ({
        product_id: productId,
        variant_name: v.variant_name,
        price: Number(v.price),
        original_price: v.original_price ? Number(v.original_price) : null,
        stock_quantity: Number(v.stock_quantity || 0),
        color_hex: v.color_hex || null,
        is_active: true,
      }))
    );
  }

  await supabase.from("product_faqs").delete().eq("product_id", productId);
  if (faqs?.length) {
    await supabase.from("product_faqs").insert(
      faqs.map((f, i) => ({ product_id: productId, question: f.question, answer: f.answer, display_order: i }))
    );
  }
}

function parseProductFields(formData) {
  const fabricMeters = formData.get("fabric_meters_required");
  return {
    name: formData.get("name"),
    category_id: formData.get("category_id") || null,
    short_description: formData.get("short_description") || null,
    description: formData.get("description") || null,
    product_type: formData.get("product_type") || "kurta",
    fabric_type: formData.get("fabric_type") || null,
    color: formData.get("color") || null,
    fabric_meters_required: fabricMeters ? Number(fabricMeters) : null,
    garment_type: formData.get("garment_type") || null,
    badge: formData.get("badge") || null,
    featured_image_url: formData.get("featured_image_url") || null,
    seo_title: formData.get("seo_title") || null,
    seo_description: formData.get("seo_description") || null,
    is_active: formData.get("is_active") === "on",
    is_featured: formData.get("is_featured") === "on",
  };
}

function parseJsonField(formData, key) {
  try {
    return JSON.parse(formData.get(key) || "[]");
  } catch {
    return [];
  }
}

export async function createProduct(_prevState, formData) {
  const supabase = createAdminClient();
  const fields = parseProductFields(formData);
  if (!fields.name) return { error: "Product name is required." };

  const variants = parseJsonField(formData, "variants");
  const variantsError = validateVariants(variants);
  if (variantsError) return { error: variantsError };

  const { data: product, error } = await supabase
    .from("products")
    .insert({ ...fields, slug: slugify(fields.name) })
    .select("id")
    .single();

  if (error || !product) return { error: error?.message || "Failed to create product." };

  await syncChildren(supabase, product.id, {
    images: parseJsonField(formData, "images"),
    variants,
    faqs: parseJsonField(formData, "faqs"),
  });
  if (fields.product_type === "outfit") {
    await syncFabricLinks(supabase, product.id, parseJsonField(formData, "fabric_links"));
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  redirect("/admin/products");
}

export async function updateProduct(_prevState, formData) {
  const supabase = createAdminClient();
  const id = formData.get("id");
  const fields = parseProductFields(formData);
  if (!id || !fields.name) return { error: "Product name is required." };

  const variants = parseJsonField(formData, "variants");
  const variantsError = validateVariants(variants);
  if (variantsError) return { error: variantsError };

  const { error } = await supabase
    .from("products")
    .update({ ...fields, slug: slugify(fields.name), updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { error: error.message };

  await syncChildren(supabase, id, {
    images: parseJsonField(formData, "images"),
    variants,
    faqs: parseJsonField(formData, "faqs"),
  });
  if (fields.product_type === "outfit") {
    await syncFabricLinks(supabase, id, parseJsonField(formData, "fabric_links"));
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  redirect("/admin/products");
}

export async function deleteProduct(id) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  return { success: true };
}
