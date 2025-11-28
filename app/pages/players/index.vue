<script setup lang="ts">
import type { ColumnDef } from "@tanstack/vue-table";

definePageMeta({
  middleware: ["auth", "admin"],
});

interface Player {
  id: number;
  username: string;
  role: string;
  createdAt: Date | string;
  gameCount?: number;
}

const UIcon = resolveComponent("UIcon");
const UBadge = resolveComponent("UBadge");
const UButton = resolveComponent("UButton");
const CommonConfirmDelete = resolveComponent("CommonConfirmDelete");

const { user } = useUserSession();
const isAdmin = computed(() => user.value?.role === "admin");

const { data: players, pending, refresh } = useFetch<Player[]>("/api/players");

const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const handleDelete = async (playerId: number, username: string) => {
  if (
    confirm(
      `Are you sure you want to delete player "${username}"? This will also delete all their games.`
    )
  ) {
    try {
      await $fetch(`/api/admin/players/${playerId}`, {
        method: "DELETE",
      });
      await refresh();
    } catch (err: any) {
      alert(err.data?.message || "Failed to delete player");
    }
  }
};

const columns: ColumnDef<Player>[] = [
  {
    accessorKey: "username",
    header: "Player",
    cell: ({ row }) => {
      const player = row.original;
      const isAdmin = player.role === "admin";

      return h("div", { class: "flex items-center gap-3" }, [
        h(UIcon, {
          name: isAdmin ? "i-heroicons-shield-check" : "i-heroicons-user",
          class: ["text-2xl", isAdmin ? "text-warning" : "text-primary"],
        }),
        h("div", [
          h("div", { class: "flex items-center gap-2" }, [
            h("span", { class: "font-semibold" }, player.username),
            h(
              UBadge,
              {
                color: isAdmin ? "warning" : "primary",
                variant: "soft",
                size: "xs",
              },
              () => player.role
            ),
          ]),
        ]),
      ]);
    },
  },
  {
    accessorKey: "createdAt",
    header: "Joined",
    cell: ({ row }) => formatDate(row.original.createdAt),
  },
  {
    accessorKey: "gameCount",
    header: "Games",
    cell: ({ row }) => {
      const count = row.original.gameCount || 0;
      return `${count} game${count !== 1 ? "s" : ""}`;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const player = row.original;

      return h("div", { class: "flex gap-2 justify-end" }, [
        h(
          UButton,
          {
            to: `/players/${player.id}/games`,
            color: "primary",
            variant: "soft",
            size: "sm",
            icon: "i-heroicons-folder-open",
          },
          () => "View Games"
        ),
        isAdmin.value &&
          h(
            CommonConfirmDelete,
            {
              color: "error",
              variant: "soft",
              size: "sm",
              icon: "i-heroicons-trash",
              onClick: () => handleDelete(player.id, player.username),
            },
            () => "Delete"
          ),
      ]);
    },
  },
];
</script>

<template>
  <UDashboardPanel :ui="{ body: 'p-0' }">
    <template #header>
      <UDashboardNavbar
        title="Players"
        description="Manage all players in the system"
        :ui="{ root: 'border-none' }"
      >
        <template #actions>
          <UButton to="/players/new" size="lg" icon="i-heroicons-plus">
            Create Player
          </UButton>
        </template>
      </UDashboardNavbar>
    </template>
    <template #body>
      <USkeleton v-if="pending" class="flex-1" />

      <UEmpty
        v-else-if="players && players.length === 0"
        icon="i-heroicons-users"
        title="No players found"
        description="There are no players in the system"
      >
        <template #actions>
          <UButton to="/players/new" size="lg" icon="i-heroicons-plus">
            Create Player
          </UButton>
        </template>
      </UEmpty>

      <UTable v-else-if="players" :data="players" :columns="columns" />
    </template>
  </UDashboardPanel>
</template>
