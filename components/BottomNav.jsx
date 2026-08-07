import { Suspense } from "react";
import { callLink, settingsToBrand } from "@/lib/constants";
import { getSiteSettings } from "@/actions/settings";
import BottomNavClient from "./BottomNavClient";

export default async function BottomNav() {
  const dbSettings = (await getSiteSettings()) || {};
  const brandInfo = settingsToBrand(dbSettings);

  return (
    <Suspense fallback={null}>
      <BottomNavClient callHref={callLink(brandInfo)} />
    </Suspense>
  );
}
