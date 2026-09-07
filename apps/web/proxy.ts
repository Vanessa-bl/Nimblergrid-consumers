import {
  applyResponseHeaders,
  authkit,
  partitionAuthkitHeaders,
} from "@workos-inc/authkit-nextjs";
import { type NextRequest, NextResponse } from "next/server";
import { buildCsp } from "@/lib/security/csp";
import { checkSecFetchSite } from "@/lib/security/sec-fetch";

/**
 * Rutas donde JAMAS queremos que Vercel/Edge cachee la respuesta.
 * Fix #17 (RSC cache poisoning) — combinado con dynamic="force-dynamic" en el layout.
 */
const NO_CACHE_PREFIXES = ["/signin", "/callback", "/onboarding", "/auth/"];

/**
 * Proxy raiz (Next 16 file convention).
 * Corre en cada request que matchea `config.matcher`.
 *
 * Pipeline:
 *   1. Sec-Fetch-Site check para POST/PUT/PATCH/DELETE (fail fast).
 *   2. WorkOS session refresh via `authkit()` — devuelve headers de sesion
 *      (Set-Cookie para browser, x-workos-* para RSC downstream).
 *   3. Generar CSP nonce y agregarlo a los request headers (para que RSC lo
 *      lea con `headers().get('x-nonce')` en next/headers).
 *   4. Build response con headers merged (WorkOS + nonce + CSP + no-cache).
 *
 * Costo: dominado por authkit() (~50-150ms si refresca token, <1ms si cachea).
 * WorkOS NO se llama contra su API en cada request — solo si el JWT esta por
 * expirar. Session activa = pipeline puramente local.
 */
export const proxy = async (request: NextRequest) => {
  const secFetchRejection = checkSecFetchSite(request);
  if (secFetchRejection) return secFetchRejection;

  // WorkOS: refresh session + get headers (cookies + downstream metadata).
  const { headers: authkitHeaders } = await authkit(request);
  const { requestHeaders, responseHeaders } = partitionAuthkitHeaders(request, authkitHeaders);

  // Nonce se agrega a los request headers para que RSC lo lea.
  const nonce = crypto.randomUUID();
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  applyResponseHeaders(response, responseHeaders);

  response.headers.set("Content-Security-Policy", buildCsp(nonce));
  response.headers.set("x-nonce", nonce);

  const pathname = request.nextUrl.pathname;
  if (NO_CACHE_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    response.headers.set("Cache-Control", "private, no-store, max-age=0, must-revalidate");
  }

  return response;
};

export const config = {
  /**
   * Excluye:
   *   - _next/static: assets buildeados (immutable, ya cacheados).
   *   - _next/image: image optimizer.
   *   - favicon, robots, sitemap, opengraph static.
   *   - Cualquier path con extension (.png, .css, .js, .woff2, etc).
   *   - Auth endpoints: signup, signin, signout, callback -> SON los que
   *     crean/destruyen la sesion, no necesitan session refresh.
   *     Ademas responden 307 redirect (sin HTML) -> CSP nonce inutil.
   *     Correr authkit() en /signup duplicaba trabajo criptografico
   *     (genera PKCE cookie + auth URL 2 veces) -> ~160ms perdidos por click.
   *
   * Todo lo demas pasa: paginas HTML, RSC payloads, Server Actions (POST /*),
   * Route Handlers de app (/api/*), pages.
   */
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|opengraph-image|signup|signin|signout|callback|.*\\.[^/]+$).*)",
  ],
};
