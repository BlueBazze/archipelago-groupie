<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent, AuthFormField, AuthFormProps } from "@nuxt/ui";

const toast = useToast();
const route = useRoute();
const { fetch: fetchUserSession } = useUserSession();
const { data: settings } = useFetch("/api/settings", { method: "GET" });

const allowPlayerSignup = computed(() => settings.value?.allowPlayerSignup);

const props = withDefaults(defineProps<AuthFormProps<Schema>>(), {
  submit: {
    // @ts-expect-error - label is a valid prop for ButtonProps
    label: "Sign In",
  },
});

const emit = defineEmits<{
  submit: [data: FormSubmitEvent<Schema>];
}>();

// Form fields
const fields = computed<AuthFormField[]>(() => [
  {
    name: "username",
    type: "text",
    label: "Username",
    placeholder: "Enter your username",
    required: true,
    defaultValue: (route.query.username as string) || "",
  },
  {
    name: "password",
    type: "password",
    label: "Password",
    placeholder: "Enter your password",
    required: true,
    defaultValue: (route.query.password as string) || "",
  },
]);

// Form schema
const schema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type Schema = z.output<typeof schema>;

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    await $fetch("/api/auth/login", {
      method: "POST",
      body: event.data,
    });
    toast.add({
      title: "Logged in successfully",
      color: "success",
    });
    const redirectPath = (route.query.redirect as string) || "/";

    await fetchUserSession();

    navigateTo(redirectPath);
  } catch (err: any) {
    toast.add({
      title: "Login failed",
      description: err.data?.message || err.message,
      color: "error",
    });
    throw err;
  }
}
</script>

<template>
  <UAuthForm
    v-bind="props"
    :schema="schema"
    :fields="fields"
    @submit="onSubmit"
  >
    <template #footer>
      <div v-if="allowPlayerSignup" class="text-center text-sm">
        <span class="text-muted">Self signup is enabled. Create a player?</span>
        <NuxtLink to="/signup" class="ml-1 font-medium"> Sign up </NuxtLink>
      </div>
    </template>
  </UAuthForm>
</template>
