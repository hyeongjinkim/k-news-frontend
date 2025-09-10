// server/routes/sitemap-index.xml.js

export default defineEventHandler(async (event) => {
  const baseUrl = 'https://www.oppagram.com'
  const now = new Date().toISOString()
  
  let sitemapIndex = '<?xml version="1.0" encoding="UTF-8"?>\n'
  sitemapIndex += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
  
  // 메인 사이트맵
  sitemapIndex += '  <sitemap>\n'
  sitemapIndex += `    <loc>${baseUrl}/sitemap.xml</loc>\n`
  sitemapIndex += `    <lastmod>${now}</lastmod>\n`
  sitemapIndex += '  </sitemap>\n'
  
  // 언어별 사이트맵 (선택사항)
  const languages = ['ko', 'en', 'ja', 'zh', 'es', 'pt', 'id', 'th', 'vi', 'ms', 'tr', 'hi', 'fil', 'ar', 'fr', 'de', 'ru', 'it', 'pl', 'nl']
  
  languages.forEach(lang => {
    sitemapIndex += '  <sitemap>\n'
    sitemapIndex += `    <loc>${baseUrl}/sitemap-${lang}.xml</loc>\n`
    sitemapIndex += `    <lastmod>${now}</lastmod>\n`
    sitemapIndex += '  </sitemap>\n'
  })
  
  sitemapIndex += '</sitemapindex>'
  
  setHeader(event, 'Content-Type', 'application/xml')
  setHeader(event, 'Cache-Control', 'max-age=3600')
  
  return sitemapIndex
})