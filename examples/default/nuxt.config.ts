export default defineNuxtConfig({
  extends: ['@incubrain/builder'],

  site: {
    name: 'Builder Demo',
    url: process.env.NUXT_PUBLIC_APP_URL || 'http://localhost:3000',
    description: 'IncuBrain Builder — fast-to-beta app template',
  },
})
