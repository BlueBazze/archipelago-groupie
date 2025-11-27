<script setup lang="ts">
definePageMeta({
  middleware: ["auth", "admin"],
});

const router = useRouter();

const handleSuccess = (result: any) => {
  // Show success message and redirect after a delay
  setTimeout(() => {
    router.push("/players");
  }, 3000);
};
</script>

<template>
  <UContainer class="max-w-2xl">
    <UPageHeader
      title="Create New Player"
      description="Create a new player account with auto-generated password"
      class="mb-8"
    >
      <template #links>
        <UButton
          to="/players"
          variant="ghost"
          icon="i-heroicons-arrow-left"
        >
          Back to Players
        </UButton>
      </template>
    </UPageHeader>

    <UCard>
      <PlayerForm @success="handleSuccess" />
    </UCard>
  </UContainer>
</template>

