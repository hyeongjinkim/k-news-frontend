// utils/seo.js

// 언어별 사이트 정보
export const siteInfo = {
  en: {
    title: 'oppagram - Latest K-POP & Korean Entertainment News',
    description: 'Your fastest source for real-time K-POP idols, K-drama, and Korean entertainment news worldwide',
    keywords: 'K-POP, BTS, BLACKPINK, Stray Kids, SEVENTEEN, NCT, Korean entertainment, K-drama, idols, movies',
    locale: 'en_US'
  },
  ko: {
    title: 'oppagram - 최신 K-POP & 한국 연예 뉴스',
    description: '실시간 K-POP 아이돌, 드라마, 영화 소식을 가장 빠르게 전달하는 글로벌 한류 미디어',
    keywords: 'K-POP, 케이팝, BTS, 블랙핑크, 스트레이키즈, 세븐틴, NCT, 한국 연예, 아이돌, 한류, 드라마, 영화',
    locale: 'ko_KR'
  },
  ja: {
    title: 'oppagram - 最新K-POP・韓国エンタメニュース',
    description: 'K-POPアイドル、韓国ドラマ、映画の最新情報を最速でお届けする韓流メディア',
    keywords: 'K-POP, BTS, BLACKPINK, Stray Kids, SEVENTEEN, NCT, 韓国エンタメ, 韓流, アイドル, 韓国ドラマ, 映画',
    locale: 'ja_JP'
  },
  zh: {
    title: 'oppagram - 最新K-POP和韩国娱乐新闻',
    description: '全球最快的K-POP偶像、韩剧和韩国娱乐新闻来源',
    keywords: 'K-POP, 防弹少年团, BLACKPINK, Stray Kids, SEVENTEEN, NCT, 韩国娱乐, 韩流, 韓劇, 偶像',
    locale: 'zh_CN'
  },
  es: {
    title: 'oppagram - Últimas noticias de K-POP y entretenimiento coreano',
    description: 'Tu fuente más rápida de noticias sobre K-POP, K-dramas y entretenimiento coreano en tiempo real',
    keywords: 'K-POP, BTS, BLACKPINK, Stray Kids, SEVENTEEN, NCT, entretenimiento coreano, K-drama, ídolos',
    locale: 'es_ES'
  },
  pt: {
    title: 'oppagram - Últimas notícias de K-POP e entretenimento coreano',
    description: 'Sua fonte mais rápida para notícias de K-POP, K-dramas e entretenimento coreano em tempo real',
    keywords: 'K-POP, BTS, BLACKPINK, Stray Kids, SEVENTEEN, NCT, entretenimento coreano, K-drama, ídolos',
    locale: 'pt_BR'
  },
  id: {
    title: 'oppagram - Berita K-POP & Hiburan Korea Terbaru',
    description: 'Sumber tercepat untuk berita real-time K-POP, K-drama, dan hiburan Korea',
    keywords: 'K-POP, BTS, BLACKPINK, Stray Kids, SEVENTEEN, NCT, hiburan Korea, K-drama, idol, film',
    locale: 'id_ID'
  },
  th: {
    title: 'oppagram - ข่าว K-POP และบันเทิงเกาหลีล่าสุด',
    description: 'แหล่งข่าว K-POP ไอดอล ละครเกาหลี และบันเทิงเกาหลีที่เร็วที่สุดแบบเรียลไทม์',
    keywords: 'K-POP, BTS, BLACKPINK, Stray Kids, SEVENTEEN, NCT, บันเทิงเกาหลี, ซีรีส์เกาหลี, ไอดอล',
    locale: 'th_TH'
  },
  vi: {
    title: 'oppagram - Tin tức K-POP & Giải trí Hàn Quốc mới nhất',
    description: 'Nguồn tin nhanh nhất về K-POP, phim Hàn và giải trí Hàn Quốc theo thời gian thực',
    keywords: 'K-POP, BTS, BLACKPINK, Stray Kids, SEVENTEEN, NCT, giải trí Hàn Quốc, K-drama, thần tượng',
    locale: 'vi_VN'
  },
  ms: {
    title: 'oppagram - Berita K-POP & Hiburan Korea Terkini',
    description: 'Sumber terpantas anda untuk berita K-POP, K-drama, dan hiburan Korea masa nyata',
    keywords: 'K-POP, BTS, BLACKPINK, Stray Kids, SEVENTEEN, NCT, hiburan Korea, K-drama, idola',
    locale: 'ms_MY'
  },
  tr: {
    title: 'oppagram - En Son K-POP & Kore Eğlence Haberleri',
    description: 'K-POP idolleri, Kore dizileri ve Kore eğlence haberleri için en hızlı kaynağınız',
    keywords: 'K-POP, BTS, BLACKPINK, Stray Kids, SEVENTEEN, NCT, Kore eğlencesi, K-drama, idoller',
    locale: 'tr_TR'
  },
  hi: {
    title: 'oppagram - नवीनतम के-पॉप और कोरियाई मनोरंजन समाचार',
    description: 'के-पॉप मूर्तियों, कोरियाई नाटकों और कोरियाई मनोरंजन समाचारों के लिए आपका सबसे तेज़ स्रोत',
    keywords: 'के-पॉप, बीटीएस, ब्लैकपिंक, स्ट्रे किड्स, सेवेनटीन, एनसीटी, कोरियाई मनोरंजन, कोरियाई नाटक, आइडल',
    locale: 'hi_IN'
  },
  fil: {
    title: 'oppagram - Pinakabagong Balita sa K-POP at Korean Entertainment',
    description: 'Ang iyong pinakamabilis na mapagkukunan para sa mga balita tungkol sa K-POP, K-drama, at Korean entertainment',
    keywords: 'K-POP, BTS, BLACKPINK, Stray Kids, SEVENTEEN, NCT, Korean entertainment, K-drama, idols',
    locale: 'fil_PH'
  },
  ar: {
    title: 'oppagram - أحدث أخبار الكيبوب والترفيه الكوري',
    description: 'أسرع مصدر لأخبار آيدولز الكيبوب، الدراما الكورية، والترفيه الكوري',
    keywords: 'كيبوب, BTS, بلاك بينك, ستراي كيدز, سفنتين, NCT, الترفيه الكوري, الدراما الكورية, آيدولز',
    locale: 'ar_AR'
  },
  fr: {
    title: 'oppagram - Dernières actualités K-POP & Divertissement coréen',
    description: 'Votre source la plus rapide pour les actualités sur les idoles de la K-POP, les K-dramas et le divertissement coréen',
    keywords: 'K-POP, BTS, BLACKPINK, Stray Kids, SEVENTEEN, NCT, divertissement coréen, K-drama, idoles',
    locale: 'fr_FR'
  },
  de: {
    title: 'oppagram - Neueste K-POP & koreanische Unterhaltungsnachrichten',
    description: 'Ihre schnellste Quelle für Echtzeit-Nachrichten über K-POP-Idole, K-Dramas und koreanische Unterhaltung',
    keywords: 'K-POP, BTS, BLACKPINK, Stray Kids, SEVENTEEN, NCT, koreanische Unterhaltung, K-Drama, Idole',
    locale: 'de_DE'
  },
  ru: {
    title: 'oppagram - Последние новости K-POP и корейских развлечений',
    description: 'Ваш самый быстрый источник новостей о K-POP айдолах, K-дорам и корейских развлечениях в реальном времени',
    keywords: 'K-POP, BTS, BLACKPINK, Stray Kids, SEVENTEEN, NCT, корейские развлечения, K-дорама, айдолы',
    locale: 'ru_RU'
  },
  it: {
    title: 'oppagram - Ultime notizie di K-POP e intrattenimento coreano',
    description: 'La tua fonte più rapida per notizie in tempo reale su idol K-POP, K-drama e intrattenimento coreano',
    keywords: 'K-POP, BTS, BLACKPINK, Stray Kids, SEVENTEEN, NCT, intrattenimento coreano, K-drama, idol',
    locale: 'it_IT'
  },
  pl: {
    title: 'oppagram - Najnowsze wiadomości K-POP i rozrywka koreańska',
    description: 'Twoje najszybsze źródło wiadomości o idolach K-POP, K-dramach i koreańskiej rozrywce',
    keywords: 'K-POP, BTS, BLACKPINK, Stray Kids, SEVENTEEN, NCT, koreańska rozrywka, K-drama, idole',
    locale: 'pl_PL'
  },
  nl: {
    title: 'oppagram - Laatste K-POP & Koreaans Entertainment Nieuws',
    description: 'Uw snelste bron voor real-time nieuws over K-POP-idolen, K-drama en Koreaans entertainment',
    keywords: 'K-POP, BTS, BLACKPINK, Stray Kids, SEVENTEEN, NCT, Koreaans entertainment, K-drama, idolen',
    locale: 'nl_NL'
  }
}

// 메인 페이지 SEO 메타 생성
export function getMainPageMeta(lang) {
  const info = siteInfo[lang] || siteInfo.en
  const baseUrl = 'https://www.oppagram.com'
  const allLangs = Object.keys(siteInfo)
  
  return {
    title: info.title,
    htmlAttrs: {
      lang: lang
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'description', content: info.description },
      { name: 'keywords', content: info.keywords },
      { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
      { name: 'googlebot', content: 'index, follow' },
      { name: 'google', content: 'notranslate' },
      { property: 'og:title', content: info.title },
      { property: 'og:description', content: info.description },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: `${baseUrl}/${lang}` },
      { property: 'og:site_name', content: 'oppagram' },
      { property: 'og:locale', content: info.locale },
      { property: 'og:image', content: `${baseUrl}/og-image.jpg` },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: info.title },
      { name: 'twitter:description', content: info.description },
      { name: 'twitter:image', content: `${baseUrl}/og-image.jpg` },
      { name: 'author', content: 'oppagram' },
      { name: 'publisher', content: 'oppagram' },
      { name: 'theme-color', content: '#000000' },
      { name: 'mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' }
    ],
    link: [
      ...allLangs.map(l => ({
        rel: 'alternate',
        hreflang: l,
        href: `${baseUrl}/${l}`
      })),
      { rel: 'alternate', hreflang: 'x-default', href: `${baseUrl}/en` },
      { rel: 'canonical', href: `${baseUrl}/${lang}` },
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'NewsMediaOrganization',
          name: 'oppagram',
          url: baseUrl,
          logo: `${baseUrl}/logo.png`,
          sameAs: [
            'https://twitter.com/oppagram',
            'https://instagram.com/oppagram',
            'https://facebook.com/oppagram'
          ]
        })
      }
    ]
  }
}

// 기사 페이지 SEO 메타 생성
export function getArticlePageMeta(article, lang) {
  const baseUrl = 'https://www.oppagram.com'
  const title = article?.translations?.[lang]?.title || ''
  const description = article?.translations?.[lang]?.one_sentence_summary || ''
  const keywords = article?.keywords?.join(', ') || ''
  const image = article?.image_path?.startsWith('http')
    ? article.image_path
    : `${baseUrl}/static/images/${article?.image_path?.split('/').pop()}`
  const publishedDate = article?.created_at
    ? new Date(article.created_at).toISOString()
    : new Date().toISOString()
  const allLangs = Object.keys(siteInfo)
  
  return {
    title: `${title} | oppagram`,
    htmlAttrs: {
      lang: lang
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'description', content: description },
      { name: 'keywords', content: keywords },
      { name: 'author', content: article?.press || 'oppagram' },
      { name: 'robots', content: 'index, follow, max-image-preview:large' },
      { name: 'news_keywords', content: keywords },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'article' },
      { property: 'og:url', content: `${baseUrl}/${lang}/article/${article?.id}` },
      { property: 'og:image', content: image },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'article:published_time', content: publishedDate },
      { property: 'article:author', content: article?.press },
      { property: 'article:section', content: 'Entertainment' },
      { property: 'article:tag', content: keywords },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image }
    ],
    link: [
      ...allLangs.map(l => ({
        rel: 'alternate',
        hreflang: l,
        href: `${baseUrl}/${l}/article/${article?.id}`
      })),
      { rel: 'alternate', hreflang: 'x-default', href: `${baseUrl}/en/article/${article?.id}` },
      { rel: 'canonical', href: `${baseUrl}/${lang}/article/${article?.id}` }
    ],
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'NewsArticle',
          headline: title,
          description: description,
          image: image,
          datePublished: publishedDate,
          dateModified: publishedDate,
          author: {
            '@type': 'Person',
            name: article?.press || 'oppagram'
          },
          publisher: {
            '@type': 'Organization',
            name: 'oppagram',
            logo: {
              '@type': 'ImageObject',
              url: `${baseUrl}/logo.png`
            }
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${baseUrl}/${lang}/article/${article?.id}`
          }
        })
      }
    ]
  }
}


export function getKeywordPageMeta(keyword, lang) {
  const info = siteInfo[lang] || siteInfo.en
  const baseUrl = 'https://www.oppagram.com'
  
  // 언어별 키워드 페이지 제목/설명 템플릿
  const templates = {
    ko: {
      title: `${keyword} 관련 뉴스 - oppagram`,
      description: `${keyword}에 대한 최신 K-POP 뉴스와 소식을 확인하세요. 실시간 업데이트되는 ${keyword} 관련 기사 모음`
    },
    en: {
      title: `${keyword} News & Updates - oppagram`,
      description: `Latest K-POP news and updates about ${keyword}. Find all articles related to ${keyword} in one place`
    },
    ja: {
      title: `${keyword} 関連ニュース - oppagram`,
      description: `${keyword}に関する最新のK-POPニュースと情報。${keyword}関連の記事をまとめてチェック`
    },
    zh: {
      title: `${keyword} 相关新闻 - oppagram`,
      description: `关于${keyword}的最新K-POP新闻和资讯。查看所有${keyword}相关文章`
    },
    es: {
      title: `Noticias sobre ${keyword} - oppagram`,
      description: `Las últimas noticias y actualizaciones de K-POP sobre ${keyword}. Encuentra todos los artículos relacionados con ${keyword}`
    },
    pt: {
      title: `Notícias sobre ${keyword} - oppagram`,
      description: `Últimas notícias e atualizações de K-POP sobre ${keyword}. Encontre todos os artigos relacionados a ${keyword}`
    },
    id: {
      title: `Berita ${keyword} - oppagram`,
      description: `Berita dan update K-POP terbaru tentang ${keyword}. Temukan semua artikel terkait ${keyword}`
    },
    th: {
      title: `ข่าว${keyword} - oppagram`,
      description: `ข่าวและอัปเดต K-POP ล่าสุดเกี่ยวกับ${keyword} รวมบทความที่เกี่ยวข้องกับ${keyword}`
    },
    vi: {
      title: `Tin tức về ${keyword} - oppagram`,
      description: `Tin tức và cập nhật K-POP mới nhất về ${keyword}. Tìm tất cả bài viết liên quan đến ${keyword}`
    },
    ms: {
      title: `Berita ${keyword} - oppagram`,
      description: `Berita dan kemas kini K-POP terkini tentang ${keyword}. Cari semua artikel berkaitan ${keyword}`
    },
    tr: {
      title: `${keyword} Haberleri - oppagram`,
      description: `${keyword} hakkında en son K-POP haberleri ve güncellemeleri. ${keyword} ile ilgili tüm makaleler`
    },
    hi: {
      title: `${keyword} समाचार - oppagram`,
      description: `${keyword} के बारे में नवीनतम K-POP समाचार और अपडेट। ${keyword} से संबंधित सभी लेख`
    },
    fil: {
      title: `${keyword} News - oppagram`,
      description: `Pinakabagong K-POP news at updates tungkol sa ${keyword}. Hanapin ang lahat ng artikulo tungkol sa ${keyword}`
    },
    ar: {
      title: `أخبار ${keyword} - oppagram`,
      description: `آخر أخبار وتحديثات الكيبوب حول ${keyword}. اعثر على جميع المقالات المتعلقة بـ ${keyword}`
    },
    fr: {
      title: `Actualités ${keyword} - oppagram`,
      description: `Dernières actualités et mises à jour K-POP sur ${keyword}. Trouvez tous les articles liés à ${keyword}`
    },
    de: {
      title: `${keyword} Nachrichten - oppagram`,
      description: `Neueste K-POP Nachrichten und Updates über ${keyword}. Finden Sie alle Artikel zu ${keyword}`
    },
    ru: {
      title: `Новости ${keyword} - oppagram`,
      description: `Последние новости и обновления K-POP о ${keyword}. Найдите все статьи, связанные с ${keyword}`
    },
    it: {
      title: `Notizie su ${keyword} - oppagram`,
      description: `Ultime notizie e aggiornamenti K-POP su ${keyword}. Trova tutti gli articoli relativi a ${keyword}`
    },
    pl: {
      title: `Wiadomości ${keyword} - oppagram`,
      description: `Najnowsze wiadomości i aktualizacje K-POP o ${keyword}. Znajdź wszystkie artykuły związane z ${keyword}`
    },
    nl: {
      title: `${keyword} Nieuws - oppagram`,
      description: `Laatste K-POP nieuws en updates over ${keyword}. Vind alle artikelen gerelateerd aan ${keyword}`
    }
  }
  
  const template = templates[lang] || templates.en
  
  // 모든 언어 대체 링크 생성
  const alternateLinks = supportedLanguages.map(l => ({
    rel: 'alternate',
    hreflang: l,
    href: `${baseUrl}/${l}/keyword/${encodeURIComponent(keyword)}`
  }))
  
  return {
    title: template.title,
    htmlAttrs: {
      lang: lang,
      dir: lang === 'ar' ? 'rtl' : 'ltr'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'description', content: template.description },
      { name: 'keywords', content: `${keyword}, K-POP, ${info.keywords}` },
      { name: 'robots', content: 'index, follow, max-image-preview:large' },
      { property: 'og:title', content: template.title },
      { property: 'og:description', content: template.description },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: `${baseUrl}/${lang}/keyword/${encodeURIComponent(keyword)}` },
      { property: 'og:site_name', content: 'oppagram' },
      { property: 'og:locale', content: info.locale },
      { property: 'og:image', content: `${baseUrl}/og-image.jpg` },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: template.title },
      { name: 'twitter:description', content: template.description },
      { name: 'twitter:image', content: `${baseUrl}/og-image.jpg` }
    ],
    link: [
      ...alternateLinks,
      { rel: 'canonical', href: `${baseUrl}/${lang}/keyword/${encodeURIComponent(keyword)}` }
    ],
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: template.title,
          description: template.description,
          url: `${baseUrl}/${lang}/keyword/${encodeURIComponent(keyword)}`,
          isPartOf: {
            '@type': 'WebSite',
            name: 'oppagram',
            url: baseUrl
          },
          about: {
            '@type': 'Thing',
            name: keyword
          },
          inLanguage: lang
        })
      }
    ]
  }
}