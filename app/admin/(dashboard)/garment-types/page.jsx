import Link from "next/link";
import { Plus, Shirt, CheckCircle2, EyeOff, PackageX } from "lucide-react";
import { getAllGarmentTypesAdmin } from "@/actions/admin/garmentTypes";
import GarmentTypeRow from "./_components/GarmentTypeRow";
import GarmentTypeCard from "./_components/GarmentTypeCard";

export const metadata = { title: "Garment Types" };

export default async function AdminGarmentTypesPage() {
  const garmentTypes = await getAllGarmentTypesAdmin();

  const activeCount = garmentTypes.filter((g) => g.is_active).length;
  const emptyCount = garmentTypes.filter((g) => g.product_count === 0).length;

  const stats = [
    { label: "Total Types", value: garmentTypes.length, icon: Shirt },
    { label: "Active", value: activeCount, icon: CheckCircle2 },
    { label: "Hidden", value: garmentTypes.length - activeCount, icon: EyeOff },
    { label: "Unused", value: emptyCount, icon: PackageX },
  ];

  return (
    <div>
      {/* Header Panel */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gold-400/10 pb-6">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink">
            Garment <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-600 via-gold-500 to-gold-700">Types</span>
          </h1>
          <p className="text-base text-ink/50 font-semibold mt-1">
            Manage outfit families (Kurta, Pajama, Trouser…) — add new types here instead of hardcoding them.
          </p>
        </div>
        <Link
          href="/admin/garment-types/new"
          className="btn-gold group flex w-full items-center justify-center gap-1.5 px-6 py-3.5 text-xs font-semibold tracking-widest uppercase shadow-[0_4px_15px_rgba(212,163,89,0.12)] hover:shadow-[0_4px_20px_rgba(212,163,89,0.25)] hover:-translate-y-0.5 transition-all duration-300 sm:w-auto"
        >
          <Plus className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" /> New Garment Type
        </Link>
      </div>

      {/* Stat Strip */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="group relative overflow-hidden flex items-center gap-3 rounded-2xl border border-gold-400/10 bg-white px-4 py-3.5 shadow-soft transition-all duration-500 hover:-translate-y-1 hover:border-gold-400/30 hover:shadow-gold"
          >
            <span className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300 transition-transform duration-500 group-hover:scale-x-100" />
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-400/10 text-gold-600 shadow-gold transition-transform duration-500 group-hover:scale-110">
              <s.icon className="h-4.5 w-4.5" />
            </div>
            <div className="min-w-0">
              <p className="font-display text-2xl font-bold leading-none text-transparent bg-clip-text bg-gradient-to-r from-gold-600 via-gold-500 to-gold-700">{s.value}</p>
              <p className="truncate text-xs font-semibold uppercase tracking-wide text-ink/45 mt-1">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table Container (sm and up) */}
      <div className="hidden overflow-x-auto rounded-[2rem] border border-gold-400/10 bg-white p-6 backdrop-blur-md shadow-soft sm:block md:p-8">
        {garmentTypes.length === 0 ? (
          <p className="py-12 text-center text-sm text-ink/45">No garment types yet — create your first one.</p>
        ) : (
          <table className="w-full min-w-[640px] text-left border-collapse">
            <thead>
              <tr className="border-b border-gold-400/10 text-sm uppercase tracking-widest text-ink/45 font-semibold">
                <th className="pb-4 font-medium pl-2">Label</th>
                <th className="pb-4 font-medium">Key</th>
                <th className="pb-4 font-medium">Measurement Fields</th>
                <th className="pb-4 font-medium">Products</th>
                <th className="pb-4 font-medium">Status</th>
                <th className="pb-4 font-medium text-right pr-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-400/5">
              {garmentTypes.map((g) => (
                <GarmentTypeRow key={g.id} garmentType={g} />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Card List (mobile only) */}
      <div className="rounded-[2rem] border border-gold-400/10 bg-white p-4 backdrop-blur-md shadow-soft sm:hidden">
        {garmentTypes.length === 0 ? (
          <p className="py-12 text-center text-sm text-ink/45">No garment types yet — create your first one.</p>
        ) : (
          <ul className="space-y-3">
            {garmentTypes.map((g) => (
              <GarmentTypeCard key={g.id} garmentType={g} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
