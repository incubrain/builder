# Builder Patterns Skill

Patterns specific to the IncuBrain Builder template.

## Layer Extension Pattern

Example apps extend the builder layer:

```typescript
// examples/default/nuxt.config.ts
export default defineNuxtConfig({
  extends: ['@incubrain/builder'],
})
```

## Server Utils in Layers

Always use relative imports in layer server code:

```typescript
// CORRECT — layer/server/api/health.get.ts
import { db } from '../utils/db'

// WRONG — ~/  resolves to consuming app, not layer
import { db } from '~/server/utils/db'
```

## Auth Composable Pattern

```typescript
// In any component or page
const { user, isAuthenticated, signInWithGitHub, signInWithMagicLink, signOut } = useAuth()
```

## Dashboard Layout Pattern

```vue
<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })
</script>
```

## Schema Extension Pattern

```typescript
// examples/default/server/database/schema.ts
export * from '@incubrain/builder/server/database/schema'

// Add app-specific tables
export const myTable = sqliteTable('my_table', {
  id: text('id').primaryKey(),
  // ...
})
```
