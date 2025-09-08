<script setup>
import { ref, computed } from 'vue';
import { getArticlePageMeta } from '~/utils/seo';

const route = useRoute();
const articleId = ref(Number(route.params.id));
const currentLang = ref(route.params.lang);

// SSG를 위해 useFetch 사용 (서버에서 미리 데이터 가져옴)
const { data: currentArticle, error } = await useFetch(`/api/article/${articleId.value}`);
const { data: relatedArticles } = await useFetch(`/api/article/${articleId.value}/related`);

if (currentArticle.value) {
  useHead(getArticlePageMeta(currentArticle.value, currentLang.value))
}

// --- 💡 줄바꿈을 처리하기 위한 computed 속성 (그대로 유지) ---
const formattedSummary = computed(() => {
  if (currentArticle.value && currentArticle.value.translations[currentLang.value]?.summary) {
    return currentArticle.value.translations[currentLang.value].summary.split('\n');
  }
  return [];
});

const formattedAdditionalInfo = computed(() => {
  if (currentArticle.value && currentArticle.value.additional_info && currentArticle.value.additional_info[currentLang.value]) {
    return currentArticle.value.additional_info[currentLang.value].split('\n');
  }
  return [];
});

onMounted(() => {
  // 조회수 증가 API 호출
  $fetch(`/api/article/${articleId.value}/view`, {
    method: 'POST'
  }).catch(() => {
    // 실패해도 무시
  });
});

// timeAgo 함수는 그대로 유지
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
</script>

<template>
  <div>
    <!-- isLoading 부분 삭제하고 바로 currentArticle 체크 -->
    <div v-if="currentArticle">
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
          <img v-if="currentArticle.image_path" :src="currentArticle.image_path.startsWith('http') ? currentArticle.image_path : `/static/images/${currentArticle.image_path.split('/').pop()}`" class="w-full rounded-lg mb-4 bg-gray-200" alt="Article Image">
          
          <h2 class="text-2xl font-bold mb-2 leading-tight">{{ currentArticle.translations[currentLang]?.title }}</h2>
          <div class="text-xs text-gray-400 mb-4">{{ currentArticle.press }} · {{ timeAgo(currentArticle) }}</div>
          
          <!-- 키워드 섹션을 클릭 가능하게 수정 -->
          <div v-if="currentArticle.keywords && currentArticle.keywords.length" class="flex flex-wrap gap-2 mb-6">
            <NuxtLink 
              v-for="keyword in currentArticle.keywords" 
              :key="keyword" 
              :to="`/${currentLang}/keyword/${encodeURIComponent(keyword)}`"
              class="bg-gray-200 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full hover:bg-gray-300 transition-colors"
            >
              #{{ keyword }}
            </NuxtLink>
          </div>

          <div class="space-y-4 text-base leading-relaxed text-gray-700">
            <p v-for="(paragraph, index) in formattedSummary" :key="`s-${index}`">
              {{ paragraph }}
            </p>
          </div>
          
          <div v-if="formattedAdditionalInfo.length > 0" class="mt-6 pt-6 border-t border-gray-200">
            <div class="space-y-4 text-base leading-relaxed text-gray-800 font-semibold">
               <p v-for="(paragraph, index) in formattedAdditionalInfo" :key="`a-${index}`">
                {{ paragraph }}
              </p>
            </div>
          </div>

          <a :href="currentArticle.original_url" target="_blank" class="inline-block mt-8 text-sm text-blue-500 hover:underline">Read Original Article &rarr;</a>
        </article>

        <section v-if="relatedArticles.length > 0" class="mt-12 border-t pt-6">
          <h3 class="text-lg font-bold mb-4">Related Articles</h3>
          <div class="space-y-4">
            <NuxtLink v-for="item in relatedArticles" :key="item.id" :to="`/${currentLang}/article/${item.id}`">
              <article class="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <img v-if="item.image_path" :src="item.image_path.startsWith('http') ? item.image_path : `/static/images/${item.image_path.split('/').pop()}`" alt="Thumbnail" class="w-20 h-20 flex-shrink-0 bg-gray-200 rounded-md object-cover">
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