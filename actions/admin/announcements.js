"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath, revalidateTag } from "next/cache";

export async function getAllAnnouncements() {
  const supabase = createAdminClient();
  const { data } = await supabase.from("announcements").select("*").order("created_at", { ascending: false });
  return data || [];
}

export async function createAnnouncement(message) {
  if (!message) return { success: false, error: "Message is required." };
  const supabase = createAdminClient();
  const { error } = await supabase.from("announcements").insert({ message });
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/announcements");
  revalidatePath("/");
  revalidateTag("announcements");
  return { success: true };
}

export async function toggleAnnouncement(id, isActive) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("announcements").update({ is_active: isActive }).eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/announcements");
  revalidatePath("/");
  revalidateTag("announcements");
  return { success: true };
}

export async function deleteAnnouncement(id) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("announcements").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/announcements");
  revalidatePath("/");
  revalidateTag("announcements");
  return { success: true };
}
