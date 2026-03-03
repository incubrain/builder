import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import { mkdirSync } from 'node:fs'

let _db: ReturnType<typeof drizzle> | undefined

export function useDB() {
  if (!_db) {
    const config = useRuntimeConfig()
    const url = config.tursoUrl || 'file:./data/local.db'

    // Auto-create data directory for local file-based SQLite
    if (url.startsWith('file:')) {
      const filePath = url.replace('file:', '')
      const dir = filePath.substring(0, filePath.lastIndexOf('/'))
      if (dir) mkdirSync(dir, { recursive: true })
    }

    const client = createClient({
      url,
      authToken: config.tursoAuthToken || undefined,
    })
    _db = drizzle(client)
  }
  return _db
}

// Backwards-compatible export — lazily initialized on first access
type DB = ReturnType<typeof drizzle>
export const db = new Proxy({} as DB, {
  get(_, prop: keyof DB) {
    return useDB()[prop]
  },
})
