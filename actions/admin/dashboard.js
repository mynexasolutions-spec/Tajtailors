"use server";

import { unstable_cache } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

const getDashboardStatsCached = unstable_cache(
  async () => {
    const supabase = createAdminClient();

    const [
      { data: orders, count: orderCount },
      { count: productCount },
      { count: customerCount },
      { data: lowStock },
      { data: recentOrders },
      { count: pendingReviewCount },
      { count: unresolvedInquiryCount },
    ] = await Promise.all([
      supabase.from("orders").select("total_amount, payment_status, order_status", { count: "exact" }),
      supabase.from("products").select("id", { count: "exact", head: true }),
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("product_variants").select("id, variant_name, stock_quantity, products ( name )").lte("stock_quantity", 5).eq("is_active", true),
      supabase
        .from("orders")
        .select("id, order_number, total_amount, order_status, created_at")
        .order("created_at", { ascending: false })
        .limit(6),
      supabase.from("reviews").select("id", { count: "exact", head: true }).eq("is_approved", false),
      supabase.from("inquiries").select("id", { count: "exact", head: true }).eq("is_resolved", false),
    ]);

    const revenue = (orders || [])
      .filter((o) => o.payment_status === "paid" || o.order_status !== "cancelled")
      .reduce((sum, o) => sum + Number(o.total_amount), 0);

    const pendingOrders = (orders || []).filter((o) => o.order_status === "pending").length;

    return {
      orderCount: orderCount || 0,
      productCount: productCount || 0,
      customerCount: customerCount || 0,
      revenue,
      pendingOrders,
      lowStock: lowStock || [],
      recentOrders: recentOrders || [],
      pendingReviewCount: pendingReviewCount || 0,
      unresolvedInquiryCount: unresolvedInquiryCount || 0,
    };
  },
  ["admin-dashboard-stats"],
  { revalidate: 30, tags: ["dashboard-stats"] }
);

export async function getDashboardStats() {
  return getDashboardStatsCached();
}
