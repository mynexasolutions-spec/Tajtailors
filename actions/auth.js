"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

function safeRedirect(target) {
  return target && target.startsWith("/") ? target : "/";
}

export async function login(_prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  let signInError = null;
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    signInError = error;
  } catch (err) {
    console.warn("Login unavailable:", err?.message || err);
    return { error: "Sign-in is temporarily unavailable. Please try again shortly." };
  }

  if (signInError) return { error: "Invalid email or password." };

  revalidatePath("/", "layout");
  redirect(safeRedirect(formData.get("redirect_to")));
}

export async function register(_prevState, formData) {
  const fullName = formData.get("full_name");
  const email = formData.get("email");
  const password = formData.get("password");
  const phone = formData.get("phone");

  if (!fullName || !email || !password) {
    return { error: "Full name, email, and password are required." };
  }
  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }

  let signInError = null;
  try {
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const adminAuth = createAdminClient().auth.admin;

    const { error: createError } = await adminAuth.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName, phone: phone || "", role: "customer" },
    });

    if (createError) {
      if (createError.message.toLowerCase().includes("already been registered")) {
        return { error: "An account with this email already exists." };
      }
      return { error: createError.message };
    }

    const supabase = await createClient();
    const result = await supabase.auth.signInWithPassword({ email, password });
    signInError = result.error;
  } catch (err) {
    console.warn("Registration unavailable:", err?.message || err);
    return { error: "Account creation is temporarily unavailable. Please try again shortly." };
  }

  if (signInError) {
    return { error: "Account created — please log in." };
  }

  revalidatePath("/", "layout");
  redirect(safeRedirect(formData.get("redirect_to")));
}

export async function adminLogin(_prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  let isAdmin = false;
  try {
    const supabase = await createClient();
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    let { data, error } = await supabase.auth.signInWithPassword({ email, password });

    // First-ever login with the configured admin credentials bootstraps the account.
    if (error && adminEmail && email.toLowerCase() === adminEmail.toLowerCase() && password === adminPassword) {
      const { createAdminClient } = await import("@/lib/supabase/admin");
      const adminClient = createAdminClient();
      const { error: createError } = await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: "Admin", role: "admin" },
      });

      if (!createError) {
        const retry = await supabase.auth.signInWithPassword({ email, password });
        data = retry.data;
        error = retry.error;
      }
    }

    if (error || !data?.user) {
      return { error: error?.message || "Invalid credentials." };
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .maybeSingle();

    if (profile?.role !== "admin") {
      await supabase.auth.signOut();
      return { error: "This account does not have admin access." };
    }

    isAdmin = true;
  } catch (err) {
    console.warn("Admin login unavailable:", err?.message || err);
    return { error: "Admin login is temporarily unavailable. Please try again shortly." };
  }

  if (!isAdmin) return { error: "Invalid credentials." };

  revalidatePath("/admin", "layout");
  redirect("/admin");
}

export async function logout() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch (err) {
    console.warn("Logout sign-out unavailable:", err?.message || err);
  }
  revalidatePath("/", "layout");
  redirect("/login");
}

export async function adminLogout() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch (err) {
    console.warn("Admin logout sign-out unavailable:", err?.message || err);
  }
  revalidatePath("/admin", "layout");
  redirect("/admin/login");
}
