import { type NextRequest, NextResponse } from "next/server";

/**
 * Cross-origin request check para metodos mutadores (fix #5 CSRF en Server Actions,
 * #19 SameSite=Lax 2-min grace window).
 *
 * Logica:
 *   - GET/HEAD/OPTIONS: no check (idempotentes, no mutan estado).
 *   - POST/PUT/PATCH/DELETE:
 *       Sec-Fetch-Site: same-origin | same-site  -> allow
 *       Sec-Fetch-Site: cross-site | none        -> reject 403
 *       Sec-Fetch-Site: (ausente)                -> fallback: verificar Origin == Host
 *
 * `same-site` se permite para soportar subdominios (agencies.hallo-one.com, etc).
 * `none` en un POST es sospechoso (address bar solo emite GET) -> rechazamos.
 *
 * Fallback Origin: browsers pre-2020 no envian Sec-Fetch-Site. Comparamos el
 * Origin contra el Host de la request (mismo esquema y puerto).
 *
 * Retorna:
 *   - null si la request pasa (continua el pipeline).
 *   - NextResponse 403 si debe rechazarse.
 */

const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);
const ALLOWED_SITES = new Set(["same-origin", "same-site"]);

export const checkSecFetchSite = (request: NextRequest): NextResponse | null => {
  if (!MUTATING_METHODS.has(request.method)) return null;

  const secFetchSite = request.headers.get("sec-fetch-site");

  if (secFetchSite !== null) {
    if (ALLOWED_SITES.has(secFetchSite)) return null;
    return rejectCrossOrigin(secFetchSite);
  }

  // Fallback: comparar Origin con Host (misma origen == mismo scheme+host+port).
  const origin = request.headers.get("origin");
  if (!origin) {
    // Sin Origin ni Sec-Fetch-Site: probable cliente no-browser (server-to-server, CLI).
    // Otras capas (auth, rate limit, Turnstile) deciden.
    return null;
  }

  const expected = `${request.nextUrl.protocol}//${request.nextUrl.host}`;
  if (origin === expected) return null;

  return rejectCrossOrigin(`origin=${origin}`);
};

const rejectCrossOrigin = (reason: string): NextResponse =>
  new NextResponse(`Cross-site request rejected (${reason})`, {
    status: 403,
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
