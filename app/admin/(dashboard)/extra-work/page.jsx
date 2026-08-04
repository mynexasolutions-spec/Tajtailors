import { getAllExtraWorkAdmin } from "@/actions/admin/extraWork";
import ExtraWorkManager from "./_components/ExtraWorkManager";

export const metadata = { title: "Extra Work Options" };

export default async function AdminExtraWorkPage() {
  const options = await getAllExtraWorkAdmin();

  return (
    <div>
      <div className="mb-8 border-b border-gold-400/10 pb-6">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink">
          Extra <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-600 via-gold-500 to-gold-700">Work</span>
        </h1>
        <p className="text-base text-ink/50 font-semibold mt-1">
          Add-ons customers can pick on the Measurements step of any outfit, each with its own price.
        </p>
      </div>

      <ExtraWorkManager initialOptions={options} />
    </div>
  );
}
