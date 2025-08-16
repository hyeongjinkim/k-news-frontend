<script setup>
// 이 페이지는 화면에 아무것도 그리지 않고,
// 접속 즉시 /en 경로로 사용자를 보냅니다.
await navigateTo('/en', { replace: true });
</script>