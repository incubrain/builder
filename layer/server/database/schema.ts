import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

// Base table provided by the Builder layer.
// Consumer apps can import and extend this schema.
export const project = sqliteTable('project', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  description: text('description'),
  userId: text('user_id').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})
