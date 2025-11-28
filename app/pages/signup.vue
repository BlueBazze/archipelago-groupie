<script setup lang="ts">
definePageMeta({
  layout: "none",
});

const { loggedIn } = useUserSession();

// If already logged in, redirect to home
if (loggedIn.value) {
  navigateTo("/");
}
</script>

<template>
  <UContainer class="min-h-screen flex items-center justify-center py-12">
    <div class="w-full max-w-md mx-auto">
      <!-- Logo/Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold mb-2">Archipelago Groupie</h1>
        <p class="text-muted">
          Create a player account to manage your game sessions
        </p>
      </div>

      <AuthSignupForm />

      <!-- Footer Info -->
      <p class="mt-6 text-center text-sm text-muted">
        Coordinate and manage Archipelago game sessions with your group
      </p>
    </div>
  </UContainer>
</template>
