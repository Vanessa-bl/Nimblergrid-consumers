import type { NextConfig } from "next";

/**
 * Origins autorizados para Server Actions (fix #5 CVE-2024-34351).
 * Sin esto, un action ID leaked en el HTML es invocable desde cualquier origin.
 *
 * Prod: setear NEXT_PUBLIC_APP_URL=https://hallo-one.com (o el dominio real).
 * Dev: fallback a localhost:3000.
 */
const appUrl = process.env.NEXT_PUBLIC_APP_URL;
const allowedOrigins = appUrl ? [new URL(appUrl).host] : ["localhost:3000"];

/**
 * Security headers estaticos — aplicados por Next en el edge sin ejecutar middleware.
 * Complementan el CSP dinamico (con nonce) que el middleware raiz agrega per-request.
 */
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: [
      "accelerometer=()",
      "autoplay=()",
      "camera=()",
      "display-capture=()",
      "fullscreen=(self)",
      "geolocation=()",
      "gyroscope=()",
      "magnetometer=()",
      "microphone=()",
      "midi=()",
      "payment=()",
      "picture-in-picture=()",
      "usb=()",
    ].join(", "),
  },
  // HSTS: forzar HTTPS por 2 anos + subdominios + preload-ready.
  // Solo tiene efecto en respuestas via HTTPS -> no rompe dev en http://localhost.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  agentRules: false,
  experimental: {
    serverActions: {
      allowedOrigins,
    },
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.prismic.io" },
      { protocol: "https", hostname: "prismic.io" },
      { protocol: "https", hostname: "ik.imagekit.io" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  headers: async () => [
    {
      source: "/:path*",
      headers: securityHeaders,
    },
  ],
};

export default nextConfig;
