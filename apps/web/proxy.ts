import { auth0 } from "@/lib/auth0";
import { buildCsp } from "@/lib/security/csp";
import { checkSecFetchSite } from "@/lib/security/sec-fetch";
import { type NextRequest, NextResponse } from "next/server";

const NO_CACHE_PREFIXES = ["/auth/", "/me"];

const SKIPPED_RESPONSE_HEADERS = new Set([
  "x-middleware-next",
  "x-middleware-override-headers",
]);

const applySecurityHeaders = (response: NextResponse, nonce: string, pathname: string) => {
  response.headers.set("Content-Security-Policy", buildCsp(nonce));
  response.headers.set("x-nonce", nonce);

  if (NO_CACHE_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    response.headers.set("Cache-Control", "private, no-store, max-age=0, must-revalidate");
  }
};

export const proxy = async (request: NextRequest) => {
  const secFetchRejection = checkSecFetchSite(request);
  if (secFetchRejection) return secFetchRejection;

  const authResponse = await auth0.middleware(request);
  const nonce = crypto.randomUUID();
  const pathname = request.nextUrl.pathname;

  if (authResponse.headers.get("x-middleware-next") !== "1") {
    applySecurityHeaders(authResponse, nonce, pathname);
    return authResponse;
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({ request: { headers: requestHeaders } });

  for (const [key, value] of authResponse.headers) {
    const name = key.toLowerCase();
    if (SKIPPED_RESPONSE_HEADERS.has(name) || name.startsWith("x-middleware-request-")) continue;
    if (name === "set-cookie") continue;

    response.headers.set(key, value);
  }

  for (const cookie of authResponse.headers.getSetCookie()) {
    response.headers.append("set-cookie", cookie);
  }

  applySecurityHeaders(response, nonce, pathname);
  return response;
};

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|opengraph-image|.*\\.[^/]+$).*)",
  ],
};
