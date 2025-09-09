<script setup>
import { ref, computed, onMounted } from 'vue';

const route = useRoute();
const currentLang = ref(route.params.lang || 'en');
const searchQuery = ref('');
const page = ref(1);
const articles = ref([]);
const hasMoreArticles = ref(true);
const isLoadingMore = ref(false);

// 초기 데이터 로드 함수
async function loadInitialArticles() {
  try {
    const data = await $fetch('/api/articles?page=1&limit=20');
    return data || [];
  } catch (error) {
    console.error('Failed to load articles:', error);
    return [];
  }
}

// SSR과 클라이언트 모두에서 작동
const { data: initialArticles } = await useAsyncData(
  'main-articles',
  loadInitialArticles
);

// 초기 데이터 설정
articles.value = initialArticles.value || [];

// 더 많은 기사 로드 (클라이언트 전용)
async function loadMore() {
  if (!hasMoreArticles.value || isLoadingMore.value) return;
  
  isLoadingMore.value = true;
  try {
    const params = new URLSearchParams({
      page: page.value + 1,
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

// 검색 함수
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

// 언어 변경
function handleLanguageChange(event) {
  const newLang = event.target.value;
  if (typeof window !== 'undefined') {
    localStorage.setItem('preferred-language', newLang);
  }
  navigateTo(`/${newLang}`);
}

// timeAgo 함수 (위와 동일)
function timeAgo(item) {
  // ... 위의 timeAgo 함수와 동일
}

// 스크롤 이벤트 (클라이언트 전용)
onMounted(() => {
  window.addEventListener('scroll', () => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 1000) {
      loadMore();
    }
  });
});
</script>
<template>
  <div>
    <header class="p-4 border-b sticky top-0 bg-white/90 backdrop-blur-sm z-10">
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-xl font-bold text-gray-900">oppagram</h1>
        <div class="relative">
          <select :value="currentLang" @change="handleLanguageChange" class="text-sm border rounded-md py-1 pl-2 appearance-none bg-transparent pr-8">
            <!-- v-if 제거하고 모든 옵션을 항상 표시 -->
            <option value="ko">🇰🇷 한국어</option>
            <option value="en">🇺🇸 English</option>
            <option value="ja">🇯🇵 日本語</option>
            <option value="zh">🇨🇳 中文</option>
            <option value="es">🇲🇽 Español</option>
            <option value="pt">🇧🇷 Português</option>
            <option value="id">🇮🇩 Indonesia</option>
            <option value="th">🇹🇭 ไทย</option>
            <option value="vi">🇻🇳 Tiếng Việt</option>
            <option value="ms">🇲🇾 Melayu</option>
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
          <svg class="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>
      </div>
      <div class="relative">
        <input 
          type="search" 
          v-model="searchQuery"
          placeholder="Search articles..." 
          class="w-full p-2 pl-10 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <svg class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
      </div>
    </header>
    <main class="p-2">
      <div v-if="isLoading" class="p-8 text-center text-gray-500">Loading...</div>
      <div v-else-if="error" class="p-4 text-center text-red-500">Failed to load articles.</div>
      <div v-else-if="articles.length === 0 && searchQuery" class="p-8 text-center text-gray-500">
        No results found for "{{ searchQuery }}".
      </div>
      <div v-else>
        <NuxtLink v-for="item in articles" :key="item.id" :to="`/${currentLang}/article/${item.id}`">
          <article class="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <img v-if="item.image_path" :src="item.image_path.startsWith('http') ? item.image_path : `/static/images/${item.image_path.split('/').pop()}`" alt="Thumbnail" class="w-24 h-24 flex-shrink-0 bg-gray-200 rounded-md object-cover">
            <div v-else class="w-24 h-24 flex-shrink-0 bg-gray-200 rounded-md"></div>
            <div class="flex-grow">
              <h2 class="font-bold text-base leading-tight">{{ item.translations[currentLang]?.title }}</h2>
              <p class="text-sm text-gray-600 mt-1">{{ item.translations[currentLang]?.one_sentence_summary }}</p>
              <p class="text-xs text-gray-500 mt-2">{{ item.press }} · {{ timeAgo(item) }}</p>
            </div>
          </article>
        </NuxtLink>
      </div>
      <div v-if="isLoadingMore" class="p-4 text-center text-gray-500">Loading more...</div>
    </main>
  </div>
</template>