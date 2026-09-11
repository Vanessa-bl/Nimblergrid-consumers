/**
 * @jest-environment node
 */
import { renderToStaticMarkup } from "react-dom/server";
import { redirect } from "next/navigation";
import LoginPage from "@/app/login/page";
import SignupPage from "@/app/signup/page";
import { auth0 } from "@/lib/auth0";

jest.mock("@/lib/auth0", () => ({
  auth0: { getSession: jest.fn() },
}));

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

const getSession = jest.mocked(auth0.getSession);
const redirectMock = jest.mocked(redirect);

type Session = Awaited<ReturnType<typeof auth0.getSession>>;

describe("auth pages", () => {
  beforeEach(() => {
    getSession.mockResolvedValue(null);
  });

  it("renders the login CTA pointing to the Auth0 login route", async () => {
    const html = renderToStaticMarkup(await LoginPage());

    expect(html).toContain('href="/auth/login?returnTo=/test-profile"');
    expect(html).not.toContain("screen_hint");
    expect(redirectMock).not.toHaveBeenCalled();
  });

  it("renders the signup CTA with the Auth0 signup screen hint", async () => {
    const html = renderToStaticMarkup(await SignupPage());

    expect(html).toContain("screen_hint=signup");
    expect(html).toContain("returnTo=/test-profile");
    expect(redirectMock).not.toHaveBeenCalled();
  });

  it("redirects logged-in users to the home page", async () => {
    getSession.mockResolvedValue({
      user: { sub: "auth0|test" },
    } as unknown as Session);

    await LoginPage();

    expect(redirectMock).toHaveBeenCalledWith("/");
  });

  it("redirects logged-in users from signup to the home page", async () => {
    getSession.mockResolvedValue({
      user: { sub: "auth0|test" },
    } as unknown as Session);

    await SignupPage();

    expect(redirectMock).toHaveBeenCalledWith("/");
  });
});
