<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
});

const route = useRoute();
const router = useRouter();
const gameId = computed(() => parseInt(route.params.id as string));

const {
  data: game,
  pending,
  refresh,
} = useFetch(`/api/my/games/${gameId.value}`);

const yamlContent = ref("");
const saving = ref(false);

// Initialize content from game
watch(
  () => game.value,
  (newGame) => {
    if (newGame?.yamlContent) {
      yamlContent.value = newGame.yamlContent;
    }
  },
  { immediate: true }
);

const handleSave = async () => {
  saving.value = true;

  try {
    await $fetch(`/api/my/games/${gameId.value}`, {
      method: "PATCH",
      body: {
        yamlContent: yamlContent.value,
      },
    });

    alert("Game updated successfully!");
    await refresh();
  } catch (err: any) {
    alert(err.data?.message || "Failed to save game");
  } finally {
    saving.value = false;
  }
};
</script>

<template>
  <UDashboardPanel :ui="{ body: 'p-0 sm:p-0 gap-2 sm:gap-0' }">
    <template #header>
      <UDashboardNavbar
        title="Edit Game"
        :description="game?.name || 'Loading...'"
      >
        <template #links>
          <UButton to="/my/games" variant="ghost" icon="i-heroicons-arrow-left">
            Back to My Games
          </UButton>
        </template>
        <template #right>
          <div id="navbarActions" class="flex items-center justify-end"></div>
        </template>
      </UDashboardNavbar>
    </template>
    <template #body>
      <USkeleton v-if="pending" class="h-96" />

      <YamlEditor
        v-else-if="game && game.yamlContent"
        v-model="yamlContent"
        :loading="saving"
        @save="handleSave"
        teleportActionsTo="#navbarActions"
      />

      <UEmpty
        v-else-if="game"
        title="No YAML content"
        description="No YAML content available for this game"
      />
    </template>
  </UDashboardPanel>
</template>
