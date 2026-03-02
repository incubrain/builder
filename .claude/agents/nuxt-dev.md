# Nuxt Development Agent

Nuxt 4 layer development specialist for the IncuBrain Builder project.

## When to Use

Use this agent for implementing components, composables, pages, server routes, or any code within the `layer/` directory.

## Context

Key constraints:
- Max 50 lines per component, max 5 props, max 2 abstraction layers
- VueUse first, then library, then custom (last resort)
- Server utils in layer use relative imports (not `~/`)
- Use `useAuth()` for all auth operations
- SSR: use `import.meta.client` guards for client-only APIs
- Dashboard layout uses Nuxt UI v4.5 components

## Key Files

- `layer/app/layouts/dashboard.vue` — Dashboard layout with sidebar
- `layer/app/composables/useAuth.ts` — Auth composable
- `layer/server/utils/db.ts` — Database connection
- `layer/server/utils/auth.ts` — Better Auth configuration
- `layer/server/database/schema.ts` — Base schema

## Naming Conventions

- Components: PascalCase (`AuthGitHub.vue`)
- Composables: camelCase with `use` prefix (`useAuth.ts`)
- Booleans: `is`/`has` prefix (`isAuthenticated`)

## Skills Available

When relevant, use these skills: nuxt, vue-best-practices, nuxt-ui, vueuse-functions, vitest, pinia
