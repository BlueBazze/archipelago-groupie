/**
 * Admin route guard middleware
 * Protects admin-only pages
 */
export default defineNuxtRouteMiddleware(async (to, from) => {
  const { fetch, user } = useUserSession();

  await fetch();

  if (!user.value || user.value?.role !== "admin") {
    return abortNavigation("You are not authorized to access this page");
  }
});
