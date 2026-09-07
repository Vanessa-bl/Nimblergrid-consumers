/**
 * Env vars de Supabase, validadas al importar.
 * Fail-fast: cualquier import roto tira error antes de servir un request.
 *
 * Naming 2026 (memory: reference_supabase_keys_2026):
 *   PUBLISHABLE_KEY  = sb_publishable_...  (reemplaza anon)
 *   SECRET_KEY       = sb_secret_...       (reemplaza service_role)
 */

const requireEnv = (key: string, value: string | undefined): string => {
  if (!value) {
    throw new Error(`Missing env var: ${key}`);
  }
  return value;
};

export const supabaseUrl = requireEnv(
  "NEXT_PUBLIC_SUPABASE_URL",
  process.env.NEXT_PUBLIC_SUPABASE_URL,
);

export const supabasePublishableKey = requireEnv(
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
);

// SUPABASE_PROJECT_REF se usa como sufijo del cookie name (identifica el proyecto).
// En dev local puede faltar — usamos fallback estable.
export const supabaseProjectRef =
  process.env.NEXT_PUBLIC_SUPABASE_PROJECT_REF ??
  process.env.SUPABASE_PROJECT_REF ??
  "local";
