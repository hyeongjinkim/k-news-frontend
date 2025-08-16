export default defineNuxtConfig({
  devtools: { enabled: true },
  
  // ⬇️ 아래 내용을 추가합니다.
  routeRules: {
    '/api/**': {
      proxy: 'http://45.76.144.201/api/**'
    }
  }
})