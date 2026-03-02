---
paths:
  - "layer/**"
---

## Layer Development Rules

This is the core Nuxt layer (`@incubrain/builder`). Everything here is reusable across consuming apps.

**Server utils:**
- Use relative imports in layer server code (not `~/` which resolves to consuming app)
- `import { db } from '../utils/db'` — correct
- `import { db } from '~/server/utils/db'` — WRONG in a layer

**Component constraints:**
- Max 50 lines per component
- Max 5 props
- No prop drilling > 2 levels — use composable or provide/inject

**Composable patterns:**
- `useAuth()` for all authentication operations
- Auto-imported by Nuxt from `layer/app/composables/`

**Layout hierarchy:**
- `default` — public pages
- `auth` — login/signup (centered card)
- `dashboard` — authenticated area (sidebar + panel)

**Dashboard components (Nuxt UI v4.5):**
- `UDashboardGroup` — root wrapper
- `UDashboardSidebar` — collapsible, resizable sidebar
- `UDashboardPanel` — main content area
- `UDashboardNavbar` — top navbar within panel
- `UNavigationMenu` — sidebar navigation

**SSR safety:**
- Use `import.meta.client` guards for browser-only APIs
- `useAuth()` passes `useFetch` to `createAuthClient` for SSR
- Better Auth session resolved server-side via cookie

**Schema patterns:**
- Base tables in `layer/server/database/schema.ts`
- Consuming app re-exports + extends in own schema file
- Drizzle config lives in consuming app (not layer)
