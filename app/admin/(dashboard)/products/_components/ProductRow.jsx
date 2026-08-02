"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { deleteProduct } from "@/actions/admin/products";

export default function ProductRow({ product }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  const handleDelete = () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    startTransition(async () => {
      await deleteProduct(product.id);
      router.refresh();
    });
  };

  const stockBadge =
    product.totalStock === 0
      ? "bg-red-500/10 text-red-600 border-red-500/20"
      : product.totalStock <= 5
      ? "bg-amber-500/10 text-amber-700 border-amber-500/20"
      : "bg-ink/5 text-ink/60 border-ink/10";

  return (
    <tr className="group/row transition-colors duration-300 hover:bg-ivory-deep">
      <td className="py-4 pr-4 pl-2">
        <div className="flex items-center gap-3">
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-ink/10 bg-ivory-deep group-hover/row:border-gold-400/40 transition-colors duration-300">
            {product.featured_image_url && (
              <Image
                src={product.featured_image_url}
                alt=""
                fill
                sizes="44px"
                className="object-cover transition-transform duration-500 group-hover/row:scale-[1.05]"
              />
            )}
          </div>
          <span className="text-sm font-medium text-ink group-hover/row:text-gold-700 transition-colors duration-300">
            {product.name}
          </span>
        </div>
      </td>
      <td className="py-4 pr-4 text-sm text-ink/50">{product.categoryName || "—"}</td>
      <td className="py-4 pr-4 text-sm font-medium text-ink/70">
        {product.minPrice != null ? `₹${product.minPrice.toLocaleString("en-IN")}` : "—"}
      </td>
      <td className="py-4 pr-4">
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold border ${stockBadge}`}>
          {product.totalStock}
        </span>
      </td>
      <td className="py-4 pr-4">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold tracking-wider uppercase border ${
            product.is_active
              ? "bg-green-500/10 text-green-700 border-green-500/20"
              : "bg-ink/5 text-ink/45 border-ink/10"
          }`}
        >
          {product.is_active ? "Active" : "Hidden"}
        </span>
      </td>
      <td className="py-4 pr-2 text-right">
        <div className="flex items-center justify-end gap-1.5">
          <Link
            href={`/admin/products/${product.id}/edit`}
            className="rounded-xl p-2.5 text-ink/45 hover:text-gold-600 hover:bg-gold-400/10 border border-transparent hover:border-gold-400/15 transition-all duration-300"
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </Link>
          <button
            onClick={handleDelete}
            disabled={pending}
            className={`rounded-xl p-2.5 border border-transparent transition-all duration-300 ${
              confirming
                ? "text-red-600 bg-red-500/10 border-red-500/20"
                : "text-ink/45 hover:text-red-600 hover:bg-red-500/10 hover:border-red-500/20"
            }`}
            title={confirming ? "Click again to confirm" : "Delete"}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
