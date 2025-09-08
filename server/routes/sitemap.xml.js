// server/routes/sitemap.xml.js

export default defineEventHandler(async (event) => {
  const baseUrl = 'https://oppagram.com'
  
  // 지원하는 모든 언어
  const languages = [
    'ko', 'en', 'ja', 'zh', 'es', 'pt', 'id', 'th', 'vi', 
    'ms', 'tr', 'hi', 'fil', 'ar', 'fr', 'de', 'ru', 'it', 'pl', 'nl'
  ]
  
  // API에서 모든 기사 가져오기 (최대 1000개)
  let allArticles = []
  let allKeywords = new Set()
  
  try {
    // 기사 데이터 가져오기 (여러 페이지)
    for (let page = 1; page <= 10; page++) {
      const articles = await $fetch(`http://127.0.0.1:8000/api/articles?page=${page}&limit=100`)
      if (articles.length === 0) break
      allArticles.push(...articles)
      
      // 키워드 수집
      articles.forEach(article => {
        if (article.keywords) {
          article.keywords.forEach(keyword => allKeywords.add(keyword))
        }
      })
    }
  } catch (error) {
    console.error('Failed to fetch articles for sitemap:', error)
  }
  
  // 우선순위 계산 함수
  function getPriority(type, date) {
    const daysSincePublished = (Date.now() - new Date(date)) / (1000 * 60 * 60 * 24)
    
    if (type === 'home') return '1.0'
    if (type === 'article') {
      if (daysSincePublished < 1) return '0.9'
      if (daysSincePublished < 7) return '0.8'
      if (daysSincePublished < 30) return '0.7'
      return '0.6'
    }
    if (type === 'keyword') return '0.5'
    return '0.3'
  }
  
  // 업데이트 빈도 계산
  function getChangefreq(type, date) {
    const daysSincePublished = (Date.now() - new Date(date)) / (1000 * 60 * 60 * 24)
    
    if (type === 'home') return 'hourly'
    if (type === 'article') {
      if (daysSincePublished < 1) return 'hourly'
      if (daysSincePublished < 7) return 'daily'
      if (daysSincePublished < 30) return 'weekly'
      return 'monthly'
    }
    if (type === 'keyword') return 'daily'
    return 'weekly'
  }
  
  // XML 생성
  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n'
  sitemap += '<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>\n'
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n'
  sitemap += '        xmlns:xhtml="http://www.w3.org/1999/xhtml"\n'
  sitemap += '        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"\n'
  sitemap += '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n'
  
  // 1. 홈페이지 (모든 언어)
  languages.forEach(lang => {
    sitemap += '  <url>\n'
    sitemap += `    <loc>${baseUrl}/${lang}</loc>\n`
    
    // 다른 언어 링크 추가
    languages.forEach(altLang => {
      if (altLang !== lang) {
        sitemap += `    <xhtml:link rel="alternate" hreflang="${altLang}" href="${baseUrl}/${altLang}"/>\n`
      }
    })
    sitemap += `    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/en"/>\n`
    
    sitemap += `    <lastmod>${new Date().toISOString()}</lastmod>\n`
    sitemap += `    <changefreq>hourly</changefreq>\n`
    sitemap += `    <priority>1.0</priority>\n`
    sitemap += '  </url>\n'
  })
  
  // 2. 모든 기사 페이지 (모든 언어)
  allArticles.forEach(article => {
    const publishDate = new Date(article.created_at || article.display_published_at)
    const priority = getPriority('article', publishDate)
    const changefreq = getChangefreq('article', publishDate)
    
    languages.forEach(lang => {
      // 해당 언어 번역이 있는 경우만
      if (article.translations && article.translations[lang]) {
        sitemap += '  <url>\n'
        sitemap += `    <loc>${baseUrl}/${lang}/article/${article.id}</loc>\n`
        
        // 다른 언어 링크
        languages.forEach(altLang => {
          if (altLang !== lang && article.translations[altLang]) {
            sitemap += `    <xhtml:link rel="alternate" hreflang="${altLang}" href="${baseUrl}/${altLang}/article/${article.id}"/>\n`
          }
        })
        
        // Google News 태그 (48시간 이내 기사만)
        const hoursSincePublished = (Date.now() - publishDate) / (1000 * 60 * 60)
        if (hoursSincePublished < 48) {
          sitemap += '    <news:news>\n'
          sitemap += '      <news:publication>\n'
          sitemap += '        <news:name>oppagram</news:name>\n'
          sitemap += `        <news:language>${lang}</news:language>\n`
          sitemap += '      </news:publication>\n'
          sitemap += `      <news:publication_date>${publishDate.toISOString()}</news:publication_date>\n`
          sitemap += `      <news:title>${escapeXml(article.translations[lang].title)}</news:title>\n`
          if (article.keywords && article.keywords.length > 0) {
            sitemap += `      <news:keywords>${escapeXml(article.keywords.slice(0, 10).join(', '))}</news:keywords>\n`
          }
          sitemap += '    </news:news>\n'
        }
        
        // 이미지 정보
        if (article.image_path) {
          const imageUrl = article.image_path.startsWith('http') 
            ? article.image_path 
            : `${baseUrl}/static/images/${article.image_path.split('/').pop()}`
          
          sitemap += '    <image:image>\n'
          sitemap += `      <image:loc>${escapeXml(imageUrl)}</image:loc>\n`
          sitemap += `      <image:title>${escapeXml(article.translations[lang].title)}</image:title>\n`
          sitemap += '    </image:image>\n'
        }
        
        sitemap += `    <lastmod>${publishDate.toISOString()}</lastmod>\n`
        sitemap += `    <changefreq>${changefreq}</changefreq>\n`
        sitemap += `    <priority>${priority}</priority>\n`
        sitemap += '  </url>\n'
      }
    })
  })
  
  // 3. 키워드 페이지 (인기 키워드만)
  const popularKeywords = Array.from(allKeywords).slice(0, 100) // 상위 100개만
  
  popularKeywords.forEach(keyword => {
    languages.forEach(lang => {
      sitemap += '  <url>\n'
      sitemap += `    <loc>${baseUrl}/${lang}/keyword/${encodeURIComponent(keyword)}</loc>\n`
      
      // 다른 언어 링크
      languages.forEach(altLang => {
        if (altLang !== lang) {
          sitemap += `    <xhtml:link rel="alternate" hreflang="${altLang}" href="${baseUrl}/${altLang}/keyword/${encodeURIComponent(keyword)}"/>\n`
        }
      })
      
      sitemap += `    <lastmod>${new Date().toISOString()}</lastmod>\n`
      sitemap += `    <changefreq>daily</changefreq>\n`
      sitemap += `    <priority>0.5</priority>\n`
      sitemap += '  </url>\n'
    })
  })
  
  sitemap += '</urlset>'
  
  // 응답 헤더 설정
  setHeader(event, 'Content-Type', 'application/xml')
  setHeader(event, 'Cache-Control', 'max-age=3600, must-revalidate')
  
  return sitemap
})

// XML 특수문자 이스케이프
function escapeXml(text) {
  if (!text) return ''
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}