import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { getCategoryById } from "@/actions/admin/categories";
import CategoryForm from "../../_components/CategoryForm";

export const metadata = { title: "Edit Category" };

export default async function EditCategoryPage({ params }) {
  const { id } = await params;
  const category = await getCategoryById(id);
  if (!category) notFound();

  return (
    <div>
      <Link
        href="/admin/categories"
        className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-ink/45 transition-colors hover:text-gold-600"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Categories
      </Link>
      <h1 className="mb-6 font-display text-3xl font-light text-ink">
        Edit <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gold-600 via-gold-500 to-gold-700">{category.name}</span>
      </h1>
      <CategoryForm category={category} />
    </div>
  );
}
