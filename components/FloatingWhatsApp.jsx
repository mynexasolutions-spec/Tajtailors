import { whatsappLink, callLink, settingsToBrand } from "@/lib/constants";
import { getSiteSettings } from "@/actions/settings";
import FloatingButtonsClient from "./FloatingButtonsClient";

export default async function FloatingWhatsApp() {
  const dbSettings = (await getSiteSettings()) || {};
  const brandInfo = settingsToBrand(dbSettings);

  return (
    <FloatingButtonsClient
      whatsappHref={whatsappLink("Hi Taj Tailor, I'd like to know more about your tailoring services.", brandInfo)}
      callHref={callLink(brandInfo)}
    />
  );
}
