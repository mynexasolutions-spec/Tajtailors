import { Suspense } from "react";
import Link from "next/link";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";
import ShopFilters from "@/components/shop/ShopFilters";
import SortSelect from "@/components/shop/SortSelect";
import { getActiveCategories } from "@/actions/categories";
import { getProducts } from "@/actions/products";

export const metadata = { title: "Shop All Products - Taj Tailor" };

const PAGE_SIZE = 12;

function getPageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, 2, total - 1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const withEllipsis = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) withEllipsis.push("...");
    withEllipsis.push(p);
  });
  return withEllipsis;
}

export default async function ShopPage({ searchParams }) {
  const params = await searchParams;
  const minPrice = params.minPrice ? Number(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : undefined;
  const [categories, allProducts] = await Promise.all([
    getActiveCategories(),
    getProducts({
      categoryId: params.category || undefined,
      productType: params.type || undefined,
      sort: params.sort || undefined,
      search: params.search || undefined,
      minPrice,
      maxPrice,
    }),
  ]);

  const inStockOnly = params.inStock === "1";
  const products = inStockOnly ? allProducts.filter((p) => p.inStock !== false) : allProducts;

  const activeCategoryName = categories.find((c) => c.id === params.category)?.name;
  const TYPE_LABELS = { fabric: "Fabric", kurta: "Ready-Made Kurta", outfit: "Custom Outfit" };
  const priceChipLabel = () => {
    if (minPrice && maxPrice) return `₹${minPrice.toLocaleString("en-IN")} – ₹${maxPrice.toLocaleString("en-IN")}`;
    if (minPrice) return `Above ₹${minPrice.toLocaleString("en-IN")}`;
    if (maxPrice) return `Under ₹${maxPrice.toLocaleString("en-IN")}`;
    return null;
  };

  // A category choice always supersedes the header nav's ?type= links (see
  // ShopFilters' setParam), so only show the type chip while no category is set.
  const activeChips = [
    params.search ? { key: "search", label: `"${params.search}"` } : null,
    params.category ? { key: "category", label: activeCategoryName || "Category" } : null,
    !params.category && params.type ? { key: "type", label: TYPE_LABELS[params.type] || params.type } : null,
    minPrice || maxPrice ? { key: "price", label: priceChipLabel() } : null,
    inStockOnly ? { key: "inStock", label: "In Stock Only" } : null,
  ].filter(Boolean);

  const chipHref = (omitKey) => {
    const usp = new URLSearchParams();
    if (params.search && omitKey !== "search") usp.set("search", params.search);
    if (params.category && omitKey !== "category") usp.set("category", params.category);
    if (params.type && omitKey !== "type") usp.set("type", params.type);
    if (params.sort) usp.set("sort", params.sort);
    if (omitKey !== "price") {
      if (params.minPrice) usp.set("minPrice", params.minPrice);
      if (params.maxPrice) usp.set("maxPrice", params.maxPrice);
    }
    if (inStockOnly && omitKey !== "inStock") usp.set("inStock", "1");
    const qs = usp.toString();
    return qs ? `/shop?${qs}` : "/shop";
  };

  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const currentPage = Math.min(Math.max(parseInt(params.page, 10) || 1, 1), totalPages);
  const pagedProducts = products.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const pageHref = (pageNum) => {
    const usp = new URLSearchParams();
    if (params.search) usp.set("search", params.search);
    if (params.category) usp.set("category", params.category);
    if (params.type) usp.set("type", params.type);
    if (params.sort) usp.set("sort", params.sort);
    if (params.minPrice) usp.set("minPrice", params.minPrice);
    if (params.maxPrice) usp.set("maxPrice", params.maxPrice);
    if (inStockOnly) usp.set("inStock", "1");
    if (pageNum > 1) usp.set("page", String(pageNum));
    const qs = usp.toString();
    return qs ? `/shop?${qs}` : "/shop";
  };

  // Serialize properties to strip non-serializable fields/prototypes for React 19 compatibility
  const safeProducts = JSON.parse(JSON.stringify(pagedProducts));
  const safeCategories = JSON.parse(JSON.stringify(categories));

  return (
    <>
      <SiteHeader />
      <main className="relative min-h-screen overflow-hidden pb-24 pt-4 sm:pt-10 bg-white text-ink">

        <section className="relative">

          <div className="relative z-10 mx-auto max-w-wrap px-6 py-6 sm:py-10 md:px-12 md:py-14">
            <nav className="mb-6 flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-ink/40">
              <Link href="/" className="transition-colors hover:text-gold-600">Home</Link>
              <span className="text-ink/20">/</span>
              <span className="text-ink">{activeCategoryName || (!params.category && TYPE_LABELS[params.type]) || "Shop"}</span>
            </nav>

            <div>
              <p className="eyebrow text-xs font-bold tracking-[0.3em] text-gold-600 uppercase">
                <span className="gold-line" /> The Collection
              </p>
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-ink mt-4 leading-tight">
                {params.search
                  ? `Results for "${params.search}"`
                  : activeCategoryName || (!params.category && TYPE_LABELS[params.type]) || "Shop All Products"}
              </h1>
            </div>

            <div className="mt-8 flex flex-col gap-4 rounded-[1.5rem] border border-gold-400/15 bg-white px-6 py-4 sm:flex-row sm:items-center sm:justify-between shadow-soft">
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-gold-400/20 bg-gold-400/5 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-gold-700">
                {products.length} product{products.length === 1 ? "" : "s"}
              </span>
              <Suspense fallback={null}>
                <SortSelect className="hidden w-56 md:block" />
              </Suspense>
            </div>

            {activeChips.length > 0 && (
              <div className="mt-6 flex flex-wrap items-center gap-2 animate-fadeUp">
                {activeChips.map((chip) => (
                  <Link
                    key={chip.key}
                    href={chipHref(chip.key)}
                    scroll={false}
                    className="flex items-center gap-1.5 rounded-full border border-gold-400/20 bg-gold-400/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gold-700 transition-colors hover:border-gold-400/40 hover:bg-gold-400/10"
                  >
                    {chip.label}
                    <X className="h-3 w-3" />
                  </Link>
                ))}
                <Link href="/shop" scroll={false} className="text-xs font-bold uppercase tracking-wider text-ink/40 hover:text-red-500 transition-colors ml-2">
                  Clear all
                </Link>
              </div>
            )}
          </div>
        </section>

        <div className="relative mx-auto max-w-wrap border-t border-ink/[0.06] px-6 pt-10 md:px-12 md:pt-14">
          <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-[240px_1fr]">
            <aside className="md:sticky md:top-24 md:self-start">
              <Suspense fallback={null}>
                <ShopFilters categories={safeCategories} />
              </Suspense>
            </aside>
            <div>
              <ProductGrid
                products={safeProducts}
                emptyMessage="No products match these filters yet. Try clearing a filter, or message us on WhatsApp for help."
              />

              {totalPages > 1 && (
                <nav aria-label="Pagination" className="mt-12 flex flex-col items-center gap-3">
                  <div className="flex flex-wrap items-center justify-center gap-1.5 rounded-full border border-gold-400/15 bg-white p-1.5 shadow-soft sm:gap-2">
                  <Link
                    href={pageHref(currentPage - 1)}
                    scroll={false}
                    aria-disabled={currentPage === 1}
                    className={`flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full border transition-all ${
                      currentPage === 1
                        ? "pointer-events-none border-ink/10 text-ink/20"
                        : "border-gold-400/25 bg-white text-gold-600 hover:border-gold-400/50 hover:text-gold-700"
                    }`}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Link>

                  {getPageNumbers(currentPage, totalPages).map((p, i) =>
                    p === "..." ? (
                      <span key={`ellipsis-${i}`} className="px-1 text-base text-ink/35">
                        &hellip;
                      </span>
                    ) : (
                      <Link
                        key={p}
                        href={pageHref(p)}
                        scroll={false}
                        className={`flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full border text-base font-semibold transition-all ${
                          p === currentPage
                            ? "border-gold-400 bg-gold-400/15 text-gold-700 shadow-gold"
                            : "border-ink/10 text-ink/60 hover:border-gold-400/40 hover:text-ink"
                        }`}
                      >
                        {p}
                      </Link>
                    )
                  )}

                  <Link
                    href={pageHref(currentPage + 1)}
                    scroll={false}
                    aria-disabled={currentPage === totalPages}
                    className={`flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full border transition-all ${
                      currentPage === totalPages
                        ? "pointer-events-none border-ink/10 text-ink/20"
                        : "border-gold-400/25 bg-white text-gold-600 hover:border-gold-400/50 hover:text-gold-700"
                    }`}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                  </div>
                  <p className="text-sm font-bold uppercase tracking-wider text-ink/45">
                    Page {currentPage} of {totalPages}
                  </p>
                </nav>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
