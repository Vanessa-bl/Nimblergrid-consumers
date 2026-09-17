import { defineConfig, globalIgnores } from "eslint/config";
import { readdirSync } from "node:fs";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// ---------------------------------------------------------------------------
// Architectural import guard (Tanda 4)
// Layer flow: app/ -> screens/ -> features/<domain>/ -> components/ui/ + domain/ + lib/
// Feature and screen folders are auto-discovered, so new ones are protected
// as soon as the folder exists.
// ---------------------------------------------------------------------------

const TS_FILES = "{ts,tsx}";

const listLayerDirs = (dir) =>
  readdirSync(new URL(`./${dir}`, import.meta.url), { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isDirectory() &&
        !entry.name.startsWith("_") &&
        !entry.name.startsWith("."),
    )
    .map((entry) => entry.name);

const features = listLayerDirs("features");
const screens = listLayerDirs("screens");

const domainEntry = {
  files: [`domain/**/*.${TS_FILES}`],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: [
              "@/components",
              "@/components/**",
              "@/features",
              "@/features/**",
              "@/screens",
              "@/screens/**",
              "@/lib",
              "@/lib/**",
              "@/app",
              "@/app/**",
            ],
            message:
              "Capa domain: no puede importar de otras capas (debe ser TypeScript puro).",
          },
        ],
      },
    ],
  },
};

const libEntry = {
  files: [`lib/**/*.${TS_FILES}`],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: [
              "@/components",
              "@/components/**",
              "@/features",
              "@/features/**",
              "@/screens",
              "@/screens/**",
              "@/app",
              "@/app/**",
            ],
            message:
              "Capa lib (infraestructura): solo puede importar de domain y dependencias externas.",
          },
        ],
      },
    ],
  },
};

const uiEntry = {
  files: [`components/ui/**/*.${TS_FILES}`],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: [
              "@/domain",
              "@/domain/**",
              "@/features",
              "@/features/**",
              "@/screens",
              "@/screens/**",
              "@/lib",
              "@/lib/**",
              "@/app",
              "@/app/**",
            ],
            message:
              "Design system (components/ui): no puede depender de domain, lib, features, screens ni app.",
          },
        ],
      },
    ],
  },
};

const layoutEntry = {
  files: [`components/layout/**/*.${TS_FILES}`],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: [
              "@/features",
              "@/features/**",
              "@/screens",
              "@/screens/**",
              "@/app",
              "@/app/**",
            ],
            message:
              "components/layout: no puede importar features, screens ni app.",
          },
        ],
      },
    ],
  },
};

const featureEntries = features.map((feature) => ({
  files: [`features/${feature}/**/*.${TS_FILES}`],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: ["@/screens", "@/screens/**", "@/app", "@/app/**"],
            message:
              "Regla de capas: features no pueden importar screens ni app.",
          },
          ...features
            .filter((other) => other !== feature)
            .map((other) => ({
              group: [`@/features/${other}`, `@/features/${other}/**`],
              message: `Regla de capas: la feature "${feature}" no puede importar la feature "${other}".`,
            })),
        ],
      },
    ],
  },
}));

const screenEntries = screens.map((screen) => ({
  files: [`screens/${screen}/**/*.${TS_FILES}`],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: ["@/app", "@/app/**"],
            message: "Regla de capas: screens no pueden importar app.",
          },
          ...screens
            .filter((other) => other !== screen)
            .map((other) => ({
              group: [`@/screens/${other}`, `@/screens/${other}/**`],
              message: `Regla de capas: el screen "${screen}" no puede importar el screen "${other}".`,
            })),
        ],
      },
    ],
  },
}));

const appEntry = {
  files: [`app/**/*.${TS_FILES}`],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: ["@/features", "@/features/**", "@/domain", "@/domain/**"],
            message:
              "Regla de capas: app (rutas) no puede importar features ni domain; la composición va en screens.",
          },
        ],
      },
    ],
  },
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  // Architectural import guard (components/test/** is a dev showcase: no rules).
  domainEntry,
  libEntry,
  uiEntry,
  layoutEntry,
  ...featureEntries,
  ...screenEntries,
  appEntry,
]);

export default eslintConfig;
