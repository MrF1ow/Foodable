import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isUserRoute = createRouteMatcher(["/user(.*)"]);

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/(.*)",
  "/api/webhooks(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  const userRole = (await auth()).sessionClaims?.metadata?.role;

  // Protect all routes starting with `/admin`
  if (isAdminRoute(request) && !(userRole === "admin")) {
    const url = new URL("/", request.url);
    return NextResponse.redirect(url);
  }

  // Allow registered users to access the user route
  if (isUserRoute(request) && !(userRole === "admin" || userRole === "user")) {
    const url = new URL("/sign-in", request.url);
    return NextResponse.redirect(url);
  }

  if (!isPublicRoute(request)) {
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
