import { withAuth } from "@workos-inc/authkit-nextjs";

/**
 * DIAGNOSTICO: muestra el user actual (o null si no hay sesion).
 * Uso temporal para debuggear el flow de auth.
 * Borrar cuando armemos la UI real de perfil.
 */
export const dynamic = "force-dynamic";

export default async function MePage() {
  const auth = await withAuth();

  return (
    <div style={{ padding: "2rem", fontFamily: "monospace", fontSize: "13px" }}>
      <h1 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "1rem" }}>
        Session diagnostic
      </h1>

      {auth.user ? (
        <>
          <p style={{ color: "green", marginBottom: "1rem" }}>Logged in.</p>
          <pre
            style={{
              background: "#f4f4f5",
              padding: "1rem",
              borderRadius: "8px",
              overflow: "auto",
            }}
          >
            {JSON.stringify(auth, null, 2)}
          </pre>
          <p style={{ marginTop: "1rem" }}>
            <a href="/signout" style={{ color: "#7c3aed", textDecoration: "underline" }}>
              Sign out
            </a>
          </p>
        </>
      ) : (
        <>
          <p style={{ color: "red", marginBottom: "1rem" }}>No session.</p>
          <p>
            <a href="/signin" style={{ color: "#7c3aed", textDecoration: "underline" }}>
              Sign in
            </a>
          </p>
        </>
      )}
    </div>
  );
}
