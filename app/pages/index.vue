<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
});

const { user } = useUserSession();
const { data: games } = useFetch("/api/games");
const { data: players } = useFetch("/api/players");

const isAdmin = computed(() => user.value?.role === "admin");

const totalGames = computed(() => games.value?.length || 0);
const totalPlayers = computed(() => players.value?.length || 0);
</script>

<template>
  <UContainer class="pt-12">
    <UPageGrid class="lg:grid-cols-2 mb-8">
      <UPageFeature
        icon="i-heroicons-document-text"
        title="Total Games"
        :description="`${totalGames} games uploaded`"
      />
      <UPageFeature
        icon="i-heroicons-users"
        title="Total Players"
        :description="`${totalPlayers} players registered`"
      />
    </UPageGrid>

    <div class="flex items-center justify-between mb-6 mt-12">
      <h2 class="text-2xl font-bold">Recent Games</h2>
      <UButton
        to="/games"
        variant="ghost"
        trailing-icon="i-heroicons-arrow-right"
      >
        View All Games
      </UButton>
    </div>

    <GameList
      v-if="games && games.length > 0"
      :games="(games as any).slice(0, 5)"
      :show-player="true"
      :link-to-edit="true"
      :show-delete="false"
    />
    <UEmpty
      v-else
      title="No games uploaded yet"
      description="Be the first to upload a game"
    >
      <template #actions>
        <UButton to="/my/games/new" size="lg" icon="i-heroicons-plus">
          Upload Game
        </UButton>
      </template>
    </UEmpty>
  </UContainer>
</template>
