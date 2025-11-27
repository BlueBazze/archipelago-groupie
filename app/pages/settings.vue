<script setup lang="ts">
definePageMeta({
  middleware: ["auth", "admin"],
});
</script>

<template>
  <UContainer class="max-w-4xl">
    <UPageHeader
      title="Settings"
      description="Configure application settings"
      class="mb-8"
    />

    <UContainer>
      <h2 class="text-xl font-semibold mb-4">Application Settings</h2>
      <AdminSettingsForm />
    </UContainer>

    <UContainer>
      <h2 class="text-xl font-semibold mb-4">Export All Games</h2>
      <p class="text-sm opacity-75 mb-4">
        Export all player YAML configurations as a ZIP file to upload to the
        Archipelago website.
      </p>
      <AdminExportButton />
    </UContainer>
  </UContainer>
</template>
