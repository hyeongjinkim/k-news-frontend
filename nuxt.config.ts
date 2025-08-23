// nuxt.config.ts
export default defineNuxtConfig({
  devtools: { enabled: true },

  // 🔽 이 부분을 추가해주세요!
  modules: [
    '@nuxtjs/tailwindcss'
  ],

  routeRules: {
    '/api/**': {
      proxy: 'http://127.0.0.1:8000/api/**' 
    }
  }
})