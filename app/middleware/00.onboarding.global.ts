/**
 * Global onboarding middleware
 * Redirects to onboarding page if no admin exists
 * Runs on every route change
 */
export default defineNuxtRouteMiddleware(async (to, from) => {
  // Skip check if already on onboarding page
  if (to.path === "/onboarding") {
    return;
  }

  // Check if onboarding is needed
  const { data } = await useFetch("/api/auth/check-onboarding");

  if (data.value?.needsOnboarding) {
    // No admin exists - redirect to onboarding
    return navigateTo("/onboarding");
  }
});

