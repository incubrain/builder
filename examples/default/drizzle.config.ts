import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'turso',
  schema: ['./server/database/schema.ts'],
  out: './server/database/migrations',
  dbCredentials: {
    url: process.env.NUXT_TURSO_URL || 'file:./data/local.db',
    authToken: process.env.NUXT_TURSO_AUTH_TOKEN || '',
  },
})
