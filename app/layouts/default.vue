<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const { user, clear, fetch: fetchUserSession } = useUserSession();

const isAdmin = computed(() => user.value?.role === "admin");
const appConfig = useAppConfig();
const toast = useToast();

const { data: players } = useFetch("/api/players");

async function handleLogout() {
  console.log("handleLogout");
  try {
    await $fetch("/api/auth/logout", {
      method: "POST",
    });
    await clear();
    await fetchUserSession();
    navigateTo("/login");
  } catch (err: any) {
    toast.add({
      title: "Failed to logout",
      description: err.data?.message || "Failed to logout",
      color: "error",
    });
  }
}

const route = useRoute();

const links = computed<NavigationMenuItem[]>(() => [
  {
    label: "Dashboard",
    to: "/",
    icon: "lucide:home",
    active: route.path === "/",
  },
  {
    label: "Games",
    icon: "lucide:gamepad-2",
    children: [
      {
        label: "My Games",
        description: "View your own games",
        to: "/my/games",
        icon: "lucide:folder",
        active: route.path === "/my/games",
      },
      {
        label: "Create Game",
        description: "Create a new game",
        to: "/my/games/new",
        icon: "lucide:plus",
        active: route.path === "/my/games/new",
      },
      {
        label: "All Games",
        description: "View all games",
        to: "/games",
        icon: "lucide:folders",
        active: route.path === "/games",
      },
    ],
  },

  {
    label: "Players",
    to: "/players",
    icon: "lucide:users",
    active: route.path === "/players",
    children: players.value?.map((player) => ({
      label: player.username,
      to: { name: "players-id-games", params: { id: player.id } },
      icon: "lucide:user",
      active: route.path === `/players/${player.id}/games`,
      // children: player.games?.map((game) => ({
      //   label: game.name,
      //   to: `/players/${player.id}/games/${game.id}`,
      //   icon: "lucide:folder",
      //   active: route.path === `/players/${player.id}/games/${game.id}`,
      // })),
    })),
  },

  ...(isAdmin.value
    ? [
        {
          label: "Settings",
          to: "/settings",
          icon: "lucide:settings",
          active: route.path === "/settings",
        },
      ]
    : []),
]);

const { exportAllGames } = useExport();

const userMenuItems = computed<NavigationMenuItem[]>(() => [
  // {
  //   label: user.value?.username || "User",
  //   slot: "account",
  //   disabled: true,
  // },
  ...(isAdmin.value
    ? [
        {
          label: "Export All Games",
          icon: "lucide:download",
          click: exportAllGames,
        },
      ]
    : []),
  {
    label: "Logout",
    icon: "lucide:log-out",
    onSelect: handleLogout,
  },
]);
</script>

<template>
  <UDashboardGroup>
    <UDashboardSidebar
      collapsible
      resizable
      :ui="{
        header: 'justify-between items-center!',
        footer: 'flex-col w-full',
      }"
    >
      <template #header="{ collapsed }">
        <div class="items-center justify-center"></div>
        <ULink
          to="/"
          v-if="!collapsed"
          class="flex items-center gap-2 text-xl font-bold"
        >
          <UIcon name="i-heroicons-cube" class="text-primary text-2xl" />
          <span class="-mt-1"> Archipelago Groupie </span>
        </ULink>
        <UDashboardSidebarCollapse />
      </template>
      <template #default="{ collapsed }">
        <UPopover
          mode="hover"
          :content="{ side: 'right' }"
          :ui="{ root: 'mb-12' }"
        >
          <UButton
            :label="user?.username || 'User'"
            :block="collapsed"
            color="neutral"
            variant="ghost"
            class="w-full"
          />

          <template #content>
            <UNavigationMenu
              :avatar="{
                text: user?.role || 'Player',
              }"
              :items="userMenuItems"
              :collapsed="collapsed"
              orientation="vertical"
            />
          </template>
        </UPopover>
        <UNavigationMenu
          :items="links"
          :collapsed="collapsed"
          orientation="vertical"
        />
      </template>
      <template #footer="{ collapsed }">
        <CommonChica v-if="Math.random() < 0.1" />
        <br />
        <UColorModeSelect
          :content="{ side: 'right' }"
          color="neutral"
          :trailingIcon="appConfig.ui.icons.chevronRight"
          class="w-full"
        />
      </template>
    </UDashboardSidebar>

    <ClientOnly>
      <GlobalDropZone />
    </ClientOnly>
    <slot />
  </UDashboardGroup>
</template>
