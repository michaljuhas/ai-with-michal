import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isMembersArea = createRouteMatcher(["/members(.*)"]);

const isProtectedRoute = createRouteMatcher([
  "/tickets(.*)",
  "/thank-you(.*)",
  "/billing(.*)",
  "/training/:slug/tickets(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  if (isMembersArea(req)) {
    if (!userId) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set(
        "redirect_url",
        `${req.nextUrl.pathname}${req.nextUrl.search}`
      );
      return NextResponse.redirect(loginUrl);
    }
  } else if (isProtectedRoute(req) && !userId) {
    if (
      req.nextUrl.pathname.startsWith("/tickets") ||
      req.nextUrl.pathname.includes("/tickets")
    ) {
      const registerUrl = new URL("/register", req.url);
      registerUrl.searchParams.set(
        "redirect_url",
        `${req.nextUrl.pathname}${req.nextUrl.search}`
      );
      return NextResponse.redirect(registerUrl);
    }

    await auth.protect();
  }

  // Capture UTM params + ref into a server-readable cookie (_attr).
  // Only written when at least one tracking param is present in the URL.
  // Existing cookie is preserved (first-touch attribution).
  const trackingKeys = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
    "ref",
  ] as const;

  const found: Record<string, string> = {};
  for (const key of trackingKeys) {
    const val = req.nextUrl.searchParams.get(key);
    if (val) found[key] = val;
  }

  if (Object.keys(found).length > 0) {
    // Merge with existing cookie (first-touch wins: existing takes priority).
    let existing: Record<string, string> = {};
    try {
      const raw = req.cookies.get("_attr")?.value;
      if (raw) existing = JSON.parse(decodeURIComponent(raw));
    } catch {
      // Ignore malformed cookie
    }
    const merged = { ...found, ...existing };

    const res = NextResponse.next();
    res.cookies.set("_attr", JSON.stringify(merged), {
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
      sameSite: "lax",
    });
    // Keep legacy ref cookie for backward-compat with checkout route.
    if (found.ref) {
      res.cookies.set("ref", found.ref, {
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
        sameSite: "lax",
      });
    }
    return res;
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
