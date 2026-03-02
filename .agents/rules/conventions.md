## Feature/Function Planning Priority

1. Nuxt Modules (if exists) https://cdn.jsdelivr.net/npm/@nuxt/modules@latest/modules.json
2. VueUse (if exists) use vueuse skill
3. Unjs (if exists, higher priority for server side functions) https://unjs.io/packages
4. External library
5. Inline (single use only)
6. Local composable

Never build custom if a battle tested option exists.

## Naming

**Components:** PascalCase
```
DashboardNav.vue
AuthGitHub.vue
```

**Composables:** camelCase + `use` prefix
```
useAuth.ts
```

**Pages/Layouts:** kebab-case
```
dashboard.vue
auth.vue
```

**Booleans:** `is` or `has` prefix
```
isAuthenticated
isPending
hasPermission
```

## Component Rules

**Max 50 lines:**
If longer → Extract composable or split component

**Max 5 props:**
If more → Use config object prop

**No prop drilling:**
If passing >2 levels → Use composable or provide/inject

## Code Patterns

**Auth:**
```typescript
const { user, isAuthenticated, signOut } = useAuth()
```

**Database (server only):**
```typescript
import { db } from '../utils/db'
import { project } from '../database/schema'
const rows = await db.select().from(project)
```

**Middleware:**
```typescript
export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated } = useAuth()
  if (to.path.startsWith('/dashboard') && !isAuthenticated.value) {
    return navigateTo('/login')
  }
})
```

## Ship-First Checklist

**Ready when:**
- Core path works
- Error states handled
- Dev server starts clean

**Defer:**
- All edge cases
- Perfect error messages
- Comprehensive logging

## Testing Commands

```bash
pnpm test              # Run unit tests
pnpm lint              # Check code
pnpm build             # Production build
pnpm typecheck         # Type checking
```
