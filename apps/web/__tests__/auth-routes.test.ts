/**
 * @jest-environment node
 */
import { GET as signoutGet, POST as signoutPost } from "@/app/signout/route";

const origin = "http://localhost:3000";

const parseLocation = (response: Response) =>
  new URL(response.headers.get("location") ?? "", origin);

describe("auth routes", () => {
  it("redirects /signout GET to the Auth0 logout route", async () => {
    const response = await signoutGet();
    const location = parseLocation(response);

    expect(response.status).toBe(307);
    expect(location.pathname).toBe("/auth/logout");
    expect(location.searchParams.get("returnTo")).toBe(origin);
  });

  it("redirects /signout POST to the Auth0 logout route", async () => {
    const response = await signoutPost();
    const location = parseLocation(response);

    expect(response.status).toBe(307);
    expect(location.pathname).toBe("/auth/logout");
    expect(location.searchParams.get("returnTo")).toBe(origin);
  });
});
