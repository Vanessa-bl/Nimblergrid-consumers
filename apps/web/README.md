# nimblergrid-consumers · web

Sitio público de **nimblergrid**: las personas buscan, contactan y gestionan sus consultas de alquiler/compra. El panel de inmobiliarias vive en su propio repo (`nimblergrid-agencies`).

**Stack**: Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 · Prismic (contenido) · Auth0 (identidad) · Supabase (datos, en integración).

## Arquitectura

Feature-sliced por capas, con dirección de dependencias estricta:

```
app → screens → features → components/ui · domain · lib
```

| Capa | Rol |
|---|---|
| `app/` | Rutas (App Router). Archivos de 1–3 líneas: importan y renderizan su screen. |
| `screens/` | Una pantalla por ruta: orquestan el fetch y componen features/UI. |
| `features/` | Piezas de dominio reutilizables (`properties`, `filters`, `profile`, `home`). |
| `components/ui/` | Design system, sin dominio (button, avatar, checkbox, form, pagination…). |
| `components/layout/` | Shell de la app (header, footer, navegación). |
| `domain/` | Modelos del negocio + adaptadores. **TypeScript puro: cero imports.** |
| `lib/` | Infraestructura (prismic, supabase, cache, security). |

### Reglas de dependencias (garantizadas por ESLint)

`eslint.config.mjs` incluye un guard (`no-restricted-imports`) que falla si:

- `domain` importa cualquier otra capa (debe ser puro).
- `lib` importa UI (solo puede importar `domain` y dependencias externas).
- `components/ui` importa dominio o capas superiores.
- Una feature importa otra feature (ni `screens` ni `app`).
- Una screen importa otra screen (ni `app`).
- `app` importa `features` o `domain` (la composición vive en `screens`).

## Estructura

```
apps/web/
├── app/                    rutas (App Router) + (showcase) para páginas de desarrollo
├── screens/                buy · home · login · me · real-state-agencies · rent · sell · signup
├── features/               filters · home · profile · properties
├── components/
│   ├── ui/                 design system (sin dominio)
│   ├── layout/             shell (header, footer, nav)
│   └── test/               showcase de componentes (solo dev)
├── domain/                 property.ts · user-profile.ts · navigation.ts
├── lib/                    cache · prismic · security · supabase
├── scripts/                check-tokens.mjs (guard de colores)
└── __tests__/              tests de rutas y pantallas
```

## Theme (design tokens)

La identidad visual vive en **`app/tokens.css`** — CSS puro, sin frameworks, reusable por otros fronts (Angular).

- **Primitivos**: `--brand-50…950` (marca), `--neutral-50…950` (grises), `--decor-*` (ilustración).
- **Semánticos** (el contrato): `--bg`, `--surface`, `--text`, `--text-muted`, `--border`, `--accent`, `--on-accent`, `--overlay`, `--success`, `--focus-ring`.
- **Elevación**: `--elevation-*` (sombras).

`app/globals.css` los expone como utilidades de Tailwind v4 vía `@theme inline`: `bg-brand-500`, `text-neutral-600`, `bg-surface`, `shadow-card`, `fill-map-land`…

**Reglas del theme:**

- Prohibido hardcodear colores (hex / rgb / hsl) o usar paletas crudas de Tailwind (`rose-*`, `zinc-*`, `gray-*`…).
- Guard automático: `pnpm check:tokens` (también corre dentro de `pnpm lint`).
- **Cambiar la identidad = cambiar un primitivo en `tokens.css`** y todo el sitio se actualiza.

## Comandos

```bash
pnpm dev            # desarrollo en http://localhost:3000
pnpm build          # build de producción
pnpm test           # tests (jest)
pnpm lint           # eslint + guard de colores
pnpm check:tokens   # solo el guard de colores
```

## Variables de entorno

En `apps/web/.env.local` (gitignored — ver `.env.example`):

- **Auth0**: `AUTH0_DOMAIN`, `AUTH0_CLIENT_ID`, `AUTH0_CLIENT_SECRET`, `AUTH0_SECRET`, `APP_BASE_URL`
- **Prismic**: `NEXT_PUBLIC_PRISMIC_REPO`, `PRISMIC_ACCESS_TOKEN`
- **Supabase**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_PROJECT_REF`, `SUPABASE_SECRET_KEY`
