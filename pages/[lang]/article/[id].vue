<script setup>
import { ref, onMounted } from 'vue';

const route = useRoute();
const articleId = Number(route.params.id);
const currentLang = route.params.lang || 'en';

// 데이터 상태
const currentArticle = ref(null);
const relatedArticles = ref([]);
const isLoading = ref(true);
const error = ref(null);

// SSR에서 데이터 페칭
try {
  const { data: articleData } = await useFetch(`/api/article/${articleId}`);
  const { data: relatedData } = await useFetch(`/api/article/${articleId}/related`);
  
  currentArticle.value = articleData.value;
  relatedArticles.value = relatedData.value || [];
  isLoading.value = false;
} catch (e) {
  console.error('Failed to fetch article:', e);
  error.value = e;
  isLoading.value = false;
}

// timeAgo 함수 - 메인 페이지와 동일
function timeAgo(item) {
  if (!item) return '';
  
  const dateString = item.created_at || item.display_published_at;
  if (!dateString) return '';
  
  try {
    let date;
    
    // ISO 형식 체크
    if (dateString.includes('T')) {
      date = new Date(dateString);
    } 
    // 한국 형식
    else if (dateString.includes('.')) {
      const formatted = dateString
        .replace(/\./g, '-')
        .replace(' ', 'T') + ':00';
      date = new Date(formatted);
    }
    // 일반 형식
    else {
      date = new Date(dateString.replace(' ', 'T'));
    }
    
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

// 클라이언트에서 실행
onMounted(async () => {
  // 조회수 증가
  if (currentArticle.value) {
    try {
      await $fetch(`/api/article/${articleId}/view`, { method: 'POST' });
    } catch (e) {
      console.error('Failed to update view count:', e);
    }
  }
  
  // 최신 데이터로 갱신
  try {
    const freshArticle = await $fetch(`/api/article/${articleId}?_t=${Date.now()}`);
    if (freshArticle) {
      currentArticle.value = freshArticle;
    }
    
    const freshRelated = await $fetch(`/api/article/${articleId}/related?_t=${Date.now()}`);
    if (freshRelated) {
      relatedArticles.value = freshRelated;
    }
  } catch (e) {
    console.error('Failed to refresh data:', e);
  }
});
</script>

<template>
  <div>
    <!-- 로딩 상태 -->
    <div v-if="isLoading" class="p-8 text-center text-gray-500">
      Loading article...
    </div>
    
    <!-- 에러 상태 -->
    <div v-else-if="error || !currentArticle" class="p-8 text-center">
      <p class="text-red-500 mb-4">Failed to load article.</p>
      <NuxtLink :to="`/${currentLang}`" class="text-blue-600 hover:underline">
        ← Back to main
      </NuxtLink>
    </div>
    
    <!-- 정상 콘텐츠 -->
    <div v-else>
      <header class="p-4 border-b sticky top-0 bg-white/90 backdrop-blur-sm z-10">
        <div class="flex items-center">
          <NuxtLink :to="`/${currentLang}`" class="p-2 mr-2 rounded-full hover:bg-gray-100">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </NuxtLink>
          <h1 class="text-lg font-bold text-gray-900 truncate">
            {{ currentArticle.translations?.[currentLang]?.title || 'Article' }}
          </h1>
        </div>
      </header>
      
      <main class="p-4">
        <article>
          <!-- 이미지 -->
          <img 
            v-if="currentArticle.image_path" 
            :src="currentArticle.image_path"
            :alt="currentArticle.translations?.[currentLang]?.title || ''"
            class="w-full rounded-lg mb-4 object-cover"
          >
          
          <!-- 제목 -->
          <h1 class="text-2xl font-bold mb-3">
            {{ currentArticle.translations?.[currentLang]?.title || '' }}
          </h1>
          
          <!-- 메타 정보 - 시간 표시 -->
          <div class="text-sm text-gray-600 mb-4 flex items-center flex-wrap gap-2">
            <span>{{ currentArticle.press || 'Reporter' }}</span>
            <span>·</span>
            <span class="font-medium">{{ timeAgo(currentArticle) }}</span>
            <span>·</span>
            <span>{{ currentArticle.view_count || 0 }} views</span>
          </div>
          
          <!-- 요약 -->
          <div class="prose prose-lg max-w-none mb-6">
            <p class="text-lg leading-relaxed text-gray-800">
              {{ currentArticle.translations?.[currentLang]?.summary || '' }}
            </p>
          </div>
          
          <!-- 한줄 요약 -->
          <div 
            v-if="currentArticle.translations?.[currentLang]?.one_sentence_summary" 
            class="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg mb-6"
          >
            <p class="text-sm font-medium text-blue-900">
              💡 {{ currentArticle.translations[currentLang].one_sentence_summary }}
            </p>
          </div>
          
          <!-- 키워드 태그 -->
          <div 
            v-if="currentArticle.keywords && currentArticle.keywords.length > 0" 
            class="flex flex-wrap gap-2 mb-6"
          >
            <NuxtLink 
              v-for="keyword in currentArticle.keywords" 
              :key="keyword"
              :to="`/${currentLang}/keyword/${encodeURIComponent(keyword)}`"
              class="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors"
            >
              #{{ keyword }}
            </NuxtLink>
          </div>
          
          <!-- 원문 링크 -->
          <div v-if="currentArticle.original_url" class="mb-8 pt-4 border-t">
            <a 
              :href="currentArticle.original_url" 
              target="_blank" 
              rel="noopener noreferrer"
              class="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View original article
              <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
              </svg>
            </a>
          </div>
        </article>
        
        <!-- 관련 기사 -->
        <section 
          v-if="relatedArticles && relatedArticles.length > 0" 
          class="mt-8 pt-6 border-t"
        >
          <h2 class="text-lg font-bold mb-4">Related Articles</h2>
          <div class="space-y-3">
            <NuxtLink 
              v-for="item in relatedArticles" 
              :key="item.id"
              :to="`/${currentLang}/article/${item.id}`"
              class="block"
            >
              <article class="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <img 
                  v-if="item.image_path" 
                  :src="item.image_path"
                  :alt="item.translations?.[currentLang]?.title || ''"
                  class="w-20 h-20 rounded-md object-cover flex-shrink-0"
                >
                <div v-else class="w-20 h-20 bg-gray-200 rounded-md flex-shrink-0"></div>
                
                <div class="flex-grow min-w-0">
                  <h3 class="font-bold text-sm line-clamp-2">
                    {{ item.translations?.[currentLang]?.title || '' }}
                  </h3>
                  <p class="text-xs text-gray-500 mt-1">
                    {{ item.press || '' }} · {{ timeAgo(item) }}
                  </p>
                </div>
              </article>
            </NuxtLink>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>