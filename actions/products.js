"use server";

// Taj Tailor - Products Actions (Strict Async Exports Only)
import { createClient } from "@/lib/supabase/server";

const LISTING_SELECT = `
  id, name, slug, badge, product_type, fabric_type, color, average_rating, review_count,
  featured_image_url, category_id, is_featured, short_description, garment_type,
  product_images ( image_url, sort_order, variant_name ),
  product_variants ( id, variant_name, price, original_price, stock_quantity, is_active, color_hex )
`;

function withDisplayPrice(product) {
  const activeVariants = (product.product_variants || []).filter((v) => v.is_active);
  const cheapest = activeVariants.sort((a, b) => a.price - b.price)[0];
  const image =
    product.featured_image_url ||
    [...(product.product_images || [])].sort((a, b) => a.sort_order - b.sort_order)[0]?.image_url ||
    null;

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    badge: product.badge,
    isFeatured: product.is_featured,
    shortDescription: product.short_description,
    productType: product.product_type,
    fabricType: product.fabric_type,
    garmentType: product.garment_type,
    color: product.color,
    rating: product.average_rating,
    reviewCount: product.review_count,
    categoryId: product.category_id,
    image,
    price: cheapest?.price ?? null,
    oldPrice: cheapest?.original_price ?? null,
    variantId: cheapest?.id ?? null,
    variantName: cheapest?.variant_name ?? null,
    inStock: activeVariants.some((v) => v.stock_quantity > 0),
  };
}

export async function getProducts(filters = {}) {
  try {
    const supabase = await createClient();
    let query = supabase.from("products").select(LISTING_SELECT).eq("is_active", true);

    if (filters.categoryId) query = query.eq("category_id", filters.categoryId);
    if (filters.productType) query = query.eq("product_type", filters.productType);
    if (filters.garmentType) query = query.eq("garment_type", filters.garmentType);
    if (filters.fabricType) query = query.eq("fabric_type", filters.fabricType);
    if (filters.isFeatured !== undefined) query = query.eq("is_featured", filters.isFeatured);
    if (filters.badgeContains) query = query.ilike("badge", `%${filters.badgeContains}%`);
    if (filters.search) {
      const s = filters.search.trim();
      query = query.or(`name.ilike.%${s}%,short_description.ilike.%${s}%,fabric_type.ilike.%${s}%,color.ilike.%${s}%`);
    }

    query = query.order("is_featured", { ascending: false }).order("created_at", { ascending: false });
    if (filters.limit) query = query.limit(filters.limit);

    const { data, error } = await query;
    if (error) {
      console.error("Fetch products error:", error);
      return [];
    }

    let products = (data || []).map(withDisplayPrice);

    if (filters.minPrice != null) products = products.filter((p) => (p.price ?? 0) >= filters.minPrice);
    if (filters.maxPrice != null) products = products.filter((p) => (p.price ?? 0) <= filters.maxPrice);

    if (filters.sort === "price_asc") products.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    if (filters.sort === "price_desc") products.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    if (filters.sort === "rating") products.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));

    return products;
  } catch (err) {
    console.error("Fetch products error:", err);
    return [];
  }
}

export async function getFeaturedProducts(limit = 4) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select(LISTING_SELECT)
      .eq("is_active", true)
      .eq("is_featured", true)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Fetch featured products error:", error);
      return [];
    }
    return (data || []).map(withDisplayPrice);
  } catch (err) {
    console.error("Fetch featured products error:", err);
    return [];
  }
}

export async function getRelatedProducts(categoryId, excludeId, limit = 4) {
  try {
    const supabase = await createClient();
    let data = null;

    if (categoryId) {
      const res = await supabase
        .from("products")
        .select(LISTING_SELECT)
        .eq("is_active", true)
        .eq("category_id", categoryId)
        .neq("id", excludeId)
        .limit(limit);
      data = res.data;
    }

    // No category, or nothing else in that category — widen to any other
    // real product instead of falling back to demo data.
    if (!data || data.length === 0) {
      const res = await supabase
        .from("products")
        .select(LISTING_SELECT)
        .eq("is_active", true)
        .neq("id", excludeId)
        .order("created_at", { ascending: false })
        .limit(limit);
      data = res.data;
    }

    return (data || []).map(withDisplayPrice);
  } catch (err) {
    console.error("Fetch related products error:", err);
    return [];
  }
}

export async function getProductBySlug(slug) {
  try {
    const supabase = await createClient();
    const { data: product, error } = await supabase
      .from("products")
      .select(`
        id, name, slug, category_id, is_active, badge, product_type, fabric_type, fabric_type_description, color, color_description,
        average_rating, review_count, short_description, description, featured_image_url,
        fabric_meters_required, garment_type,
        product_images ( id, image_url, sort_order, variant_name, color_name ),
        product_variants ( id, variant_name, price, original_price, stock_quantity, is_active, color_hex, color_name, size_name ),
        product_faqs ( id, question, answer, display_order )
      `)
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      console.error("Fetch product by slug error:", error);
      return null;
    }

    if (product && product.is_active) {
      const [categoryResult, reviewsResult, userResult] = await Promise.all([
        product.category_id
          ? supabase.from("categories").select("name, variant_label").eq("id", product.category_id).maybeSingle()
          : Promise.resolve({ data: null }),
        supabase
          .from("reviews")
          .select("id, rating, review_text, created_at, profiles ( full_name )")
          .eq("product_id", product.id)
          .eq("is_approved", true)
          .order("created_at", { ascending: false }),
        supabase.auth.getUser(),
      ]);

      const categoryName = categoryResult.data?.name || null;
      const variantLabel = categoryResult.data?.variant_label || "Variant";
      const reviews = reviewsResult.data;

      // A logged-in user's own review for this product (approved or still
      // pending) — used to show it back to them instead of a blank form.
      let myReview = null;
      const user = userResult.data?.user;
      if (user) {
        const { data } = await supabase
          .from("reviews")
          .select("id, rating, review_text, is_approved")
          .eq("product_id", product.id)
          .eq("user_id", user.id)
          .maybeSingle();
        myReview = data || null;
      }

      const images = (product.product_images || []).slice().sort((a, b) => a.sort_order - b.sort_order);
      if (images.length === 0 && product.featured_image_url) {
        images.push({ id: "featured", image_url: product.featured_image_url });
      }

      const faqs = (product.product_faqs || []).slice().sort((a, b) => a.display_order - b.display_order);
      const variants = (product.product_variants || [])
        .filter((v) => v.is_active)
        .sort((a, b) => a.price - b.price);

      // The signed-in user's own review is already shown separately via
      // `myReview` (as "Your Review"), so drop it here to avoid a duplicate.
      const otherReviews = (reviews || []).filter((r) => r.id !== myReview?.id);

      return {
        ...product,
        categoryName,
        variantLabel,
        images,
        faqs,
        variants,
        reviews: otherReviews,
        myReview,
      };
    }

    return null;
  } catch (err) {
    console.error("Fetch product by slug error:", err);
    return null;
  }
}

// "What can be made from this fabric" / "which fabrics work for this outfit" —
// driven by the admin-managed product_fabric_links mapping.
export async function getCompatibleOutfits(fabricProductId) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("product_fabric_links")
      .select(`outfit:products!outfit_product_id ( ${LISTING_SELECT}, is_active )`)
      .eq("fabric_product_id", fabricProductId);

    if (error) {
      console.error("Fetch compatible outfits error:", error);
      return [];
    }

    return (data || [])
      .map((row) => row.outfit)
      .filter((p) => p && p.is_active)
      .map(withDisplayPrice);
  } catch (err) {
    console.error("Fetch compatible outfits error:", err);
    return [];
  }
}

// Returns fabrics with their full color-variant list (not just the cheapest
// variant) so the outfit configurator can offer a color choice per fabric —
// one fabric can come in several colors, each with its own price/stock/photo.
export async function getCompatibleFabrics(outfitProductId) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("product_fabric_links")
      .select(`
        fabric:products!fabric_product_id (
          id, name, slug, fabric_type, featured_image_url, is_active,
          product_variants ( id, variant_name, price, stock_quantity, is_active, color_hex ),
          product_images ( image_url, variant_name )
        )
      `)
      .eq("outfit_product_id", outfitProductId);

    if (error) {
      console.error("Fetch compatible fabrics error:", error);
      return [];
    }

    return (data || [])
      .map((row) => row.fabric)
      .filter((p) => p && p.is_active)
      .map((p) => {
        const images = p.product_images || [];
        const variants = (p.product_variants || [])
          .filter((v) => v.is_active)
          .sort((a, b) => a.price - b.price)
          .map((v) => ({
            id: v.id,
            name: v.variant_name,
            price: v.price,
            stockQuantity: v.stock_quantity,
            colorHex: v.color_hex,
            image: images.find((img) => img.variant_name === v.variant_name)?.image_url || p.featured_image_url || null,
          }));

        return {
          id: p.id,
          name: p.name,
          slug: p.slug,
          fabricType: p.fabric_type,
          image: p.featured_image_url,
          variants,
        };
      })
      .filter((p) => p.variants.length > 0);
  } catch (err) {
    console.error("Fetch compatible fabrics error:", err);
    return [];
  }
}

// Admin-managed extra work add-ons (Karigari, Zari Buttons...) with their
// own admin-set price — only the ones the admin mapped to this specific
// outfit product show up, same pattern as compatible fabrics.
export async function getExtraWorkOptions(productId) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("product_extra_work_links")
      .select("extra_work_option:extra_work_options ( id, label, price, is_active, sort_order )")
      .eq("product_id", productId);

    if (error) {
      console.error("Fetch extra work options error:", error);
      return [];
    }

    return (data || [])
      .map((row) => row.extra_work_option)
      .filter((o) => o && o.is_active)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(({ id, label, price }) => ({ id, label, price }));
  } catch (err) {
    console.error("Fetch extra work options error:", err);
    return [];
  }
}

// Admin-managed garment families (Kurta, Pajama, Trouser, custom ones...) —
// lets the outfit configurator resolve a product's garment_type to a display
// label and a measurement field set without hardcoding either in code.
export async function getGarmentTypes() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("garment_types")
      .select("key, label, measurement_kind, image_url, style_options, fields")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Fetch garment types error:", error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error("Fetch garment types error:", err);
    return [];
  }
}
