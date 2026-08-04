import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { getProductForEdit, getAllFabricsAdmin } from "@/actions/admin/products";
import { getAllCategoriesAdmin } from "@/actions/admin/categories";
import { getAllGarmentTypesAdmin } from "@/actions/admin/garmentTypes";
import { getAllExtraWorkAdmin } from "@/actions/admin/extraWork";
import ProductForm from "../../_components/ProductForm";

export const metadata = { title: "Edit Product" };

export default async function EditProductPage({ params }) {
  const { id } = await params;
  const [product, categories, fabricOptions, garmentTypes, extraWorkOptions] = await Promise.all([
    getProductForEdit(id),
    getAllCategoriesAdmin(),
    getAllFabricsAdmin(),
    getAllGarmentTypesAdmin(),
    getAllExtraWorkAdmin(),
  ]);
  if (!product) notFound();

  return (
    <div>
      <Link
        href="/admin/products"
        className="group/btn mb-4 inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest text-ink/45 hover:text-gold-600 transition-colors uppercase duration-300"
      >
        <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:-translate-x-1" /> Back to Products
      </Link>
      <div className="mb-8 border-b border-gold-400/15 pb-6">
        <h1 className="font-display text-3xl sm:text-4xl font-light text-ink">
          Edit <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gold-600 via-gold-500 to-gold-700">{product.name}</span>
        </h1>
        <p className="text-sm text-ink/50 font-light mt-1">Edit product details, price, and images.</p>
      </div>
      <ProductForm product={product} categories={categories} fabricOptions={fabricOptions} garmentTypes={garmentTypes} extraWorkOptions={extraWorkOptions} />
    </div>
  );
}
