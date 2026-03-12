import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { magicLink } from 'better-auth/plugins'
import { db } from './db'
import * as schema from '../database/schema'

const config = useRuntimeConfig()
const isDev = import.meta.dev

export const TEST_USER = {
  email: 'test@builder.dev',
  password: 'builder-test-1234',
  name: 'Test User',
} as const

export const auth = betterAuth({
  baseURL: config.public.appUrl,
  secret: config.betterAuthSecret || (isDev ? 'dev-secret-do-not-use-in-production' : ''),

  database: drizzleAdapter(db, {
    provider: 'sqlite',
    schema,
  }),

  emailAndPassword: {
    enabled: isDev,
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // refresh daily
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5-min cache
      strategy: 'jwe',
    },
  },

  socialProviders: {
    ...(config.githubClientId && config.githubClientSecret
      ? {
          github: {
            clientId: config.githubClientId,
            clientSecret: config.githubClientSecret,
          },
        }
      : {}),
  },

  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        // Only send if Resend API key is configured
        if (!config.resendApiKey) {
          console.warn('[auth] Magic link generated but no RESEND_API_KEY configured:', url)
          return
        }

        const { Resend } = await import('resend')
        const resend = new Resend(config.resendApiKey)
        const appName = config.public.appName || 'Builder App'

        await resend.emails.send({
          from: `noreply@${new URL(config.public.appUrl || 'http://localhost:3000').hostname}`,
          to: email,
          subject: `Sign in to ${appName}`,
          html: `<p>Click the link below to sign in to ${appName}:</p><p><a href="${url}">Sign in</a></p><p>This link expires in 5 minutes.</p>`,
        })
      },
    }),
  ],
})
