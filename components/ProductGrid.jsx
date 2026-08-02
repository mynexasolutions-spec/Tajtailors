import ProductCard from "./ProductCard";
import SherwaniGlyph from "./SherwaniGlyph";

export default function ProductGrid({ products, emptyMessage = "No products found." }) {
  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-[2rem] border border-dashed border-gold-400/25 bg-white px-6 py-24 text-center shadow-soft">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gold-400/[0.07] ring-1 ring-gold-400/15">
          <SherwaniGlyph className="h-10 w-auto opacity-50 text-gold-500" />
        </div>
        <p className="mt-6 font-display text-xl text-ink">Nothing here yet</p>
        <p className="mt-2 max-w-sm text-sm sm:text-base leading-relaxed text-ink/45">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-3">
      {products.map((product, i) => (
        <div key={product.id} className="h-full animate-fadeUp opacity-0" style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}>
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
