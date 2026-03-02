# Architecture Decisions: IncuBrain Builder Template

> Status: CONFIRMED — all blocking decisions resolved.

---

## Decision 1: Auth — Better Auth (core library, not community module)

### Decision

Use `better-auth` core library with the `better-auth/vue` client. Do NOT use the community `@onmax/nuxt-better-auth` module (still alpha, expect breaking changes).

### Providers

- **GitHub OAuth** — primary social login
- **Magic Link** — email-based passwordless login via **Resend**

### Email Service: Resend

- 100 emails/day free tier (3,000/month)
- Clean API, single dependency, great DX
- `resend` npm package in the app workspace

### Auth Hosting: Same Domain (not subdomain)

Keep auth on the same domain (`yourapp.com/api/auth/*`), NOT a subdomain.

**Rationale:**
- Cross-subdomain cookies have documented bugs in better-auth (issues #4038, #5519)
- Safari's ITP blocks cross-subdomain cookies in some configurations
- Same-domain is simpler, fewer moving parts, faster to beta
- If multi-app architecture is needed later, `crossSubDomainCookies` can be enabled

### Session Strategy

- Database-backed sessions (default, secure, instantly revocable)
- Cookie cache enabled with `strategy: "jwe"` and `maxAge: 300` (5-min cache reduces DB hits)
- HTTP-only, secure cookies

### Database Adapter

- Drizzle ORM adapter with `provider: "sqlite"`
- Schema generated via `npx auth@latest generate`, then managed by Drizzle Kit

---

## Decision 2: Database — Turso/LibSQL with Drizzle ORM

### Decision

Use **Turso with embedded replicas** as the primary database, powered by **Drizzle ORM**.

### Why Turso over NuxtHub

| Factor | Turso | NuxtHub |
|--------|-------|---------|
| Local-first data | Embedded replicas (GA) with local SQLite file | Dev-only local SQLite, no production offline |
| Deployment flexibility | Any Node.js runtime, VPS, containers, edge | Primarily edge/serverless (Cloudflare, Vercel) |
| Vendor lock-in | Very low — libSQL is open source, self-hostable | Low-medium — abstractions are Nuxt-specific |
| Offline resilience | Server serves reads even if Turso Cloud is down | No production offline story |
| Free tier | 500M reads, 10M writes, 5GB storage | Depends on underlying provider (D1, Neon) |

### Primitives We Need (without NuxtHub)

Use Nitro's built-in caching. Add blob/KV only when needed (YAGNI for beta):

| Primitive | Standalone Option | Notes |
|-----------|-------------------|-------|
| Blob storage | S3/R2 via `unstorage` | Or Uploadthing for file uploads |
| KV store | Unstorage (file/memory/redis) | Nitro's built-in cache layer |
| Cache | Nitro cache (built-in) | `cachedEventHandler`, `cachedFunction` |

### Local Development

```typescript
// Development: local SQLite file, no cloud account needed
const client = createClient({ url: 'file:./data/local.db' })

// Production: embedded replica with cloud sync
const client = createClient({
  url: 'file:./data/local.db',
  syncUrl: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
  syncInterval: 60,
})
```

### Migration Workflow

```bash
# Dev iteration (fast, destructive OK)
npx drizzle-kit push

# Production (versioned, safe)
npx drizzle-kit generate   # creates SQL migration files
npx drizzle-kit migrate    # applies pending migrations
```

---

## Decision 3: Local-First / Offline — PWA + Server Replicas (client-side data is a graduation step)

### Decision

- **Server-side**: Turso embedded replicas handle offline resilience at the database level
- **Client-side**: `@vite-pwa/nuxt` for installability and static asset caching
- **Client-side offline data** (Dexie.js / IndexedDB): document as a "next step", NOT included in initial template

### Rationale

| Approach | Time to Beta | Offline Data | Complexity |
|----------|-------------|--------------|------------|
| PWA (vite-pwa) | Lowest | Service worker caching only | Low |
| PWA + Dexie.js | Low-Medium | IndexedDB with sync | Medium |
| PWA + Tauri | Medium | Native SQLite | Medium-High (Rust) |

Most beta products work online-only. Adding a client-side sync layer prematurely is over-engineering. The server's embedded replicas handle the most critical offline case (server survives Turso Cloud outage).

### What PWA Gives Us

- Installable on desktop and Android
- Service worker for offline asset caching (HTML, JS, CSS, images)
- Workbox caching strategies per route
- App-like experience with manifest

### Graduation Paths (documented, not implemented)

1. **Dexie.js** — client-side IndexedDB for offline data
2. **Tauri 2.0** — desktop wrapper with native SQLite
3. **Capacitor** — mobile wrapper for App Store distribution

---

## Decision 4: UI — Nuxt UI v4.5

### Decision

Use `@nuxt/ui` **v4.5**. All dashboard components are free. This is the latest stable release.

### Key Components for the Template

| Component | Usage |
|-----------|-------|
| `UDashboardGroup` | Root layout wrapper with state persistence |
| `UDashboardSidebar` | Collapsible, resizable sidebar |
| `UDashboardPanel` | Content panels (single or multi-column) |
| `UDashboardNavbar` | Panel-level navbar with mobile toggle |
| `UNavigationMenu` | Sidebar navigation items |
| `UTable` | Data tables (TanStack Table powered) |
| `UForm` + `UFormField` | Schema-validated forms (Zod) |
| `UModal` / `USlideover` | Overlays for CRUD operations |
| `UCommandPalette` | Global search + actions (Cmd+K) |
| `UToast` | Feedback notifications |

### Theming

- Tailwind CSS v4 with CSS-first configuration
- OKLCH color space for consistent palettes (following Foundry's `theme.css` pattern)
- Semantic tokens via `app.config.ts`
- Dark mode out of the box

---

## Decision 5: Deployment — Railway (primary), Docker (universal)

### Decision

- **Primary**: Railway with `railway.json` for one-click deployment
- **Universal**: `Dockerfile` + `docker-compose.yml` for any provider
- **Runtime**: Node.js (not edge/serverless — Turso replicas need persistent filesystem)

### Nitro Preset

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    preset: 'node-server',
  }
})
```

### Docker

Multi-stage build: Node 22 Alpine, pnpm, minimal runtime image.

---

## Decision 6: Monorepo — pnpm Workspace (same architecture as Foundry)

### Decision

The Builder repository follows the **exact same architecture** as Foundry — a Nuxt layer with example apps:

1. **`layer/`** — the published Nuxt layer (`@incubrain/builder`) containing auth, database, dashboard, composables
2. **`examples/default/`** — reference app that `extends: ['@incubrain/builder']`
3. **`cli/`** — the `create-builder` scaffolding CLI
4. **`playground/`** — minimal layer dev/test environment
5. **`.starters/default/`** — scaffold template (NOT a workspace member, uses npm version pins)

### Why This Architecture

- Users consume Builder as a **layer** (`extends: ['@incubrain/builder']`), same as Foundry
- The CLI scaffolds from `.starters/default/` which is a thin app extending the published layer
- This is the proven Foundry pattern — no reason to diverge
- Example app acts as both documentation and development harness for the layer

### Workspace Members

```yaml
# pnpm-workspace.yaml
packages:
  - './'
  - 'layer'
  - 'cli'
  - 'playground'
  - 'examples/default'
```

Note: `.starters/default/` is deliberately NOT a workspace member — it uses npm version pins.

---

## Decision 7: Package Manager & Tooling

### Decision

- **pnpm** with `packageManager` field in root `package.json`
- **Node.js >= 20** — LTS
- **TypeScript** — strict mode
- **ESLint** via `@nuxt/eslint`
- **Prettier** — consistent with Incubrain config
- **Vitest** — root workspace config coordinating `playground` and `cli` test projects
- **tsup** — for CLI build (ESM single-file bundle, same as Foundry CLI)
