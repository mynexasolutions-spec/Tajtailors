"use client";

import { createContext, useContext, useState } from "react";

// Shared selected-size state so the gallery (which needs to know which size
// is active in order to show that size's mapped images) and the purchase
// panel (which owns the size picker) can stay in sync despite living in
// separate branches of the product detail page's layout.
const ProductVariantContext = createContext(null);

export function ProductVariantProvider({ variants, children }) {
  const [selectedId, setSelectedId] = useState(variants?.[0]?.id ?? null);
  const selected = variants?.find((v) => v.id === selectedId) || variants?.[0] || null;

  return (
    <ProductVariantContext.Provider value={{ selected, selectedId, setSelectedId }}>
      {children}
    </ProductVariantContext.Provider>
  );
}

export function useProductVariant() {
  return useContext(ProductVariantContext);
}
