import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

export default createConfigForNuxt({
  features: {
    tooling: true,
  },
  dirs: {
    src: ['layer', 'examples/default', 'playground'],
  },
}).append({
  files: ['**/pages/**/*.vue', '**/layouts/**/*.vue', '**/error.vue'],
  rules: {
    'vue/multi-word-component-names': 'off',
  },
})
