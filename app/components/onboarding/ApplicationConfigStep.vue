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

// Form state
const state = reactive({
  allowPlayerSignup: false,
});

const loading = ref(false);

// Handle form submission
async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true;
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

  loading.value = false;
}
</script>

<template>
  <div class="space-y-4">
    <div>
      <h3 class="text-lg font-semibold mb-1">Application Settings</h3>
      <p class="text-sm text-muted">
        Configure how players will access the application
      </p>
    </div>

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
        <UButton type="submit" block size="lg" :loading="loading">
          Complete Setup
        </UButton>
      </div>
    </UForm>
  </div>
</template>
