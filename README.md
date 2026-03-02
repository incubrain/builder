# IncuBrain Builder

A versatile Nuxt app builder for entrepreneurs — ships auth, database, dashboard, and deployment so you can get to beta FAST.

## What's Included

- **Auth** — GitHub OAuth + Magic Link (Better Auth + Resend)
- **Database** — Turso/LibSQL + Drizzle ORM (local SQLite for dev)
- **Dashboard** — Nuxt UI v4.5 sidebar layout with navigation
- **Deployment** — Railway primary, Docker universal fallback
- **AI Harness** — Agent rules, skills, and hooks for AI-driven development

## Quick Start

```bash
# Install dependencies
pnpm install

# Start the dev server (example app)
pnpm dev

# Open http://localhost:3000
```

## Project Structure

```
incubrain-builder/
├── layer/                 # Nuxt layer (@incubrain/builder)
│   ├── app/               # Layouts, pages, composables, middleware
│   └── server/            # API routes, database, auth config
├── examples/default/      # Example app extending the layer
├── playground/            # Development playground
├── cli/                   # create-builder CLI tool
├── docs/plan/             # Planning documents
├── .agents/rules/         # AI agent rules (committed)
├── .claude/               # Claude Code config (symlinks to .agents/)
├── scripts/               # Utility scripts
└── skills/                # Custom AI skills (committed)
```

The core template lives in `layer/`. Example apps consume it via `extends: ['@incubrain/builder']`.

## Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start example app dev server |
| `pnpm dev:pg` | Start playground dev server |
| `pnpm build` | Production build |
| `pnpm lint` | ESLint check |
| `pnpm lint:fix` | ESLint autofix |
| `pnpm typecheck` | Nuxt type checking |
| `pnpm verify` | Prepare + lint + typecheck |
| `pnpm db:push` | Push schema to database |
| `pnpm db:generate` | Generate migrations |
| `pnpm db:studio` | Open Drizzle Studio |
| `pnpm cli:build` | Build the CLI |
| `pnpm test` | Run tests |

## Stack

| Concern | Technology |
|---------|-----------|
| Framework | Nuxt 4 |
| UI | Nuxt UI v4.5 (Tailwind v4, OKLCH colors) |
| Auth | Better Auth (core library) |
| Database | Drizzle ORM + Turso/LibSQL |
| Email | Resend (magic link delivery) |
| Icons | Lucide via @iconify-json/lucide |
| Deploy | Railway (node-server preset) / Docker |
| Package Manager | pnpm (workspaces) |

## Environment Variables

Copy `examples/default/.env.example` to `examples/default/.env` and fill in your values:

```bash
# Required for auth
NUXT_BETTER_AUTH_SECRET=        # Random secret (openssl rand -hex 32)
NUXT_GITHUB_CLIENT_ID=          # GitHub OAuth app
NUXT_GITHUB_CLIENT_SECRET=      # GitHub OAuth app

# Optional
NUXT_RESEND_API_KEY=            # For magic link emails
NUXT_TURSO_URL=                 # Production database URL
NUXT_TURSO_AUTH_TOKEN=          # Production database token
NUXT_PUBLIC_APP_NAME=           # Your app name
NUXT_PUBLIC_APP_URL=            # Your app URL
```

Without env vars configured, the dev server runs with local SQLite and auth warnings (expected).

## Architecture

### Layer Pattern

All reusable code lives in `layer/`. Consuming apps extend it:

```typescript
// examples/default/nuxt.config.ts
export default defineNuxtConfig({
  extends: ['@incubrain/builder'],
})
```

### Server Utils

Layer server code uses **relative imports** (not `~/` which resolves to the consuming app):

```typescript
// layer/server/api/health.get.ts
import { db } from '../utils/db'    // correct
// import { db } from '~/server/utils/db'  // WRONG in a layer
```

### Auth Flow

1. User visits `/login` — GitHub OAuth or Magic Link
2. `auth.global.ts` middleware protects `/dashboard/*` routes
3. `useAuth()` composable provides session, signIn, signOut

### Database

- Dev: `file:./data/local.db` (automatic, no setup needed)
- Production: Turso with embedded replicas
- Schema in `layer/server/database/schema.ts`, extended by consuming apps

## AI-Driven Development

This project includes an AI harness for Claude Code (and other agents):

```bash
# Install agent skills
bash scripts/install-skills.sh

# Rules are in .agents/rules/ (symlinked at .claude/rules/)
# Settings in .claude/settings.json (permissions, ESLint hooks)
# Agent profiles in .claude/agents/
```

See `AGENTS.md` for the full agent entry point.

## What This Template IS NOT

This is a **minimal starting point**, not a full SaaS framework. Features like payment processing, email sequences, admin panels, multi-tenancy, and i18n are intentionally excluded — add them when your product needs them.

See `docs/plan/04-gaps-and-open-questions.md` for graduation paths.

## License

MIT
