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
  playerId: number;
  playerUsername: string;
}

const { data: games, pending } = useFetch<Game[]>("/api/games");

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
    accessorKey: "playerUsername",
    header: "Player",
    cell: ({ row }) => row.original.playerUsername,
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
      const UButton = resolveComponent("UButton");
      const game = row.original;
      return h("div", { class: "flex gap-2 justify-end" }, [
        h(
          UButton,
          {
            to: `/players/${game.playerId}/games/${game.id}/edit`,
            color: "primary",
            variant: "soft",
            size: "sm",
            icon: "i-heroicons-pencil",
          },
          () => "Edit"
        ),
      ]);
    },
  },
];
</script>

<template>
  <UContainer>
    <UPageHeader
      title="All Games"
      description="View all uploaded YAML configurations from all players"
      class="mb-8"
    />

    <USkeleton v-if="pending" class="h-64" />

    <UEmpty
      v-else-if="games && games.length === 0"
      icon="i-heroicons-inbox"
      title="No games yet"
      description="No games have been uploaded yet"
    />

    <UCard v-else-if="games" class="overflow-hidden">
      <UTable :data="games" :columns="columns" />
    </UCard>
  </UContainer>
</template>
