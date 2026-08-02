import { getAllHeroSlides } from "@/actions/admin/hero";
import { getSiteSettings } from "@/actions/settings";
import HomeCustomizationTabs from "./_components/HomeCustomizationTabs";

export const metadata = { title: "Home Customization" };

export default async function AdminHomePage() {
  const [slides, settings] = await Promise.all([getAllHeroSlides(), getSiteSettings()]);

  return (
    <div>
      <div className="mb-8 border-b border-gold-400/10 pb-6">
        <h1 className="font-display text-3xl font-light text-ink">
          Home <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gold-600 via-gold-500 to-gold-700">Customization</span>
        </h1>
        <p className="text-sm text-ink/50 font-light mt-1">Manage the hero banner and every content section on the homepage.</p>
      </div>

      <HomeCustomizationTabs slides={slides} settings={settings} />
    </div>
  );
}
