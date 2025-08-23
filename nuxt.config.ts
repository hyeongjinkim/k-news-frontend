// nuxt.config.ts
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  css: [
    '~/assets/css/tailwind.css',
  ],
  routeRules: {
    '/api/**': {
      proxy: 'http://127.0.0.1:8000/api/**'
    }
  }
})