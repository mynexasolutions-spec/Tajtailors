import { Suspense } from "react";
import Link from "next/link";
import { X, ChevronLeft, ChevronRight, Shirt, Scissors, PackageCheck, ArrowRight } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";
import ShopFilters from "@/components/shop/ShopFilters";
import ShopIntroModal from "@/components/shop/ShopIntroModal";
import SortSelect from "@/components/shop/SortSelect";
import { getActiveCategories } from "@/actions/categories";
import { getProducts } from "@/actions/products";

export const metadata = { title: "Shop All Products - Taj Tailor" };

const PAGE_SIZE = 12;

// Matches the SHOP_WAYS card order below — the landing page's product grid
// groups by this same sequence so it reads as "here's fabric, here's outfit,
// here's ready-made" instead of an unrelated shuffle under the cards.
const SHOP_WAY_ORDER = { fabric: 0, outfit: 1, kurta: 2 };

// The three ways a customer can shop, shown as cards only on the bare /shop
// landing (no type/category/search yet) — clicking one sets ?type= and drops
// into the normal filtered layout, same as the header nav links already do.
const SHOP_WAYS = [
  {
    icon: Shirt,
    title: "Buy Fabric & Stitch",
    desc: "Pick a fabric from our collection and we'll stitch it to your measurements.",
    href: "/shop?type=fabric",
    badgeLabel: "Recommended",
  },
  {
    icon: Scissors,
    title: "Stitch My Fabric",
    desc: "Send us your own fabric and we'll tailor it into your outfit.",
    href: "/shop?type=outfit",
  },
  {
    icon: PackageCheck,
    title: "Ready-Made",
    desc: "Shop ready-to-wear kurtas, in stock and ready to ship.",
    href: "/shop?type=kurta",
  },
];

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
  let products = inStockOnly ? allProducts.filter((p) => p.inStock !== false) : allProducts;

  // Bare /shop (no type/category/search chosen yet) shows the 3 shopping-way
  // cards instead of the normal sidebar filters — picking a card (or a header
  // nav link) sets ?type= and switches into the regular filtered layout.
  const isLanding = !params.type && !params.category && !params.search;

  // On the landing view, group products fabric -> outfit -> kurta to match
  // the card order above them (stable sort keeps each group's own ordering).
  if (isLanding) {
    products = products
      .map((p, i) => [p, i])
      .sort(([a, ai], [b, bi]) => {
        const diff = (SHOP_WAY_ORDER[a.productType] ?? 3) - (SHOP_WAY_ORDER[b.productType] ?? 3);
        return diff !== 0 ? diff : ai - bi;
      })
      .map(([p]) => p);
  }

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

  const paginationNav = totalPages > 1 && (
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
  );

  const shopWayCards = (
    <div className="mb-14 grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-5">
      {SHOP_WAYS.map((way, i) => (
        <div key={way.title} className="relative animate-fadeUp opacity-0" style={{ animationDelay: `${i * 100}ms` }}>
          <Link
            href={way.href}
            className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-gold-400/15 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-gold-400/40 hover:shadow-gold"
          >
            <span className="absolute inset-x-0 top-0 h-[3px] bg-gold-gradient bg-[length:200%_200%] opacity-70 transition-all duration-300 group-hover:animate-shimmer group-hover:opacity-100" />

            {/* Soft gold glow that blooms in on hover */}
            <span className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gold-400/0 blur-2xl transition-colors duration-500 group-hover:bg-gold-400/15" />

            {way.badgeLabel && (
              <span className="absolute right-5 top-5 rounded-full bg-gold-gradient px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-ink shadow-gold">
                {way.badgeLabel}
              </span>
            )}

            <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gold-400/10 text-gold-600 ring-4 ring-gold-100/50 transition-all duration-300 group-hover:scale-110 group-hover:bg-gold-gradient group-hover:text-ink group-hover:shadow-gold">
              <way.icon className="h-5 w-5" strokeWidth={1.75} />
              <span className="absolute -bottom-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-gold-500 text-[10px] font-bold leading-none text-white">
                {i + 1}
              </span>
            </span>

            <h3 className="mt-4 font-display text-lg font-bold text-ink transition-colors group-hover:text-gold-700">
              {way.title}
            </h3>
            <p className="mt-1.5 text-sm font-semibold leading-relaxed text-ink/60">{way.desc}</p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gold-600">
              Explore <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
            </span>
          </Link>

          {i < SHOP_WAYS.length - 1 && (
            <span className="pointer-events-none absolute right-0 top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full border border-gold-400/20 bg-white text-gold-500 shadow-soft sm:flex">
              <ChevronRight className="h-4 w-4" />
            </span>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <>
      <SiteHeader />
      <ShopIntroModal show={isLanding} />
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
          {isLanding ? (
            <div>
              {shopWayCards}
              <ProductGrid
                products={safeProducts}
                emptyMessage="No products yet. Message us on WhatsApp for help."
              />
              {paginationNav}
            </div>
          ) : (
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
                {paginationNav}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
