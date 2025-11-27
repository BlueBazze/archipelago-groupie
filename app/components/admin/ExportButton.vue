<script setup lang="ts">
const { loading, exportAllGames } = useExport();
</script>

<template>
  <UButton
    :loading="loading"
    :disabled="loading"
    size="lg"
    color="primary"
    icon="i-heroicons-arrow-down-tray"
    @click="exportAllGames"
  >
    Export All YAMLs as ZIP
  </UButton>
</template>
