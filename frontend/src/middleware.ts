import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import rateLimit from "./lib/rate-limiter";

const isOnboardingRoute = createRouteMatcher(["/onboarding"]);
const isUserRoute = createRouteMatcher([
  "/social(.*)",
  "/api/user(.*)",
  "/api/chat(.*)",
]);

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

  if (req.nextUrl.pathname.startsWith("/api")) {
    const rateLimitResponse = await rateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;
  }

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
    console.log("Redirecting Back to Onboarding");
    const onboardingUrl = new URL("/onboarding", req.url);
    return NextResponse.redirect(onboardingUrl);
  }

  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // Allow registered users to access the user route
  if (isUserRoute(req) && !(userRole === "user")) {
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
