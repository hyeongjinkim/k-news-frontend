<script setup>
// 이 페이지는 화면에 보이지 않고, 접속 즉시 /en으로 사용자를 보냅니다.
await navigateTo('/en', { redirectCode: 301 });
</script>