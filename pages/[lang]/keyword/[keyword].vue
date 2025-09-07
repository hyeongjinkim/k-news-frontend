<script setup>
import { ref, onMounted } from 'vue';

const route = useRoute();
const keyword = ref(decodeURIComponent(route.params.keyword));
const currentLang = ref(route.params.lang);

// SSG/ISR을 위한 데이터 페칭
const { data: articles, error } = await useFetch(`/api/articles/keyword/${encodeURIComponent(keyword.value)}`);

function timeAgo(item) {
  const dateString = item.created_at || item.display_published_at;
  if (!dateString) return '';
  const date = new Date(dateString.toString().replace(' ', 'T').replace(/\./g, '-') + 'Z');
  const seconds = Math.floor((new Date() - date) / 1000);
  if (seconds < 5) return "Just now";
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
    <header class="p-4 border-b sticky top-0 bg-white/90 backdrop-blur-sm z-10">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <NuxtLink :to="`/${currentLang}`" class="p-2 mr-2 rounded-full hover:bg-gray-100">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </NuxtLink>
          <h1 class="text-lg font-bold text-gray-900">#{{ keyword }}</h1>
        </div>
        <span v-if="articles" class="text-sm text-gray-500">
          {{ articles.length }} articles
        </span>
      </div>
    </header>
    
    <main class="p-2">
      <div v-if="error" class="p-4 text-center text-red-500">
        Failed to load articles.
      </div>
      <div v-else-if="!articles || articles.length === 0" class="p-8 text-center text-gray-500">
        No articles found for #{{ keyword }}
      </div>
      <div v-else>
        <NuxtLink v-for="item in articles" :key="item.id" :to="`/${currentLang}/article/${item.id}`">
          <article class="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <img 
              v-if="item.image_path" 
              :src="item.image_path.startsWith('http') ? item.image_path : `/static/images/${item.image_path.split('/').pop()}`" 
              alt="Thumbnail" 
              class="w-24 h-24 flex-shrink-0 bg-gray-200 rounded-md object-cover"
            >
            <div v-else class="w-24 h-24 flex-shrink-0 bg-gray-200 rounded-md"></div>
            <div class="flex-grow">
              <h2 class="font-bold text-base leading-tight">
                {{ item.translations[currentLang]?.title }}
              </h2>
              <p class="text-sm text-gray-600 mt-1">
                {{ item.translations[currentLang]?.one_sentence_summary }}
              </p>
              <p class="text-xs text-gray-500 mt-2">
                {{ item.press }} · {{ timeAgo(item) }}
                <span v-if="item.view_count"> · 👁️ {{ item.view_count }}</span>
              </p>
            </div>
          </article>
        </NuxtLink>
      </div>
    </main>
  </div>
</template>