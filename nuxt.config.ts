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
      routes: [],  // 빈 배열로 변경 (아무것도 프리렌더링 안함)
      crawlLinks: false
    },
    static: false  // static을 nitro 안으로 이동
  },  // 👈 여기 콤마 추가!
  
  routeRules: {
    // 메인 페이지들: 10분 캐시
    '/': { headers: { 'cache-control': 'public, s-maxage=600, stale-while-revalidate=30' } },
    '/ko': { headers: { 'cache-control': 'public, s-maxage=600, stale-while-revalidate=30' } },
    '/en': { headers: { 'cache-control': 'public, s-maxage=600, stale-while-revalidate=30' } },
    '/ja': { headers: { 'cache-control': 'public, s-maxage=600, stale-while-revalidate=30' } },
    '/zh': { headers: { 'cache-control': 'public, s-maxage=600, stale-while-revalidate=30' } },
    '/es': { headers: { 'cache-control': 'public, s-maxage=600, stale-while-revalidate=30' } },
    '/pt': { headers: { 'cache-control': 'public, s-maxage=600, stale-while-revalidate=30' } },
    '/id': { headers: { 'cache-control': 'public, s-maxage=600, stale-while-revalidate=30' } },
    '/th': { headers: { 'cache-control': 'public, s-maxage=600, stale-while-revalidate=30' } },
    '/vi': { headers: { 'cache-control': 'public, s-maxage=600, stale-while-revalidate=30' } },
    '/ms': { headers: { 'cache-control': 'public, s-maxage=600, stale-while-revalidate=30' } },
    '/tr': { headers: { 'cache-control': 'public, s-maxage=600, stale-while-revalidate=30' } },
    '/hi': { headers: { 'cache-control': 'public, s-maxage=600, stale-while-revalidate=30' } },
    '/fil': { headers: { 'cache-control': 'public, s-maxage=600, stale-while-revalidate=30' } },
    '/ar': { headers: { 'cache-control': 'public, s-maxage=600, stale-while-revalidate=30' } },
    '/fr': { headers: { 'cache-control': 'public, s-maxage=600, stale-while-revalidate=30' } },
    '/de': { headers: { 'cache-control': 'public, s-maxage=600, stale-while-revalidate=30' } },
    '/ru': { headers: { 'cache-control': 'public, s-maxage=600, stale-while-revalidate=30' } },
    '/it': { headers: { 'cache-control': 'public, s-maxage=600, stale-while-revalidate=30' } },
    '/pl': { headers: { 'cache-control': 'public, s-maxage=600, stale-while-revalidate=30' } },
    '/nl': { headers: { 'cache-control': 'public, s-maxage=600, stale-while-revalidate=30' } },
    
    // 기사 페이지: 24시간 캐시
    '/*/article/**': { 
      headers: { 'cache-control': 'public, s-maxage=86400, stale-while-revalidate=60' }
    },
    
    // 키워드 페이지: 20분 캐시
    '/*/keyword/**': { 
      headers: { 'cache-control': 'public, s-maxage=1200, stale-while-revalidate=30' }
    },
    
    // API 프록시 (캐시 없음)
    '/api/**': {
      proxy: 'http://127.0.0.1:8000/api/**',
      headers: { 'cache-control': 'no-cache' }
    },
    '/static/**': {
      proxy: 'http://127.0.0.1:8000/static/**'
    }
  }
})