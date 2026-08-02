import { MessageSquare, Clock, CheckCircle2 } from "lucide-react";
import { getAllInquiries } from "@/actions/admin/inquiries";
import InquiriesList from "./_components/InquiriesList";

export const metadata = { title: "Inquiries" };

export default async function AdminInquiriesPage() {
  const inquiries = await getAllInquiries();

  const unresolvedCount = inquiries.filter((i) => !i.is_resolved).length;
  const resolvedCount = inquiries.length - unresolvedCount;

  const stats = [
    { label: "Total Inquiries", value: inquiries.length, icon: MessageSquare },
    { label: "Unresolved", value: unresolvedCount, icon: Clock },
    { label: "Resolved", value: resolvedCount, icon: CheckCircle2 },
  ];

  return (
    <div>
      {/* Header Panel */}
      <div className="mb-8 border-b border-gold-400/10 pb-6">
        <h1 className="font-display text-3xl font-light text-ink">
          Contact <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gold-600 via-gold-500 to-gold-700">Inquiries</span>
        </h1>
        <p className="text-sm text-ink/50 font-light mt-1">Messages submitted through the Contact page.</p>
      </div>

      {/* Stat Strip */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex items-center gap-3 rounded-2xl border border-gold-400/15 bg-white px-4 py-3.5"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gold-400/10 text-gold-600">
              <s.icon className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="font-display text-xl leading-none text-ink">{s.value}</p>
              <p className="truncate text-xs uppercase tracking-wide text-ink/45">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <InquiriesList inquiries={inquiries} />
    </div>
  );
}
