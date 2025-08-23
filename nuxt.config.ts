// nuxt.config.ts
export default defineNuxtConfig({
  devtools: { enabled: true },

  routeRules: {
    '/api/**': {
      // ⬇️ Change this line
      proxy: 'http://127.0.0.1:8000/api/**'
    }
  }
})