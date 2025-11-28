<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
});

const { user } = useUserSession();
const router = useRouter();
const route = useRoute();
const uploading = ref(false);

// Pre-fill from drop zone if available
const yamlContent = ref((route.query.content as string) || "");

// Computed values from YAML
const parsedYaml = computed<any>(() => {
  if (!yamlContent.value) return null;
  try {
    return parseYAML(yamlContent.value);
  } catch {
    return null;
  }
});

const gameName = computed(() => {
  return parsedYaml.value?.game || parsedYaml.value?.name || "Unknown";
});

const yamlFilename = computed(() => {
  const username = user.value?.username || "user";
  const game = gameName.value;
  return `${username}_${game}.yaml`;
});

const canCreate = computed(() => {
  return yamlContent.value && gameName.value && gameName.value !== "Unknown";
});

const handleCreate = async () => {
  if (!yamlContent.value) {
    alert("No YAML content to upload");
    return;
  }

  if (!gameName.value || gameName.value === "Unknown") {
    alert(
      "Could not determine game name from YAML. Please ensure your YAML has a 'game' field."
    );
    return;
  }

  uploading.value = true;

  try {
    await $fetch("/api/my/games", {
      method: "POST",
      body: {
        name: gameName.value,
        yamlContent: yamlContent.value,
        yamlFilename: yamlFilename.value,
      },
    });

    alert("Game created successfully!");
    router.push("/my/games");
  } catch (err: any) {
    alert(err.data?.message || "Failed to create game");
  } finally {
    uploading.value = false;
  }
};
</script>

<template>
  <UDashboardPanel >
    <template #header>
      <UDashboardNavbar
        title="Upload New Game"
        description="Drop a YAML file anywhere on the page to upload"
      >
        <template #links>
          <UButton to="/my/games" variant="ghost" icon="i-heroicons-arrow-left">
            Back to My Games
          </UButton>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div v-if="yamlContent" class="space-y-6">
        <!-- Auto-detected info and Create button -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4 text-sm">
            <div>
              <span class="opacity-75">Game:</span>
              <span class="font-semibold ml-2">{{ gameName }}</span>
            </div>
            <div>
              <span class="opacity-75">Filename:</span>
              <span class="font-mono ml-2">{{ yamlFilename }}</span>
            </div>
          </div>

          <UButton
            :loading="uploading"
            :disabled="uploading || !canCreate"
            size="lg"
            color="primary"
            icon="i-heroicons-plus"
            @click="handleCreate"
          >
            Create Game
          </UButton>
        </div>

        <!-- YAML Editor Component -->
        <YamlEditor
          v-model="yamlContent"
          :loading="uploading"
          :show-save-button="false"
        />
      </div>

      <UEmpty
        v-else
        icon="i-heroicons-cloud-arrow-up"
        variant="naked"
        title="Drop YAML File Anywhere"
        description="Drag and drop a .yml or .yaml file anywhere on this page to upload it"
      />
    </template>
  </UDashboardPanel>
</template>
