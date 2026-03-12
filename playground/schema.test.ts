import { describe, it, expect } from 'vitest'
import { getTableName, getTableColumns } from 'drizzle-orm'
import { user, session, account, verification, project } from '../layer/server/database/schema'

describe('database schema', () => {
  describe('user table', () => {
    it('has correct table name', () => {
      expect(getTableName(user)).toBe('user')
    })

    it('has all required columns', () => {
      const columns = getTableColumns(user)
      const columnNames = Object.keys(columns)

      expect(columnNames).toContain('id')
      expect(columnNames).toContain('name')
      expect(columnNames).toContain('email')
      expect(columnNames).toContain('emailVerified')
      expect(columnNames).toContain('image')
      expect(columnNames).toContain('createdAt')
      expect(columnNames).toContain('updatedAt')
    })

    it('has email as unique and not null', () => {
      const columns = getTableColumns(user)
      expect(columns.email.notNull).toBe(true)
      expect(columns.email.isUnique).toBe(true)
    })
  })

  describe('session table', () => {
    it('has correct table name', () => {
      expect(getTableName(session)).toBe('session')
    })

    it('has all required columns', () => {
      const columns = getTableColumns(session)
      const columnNames = Object.keys(columns)

      expect(columnNames).toContain('id')
      expect(columnNames).toContain('expiresAt')
      expect(columnNames).toContain('token')
      expect(columnNames).toContain('userId')
    })

    it('has token as unique', () => {
      const columns = getTableColumns(session)
      expect(columns.token.isUnique).toBe(true)
    })
  })

  describe('account table', () => {
    it('has correct table name', () => {
      expect(getTableName(account)).toBe('account')
    })

    it('has all required columns', () => {
      const columns = getTableColumns(account)
      const columnNames = Object.keys(columns)

      expect(columnNames).toContain('id')
      expect(columnNames).toContain('accountId')
      expect(columnNames).toContain('providerId')
      expect(columnNames).toContain('userId')
      expect(columnNames).toContain('password')
    })
  })

  describe('verification table', () => {
    it('has correct table name', () => {
      expect(getTableName(verification)).toBe('verification')
    })

    it('has all required columns', () => {
      const columns = getTableColumns(verification)
      const columnNames = Object.keys(columns)

      expect(columnNames).toContain('id')
      expect(columnNames).toContain('identifier')
      expect(columnNames).toContain('value')
      expect(columnNames).toContain('expiresAt')
    })
  })

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
