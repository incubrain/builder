# AI Harness: Developer Experience for AI-Driven Development

> Modeled directly on Foundry's proven AI harness, adapted for Builder's product-building context.
>
> **Status: IMPLEMENTED** — see actual files in `.agents/`, `.claude/`, `AGENTS.md`, `scripts/`, `skills/`.

---

## Architecture Overview

The harness uses the same three-layer pattern as Foundry:

```
AGENTS.md (root, single source of truth)
    ↓ symlink
.claude/CLAUDE.md
    ↓ symlink
.claude/rules/ → .agents/rules/     (committed, scoped rule files)
.claude/skills/ → .agents/skills/   (gitignored external + symlinked custom)

.claude/agents/                      (committed sub-agent definitions)
.claude/settings.json                (committed permissions + hooks)
.claude/settings.local.json          (gitignored developer overrides)

scripts/install-skills.sh            (idempotent, multi-agent, 24h dedup)
skills/                              (committed custom skills)
```

This pattern supports Claude Code, Cursor, Windsurf, and any other agent — `install-skills.sh` maps agent names to directories (`claude-code` → `.claude`, `cursor` → `.cursor`).

---

## File Structure

```
.agents/
├── rules/                          # Committed, scoped rules (YAML frontmatter paths:)
│   ├── architecture.md             # System boundaries, patterns, integrations
│   ├── conventions.md              # Naming, file structure, code style, constraints
│   ├── decisions.md                # Why we chose X over Y — AI context
│   └── layer-development.md        # Layer-specific development rules
└── skills/                         # GITIGNORED — installed by script + symlinks to skills/

.claude/
├── CLAUDE.md -> ../AGENTS.md       # Symlink to root AGENTS.md
├── rules/ -> ../.agents/rules/     # Symlink
├── skills/ -> ../.agents/skills/   # Symlink
├── agents/                         # Committed sub-agent definitions
│   ├── codebase-explorer.md        # Deep codebase research (read-only)
│   └── nuxt-dev.md                 # Nuxt layer development specialist
├── settings.json                   # Committed — permissions, hooks, env
└── settings.local.json             # GITIGNORED — developer overrides

AGENTS.md                           # Root entry point (single source of truth)

scripts/
└── install-skills.sh               # Multi-agent skill installer

skills/                             # Committed custom skills
└── builder-patterns/
    └── SKILL.md                    # Better Auth + Drizzle + Dashboard patterns
```

---

## AGENTS.md (= .claude/CLAUDE.md via symlink)

```markdown
# IncuBrain Builder

A fast-to-beta Nuxt app template for entrepreneurs — auth, database, dashboard, PWA, AI-driven development.

## Quick Start
pnpm dev          — start dev server (http://localhost:3000)
pnpm build        — production build
pnpm lint         — lint and fix
pnpm test         — run tests
pnpm db:push      — push schema to local DB (dev)
pnpm db:generate  — generate migration files
pnpm db:migrate   — apply migrations
pnpm db:studio    — open Drizzle Studio
pnpm db:seed      — seed database
pnpm cli:build    — build the scaffold CLI
pnpm typecheck    — type check the app
pnpm verify       — prepare + lint + typecheck

## Critical Rules
1. **Ship-first mentality** — working code over perfect code. Get to beta.
2. **No premature abstraction** — 3 similar lines > 1 premature helper
3. **Complexity budget** — max 60 lines/component, 5 props, 3 nesting levels
4. **Use what exists** — Nuxt UI > VueUse > library > custom (last resort)
5. **Types over tests for beta** — strict TypeScript catches most bugs cheaply
6. **Server owns data** — no direct DB imports in app/. Client accesses via API routes.

## Architecture
- **Monorepo**: pnpm workspace — `layer/` (Nuxt layer) + `examples/` + `cli/` + `playground/`
- **Layer**: Published as `@incubrain/builder`, consumed via `extends: ['@incubrain/builder']`
- **Auth**: Better Auth (GitHub OAuth + Magic Link) at `layer/server/utils/auth.ts`
- **Database**: Turso/LibSQL + Drizzle ORM at `layer/server/utils/db.ts`
- **Schema**: `layer/server/database/schema.ts` (base) + `layer/server/database/auth-schema.ts` (auth)
- **UI**: Nuxt UI v4.5 dashboard components
- **PWA**: @vite-pwa/nuxt for offline + installability
- **Deploy**: Railway (primary) + Docker

## File Locations
- Layer (core):     layer/
- Pages:            layer/app/pages/
- Components:       layer/app/components/
- Composables:      layer/app/composables/
- Server API:       layer/server/api/
- DB Schema:        layer/server/database/schema.ts
- Auth config:      layer/server/utils/auth.ts
- DB config:        layer/server/utils/db.ts
- Example app:      examples/default/
- CLI source:       cli/
- Starter template: .starters/default/
- Playground:       playground/

## Rules (all in .agents/rules/, symlinked at .claude/rules/)
- @.agents/rules/architecture.md
- @.agents/rules/conventions.md
- @.agents/rules/decisions.md

## Common Tasks

### Add a new page to the layer
1. Create `layer/app/pages/dashboard/[name].vue`
2. Add navigation item in `layer/app/components/dashboard/DashboardNav.vue`
3. Page is auto-protected by `auth.global.ts` middleware (under `/dashboard/`)

### Add a new database table (layer base tables)
1. Define schema in `layer/server/database/schema.ts`
2. Run `pnpm db:push` (dev) or `pnpm db:generate && pnpm db:migrate` (production)
3. Create server API routes in `layer/server/api/`

### Add app-specific tables (in example/consumer app)
1. Define schema in `examples/default/server/database/schema.ts` (imports layer schema)
2. Run `pnpm db:push` from root

### Add a new API endpoint
1. Create `layer/server/api/[resource]/[method].ts`
2. Access session: `const session = await auth.api.getSession({ headers: event.headers })`
3. Access database: `import { db } from '~/server/utils/db'`

## Before You Code
- [ ] Read the relevant rule files in `.agents/rules/`
- [ ] Check existing composables before creating new ones
- [ ] Check Nuxt UI v4.5 docs for existing components before building custom
- [ ] Use VueUse composables before writing custom reactive logic

## Skills
External skills installed to .agents/skills/ (gitignored). Run: bash scripts/install-skills.sh
Custom skills in skills/ (committed to git).
```

---

## Rules Files

### `.agents/rules/architecture.md`

```markdown
---
paths:
  - "**"
---

# Architecture Rules

## System Boundaries
- Auth is server-side only. Client accesses via `useAuth()` composable.
- Database is server-side only. Client accesses via server API routes.
- No direct database imports in `app/app/` directory.
- All sensitive config lives in `runtimeConfig` (not `public`).
- CLI (`cli/`) is independent — no runtime dependency on the app.

## Patterns

### API Route Pattern
Every API route that requires auth:
\```ts
export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({ headers: event.headers })
  if (!session) throw createError({ statusCode: 401 })
  // ... business logic
})
\```

### Composable Pattern
Composables wrap server API calls and manage client state:
\```ts
export function useResource() {
  const { data, pending, refresh } = useFetch('/api/resources')
  return { data, pending, refresh }
}
\```

### Form Pattern
Forms use Zod schema + Nuxt UI UForm:
\```ts
const schema = z.object({ name: z.string().min(1) })
const state = reactive({ name: '' })
\```

## Key Dependencies
- `better-auth` — auth framework (GitHub OAuth + Magic Link)
- `drizzle-orm` + `@libsql/client` — database (Turso/SQLite)
- `@nuxt/ui` v4.5 — components (dashboard, forms, tables)
- `zod` — validation (shared between client forms and server)
- `resend` — transactional email (magic link delivery)

## Deployment
- Runtime: Node.js (not edge — Turso replicas need persistent filesystem)
- Primary: Railway with `railway.json`
- Universal: Docker with multi-stage Dockerfile
```

### `.agents/rules/conventions.md`

```markdown
---
paths:
  - "**"
---

# Conventions

## Feature Priority
1. Nuxt UI component  2. VueUse composable  3. UnJS utility  4. External library  5. Custom code

## Naming
- Components: PascalCase, prefixed by domain (`AuthGitHub.vue`, `DashboardNav.vue`)
- Composables: `use[Domain][Action].ts` (`useAuth.ts`, `useUserSettings.ts`)
- API routes: kebab-case, RESTful (`/api/users/[id].get.ts`)
- DB schema: camelCase columns, singular table names (`user`, `session`, `project`)

## File Rules
- One component per file, one composable per file
- Server utils auto-imported from `server/utils/`
- Shared types go in `shared/types/`

## Code Style
- `<script setup lang="ts">` always
- `defineEventHandler` not `eventHandler`
- `useFetch` in components (SSR-safe), `$fetch` in server code and composable actions
- Destructure props: `const { size = 'md' } = defineProps<{ size?: string }>()`

## Component Constraints
- Max 60 lines (extract sub-components if larger)
- Max 5 props (use config object pattern beyond that)
- Max 3 template nesting levels
- No inline styles — Tailwind classes only
- No `any` types — use `unknown` and narrow

## Import Order
1. Vue/Nuxt imports
2. Third-party libraries
3. Project imports (composables, utils, types)
4. Relative imports

## Ship-First Checklist
Ready when: core path works, error states handled, types are clean.
Defer: edge cases, perfect error messages, comprehensive tests, optimization.
```

### `.agents/rules/decisions.md`

```markdown
---
paths:
  - "**"
---

# Decision Log

Decisions are final unless re-opened. AI agents should follow these, not re-evaluate them.

## Auth: Better Auth core library (not community module, not alternatives)
- Lucia Auth deprecated (March 2025)
- nuxt-auth-utils too minimal (no magic link, no RBAC path)
- sidebase/nuxt-auth wraps Auth.js (extra abstraction layer)
- @onmax/nuxt-better-auth is alpha (breaking changes expected)
- better-auth core: native TS, growing ecosystem, Drizzle adapter, plugin system

## Database: Turso/LibSQL + Drizzle ORM (not NuxtHub)
- NuxtHub local-first is dev-experience only, not production offline
- Turso embedded replicas are GA for production resilience
- libSQL is open source, self-hostable, zero vendor lock-in
- Drizzle works identically with both (easy to switch if needed)

## Email: Resend (not Plunk, not SES)
- Simplest integration for magic link delivery
- 100 emails/day free tier is sufficient for beta
- Clean API, single npm dependency

## UI: Nuxt UI v4.5 (not v3)
- All 125+ components free (including dashboard)
- Tailwind v4 integration
- TanStack Table powered data tables

## PWA over Tauri (for initial template)
- PWA ships fastest with zero native tooling
- Tauri requires Rust toolchain (barrier for frontend entrepreneurs)
- PWA is additive — Tauri can wrap the same app later

## Same-domain auth (not subdomain)
- Cross-subdomain cookies have documented bugs in better-auth
- Safari ITP complicates cross-subdomain in production
- Same-domain is simpler, faster to beta
- Can migrate to subdomain later if multi-app architecture needed

## Monorepo (pnpm workspace)
- CLI and app need to be versioned together
- Shared dev tooling at root
- Same pattern as Foundry (proven to work)
- .starters/default/ is NOT a workspace member (standalone scaffold template)

## Railway as primary deployment (Docker as universal)
- Turso replicas need persistent filesystem (not serverless)
- Railway: one-click from GitHub, built-in databases, persistent volumes
- Docker: universal fallback for any provider

## No client-side offline data (graduation step)
- Most beta products work online-only
- Server embedded replicas handle critical offline case
- Dexie.js documented as next step, not included
```

---

## `.claude/settings.json`

```json
{
  "permissions": {
    "allow": [
      "Bash(pnpm dev*)",
      "Bash(pnpm build*)",
      "Bash(pnpm lint*)",
      "Bash(pnpm test*)",
      "Bash(pnpm run dev*)",
      "Bash(pnpm run build*)",
      "Bash(pnpm typecheck*)",
      "Bash(pnpm verify*)",
      "Bash(pnpm prepare*)",
      "Bash(pnpm db:*)",
      "Bash(pnpm cli:*)",
      "Bash(npx drizzle-kit *)",
      "Bash(npx auth@latest generate*)",
      "Bash(npx eslint *)",
      "Bash(npx prettier *)",
      "Bash(git status*)",
      "Bash(git diff*)",
      "Bash(git log*)",
      "Bash(git add *)",
      "Bash(git commit *)",
      "Bash(bash scripts/install-skills.sh*)",
      "Bash(npx skills *)"
    ],
    "deny": [
      "Read(./.env)",
      "Read(./.env.*)",
      "Read(./data/**)"
    ]
  },
  "env": {
    "CLAUDE_CODE_AUTOCOMPACT_PCT_OVERRIDE": "80"
  },
  "hooks": {
    "SessionStart": [
      {
        "matcher": "compact",
        "hooks": [
          {
            "type": "command",
            "command": "echo 'POST-COMPACTION: Use pnpm (not npm). Ship-first mentality. Max 60 lines/component. Server owns data — no DB imports in app/. Check .agents/rules/ for guidelines. Nuxt UI v4.5 for components.'"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "filepath=$(echo $CLAUDE_TOOL_INPUT | jq -r '.file_path // .filePath // empty'); if [ -n \"$filepath\" ]; then case \"$filepath\" in *.vue|*.ts|*.js) npx eslint --fix \"$filepath\" 2>/dev/null || true;; esac; fi",
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

Key design decisions (from Foundry):
- `AUTOCOMPACT_PCT_OVERRIDE: "80"` — triggers compaction at 80% context window
- `SessionStart` with `"compact"` matcher — injects critical reminders after compaction
- `PostToolUse` with `"Write|Edit"` — auto-runs ESLint on every file write/edit

---

## Sub-Agent Definitions

### `.claude/agents/codebase-explorer.md`

Deep codebase research and exploration agent. Read-only — does not modify files.
- Understands project structure: layer/, examples/, cli/, shared/
- Follows import chains and checks rule files before recommending changes
- Reports findings concisely with actionable recommendations

### `.claude/agents/nuxt-dev.md`

Nuxt 4 layer development specialist:
- Knows the auth pattern (Better Auth + Drizzle)
- Knows the component pattern (Nuxt UI v4.5 dashboard)
- Follows conventions from `.agents/rules/conventions.md`
- Server utils in layer use relative imports (not `~/`)
- Recommended skills: nuxt, nuxt-ui, vue-best-practices, vueuse-functions

---

## Skills

### External Skills (installed via script, gitignored)

| Skill | Source | Purpose |
|-------|--------|---------|
| nuxt | antfu/skills | Nuxt 3/4 patterns and APIs |
| nuxt-ui | nuxt/ui | Nuxt UI v4.5 component usage |
| vue-best-practices | antfu/skills | Vue 3 patterns |
| vueuse-functions | vueuse/skills | VueUse composable reference |
| systematic-debugging | obra/superpowers | Structured debugging |
| brainstorming | obra/superpowers | Feature ideation framework |
| frontend-design | anthropics/skills | UI/UX design patterns |
| vitest | antfu/skills | Testing patterns |

### Custom Skills (committed to `skills/`)

| Skill | Purpose |
|-------|---------|
| builder-patterns | Better Auth + Drizzle + Dashboard patterns specific to Builder |

### `install-skills.sh`

Same pattern as Foundry's script:
- Accepts agent name argument (`claude-code`, `cursor`, etc.)
- Maps to agent directory (`.claude`, `.cursor`)
- 24-hour dedup to avoid re-installing frequently
- Symlinks custom skills from `skills/` → `.agents/skills/`
- Symlinks `.claude/skills/` → `.agents/skills/`
- Runs on `postinstall` via root `package.json`

---

## `.gitignore` (AI harness entries)

```gitignore
# Agent skills (external — installed by script)
.agents/skills

# Agent directories for non-Claude agents (created by install-skills.sh)
.cursor/
.trae/
.windsurf/

# Claude Code local overrides
CLAUDE.local.md
.claude/settings.local.json

# Local database
data/
```
