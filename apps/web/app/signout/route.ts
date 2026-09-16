import { NextResponse } from "next/server";

const redirectToLogout = () => {
  const appBaseUrl = process.env.APP_BASE_URL || "http://localhost:3000";
  const url = new URL("/auth/logout", appBaseUrl);
  url.searchParams.set("returnTo", appBaseUrl);
  return NextResponse.redirect(url);
};

export const GET = redirectToLogout;
export const POST = redirectToLogout;
