<script setup lang="ts">
import { ref, watch } from "vue";

const saving = ref(false);

// Fetch current settings
const {
  data: settings,
  pending: loading,
  refresh,
} = useFetch("/api/admin/settings");

const allowPlayerSignup = ref(false);

watch(
  settings,
  (newSettings) => {
    if (newSettings) {
      allowPlayerSignup.value = newSettings.allowPlayerSignup || false;
    }
  },
  { immediate: true }
);

const handleSave = async () => {
  saving.value = true;

  try {
    await $fetch("/api/admin/settings", {
      method: "PATCH",
      body: {
        allowPlayerSignup: allowPlayerSignup.value,
      },
    });

    alert("Settings saved successfully!");
    await refresh();
  } catch (err: any) {
    alert(err.data?.message || "Failed to save settings");
  } finally {
    saving.value = false;
  }
};
</script>

<template>
  <div class="space-y-6">
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold">Application Settings</h3>
      </template>

      <div v-if="loading" class="text-center py-8">
        <UIcon
          name="i-heroicons-arrow-path"
          class="text-3xl animate-spin text-primary"
        />
        <p class="mt-2 opacity-75">Loading settings...</p>
      </div>

      <div v-else class="space-y-6">
        <!-- Player Signup Toggle -->
        <UFormField
          label="Allow Player Self-Signup"
          name="allowPlayerSignup"
          help="When enabled, players can create their own accounts without admin intervention"
        >
          <UToggle v-model="allowPlayerSignup" :disabled="saving" />
        </UFormField>

        <div class="pt-4 border-t">
          <UButton
            :loading="saving"
            :disabled="saving"
            size="lg"
            @click="handleSave"
          >
            Save Settings
          </UButton>
        </div>
      </div>
    </UCard>
  </div>
</template>
