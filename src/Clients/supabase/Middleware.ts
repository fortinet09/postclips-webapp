import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { fetchAPI } from "../postclips/server/ApiClient";
import { PostClipsMenuListAdmin, PostClipsMenuListBrand, PostClipsMenuListClipper } from "@/Data/Layout/PostClipsMenu";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("Middleware", { user: !!user, session: !!session });

  if (
    !user &&
    (request.nextUrl.pathname.startsWith("/campaigns") ||
      request.nextUrl.pathname.startsWith("/home") ||
      request.nextUrl.pathname.startsWith("/accounts") ||
      request.nextUrl.pathname.startsWith("/clips") ||
      request.nextUrl.pathname.startsWith("/settings"))
  ) {
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (user && session && request.nextUrl.pathname.includes("/login")) {
    const data = await fetchAPI(
      session.access_token,
      "GET",
      "/auth/roles"
    );

    if (!data) {
      const url = request.nextUrl.clone();
      url.pathname = "/comming-soon";
      return NextResponse.redirect(url);
    }

    let roles = [];
    let permissions = [];
    let brand;

    if (data) {
      roles = data.roles;
      permissions = data.permissions;
      brand = data.brand;
    } else {
      const url = request.nextUrl.clone();
      url.pathname = "/comming-soon";
      return NextResponse.redirect(url);
    }

    if (roles && roles.length > 0) {

      let selectedRole = roles[0];

      let menuList;
      if (selectedRole === "ADMIN") {
        menuList = PostClipsMenuListAdmin;
      } else if (selectedRole === "BRAND") {
        menuList = PostClipsMenuListBrand;
      } else if (selectedRole === "CLIPPER") {
        menuList = PostClipsMenuListClipper;
      }

      if (menuList && menuList.length > 0 && menuList[0].Items && menuList[0].Items.length > 0) {
        const firstItem = menuList[0].Items[0];
        const url = request.nextUrl.clone();
        url.pathname = firstItem.path || "/login";
        return NextResponse.redirect(url);
      }

      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    } else {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}
