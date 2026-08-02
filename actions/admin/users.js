"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export async function getAllUsers() {
  const supabase = createAdminClient();

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, email, phone, role, is_active, created_at")
    .order("created_at", { ascending: false });

  if (!profiles || profiles.length === 0) return [];

  const { data: orders } = await supabase.from("orders").select("user_id, total_amount");

  return profiles.map((p) => {
    const userOrders = (orders || []).filter((o) => o.user_id === p.id);
    return {
      ...p,
      orderCount: userOrders.length,
      totalSpend: userOrders.reduce((sum, o) => sum + Number(o.total_amount), 0),
    };
  });
}
