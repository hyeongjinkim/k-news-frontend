// ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ AFTER ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  css: [
    '~/assets/css/tailwind.css',
  ],
  routeRules: {
    // API 요청과 static 이미지 요청 모두 백엔드로 프록시합니다.
    '/api/**': {
      proxy: 'http://127.0.0.1:8000/api/**'
    },
    '/static/**': {
      proxy: 'http://127.0.0.1:8000/static/**'
    }
  }
})
// ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ AFTER ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲