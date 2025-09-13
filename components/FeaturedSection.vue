<!-- components/FeaturedSection.vue -->
<template>
  <div v-if="featured && featured.length > 0" class="mb-8">
    <h2 class="text-xl font-bold mb-4 px-4">✨ Trending</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 px-4">
      <article 
        v-for="item in featured" 
        :key="item.id"
        class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
      >
        <NuxtLink :to="`/${currentLang}/article/${item.id}`">
          <div class="aspect-[4/3] overflow-hidden">
            <img 
              :src="item.image_url" 
              :alt="getTitle(item)"
              class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            >
          </div>
          <div class="p-4">
            <h3 class="font-bold text-base mb-2 line-clamp-2">{{ getTitle(item) }}</h3>
            <p class="text-sm text-gray-600 line-clamp-2">{{ getSummary(item) }}</p>
          </div>
        </NuxtLink>
      </article>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['currentLang'])

const { data: featured } = await useFetch('/api/articles/featured')

function getTitle(item) {
  return item.translations[props.currentLang]?.title || 
         item.translations['en']?.title || 
         'No title'
}

function getSummary(item) {
  return item.translations[props.currentLang]?.one_sentence_summary || 
         item.translations['en']?.one_sentence_summary || 
         ''
}
</script>

<style scoped>
.featured-wrapper {
  margin-bottom: 2rem;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
}

.featured-title {
  color: white;
  margin-bottom: 1rem;
}

.featured-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.featured-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s;
}

.featured-card:hover {
  transform: translateY(-4px);
}

.featured-image img {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.featured-content {
  padding: 1rem;
}

.featured-content h3 {
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.featured-content p {
  font-size: 0.875rem;
  color: #666;
}
</style>