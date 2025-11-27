<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const { user, clear } = useUserSession();

const isAdmin = computed(() => user.value?.role === "admin");

const handleLogout = async () => {
  try {
    await $fetch("/api/auth/logout", {
      method: "POST",
    });
    clear();
    navigateTo("/login");
  } catch (err: any) {
    alert("Failed to logout");
  }
};

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
        active: route.path.startsWith("/my/games"),
      },
      {
        label: "Create Game",
        description: "Create a new game",
        to: "/my/games/new",
        icon: "lucide:plus",
        active: route.path.startsWith("/my/games/new"),
      },
      {
        label: "All Games",
        description: "View all games",
        to: "/games",
        icon: "lucide:folders",
        active: route.path.startsWith("/games"),
      },
    ],
  },
  {
    label: "Players",
    to: "/players",
    icon: "lucide:users",
    active: route.path.startsWith("/players"),
  },

  ...(isAdmin.value
    ? [
        {
          label: "Settings",
          to: "/settings",
          icon: "lucide:settings",
          active: route.path.startsWith("/settings"),
        },
      ]
    : []),
]);

const { exportAllGames } = useExport();

const userMenuItems = computed(() => [
  {
    label: user.value?.username || "User",
    slot: "account",
    disabled: true,
  },
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
    click: handleLogout,
  },
]);
</script>

<template>
  <UHeader title="Archipelago Groupie" :ui="{ right: 'gap-2' }">
    <template #left>
      <NuxtLink to="/" class="flex items-center gap-2 text-xl font-bold">
        <UIcon name="i-heroicons-cube" class="text-primary text-2xl" />
        <span class="hidden sm:inline">Archipelago Groupie</span>
      </NuxtLink>
    </template>
    <UNavigationMenu :items="links" />

    <template #right>
      <UBadge
        :color="isAdmin ? 'warning' : 'primary'"
        variant="soft"
        size="xs"
        class="hidden md:inline-flex"
      >
        {{ user?.role || "Unknown" }}
      </UBadge>

      <UDropdownMenu :items="[userMenuItems]">
        <UButton color="neutral" variant="ghost" icon="lucide:user" />
      </UDropdownMenu>
    </template>
  </UHeader>
</template>
