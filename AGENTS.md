# IncuBrain Builder

A versatile Nuxt app builder for entrepreneurs — ships auth, database, dashboard, and deployment so you can get to beta FAST.

## Quick Start

```bash
pnpm dev              # Example app dev server
pnpm dev:pg           # Playground dev server
pnpm build            # Production build
pnpm lint             # ESLint check
pnpm lint:fix         # ESLint autofix
pnpm typecheck        # Nuxt typecheck (layer)
pnpm verify           # prepare + lint + typecheck
pnpm db:push          # Push schema to database
pnpm db:generate      # Generate migrations
pnpm db:studio        # Open Drizzle Studio
pnpm cli:build        # Build CLI
pnpm test             # Run tests
```

## Critical Rules

1. **This is a template, not a product.** Every feature must be something EVERY online product needs. No niche features.
2. **Never build custom when library exists.** Priority: VueUse → library → custom (last resort). Check composables.vueuse.org first.
3. **Minimal by default.** Auth, DB, dashboard, deploy — nothing more. Users add features on top.
4. **Complexity budget:** max 50 lines per component, max 5 props, max 2 abstraction layers, max 3 nesting levels.
5. **Ship first, optimize later.** Ship working → measure → optimize what data proves necessary.
6. **Layer-first.** All reusable code lives in `layer/`. Example apps only extend and customize.

## Architecture

**Core stack:**
- **Auth:** Better Auth (GitHub OAuth + Magic Link via Resend)
- **Database:** Drizzle ORM + Turso/LibSQL (local SQLite for dev)
- **UI:** Nuxt UI v4.5 dashboard components
- **Deploy:** Railway primary, Docker universal fallback

**Key patterns:**
- Layer architecture: `layer/` is the published `@incubrain/builder` Nuxt layer
- Example apps extend via `extends: ['@incubrain/builder']`
- Server utils use relative imports (not `~/` aliases) in layers
- SSR: Nuxt 4, use `import.meta.client` guards for client-only APIs

## File Locations

```bash
layer/                         → Nuxt layer (core reusable code)
layer/app/layouts/             → Layouts: default, auth, dashboard
layer/app/pages/               → Pages: login, dashboard/*, [...slug]
layer/app/composables/         → Composables: useAuth
layer/server/utils/            → Server utils: db, auth
layer/server/api/              → API routes: auth/[...all], health
layer/server/database/         → Schema: base tables
examples/default/              → Default example app
playground/                    → Development playground
cli/                           → create-builder CLI tool
shared/types/                  → TypeScript types
docs/plan/                     → Planning documents
.agents/rules/                 → Agent rule files (symlinked from .claude/rules/)
.agents/skills/                → External skills (gitignored, install with scripts/install-skills.sh)
skills/                        → Custom skills (committed to git)
```

## Common Tasks

- **Add new page:** Create in `layer/app/pages/`, use `definePageMeta({ layout: 'dashboard' })`
- **Add new API route:** Create in `layer/server/api/`, use relative imports for utils
- **Extend schema:** Add tables in `layer/server/database/schema.ts`, re-export in example
- **Deploy:** Use Railway config or `Dockerfile` in example app

## Before You Code

1. Does VueUse solve this? (composables.vueuse.org)
2. Does an existing component handle this?
3. Is this a core template need (auth/db/dashboard/deploy)?
4. Does Nuxt UI provide a component for this?

If all answers are "No" → don't build it.

## Rules

Detailed rules are in `.agents/rules/` (symlinked at `.claude/rules/`):
- @.agents/rules/architecture.md — Stack decisions and integration points
- @.agents/rules/conventions.md — Naming, component rules, code patterns
- @.agents/rules/decisions.md — Resolved decisions and decision framework
- @.agents/rules/layer-development.md — Layer development patterns

## Skills

External agent skills extend capabilities for specialized tasks. Skills are installed to `.agents/skills/` (gitignored). After cloning, run `bash scripts/install-skills.sh` to install them.

**When to use skills:**
- **Development**: nuxt, nuxt-ui, vue-best-practices, vitest, vueuse-functions, pinia
- **Design**: frontend-design, theme-factory, web-design-guidelines
- **Testing**: systematic-debugging, vitest
- **Tools**: agent-browser, manage-mcp

**Commands:**
```bash
bash scripts/install-skills.sh          # Install or update all skills
npx skills list --agent claude-code     # List installed skills
npx skills update skill-name            # Update a specific skill
```
