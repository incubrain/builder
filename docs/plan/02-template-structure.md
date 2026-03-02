# IncuBrain Builder: Monorepo & Template Structure

---

## Core Philosophy

> Get to beta FAST. Include only what every online product needs. Nothing more.

The Builder template is the **opposite** of the Foundry template. Foundry validates ideas (content-first, no auth, no database). Builder **builds products** (auth, database, dashboard, deployment).

| | Foundry | Builder |
|---|---|---|
| Purpose | Validate an idea | Build the product |
| Core product | Nuxt layer (`layer/`) | Nuxt layer (`layer/`) with auth, db, dashboard |
| Examples | `examples/foundry`, `examples/astronera` | `examples/default` (reference app) |
| CLI | `create-foundry` scaffolds from `.starters/default/` | `create-builder` scaffolds from `.starters/default/` |
| Starter pattern | `extends: ['@incubrain/foundry']` | `extends: ['@incubrain/builder']` |
| Auth | None | GitHub + Magic Link (Better Auth) |
| Database | None | Turso/SQLite + Drizzle |
| UI | Landing pages, content | Dashboard, data tables, forms |
| Deploy | Static/SSR marketing site | Node.js app server (Railway) |

---

## Architecture: Layer + Examples (same as Foundry)

The Builder template follows the **exact same pattern** as Foundry:

1. **`layer/`** — the published Nuxt layer (`@incubrain/builder`) containing auth, database, dashboard UI, and composables
2. **`examples/`** — workspace apps that `extends: ['@incubrain/builder']` to demo/develop the layer
3. **`cli/`** — `create-builder` CLI that scaffolds from `.starters/default/`
4. **`.starters/default/`** — a thin app that extends the published layer (npm version, not workspace ref)

Users never clone the monorepo. They run `npx create-builder my-app` and get a standalone app that depends on the published `@incubrain/builder` layer.

---

## Monorepo Structure

```
incubrain-builder/
├── .agents/                        # AI harness (see 03-ai-harness.md)
│   ├── rules/
│   │   ├── architecture.md
│   │   ├── conventions.md
│   │   ├── decisions.md
│   │   └── layer-development.md
│   └── skills/                     # Installed agent skills (gitignored)
├── .claude/
│   ├── CLAUDE.md -> ../AGENTS.md   # Symlink
│   ├── settings.json               # Permissions, hooks
│   ├── skills.json                 # Skills manifest
│   ├── agents/                     # Sub-agent definitions
│   │   ├── codebase-explorer.md
│   │   └── nuxt-dev.md
│   ├── rules/ -> ../.agents/rules/
│   └── skills/ -> ../.agents/skills/
├── AGENTS.md                       # Root AI agent entry point
├── scripts/
│   └── install-skills.sh
├── skills/                         # Custom skills (committed)
│   └── builder-patterns/
│       └── SKILL.md
│
├── layer/                          # *** THE NUXT LAYER (published to npm) ***
│   ├── nuxt.config.ts              # Layer config — all modules, runtimeConfig
│   ├── package.json                # @incubrain/builder
│   ├── app/
│   │   ├── app.vue
│   │   ├── app.config.ts           # Theme, UI defaults
│   │   ├── assets/
│   │   │   └── css/main.css        # Tailwind v4 + Nuxt UI imports
│   │   ├── layouts/
│   │   │   ├── default.vue         # Public layout
│   │   │   ├── auth.vue            # Login/signup
│   │   │   └── dashboard.vue       # Dashboard (sidebar + panels)
│   │   ├── pages/
│   │   │   ├── login.vue           # Login (GitHub + Magic Link)
│   │   │   ├── dashboard/
│   │   │   │   ├── index.vue       # Dashboard home
│   │   │   │   └── settings.vue    # User settings
│   │   │   └── [...slug].vue       # 404 catch-all
│   │   ├── composables/
│   │   │   └── useAuth.ts          # Auth client wrapper
│   │   ├── middleware/
│   │   │   └── auth.global.ts      # Protect /dashboard/*
│   ├── server/
│   │   ├── api/
│   │   │   └── auth/
│   │   │       └── [...all].ts     # Better Auth catch-all
│   │   ├── database/
│   │   │   └── schema.ts           # Drizzle schema (base tables)
│   │   ├── utils/
│   │   │   ├── auth.ts             # Better Auth server config
│   │   │   └── db.ts               # Drizzle + LibSQL client
│   └── shared/
│       └── types/
│           └── index.ts
│
├── examples/                       # *** EXAMPLE APPS (workspace members) ***
│   └── default/                    # Reference implementation
│       ├── nuxt.config.ts          # extends: ['@incubrain/builder']
│       ├── package.json            # depends on @incubrain/builder: workspace:*
│       ├── app/
│       │   ├── pages/
│       │   │   └── index.vue       # Landing page (app-specific)
│       │   └── components/         # App-specific components
│       ├── server/
│       │   └── database/
│       │       └── schema.ts       # App-specific tables (extend layer schema)
│       ├── public/
│       │   └── icons/              # PWA icons
│       ├── .env.example
│       ├── Dockerfile
│       ├── docker-compose.yml
│       └── railway.json
│
├── cli/                            # *** THE SCAFFOLD CLI ***
│   ├── package.json                # create-builder
│   ├── main.ts                     # Entry point (shebang)
│   ├── cli.ts                      # createCLI() using citty + @nuxt/cli
│   ├── copy-files.ts               # processCopyList() — post-scaffold injection
│   ├── types.ts                    # CLIOptions, CopyListConfig
│   └── dist/
│       └── main.js                 # Built bundle
│
├── .starters/                      # *** SCAFFOLD TEMPLATES (NOT workspace members) ***
│   └── default/                    # What users get from `npx create-builder`
│       ├── nuxt.config.ts          # extends: ['@incubrain/builder']
│       ├── package.json            # @incubrain/builder: ^0.1.0 (npm version)
│       ├── app/                    # Thin app dir
│       ├── server/
│       │   └── database/
│       │       └── schema.ts       # Empty app schema (user adds their tables)
│       ├── drizzle.config.ts
│       ├── copy-list.json          # Agent files to fetch from GitHub
│       ├── .env.example
│       ├── Dockerfile
│       └── railway.json
│
├── playground/                     # *** LAYER DEV ENVIRONMENT ***
│   ├── nuxt.config.ts              # extends: ['../layer']
│   ├── package.json
│   └── app/                        # Minimal app for testing the layer
│
├── package.json                    # Root workspace
├── pnpm-workspace.yaml
├── vitest.config.ts                # Root Vitest (workspace projects)
├── .npmrc
├── .gitignore
└── .prettierrc
```

---

## pnpm Workspace

### `pnpm-workspace.yaml`

```yaml
packages:
  - './'
  - 'layer'
  - 'cli'
  - 'playground'
  - 'examples/default'

ignoredBuiltDependencies:
  - '@parcel/watcher'
  - '@tailwindcss/oxide'
  - esbuild
  - unrs-resolver

onlyBuiltDependencies:
  - better-sqlite3
```

Note: `.starters/default/` is NOT a workspace member. It's a standalone template with npm version pins.

---

## Root `package.json`

```jsonc
{
  "name": "@incubrain/builder-workspace",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "packageManager": "pnpm@10.28.2",
  "scripts": {
    "dev": "nuxt dev examples/default",
    "dev:pg": "nuxt dev playground",
    "build": "nuxt build examples/default",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "typecheck": "nuxt typecheck layer",
    "verify": "nuxt prepare layer && pnpm run lint && pnpm run typecheck",
    "db:push": "pnpm --filter @builder/default db:push",
    "db:generate": "pnpm --filter @builder/default db:generate",
    "db:migrate": "pnpm --filter @builder/default db:migrate",
    "db:studio": "pnpm --filter @builder/default db:studio",
    "db:seed": "pnpm --filter @builder/default db:seed",
    "cli:build": "pnpm --filter create-builder build",
    "layer:publish": "cd layer && npm publish --access public",
    "cli:publish": "cd cli && npm publish --access public",
    "test": "vitest",
    "test:watch": "vitest --watch"
  }
}
```

---

## Layer `package.json`

```jsonc
{
  "name": "@incubrain/builder",
  "version": "0.1.0",
  "type": "module",
  "license": "MIT",
  "main": "./nuxt.config.ts",
  "files": ["nuxt.config.ts", "app", "server", "shared"],
  "dependencies": {
    "@iconify-json/lucide": "^1.2.90",
    "@nuxt/kit": "^4.3.0",
    "@nuxt/ui": "^4.5.0",
    "@nuxt/fonts": "^0.11.0",
    "@nuxt/image": "^2.0.0",
    "@vueuse/nuxt": "^14.0.0",
    "better-auth": "^1.2.0",
    "drizzle-orm": "^0.44.0",
    "@libsql/client": "^0.15.0",
    "resend": "^4.0.0",
    "tailwindcss": "^4.1.0",
    "zod": "^3.24.0"
  },
  "devDependencies": {
    "nuxt": "^4.3.0",
    "drizzle-kit": "^0.31.0"
  }
}
```

---

## Example App `nuxt.config.ts`

```typescript
export default defineNuxtConfig({
  extends: ['@incubrain/builder'],

  site: {
    name: 'My App',
    url: process.env.NUXT_PUBLIC_APP_URL || 'http://localhost:3000',
    description: 'One-sentence value proposition',
  },

  routeRules: {
    '/': { appLayout: 'default' },
    '/login': { appLayout: 'auth' },
    '/dashboard/**': { appLayout: 'dashboard' },
  },
})
```

---

## Starter `copy-list.json`

```json
{
  "repo": "incubrain/builder",
  "ref": "main",
  "files": [
    { "src": "scripts/install-skills.sh" },
    { "src": ".agents/rules/architecture.md" },
    { "src": ".agents/rules/conventions.md" },
    { "src": ".agents/rules/decisions.md" },
    { "src": ".claude/settings.json" },
    { "src": ".claude/skills.json" },
    { "src": ".claude/agents/codebase-explorer.md" },
    { "src": ".claude/agents/nuxt-dev.md" },
    { "src": "skills/builder-patterns/SKILL.md" },
    { "src": ".prettierrc" }
  ]
}
```

---

## What the Layer Provides vs What the App Customizes

| Concern | Layer provides | App customizes |
|---------|---------------|----------------|
| Auth | Better Auth config, GitHub + Magic Link, middleware, composables | Auth secret, GitHub credentials, email sender address |
| Database | Drizzle setup, LibSQL client, auth schema, base tables | App-specific tables in `server/database/schema.ts` |
| Dashboard | Layout, sidebar, nav, user menu, command palette | Navigation items, page content, app-specific components |
| UI | Nuxt UI v4.5 config, theme, Tailwind setup | Theme colors via `app.config.ts`, custom components |
| PWA | Workbox config, service worker, manifest structure | App name, icons, theme color |
| Pages | `/login`, `/dashboard`, `/dashboard/settings`, 404 | Landing page (`/`), app-specific dashboard pages |
| Deployment | Nitro preset (node-server) | Dockerfile, railway.json, env vars |

---

## What's NOT in the Template (and why)

| Feature | Why Excluded |
|---------|--------------|
| Payment/Stripe | Not every product charges on day 1 |
| Email sequences | Marketing automation is premature for beta |
| Admin panel | The user IS the admin at beta stage |
| Role-based access | Single-user or simple team initially |
| Multi-tenancy | Over-engineering for beta |
| i18n | English-first for beta |
| Analytics | Add Umami/Plausible in minutes when needed |
| SEO module | Relevant for marketing, not auth-gated dashboard |
| Content module | Builder is not content-driven like Foundry |
| Client-side offline data | Graduation step (Dexie.js) |
