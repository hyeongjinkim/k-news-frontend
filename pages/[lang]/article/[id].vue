<script setup>
import { ref, computed, onMounted } from 'vue';

const route = useRoute();
const articleId = ref(Number(route.params.id));
const currentLang = ref(route.params.lang || 'en');

// 데이터 페칭 함수
async function fetchArticleData() {
  try {
    const [article, related] = await Promise.all([
      $fetch(`/api/article/${articleId.value}`),
      $fetch(`/api/article/${articleId.value}/related`)
    ]);
    return { article, related };
  } catch (error) {
    console.error('Failed to fetch article:', error);
    return { article: null, related: [] };
  }
}

// SSR과 클라이언트 모두에서 작동
const { data } = await useAsyncData(
  `article-${articleId.value}`,
  fetchArticleData
);

const currentArticle = computed(() => data.value?.article || null);
const relatedArticles = computed(() => data.value?.related || []);

// timeAgo 함수
function timeAgo(item) {
  if (!item) return '';
  const dateString = item?.created_at || item?.display_published_at;
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString.toString().replace(' ', 'T').replace(/\./g, '-') + 'Z');
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
  } catch (e) {
    return '';
  }
}

// 클라이언트에서만 조회수 증가
onMounted(() => {
  $fetch(`/api/article/${articleId.value}/view`, { method: 'POST' }).catch(() => {});
});
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