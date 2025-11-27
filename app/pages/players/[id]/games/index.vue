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

const route = useRoute();
const playerId = computed(() => parseInt(route.params.id as string));

const { data: games, pending, refresh } = useFetch<Game[]>(`/api/player/${playerId.value}/games`);

// Fetch player info
const { data: players } = useFetch("/api/players");
const player = computed(() => {
  if (!players.value) return null;
  return players.value.find((p: any) => p.id === playerId.value);
});

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
  if (confirm("Are you sure you want to delete this game?")) {
    try {
      await $fetch(`/api/games/${gameId}`, {
        method: "DELETE",
      });
      await refresh();
    } catch (err: any) {
      alert(err.data?.message || "Failed to delete game");
    }
  }
};

const columns: ColumnDef<Game>[] = [
  {
    accessorKey: "name",
    header: "Game Name",
    cell: ({ row }) => {
      const UIcon = resolveComponent('UIcon');
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
      const UButton = resolveComponent('UButton');
      const game = row.original;
      return h("div", { class: "flex gap-2 justify-end" }, [
        h(
          UButton,
          {
            to: `/players/${playerId.value}/games/${game.id}/edit`,
            color: "primary",
            variant: "soft",
            size: "sm",
            icon: "i-heroicons-pencil",
          },
          () => "Edit"
        ),
        h(
          UButton,
          {
            color: "error",
            variant: "soft",
            size: "sm",
            icon: "i-heroicons-trash",
            onClick: () => handleDelete(game.id),
          },
          () => "Delete"
        ),
      ]);
    },
  },
];
</script>

<template>
  <UContainer>
    <UPageHeader
      :title="`${player?.username || 'Player'}'s Games`"
      description="View and manage YAML configurations for this player"
      class="mb-8"
    >
      <template #links>
        <UButton
          to="/players"
          variant="ghost"
          icon="i-heroicons-arrow-left"
        >
          Back to Players
        </UButton>
      </template>
    </UPageHeader>

    <USkeleton v-if="pending" class="h-64" />

    <UEmpty
      v-else-if="games && games.length === 0"
      icon="i-heroicons-inbox"
      title="No games yet"
      description="This player hasn't uploaded any games yet"
    />

    <UCard v-else-if="games" class="overflow-hidden">
      <UTable :data="games" :columns="columns" />
    </UCard>
  </UContainer>
</template>

