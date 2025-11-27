<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent, AuthFormField, AuthFormProps } from "@nuxt/ui";

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
const fields: AuthFormField[] = [
  {
    name: "username",
    type: "text",
    label: "Username",
    placeholder: "Enter your username",
    required: true,
  },
  {
    name: "password",
    type: "password",
    label: "Password",
    placeholder: "Enter your password",
    required: true,
  },
];

// Form schema
const schema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type Schema = z.output<typeof schema>;
</script>

<template>
  <UAuthForm
    v-bind="props"
    :schema="schema"
    :fields="fields"
    @submit="emit('submit', $event.data)"
  >
  </UAuthForm>
</template>
