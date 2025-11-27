/**
 * Authentication middleware
 * Ensures user is logged in
 */
export default defineNuxtRouteMiddleware(async (to, from) => {
  const { loggedIn } = useUserSession();

  if (!loggedIn.value) {
    // Not logged in - redirect to login
    return navigateTo("/login");
  }
});
