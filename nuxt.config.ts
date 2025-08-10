export default defineNuxtConfig({
  devtools: { enabled: true },

  // ⬇️ 이 modules 부분을 추가/수정합니다.
  modules: [
    '@nuxtjs/tailwindcss'
  ],

  routeRules: {
    '/api/**': {
      proxy: 'http://45.76.144.201/api/**'
    }
  }
})