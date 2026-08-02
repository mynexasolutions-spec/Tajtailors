"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Megaphone } from "lucide-react";
import { createAnnouncement, toggleAnnouncement, deleteAnnouncement } from "@/actions/admin/announcements";

export default function AnnouncementForm({ announcements }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    startTransition(async () => {
      const result = await createAnnouncement(message);
      if (result.success) {
        setMessage("");
        router.refresh();
      }
    });
  };

  const handleToggle = (id, active) => {
    startTransition(async () => {
      await toggleAnnouncement(id, active);
      router.refresh();
    });
  };

  const handleDelete = (id) => {
    startTransition(async () => {
      await deleteAnnouncement(id);
      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleAdd}
        className="flex flex-col gap-3 rounded-[2rem] border border-gold-400/15 bg-white p-6 shadow-soft sm:flex-row sm:items-center"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gold-400/10 text-gold-600">
          <Megaphone className="h-4 w-4" />
        </div>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="e.g. Free shipping on orders above ₹1499"
          className="flex-1 rounded-xl border border-ink/10 bg-ivory-deep px-4 py-2.5 text-sm text-ink placeholder:text-ink/35 transition-colors duration-300 focus:border-gold-400/50 focus:outline-none focus:ring-1 focus:ring-gold-400/20 hover:border-gold-400/30"
        />
        <button type="submit" disabled={pending || !message} className="btn-gold w-full shrink-0 disabled:opacity-60 sm:w-auto">
          Add Announcement
        </button>
      </form>

      {announcements.length === 0 ? (
        <p className="rounded-[2rem] border border-gold-400/15 bg-white py-12 text-center text-sm text-ink/45">
          No announcements yet.
        </p>
      ) : (
        <ul className="space-y-3">
          {announcements.map((a) => (
            <li
              key={a.id}
              className="flex flex-col gap-3 rounded-2xl border border-gold-400/15 bg-white p-4 sm:flex-row sm:items-center"
            >
              <p className="flex-1 text-sm text-ink">{a.message}</p>
              <div className="flex shrink-0 items-center justify-between gap-3 sm:justify-start">
                <label className="flex items-center gap-2 text-sm text-ink/60">
                  <input type="checkbox" checked={a.is_active} disabled={pending} onChange={(e) => handleToggle(a.id, e.target.checked)} />
                  Active
                </label>
                <button
                  onClick={() => handleDelete(a.id)}
                  disabled={pending}
                  className="rounded-xl p-2 text-ink/45 transition-colors hover:bg-red-500/10 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
