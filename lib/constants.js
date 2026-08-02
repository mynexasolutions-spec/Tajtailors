// Fallback brand constants (used if DB settings unavailable)
const BRAND_DEFAULTS = {
  name: "Taj Tailor",
  tagline: "Ghar Baithe Perfect Fitting",
  email: "tajtailor@gmail.com",
  whatsappNumber: "911234567890",
  whatsappDisplay: "+91 12345 67890",
  callNumber: "911234567890",
  callDisplay: "+91 12345 67890",
  instagram: "https://www.instagram.com/",
  facebook: "https://www.facebook.com/",
  youtube: "https://youtube.com/",
};

export const BRAND = BRAND_DEFAULTS;

// Helper to convert DB settings to BRAND object
export function settingsToBrand(dbSettings) {
  if (!dbSettings) return BRAND;
  return {
    name: dbSettings.brand_name?.value || BRAND_DEFAULTS.name,
    tagline: dbSettings.tagline?.value || BRAND_DEFAULTS.tagline,
    email: dbSettings.email?.value || BRAND_DEFAULTS.email,
    whatsappNumber: dbSettings.whatsapp_number?.value || BRAND_DEFAULTS.whatsappNumber,
    whatsappDisplay: dbSettings.whatsapp_display?.value || BRAND_DEFAULTS.whatsappDisplay,
    callNumber: dbSettings.call_number?.value || BRAND_DEFAULTS.callNumber,
    callDisplay: dbSettings.call_display?.value || BRAND_DEFAULTS.callDisplay,
    instagram: dbSettings.instagram_url?.value || BRAND_DEFAULTS.instagram,
    facebook: dbSettings.facebook_url?.value || BRAND_DEFAULTS.facebook,
    youtube: dbSettings.youtube_url?.value || BRAND_DEFAULTS.youtube,
  };
}

export function whatsappLink(message, brandInfo = BRAND) {
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${brandInfo.whatsappNumber}${text}`;
}

export function callLink(brandInfo = BRAND) {
  return `tel:${brandInfo.callNumber}`;
}

export const PRODUCT_TYPES = ["fabric", "kurta", "outfit"];

export const FABRIC_TYPES = [
  "Wash & Wear",
  "Egyptian Cotton",
  "Linen",
  "Boski",
  "Cotton",
  "Khaadi",
];

export const KURTA_SIZES = ["S", "M", "L", "XL", "XXL"];

export const SHIPPING_DEFAULTS = {
  flat_rate: 79,
  free_threshold: 1499,
  cod_charge: 40,
};

export const QUANTITY_DISCOUNT_DEFAULTS = {
  enabled: true,
  tiers: [
    { min_quantity: 1, discount: 0 },
    { min_quantity: 2, discount: 40 },
    { min_quantity: 3, discount: 70 },
    { min_quantity: 4, discount: 100 },
    { min_quantity: 5, discount: 120 },
  ],
};

// Given the total item quantity in a cart, returns the flat rupee discount
// that applies — the highest tier whose min_quantity the cart qualifies for.
// Shared between the server (order totals) and client (cart/checkout display)
// so both always agree on the same number.
export function calculateQuantityDiscount(totalQuantity, quantityDiscount) {
  if (!quantityDiscount?.enabled || !quantityDiscount?.tiers?.length || totalQuantity <= 0) {
    return 0;
  }
  const sorted = [...quantityDiscount.tiers].sort((a, b) => a.min_quantity - b.min_quantity);
  let discount = 0;
  for (const tier of sorted) {
    if (totalQuantity >= tier.min_quantity) discount = tier.discount;
  }
  return discount;
}
