import { getSignUpUrl } from "@workos-inc/authkit-nextjs";
import { NextResponse } from "next/server";

/**
 * /signup -> redirect al hosted flow de WorkOS con screenHint 'sign-up'.
 *
 * Route Handler (no page, no Server Action) porque:
 *   - Server Actions se compilan on-demand en dev -> primer click lento.
 *   - Route Handlers son GET simple + redirect -> siempre rapido (dev y prod).
 *   - Combinado con <a> (no <Link>) en el boton -> cero prefetch, cero
 *     "Failed to fetch" cross-origin.
 *
 * Pattern usado por Vercel dashboard, Linear, GitHub para auth entry.
 */
export const GET = async () => {
  const url = await getSignUpUrl();
  return NextResponse.redirect(url);
};
