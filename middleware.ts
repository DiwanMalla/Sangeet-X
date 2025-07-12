import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/admin(.*)",
  "/library(.*)",
  "/liked(.*)",
  "/search(.*)",
  "/song(.*)",
  "/user-profile(.*)",
  "/api/songs(.*)",
  "/api/artists(.*)",
  "/api/playlists(.*)",
  "/api/favorites(.*)",
  "/api/upload(.*)",
  "/api/subtitles(.*)",
  "/api/users(.*)",
]);

const isGuestRoute = createRouteMatcher([
  "/guest(.*)",
  "/api/guest(.*)",
  "/api/genres",
  "/api/popular",
  "/landing",
  "/",
]);

const isPublicRoute = createRouteMatcher([
  "/login(.*)",
  "/sign-up(.*)",
  "/sso-callback(.*)",
  "/api/webhooks(.*)",
  "/_clerk(.*)",
  "/api/clerk(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // Allow public routes (auth pages) without authentication
  if (isPublicRoute(req) || isGuestRoute(req)) {
    return;
  }

  // Protect specific routes
  if (isProtectedRoute(req)) {
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
