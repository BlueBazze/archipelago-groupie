<script setup lang="ts">
definePageMeta({
  middleware: ["auth", "admin"],
});
</script>

<template>
  <UDashboardPanel :ui="{ body: 'p-0' }">
    <template #header>
      <UDashboardNavbar
        title="Settings"
        description="Configure application settings"
        :ui="{ root: 'border-none' }"
      />
    </template>
    <template #body>
      <div>
        <h2 class="text-xl font-semibold mb-4">Settings</h2>

        <AdminSettingsForm />
      </div>

      <div>
        <h2 class="text-xl font-semibold mb-4">Export</h2>
        <p class="text-sm opacity-75 mb-4">
          Export all player YAML configurations as a ZIP file to upload to the
          Archipelago website.
        </p>
        <AdminExportButton />
      </div>
    </template>
  </UDashboardPanel>
</template>
