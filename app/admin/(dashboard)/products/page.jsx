import Link from "next/link";
import { Plus, Package, CheckCircle2, PackageX, AlertTriangle } from "lucide-react";
import { getAllProductsAdmin } from "@/actions/admin/products";
import { getAllCategoriesAdmin } from "@/actions/admin/categories";
import ProductRow from "./_components/ProductRow";
import ProductCard from "./_components/ProductCard";

export const metadata = { title: "Products" };
export const dynamic = "force-dynamic";

export default async function AdminProductsPage({ searchParams }) {
  const { category: categoryId } = await searchParams;
  const [allProducts, categories] = await Promise.all([getAllProductsAdmin(), getAllCategoriesAdmin()]);
  const products = categoryId ? allProducts.filter((p) => p.category_id === categoryId) : allProducts;

  const activeCount = products.filter((p) => p.is_active).length;
  const outOfStockCount = products.filter((p) => p.totalStock === 0).length;
  const lowStockCount = products.filter((p) => p.totalStock > 0 && p.totalStock <= 5).length;

  const stats = [
    { label: "Total Products", value: products.length, icon: Package },
    { label: "Active", value: activeCount, icon: CheckCircle2 },
    { label: "Low Stock", value: lowStockCount, icon: AlertTriangle },
    { label: "Out of Stock", value: outOfStockCount, icon: PackageX },
  ];

  return (
    <div>
      {/* Header Panel */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gold-400/10 pb-6">
        <div>
          <h1 className="font-display text-3xl font-light text-ink">
            Manage <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gold-600 via-gold-500 to-gold-700">Products</span>
          </h1>
          <p className="text-sm text-ink/50 font-light mt-1">
            {products.length} product{products.length === 1 ? "" : "s"} in your catalogue.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="btn-gold group flex w-full items-center justify-center gap-1.5 px-6 py-3.5 text-xs font-semibold tracking-widest uppercase shadow-[0_4px_15px_rgba(212,163,89,0.12)] hover:shadow-[0_4px_20px_rgba(212,163,89,0.25)] hover:-translate-y-0.5 transition-all duration-300 sm:w-auto"
        >
          <Plus className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" /> New Product
        </Link>
      </div>

      {/* Stat Strip */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex items-center gap-3 rounded-2xl border border-gold-400/10 bg-white px-4 py-3.5"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gold-400/10 text-gold-600">
              <s.icon className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="font-display text-xl leading-none text-ink">{s.value}</p>
              <p className="truncate text-xs uppercase tracking-wide text-ink/45">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Category Filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href="/admin/products"
          className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-all duration-300 ${
            !categoryId ? "border-gold-400/50 bg-gold-400/10 text-gold-700" : "border-ink/10 bg-white text-ink/50 hover:border-gold-400/30"
          }`}
        >
          All ({allProducts.length})
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/admin/products?category=${c.id}`}
            className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-all duration-300 ${
              categoryId === c.id ? "border-gold-400/50 bg-gold-400/10 text-gold-700" : "border-ink/10 bg-white text-ink/50 hover:border-gold-400/30"
            }`}
          >
            {c.name} ({c.product_count})
          </Link>
        ))}
      </div>

      {/* Table (sm and up) */}
      <div className="hidden overflow-x-auto rounded-[2rem] border border-gold-400/10 bg-white p-6 backdrop-blur-md shadow-2xl sm:block md:p-8">
        {products.length === 0 ? (
          <p className="py-12 text-center text-sm text-ink/45">
            {categoryId ? "No products in this category yet." : "No products yet — create your first one."}
          </p>
        ) : (
          <table className="w-full min-w-[680px] text-left border-collapse">
            <thead>
              <tr className="border-b border-gold-400/10 text-sm uppercase tracking-widest text-ink/45 font-semibold">
                <th className="pb-4 font-medium pl-2">Name</th>
                <th className="pb-4 font-medium">Category</th>
                <th className="pb-4 font-medium">From</th>
                <th className="pb-4 font-medium">Stock</th>
                <th className="pb-4 font-medium">Status</th>
                <th className="pb-4 font-medium text-right pr-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-400/5">
              {products.map((p) => (
                <ProductRow key={p.id} product={p} />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Card List (mobile only) */}
      <div className="rounded-[2rem] border border-gold-400/10 bg-white p-4 backdrop-blur-md shadow-2xl sm:hidden">
        {products.length === 0 ? (
          <p className="py-12 text-center text-sm text-ink/45">
            {categoryId ? "No products in this category yet." : "No products yet — create your first one."}
          </p>
        ) : (
          <ul className="space-y-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
