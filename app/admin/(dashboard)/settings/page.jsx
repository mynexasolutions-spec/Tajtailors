import { getSiteSettings } from "@/actions/settings";
import SettingsForm from "./_components/SettingsForm";

export const metadata = { title: "Site Settings" };

export default async function SettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <div className="mb-8 border-b border-gold-400/10 pb-6">
        <h1 className="font-display text-3xl font-light text-ink">
          Site <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gold-600 via-gold-500 to-gold-700">Settings</span>
        </h1>
        <p className="text-sm text-ink/50 font-light mt-1">Manage contact details, social links, and brand information.</p>
      </div>

      <SettingsForm initialSettings={settings} />
    </div>
  );
}
