"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Save } from "lucide-react";
import { createProduct, updateProduct } from "@/actions/admin/products";
import ImageUploader from "@/components/admin/ImageUploader";
import VariantsEditor from "./VariantsEditor";
import SizeImageMapper from "./SizeImageMapper";
import FaqsEditor from "./FaqsEditor";
import { validateVariants } from "@/lib/productValidation";

const PRODUCT_TYPES = [
  { value: "fabric", label: "Fabric" },
  { value: "kurta", label: "Ready-Made Kurta" },
  { value: "outfit", label: "Outfit (stitching service)" },
];

const VARIANT_LABELS = { fabric: "Color", kurta: "Size", outfit: "Variant" };

const inputClass =
  "w-full rounded-2xl border border-ink/10 bg-ivory-deep px-5 py-3.5 text-sm text-ink placeholder:text-ink/30 transition-all duration-500 focus:border-gold-400/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold-400/20 hover:border-gold-400/30";
const labelClass = "mb-2 block text-xs font-semibold uppercase tracking-widest text-gold-600/90";
const panelClass =
  "relative rounded-[2.5rem] border border-gold-400/20 bg-white p-6 sm:p-8 space-y-5 shadow-xl";


export default function ProductForm({ product, categories, fabricOptions = [] }) {
  const isEditing = !!product;
  const action = isEditing ? updateProduct : createProduct;
  const [state, formAction, pending] = useActionState(action, {});
  const [isActive, setIsActive] = useState(product?.is_active ?? true);
  const [isFeatured, setIsFeatured] = useState(product?.is_featured ?? false);
  const [productType, setProductType] = useState(product?.product_type || "fabric");
  const [fabricLinkIds, setFabricLinkIds] = useState(product?.fabricLinkIds || []);

  const toggleFabricLink = (id) => {
    setFabricLinkIds((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  };

  const [featuredImage, setFeaturedImage] = useState(product?.featured_image_url || null);
  const [gallery, setGallery] = useState(
    (product?.product_images || [])
      .slice()
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((i) => ({ url: i.image_url, size: i.variant_name || null }))
  );
  const [variants, setVariants] = useState(
    product?.product_variants?.length
      ? product.product_variants.map((v) => ({ ...v, price: String(v.price), original_price: v.original_price ? String(v.original_price) : "", stock_quantity: String(v.stock_quantity) }))
      : [{ variant_name: "", price: "", original_price: "", stock_quantity: "" }]
  );
  const [faqs, setFaqs] = useState(product?.product_faqs?.map((f) => ({ question: f.question, answer: f.answer })) || []);
  const [showVariantErrors, setShowVariantErrors] = useState(false);
  const variantError = showVariantErrors ? validateVariants(variants) : null;

  const handleSubmit = (e) => {
    if (validateVariants(variants)) {
      e.preventDefault();
      setShowVariantErrors(true);
      document.getElementById("variants-section")?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <form action={formAction} onSubmit={handleSubmit} className="space-y-6">
      {isEditing && <input type="hidden" name="id" value={product.id} />}
      <input type="hidden" name="featured_image_url" value={featuredImage || ""} />
      <input type="hidden" name="images" value={JSON.stringify(gallery)} />
      <input type="hidden" name="variants" value={JSON.stringify(variants)} />
      <input type="hidden" name="faqs" value={JSON.stringify(faqs)} />
      <input type="hidden" name="fabric_links" value={JSON.stringify(fabricLinkIds)} />
      <input type="hidden" name="is_active" value={isActive ? "on" : "off"} />
      <input type="hidden" name="is_featured" value={isFeatured ? "on" : "off"} />

      {(variantError || state.error) && (
        <div className="flex items-center gap-2 rounded-2xl border border-red-500/25 bg-red-500/10 p-4 text-sm text-red-300">
          <span className="h-2 w-2 rounded-full bg-red-400 animate-pulse shrink-0" />
          {variantError || state.error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className={panelClass}>
            <h2 className="font-display text-base text-ink">Basic Information</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Product Name</label>
                <input required name="name" defaultValue={product?.name} placeholder="e.g. Egyptian Cotton" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Category</label>
                <select name="category_id" defaultValue={product?.category_id || ""} className={inputClass}>
                  <option value="">Select a category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Product Type</label>
                <select
                  name="product_type"
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  className={inputClass}
                >
                  {PRODUCT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>

              {productType === "fabric" && (
                <div>
                  <label className={labelClass}>Fabric Type</label>
                  <input name="fabric_type" defaultValue={product?.fabric_type} placeholder="e.g. Cotton, Linen, Boski" className={inputClass} />
                </div>
              )}

              {productType === "kurta" && (
                <div>
                  <label className={labelClass}>Color</label>
                  <input name="color" defaultValue={product?.color} placeholder="e.g. Black, White, Navy Blue" className={inputClass} />
                </div>
              )}

              {productType === "outfit" && (
                <div>
                  <label className={labelClass}>Fabric Needed (meters)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="fabric_meters_required"
                    defaultValue={product?.fabric_meters_required || ""}
                    placeholder="e.g. 2.5"
                    className={inputClass}
                  />
                </div>
              )}

              {productType === "outfit" && (
                <div>
                  <label className={labelClass}>Garment Type</label>
                  <select name="garment_type" defaultValue={product?.garment_type || ""} className={inputClass}>
                    <option value="">Select garment type</option>
                    <option value="kurta">Kurta</option>
                    <option value="pajama">Pajama</option>
                    <option value="pant">Pant</option>
                    <option value="kurta_pajama_set">Kurta + Pajama Set</option>
                    <option value="kurta_pant_set">Kurta + Pant Set</option>
                  </select>
                  <p className="mt-1.5 text-xs text-ink/40">Determines which measurement fields customers fill in on the product page.</p>
                </div>
              )}
            </div>

            <div>
              <label className={labelClass}>Short Description</label>
              <textarea name="short_description" rows={2} defaultValue={product?.short_description} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Full Description</label>
              <textarea name="description" rows={8} defaultValue={product?.description} className={inputClass} />
            </div>
          </div>

          {productType === "outfit" && (
            <div className={panelClass}>
              <h2 className="font-display text-base text-ink">Compatible Fabrics</h2>
              <p className="text-sm text-ink/45">Pick which fabrics can be used to stitch this outfit. Customers will only see these as options.</p>
              {fabricOptions.length === 0 ? (
                <p className="text-sm text-ink/45">No fabric products yet — add fabrics first, then come back to map them here.</p>
              ) : (
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {fabricOptions.map((f) => (
                    <label
                      key={f.id}
                      className={`flex items-center gap-2.5 rounded-xl border px-4 py-2.5 text-sm transition-colors ${
                        fabricLinkIds.includes(f.id) ? "border-gold-400/40 bg-gold-400/10 text-gold-700" : "border-ink/10 bg-ivory-deep text-ink/60"
                      }`}
                    >
                      <input type="checkbox" checked={fabricLinkIds.includes(f.id)} onChange={() => toggleFabricLink(f.id)} />
                      {f.name}
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          <div id="variants-section" className={panelClass}>
            <h2 className="font-display text-base text-ink">{VARIANT_LABELS[productType]}s &amp; Pricing</h2>
            {productType === "fabric" && (
              <p className="text-sm text-ink/45 -mt-3">
                Add one variant per color this fabric comes in (e.g. "Red", "Navy Blue") — each can have its own price and stock (in meters).
              </p>
            )}
            <VariantsEditor variants={variants} onChange={setVariants} showErrors={showVariantErrors} label={VARIANT_LABELS[productType]} />
          </div>

          <div className={panelClass}>
            <h2 className="font-display text-base text-ink">FAQs</h2>
            <FaqsEditor faqs={faqs} onChange={setFaqs} />
          </div>

          <div className={panelClass}>
            <h2 className="font-display text-base text-ink">SEO</h2>
            <div>
              <label className={labelClass}>SEO Title</label>
              <input name="seo_title" maxLength={60} defaultValue={product?.seo_title} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>SEO Description</label>
              <textarea name="seo_description" rows={3} maxLength={160} defaultValue={product?.seo_description} className={inputClass} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className={panelClass}>
            <h2 className="font-display text-base text-ink">Status</h2>
            <div>
              <label className={labelClass}>Badge</label>
              <input
                name="badge"
                defaultValue={product?.badge || ""}
                placeholder="e.g. New, Bestseller, Limited, Signature"
                maxLength={30}
                className={inputClass}
              />
            </div>
            <button
              type="button"
              onClick={() => setIsActive((v) => !v)}
              className={`flex w-full items-center justify-between rounded-2xl border px-5 py-3.5 text-sm transition-all duration-500 ${
                isActive ? "border-green-500/30 bg-green-500/10 text-green-700" : "border-ink/10 bg-ivory-deep text-ink/45"
              }`}
            >
              {isActive ? "Visible in store" : "Hidden"}
              <span className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-500 ${isActive ? "bg-green-500" : "bg-ink/15"}`}>
                <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-500 ${isActive ? "translate-x-5" : "translate-x-0"}`} />
              </span>
            </button>
            <button
              type="button"
              onClick={() => setIsFeatured((v) => !v)}
              className={`flex w-full items-center justify-between rounded-2xl border px-5 py-3.5 text-sm transition-all duration-500 ${
                isFeatured ? "border-gold-400/30 bg-gold-400/10 text-gold-700" : "border-ink/10 bg-ivory-deep text-ink/45"
              }`}
            >
              Featured on homepage
              <span className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-500 ${isFeatured ? "bg-gold-500" : "bg-ink/15"}`}>
                <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-500 ${isFeatured ? "translate-x-5" : "translate-x-0"}`} />
              </span>
            </button>
          </div>

          <div className={panelClass}>
            <h2 className="font-display text-base text-ink">Featured Image</h2>
            <ImageUploader value={featuredImage} onChange={setFeaturedImage} folder="tajtailor/products" />
          </div>

          <div className={panelClass}>
            <h2 className="font-display text-base text-ink">Gallery Images</h2>
            <SizeImageMapper images={gallery} onChange={setGallery} variants={variants} folder="tajtailor/products" />
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse items-center gap-4 border-t border-gold-400/10 pt-6 sm:flex-row sm:justify-between">
        <Link href="/admin/products" className="text-sm text-ink/50 hover:text-ink">Cancel</Link>
        <button type="submit" disabled={pending} className="btn-gold w-full disabled:opacity-60 sm:w-auto">
          <Save className="h-4 w-4" /> {pending ? "Saving…" : isEditing ? "Update Product" : "Create Product"}
        </button>
      </div>
    </form>
  );
}
