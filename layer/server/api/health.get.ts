import { db } from '../utils/db'
import { sql } from 'drizzle-orm'

export default defineEventHandler(async () => {
  try {
    await db.run(sql`SELECT 1 as ok`)
    return { status: 'ok', db: 'connected', timestamp: new Date().toISOString() }
  }
  catch (error) {
    return { status: 'error', db: 'disconnected', error: String(error) }
  }
})
