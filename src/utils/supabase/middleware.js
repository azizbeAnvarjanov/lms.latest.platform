import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function updateSession(request) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            const extendedOptions = {
              ...options,
              maxAge: 60 * 60 * 24 * 30, // 30 kun (sekundlarda)
              path: "/", // cookie har doim ishlashi uchun
            };

            request.cookies.set(name, value); // ishlovchi holatda o'zgarishlar
            supabaseResponse = NextResponse.next({ request });
            supabaseResponse.cookies.set(name, value, extendedOptions);
          });
        },
      },
    }
  );

  // MUHIM: Bu joyni o'zgartirmang
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (
    !user &&
    !request.nextUrl.pathname.startsWith("/login") &&
    !request.nextUrl.pathname.startsWith("/auth")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
