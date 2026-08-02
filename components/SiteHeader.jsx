import { getActiveAnnouncement } from "@/actions/site";
import { getSiteSettings } from "@/actions/settings";
import { createClient } from "@/lib/supabase/server";
import { settingsToBrand } from "@/lib/constants";
import Header from "./Header";

async function getCurrentUser() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (err) {
    console.warn("Auth check unavailable:", err?.message || err);
    return null;
  }
}

export default async function SiteHeader() {
  const [announcement, user, dbSettings] = await Promise.all([
    getActiveAnnouncement(),
    getCurrentUser(),
    getSiteSettings(),
  ]);

  const brandInfo = settingsToBrand(dbSettings);

  return <Header announcement={announcement} isLoggedIn={Boolean(user)} brandInfo={brandInfo} />;
}
