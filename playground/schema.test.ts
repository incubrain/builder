import { describe, it, expect } from 'vitest'
import { getTableName, getTableColumns } from 'drizzle-orm'
import { project } from '../layer/server/database/schema'

describe('database schema', () => {
  describe('project table', () => {
    it('has correct table name', () => {
      expect(getTableName(project)).toBe('project')
    })

    it('has all required columns', () => {
      const columns = getTableColumns(project)
      const columnNames = Object.keys(columns)

      expect(columnNames).toContain('id')
      expect(columnNames).toContain('name')
      expect(columnNames).toContain('description')
      expect(columnNames).toContain('userId')
      expect(columnNames).toContain('createdAt')
      expect(columnNames).toContain('updatedAt')
    })

    it('has id as primary key', () => {
      const columns = getTableColumns(project)
      expect(columns.id.primary).toBe(true)
    })

    it('has name as not null', () => {
      const columns = getTableColumns(project)
      expect(columns.name.notNull).toBe(true)
    })

    it('has userId as not null', () => {
      const columns = getTableColumns(project)
      expect(columns.userId.notNull).toBe(true)
    })

    it('has description as nullable', () => {
      const columns = getTableColumns(project)
      expect(columns.description.notNull).toBe(false)
    })
  })
})
