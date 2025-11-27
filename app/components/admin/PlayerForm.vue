<script setup lang="ts">
import { ref } from "vue";
import { z } from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";

const emit = defineEmits<{
  success: [result: { player: any; generatedPassword: string }];
}>();

const loading = ref(false);
const generatedPassword = ref<string | null>(null);

// Form schema
const schema = z.object({
  username: z.string().min(1, "Username is required"),
});

type Schema = z.output<typeof schema>;

const state = ref<Schema>({
  username: "",
});

const handleSubmit = async (event: FormSubmitEvent<Schema>) => {
  loading.value = true;
  generatedPassword.value = null;

  try {
    const response = await $fetch("/api/admin/players", {
      method: "POST",
      body: {
        username: event.data.username,
      },
    });

    generatedPassword.value = response.generatedPassword;

    // Reset form
    state.value.username = "";

    emit("success", response);
  } catch (err: any) {
    alert(err.data?.message || "Failed to create player");
  } finally {
    loading.value = false;
  }
};

const copyPassword = () => {
  if (generatedPassword.value) {
    navigator.clipboard.writeText(generatedPassword.value);
    alert("Password copied to clipboard!");
  }
};
</script>

<template>
  <div class="space-y-6">
    <UForm :schema="schema" :state="state" @submit="handleSubmit">
      <UFormField label="Username" name="username" required>
        <UInput
          v-model="state.username"
          placeholder="Enter username"
          :disabled="loading"
        />
      </UFormField>

      <div class="mt-6">
        <UButton
          type="submit"
          :loading="loading"
          :disabled="loading"
          size="lg"
          block
        >
          Create Player
        </UButton>
      </div>
    </UForm>

    <!-- Generated Password Display -->
    <UAlert v-if="generatedPassword" color="success" variant="soft">
      <template #title>
        <div class="flex items-center gap-2">
          <UIcon name="i-heroicons-check-circle" class="text-xl" />
          <span class="font-semibold">Player Created Successfully!</span>
        </div>
      </template>
      <template #description>
        <div class="space-y-3 mt-2">
          <div>
            <p class="text-sm mb-2">Generated Password:</p>
            <div class="flex items-center gap-2">
              <UInput
                :model-value="generatedPassword"
                readonly
                class="flex-1 font-mono"
              />
              <UButton
                icon="i-heroicons-clipboard-document"
                color="success"
                variant="soft"
                @click="copyPassword"
              >
                Copy
              </UButton>
            </div>
            <p class="text-xs mt-2 opacity-90">
              Make sure to save this password and share it with the player. It
              won't be shown again.
            </p>
          </div>
        </div>
      </template>
    </UAlert>
  </div>
</template>
