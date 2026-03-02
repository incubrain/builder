## Stack Decisions

**Auth: Better Auth (core library)**
- NOT the community `@onmax/nuxt-better-auth` module
- GitHub OAuth + Magic Link (via Resend)
- Session cookie cache (JWE, 5-min)
- Client: `createAuthClient` from `better-auth/vue` with `useFetch` for SSR

**Database: Drizzle ORM + Turso/LibSQL**
- Local: `file:./data/local.db` for development
- Production: Turso with embedded replicas
- Schema in `layer/server/database/schema.ts`
- Drizzle config in consuming app (not layer)

**UI: Nuxt UI v4.5**
- All dashboard components are free: UDashboardGroup, UDashboardSidebar, UDashboardPanel, UDashboardNavbar
- OKLCH color system in `layer/app/assets/css/main.css`
- Icon set: Lucide via `@iconify-json/lucide`

**Deploy: Railway (primary)**
- Nitro preset: `node-server`
- Docker as universal fallback
- Dockerfile in example app, not layer

## Key Patterns

**Layer Architecture:**
- `layer/` is the published `@incubrain/builder` Nuxt layer
- Example apps extend via `extends: ['@incubrain/builder']`
- Server utils in layer use relative imports (not `~/` — resolves to consuming app)
- Client composables use Nuxt auto-imports

**Auth Flow:**
- `/login` page → GitHub OAuth or Magic Link
- `auth.global.ts` middleware → protects `/dashboard/*`
- `/api/auth/[...all]` → Better Auth catch-all handler
- `useAuth()` composable → session, signIn, signOut

**Database Flow:**
- `server/utils/db.ts` → createClient + drizzle instance
- `server/utils/auth.ts` → betterAuth with drizzleAdapter
- Example app re-exports layer schema + adds own tables
- `pnpm db:push` to sync schema

## Critical Constraints

**Complexity Budget:**
```
Max component: 50 lines
Max props: 5
Max abstraction: 2 layers deep
Max nesting: 3 levels
```

**SSR Reality:**
- Nuxt 4: Some client APIs unavailable on server
- Use `import.meta.client` guards
- `useAuth()` uses `useFetch` for SSR-safe session

## Graduation Paths (Out of Scope — User Implements)

- Client-side offline data (PWA + local-first)
- Email sequences (Resend/ConvertKit)
- Payment processing (Stripe/LemonSqueezy)
- Real-time features (WebSockets)
- File uploads (S3/R2)
- Admin panel
- Multi-tenancy
- i18n
- Advanced analytics
