<script setup lang="ts">
definePageMeta({
  middleware: ["auth", "admin"],
});

const router = useRouter();

const handleSuccess = (result: any) => {
  // Show success message and redirect after a delay
  // setTimeout(() => {
  //   navigateTo("/players");
  // }, 3000);
};
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar
        title="Create New Player"
        description="Create a new player account with auto-generated password"
      >
        <template #links>
          <UButton to="/players" variant="ghost" icon="i-heroicons-arrow-left">
            Back to Players
          </UButton>
        </template>
      </UDashboardNavbar>
    </template>
    <template #body>
      <AdminPlayerForm @success="handleSuccess" />
    </template>
  </UDashboardPanel>
</template>
