// Shared between the admin order detail page and the customer-facing "My
// Account" order detail page so both render a stitching order's fabric,
// measurements and add-on info identically instead of drifting apart.

// Best-effort labels for known style/fit keys from the original hardcoded
// Kurta/Pajama field sets — admin-added custom fields/styles (via Garment
// Types) fall back to their raw key, which is still readable enough.
export const STYLE_LABELS = {
  pathani: "Pathani Kurta", plain: "Plain Kurta", plain_half_placket: "Plain Half-Placket Kurta",
  jawahar_cut: "Jawahar Cut", shirt: "Shirt Style",
  pant_cut: "Pant-Cut", choodidar: "Choodidar", mughlai_shalwar: "Mughlai Shalwar", nadawar: "Nada-vaar (Drawstring)",
  straight: "Straight", not_straight: "Not Straight",
};

function titleCase(key) {
  return key.charAt(0).toUpperCase() + key.slice(1);
}

// Measurements are stored per section (kurta/pajama/pant, or a custom
// garment type's own key, including a Pajama-for-Kurta add-on) as
// { style, ...fieldKey: value }. Rendering walks every section generically
// instead of assuming kurta/pajama/pant are the only possibilities, so
// admin-defined garment types (e.g. "Kids Kurta") display correctly too.
export function measurementLines(m) {
  if (!m) return [];
  const lines = [];

  Object.entries(m).forEach(([sectionKey, section]) => {
    if (sectionKey === "garmentType" || sectionKey === "extraWork" || sectionKey === "addOn") return;
    if (!section || typeof section !== "object") return;
    const sectionLabel = titleCase(sectionKey);

    Object.entries(section).forEach(([fieldKey, value]) => {
      if (!value) return;
      if (fieldKey === "style") {
        lines.push([`${sectionLabel} Style`, STYLE_LABELS[value] || value]);
      } else if (fieldKey === "fit") {
        lines.push([`${sectionLabel} Fit`, STYLE_LABELS[value] || value]);
      } else if (fieldKey === "frontPlacket") {
        lines.push(["Front Placket", value === "yes" ? "Yes" : "No"]);
      } else if (value === "yes" || value === "no") {
        lines.push([`${sectionLabel} ${titleCase(fieldKey)}`, value === "yes" ? "Yes" : "No"]);
      } else if (fieldKey.toLowerCase().includes("age")) {
        lines.push([`${sectionLabel} Age`, `${value} yr${Number(value) === 1 ? "" : "s"}`]);
      } else {
        lines.push([`${sectionLabel} ${titleCase(fieldKey)}`, `${value}"`]);
      }
    });
  });

  return lines;
}

// Turns a stitching item's { stitching, fabric, extraWork, addOnStitching,
// addOnFabric } into ordered [label, amount] pairs, skipping zero amounts —
// used everywhere a total price needs explaining (checkout summary, admin
// and customer order details) so it never reads as one unexplained lump sum.
export function priceBreakdownLines(breakdown) {
  if (!breakdown) return [];
  const rows = [
    ["Stitching", breakdown.stitching],
    ["Fabric", breakdown.fabric],
    ["Extra Work", breakdown.extraWork],
    ["Add-on Stitching", breakdown.addOnStitching],
    ["Add-on Fabric", breakdown.addOnFabric],
  ];
  return rows.filter(([, amount]) => Number(amount) > 0);
}
