"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function getAllInquiries() {
  const supabase = createAdminClient();
  const { data } = await supabase.from("inquiries").select("*").order("created_at", { ascending: false });
  return data || [];
}

export async function resolveInquiry(id, isResolved) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("inquiries").update({ is_resolved: isResolved }).eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/inquiries");
  return { success: true };
}
