<script setup lang="ts">
definePageMeta({
  layout: "none",
});

const toast = useToast();
const router = useRouter();
const { loggedIn, fetch: fetchSession } = useUserSession();

// If already logged in, redirect to home
if (loggedIn.value) {
  navigateTo("/");
}

// Check if signup is allowed
const signupDisabled = ref(false);
const loading = ref(false);

// Handle form submission
async function handleSubmit(data: { username: string; password: string }) {
  loading.value = true;

  try {
    const response = await $fetch("/api/auth/signup", {
      method: "POST",
      body: {
        username: data.username,
        password: data.password,
      },
    });

    if (response.success) {
      toast.add({
        title: "Account Created!",
        description: "Welcome to Archipelago Groupie",
        color: "success",
      });

      // Fetch session to update state
      await fetchSession();

      // Redirect to main page
      await router.push("/");
    }
  } catch (err: any) {
    // If signup is disabled, show that info
    if (err.statusCode === 403) {
      signupDisabled.value = true;
    }

    toast.add({
      title: "Signup Failed",
      description: err.data?.message || "Failed to create account",
      color: "error",
    });
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <UContainer class="min-h-screen flex items-center justify-center py-12">
    <div class="w-full max-w-md mx-auto">
      <!-- Logo/Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold mb-2">Archipelago Groupie</h1>
        <p class="text-muted">Create your player account</p>
      </div>

      <!-- Signup Disabled Alert -->
      <UAlert
        v-if="signupDisabled"
        color="warning"
        variant="soft"
        icon="i-heroicons-exclamation-triangle"
        title="Signup Disabled"
        description="Player self-signup is currently disabled. Please contact your admin for an account."
        class="mb-6"
      />

      <!-- Signup Card -->
      <UCard :class="{ 'opacity-50': signupDisabled }">
        <template #header>
          <div class="flex items-center gap-3">
            <UIcon name="i-heroicons-user-plus" class="size-6" />
            <h2 class="text-xl font-semibold">Create Account</h2>
          </div>
        </template>

        <AuthRegisterForm
          :loading="loading || signupDisabled"
          @submit="handleSubmit"
        />

        <template #footer>
          <div class="text-center text-sm">
            <span class="text-muted">Already have an account?</span>
            <NuxtLink to="/login" class="ml-1 font-medium"> Sign in </NuxtLink>
          </div>
        </template>
      </UCard>

      <!-- Footer Info -->
      <p class="mt-6 text-center text-sm text-muted">
        Join your group's Archipelago game session
      </p>
    </div>
  </UContainer>
</template>
