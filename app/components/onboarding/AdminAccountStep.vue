<script setup lang="ts">
const emit = defineEmits<{
  complete: [];
}>();

function handleComplete(success: boolean) {
  if (success) {
    emit("complete");
  }
}
</script>

<template>
  <div class="space-y-4">
    <div>
      <h3 class="text-lg font-semibold mb-1">Create Admin Account</h3>
      <p class="text-sm text-muted">
        Set up the first admin account to manage players and settings
      </p>
    </div>

    <AuthSignupForm submit-button="Continue" @complete="handleComplete" />
  </div>
</template>
