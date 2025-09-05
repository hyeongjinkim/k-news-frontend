<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useArticles } from '~/composables/useArticles';

const route = useRoute();
const { articles } = useArticles(); // 전역 상태

// --- 상태 관리 ---
const isLoading = ref(false);
const isLoadingMore = ref(false);
const error = ref(null);
const currentLang = ref(route.params.lang || 'en');
const page = ref(1);
const hasMoreArticles = ref(true);
const searchQuery = ref('');

// --- 함수 ---
function handleLanguageChange(event) {
  const newLang = event.target.value;
  navigateTo(`/${newLang}`);
}

async function fetchArticles(isNewSearch = false) {
  if (isLoading.value || isLoadingMore.value) return;
  
  if (isNewSearch) {
    page.value = 1;
    articles.value = [];
    hasMoreArticles.value = true;
    isLoading.value = true;
  } else {
    isLoadingMore.value = true;
  }
  
  error.value = null;

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
    } else {
      articles.value.push(...newArticles);
      page.value++;
    }
  } catch (err) {
    error.value = err;
  } finally {
    isLoading.value = false;
    isLoadingMore.value = false;
  }
}

// 💡 timeAgo 함수 수정: created_at을 우선 사용하고, 없으면 기존 시간을 사용
function timeAgo(item) {
  const dateString = item.created_at || item.display_published_at;
  if (!dateString) return '';
  
  // display_published_at 포맷(YYYY.MM.DD HH:mm)을 new Date가 인식하도록 변경
  const formattedDateString = dateString.toString().includes('.') ? dateString.replace(/\./g, '/').split('/').slice(0, 3).join('/') + ' ' + dateString.split(' ')[1] : dateString;
  const date = new Date(formattedDateString);

  const seconds = Math.floor((new Date() - date) / 1000);
  let interval = seconds / 3600;
  if (interval > 24) return `${Math.floor(interval / 24)} days ago`;
  if (interval > 1) return `${Math.floor(interval)} hours ago`;
  interval = seconds / 60;
  if (interval > 1) return `${Math.floor(interval)} minutes ago`;
  return "Just now";
}

const handleScroll = () => {
  const buffer = 200;
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - buffer) {
    if (hasMoreArticles.value && !isLoadingMore.value) {
      fetchArticles();
    }
  }
};

let searchTimeout;
watch(searchQuery, () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    fetchArticles(true);
  }, 500);
});

// --- 라이프사이클 훅 ---
onMounted(() => {
  if (articles.value.length === 0 || searchQuery.value) {
    fetchArticles(true);
  }
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <div>
    <header class="p-4 border-b sticky top-0 bg-white/90 backdrop-blur-sm z-10">
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-xl font-bold text-gray-900">K-Beat AI</h1>
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
    <main class="p-2">
      <div v-if="isLoading" class="p-8 text-center text-gray-500">Loading...</div>
      <div v-else-if="error" class="p-4 text-center text-red-500">Failed to load articles.</div>
      <div v-else-if="articles.length === 0 && searchQuery" class="p-8 text-center text-gray-500">
        No results found for "{{ searchQuery }}".
      </div>
      <div v-else>
        <NuxtLink v-for="item in articles" :key="item.id" :to="`/${currentLang}/article/${item.id}`">
          <article class="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <img v-if="item.image_path" :src="`/${item.image_path}`" alt="Thumbnail" class="w-24 h-24 flex-shrink-0 bg-gray-200 rounded-md object-cover">
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