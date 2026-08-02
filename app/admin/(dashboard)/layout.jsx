import { headers } from "next/headers";
import { AdminSidebarProvider } from "@/context/AdminSidebarContext";
import AdminSidebar from "@/components/admin/Sidebar";
import AdminHeader from "@/components/admin/Header";
import { getDashboardStats } from "@/actions/admin/dashboard";

export const metadata = { title: { template: "%s — Taj Tailor Admin", default: "Admin Dashboard" } };

export default async function AdminDashboardLayout({ children }) {
  // Identity is already verified by middleware for every route under this
  // layout — reading its header avoids a second Supabase auth round trip.
  const headerList = await headers();
  const encodedName = headerList.get("x-admin-name");
  const adminName = encodedName ? decodeURIComponent(encodedName) : "Admin";

  // Cached (30s) — cheap to reuse here for the sidebar's nav badges.
  const stats = await getDashboardStats();
  const badges = {
    "/admin/orders": stats.pendingOrders,
    "/admin/reviews": stats.pendingReviewCount,
    "/admin/inquiries": stats.unresolvedInquiryCount,
  };

  return (
    <AdminSidebarProvider>
      <div className="flex h-screen overflow-hidden bg-ivory">
        <AdminSidebar adminName={adminName} badges={badges} />
        <div className="flex h-screen flex-1 flex-col overflow-hidden lg:pl-0">
          <AdminHeader adminName={adminName} />
          <main className="relative flex-1 overflow-y-auto p-4 md:p-8">
            <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_1200px_600px_at_top,rgba(202,161,75,0.05),transparent_60%)]" />
            {children}
          </main>
        </div>
      </div>
    </AdminSidebarProvider>
  );
}
