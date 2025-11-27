<script setup lang="ts">
interface Player {
  id: number;
  username: string;
  role: string;
  createdAt: Date;
  gameCount?: number;
}

interface Props {
  players: Player[];
  showActions?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showActions: true,
});

const emit = defineEmits<{
  delete: [playerId: number];
}>();

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const handleDelete = (playerId: number, username: string) => {
  if (confirm(`Are you sure you want to delete player "${username}"? This will also delete all their games.`)) {
    emit("delete", playerId);
  }
};
</script>

<template>
  <UEmpty
    v-if="players.length === 0"
    title="No players found"
    description="There are no players in the system"
  />

  <div v-else class="space-y-3">
    <div
      v-for="player in players"
      :key="player.id"
      class="flex items-center justify-between p-4 rounded-lg border hover:bg-elevated"
    >
      <div class="flex-1 flex items-center gap-3">
        <UIcon 
          :name="player.role === 'admin' ? 'i-heroicons-shield-check' : 'i-heroicons-user'" 
          class="text-2xl"
          :class="player.role === 'admin' ? 'text-warning' : 'text-primary'"
        />
        <div>
          <div class="flex items-center gap-2">
            <h3 class="font-semibold">{{ player.username }}</h3>
            <UBadge 
              :color="player.role === 'admin' ? 'warning' : 'primary'"
              variant="soft"
              size="xs"
            >
              {{ player.role }}
            </UBadge>
          </div>
          <p class="text-sm opacity-75">
            Joined {{ formatDate(player.createdAt) }}
          </p>
          <p v-if="player.gameCount !== undefined" class="text-xs opacity-60 mt-1">
            {{ player.gameCount }} game{{ player.gameCount !== 1 ? 's' : '' }} uploaded
          </p>
        </div>
      </div>

      <div v-if="showActions && player.role !== 'admin'" class="flex gap-2">
        <UButton
          :to="`/players/${player.id}/games`"
          color="primary"
          variant="soft"
          size="sm"
          icon="i-heroicons-folder-open"
        >
          View Games
        </UButton>

        <UButton
          color="error"
          variant="soft"
          size="sm"
          icon="i-heroicons-trash"
          @click="handleDelete(player.id, player.username)"
        >
          Delete
        </UButton>
      </div>
    </div>
  </div>
</template>

