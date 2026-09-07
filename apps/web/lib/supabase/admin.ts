import "server-only";
import { createClient as createSupabaseClient, type SupabaseClient } from "@supabase/supabase-js";
import { supabaseUrl } from "./env";

/**
 * Cliente Supabase con SECRET_KEY (service_role).
 * Bypassea RLS. Uso EXCLUSIVO en Server Actions / Route Handlers de admin.
 *
 * Defensas contra fix #20 (service_role key leak):
 *   1. `import "server-only"` — Next tira error de build si un Client Component
 *      lo importa (directa o transitivamente).
 *   2. Env var sin prefix NEXT_PUBLIC_ — Next no la incluye en el bundle client.
 *   3. Instancia lazy — no consume memoria hasta el primer uso.
 *
 * Nunca pasar esta instancia por props/context a componentes cliente.
 * Nunca serializarla en un Response de RSC.
 */
let adminClient: SupabaseClient | null = null;

export const getAdminClient = (): SupabaseClient => {
  if (adminClient) return adminClient;

  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("Missing env var: SUPABASE_SECRET_KEY");
  }

  adminClient = createSupabaseClient(supabaseUrl, secretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return adminClient;
};
