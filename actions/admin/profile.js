"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getAdminProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase.from("profiles").select("full_name, email").eq("id", user.id).maybeSingle();
  return profile;
}

export async function updateAdminProfile(_prevState, formData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const fullName = formData.get("full_name");
  const newPassword = formData.get("new_password");

  const { error: profileError } = await supabase.from("profiles").update({ full_name: fullName }).eq("id", user.id);
  if (profileError) return { error: profileError.message };

  if (newPassword) {
    if (newPassword.length < 6) return { error: "New password must be at least 6 characters." };
    // Uses the signed-in user's own session (not the service-role admin API)
    // so their current session stays valid after the change — updating via
    // auth.admin.updateUserById() invalidated the session cookie, which made
    // the very next profile fetch come back empty (looked like a broken form).
    const { error: passwordError } = await supabase.auth.updateUser({ password: newPassword });
    if (passwordError) return { error: passwordError.message };
  }

  revalidatePath("/admin/settings/profile");
  return { success: true };
}
