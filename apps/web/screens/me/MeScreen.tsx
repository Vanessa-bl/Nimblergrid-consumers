import { auth0 } from "@/lib/auth0";
import { redirect } from "next/navigation";

export async function MeScreen() {
  const session = await auth0.getSession();
  if (!session) redirect("/auth/login?returnTo=/me");

  const { user } = session;

  return (
    <div style={{ padding: "2rem", fontFamily: "monospace", fontSize: "13px" }}>
      <h1 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "1rem" }}>
        Session diagnostic
      </h1>

      <p style={{ color: "var(--success)", marginBottom: "1rem" }}>Logged in.</p>
      <pre
        style={{
          background: "var(--neutral-100)",
          padding: "1rem",
          borderRadius: "8px",
          overflow: "auto",
        }}
      >
        {JSON.stringify(user, null, 2)}
      </pre>
      <p style={{ marginTop: "1rem" }}>
        <a href="/signout" style={{ color: "var(--accent)", textDecoration: "underline" }}>
          Sign out
        </a>
      </p>
    </div>
  );
}
