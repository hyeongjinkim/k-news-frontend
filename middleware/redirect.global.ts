export default defineNuxtRouteMiddleware((to, from) => {
  // 이미 언어 경로에 있으면 스킵
  const pathSegments = to.path.split('/')
  const possibleLang = pathSegments[1]
  const supportedLangs = ['ko', 'en', 'ja', 'zh', 'es', 'pt', 'id', 'th', 'vi', 'ms', 'tr', 'hi', 'fil', 'ar', 'fr', 'de', 'ru', 'it', 'pl', 'nl']
  
  if (supportedLangs.includes(possibleLang)) {
    return // 이미 언어 페이지에 있음
  }

  // 루트(/)에서만 자동 리다이렉트
  if (to.path === '/') {
    const nuxtApp = useNuxtApp()
    let detectedLang = 'en' // 기본값
    
    // 1. localStorage에서 사용자 선택 언어 확인 (클라이언트만)
    if (process.client) {
      const savedLang = localStorage.getItem('preferred-language')
      if (savedLang && supportedLangs.includes(savedLang)) {
        return navigateTo(`/${savedLang}`, { redirectCode: 301 })
      }
    }
    
    // 2. 브라우저 언어 감지 (기존 로직)
    const languageMap: Record<string, string> = {
      'ko': 'ko',
      'en': 'en',
      'ja': 'ja',
      'zh': 'zh',
      'es': 'es',
      'pt': 'pt',
      'id': 'id',
      'th': 'th',
      'vi': 'vi',
      'ms': 'ms',
      'tr': 'tr',
      'hi': 'hi',
      'fil': 'fil',
      'ar': 'ar',
      'fr': 'fr',
      'de': 'de',
      'ru': 'ru',
      'it': 'it',
      'pl': 'pl',
      'nl': 'nl'
    }
    
    if (process.server) {
      const acceptLanguage = nuxtApp.ssrContext?.event.node.req.headers['accept-language'] || ''
      const languages = acceptLanguage
        .split(',')
        .map(lang => {
          const [code, qValue] = lang.trim().split(';q=')
          return {
            code: code.toLowerCase(),
            priority: qValue ? parseFloat(qValue) : 1.0
          }
        })
        .sort((a, b) => b.priority - a.priority)
      
      for (const { code } of languages) {
        const primaryLang = code.split('-')[0]
        if (languageMap[code]) {
          detectedLang = languageMap[code]
          break
        } else if (languageMap[primaryLang]) {
          detectedLang = languageMap[primaryLang]
          break
        }
      }
    }
    
    return navigateTo(`/${detectedLang}`, { redirectCode: 301 })
  }
})