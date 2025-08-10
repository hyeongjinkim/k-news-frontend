<script setup>
import { ref, computed, onMounted } from 'vue';
import { useArticles } from '~/composables/useArticles';

const route = useRoute();
const { articles } = useArticles(); // 공용 보관함에서 기사 목록 가져오기

// 1. URL의 id를 글자가 아닌 '숫자'로 변환해서 저장합니다. (가장 중요!)
const articleId = Number(route.params.id); 
const currentLang = ref(route.params.lang);
const isLoading = ref(false); // 상세 페이지용 로딩 상태

// 2. 공용 기사 목록(articles)에서 현재 URL의 id와 일치하는 기사를 찾아냅니다.
const currentArticle = computed(() => {
  return articles.value.find(a => a.id === articleId);
});

// 3. 페이지가 열릴 때, 만약 공용 데이터가 비어있다면 (상세페이지로 바로 접속했다면) API를 직접 호출합니다.
onMounted(async () => {
  if (articles.value.length === 0) {
    isLoading.value = true;
    try {
      const data = await $fetch('/api/articles');
      articles.value = data; // API 결과를 공용 보관함에 저장
    } catch (err) {
      console.error("Failed to fetch articles on detail page", err);
    } finally {
      isLoading.value = false;
    }
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
          <img :src="currentArticle.image_url" class="w-full h-56 object-cover bg-gray-200 rounded-lg mb-4" alt="Article Image">
          <h2 class="text-2xl font-bold mb-2 leading-tight">{{ currentArticle.translations[currentLang]?.title }}</h2>
          <div class="text-xs text-gray-400 mb-4">Source: {{ currentArticle.press }} · Published: {{ currentArticle.published_at }}</div>
          <div v-html="currentArticle.translations[currentLang]?.summary.replace(/\n/g, '<br>')" class="space-y-4 text-base leading-relaxed text-gray-700"></div>
          <a :href="currentArticle.original_url" target="_blank" class="inline-block mt-6 text-sm text-blue-500 hover:underline">Read Original Article &rarr;</a>
        </article>
      </main>
    </div>
    
    <div v-else class="p-8 text-center">
      <h1 class="text-xl font-bold">Article not found.</h1>
      <NuxtLink :to="`/${currentLang}`" class="text-blue-500 hover:underline">Return to list</NuxtLink>
    </div>
  </div>
</template>