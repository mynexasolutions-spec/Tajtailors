// "custom" (the default) means: the product page renders THIS type's own
// Style Options + Measurement Fields (configured below). The two "Set"
// kinds are the only special case — they combine the canonical "kurta" and
// "pajama"/"pant" garment types' fields into one product's measurements,
// instead of using this type's own fields.
export const MEASUREMENT_KIND_OPTIONS = [
  { value: "custom", label: "Its own fields (style options + measurements below)" },
  { value: "kurta_pajama_set", label: "Kurta + Pajama Set (combines the Kurta and Pajama types)" },
  { value: "kurta_pant_set", label: "Kurta + Pant Set (combines the Kurta and Pant types)" },
];

// Legacy values from before every type had its own fields — they behave
// identically to "custom" now, just normalized here for display.
const LEGACY_ALIASES = { kurta: "custom", pajama: "custom", pant: "custom" };

export function normalizeMeasurementKind(kind) {
  return LEGACY_ALIASES[kind] || kind || "custom";
}

export const MEASUREMENT_KIND_LABELS = {
  ...Object.fromEntries(MEASUREMENT_KIND_OPTIONS.map((o) => [o.value, o.label])),
  kurta: "Its own fields (style options + measurements below)",
  pajama: "Its own fields (style options + measurements below)",
  pant: "Its own fields (style options + measurements below)",
};
