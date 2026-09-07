import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { secureCookieOptions } from "./cookies";
import { supabasePublishableKey, supabaseUrl } from "./env";

export type UpdateSessionOptions = {
  /**
   * Headers extra que se agregan al REQUEST que ven los Server Components downstream.
   * Uso principal: pasar el CSP nonce generado en el middleware raiz.
   * (RSC lee via `headers().get('x-nonce')` desde next/headers.)
   */
  extraRequestHeaders?: Record<string, string>;
};

/**
 * Refresca la sesion Supabase (rotacion de refresh token) y sincroniza cookies
 * entre request y response.
 *
 * Uso desde apps/web/proxy.ts (raiz — Next 16 file convention):
 *   const nonce = crypto.randomUUID();
 *   const response = await updateSession(request, { extraRequestHeaders: { 'x-nonce': nonce } });
 *   response.headers.set('Content-Security-Policy', buildCsp(nonce));
 *   return response;
 *
 * `getUser()` (NO `getSession`) al final: valida el token contra Auth server.
 * `getSession()` lee del cookie sin validar -> vulnerable a tampering.
 */
export const updateSession = async (
  request: NextRequest,
  options: UpdateSessionOptions = {},
): Promise<NextResponse> => {
  const requestHeaders = new Headers(request.headers);
  if (options.extraRequestHeaders) {
    for (const [key, value] of Object.entries(options.extraRequestHeaders)) {
      requestHeaders.set(key, value);
    }
  }

  let response = NextResponse.next({ request: { headers: requestHeaders } });

  const supabase = createServerClient(supabaseUrl, supabasePublishableKey, {
    cookieOptions: secureCookieOptions,
    auth: { flowType: "pkce" },
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (
        cookiesToSet: Array<{ name: string; value: string; options: CookieOptions }>,
      ) => {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request: { headers: requestHeaders } });
        for (const { name, value, options: cookieOptions } of cookiesToSet) {
          response.cookies.set(name, value, cookieOptions);
        }
      },
    },
  });

  await supabase.auth.getUser();

  return response;
};
