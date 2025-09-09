export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  css: [
    '~/assets/css/tailwind.css',
  ],
  
  ssr: true,
  
  nitro: {
    prerender: {
      routes: [],  // 아무것도 프리렌더링 안함
      crawlLinks: false
    }
  },
  
  routeRules: {
    // 모든 페이지 동적 렌더링 + CDN 캐시 헤더
    '/**': { 
      headers: { 
        'cache-control': 'public, s-maxage=600, stale-while-revalidate=30' 
      } 
    },
    
    // API는 캐시 안함
    '/api/**': {
      proxy: 'http://127.0.0.1:8000/api/**',
      headers: { 'cache-control': 'no-cache, no-store, must-revalidate' }
    },
    '/static/**': {
      proxy: 'http://127.0.0.1:8000/static/**'
    }
  }
})