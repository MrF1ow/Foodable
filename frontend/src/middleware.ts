import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isOnboardingRoute = createRouteMatcher(["/onboarding"]);
const isAdminRoute = createRouteMatcher(["/admin(.*)", "/api/admin(.*)"]);
const isUserRoute = createRouteMatcher(["/social(.*)", "/api/user(.*)", "/api/chat(.*)"]);

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/",
  "/recipe(.*)",
  "/recipe/(.*)",
  "/grocery-list(.*)",
  "/saved",
  "/social",
  "/settings",
  "/api/webhooks(.*)",
  "/api/recipes(.*)",
  "/api/images(.*)",
  "/api/kroger(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims, redirectToSignIn } = await auth(); 

  const userRole = (await auth()).sessionClaims?.metadata?.role;

  if (userId && isOnboardingRoute(req)) {
    return NextResponse.next();
  }

  if (!userId && !isPublicRoute(req)) {
    if (req.nextUrl.pathname.startsWith("/api")) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  if (userId && !sessionClaims?.metadata?.onboardingComplete) {
    const onboardingUrl = new URL("/onboarding", req.url);
    return NextResponse.redirect(onboardingUrl);
  }

  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // Protect all routes starting with `/admin`
  if (isAdminRoute(req) && !(userRole === "admin")) {
    const url = new URL("/", req.url);
    return NextResponse.redirect(url);
  }

  // Allow registered users to access the user route
  if (isUserRoute(req) && !(userRole === "admin" || userRole === "user")) {
    const url = new URL("/sign-in", req.url);
    return NextResponse.redirect(url);
  }

  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
