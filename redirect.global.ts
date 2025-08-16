// middleware/redirect.global.ts
export default defineNuxtRouteMiddleware((to, from) => {
  if (to.path === '/') {
    return navigateTo('/en', { redirectCode: 301 });
  }
});