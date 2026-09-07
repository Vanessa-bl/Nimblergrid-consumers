import { signOut } from "@workos-inc/authkit-nextjs";
import { NextResponse } from "next/server";

/**
 * Sign out — borra la cookie local + redirect a WorkOS logout URL,
 * que a su vez redirige a `returnTo` (home) despues de limpiar la sesion
 * del lado de WorkOS.
 *
 * Route handler (POST y GET) para permitir link directo y form action.
 * En prod usar POST para evitar CSRF-triggered logout via <img src="/signout">.
 */

const returnTo = "http://localhost:3000/";

export const GET = async () => {
  // signOut() lanza NEXT_REDIRECT internamente. Este return nunca se ejecuta.
  await signOut({ returnTo });
  return NextResponse.redirect(returnTo);
};

export const POST = GET;
