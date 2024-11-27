import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isUserRoute = createRouteMatcher(["/user(.*)"]);

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/(.*)", // for testing - must be removed
  "/404",
]);

export default clerkMiddleware(async (auth, request) => {
  // Allow users with the `admin` role to access the admin route
  if (
    isAdminRoute(request) &&
    (await auth()).sessionClaims?.metadata?.role !== "admin"
  ) {
    const url = new URL("/sign-in", request.url);
    return NextResponse.redirect(url);
  }

  // Allow users with the `admin` or `user` role to access the user route
  if (
    isUserRoute(request) &&
    (await auth()).sessionClaims?.metadata?.role !== "admin" &&
    (await auth()).sessionClaims?.metadata?.role !== "user"
  ) {
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
