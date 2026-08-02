import { getAllAnnouncements } from "@/actions/admin/announcements";
import AnnouncementForm from "./_components/AnnouncementForm";

export const metadata = { title: "Announcements" };

export default async function AdminAnnouncementsPage() {
  const announcements = await getAllAnnouncements();

  return (
    <div>
      <div className="mb-8 border-b border-gold-400/10 pb-6">
        <h1 className="font-display text-3xl font-light text-ink">
          Site <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gold-600 via-gold-500 to-gold-700">Announcements</span>
        </h1>
        <p className="text-sm text-ink/50 font-light mt-1">Shown as a scrolling bar at the top of the storefront.</p>
      </div>
      <AnnouncementForm announcements={announcements} />
    </div>
  );
}
