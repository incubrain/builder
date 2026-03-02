## Resolved Decisions

**Auth: Better Auth (core library, not community module)**
- GitHub OAuth + Magic Link via Resend
- Session cookie cache (JWE strategy, 5-min TTL)
- Composable wraps `createAuthClient` from `better-auth/vue`

**Database: Turso/LibSQL + Drizzle ORM**
- Local file DB for development (`file:./data/local.db`)
- Turso with embedded replicas for production
- Drizzle for type-safe queries and migrations

**UI: Nuxt UI v4.5**
- Dashboard components (free tier): UDashboardGroup, UDashboardSidebar, UDashboardPanel
- OKLCH color system with primary/secondary/neutral/success/warning/error/info

**Email: Resend**
- Magic link delivery
- Transactional email

**Deployment: Railway**
- Nitro `node-server` preset
- Docker as universal fallback

**Monorepo: pnpm workspaces**
- `layer/` — published @incubrain/builder
- `examples/default/` — example app extending layer
- `playground/` — development playground
- `cli/` — create-builder scaffold tool

**Client-side offline: Documented as graduation step**
- Not included in base template
- PWA installability via @vite-pwa/nuxt (future)

## Decision Framework

**Before adding anything:**
1. Does every online product need this?
  - No → Reject (graduation path)
  - Yes → Continue
2. Does an existing library/module solve this?
  - Yes → Use it
  - No → Build minimal version
3. Ship → Iterate based on usage

## What This Template IS

- Auth (sign up, sign in, sign out)
- Database (schema, migrations, queries)
- Dashboard (sidebar, nav, pages)
- Deployment (Railway, Docker)
- AI-driven development harness

## What This Template IS NOT

- Email marketing platform
- Payment processor
- Real-time collaboration tool
- Admin panel builder
- Multi-tenant SaaS framework
