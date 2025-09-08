// middleware/redirect.global.ts
export default defineNuxtRouteMiddleware((to, from) => {
  if (to.path === '/') {
    const nuxtApp = useNuxtApp()
    
    // 언어 매핑 (브라우저 언어 코드 -> 서비스 언어)
    const languageMap: Record<string, string> = {
      'ko': 'ko',    // 한국어
      'en': 'en',    // 영어
      'ja': 'ja',    // 일본어
      'zh': 'zh',    // 중국어 (간체)
      'zh-tw': 'zh', // 중국어 (번체) -> 간체로 매핑
      'zh-hk': 'zh', // 중국어 (홍콩) -> 간체로 매핑
      'es': 'es',    // 스페인어
      'pt': 'pt',    // 포르투갈어
      'id': 'id',    // 인도네시아어
      'th': 'th',    // 태국어
      'vi': 'vi',    // 베트남어
      'ms': 'ms',    // 말레이어
      'tr': 'tr',    // 터키어
      'hi': 'hi',    // 힌디어
      'fil': 'fil',  // 필리핀어
      'tl': 'fil',   // 타갈로그어 -> 필리핀어로 매핑
      'ar': 'ar',    // 아랍어
      'fr': 'fr',    // 프랑스어
      'de': 'de',    // 독일어
      'ru': 'ru',    // 러시아어
      'it': 'it',    // 이탈리아어
      'pl': 'pl',    // 폴란드어
      'nl': 'nl',    // 네덜란드어
    }
    
    let detectedLang = 'en' // 기본값
    
    if (process.server) {
      const acceptLanguage = nuxtApp.ssrContext?.event.node.req.headers['accept-language'] || ''
      
      // Accept-Language 파싱 (우선순위 고려)
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
      
      // 매칭 찾기
      for (const { code } of languages) {
        const primaryLang = code.split('-')[0]
        
        // 정확한 매칭 우선
        if (languageMap[code]) {
          detectedLang = languageMap[code]
          break
        }
        // 주 언어 코드로 매칭
        else if (languageMap[primaryLang]) {
          detectedLang = languageMap[primaryLang]
          break
        }
      }
    } else if (process.client) {
      // 브라우저 언어 목록 확인
      const browserLanguages = navigator.languages || [navigator.language]
      
      for (const lang of browserLanguages) {
        const code = lang.toLowerCase()
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