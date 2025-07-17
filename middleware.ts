// ✅ File: middleware.ts or middleware.js (NOT inside app/)
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    // This matches all routes except _next, static files, API, and auth pages
    "/((?!_next|.*\\..*|api|sign-in|sign-up|favicon.ico).*)",
  ],
};
