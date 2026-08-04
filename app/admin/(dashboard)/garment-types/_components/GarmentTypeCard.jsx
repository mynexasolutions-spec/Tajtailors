"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { deleteGarmentType } from "@/actions/admin/garmentTypes";
import { MEASUREMENT_KIND_LABELS } from "./measurementKinds";

export default function GarmentTypeCard({ garmentType }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  const handleDelete = () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    startTransition(async () => {
      await deleteGarmentType(garmentType.id);
      router.refresh();
    });
  };

  return (
    <li className="rounded-2xl border border-gold-400/15 bg-white p-4">
      <div className="flex items-start gap-3">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-ink/10 bg-ivory-deep">
          {garmentType.image_url && <Image src={garmentType.image_url} alt="" fill sizes="48px" className="object-cover" />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-ink">{garmentType.label}</p>
          <p className="truncate font-mono text-sm text-ink/40">{garmentType.key}</p>
          <p className="truncate text-xs text-ink/45 mt-0.5">
            {MEASUREMENT_KIND_LABELS[garmentType.measurement_kind] || garmentType.measurement_kind}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Link
            href={`/admin/garment-types/${garmentType.id}/edit`}
            className="rounded-lg p-2 text-ink/45 hover:bg-gold-400/10 hover:text-gold-600"
          >
            <Pencil className="h-4 w-4" />
          </Link>
          <button
            onClick={handleDelete}
            disabled={pending}
            className={`rounded-lg p-2 ${confirming ? "bg-red-500/10 text-red-600" : "text-ink/45 hover:bg-red-500/10 hover:text-red-600"}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold border ${
            garmentType.product_count === 0
              ? "bg-red-500/10 text-red-600 border-red-500/20"
              : "bg-ink/5 text-ink/60 border-ink/10"
          }`}
        >
          {garmentType.product_count} products
        </span>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold tracking-wider uppercase border ${
            garmentType.is_active
              ? "bg-green-500/10 text-green-700 border-green-500/20"
              : "bg-ink/5 text-ink/45 border-ink/10"
          }`}
        >
          {garmentType.is_active ? "Active" : "Hidden"}
        </span>
      </div>
    </li>
  );
}
