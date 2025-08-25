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
    // 단일 기사 정보 가져오기
    currentArticle.value = await $fetch(`/api/article/${articleId.value}`);
    
    // 연관 기사 정보 가져오기
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

// --- 라이프사이클 훅 ---
onMounted(fetchArticleData);

// 다른 연관 기사를 클릭했을 때 (URL이 변경되었을 때) 데이터를 다시 불러옵니다.
watch(() => route.params.id, (newId) => {
  if (newId) {
    articleId.value = Number(newId);
    fetchArticleData();
    window.scrollTo(0, 0); // 페이지 상단으로 스크롤
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
          <!-- 🔽 이미지 클래스 수정: h-56, object-cover 제거하여 원본 비율 유지 -->
          <img :src="currentArticle.image_url" class="w-full rounded-lg mb-4 bg-gray-200" alt="Article Image">
          
          <h2 class="text-2xl font-bold mb-2 leading-tight">{{ currentArticle.translations[currentLang]?.title }}</h2>
          <div class="text-xs text-gray-400 mb-4">Source: {{ currentArticle.press }} · Published: {{ currentArticle.published_at }}</div>
          
          <!-- 키워드 태그 -->
          <div v-if="currentArticle.keywords && currentArticle.keywords.length" class="flex flex-wrap gap-2 mb-6">
            <span v-for="keyword in currentArticle.keywords" :key="keyword" class="bg-gray-200 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full">
              #{{ keyword }}
            </span>
          </div>

          <!-- AI 요약 본문 -->
          <div v-html="currentArticle.translations[currentLang]?.summary.replace(/\n/g, '<br>')" class="space-y-4 text-base leading-relaxed text-gray-700"></div>
          
          <!-- '한편,' 추가 정보 문단 -->
          <div v-if="currentArticle.additional_info && currentArticle.additional_info[currentLang]" class="mt-6 pt-6 border-t border-gray-200">
            <p class="text-base leading-relaxed text-gray-800 font-semibold">{{ currentArticle.additional_info[currentLang] }}</p>
          </div>

          <a :href="currentArticle.original_url" target="_blank" class="inline-block mt-8 text-sm text-blue-500 hover:underline">Read Original Article &rarr;</a>
        </article>

        <!-- 연관 기사 섹션 -->
        <section v-if="relatedArticles.length > 0" class="mt-12 border-t pt-6">
          <h3 class="text-lg font-bold mb-4">Related Articles</h3>
          <div class="space-y-4">
            <NuxtLink v-for="item in relatedArticles" :key="item.id" :to="`/${currentLang}/article/${item.id}`">
              <article class="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <img :src="item.image_url" alt="Thumbnail" class="w-20 h-20 flex-shrink-0 bg-gray-200 rounded-md object-cover">
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
