# nimblergrid-consumers

Repo del **sitio público** de nimblergrid (React/Next).

- Aplicación: `apps/web` → documentación técnica en [`apps/web/README.md`](apps/web/README.md).
- Ecosistema: `nimblergrid-agencies` (Angular — inmobiliarias) y `nimblergrid-backend` (Supabase + API) viven en repos separados.

## Comandos

```bash
pnpm install
pnpm dev      # levanta la web (http://localhost:3000)
pnpm build    # build de todas las apps del repo
pnpm lint     # eslint + guards
```

## Env

Cada app maneja su propio `.env.local` (gitignored); las plantillas están en cada `.env.example`.
