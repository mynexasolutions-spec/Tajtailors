import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ChevronRight, Shirt } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import FlowStepper from "@/components/shop/FlowStepper";
import { getProductBySlug, getCompatibleOutfits, getGarmentTypes } from "@/actions/products";
import OutfitPicker from "@/components/shop/OutfitPicker";

export async function generateMetadata({ params }) {
  const { slug, garmentType } = await params;
  const fabric = await getProductBySlug(slug);
  if (!fabric) return {};
  const garmentTypes = await getGarmentTypes();
  const label = garmentTypes.find((g) => g.key === garmentType)?.label || garmentType;
  return { title: `Choose Your ${label} - Taj Tailor` };
}

export default async function ChooseGarmentTypePage({ params, searchParams }) {
  const { slug, garmentType } = await params;
  const { variant } = await searchParams;

  const fabric = await getProductBySlug(slug);
  if (!fabric || fabric.product_type !== "fabric") notFound();

  const [allOutfits, garmentTypes] = await Promise.all([getCompatibleOutfits(fabric.id), getGarmentTypes()]);
  const options = allOutfits.filter((o) => o.garmentType === garmentType);
  if (options.length === 0) notFound();

  const garmentTypeInfo = garmentTypes.find((g) => g.key === garmentType);
  const label = garmentTypeInfo?.label || garmentType;
  const variantId = variant || fabric.variants?.[0]?.id || "";

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-ivory text-ink overflow-hidden pb-16 sm:pb-24 pt-6 sm:pt-10">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gold-500/10 blur-[120px] animate-pulse" />
          <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] rounded-full bg-gold-400/10 blur-[120px] animate-pulse" />
        </div>

        <div className="mx-auto max-w-wrap px-6 md:px-12 relative z-10">
          {/* Breadcrumbs */}
          <div className="mb-6 sm:mb-8 flex flex-wrap items-center gap-2 text-sm text-ink/45">
            <Link href="/" className="hover:text-gold-600 transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/shop" className="hover:text-gold-600 transition-colors">Shop</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href={`/shop/${fabric.slug}`} className="hover:text-gold-600 transition-colors">{fabric.name}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-ink/60 font-medium">{label}</span>
          </div>

          <Link
            href={`/shop/${fabric.slug}`}
            className="group/back mb-6 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-ink/45 hover:text-gold-600 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover/back:-translate-x-1" /> Back to {fabric.name}
          </Link>

          <FlowStepper current="fabric" />

          {/* Header */}
          <div className="mb-10 sm:mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold-400/25 bg-white text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-700 shadow-soft mb-5 w-fit">
              <Shirt className="w-3.5 h-3.5 text-gold-600" /> {options.length} {options.length === 1 ? "Style" : "Styles"} Available
            </span>
            <h1 className="font-display text-5xl sm:text-6xl font-extrabold text-ink leading-[1.05]">
              Choose Your <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gold-600 via-gold-500 to-gold-700">{label}</span>
            </h1>
            <p className="mt-4 max-w-xl text-lg sm:text-xl text-ink/70 font-semibold leading-relaxed">
              Pick which {label.toLowerCase()} style to have tailored in <span className="text-ink/85 font-bold">{fabric.name}</span> — every option below is stitched to your own measurements.
            </p>
          </div>

          {/* Options grid — tap to select, then Continue confirms */}
          <OutfitPicker options={options} fabricId={fabric.id} variantId={variantId} />
        </div>
      </main>
      <Footer />
    </>
  );
}
