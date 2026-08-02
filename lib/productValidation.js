// Shared between the admin product form (client-side, instant feedback) and
// the create/update server actions (last line of defense against bad data).
export function validateVariants(variants) {
  if (!variants || variants.length === 0) return "Add at least one bottle size.";

  for (let i = 0; i < variants.length; i++) {
    const v = variants[i];
    const label = v.variant_name && String(v.variant_name).trim() ? `"${v.variant_name}"` : `Bottle size #${i + 1}`;

    if (!v.variant_name || !String(v.variant_name).trim()) {
      return `${label}: please enter a size name (e.g. 30ml).`;
    }
    if (v.price === "" || v.price == null || Number.isNaN(Number(v.price)) || Number(v.price) <= 0) {
      return `${label}: please enter a valid price.`;
    }
    if (v.stock_quantity === "" || v.stock_quantity == null || Number.isNaN(Number(v.stock_quantity)) || Number(v.stock_quantity) < 0) {
      return `${label}: please enter a stock quantity.`;
    }
  }

  const names = variants.map((v) => String(v.variant_name).trim().toLowerCase());
  const dupe = names.find((n, i) => names.indexOf(n) !== i);
  if (dupe) return `Duplicate size "${dupe}" — each bottle size must be unique.`;

  return null;
}
