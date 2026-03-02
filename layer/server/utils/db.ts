import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'

const config = useRuntimeConfig()

const client = createClient({
  url: config.tursoUrl || 'file:./data/local.db',
  authToken: config.tursoAuthToken || undefined,
})

export const db = drizzle(client)
