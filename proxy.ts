import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/tickets(.*)",
  "/thank-you(.*)",
  "/training(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    const { userId } = await auth();

    if (!userId) {
      if (req.nextUrl.pathname.startsWith("/tickets")) {
        const registerUrl = new URL("/register", req.url);
        registerUrl.searchParams.set(
          "redirect_url",
          `${req.nextUrl.pathname}${req.nextUrl.search}`
        );
        return NextResponse.redirect(registerUrl);
      }

      await auth.protect();
    }
  }

  const ref = req.nextUrl.searchParams.get("ref");
  if (ref) {
    const res = NextResponse.next();
    res.cookies.set("ref", ref, {
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
      sameSite: "lax",
    });
    return res;
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
