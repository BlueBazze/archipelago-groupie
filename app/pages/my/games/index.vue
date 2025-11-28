<script setup lang="ts">
import type { ColumnDef } from "@tanstack/vue-table";

definePageMeta({
  middleware: ["auth"],
});

interface Game {
  id: number;
  name: string;
  yamlFilename: string | null;
  uploadedAt: Date | string | null;
}

const toast = useToast();
const UButton = resolveComponent("UButton");
const CommonConfirmDelete = resolveComponent("CommonConfirmDelete");
const { data: games, pending, refresh } = useFetch<Game[]>("/api/my/games");

const formatDate = (date: Date | string | null) => {
  if (!date) return "Not uploaded";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const handleDelete = async (gameId: number) => {
  try {
    await $fetch(`/api/my/games/${gameId}`, {
      method: "DELETE",
    });
    await refresh();
  } catch (err: any) {
    toast.add({
      title: "Failed to delete game",
      description: err.data?.message || "Failed to delete game",
      color: "error",
    });
  }
};

const columns: ColumnDef<Game>[] = [
  {
    accessorKey: "name",
    header: "Game Name",
    cell: ({ row }) => {
      const UIcon = resolveComponent("UIcon");
      const game = row.original;
      return h("div", { class: "flex items-center gap-3" }, [
        h(UIcon, {
          name: "i-heroicons-document-text",
          class: "text-xl text-primary",
        }),
        h("div", [
          h("div", { class: "font-semibold" }, game.name),
          h(
            "div",
            { class: "text-sm text-muted" },
            game.yamlFilename || "No file"
          ),
        ]),
      ]);
    },
  },
  {
    accessorKey: "uploadedAt",
    header: "Uploaded",
    cell: ({ row }) => formatDate(row.original.uploadedAt),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const game = row.original;
      return h("div", { class: "flex gap-2 justify-end" }, [
        h(
          UButton,
          {
            to: `/my/games/${game.id}/edit`,
            color: "primary",
            variant: "soft",
            size: "sm",
            icon: "i-heroicons-pencil",
          },
          () => "Edit"
        ),
        h(CommonConfirmDelete, {
          onConfirm: () => handleDelete(game.id),
        }),
      ]);
    },
  },
];
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar
        title="My Games"
        description="Manage your uploaded YAML configurations"
        :ui="{ root: 'border-none' }"
      >
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <USkeleton v-if="pending && games?.length === 0" class="h-64" />

      <UEmpty
        v-else-if="games && games.length === 0"
        icon="i-heroicons-inbox"
        title="No games yet"
        description="Upload your first YAML configuration to get started"
      >
        <template #actions>
          <UButton to="/my/games/new" size="lg" icon="i-heroicons-plus">
            Upload Game
          </UButton>
        </template>
      </UEmpty>

      <UTable v-else-if="games" :data="games" :columns="columns" />
    </template>
  </UDashboardPanel>
</template>
