import "server-only";

/**
 * Env vars requeridas por WorkOS AuthKit.
 * El SDK las lee directo de process.env, pero validamos fail-fast aca para
 * detectar env faltantes al importar en vez de en un fallo cryptico runtime.
 *
 * Fuente: node_modules/@workos-inc/authkit-nextjs/dist/esm/env-variables.d.ts
 */

const requireEnv = (key: string, value: string | undefined): string => {
  if (!value) throw new Error(`Missing env var: ${key}`);
  return value;
};

export const workosApiKey = requireEnv("WORKOS_API_KEY", process.env.WORKOS_API_KEY);
export const workosClientId = requireEnv("WORKOS_CLIENT_ID", process.env.WORKOS_CLIENT_ID);
export const workosCookiePassword = requireEnv(
  "WORKOS_COOKIE_PASSWORD",
  process.env.WORKOS_COOKIE_PASSWORD,
);
export const workosRedirectUri = requireEnv(
  "WORKOS_REDIRECT_URI",
  process.env.WORKOS_REDIRECT_URI,
);

if (workosCookiePassword.length < 32) {
  throw new Error(
    "WORKOS_COOKIE_PASSWORD debe tener minimo 32 chars. Generar con: openssl rand -base64 32",
  );
}
