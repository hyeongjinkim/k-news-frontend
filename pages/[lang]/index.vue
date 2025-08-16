<script setup>
import { ref, watch, onMounted } from 'vue';
import { useArticles } from '~/composables/useArticles';

const route = useRoute();
const { articles } = useArticles();
const isLoading = ref(true);
const error = ref(null);
const currentLang = ref(route.params.lang || 'en');

// 언어 선택 메뉴를 바꾸면, URL도 그에 맞게 /ko, /vi 등으로 변경합니다.
watch(currentLang, (newLang) => {
  if (route.params.lang !== newLang) {
    navigateTo(`/${newLang}`);
  }
});

async function fetchArticles() {
  if (articles.value.length === 0) {
    isLoading.value = true;
    error.value = null;
    try {
      const data = await $fetch('/api/articles');
      articles.value = data;
    } catch (err) { error.value = err; }
    finally { isLoading.value = false; }
  } else {
    isLoading.value = false;
  }
}

function timeAgo(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString.replace(/\./g, '/'));
  const seconds = Math.floor((new Date() - date) / 1000);
  let interval = seconds / 3600;
  if (interval > 24) return `${Math.floor(interval / 24)} days ago`;
  if (interval > 1) return `${Math.floor(interval)} hours ago`;
  interval = seconds / 60;
  if (interval > 1) return `${Math.floor(interval)} minutes ago`;
  return "Just now";
}

onMounted(fetchArticles);
</script>

<template>
  <div>
    <header class="p-4 border-b sticky top-0 bg-white/90 backdrop-blur-sm z-10">
      <div class="flex justify-between items-center">
        <h1 class="text-xl font-bold text-gray-900">K-Beat AI</h1>
        <div class="relative">
          <select v-model="currentLang" class="text-sm border rounded-md py-1 pl-2 appearance-none bg-transparent pr-8">
            <option value="ko">🇰🇷 한국어</option>
            <option value="en">🇺🇸 English</option>
            <option value="vi">🇻🇳 Tiếng Việt</option>
            <option value="th">🇹🇭 ภาษาไทย</option>
            <option value="id">🇮🇩 Bahasa Indonesia</option>
            <option value="ms">🇲🇾 Bahasa Melayu</option>
          </select>
          <svg class="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>
      </div>
    </header>
    <main class="p-2">
      <div v-if="isLoading" class="p-8 text-center text-gray-500">Loading...</div>
      <div v-else-if="error" class="p-4 text-center text-red-500">Failed to load articles.</div>
      <div v-else>
        <NuxtLink v-for="item in articles" :key="item.id" :to="`/${currentLang}/article/${item.id}`">
          <article class="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <img :src="item.image_url" alt="Thumbnail" class="w-24 h-24 flex-shrink-0 bg-gray-200 rounded-md object-cover">
            <div class="flex-grow">
              <h2 class="font-bold text-base leading-tight">{{ item.translations[currentLang]?.title }}</h2>
              <p class="text-sm text-gray-600 mt-1">{{ item.translations[currentLang]?.one_sentence_summary }}</p>
              <p class="text-xs text-gray-500 mt-2">{{ item.press }} · {{ timeAgo(item.published_at) }}</p>
            </div>
          </article>
        </NuxtLink>
      </div>
    </main>
  </div>
</template>