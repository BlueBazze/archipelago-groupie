<script setup lang="ts">
interface Game {
  id: number;
  name: string;
  yamlFilename: string | null;
  uploadedAt: Date | string | null;
  playerId?: number;
  playerUsername?: string;
}

interface Props {
  games: Game[];
  showPlayer?: boolean;
  linkToEdit?: boolean;
  showDelete?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showPlayer: false,
  linkToEdit: true,
  showDelete: false,
});

const emit = defineEmits<{
  delete: [gameId: number];
}>();

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

const getEditLink = (game: Game) => {
  if (!props.linkToEdit) return undefined;
  
  // If playerId is present, it's admin viewing a specific player's games
  // If playerId is undefined, it's the current user's own games
  if (game.playerId !== undefined) {
    return `/players/${game.playerId}/games/${game.id}/edit`;
  }
  return `/my/games/${game.id}/edit`;
};

const handleDelete = (gameId: number) => {
  emit("delete", gameId);
};
</script>

<template>
  <UEmpty
    v-if="games.length === 0"
    title="No games found"
    description="There are no games to display"
  />

  <div v-else class="space-y-3">
    <div
      v-for="game in games"
      :key="game.id"
      class="flex items-center justify-between p-4 rounded-lg border hover:bg-elevated"
    >
      <div class="flex-1 flex items-center gap-3">
        <UIcon name="i-heroicons-document-text" class="text-2xl text-primary" />
        <div>
          <h3 class="font-semibold">{{ game.name }}</h3>
          <p class="text-sm opacity-75">
            {{ game.yamlFilename || "No file" }}
          </p>
          <p v-if="showPlayer && game.playerUsername" class="text-sm opacity-75">
            Player: {{ game.playerUsername }}
          </p>
          <p class="text-xs opacity-60 mt-1">
            {{ formatDate(game.uploadedAt) }}
          </p>
        </div>
      </div>

      <div class="flex gap-2">
        <UButton
          v-if="linkToEdit && getEditLink(game)"
          :to="getEditLink(game)"
          color="primary"
          variant="soft"
          size="sm"
          icon="i-heroicons-pencil"
        >
          Edit
        </UButton>

        <UButton
          v-if="showDelete"
          color="error"
          variant="soft"
          size="sm"
          icon="i-heroicons-trash"
          @click="handleDelete(game.id)"
        >
          Delete
        </UButton>
      </div>
    </div>
  </div>
</template>

