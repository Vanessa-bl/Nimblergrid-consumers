import "server-only";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { secureCookieOptions } from "./cookies";
import { supabasePublishableKey, supabaseUrl } from "./env";

/**
 * Cliente Supabase para Server Components, Server Actions, Route Handlers.
 *
 * NO es singleton — se crea fresh por request porque las cookies son
 * per-request. Cachearlo entre requests filtra sesion entre users (grave).
 *
 * `setAll` se envuelve en try/catch porque en Server Components (readonly)
 * next/headers no permite escribir cookies — es un no-op esperado, no un error.
 * El middleware refresca la sesion antes que llegue aca.
 */
export const createClient = async (): Promise<SupabaseClient> => {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabasePublishableKey, {
    cookieOptions: secureCookieOptions,
    auth: {
      flowType: "pkce",
    },
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (
        cookiesToSet: Array<{ name: string; value: string; options: CookieOptions }>,
      ) => {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Server Component context — cookies() es readonly aqui.
          // El middleware ya refresco la sesion en el request actual.
        }
      },
    },
  });
};
