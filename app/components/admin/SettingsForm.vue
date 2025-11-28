<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";

const toast = useToast();

const emit = defineEmits<{
  complete: [];
}>();

// Form schema
const schema = z.object({
  allowPlayerSignup: z.boolean(),
});

type Schema = z.output<typeof schema>;

// Fetch current settings
const {
  data: settings,
  pending,
  refresh,
} = useFetch("/api/admin/settings", {
  onResponse(response) {
    state.allowPlayerSignup = !!response.response._data?.allowPlayerSignup;
    return response;
  },
});

// Form state
const state = reactive<Schema>({
  allowPlayerSignup: !!settings.value?.allowPlayerSignup,
});

const saving = ref(false);

// watch(
//   settings,
//   (newSettings) => {
//     if (newSettings) {
//       Object.assign(state, newSettings);
//     }
//   },
//   { immediate: true }
// );

// Handle form submission
async function onSubmit(event: FormSubmitEvent<Schema>) {
  saving.value = true;
  try {
    const response = await $fetch("/api/admin/settings", {
      method: "PATCH",
      body: {
        allowPlayerSignup: event.data.allowPlayerSignup,
      },
    });
    if (response.success) {
      emit("complete");
    }
  } catch (error: any) {
    toast.add({
      title: "Error",
      description: error.message,
      color: "error",
    });
  }

  saving.value = false;
}
</script>

<template>
  <div v-if="pending" class="text-center py-8">
    <UIcon
      name="i-heroicons-arrow-path"
      class="text-3xl animate-spin text-primary"
    />
    <p class="mt-2 opacity-75">Loading settings...</p>
  </div>

  <div v-else class="space-y-6">
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <!-- Player Signup Setting -->
      <UFormField
        name="allowPlayerSignup"
        label="Player Self-Signup"
        description="Allow players to create their own accounts. If disabled, you'll need to create player accounts manually."
      >
        <USwitch v-model="state.allowPlayerSignup" />
      </UFormField>

      <!-- Action Buttons -->
      <div class="flex gap-3">
        <UButton type="submit" size="lg" :loading="saving">
          Save Settings
        </UButton>
      </div>
    </UForm>
  </div>
</template>
