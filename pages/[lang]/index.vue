<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const route = useRoute();
const currentLang = ref(route.params.lang || 'en');
const searchQuery = ref('');
const page = ref(2);
const articles = ref([]);
const hasMoreArticles = ref(true);
const isLoadingMore = ref(false);

// SSR용 초기 데이터 로드
const { data: initialArticles } = await useFetch('/api/articles?page=1&limit=20');
if (initialArticles.value) {
  articles.value = initialArticles.value;
}

// 언어 변경
function handleLanguageChange(event) {
  const newLang = event.target.value;
  if (typeof window !== 'undefined') {
    localStorage.setItem('preferred-language', newLang);
  }
  navigateTo(`/${newLang}`);
}

// 더 많은 기사 로드
async function loadMore() {
  if (!hasMoreArticles.value || isLoadingMore.value) return;
  
  isLoadingMore.value = true;
  try {
    const params = new URLSearchParams({
      page: page.value,
      limit: 20
    });
    if (searchQuery.value) {
      params.append('q', searchQuery.value);
    }

    const newArticles = await $fetch(`/api/articles?${params.toString()}`);
    
    if (!newArticles || newArticles.length === 0) {
      hasMoreArticles.value = false;
    } else {
      articles.value.push(...newArticles);
      page.value++;
    }
  } catch (err) {
    console.error('Failed to load more articles:', err);
  } finally {
    isLoadingMore.value = false;
  }
}

// 검색
async function handleSearch() {
  page.value = 1;
  articles.value = [];
  hasMoreArticles.value = true;
  
  try {
    const params = new URLSearchParams({
      page: 1,
      limit: 20
    });
    if (searchQuery.value) {
      params.append('q', searchQuery.value);
    }

    const searchResults = await $fetch(`/api/articles?${params.toString()}`);
    articles.value = searchResults || [];
    page.value = 2;
  } catch (err) {
    console.error('Search failed:', err);
  }
}

// timeAgo 함수 - 정확한 시간 계산
function timeAgo(item) {
  if (!item) return '';
  
  // created_at을 우선 사용, 없으면 display_published_at 사용
  const dateString = item.created_at || item.display_published_at;
  if (!dateString) return '';
  
  try {
    let date;
    
    // ISO 형식 체크 (2025-01-15T12:34:56)
    if (dateString.includes('T')) {
      date = new Date(dateString);
    } 
    // 한국 형식 (2025.01.15 12:34)
    else if (dateString.includes('.')) {
      const formatted = dateString
        .replace(/\./g, '-')
        .replace(' ', 'T') + ':00';
      date = new Date(formatted);
    }
    // 일반 형식 (2025-01-15 12:34:56)
    else {
      date = new Date(dateString.replace(' ', 'T'));
    }
    
    // 현재 시간과의 차이 계산
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 2592000) return `${Math.floor(seconds / 86400)} days ago`;
    
    return `${Math.floor(seconds / 2592000)} months ago`;
  } catch (e) {
    console.error('Date parsing error:', e, dateString);
    return '';
  }
}

// 스크롤 이벤트 핸들러
function handleScroll() {
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 1000) {
    loadMore();
  }
}

// 검색 디바운스
let searchTimeout;
function onSearchInput() {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    handleSearch();
  }, 500);
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  
  // 최신 데이터로 갱신
  $fetch('/api/articles?page=1&limit=20&_t=' + Date.now())
    .then(freshArticles => {
      if (freshArticles && freshArticles.length > 0) {
        articles.value = freshArticles;
      }
    })
    .catch(console.error);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <div>
    <header class="p-4 border-b sticky top-0 bg-white/90 backdrop-blur-sm z-10">
      <h1 class="text-2xl font-bold mb-4">oppagram</h1>
      <div class="flex space-x-2 mb-3">
        <div class="relative">
          <select 
            :value="currentLang" 
            @change="handleLanguageChange"
            class="appearance-none px-3 py-2 pr-8 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="ko">🇰🇷 한국어</option>
            <option value="en">🇺🇸 English</option>
            <option value="ja">🇯🇵 日本語</option>
            <option value="zh">🇨🇳 中文</option>
            <option value="es">🇪🇸 Español</option>
            <option value="pt">🇧🇷 Português</option>
            <option value="id">🇮🇩 Bahasa</option>
            <option value="th">🇹🇭 ไทย</option>
            <option value="vi">🇻🇳 Tiếng Việt</option>
            <option value="ms">🇲🇾 Bahasa Melayu</option>
            <option value="tr">🇹🇷 Türkçe</option>
            <option value="hi">🇮🇳 हिन्दी</option>
            <option value="fil">🇵🇭 Filipino</option>
            <option value="ar">🇸🇦 العربية</option>
            <option value="fr">🇫🇷 Français</option>
            <option value="de">🇩🇪 Deutsch</option>
            <option value="ru">🇷🇺 Русский</option>
            <option value="it">🇮🇹 Italiano</option>
            <option value="pl">🇵🇱 Polski</option>
            <option value="nl">🇳🇱 Nederlands</option>
          </select>
          <svg class="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </div>
      <div class="relative">
        <input 
          type="search" 
          v-model="searchQuery"
          @input="onSearchInput"
          placeholder="Search articles..." 
          class="w-full p-2 pl-10 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <svg class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </div>
    </header>
    
    <main class="p-2">
      <div v-if="articles.length === 0 && searchQuery" class="p-8 text-center text-gray-500">
        No results found for "{{ searchQuery }}".
      </div>
      <div v-else-if="articles.length === 0" class="p-8 text-center text-gray-500">
        Loading articles...
      </div>
      <div v-else>
        <NuxtLink 
          v-for="item in articles" 
          :key="item.id" 
          :to="`/${currentLang}/article/${item.id}`"
        >
          <article class="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <img 
              v-if="item.image_path" 
              :src="item.image_path"
              :alt="item.translations?.[currentLang]?.title || ''" 
              class="w-24 h-24 flex-shrink-0 bg-gray-200 rounded-md object-cover"
            >
            <div v-else class="w-24 h-24 flex-shrink-0 bg-gray-200 rounded-md"></div>
            
            <div class="flex-grow">
              <h2 class="font-bold text-base leading-tight">
                {{ item.translations?.[currentLang]?.title || '' }}
              </h2>
              <p class="text-sm text-gray-600 mt-1">
                {{ item.translations?.[currentLang]?.one_sentence_summary || '' }}
              </p>
              <p class="text-xs text-gray-500 mt-2">
                {{ item.press || '' }} · {{ timeAgo(item) }}
              </p>
            </div>
          </article>
        </NuxtLink>
      </div>
      
      <div v-if="isLoadingMore" class="p-4 text-center text-gray-500">
        Loading more...
      </div>
      <div v-else-if="!hasMoreArticles && articles.length > 0" class="p-4 text-center text-gray-400">
        No more articles
      </div>
    </main>
  </div>
</template>