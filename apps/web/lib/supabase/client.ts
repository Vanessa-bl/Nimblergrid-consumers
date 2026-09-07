import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { secureCookieOptions } from "./cookies";
import { supabasePublishableKey, supabaseUrl } from "./env";

/**
 * Cliente Supabase para Client Components.
 *
 * Singleton por modulo — evita instanciar multiples auth listeners que
 * causan bugs de estado desincronizado entre componentes.
 *
 * Flow: PKCE explicito (fix #6 PKCE downgrade — el default cambia entre versiones,
 * mejor explicitarlo que asumirlo).
 */
let browserClient: SupabaseClient | null = null;

export const createClient = (): SupabaseClient => {
  if (browserClient) return browserClient;

  browserClient = createBrowserClient(supabaseUrl, supabasePublishableKey, {
    cookieOptions: secureCookieOptions,
    auth: {
      flowType: "pkce",
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });

  return browserClient;
};
