// Re-export layer schema — add your app-specific tables below
// Use relative path for drizzle-kit compatibility (runs outside Nuxt resolution)
export { user, session, account, verification, project } from '../../../../layer/server/database/schema'
