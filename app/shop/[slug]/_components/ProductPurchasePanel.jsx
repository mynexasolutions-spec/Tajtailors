"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Minus, Plus, ShoppingBag, MessageSquare, Check, Zap, Ruler, Shirt, ArrowRight, PackageCheck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { whatsappLink } from "@/lib/constants";
import FlowStepper from "@/components/shop/FlowStepper";
import { useProductVariant } from "./ProductVariantContext";

const inputClass =
  "w-full rounded-xl border border-ink/10 bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink/30 focus:border-gold-400/40 focus:outline-none";

const YES_NO_OPTIONS = [
  { key: "yes", label: "Yes" },
  { key: "no", label: "No" },
];

// For kids' garments an exact inch measurement is rarely known — picking an
// age is faster and close enough for the tailor to size against.
const AGE_OPTIONS = Array.from({ length: 10 }, (_, i) => {
  const age = i + 1;
  return { key: String(age), label: `${age} Year${age === 1 ? "" : "s"}` };
});

// Groups an outfit's own name label under its garment_type — lets multiple
// products of the same garment family (e.g. "Kurta" and "Half Kurta") show
// as one category with a type picker instead of separate flat pills. Labels
// come from the admin-managed garment_types table (garmentTypesByKey), not a
// hardcoded list, so new garment families need no code change.
function groupOutfitsByGarmentType(outfits, garmentTypesByKey) {
  const groups = [];
  const byKey = new Map();
  outfits.forEach((o) => {
    const key = o.garmentType || o.name;
    let group = byKey.get(key);
    if (!group) {
      group = { key, label: garmentTypesByKey.get(o.garmentType)?.label || o.name, items: [] };
      byKey.set(key, group);
      groups.push(group);
    }
    group.items.push(o);
  });
  return groups;
}

// Which measurement section(s) a product's garment_type renders, and where
// each section's field/style config comes from. "Set" kinds (Kurta+Pajama,
// Kurta+Pant) combine the two canonical component types; every other kind
// (kurta/pajama/pant/custom) is just its own garment_type's own config —
// this is what lets an admin-defined type (e.g. "Sherwani") work with zero
// code changes: its own style_options/fields are used directly.
function getMeasurementSections(garmentType, garmentTypesByKey) {
  const ownType = garmentTypesByKey.get(garmentType);
  const kind = ownType?.measurement_kind || garmentType;

  if (kind === "kurta_pajama_set") {
    const kurta = garmentTypesByKey.get("kurta");
    const pajama = garmentTypesByKey.get("pajama");
    return [kurta && { key: "kurta", type: kurta }, pajama && { key: "pajama", type: pajama }].filter(Boolean);
  }
  if (kind === "kurta_pant_set") {
    const kurta = garmentTypesByKey.get("kurta");
    const pant = garmentTypesByKey.get("pant");
    return [kurta && { key: "kurta", type: kurta }, pant && { key: "pant", type: pant }].filter(Boolean);
  }
  return ownType ? [{ key: garmentType, type: ownType }] : [];
}

function pillClass(active) {
  return `flex items-center gap-1.5 rounded-xl border px-4 py-2.5 text-sm font-bold transition-all ${
    active ? "border-gold-400 bg-gold-400/10 text-gold-700" : "border-ink/15 text-ink/70 hover:border-gold-400/30"
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
          <label className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-ink/60">
            {f.label} {f.required !== false ? <span className="text-red-500">*</span> : <span className="text-ink/40 font-normal lowercase">(optional)</span>} (in)
          </label>
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

// Renders one garment_type's config (style pills + measurement fields) —
// entirely DB-driven, so admin edits to a garment type's fields show up here
// with no code change. `values` is the plain {style, ...fieldKey} state for
// this section; `onChange` receives a partial patch to merge in.
function GarmentSection({ title, config, values, onChange }) {
  const fields = config?.fields || [];
  const ageField = fields.find((f) => f.type === "age");
  const regularFields = fields.filter((f) => f.type !== "age");
  const numberFields = regularFields.filter((f) => f.type === "number" || !f.type);
  const otherFields = regularFields.filter((f) => f.type === "yes_no" || f.type === "select");
  const forChild = Boolean(values._forChild);

  return (
    <div className="space-y-3 rounded-xl border border-ink/10 bg-white p-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-600">{title}</p>

      {ageField && (
        <label className="flex w-fit cursor-pointer items-center gap-2 text-xs font-bold text-ink/60">
          <input
            type="checkbox"
            checked={forChild}
            onChange={(e) => onChange({ _forChild: e.target.checked })}
            className="h-4 w-4 accent-gold-500"
          />
          This is for a child
        </label>
      )}

      {ageField && forChild ? (
        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-ink/60">Child's Age</label>
          <PillGroup options={AGE_OPTIONS} value={values.age} onChange={(age) => onChange({ age })} />
        </div>
      ) : (
        <>
          {numberFields.length > 0 && (
            <MeasurementGrid fields={numberFields} values={values} onChange={(key, val) => onChange({ [key]: val })} />
          )}
          {otherFields.map((f) => (
            <div key={f.key}>
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-ink/60">
                {f.label} {f.required !== false ? <span className="text-red-500">*</span> : <span className="text-ink/40 font-normal lowercase">(optional)</span>}
              </label>
              <PillGroup
                options={f.type === "yes_no" ? YES_NO_OPTIONS : f.options || []}
                value={values[f.key]}
                onChange={(val) => onChange({ [f.key]: val })}
              />
            </div>
          ))}
          {regularFields.length === 0 && (
            <p className="text-sm font-semibold text-ink/45">No fields configured for this type yet.</p>
          )}
        </>
      )}
    </div>
  );
}

// Lets the customer jump between Fabric / Measurements / Review without all
// three sitting stacked in one long scroll next to the sticky gallery —
// "Review" only appears once a fabric is chosen, since there's nothing to
// review before that.
function StepTabs({ tabs, active, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto rounded-2xl border border-gold-400/15 bg-white p-1.5 shadow-soft">
      {tabs.map((t) => (
        <button
          key={t.key}
          type="button"
          onClick={() => onChange(t.key)}
          className={`flex flex-1 shrink-0 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-bold uppercase tracking-wide transition-all duration-300 ${
            active === t.key ? "bg-gold-gradient text-ink shadow-gold" : "text-ink/50 hover:bg-gold-400/5 hover:text-ink/80"
          }`}
        >
          <span
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
              active === t.key ? "bg-white/25 text-ink" : "bg-ink/10 text-ink/50"
            }`}
          >
            {t.number}
          </span>
          {t.label}
        </button>
      ))}
    </div>
  );
}

function StepHeading({ number, icon: Icon, children }) {
  return (
    <p className="mb-3 flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.2em] text-gold-600">
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
  sections,
  sectionsData,
  updateSection,
  measurementType,
  setMeasurementType,
  extraWorkOptions,
  extraWork,
  setExtraWork,
  notes,
  setNotes,
}) {
  const toggleExtraWork = (key) =>
    setExtraWork((list) => (list.includes(key) ? list.filter((k) => k !== key) : [...list, key]));

  return (
    <div className="space-y-4 rounded-2xl border border-gold-400/15 bg-white p-5 shadow-soft">
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
          {sections.map((s) => (
            <GarmentSection
              key={s.key}
              title={s.type.label}
              config={s.type}
              values={sectionsData[s.key] || {}}
              onChange={(patch) => updateSection(s.key, patch)}
            />
          ))}

          {sections.length === 0 && (
            <p className="text-sm font-semibold text-ink/55">
              This outfit doesn't have measurement fields configured yet — message us on WhatsApp with your measurements.
            </p>
          )}
        </div>
      ) : (
        <p className="text-sm font-semibold leading-relaxed text-ink/60">
          No problem — just include a well-fitting old garment in the package our courier picks up, and our tailor will copy the sizing from it.
        </p>
      )}

      {extraWorkOptions.length > 0 && (
        <div className="space-y-3 rounded-xl border border-ink/10 bg-white p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-600">Extra Work</p>
          <div className="flex flex-wrap gap-2">
            {extraWorkOptions.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => toggleExtraWork(o.id)}
                className={pillClass(extraWork.includes(o.id))}
              >
                {extraWork.includes(o.id) && <Check className="h-3.5 w-3.5" />}
                {o.label}
                {o.price > 0 && <span className="opacity-70">+₹{o.price.toLocaleString("en-IN")}</span>}
              </button>
            ))}
          </div>
          <p className="text-xs font-bold text-ink/55">Selected extra work is added to your total below.</p>
        </div>
      )}

      <div>
        <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-ink/60">Description (optional)</label>
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

function OutfitConfigurator({ product, variants, compatibleFabrics, garmentTypesByKey, extraWorkOptions }) {
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
  // Arriving with a fabric already picked (from the fabric page's "What Can
  // Be Made" flow) shouldn't ask the customer to choose it again — show a
  // compact confirmation instead of the full picker, expandable via "Change".
  const [showFabricPicker, setShowFabricPicker] = useState(!preselectedFabric);
  const [measurementType, setMeasurementType] = useState("manual");
  const [selectedVariantId, setSelectedVariantId] = useState(preselectedVariant?.id || null);
  // Per-section measurement state, keyed by section key ("kurta"/"pajama"/
  // "pant", or a custom garment type's own key) — generic so a new
  // admin-defined garment type works with no code change.
  const [sectionsData, setSectionsData] = useState({});
  const updateSection = (key, patch) => setSectionsData((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));
  const [extraWork, setExtraWork] = useState([]);
  const [notes, setNotes] = useState("");
  const measurementSections = getMeasurementSections(product.garment_type, garmentTypesByKey);
  // Editable meters — the standard amount is a starting point, but cutting
  // style/body size can need more, so the customer can bump it up themselves
  // and pay for the extra instead of needing a call to sort it out later.
  const [customMeters, setCustomMeters] = useState(meters);
  // Which of the three steps is showing — only one at a time, instead of
  // stacking Fabric + Measurements + Review together in one long scroll
  // next to the sticky gallery, which read as confusing/disconnected.
  // step=measure arrives from the style picker's "Continue" — the customer
  // already browsed styles there, so landing back on product details next
  // felt redundant; jump straight into measurements instead.
  const [activeTab, setActiveTab] = useState(
    searchParams.get("step") === "measure" || preselectedFabric ? "measure" : "fabric"
  );

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
  const selectedExtraWork = extraWorkOptions.filter((o) => extraWork.includes(o.id));
  const extraWorkCost = selectedExtraWork.reduce((sum, o) => sum + Number(o.price || 0), 0);
  const totalPrice = stitchingVariant.price + fabricCost + extraWorkCost;
  const fabricChosen = ownFabric || Boolean(selectedVariant);

  const chooseFabric = (id) => {
    setSelectedFabricId(id);
    setSelectedVariantId(compatibleFabrics.find((f) => f.id === id)?.variants[0]?.id || null);
    setOwnFabric(false);
    setCustomMeters(meters);
    setShowFabricPicker(false);
    setActiveTab("measure");
  };
  const chooseOwnFabric = () => {
    setSelectedFabricId(null);
    setSelectedVariantId(null);
    setOwnFabric(true);
    setCustomMeters(meters);
    setShowFabricPicker(false);
    setActiveTab("measure");
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
      ...(measurementType === "manual"
        ? Object.fromEntries(measurementSections.map((s) => [s.key, sectionsData[s.key] || {}]))
        : {}),
      // Snapshot label + price at order time, not just the option id — admin
      // can rename/reprice/delete extra work options later without corrupting
      // what past orders actually show and charged.
      extraWork: selectedExtraWork.map((o) => ({ label: o.label, price: o.price })),
    },
    notes: notes || null,
  });

  const validateMeasurements = () => {
    if (measurementType === "manual") {
      for (const s of measurementSections) {
        const data = sectionsData[s.key] || {};
        if (data._forChild) {
          if (!data.age) {
            showToast(`Please select the age for ${s.type.label}.`, "error");
            setActiveTab("measure");
            return false;
          }
        } else {
          const requiredFields = (s.type?.fields || []).filter((f) => f.type !== "age" && f.required !== false);
          for (const f of requiredFields) {
            if (!data[f.key] || String(data[f.key]).trim() === "") {
              showToast(`Please fill in the required field: ${s.type.label} - ${f.label}`, "error");
              setActiveTab("measure");
              return false;
            }
          }
        }
      }
    }
    return true;
  };

  const handleAdd = () => {
    if (!fabricChosen) return;
    if (!validateMeasurements()) return;
    addToCart(buildCartItem(), 1);
    showToast(`${product.name} added to your bag.`);
    setDrawerOpen(true);
  };

  const handleBuyNow = () => {
    if (!fabricChosen) return;
    if (!validateMeasurements()) return;
    addToCart(buildCartItem(), 1);
    setDrawerOpen(false);
    router.push("/checkout");
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <FlowStepper current={fabricChosen ? "measure" : "fabric"} />

      {/* Price block */}
      <div className="flex flex-wrap items-baseline gap-3">
        <span className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gold-600 via-gold-500 to-gold-700">
          ₹{totalPrice.toLocaleString("en-IN")}
        </span>
        <span className="text-sm sm:text-base font-bold text-ink/60">
          ₹{stitchingVariant.price.toLocaleString("en-IN")} stitching
          {Boolean(selectedVariant) && ` + fabric (${customMeters}m)`}
          {extraWorkCost > 0 && ` + extra work`}
        </span>
      </div>

      <StepTabs
        tabs={[
          { key: "fabric", number: 1, label: "Fabric" },
          { key: "measure", number: 2, label: "Measurements" },
          ...(fabricChosen ? [{ key: "review", number: 3, label: "Review" }] : []),
        ]}
        active={activeTab}
        onChange={setActiveTab}
      />

      {/* Step 1: Fabric choice — grid + own-fabric option, plus (once a catalog
          fabric is picked) its color and meters-needed, all grouped in one card
          so the whole "what fabric am I getting" decision reads as one step */}
      {activeTab === "fabric" && (
      <div className="space-y-4 rounded-2xl border border-gold-400/15 bg-white p-5 shadow-soft">
        <div>
          <StepHeading number={1} icon={Shirt}>Choose Your Fabric</StepHeading>
          {showFabricPicker && (
            <p className="-mt-1.5 pl-[1.875rem] text-sm font-bold text-ink/60">
              {compatibleFabrics.length > 0
                ? `${compatibleFabrics.length} fabric${compatibleFabrics.length === 1 ? "" : "s"} available, or send your own`
                : "Send your own fabric for this stitching order"}
            </p>
          )}
        </div>

        {/* Fabric already chosen (arrived from the fabric page) — show a
            compact confirmation instead of re-asking the customer to pick. */}
        {!showFabricPicker && fabricChosen && (
          <button
            type="button"
            onClick={() => setShowFabricPicker(true)}
            className="group flex w-full items-center gap-3.5 rounded-2xl border border-gold-400/30 bg-white p-3.5 text-left shadow-soft transition-all duration-300 hover:border-gold-400/50 hover:shadow-gold"
          >
            <span className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white border border-ink/10">
              {selectedVariant?.image ? (
                <Image src={selectedVariant.image} alt="" fill sizes="56px" className="object-cover" />
              ) : (
                <PackageCheck className="h-6 w-6 text-gold-600" />
              )}
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gold-gradient text-ink shadow-gold">
                <Check className="h-3 w-3" strokeWidth={2.75} />
              </span>
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[10px] font-bold uppercase tracking-widest text-gold-600">Fabric Selected</span>
              <span className="block truncate text-base font-bold text-ink">{fabricDisplayName}</span>
            </span>
            <span className="shrink-0 text-xs font-bold uppercase tracking-widest text-gold-600 group-hover:underline">Change</span>
          </button>
        )}

        {showFabricPicker && compatibleFabrics.length > 0 && (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {compatibleFabrics.map((f, i) => {
              const cardVariant = f.id === selectedFabricId && selectedVariant ? selectedVariant : f.variants[0];
              const isSelected = selectedFabricId === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => chooseFabric(f.id)}
                  className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-white text-left shadow-soft transition-all duration-500 animate-fadeUp opacity-0 ${
                    isSelected
                      ? "border-gold-400 shadow-gold ring-2 ring-gold-400/30"
                      : "border-ink/10 hover:-translate-y-1 hover:border-gold-400/40 hover:shadow-gold"
                  }`}
                  style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}
                >
                  <div className="relative aspect-square w-full overflow-hidden bg-white">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(202,161,75,0.04),transparent_70%)] pointer-events-none" />
                    {cardVariant.image ? (
                      <Image
                        src={cardVariant.image}
                        alt={f.name}
                        fill
                        sizes="120px"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-ink/15">
                        <Shirt className="h-7 w-7" strokeWidth={1.25} />
                      </div>
                    )}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/25 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    {f.variants.length > 1 && (
                      <span className="absolute left-1.5 top-1.5 rounded-full bg-gold-gradient px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-ink shadow-gold">
                        {f.variants.length} Colors
                      </span>
                    )}
                    {isSelected ? (
                      <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gold-gradient text-ink shadow-gold">
                        <Check className="h-3 w-3" strokeWidth={2.5} />
                      </span>
                    ) : (
                      <span className="pointer-events-none absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full border border-ink/10 bg-white/85 text-ink/50 opacity-0 shadow-sm backdrop-blur-md transition-all duration-300 group-hover:border-gold-400/40 group-hover:text-gold-600 group-hover:opacity-100">
                        <ArrowRight className="h-2.5 w-2.5" />
                      </span>
                    )}
                  </div>
                  <div className="space-y-0 p-2">
                    <p className="truncate text-xs font-bold text-ink group-hover:text-gold-700 transition-colors duration-300">{f.name}</p>
                    <p className="text-[11px] font-bold text-gold-600">
                      {f.variants.length > 1 ? "From " : ""}₹{f.variants[0].price}<span className="font-semibold text-ink/50">/m</span>
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {showFabricPicker && (
          <>
            {/* "Send my own" is its own compact row, not a grid tile — otherwise
                it either stretches to fill a leftover slot or strands alone in a
                near-empty row, both of which look broken and add dead height. */}
            <button
              type="button"
              onClick={chooseOwnFabric}
              className={`flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left transition-all duration-300 ${
                ownFabric
                  ? "border-gold-400 bg-gold-400/10 shadow-gold ring-2 ring-gold-400/30"
                  : "border-dashed border-ink/20 bg-white hover:border-gold-400/40 hover:shadow-soft"
              }`}
            >
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${ownFabric ? "bg-gold-400/25 text-gold-700" : "bg-gold-400/10 text-gold-600"}`}>
                {ownFabric ? <Check className="h-4.5 w-4.5" strokeWidth={2.5} /> : <PackageCheck className="h-4.5 w-4.5" />}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-bold leading-snug text-ink">I'll Send My Own Fabric</span>
                <span className="block text-xs font-semibold text-ink/50">No fabric charge</span>
              </span>
            </button>

            {compatibleFabrics.length === 0 && (
              <p className="mt-2 text-sm font-semibold text-ink/55">No catalog fabrics mapped to this outfit yet — you can still send your own.</p>
            )}
          </>
        )}

        {/* Once a catalog fabric is picked: its color + how much of it to cut,
            grouped in one white sub-panel so it reads as "fabric details", not
            a separate step */}
        {selectedVariant && (
          <div className="space-y-4 rounded-xl border border-ink/10 bg-white p-4">
            {selectedFabric.variants.length > 1 && (
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gold-600">Select Color</p>
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
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-600">Fabric Needed</p>
                <p className="mt-1 text-xs font-semibold text-ink/55">Standard is {meters}m — increase it if you need extra.</p>
              </div>
              <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-gold-400/20 bg-white px-3 py-1.5">
                <input
                  type="number"
                  step="0.5"
                  min={meters}
                  value={customMeters}
                  onChange={(e) => setCustomMeters(e.target.value === "" ? "" : Number(e.target.value))}
                  onBlur={(e) => setCustomMeters(Math.max(meters, Number(e.target.value) || meters))}
                  className="w-14 rounded-lg border-none bg-transparent text-center text-sm font-semibold text-ink focus:outline-none focus:ring-1 focus:ring-gold-400/30 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  aria-label="Fabric meters needed"
                />
                <span className="text-sm font-semibold text-ink">m</span>
              </div>
            </div>
          </div>
        )}
      </div>
      )}

      {activeTab === "measure" && (
      <MeasurementsStep
        step={2}
        sections={measurementSections}
        sectionsData={sectionsData}
        updateSection={updateSection}
        measurementType={measurementType}
        setMeasurementType={setMeasurementType}
        extraWorkOptions={extraWorkOptions}
        extraWork={extraWork}
        setExtraWork={setExtraWork}
        notes={notes}
        setNotes={setNotes}
      />
      )}

      {/* Step 3: Review — a quick recap before committing, so the customer
          isn't hunting back through steps 1-2 to double-check what they picked */}
      {activeTab === "review" && fabricChosen && (
        <div className="space-y-3 rounded-2xl border border-gold-400/15 bg-white p-5 shadow-soft">
          <StepHeading number={3} icon={PackageCheck}>Review &amp; Confirm</StepHeading>
          <div className="space-y-2.5 rounded-xl border border-ink/10 bg-white p-4 text-sm">
            <div className="flex items-start justify-between gap-3">
              <span className="font-semibold text-ink/55">Fabric</span>
              <span className="text-right font-bold text-ink">
                {fabricDisplayName}
                {selectedVariant && <span className="font-semibold text-ink/45"> · {customMeters}m</span>}
              </span>
            </div>
            {measurementSections.map((s) => {
              const data = sectionsData[s.key] || {};
              const isChild = data._forChild;
              return (
                <div key={s.key} className="flex items-start justify-between gap-3">
                  <span className="font-semibold text-ink/55">{s.type.label}</span>
                  <span className="text-right font-bold text-ink">
                    {measurementType === "reference_garment"
                      ? "From reference garment"
                      : isChild
                        ? data.age
                          ? `Child · ${data.age} yr${data.age === "1" ? "" : "s"}`
                          : "Child — age not picked yet"
                        : "Custom measurements"}
                  </span>
                </div>
              );
            })}
            {selectedExtraWork.length > 0 && (
              <div className="flex items-start justify-between gap-3">
                <span className="font-semibold text-ink/55">Extra Work</span>
                <span className="text-right font-bold text-ink">{selectedExtraWork.map((o) => o.label).join(", ")}</span>
              </div>
            )}
            <div className="flex items-center justify-between border-t border-ink/10 pt-2.5">
              <span className="font-bold text-gold-600">Total</span>
              <span className="font-bold text-gold-700">₹{totalPrice.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>
      )}

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
      {!fabricChosen && <p className="text-center text-sm font-bold text-ink/55 -mt-4">Choose a fabric (or "send my own") to continue.</p>}
    </div>
  );
}

function SimplePurchasePanel({ product, variants, compatibleOutfits, garmentTypesByKey, brandInfo }) {
  const router = useRouter();
  const ctx = useProductVariant();
  const [localSelectedId, setLocalSelectedId] = useState(variants[0]?.id);
  const selectedId = ctx ? ctx.selectedId : localSelectedId;
  const setSelectedId = ctx ? ctx.setSelectedId : setLocalSelectedId;
  const [quantity, setQuantity] = useState(1);
  const { addToCart, setDrawerOpen } = useCart();
  const { showToast } = useToast();
  const hasStitching = product.product_type === "fabric" && compatibleOutfits.length > 0;
  // Buying the raw fabric and browsing what it can be stitched into are two
  // different intents — tabs keep them apart instead of stacking both flows
  // into one long scroll where the stitching options end up buried below.
  const [activeTab, setActiveTab] = useState("buy");

  const selected = variants.find((v) => v.id === selectedId) || variants[0];
  const inStock = selected && selected.stock_quantity > 0;

  // "Both" mode (color + size): colors are picked first, then only the
  // sizes that exist for that color are offered — two steps instead of one
  // flat list, since a single variant row is a specific color+size pair.
  const isBoth = product.variantLabel === "Both";
  const colorGroups = isBoth
    ? Array.from(new Map(variants.map((v) => [v.color_name, v])).values())
    : [];
  const currentColor = selected?.color_name ?? colorGroups[0]?.color_name;
  const sizesForColor = isBoth ? variants.filter((v) => v.color_name === currentColor) : [];
  const pickColor = (colorName) => {
    const candidates = variants.filter((v) => v.color_name === colorName);
    const preferred = candidates.find((v) => v.stock_quantity > 0) || candidates[0];
    if (preferred) setSelectedId(preferred.id);
  };

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
        {product.product_type === "fabric" && <span className="text-base sm:text-lg font-bold text-ink/60">/ meter</span>}
        {selected.original_price && selected.original_price > selected.price && (
          <>
            <span className="text-base sm:text-lg font-bold text-ink/50 line-through">
              ₹{selected.original_price.toLocaleString("en-IN")}
            </span>
            <span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
              Save {Math.round(((selected.original_price - selected.price) / selected.original_price) * 100)}%
            </span>
          </>
        )}
      </div>

      {(!hasStitching || activeTab === "buy") && (
      <>
      {/* Both mode: color swatches first, then only the sizes that exist for
          the chosen color. Plain Size/Color mode keeps the original single
          row of pills further below, unchanged. */}
      {isBoth && (
        <>
          {colorGroups.length > 1 && (
            <div>
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gold-600">Select Color</p>
              <div className="flex flex-wrap gap-2">
                {colorGroups.map((v) => (
                  <button
                    key={v.color_name}
                    onClick={() => pickColor(v.color_name)}
                    className={`flex items-center gap-1.5 rounded-2xl border px-5 py-2.5 text-sm sm:text-base transition-all duration-300 ${
                      currentColor === v.color_name
                        ? "bg-gold-gradient text-ink border-transparent font-semibold shadow-gold/20 scale-[1.02]"
                        : "border-ink/10 bg-white text-ink/65 hover:border-gold-400/30 hover:text-ink"
                    }`}
                  >
                    {currentColor === v.color_name && <Check className="h-3.5 w-3.5" />}
                    {v.color_hex && (
                      <span
                        className="h-5 w-5 shrink-0 rounded-full border border-ink/15"
                        style={{ backgroundColor: v.color_hex }}
                      />
                    )}
                    {v.color_name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {sizesForColor.length > 0 && (
            <div>
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gold-600">Select Size</p>
              <div className="flex flex-wrap gap-2">
                {sizesForColor.map((v) => (
                  <button
                    key={v.id}
                    disabled={v.stock_quantity <= 0}
                    onClick={() => setSelectedId(v.id)}
                    className={`flex items-center gap-1.5 rounded-2xl border px-5 py-2.5 text-sm sm:text-base transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-20 ${
                      selectedId === v.id
                        ? "bg-gold-gradient text-ink border-transparent font-semibold shadow-gold/20 scale-[1.02]"
                        : "border-ink/10 bg-white text-ink/65 hover:border-gold-400/30 hover:text-ink"
                    }`}
                  >
                    {selectedId === v.id && <Check className="h-3.5 w-3.5" />}
                    {v.size_name}
                  </button>
                ))}
              </div>
              {!inStock && <p className="mt-3 text-sm text-red-400 font-semibold">This size is out of stock.</p>}
            </div>
          )}
        </>
      )}

      {/* Size buttons — skipped entirely when there's only one variant (nothing to choose) */}
      {!isBoth && variants.length > 1 && (
        <div>
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gold-600">
            Select {product.variantLabel || "Size"}
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
                    : "border-ink/10 bg-white text-ink/65 hover:border-gold-400/30 hover:text-ink"
                }`}
              >
                {selectedId === v.id && <Check className="h-3.5 w-3.5" />}
                {v.color_hex && (
                  <span
                    className="h-5 w-5 shrink-0 rounded-full border border-ink/15"
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
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gold-600">
          {product.product_type === "fabric" ? "Meters" : "Quantity"}
        </p>
        <div className="flex w-fit items-center justify-between rounded-full border border-gold-400/20 bg-white px-5 py-3">
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
          <p className="mt-2 text-sm sm:text-base font-bold text-ink/70">
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
          `Hi Taj Tailor, I'd like to order ${product.name} (${selected.variant_name}).`,
          brandInfo
        )}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 w-full text-center text-sm font-bold text-ink/60 hover:text-emerald-600 transition-colors py-2.5 border border-dashed border-ink/15 rounded-2xl hover:border-emerald-500/30 bg-white"
      >
        <MessageSquare className="w-3.5 h-3.5 text-emerald-500" /> Prefer to order on WhatsApp instead?
      </a>

      {/* Spacer so the fixed bottom tab bar never covers the WhatsApp link */}
      <div className="h-20" />
      </>
      )}

      {/* Fixed bottom tab bar — replaces the old inline pill tabs + floating
          "want this stitched" nudge with one persistent switcher between
          buying the raw fabric and browsing what it can be stitched into. */}
      {hasStitching && (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gold-400/20 bg-white/95 px-4 py-3 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur-md">
          <div className="mx-auto max-w-wrap">
            <StepTabs
              tabs={[
                { key: "buy", number: 1, label: "Buy Fabric" },
                { key: "stitch", number: 2, label: "Get It Stitched" },
              ]}
              active={activeTab}
              onChange={setActiveTab}
            />
          </div>
        </div>
      )}

      {/* Fabric-only: what can be made from this fabric. Products sharing a
          garment_type (e.g. two kurta variants) collapse into one category
          card with a "N styles" count badge — click opens a dedicated picker
          page instead of cramming every style inline here. */}
      {hasStitching && activeTab === "stitch" && (() => {
        const outfitGroups = groupOutfitsByGarmentType(compatibleOutfits, garmentTypesByKey);
        return (
          <>
            <div className="rounded-2xl border border-gold-400/15 bg-white p-5 shadow-soft">
              <div className="mb-4">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gold-600">
                  <Shirt className="h-4 w-4" /> What Can Be Made From This Fabric
                </p>
                <p className="mt-1 pl-6 text-sm font-bold text-ink/60">
                  {outfitGroups.length} outfit{outfitGroups.length === 1 ? "" : "s"} tailored from this fabric — pick one to continue
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {outfitGroups.map((g, i) => {
                  const groupImage = garmentTypesByKey.get(g.items[0].garmentType)?.image_url || g.items[0].image || null;
                  const href = `/shop/${product.slug}/choose/${g.items[0].garmentType}?variant=${selected.id}`;
                  const fromPrice = Math.min(...g.items.map((o) => o.price ?? Infinity));
                  return (
                    <a
                      key={g.key}
                      href={href}
                      className="group relative flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-soft transition-all duration-500 hover:-translate-y-1 hover:border-gold-400/40 hover:shadow-gold animate-fadeUp opacity-0"
                      style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}
                    >
                      <div className="relative aspect-square w-full overflow-hidden bg-white">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(202,161,75,0.04),transparent_70%)] pointer-events-none" />
                        {groupImage ? (
                          <Image
                            src={groupImage}
                            alt={g.label}
                            fill
                            sizes="150px"
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-ink/15">
                            <Shirt className="h-8 w-8" strokeWidth={1.1} />
                          </div>
                        )}
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/25 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                        <span className="absolute left-1.5 top-1.5 rounded-full bg-gold-gradient px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-ink shadow-gold">
                          {g.items.length} Option{g.items.length === 1 ? "" : "s"}
                        </span>
                        <span className="pointer-events-none absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full border border-ink/10 bg-white/85 text-ink/50 opacity-0 shadow-sm backdrop-blur-md transition-all duration-300 group-hover:border-gold-400/40 group-hover:text-gold-600 group-hover:opacity-100">
                          <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                      <div className="space-y-0.5 p-2.5">
                        <p className="truncate text-sm font-bold text-ink group-hover:text-gold-700 transition-colors duration-300">
                          {g.items.length === 1 ? g.items[0].name : g.label}
                        </p>
                        {Number.isFinite(fromPrice) && (
                          <p className="text-xs font-bold text-gold-600">
                            {g.items.length > 1 ? "From " : ""}₹{fromPrice.toLocaleString("en-IN")}
                            <span className="font-semibold text-ink/50"> stitching</span>
                          </p>
                        )}
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
            {/* Spacer so the fixed bottom tab bar never covers the last row */}
            <div className="h-20" />
          </>
        );
      })()}
    </div>
  );
}

export default function ProductPurchasePanel({
  product,
  variants,
  compatibleOutfits = [],
  compatibleFabrics = [],
  garmentTypes = [],
  extraWorkOptions = [],
  brandInfo,
}) {
  const garmentTypesByKey = new Map(garmentTypes.map((g) => [g.key, g]));
  if (product.product_type === "outfit") {
    return (
      <OutfitConfigurator
        product={product}
        variants={variants}
        compatibleFabrics={compatibleFabrics}
        garmentTypesByKey={garmentTypesByKey}
        extraWorkOptions={extraWorkOptions}
      />
    );
  }
  return <SimplePurchasePanel product={product} variants={variants} compatibleOutfits={compatibleOutfits} garmentTypesByKey={garmentTypesByKey} brandInfo={brandInfo} />;
}
