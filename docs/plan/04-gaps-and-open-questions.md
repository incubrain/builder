# Gaps & Graduation Paths

> All blocking decisions resolved. This document tracks implementation gaps and future paths.

---

## Identified Gaps

### Gap 1: Better Auth Schema Generation Workflow

The workflow for generating Better Auth's Drizzle schema is manual:
1. Run `npx auth@latest generate`
2. Move generated file to `server/database/auth-schema.ts`
3. Run Drizzle migrations

**Mitigation:** Create a `pnpm db:auth-schema` script. Document that `npx auth@latest migrate` is INCOMPATIBLE with Drizzle.

### Gap 2: Turso Dev vs Production Configuration

Embedded replicas with `syncUrl` require a Turso Cloud account. Local dev uses a plain SQLite file.

**Mitigation:** Environment-based config in `server/utils/db.ts` with clear comments. Dev defaults to `file:./data/local.db`.

### Gap 3: PWA + SSR Interaction

`@vite-pwa/nuxt` can conflict with SSR. Service worker caching of HTML can serve stale content.

**Mitigation:** Workbox `NetworkFirst` for HTML/API, `CacheFirst` only for static assets.

### Gap 4: Magic Link Email Templates

The template includes a bare `<a href>` for magic link emails.

**Mitigation:** Include a minimal but professional HTML email string. Not a full template system.

### Gap 5: SSR Session Hydration

Better Auth's `useSession(useFetch)` needs careful handling to avoid hydration mismatches.

**Mitigation:** Well-tested `useAuth()` composable. Test SSR → CSR handoff in Phase 2.

### Gap 6: Database Seeding

No mechanism for seeding initial data.

**Mitigation:** `server/database/seed.ts` and `pnpm db:seed` script in the example app.

### Gap 7: Layer vs App Schema Separation

The layer provides auth schema + base tables. Apps add their own tables. Need clear patterns for how app schemas extend layer schemas without conflicts.

**Mitigation:** Layer exports base schema from `server/database/schema.ts`. Apps import and extend. Drizzle config in the app points to both. Document this pattern clearly.

### Gap 8: Release Management

Need `release-it` configs for layer publishing and CLI publishing (separate npm packages).

**Mitigation:** `.release-it.json` (workspace), `.release-it.layer.json`, `.release-it.cli.json`. Same pattern as Foundry.

---

## Testing Strategy

Include only critical pass/fail tests:

- **Layer**: Vitest in `playground/` — auth middleware works, db connection works, composables return expected shapes
- **CLI**: Basic scaffold test — `nuxi init` produces expected files, `processCopyList` fetches correctly
- **Root**: Vitest workspace config coordinating both projects

No exhaustive component tests, no E2E, no snapshot tests. Those are graduation steps.

---

## Graduation Paths (documented, not implemented)

| Path | When | How | Complexity |
|------|------|-----|------------|
| Client-side offline data | App needs offline data persistence | Dexie.js for IndexedDB + sync | Medium |
| Tauri desktop wrapper | Need native desktop distribution | Wrap Nuxt app with Tauri 2.0 | Medium |
| Capacitor mobile | Need App Store / Play Store | Static Nuxt build in Capacitor shell | Medium |
| Multi-tenancy | Product grows beyond single user | Better Auth `organization` plugin | Medium-High |
| Payment (Stripe) | Ready to charge users | Webhook handlers, subscription schema | Medium |
| RBAC | Different users need different permissions | Better Auth RBAC plugins | Low-Medium |
| Analytics | Product has real users | `@nuxt/scripts` + Umami/Plausible | Low |
| i18n | Targeting non-English markets | `@nuxtjs/i18n` module | Low-Medium |
| AI Harness extraction | Harness shared across repos | See `06-ai-harness-prd.md` | High |
