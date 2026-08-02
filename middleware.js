import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function middleware(request) {
  let response = NextResponse.next({ request });
  let supabase = null;
  let user = null;

  try {
    supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            response = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch (err) {
    console.warn("Auth check unavailable in middleware:", err?.message || err);
  }

  const { pathname } = request.nextUrl;
  const isAdminPath = pathname.startsWith("/admin") && pathname !== "/admin/login";
  const isAccountPath = pathname.startsWith("/account") || pathname.startsWith("/checkout");

  if (isAdminPath && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  if (isAccountPath && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  if (isAdminPath && user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, full_name")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }

    // Pass identity through so the admin layout doesn't have to re-verify
    // the session with another Supabase round trip. Encoded since header
    // values must be ASCII-safe and full_name may contain other characters.
    response.headers.set("x-admin-name", encodeURIComponent(profile.full_name || "Admin"));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*", "/checkout/:path*"],
};
