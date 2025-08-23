// nuxt.config.ts
export default defineNuxtConfig({
  devtools: { enabled: true },

  routeRules: {
    '/api/**': {
      // ⬇️ Change this line
      proxy: 'http://45.76.144.201:8000/api/**'
    }
  }
})