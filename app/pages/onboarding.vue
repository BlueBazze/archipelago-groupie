<script setup lang="ts">
definePageMeta({
  layout: "none",
});

const toast = useToast();
const router = useRouter();

// Check if onboarding is still needed
const { data: onboardingCheck } = await useFetch("/api/auth/check-onboarding");

// If admin already exists, redirect to login
if (!onboardingCheck.value?.needsOnboarding) {
  navigateTo("/login");
}

// Stepper items
const items = [
  {
    title: "Admin Account",
    description: "Create your admin account",
    slot: "admin-account",
  },
  {
    title: "Configuration",
    description: "Set up application settings",
    slot: "application-config",
  },
];

// Current step
const currentStep = ref(0);

// Store admin data from step 1
const adminData = ref<{ username: string; password: string } | null>(null);

// Handle step 1 completion
function handleAdminAccountComplete() {
  currentStep.value = 1;
}

// Handle final completion
async function handleConfigComplete() {
  // Redirect to main page
  navigateTo("/");
}
</script>

<template>
  <UContainer
    class="min-h-screen flex items-center justify-center flex-col py-12"
  >
    <!-- <div class="w-full max-w-md mx-auto"> -->
    <!-- Logo/Header -->
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold mb-2">Welcome to Archipelago Groupie</h1>
      <p class="text-muted">Let's get your application set up</p>
    </div>

    <!-- Onboarding Card -->

    <!-- Stepper -->
    <!-- <ClientOnly>
      <UStepper
        v-model="currentStep"
        :items="items"
        class="mb-6"
        linear
        disabled
      > -->
    <!-- Step 1: Admin Account -->
    <!-- <template #admin-account>
          <OnboardingAdminAccountStep @complete="handleAdminAccountComplete" />
        </template> -->

    <!-- Step 2: Application Configuration -->
    <!-- <template #application-config>
          <OnboardingApplicationConfigStep @complete="handleConfigComplete" />
        </template>
      </UStepper>
    </ClientOnly> -->

    <!-- Footer Info -->
    <p class="mt-6 text-center text-sm text-muted">
      This is a one-time setup. You'll be able to log in after this.
    </p>
  </UContainer>
</template>
