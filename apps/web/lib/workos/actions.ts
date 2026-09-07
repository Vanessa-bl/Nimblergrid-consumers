"use server";

import { signOut } from "@workos-inc/authkit-nextjs";

/**
 * Server Actions para auth con WorkOS AuthKit.
 *
 * Pattern del proyecto:
 *   - Sign-in / sign-up = navigation -> <Button href="/signup" external> +
 *     Route Handler (rapido en dev y prod, sin compilacion on-demand).
 *   - Sign-out = mutation (borra cookie + revoke WorkOS session) -> Server Action.
 *
 * Regla: Server Actions para mutations. Route Handlers para navigation.
 */

/**
 * Cierra la sesion (borra cookie + logout en WorkOS) y redirige a home.
 * Uso: <form action={signOutAction}><button type="submit">Sign out</button></form>
 */
export const signOutAction = async () => {
  await signOut({ returnTo: "http://localhost:3000/" });
};
