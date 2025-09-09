// nuxt.config.ts
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  css: [
    '~/assets/css/tailwind.css',
  ],
  
  nitro: {
    prerender: {
      routes: ['/sitemap.xml'],
      crawlLinks: true
    }
  },
  
  routeRules: {
    // 메인 페이지들: 10분마다 재생성 (20개 언어)
    '/': { isr: 600 },
    '/ko': { isr: 600 },
    '/en': { isr: 600 },
    '/ja': { isr: 600 },
    '/zh': { isr: 600 },
    '/es': { isr: 600 },
    '/pt': { isr: 600 },
    '/id': { isr: 600 },
    '/th': { isr: 600 },
    '/vi': { isr: 600 },
    '/ms': { isr: 600 },
    '/tr': { isr: 600 },
    '/hi': { isr: 600 },
    '/fil': { isr: 600 },
    '/ar': { isr: 600 },
    '/fr': { isr: 600 },
    '/de': { isr: 600 },
    '/ru': { isr: 600 },
    '/it': { isr: 600 },
    '/pl': { isr: 600 },
    '/nl': { isr: 600 },
    
    // 기사 페이지: 정적 생성
    '/*/article/**': { 
      isr: true
    },

    '/*/keyword/**': { 
      isr: 1200
    },


    // API 프록시
    '/api/**': {
      proxy: 'http://127.0.0.1:8000/api/**'
    },
    '/static/**': {
      proxy: 'http://127.0.0.1:8000/static/**'
    }
  }
})