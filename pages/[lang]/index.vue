<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { getMainPageMeta } from '~/utils/seo';

const route = useRoute();

// 언어 설정
const currentLang = ref(route.params.lang || 'en');
// SEO 메타태그 적용
useHead(getMainPageMeta(currentLang.value))

// 로컬 상태로 변경 (전역 상태 사용 안 함)
const articles = ref([]);
const searchQuery = ref('');
const isLoadingMore = ref(false);
const page = ref(1);
const hasMoreArticles = ref(true);
const showFooter = ref(false);  // 푸터 표시 상태 추가
const firstLoadComplete = ref(false);  // 첫 로드 완료 상태 추가

// 페이지 진입 시마다 새로 데이터 로드
onMounted(async () => {
  // 첫 페이지 데이터 새로 로드
  await loadInitialArticles();
  
  // 스크롤 이벤트 리스너 추가
  const handleScroll = () => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 1000) {
      loadMore();
    }
  };
  
  window.addEventListener('scroll', handleScroll);
  
  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
  });
});

// 초기 데이터 로드 함수
async function loadInitialArticles() {
  try {
    const initialData = await $fetch('/api/articles?page=1&limit=20');
    articles.value = initialData;
    page.value = 2; // 다음 페이지는 2부터
  } catch (err) {
    console.error('Failed to load initial articles:', err);
  }
}

// 언어 변경 함수
function handleLanguageChange(event) {
  const newLang = event.target.value;
  navigateTo(`/${newLang}`);
}

// 더 많은 기사 로드 (클라이언트에서만 실행)
async function loadMore() {
  // 첫 번째 로드가 완료되지 않았으면 리턴
  if (!firstLoadComplete.value) return;
  
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
    
    if (newArticles.length === 0) {
      hasMoreArticles.value = false;
      showFooter.value = true;  // 더 이상 기사가 없으면 푸터 표시
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

async function loadMoreManually() {
  firstLoadComplete.value = true;
  await loadMore();
}

// 검색 기능 (클라이언트에서만)
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
    articles.value = searchResults;
    page.value = 2;
  } catch (err) {
    console.error('Search failed:', err);
  }
}

// timeAgo 함수는 그대로
function timeAgo(item) {
  const dateString = item.created_at || item.display_published_at;
  if (!dateString) return '';
  const date = new Date(dateString.toString().replace(' ', 'T').replace(/\./g, '-') + 'Z');
  const seconds = Math.floor((new Date() - date) / 1000);
  if (seconds < 5) return "Just now";
  if (seconds < 0) return "Just now";
  let interval = seconds / 86400;
  if (interval > 1) return `${Math.floor(interval)} days ago`;
  interval = seconds / 3600;
  if (interval > 1) return `${Math.floor(interval)} hours ago`;
  interval = seconds / 60;
  if (interval > 1) return `${Math.floor(interval)} minutes ago`;
  return `${Math.floor(seconds)} seconds ago`;
}

// 검색 입력 감지
watch(searchQuery, (newValue) => {
  if (newValue === '') {
    handleSearch();
  }
});
</script>

<template>
  <div>
    <header class="p-4 border-b sticky top-0 bg-white/90 backdrop-blur-sm z-10">
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-xl font-bold text-gray-900">oppagram</h1>
        <div class="relative">
          <select :value="currentLang" @change="handleLanguageChange" class="text-sm border rounded-md py-1 pl-2 appearance-none bg-transparent pr-8">
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
    <FeaturedSection :current-lang="currentLang" />
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
      <div v-if="!firstLoadComplete && articles.length > 0" class="p-6 text-center">
        <button 
          @click="loadMoreManually"
          class="px-6 py-3 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors flex items-center gap-2 mx-auto">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Load More Articles
        </button>
      </div>
    </main>
  </div>
</template>