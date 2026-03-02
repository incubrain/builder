import { createResolver } from '@nuxt/kit'
import { defineNuxtConfig } from 'nuxt/config'

const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '@nuxt/fonts',
    '@nuxt/image',
    '@vueuse/nuxt',
  ],

  $development: {
    modules: ['@nuxt/eslint'],
    devtools: { enabled: true },
  },

  ssr: true,

  css: [resolve('./app/assets/css/main.css')],

  ui: {
    theme: {
      colors: ['primary', 'secondary', 'neutral', 'success', 'warning', 'error', 'info'],
    },
  },

  runtimeConfig: {
    betterAuthSecret: '',
    githubClientId: '',
    githubClientSecret: '',
    resendApiKey: '',
    tursoUrl: '',
    tursoAuthToken: '',
    public: {
      appName: 'My App',
      appUrl: 'http://localhost:3000',
    },
  },

  dir: {
    assets: resolve('./app/assets'),
  },

  nitro: {
    preset: 'node-server',
  },

  experimental: {
    asyncContext: true,
  },

  compatibilityDate: '2026-01-20',

  typescript: {
    strict: true,
  },

  hooks: {
    'components:extend': (
      components: { pascalName: string, global?: boolean | 'sync' }[],
    ) => {
      const globals = components.filter((c) =>
        ['UButton', 'UIcon'].includes(c.pascalName),
      )
      globals.forEach((c) => (c.global = true))
    },
  },

  icon: {
    serverBundle: {
      collections: ['lucide'],
    },
  },
})
