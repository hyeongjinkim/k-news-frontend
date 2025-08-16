export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  routeRules: {
    '/api/**': {
      proxy: 'http://45.76.144.201/api/**'
    }
  },

  // ⬇️ 이 부분을 추가해주세요.
  generate: {
    exclude: [
      '/'
    ]
  }
})