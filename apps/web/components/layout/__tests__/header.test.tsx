import "@testing-library/jest-dom";
import type { AnchorHTMLAttributes } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Header } from "@/components/layout/header";
import { auth0 } from "@/lib/auth0";

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a {...rest}>{children}</a>
  ),
}));

jest.mock("@/lib/prismic/navigation", () => ({
  getNavigationLinks: jest.fn(async () => []),
}));

jest.mock("@/lib/auth0", () => ({
  auth0: { getSession: jest.fn() },
}));

const getSession = jest.mocked(auth0.getSession);

type Session = Awaited<ReturnType<typeof auth0.getSession>>;

describe("Header", () => {
  beforeEach(() => {
    getSession.mockResolvedValue(null);
  });

  it("shows login and signup when there is no session", async () => {
    const html = renderToStaticMarkup(await Header());

    expect(html).toContain('href="/login"');
    expect(html).toContain('href="/signup"');
    expect(html).not.toContain("Cerrar sesión");
  });

  it("shows the logout action and hides auth buttons when logged in", async () => {
    getSession.mockResolvedValue({
      user: { sub: "auth0|test" },
    } as unknown as Session);

    const html = renderToStaticMarkup(await Header());

    expect(html).toContain('href="/signout"');
    expect(html).toContain("Cerrar sesión");
    expect(html).not.toContain('href="/login"');
    expect(html).not.toContain('href="/signup"');
  });
});
