<script setup>
import { ref, onMounted, watch } from 'vue';

const route = useRoute();
const articleId = ref(Number(route.params.id));
const currentLang = ref(route.params.lang);

// --- 상태 관리 ---
const isLoading = ref(true);
const isLoadingRelated = ref(false);
const currentArticle = ref(null);
const relatedArticles = ref([]);
const error = ref(null);

// --- 함수 ---
async function fetchArticleData() {
  isLoading.value = true;
  error.value = null;
  try {
    currentArticle.value = await $fetch(`/api/article/${articleId.value}`);
    isLoadingRelated.value = true;
    relatedArticles.value = await $fetch(`/api/article/${articleId.value}/related`);
  } catch (err) {
    error.value = err;
    console.error("Failed to fetch article data", err);
  } finally {
    isLoading.value = false;
    isLoadingRelated.value = false;
  }
}

// 시간 표시 함수: UTC 시간을 올바르게 처리합니다.
function timeAgo(item) {
  // 1. 새 기사는 우리 시스템 등록 시간(UTC)을 사용하고, 없으면(기존 데이터) 원문 발행 시간을 사용합니다.
  const dateString = item.created_at || item.display_published_at;
  if (!dateString) return '';

  // 2. JavaScript의 Date 객체는 ISO 형식의 UTC 문자열을 자동으로 사용자 시간대로 변환합니다.
  //    "2025.09.05 10:30" 같은 형식은 파싱 오류를 막기 위해 표준 형식으로 바꿔줍니다.
  const date = new Date(dateString.toString().replace(' ', 'T').replace(/\./g, '-') + 'Z');

  const seconds = Math.floor((new Date() - date) / 1000);
  if (seconds < 5) return "Just now"; // 5초 미만은 Just now
  if (seconds < 0) return "Just now"; // 혹시 모를 시간차 에러 방지

  let interval = seconds / 86400;
  if (interval > 1) return `${Math.floor(interval)} days ago`;
  interval = seconds / 3600;
  if (interval > 1) return `${Math.floor(interval)} hours ago`;
  interval = seconds / 60;
  if (interval > 1) return `${Math.floor(interval)} minutes ago`;
  return `${Math.floor(seconds)} seconds ago`;
}

// --- 라이프사이클 훅 ---
onMounted(fetchArticleData);

watch(() => route.params.id, (newId) => {
  if (newId) {
    articleId.value = Number(newId);
    fetchArticleData();
    window.scrollTo(0, 0);
  }
});
</script>

<template>
  <div>
    <div v-if="isLoading" class="p-8 text-center text-gray-500">
      Loading article...
    </div>

    <div v-else-if="currentArticle">
      <header class="p-4 border-b sticky top-0 bg-white/90 backdrop-blur-sm z-10">
        <div class="flex items-center">
          <NuxtLink :to="`/${currentLang}`" class="p-2 mr-2 rounded-full hover:bg-gray-100">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
          </NuxtLink>
          <h1 class="text-lg font-bold text-gray-900 truncate">{{ currentArticle.translations[currentLang]?.title }}</h1>
        </div>
      </header>
      <main class="p-4">
        <article>
          <img v-if="currentArticle.image_path" :src="`/${currentArticle.image_path}`" class="w-full rounded-lg mb-4 bg-gray-200" alt="Article Image">
          
          <h2 class="text-2xl font-bold mb-2 leading-tight">{{ currentArticle.translations[currentLang]?.title }}</h2>
          <div class="text-xs text-gray-400 mb-4">{{ currentArticle.press }} · {{ timeAgo(currentArticle) }}</div>
          
          <div v-if="currentArticle.keywords && currentArticle.keywords.length" class="flex flex-wrap gap-2 mb-6">
            <span v-for="keyword in currentArticle.keywords" :key="keyword" class="bg-gray-200 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full">
              #{{ keyword }}
            </span>
          </div>

          <div class="whitespace-pre-wrap text-base leading-relaxed text-gray-700">
            {{ currentArticle.translations[currentLang]?.summary }}
          </div>
          
          <div v-if="currentArticle.additional_info && currentArticle.additional_info[currentLang]" class="mt-6 pt-6 border-t border-gray-200">
            <p class="whitespace-pre-wrap text-base leading-relaxed text-gray-800 font-semibold">{{ currentArticle.additional_info[currentLang] }}</p>
          </div>

          <a :href="currentArticle.original_url" target="_blank" class="inline-block mt-8 text-sm text-blue-500 hover:underline">Read Original Article &rarr;</a>
        </article>

        <section v-if="relatedArticles.length > 0" class="mt-12 border-t pt-6">
          <h3 class="text-lg font-bold mb-4">Related Articles</h3>
          <div class="space-y-4">
            <NuxtLink v-for="item in relatedArticles" :key="item.id" :to="`/${currentLang}/article/${item.id}`">
              <article class="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <img v-if="item.image_path" :src="`/${item.image_path}`" alt="Thumbnail" class="w-20 h-20 flex-shrink-0 bg-gray-200 rounded-md object-cover">
                <div v-else class="w-20 h-20 flex-shrink-0 bg-gray-200 rounded-md"></div>
                <div class="flex-grow">
                  <h4 class="font-bold text-sm leading-tight">{{ item.translations[currentLang]?.title }}</h4>
                  <p class="text-xs text-gray-500 mt-1">{{ item.press }}</p>
                </div>
              </article>
            </NuxtLink>
          </div>
        </section>
      </main>
    </div>
    
    <div v-else-if="error" class="p-8 text-center">
      <h1 class="text-xl font-bold text-red-500">Article not found or failed to load.</h1>
      <NuxtLink :to="`/${currentLang}`" class="text-blue-500 hover:underline">Return to list</NuxtLink>
    </div>
  </div>
</template>