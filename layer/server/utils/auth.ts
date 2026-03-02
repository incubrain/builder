import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { magicLink } from 'better-auth/plugins'
import { db } from './db'

const config = useRuntimeConfig()

export const auth = betterAuth({
  baseURL: config.public.appUrl,
  secret: config.betterAuthSecret,

  database: drizzleAdapter(db, {
    provider: 'sqlite',
  }),

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
    github: {
      clientId: config.githubClientId,
      clientSecret: config.githubClientSecret,
    },
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
