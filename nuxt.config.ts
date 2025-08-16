export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  routeRules: {
    '/api/**': {
      proxy: 'http://45.76.144.201/api'
    }
  }
  // generate 섹션 삭제!
})