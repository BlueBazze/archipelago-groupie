<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent, AuthFormField, AuthFormProps } from "@nuxt/ui";

const toast = useToast();
const authForm = useTemplateRef("authForm");
const props = withDefaults(defineProps<AuthFormProps<Schema>>(), {
  submit: {
    // @ts-expect-error - label is a valid prop for ButtonProps
    label: "Create Account",
  },
});

const emit = defineEmits<{
  complete: [success: boolean];
}>();

// Form fields
const fields: AuthFormField[] = [
  {
    name: "username",
    type: "text",
    label: "Username",
    placeholder: "Choose a username",
    required: true,
    hint: "At least 3 characters",
  },
  {
    name: "password",
    type: "password",
    label: "Password",
    placeholder: "Choose a password",
    required: true,
    hint: "At least 8 characters",
  },
  {
    name: "confirmPassword",
    type: "password",
    label: "Confirm Password",
    placeholder: "Confirm password",
    required: true,
  },
];

// Form schema
const schema = z
  .object({
    username: z.string().min(3, "Must be at least 3 characters"),
    password: z.string().min(8, "Must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type Schema = z.output<typeof schema>;

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    const response = await $fetch("/api/auth/signup", {
      method: "POST",
      body: event.data,
    });

    if (response.success) {
      emit("complete", true);
    }
  } catch (error: any) {
    toast.add({
      title: "Error",
      description: error.message,
      color: "error",
    });
  }
}

// Generate password function
function handleGeneratePassword() {
  // Try to set via UAuthForm setFieldValue if available
  const gen = generateSecurePassword();

  authForm.value!.state.password = gen;
  authForm.value!.state.confirmPassword = gen;
}
</script>

<template>
  <UAuthForm
    v-bind="props"
    ref="authForm"
    :schema="schema"
    :fields="fields"
    @submit="onSubmit"
  >
    <template #password-hint>
      <UButton
        size="xs"
        color="neutral"
        variant="ghost"
        icon="i-heroicons-sparkles"
        class="ml-2"
        @click="handleGeneratePassword"
      >
        Generate password
      </UButton>
    </template>
  </UAuthForm>
</template>
