import type { CookieOptionsWithName } from "@supabase/ssr";
import { supabaseProjectRef } from "./env";

/**
 * Cookie options endurecidas — single source of truth para todos los wrappers.
 *
 * Defensas activas:
 *  - `__Host-` prefix (fix #7 cookie fixation via subdomain):
 *      El browser REQUIERE Secure + Path=/ + sin Domain. Si algo lo viola,
 *      el cookie es rechazado silenciosamente → detectamos rapido en dev.
 *  - `SameSite=Strict` (fix #5 CSRF via Server Actions, fix #19 SameSite=Lax 2-min grace):
 *      El cookie NUNCA viaja en navegaciones cross-site (incluso GET a paginas top-level).
 *      Trade-off documentado: links desde emails externos a paginas autenticadas requieren
 *      re-login. Aceptable para marketplace (los emails de Supabase usan callback flow
 *      que setea la cookie post-redirect, no la usa directamente).
 *  - `HttpOnly=true`: JS del browser no puede leer el cookie → mitiga XSS session hijack.
 *  - `Secure=true`: solo HTTPS. Chrome/Firefox aceptan Secure sobre http://localhost por
 *      excepcion de dev — si desarrollas en 192.168.x.x, usa https local (mkcert).
 */
export const authCookieName = `__Host-hallo-${supabaseProjectRef}-auth`;

export const secureCookieOptions: CookieOptionsWithName = {
  name: authCookieName,
  path: "/",
  sameSite: "strict",
  secure: true,
  httpOnly: true,
  // No `domain` — requerido por el prefix `__Host-`.
};
