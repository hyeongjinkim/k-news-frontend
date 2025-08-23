// nuxt.config.ts
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss'
  ],

  // 🔽 이 부분을 추가해주세요!
  css: [
    '~/assets/css/tailwind.css',
  ],

  routeRules: {
    '/api/**': {
      proxy: 'http://127.0.0.1:8000/api/**' 
    }
  }
})