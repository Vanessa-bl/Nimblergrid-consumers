/**
 * Content-Security-Policy builder — nonce-based script-src + strict-dynamic.
 *
 * Defensas (referencia a los ataques del threat model):
 *   - #8  XSS reflejado    -> script-src 'nonce-...' 'strict-dynamic' impide
 *                             cualquier <script> inyectado sin nonce valido.
 *   - #17 RSC cache poisoning -> combinado con Cache-Control: no-store en layouts
 *                                sensibles (aplicado por ruta, no aca).
 *   - Clickjacking (extra)  -> frame-ancestors 'none' + X-Frame-Options: DENY.
 *   - Form CSRF (extra)     -> form-action 'self'.
 *   - Base injection (extra) -> base-uri 'self'.
 *
 * Notas de trade-off:
 *   - style-src incluye 'unsafe-inline': necesario porque React aplica inline
 *     styles desde props `style={{...}}` sin nonce. Alternativa (nonce-only
 *     styles) rompe Radix, Tailwind runtime, y muchas libs. Aceptable: XSS en
 *     styles = poca cosa.
 *   - Dev mode agrega 'unsafe-eval' + wss://localhost + http://localhost porque
 *     el HMR de Next usa eval() y websockets. En prod queda estricto.
 *   - Trusted Types NO se activa aca — se agrega en fase posterior cuando haya
 *     un endpoint report-uri (Sentry) para capturar violations sin romper la app.
 */

const HOSTS = {
  supabaseRest: "https://*.supabase.co",
  supabaseRealtime: "wss://*.supabase.co",
  imagesPrismic: "https://images.prismic.io",
  prismic: "https://prismic.io",
  imageKit: "https://ik.imagekit.io",
  unsplash: "https://images.unsplash.com",
  googleFonts: "https://fonts.gstatic.com",
} as const;

const isDev = process.env.NODE_ENV !== "production";

export const buildCsp = (nonce: string): string => {
  const scriptSrc = ["'self'", `'nonce-${nonce}'`, "'strict-dynamic'"];
  if (isDev) {
    // HMR de Next usa eval() para inyectar modulos actualizados.
    scriptSrc.push("'unsafe-eval'");
  }

  const connectSrc = ["'self'", HOSTS.supabaseRest, HOSTS.supabaseRealtime];
  if (isDev) {
    // Websockets del HMR de Next (ws://localhost:3000/_next/webpack-hmr) y
    // fetch al dev server.
    connectSrc.push("ws://localhost:*", "http://localhost:*");
  }

  // frame-ancestors: prod bloquea TODO. En dev permitimos localhost:* para que
  // Slice Machine (localhost:9999) pueda embeber /slice-simulator en iframe.
  const frameAncestors = isDev ? ["'self'", "http://localhost:*"] : ["'none'"];

  const directives: Record<string, string[]> = {
    "default-src": ["'self'"],
    "script-src": scriptSrc,
    "style-src": ["'self'", "'unsafe-inline'"],
    "img-src": [
      "'self'",
      "data:",
      "blob:",
      HOSTS.imagesPrismic,
      HOSTS.prismic,
      HOSTS.imageKit,
      HOSTS.unsplash,
    ],
    "font-src": ["'self'", "data:", HOSTS.googleFonts],
    "connect-src": connectSrc,
    "frame-ancestors": frameAncestors,
    "form-action": ["'self'"],
    "base-uri": ["'self'"],
    "object-src": ["'none'"],
    "worker-src": ["'self'", "blob:"],
    "manifest-src": ["'self'"],
  };

  const parts = Object.entries(directives).map(([key, values]) => `${key} ${values.join(" ")}`);
  if (!isDev) {
    // upgrade-insecure-requests solo tiene sentido en prod (HTTPS).
    parts.push("upgrade-insecure-requests");
  }

  return parts.join("; ");
};
