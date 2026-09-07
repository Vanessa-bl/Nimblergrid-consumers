import { handleAuth } from "@workos-inc/authkit-nextjs";

/**
 * WorkOS AuthKit callback.
 * URL: http://localhost:3000/callback  (debe matchear WORKOS_REDIRECT_URI + Redirects en dashboard)
 *
 * Flow:
 *   1. WorkOS redirige aca con ?code=xxx despues del login.
 *   2. handleAuth() intercambia el code por session (JWT + refresh token).
 *   3. Setea cookie encriptada con WORKOS_COOKIE_PASSWORD.
 *   4. Redirect a `returnPathname` (por defecto "/").
 *
 * `returnPathname: "/test-profile"` -> despues del login exitoso, el user va
 * directamente a esa pagina (en vez de la home).
 */
export const GET = handleAuth({ returnPathname: "/test-profile" });
