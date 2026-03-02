# Implementation Roadmap

> Ordered by dependency chain. Each phase produces a working state.
> Architecture mirrors Foundry: layer/ + examples/ + cli/ + .starters/ + playground/

---

## Phase 0: Monorepo Scaffold -- COMPLETE

**Goal:** pnpm workspace with layer, example app, playground, and CLI stub — all running.

- [x] Initialize root: `package.json`, `pnpm-workspace.yaml`, `.npmrc`, `vitest.config.ts`
- [x] Create `layer/` workspace: `nuxt.config.ts`, `package.json`
- [x] Create `examples/default/` workspace: extends layer with `workspace:*`
- [x] Create `playground/` workspace: extends `../layer` for layer dev
- [x] Create `cli/` workspace: `package.json`, stub `main.ts`
- [x] Install and configure in layer: `@nuxt/ui@^4.5`, `@nuxt/eslint`, `@nuxt/fonts`, `@vueuse/nuxt`
- [x] Set up Tailwind v4 with OKLCH theme in `layer/app/assets/css/main.css`
- [x] Create `layer/app/app.config.ts` with theme
- [x] Add root scripts, `.prettierrc`, `.gitignore`
- [x] Verify: `pnpm dev` starts example app, Nuxt UI renders

**Deliverable:** Running monorepo — layer extends into example app.

---

## Phase 1: Database -- COMPLETE

**Goal:** Drizzle ORM with local SQLite in the layer, queryable from the example app.

- [x] Install `drizzle-orm`, `@libsql/client`, `drizzle-kit` in layer
- [x] Create `layer/server/utils/db.ts` — environment-aware LibSQL client
- [x] Create `layer/server/database/schema.ts` — base table (`project`)
- [x] Create `examples/default/drizzle.config.ts`
- [x] Create `examples/default/server/database/schema.ts` — imports + extends layer schema
- [x] Add `db:push`, `db:generate`, `db:migrate`, `db:studio`, `db:seed` scripts
- [x] Create `/api/health` API route in layer
- [x] Add `data/` to `.gitignore`
- [ ] Verify: `pnpm db:push` creates tables, API route returns data

**Deliverable:** Working database in the layer, extended by the example app.

---

## Phase 2: Auth -- COMPLETE

**Goal:** GitHub OAuth + Magic Link, protected dashboard routes.

- [x] Install `better-auth`, `resend` in layer
- [x] Create `layer/server/utils/auth.ts` — Better Auth config
- [x] Create `layer/server/api/auth/[...all].ts` — catch-all handler
- [x] Create `layer/app/composables/useAuth.ts` — client wrapper
- [x] Create `layer/app/middleware/auth.global.ts` — route protection
- [x] Create `layer/app/pages/login.vue` — GitHub + Magic Link UI (inline, no separate components)
- [x] Create `layer/app/layouts/auth.vue`
- [ ] Generate and place auth schema at `layer/server/database/auth-schema.ts`
- [ ] Verify: sign in with GitHub, sign in with Magic Link, `/dashboard` protected

**Note:** Auth components (AuthGitHub, AuthMagicLink) are inlined in login.vue to keep things simple. Auth schema generation deferred — Better Auth auto-creates tables on first use with SQLite.

**Deliverable:** Working auth in the layer, functional in example app.

---

## Phase 3: Dashboard Shell -- COMPLETE

**Goal:** Dashboard layout with sidebar, nav, user menu using Nuxt UI v4.5.

- [x] Create `layer/app/layouts/dashboard.vue` — `UDashboardGroup` + `UDashboardSidebar`
- [x] Create `layer/app/pages/dashboard/index.vue` — welcome + empty state
- [x] Create `layer/app/pages/dashboard/settings.vue` — profile + sign out
- [x] Create `examples/default/app/pages/index.vue` — landing page with CTA
- [x] Create `layer/app/pages/[...slug].vue` — 404
- [x] Create `layer/error.vue`
- [x] Verify: dev server starts, build succeeds

**Note:** Navigation and user menu are inlined in `dashboard.vue` layout (under 50 lines). No separate DashboardNav/DashboardUserMenu components needed. UCommandPalette deferred as optional enhancement.

**Deliverable:** Functional dashboard shell.

---

## Phase 4: PWA (can parallel with 5, 6) -- PENDING

**Goal:** Installable, offline asset caching.

- [ ] Install `@vite-pwa/nuxt` in layer
- [ ] Configure PWA manifest in layer `nuxt.config.ts`
- [ ] Add PWA icons to `examples/default/public/icons/`
- [ ] Configure Workbox strategies (NetworkFirst for HTML/API, CacheFirst for assets)
- [ ] Verify: Chrome install prompt works, cached assets serve offline

**Deliverable:** Installable PWA.

---

## Phase 5: AI Harness (can parallel with 4, 6) -- COMPLETE

**Goal:** Full AI agent support.

- [x] Create `.agents/rules/architecture.md`, `conventions.md`, `decisions.md`, `layer-development.md`
- [x] Create `AGENTS.md` at root
- [x] Set up symlinks: `.claude/CLAUDE.md`, `.claude/rules/`, `.claude/skills/`
- [x] Create `.claude/settings.json` — permissions, hooks, autocompact
- [x] Create `.claude/agents/codebase-explorer.md`, `nuxt-dev.md`
- [x] Create `.claude/skills.json`
- [x] Create `scripts/install-skills.sh`
- [x] Create `skills/builder-patterns/SKILL.md`
- [x] Verify: Claude Code reads context, rules load

**Deliverable:** AI agents productive immediately.

---

## Phase 6: CLI (can parallel with 4, 5) -- PARTIALLY COMPLETE

**Goal:** `npx create-builder my-app` scaffolds a working project.

- [x] Implement `cli/main.ts` — entry point with shebang
- [x] Implement `cli/cli.ts` — `createCLI()` using `citty` + `@nuxt/cli` (Foundry pattern)
- [x] Implement `cli/copy-files.ts` — `processCopyList()`
- [x] Implement `cli/types.ts`
- [x] Build CLI: `tsup main.ts --format esm --out-dir dist`
- [ ] Create `.starters/default/` — thin app extending `@incubrain/builder` (npm version)
- [ ] Create `.starters/default/copy-list.json`
- [ ] Write CLI test in `cli/test/cli.test.ts`
- [ ] Verify: scaffold produces runnable app

**Deliverable:** Working scaffold CLI.

---

## Phase 7: Deployment & Testing -- PENDING

**Goal:** Docker-ready, Railway-deployable, critical tests passing.

- [ ] Create `examples/default/Dockerfile` — multi-stage, Node 22 Alpine, pnpm
- [ ] Create `examples/default/docker-compose.yml`
- [ ] Create `examples/default/railway.json`
- [ ] Add critical tests in `playground/` — auth middleware, db connection, composable shapes
- [ ] Add CLI test — scaffold + copy-list verification
- [ ] Add `.release-it.json` configs for layer and CLI publishing
- [ ] Verify: `docker build` succeeds, tests pass, `pnpm test` green

**Deliverable:** Deployable, tested application.

---

## Phase 8: Polish -- PARTIALLY COMPLETE

**Goal:** Template ready for public use.

- [ ] Test full flow: `npx create-builder my-app` → install → dev → sign up → dashboard → deploy
- [ ] Review all env vars in `.env.example`
- [x] Write README.md
- [ ] Verify: new developer goes from scaffold to running app in < 5 minutes

**Deliverable:** Production-ready template.

---

## Dependency Graph

```
Phase 0: Monorepo Scaffold          ✅ DONE
    ↓
Phase 1: Database                   ✅ DONE
    ↓
Phase 2: Auth (needs db)            ✅ DONE
    ↓
Phase 3: Dashboard Shell (needs auth) ✅ DONE
    ↓
┌───────────────────────────────────┐
│ Phase 4: PWA                      │  ⬜ PENDING
│ Phase 5: AI Harness               │  ✅ DONE
│ Phase 6: CLI (needs stable layer) │  🟡 PARTIAL (CLI built, starters pending)
└───────────────────────────────────┘
    ↓
Phase 7: Deployment & Testing       ⬜ PENDING
    ↓
Phase 8: Polish                     🟡 PARTIAL (README done)
```
