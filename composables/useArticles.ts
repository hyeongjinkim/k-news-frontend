// composables/useArticles.ts
import { ref } from 'vue';

// articles 데이터를 앱 전체에서 공유할 수 있도록 ref를 생성합니다.
const articles = ref([]);

export const useArticles = () => {
  return {
    articles
  };
};