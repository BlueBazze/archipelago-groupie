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

const loading = ref(false);

// Handle form submission
async function handleSubmit(data: { username: string; password: string }) {
  loading.value = true;

  try {
    const response = await $fetch("/api/auth/login", {
      method: "POST",
      body: {
        username: data.username,
        password: data.password,
      },
    });

    if (response.success) {
      toast.add({
        title: "Welcome back!",
        description: `Logged in as ${response.user.username}`,
        color: "success",
      });

      // Fetch session to update state
      await fetchSession();

      // Redirect to home page
      await router.push("/");
    }
  } catch (err: any) {
    toast.add({
      title: "Login Failed",
      description: err.data?.message || "Invalid username or password",
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
        <p class="text-muted">Sign in to manage your game sessions</p>
      </div>

      <AuthLoginForm :loading="loading" />

      <!-- <template #footer>
        <div class="text-center text-sm">
          <span class="text-muted">Don't have an account?</span>
          <NuxtLink to="/signup" class="ml-1 font-medium"> Sign up </NuxtLink>
        </div>
      </template> -->

      <!-- Footer Info -->
      <p class="mt-6 text-center text-sm text-muted">
        Coordinate and manage Archipelago game sessions with your group
      </p>
    </div>
  </UContainer>
</template>
