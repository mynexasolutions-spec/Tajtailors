"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Minus, Plus, ShoppingBag, MessageSquare, Check, Zap, Ruler, Shirt, ArrowRight, PackageCheck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { whatsappLink } from "@/lib/constants";
import { useProductVariant } from "./ProductVariantContext";

const inputClass =
  "w-full rounded-xl border border-ink/10 bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink/30 focus:border-gold-400/40 focus:outline-none";

const KURTA_STYLES = [
  { key: "pathani", label: "Pathani Kurta" },
  { key: "plain", label: "Plain Kurta" },
  { key: "plain_half_placket", label: "Plain Half-Placket Kurta" },
  { key: "jawahar_cut", label: "Jawahar Cut" },
  { key: "shirt", label: "Shirt Style" },
];
const KURTA_MEASUREMENT_FIELDS = [
  { key: "length", label: "Length" },
  { key: "collar", label: "Collar" },
  { key: "sleeve", label: "Sleeve" },
  { key: "chest", label: "Chest" },
  { key: "waist", label: "Waist" },
];
const YES_NO_OPTIONS = [
  { key: "yes", label: "Yes" },
  { key: "no", label: "No" },
];

const PAJAMA_STYLES = [
  { key: "pant_cut", label: "Pant-Cut" },
  { key: "choodidar", label: "Choodidar" },
  { key: "mughlai_shalwar", label: "Mughlai Shalwar" },
  { key: "nadawar", label: "Nada-vaar (Drawstring)" },
];
const PAJAMA_FIT_STYLES = ["pant_cut", "choodidar"];
const PAJAMA_FIT_OPTIONS = [
  { key: "straight", label: "Straight" },
  { key: "not_straight", label: "Not Straight" },
];
const PAJAMA_MEASUREMENT_FIELDS = [
  { key: "length", label: "Length" },
  { key: "mori", label: "Mori" },
  { key: "hip", label: "Hip" },
];

const PANT_MEASUREMENT_FIELDS = [
  { key: "length", label: "Length" },
  { key: "waist", label: "Waist" },
  { key: "hip", label: "Hip" },
  { key: "mori", label: "Mori" },
];

const EXTRA_WORK_OPTIONS = [
  { key: "karigari", label: "Karigari / Embroidery Work" },
  { key: "zari_buttons", label: "Zari Buttons" },
];

// Which garment sections a product's garment_type turns on.
function garmentSections(garmentType) {
  return {
    showKurta: garmentType === "kurta" || garmentType === "kurta_pajama_set" || garmentType === "kurta_pant_set",
    showPajama: garmentType === "pajama" || garmentType === "kurta_pajama_set",
    showPant: garmentType === "pant" || garmentType === "kurta_pant_set",
  };
}

function pillClass(active) {
  return `flex items-center gap-1.5 rounded-xl border px-4 py-2.5 text-sm transition-all ${
    active ? "border-gold-400 bg-gold-400/10 text-gold-700" : "border-ink/10 text-ink/55 hover:border-gold-400/30"
  }`;
}

function PillGroup({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button key={o.key} type="button" onClick={() => onChange(o.key)} className={pillClass(value === o.key)}>
          {value === o.key && <Check className="h-3.5 w-3.5" />}
          {o.label}
        </button>
      ))}
    </div>
  );
}

function MeasurementGrid({ fields, values, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {fields.map((f) => (
        <div key={f.key}>
          <label className="mb-1 block text-[11px] uppercase tracking-wide text-ink/45">{f.label} (in)</label>
          <input
            type="number"
            step="0.5"
            value={values[f.key] || ""}
            onChange={(e) => onChange(f.key, e.target.value)}
            className={inputClass}
          />
        </div>
      ))}
    </div>
  );
}

function StepHeading({ number, icon: Icon, children }) {
  return (
    <p className="mb-3 flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-gradient text-[11px] font-bold text-ink">
        {number}
      </span>
      {Icon && <Icon className="h-3.5 w-3.5" />}
      {children}
    </p>
  );
}

function MeasurementsStep({
  step,
  garmentType,
  measurementType,
  setMeasurementType,
  kurta,
  setKurta,
  pajama,
  setPajama,
  pant,
  setPant,
  extraWork,
  setExtraWork,
  notes,
  setNotes,
}) {
  const { showKurta, showPajama, showPant } = garmentSections(garmentType);
  const toggleExtraWork = (key) =>
    setExtraWork((list) => (list.includes(key) ? list.filter((k) => k !== key) : [...list, key]));

  return (
    <div className="space-y-4 rounded-2xl border border-ink/10 bg-ivory-deep p-5">
      <StepHeading number={step} icon={Ruler}>Measurements</StepHeading>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <button type="button" onClick={() => setMeasurementType("manual")} className={pillClass(measurementType === "manual")}>
          Enter My Measurements
        </button>
        <button type="button" onClick={() => setMeasurementType("reference_garment")} className={pillClass(measurementType === "reference_garment")}>
          Send a Reference Garment
        </button>
      </div>

      {measurementType === "manual" ? (
        <div className="space-y-4">
          {showKurta && (
            <div className="space-y-3 rounded-xl border border-ink/10 bg-white p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-600">Kurta</p>
              <PillGroup options={KURTA_STYLES} value={kurta.style} onChange={(style) => setKurta((k) => ({ ...k, style }))} />
              <MeasurementGrid fields={KURTA_MEASUREMENT_FIELDS} values={kurta} onChange={(key, val) => setKurta((k) => ({ ...k, [key]: val }))} />
              <div>
                <label className="mb-1 block text-[11px] uppercase tracking-wide text-ink/45">Front Placket</label>
                <PillGroup options={YES_NO_OPTIONS} value={kurta.frontPlacket} onChange={(frontPlacket) => setKurta((k) => ({ ...k, frontPlacket }))} />
              </div>
            </div>
          )}

          {showPajama && (
            <div className="space-y-3 rounded-xl border border-ink/10 bg-white p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-600">Pajama</p>
              <PillGroup options={PAJAMA_STYLES} value={pajama.style} onChange={(style) => setPajama((p) => ({ ...p, style }))} />
              {PAJAMA_FIT_STYLES.includes(pajama.style) && (
                <div>
                  <label className="mb-1 block text-[11px] uppercase tracking-wide text-ink/45">Fit</label>
                  <PillGroup options={PAJAMA_FIT_OPTIONS} value={pajama.fit} onChange={(fit) => setPajama((p) => ({ ...p, fit }))} />
                </div>
              )}
              <MeasurementGrid fields={PAJAMA_MEASUREMENT_FIELDS} values={pajama} onChange={(key, val) => setPajama((p) => ({ ...p, [key]: val }))} />
            </div>
          )}

          {showPant && (
            <div className="space-y-3 rounded-xl border border-ink/10 bg-white p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-600">Pant</p>
              <MeasurementGrid fields={PANT_MEASUREMENT_FIELDS} values={pant} onChange={(key, val) => setPant((p) => ({ ...p, [key]: val }))} />
            </div>
          )}

          {!showKurta && !showPajama && !showPant && (
            <p className="text-sm text-ink/45">
              This outfit doesn't have measurement fields configured yet — message us on WhatsApp with your measurements.
            </p>
          )}
        </div>
      ) : (
        <p className="text-sm leading-relaxed text-ink/50">
          No problem — just include a well-fitting old garment in the package our courier picks up, and our tailor will copy the sizing from it.
        </p>
      )}

      <div className="space-y-3 rounded-xl border border-ink/10 bg-white p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-600">Extra Work</p>
        <div className="flex flex-wrap gap-2">
          {EXTRA_WORK_OPTIONS.map((o) => (
            <button key={o.key} type="button" onClick={() => toggleExtraWork(o.key)} className={pillClass(extraWork.includes(o.key))}>
              {extraWork.includes(o.key) && <Check className="h-3.5 w-3.5" />}
              {o.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-ink/40">Price for these is confirmed by our tailor before stitching begins.</p>
      </div>

      <div>
        <label className="mb-1 block text-[11px] uppercase tracking-wide text-ink/45">Description (optional)</label>
        <textarea
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any fit preference or special instruction for the tailor"
          className={`${inputClass} resize-none`}
        />
      </div>
    </div>
  );
}

function OutfitConfigurator({ product, variants, compatibleFabrics }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToCart, setDrawerOpen } = useCart();
  const { showToast } = useToast();
  const stitchingVariant = variants[0];
  const meters = product.fabric_meters_required || 0;

  // Arriving from a fabric's "What Can Be Made From This" link preselects
  // that fabric here, so choosing fabric-first feels like one continuous flow
  // instead of forcing the customer to pick the fabric all over again.
  const preselectedFabric = compatibleFabrics.find((f) => f.id === searchParams.get("fabric")) || null;
  const preselectedVariant = preselectedFabric
    ? preselectedFabric.variants.find((v) => v.id === searchParams.get("variant")) || preselectedFabric.variants[0]
    : null;

  const [selectedFabricId, setSelectedFabricId] = useState(preselectedFabric?.id || null);
  const [ownFabric, setOwnFabric] = useState(false);
  const [measurementType, setMeasurementType] = useState("manual");
  const [selectedVariantId, setSelectedVariantId] = useState(preselectedVariant?.id || null);
  const [kurta, setKurta] = useState({});
  const [pajama, setPajama] = useState({});
  const [pant, setPant] = useState({});
  const [extraWork, setExtraWork] = useState([]);
  const [notes, setNotes] = useState("");
  const { showKurta, showPajama, showPant } = garmentSections(product.garment_type);
  // Editable meters — the standard amount is a starting point, but cutting
  // style/body size can need more, so the customer can bump it up themselves
  // and pay for the extra instead of needing a call to sort it out later.
  const [customMeters, setCustomMeters] = useState(meters);

  if (!stitchingVariant) {
    return (
      <div className="rounded-[1.5rem] border border-dashed border-ink/10 p-6 text-sm text-ink/50">
        This outfit isn't available for stitching right now. Message us on WhatsApp for availability.
      </div>
    );
  }

  const selectedFabric = compatibleFabrics.find((f) => f.id === selectedFabricId) || null;
  const selectedVariant = selectedFabric
    ? selectedFabric.variants.find((v) => v.id === selectedVariantId) || selectedFabric.variants[0]
    : null;
  const fabricCost = selectedVariant ? selectedVariant.price * customMeters : 0;
  const totalPrice = stitchingVariant.price + fabricCost;
  const fabricChosen = ownFabric || Boolean(selectedVariant);

  const chooseFabric = (id) => {
    setSelectedFabricId(id);
    setSelectedVariantId(compatibleFabrics.find((f) => f.id === id)?.variants[0]?.id || null);
    setOwnFabric(false);
    setCustomMeters(meters);
  };
  const chooseOwnFabric = () => {
    setSelectedFabricId(null);
    setSelectedVariantId(null);
    setOwnFabric(true);
    setCustomMeters(meters);
  };

  const fabricDisplayName =
    selectedFabric && selectedVariant
      ? selectedFabric.variants.length > 1
        ? `${selectedFabric.name} — ${selectedVariant.name}`
        : selectedFabric.name
      : "Customer's Own Fabric";

  const buildCartItem = () => ({
    variantId: stitchingVariant.id,
    cartKey: `${stitchingVariant.id}__${selectedVariant ? selectedVariant.id : "own"}__${Date.now()}`,
    productId: product.id,
    productType: "outfit",
    slug: product.slug,
    name: product.name,
    variantName: "Standard Stitching",
    price: totalPrice,
    image: product.images?.[0]?.image_url || product.featured_image_url || null,
    fabricProductId: selectedFabric ? selectedFabric.id : null,
    fabricVariantId: selectedVariant ? selectedVariant.id : null,
    fabricName: fabricDisplayName,
    meters: selectedVariant ? customMeters : meters,
    ownFabric: !selectedVariant,
    measurementType,
    measurements: {
      garmentType: product.garment_type || null,
      ...(measurementType === "manual" && showKurta ? { kurta } : {}),
      ...(measurementType === "manual" && showPajama ? { pajama } : {}),
      ...(measurementType === "manual" && showPant ? { pant } : {}),
      extraWork,
    },
    notes: notes || null,
  });

  const handleAdd = () => {
    if (!fabricChosen) return;
    addToCart(buildCartItem(), 1);
    showToast(`${product.name} added to your bag.`);
    setDrawerOpen(true);
  };

  const handleBuyNow = () => {
    if (!fabricChosen) return;
    addToCart(buildCartItem(), 1);
    setDrawerOpen(false);
    router.push("/checkout");
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Price block */}
      <div className="flex flex-wrap items-baseline gap-3">
        <span className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gold-600 via-gold-500 to-gold-700">
          ₹{totalPrice.toLocaleString("en-IN")}
        </span>
        <span className="text-sm text-ink/45">
          ₹{stitchingVariant.price.toLocaleString("en-IN")} stitching
          {Boolean(selectedVariant) && ` + fabric (${customMeters}m)`}
        </span>
      </div>

      {/* Step 1: Fabric choice — grid + own-fabric option, plus (once a catalog
          fabric is picked) its color and meters-needed, all grouped in one card
          so the whole "what fabric am I getting" decision reads as one step */}
      <div className="space-y-4 rounded-2xl border border-ink/10 bg-ivory-deep p-5">
        <StepHeading number={1} icon={Shirt}>Choose Your Fabric</StepHeading>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {compatibleFabrics.map((f) => {
            const cardVariant = f.id === selectedFabricId && selectedVariant ? selectedVariant : f.variants[0];
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => chooseFabric(f.id)}
                className={`flex flex-col overflow-hidden rounded-xl border bg-white text-left transition-all ${
                  selectedFabricId === f.id ? "border-gold-400 shadow-gold" : "border-ink/10 hover:border-gold-400/30"
                }`}
              >
                <div className="relative aspect-square w-full bg-ivory-deep">
                  {cardVariant.image && <Image src={cardVariant.image} alt={f.name} fill sizes="120px" className="object-cover" />}
                  {selectedFabricId === f.id && (
                    <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gold-gradient text-ink">
                      <Check className="h-3 w-3" />
                    </span>
                  )}
                </div>
                <div className="p-2">
                  <p className="truncate text-xs font-medium text-ink">{f.name}</p>
                  <p className="text-[11px] text-gold-600">
                    {f.variants.length > 1 ? "From " : ""}₹{f.variants[0].price}/m
                  </p>
                </div>
              </button>
            );
          })}

          <button
            type="button"
            onClick={chooseOwnFabric}
            className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border bg-white p-3 text-center transition-all ${
              ownFabric ? "border-gold-400 bg-gold-400/10 text-gold-700 shadow-gold" : "border-dashed border-ink/10 text-ink/55 hover:border-gold-400/30"
            }`}
          >
            <PackageCheck className="h-5 w-5" />
            <span className="text-xs font-medium leading-snug">I'll Send My Own Fabric</span>
          </button>
        </div>
        {compatibleFabrics.length === 0 && (
          <p className="mt-2 text-sm text-ink/45">No catalog fabrics mapped to this outfit yet — you can still send your own.</p>
        )}

        {/* Once a catalog fabric is picked: its color + how much of it to cut,
            grouped in one white sub-panel so it reads as "fabric details", not
            a separate step */}
        {selectedVariant && (
          <div className="space-y-4 rounded-xl border border-ink/10 bg-white p-4">
            {selectedFabric.variants.length > 1 && (
              <div>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-600">Select Color</p>
                <div className="flex flex-wrap gap-2">
                  {selectedFabric.variants.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      disabled={v.stockQuantity <= 0}
                      onClick={() => setSelectedVariantId(v.id)}
                      className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm transition-all disabled:cursor-not-allowed disabled:opacity-30 ${
                        selectedVariantId === v.id
                          ? "border-gold-400 bg-gold-400/10 text-gold-700"
                          : "border-ink/10 text-ink/55 hover:border-gold-400/30"
                      }`}
                    >
                      {selectedVariantId === v.id && <Check className="h-3.5 w-3.5" />}
                      {v.colorHex && (
                        <span
                          className="h-3.5 w-3.5 shrink-0 rounded-full border border-ink/15"
                          style={{ backgroundColor: v.colorHex }}
                        />
                      )}
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-600">Fabric Needed</p>
                <p className="mt-1 text-xs text-ink/45">Standard is {meters}m — increase it if you need extra.</p>
              </div>
              <div className="flex shrink-0 items-center gap-2 rounded-full border border-ink/10 bg-ivory-deep px-3 py-1.5">
                <button
                  type="button"
                  onClick={() => setCustomMeters((m) => Math.max(meters, Number((m - 0.5).toFixed(1))))}
                  className="text-ink/55 hover:text-gold-700 transition-colors"
                  aria-label="Decrease meters"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-10 text-center text-sm font-semibold text-ink">{customMeters}m</span>
                <button
                  type="button"
                  onClick={() => setCustomMeters((m) => Number((m + 0.5).toFixed(1)))}
                  className="text-ink/55 hover:text-gold-700 transition-colors"
                  aria-label="Increase meters"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <MeasurementsStep
        step={2}
        garmentType={product.garment_type}
        measurementType={measurementType}
        setMeasurementType={setMeasurementType}
        kurta={kurta}
        setKurta={setKurta}
        pajama={pajama}
        setPajama={setPajama}
        pant={pant}
        setPant={setPant}
        extraWork={extraWork}
        setExtraWork={setExtraWork}
        notes={notes}
        setNotes={setNotes}
      />

      {/* Add to Bag + Buy Now CTA */}
      <div className="flex flex-col sm:flex-row items-stretch gap-4">
        <button
          onClick={handleAdd}
          disabled={!fabricChosen}
          className="btn-gold flex-1 py-4 text-xs font-semibold tracking-widest uppercase disabled:cursor-not-allowed disabled:opacity-40 flex items-center justify-center gap-2"
        >
          <ShoppingBag className="h-4.5 w-4.5 text-ink" /> Add to Bag
        </button>
        <button
          onClick={handleBuyNow}
          disabled={!fabricChosen}
          className="btn-outline flex-1 py-4 text-xs font-semibold tracking-widest uppercase disabled:cursor-not-allowed disabled:opacity-40 flex items-center justify-center gap-2"
        >
          <Zap className="h-4 w-4 text-gold-600" /> Buy Now
        </button>
      </div>
      {!fabricChosen && <p className="text-center text-sm text-ink/45 -mt-4">Choose a fabric (or "send my own") to continue.</p>}
    </div>
  );
}

function SimplePurchasePanel({ product, variants, compatibleOutfits }) {
  const router = useRouter();
  const ctx = useProductVariant();
  const [localSelectedId, setLocalSelectedId] = useState(variants[0]?.id);
  const selectedId = ctx ? ctx.selectedId : localSelectedId;
  const setSelectedId = ctx ? ctx.setSelectedId : setLocalSelectedId;
  const [quantity, setQuantity] = useState(1);
  const { addToCart, setDrawerOpen } = useCart();
  const { showToast } = useToast();

  const selected = variants.find((v) => v.id === selectedId) || variants[0];
  const inStock = selected && selected.stock_quantity > 0;

  if (!variants || variants.length === 0) {
    return (
      <div className="rounded-[1.5rem] border border-dashed border-ink/10 p-6 text-sm text-ink/50">
        This product is currently unavailable. Message us on WhatsApp for availability.
      </div>
    );
  }

  const buildCartItem = () => ({
    variantId: selected.id,
    productId: product.id,
    productType: product.product_type,
    slug: product.slug,
    name: product.name,
    variantName: selected.variant_name,
    price: selected.price,
    image: product.images?.[0]?.image_url || product.featured_image_url || null,
  });

  const handleAdd = () => {
    if (!selected || !inStock) return;
    addToCart(buildCartItem(), quantity);
    showToast(`${product.name} (${selected.variant_name}) added to your bag.`);
    setDrawerOpen(true);
  };

  const handleBuyNow = () => {
    if (!selected || !inStock) return;
    addToCart(buildCartItem(), quantity);
    setDrawerOpen(false);
    router.push("/checkout");
  };

  return (
    <div className="space-y-6 sm:space-y-8">

      {/* Price block */}
      <div className="flex flex-wrap items-baseline gap-4">
        <span className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gold-600 via-gold-500 to-gold-700">
          ₹{selected.price.toLocaleString("en-IN")}
        </span>
        {product.product_type === "fabric" && <span className="text-base text-ink/45">/ meter</span>}
        {selected.original_price && selected.original_price > selected.price && (
          <>
            <span className="text-base text-ink/45 line-through">
              ₹{selected.original_price.toLocaleString("en-IN")}
            </span>
            <span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
              Save {Math.round(((selected.original_price - selected.price) / selected.original_price) * 100)}%
            </span>
          </>
        )}
      </div>

      {/* Size buttons — skipped entirely when there's only one variant (nothing to choose) */}
      {variants.length > 1 && (
        <div>
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-600">
            {product.product_type === "fabric" ? "Select Color" : "Select Size"}
          </p>
          <div className="flex flex-wrap gap-2">
            {variants.map((v) => (
              <button
                key={v.id}
                disabled={v.stock_quantity <= 0}
                onClick={() => setSelectedId(v.id)}
                className={`flex items-center gap-1.5 rounded-2xl border px-5 py-2.5 text-sm sm:text-base transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-20 ${
                  selectedId === v.id
                    ? "bg-gold-gradient text-ink border-transparent font-semibold shadow-gold/20 scale-[1.02]"
                    : "border-ink/10 bg-ivory-deep text-ink/55 hover:border-gold-400/30 hover:text-ink"
                }`}
              >
                {selectedId === v.id && <Check className="h-3.5 w-3.5" />}
                {v.color_hex && (
                  <span
                    className="h-3.5 w-3.5 shrink-0 rounded-full border border-ink/15"
                    style={{ backgroundColor: v.color_hex }}
                  />
                )}
                {v.variant_name}
              </button>
            ))}
          </div>
          {!inStock && (
            <p className="mt-3 text-sm text-red-400 font-semibold">
              This {product.product_type === "fabric" ? "color" : "size"} is out of stock.
            </p>
          )}
        </div>
      )}
      {variants.length === 1 && !inStock && <p className="text-sm text-red-400 font-semibold">Currently out of stock.</p>}

      {/* Quantity Selector */}
      <div>
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-600">
          {product.product_type === "fabric" ? "Meters" : "Quantity"}
        </p>
        <div className="flex w-fit items-center justify-between rounded-full border border-ink/10 bg-ivory-deep px-5 py-3">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="text-ink/55 hover:text-gold-700 transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="w-8 text-center text-sm font-semibold text-ink">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="text-ink/55 hover:text-gold-700 transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
        {product.product_type === "fabric" && (
          <p className="mt-2 text-sm text-ink/45">
            Total: ₹{(selected.price * quantity).toLocaleString("en-IN")} for {quantity}m
          </p>
        )}
      </div>

      {/* Add to Bag + Buy Now CTA */}
      <div className="flex flex-col sm:flex-row items-stretch gap-4">
        <button
          onClick={handleAdd}
          disabled={!inStock}
          className="btn-gold flex-1 py-4 text-xs font-semibold tracking-widest uppercase disabled:cursor-not-allowed disabled:opacity-40 flex items-center justify-center gap-2 animate-shimmer bg-[length:200%_200%] shadow-[0_4px_20px_rgba(212,163,89,0.15)] hover:shadow-[0_4px_28px_rgba(212,163,89,0.3)] hover:-translate-y-0.5 transition-all duration-300"
        >
          <ShoppingBag className="h-4.5 w-4.5 text-ink" /> Add to Bag
        </button>
        <button
          onClick={handleBuyNow}
          disabled={!inStock}
          className="btn-outline flex-1 py-4 text-xs font-semibold tracking-widest uppercase disabled:cursor-not-allowed disabled:opacity-40 flex items-center justify-center gap-2 hover:bg-gold-400/10 hover:border-gold-300 hover:-translate-y-0.5 transition-all duration-300"
        >
          <Zap className="h-4 w-4 text-gold-600" /> Buy Now
        </button>
      </div>

      {/* WhatsApp Link */}
      <a
        href={whatsappLink(
          `Hi Taj Tailor, I'd like to order ${product.name} (${selected.variant_name}).`
        )}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 w-full text-center text-sm text-ink/45 hover:text-emerald-600 transition-colors py-2.5 border border-dashed border-ink/15 rounded-2xl hover:border-emerald-500/30 bg-ivory-deep"
      >
        <MessageSquare className="w-3.5 h-3.5 text-emerald-500" /> Prefer to order on WhatsApp instead?
      </a>

      {/* Fabric-only: what can be made from this fabric */}
      {product.product_type === "fabric" && compatibleOutfits.length > 0 && (
        <div className="rounded-2xl border border-ink/10 bg-ivory-deep p-5">
          <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gold-600">
            <Shirt className="h-4 w-4" /> What Can Be Made From This Fabric
          </p>
          <div className="flex flex-wrap gap-2">
            {compatibleOutfits.map((o) => (
              <a
                key={o.id}
                href={`/shop/${o.slug}?fabric=${product.id}&variant=${selected.id}`}
                className="flex items-center gap-1.5 rounded-full border border-ink/10 px-4 py-2 text-sm text-ink/70 transition-colors hover:border-gold-400/40 hover:text-gold-700"
              >
                {o.name} <ArrowRight className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductPurchasePanel({ product, variants, compatibleOutfits = [], compatibleFabrics = [] }) {
  if (product.product_type === "outfit") {
    return <OutfitConfigurator product={product} variants={variants} compatibleFabrics={compatibleFabrics} />;
  }
  return <SimplePurchasePanel product={product} variants={variants} compatibleOutfits={compatibleOutfits} />;
}
