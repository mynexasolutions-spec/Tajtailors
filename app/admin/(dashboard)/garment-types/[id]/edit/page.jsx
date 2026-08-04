import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { getGarmentTypeById } from "@/actions/admin/garmentTypes";
import GarmentTypeForm from "../../_components/GarmentTypeForm";

export const metadata = { title: "Edit Garment Type" };

export default async function EditGarmentTypePage({ params }) {
  const { id } = await params;
  const garmentType = await getGarmentTypeById(id);
  if (!garmentType) notFound();

  return (
    <div>
      <Link
        href="/admin/garment-types"
        className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-ink/45 transition-colors hover:text-gold-600"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Garment Types
      </Link>
      <h1 className="mb-6 font-display text-3xl font-light text-ink">
        Edit <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gold-600 via-gold-500 to-gold-700">{garmentType.label}</span>
      </h1>
      <GarmentTypeForm garmentType={garmentType} />
    </div>
  );
}
