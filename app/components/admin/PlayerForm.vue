<script setup lang="ts">
import { ref } from "vue";
import { z } from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
import { withQuery } from "ufo";

const emit = defineEmits<{
  success: [result: { player: any; generatedPassword: string }];
}>();

const toast = useToast();

const loading = ref(false);

type PlayerInput = { username: string };

const schema = z.object({
  players: z
    .array(
      z.object({
        username: z.string().min(1, "Username is required"),
      })
    )
    .min(1, "At least one player is required"),
});

type Schema = z.output<typeof schema>;

const state = ref<Schema>({
  players: [{ username: "" }],
});

type CreatedPlayer = {
  username: string;
  generatedPassword: string;
  player: any;
};
const createdPlayers = ref<CreatedPlayer[]>([]);

function getPlayerMessage(entry: CreatedPlayer) {
  return `${withQuery(
    "https://archipelago-groupie.blue-bazze.workers.dev/login",
    { username: entry.username, password: entry.generatedPassword }
  )} 
Username: ${entry.username}
Password: ${entry.generatedPassword}`;
}

const handleSubmit = async (event: FormSubmitEvent<Schema>) => {
  loading.value = true;

  const results: CreatedPlayer[] = [];
  let errors: { username: string; error: any }[] = [];

  for (const player of event.data.players) {
    if (!player.username || !player.username.trim()) continue;
    try {
      const response = await $fetch("/api/admin/players", {
        method: "POST",
        body: { username: player.username.trim() },
      });
      results.push({
        username: player.username.trim(),
        generatedPassword: response.generatedPassword,
        player: response.player,
      });
    } catch (err: any) {
      errors.push({ username: player.username.trim(), error: err });
    }
  }

  if (results.length > 0) {
    createdPlayers.value = [...results, ...createdPlayers.value];
    toast.add({
      title:
        results.length > 1
          ? `${results.length} players created successfully!`
          : "Player created successfully!",
      color: "success",
    });
  }

  if (errors.length > 0) {
    errors.forEach((e) =>
      toast.add({
        title: `Failed to create "${e.username}"`,
        description:
          e.error?.data?.message ||
          e.error?.message ||
          "Failed to create player",
        color: "error",
      })
    );
  }

  // Reset fields
  state.value.players = [{ username: "" }];
  loading.value = false;
};

const addPlayerField = () => {
  state.value.players.push({ username: "" });
};

const removePlayerField = (idx: number) => {
  if (state.value.players.length > 1) {
    state.value.players.splice(idx, 1);
  }
};

const copyAllPasswords = () => {
  if (createdPlayers.value.length > 0) {
    const message = createdPlayers.value
      .map((c) => getPlayerMessage(c))
      .join("\n---\n");
    navigator.clipboard.writeText(message);
    toast.add({
      title: "All player logins copied to clipboard!",
      color: "success",
    });
  }
};

const copyPassword = (entry: CreatedPlayer) => {
  const message = getPlayerMessage(entry);
  navigator.clipboard.writeText(message);
  toast.add({
    title: "Player login copied to clipboard!",
    color: "success",
  });
};
</script>

<template>
  <div class="space-y-6">
    <UForm :schema="schema" :state="state" @submit="handleSubmit">
      <div class="space-y-3">
        <div
          v-for="(player, idx) in state.players"
          :key="`player-input-${idx}`"
          class="flex items-end gap-3"
        >
          <UFormField
            :label="`Username${
              state.players.length > 1 ? ' #' + (idx + 1) : ''
            }`"
            :name="`players.${idx}.username`"
            required
            class="flex-1"
          >
            <UInput
              v-model="player.username"
              placeholder="Enter username"
              :disabled="loading"
            />
          </UFormField>
          <UButton
            icon="i-heroicons-minus"
            variant="ghost"
            color="error"
            size="sm"
            @click.prevent="removePlayerField(idx)"
            v-if="state.players.length > 1"
            :disabled="loading"
            title="Remove player"
          />
        </div>
        <UButton
          icon="i-heroicons-plus"
          type="button"
          variant="soft"
          @click.prevent="addPlayerField"
          size="sm"
          :disabled="loading"
        >
          Add another
        </UButton>
      </div>
      <div class="mt-6 flex flex-col sm:flex-row sm:items-center gap-3">
        <UButton
          type="submit"
          :loading="loading"
          :disabled="loading"
          size="lg"
          class="sm:flex-1"
        >
          Create Player<span v-if="state.players.length > 1">s</span>
        </UButton>
        <UButton
          v-if="createdPlayers.length > 1"
          icon="i-heroicons-clipboard-document"
          color="success"
          variant="soft"
          size="lg"
          @click="copyAllPasswords"
          class="sm:w-auto"
        >
          Copy All Logins
        </UButton>
      </div>
    </UForm>

    <!-- Multiple Generated Passwords Display -->
    <div v-if="createdPlayers.length > 0" class="space-y-4">
      <!-- Show the exact copied message here so it's easy to copy/send -->
      <UCard
        :ui="{ body: 'p-0 sm:p-0' }"
        variant="outline"
        v-for="(entry, i) in createdPlayers"
        :key="`${entry.username}-${entry.generatedPassword}`"
      >
        <template #header>
          <div class="flex items-center gap-2 justify-between">
            PlayerName: {{ entry.username }}
            <UButton
              icon="i-heroicons-clipboard-document"
              color="neutral"
              variant="outline"
              @click="copyPassword(entry)"
            />
          </div>
        </template>
        <template #default>
          <pre class="p-4 bg-muted text-highlighted">{{
            getPlayerMessage(entry)
          }}</pre>
          <!-- <UTextarea
                  :model-value="getPlayerMessage(entry)"
                  readonly
                  class="w-full flex-1 min-h-24 rounded-none"
                  variant="soft"
                  autoresize
                  :rows="4"
                  :highlight="false"
                /> -->
        </template>
      </UCard>
      <!-- <div class="flex items-center gap-2 mt-2">
              <UButton
                icon="i-heroicons-clipboard-document"
                color="success"
                variant="soft"
                @click="copyPassword(entry)"
              >
                Copy
              </UButton>
            </div> -->
      <p class="text-xs mt-2 opacity-90">
        Copy and send the above message to the player. It contains their
        username and generated password. This message will not be shown again.
      </p>
    </div>
  </div>
</template>
