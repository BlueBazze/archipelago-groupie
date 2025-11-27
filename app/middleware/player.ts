/**
 * Player route guard middleware
 * Protects player-only pages (allows both players and admins)
 */
export default defineNuxtRouteMiddleware(async (to, from) => {
  //   const { data: session } = await useFetch("/api/auth/session");

  const { user, fetch } = useUserSession();

  fetch();
  if (
    // if The player is not the one trying to access the page
    to.params.playerId !== user.value?.id &&
    // and if The player is not admin
    user.value?.role !== "admin"
    // // or if The player is not admin
    // || user.value?.role !== "admin"
  ) {
    return abortNavigation("You are not authorized to access this page");
  }
});
