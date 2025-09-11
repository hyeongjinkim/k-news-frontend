// nuxt.config.ts
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  css: [
    '~/assets/css/tailwind.css',
  ],
  
  ##여기 - app 설정 추가
  app: {
    head: {
      script: [
        {
          src: 'https://www.googletagmanager.com/gtag/js?id=G-Y5NXN91Q9E',
          async: true
        },
        {
          innerHTML: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-Y5NXN91Q9E');
          `,
          type: 'text/javascript'
        }
      ]
    }
  },
  
  nitro: {
    prerender: {
      routes: ['/sitemap.xml'],
      crawlLinks: true
    }
  },
  
  routeRules: {
    // 메인 페이지들: CDN은 10분 캐싱, 브라우저는 재검증
    '/': { 
      isr: 600,
      headers: {
        'cache-control': 's-maxage=600, max-age=0, must-revalidate'
      }
    },
    '/ko': { 
      isr: 600,
      headers: {
        'cache-control': 's-maxage=600, max-age=0, must-revalidate'
      }
    },
    '/en': { 
      isr: 600,
      headers: {
        'cache-control': 's-maxage=600, max-age=0, must-revalidate'
      }
    },
    '/ja': { 
      isr: 600,
      headers: {
        'cache-control': 's-maxage=600, max-age=0, must-revalidate'
      }
    },
    '/zh': { 
      isr: 600,
      headers: {
        'cache-control': 's-maxage=600, max-age=0, must-revalidate'
      }
    },
    '/es': { 
      isr: 600,
      headers: {
        'cache-control': 's-maxage=600, max-age=0, must-revalidate'
      }
    },
    '/pt': { 
      isr: 600,
      headers: {
        'cache-control': 's-maxage=600, max-age=0, must-revalidate'
      }
    },
    '/id': { 
      isr: 600,
      headers: {
        'cache-control': 's-maxage=600, max-age=0, must-revalidate'
      }
    },
    '/th': { 
      isr: 600,
      headers: {
        'cache-control': 's-maxage=600, max-age=0, must-revalidate'
      }
    },
    '/vi': { 
      isr: 600,
      headers: {
        'cache-control': 's-maxage=600, max-age=0, must-revalidate'
      }
    },
    '/ms': { 
      isr: 600,
      headers: {
        'cache-control': 's-maxage=600, max-age=0, must-revalidate'
      }
    },
    '/tr': { 
      isr: 600,
      headers: {
        'cache-control': 's-maxage=600, max-age=0, must-revalidate'
      }
    },
    '/hi': { 
      isr: 600,
      headers: {
        'cache-control': 's-maxage=600, max-age=0, must-revalidate'
      }
    },
    '/fil': { 
      isr: 600,
      headers: {
        'cache-control': 's-maxage=600, max-age=0, must-revalidate'
      }
    },
    '/ar': { 
      isr: 600,
      headers: {
        'cache-control': 's-maxage=600, max-age=0, must-revalidate'
      }
    },
    '/fr': { 
      isr: 600,
      headers: {
        'cache-control': 's-maxage=600, max-age=0, must-revalidate'
      }
    },
    '/de': { 
      isr: 600,
      headers: {
        'cache-control': 's-maxage=600, max-age=0, must-revalidate'
      }
    },
    '/ru': { 
      isr: 600,
      headers: {
        'cache-control': 's-maxage=600, max-age=0, must-revalidate'
      }
    },
    '/it': { 
      isr: 600,
      headers: {
        'cache-control': 's-maxage=600, max-age=0, must-revalidate'
      }
    },
    '/pl': { 
      isr: 600,
      headers: {
        'cache-control': 's-maxage=600, max-age=0, must-revalidate'
      }
    },
    '/nl': { 
      isr: 600,
      headers: {
        'cache-control': 's-maxage=600, max-age=0, must-revalidate'
      }
    },
    
    // 기사 페이지: 브라우저는 재검증
    '/*/article/**': { 
      isr: true,
      headers: {
        'cache-control': 's-maxage=86400, max-age=0, must-revalidate'
      }
    },
    
    // 키워드 페이지: 브라우저는 재검증
    '/*/keyword/**': { 
      isr: 1200,
      headers: {
        'cache-control': 's-maxage=1200, max-age=0, must-revalidate'
      }
    },
    
    // API 프록시: 캐시 없음
    '/api/**': {
      proxy: 'http://127.0.0.1:8000/api/**',
      headers: {
        'cache-control': 'no-cache, no-store, must-revalidate'
      }
    },
    
    // 정적 파일 (이미지 등): 30일 캐싱
    '/static/**': {
      proxy: 'http://127.0.0.1:8000/static/**',
      headers: {
        'cache-control': 'public, max-age=2592000, immutable'
      }
    }
  }
})