<script setup lang="ts">
import type { ButtonProps } from "@nuxt/ui";

const props = withDefaults(defineProps<{ buttonProps?: ButtonProps }>(), {
  buttonProps: {
    // @ts-expect-error - label is a valid prop for ButtonProps
    label: "Delete",
    color: "error",
    variant: "soft",
    size: "sm",
    icon: "i-heroicons-trash",
  },
});
const emits = defineEmits<{
  confirm: [];
}>();

const randomLabelText = [
  "Really, really?",
  "No take-backs!",
  "Final answer?",
  "You monster!",
  "Think of the children!",
  "Last chance!",
  "🔥 OBLITERATE 🔥",
  "Make it so!",
  "FUCK YES!",
  "I'm not sure...",
  "Are you sure?",
  "42",
  "I swear I'm not a robot!",
  "WHY ARE YOU DOING THIS?",
  "I wonder if you'll regret this...",
  "This is a test, please confirm.",
  "If you're sure, click here.",
  "If i'm not mistaken, you're about to delete this item.",
  "I wonder what would happen if you deleted this item.",
  "You are evaluating this decision very carefully.",
  "You are making a very important decision.",
  "You are my bitch!",
];

const confirmButtonPressed = ref(0);
const ConfirmLabelText = computed(() => {
  switch (confirmButtonPressed.value) {
    case 0:
      return "Yes";
    case 1:
      return "Yes, delete it";
    case 10:
      return "You have achieved true deletion.";

    default:
      return randomLabelText[
        Math.floor(Math.random() * randomLabelText.length)
      ];
  }
});

function onConfirmButtonClick() {
  confirmButtonPressed.value++;
}

const hasEmitted = ref(false);

watch(confirmButtonPressed, (newVal) => {
  if (newVal > 10 && !hasEmitted.value) {
    emits("confirm");
    hasEmitted.value = true;
  }
});
</script>

<template>
  <UPopover>
    <UButton v-bind="buttonProps" />
    <template #content>
      <UContainer class="flex flex-col gap-2 p-4">
        <span>Are you sure you want to delete this item?</span>
        <UButton :label="ConfirmLabelText" @click="onConfirmButtonClick" />
      </UContainer>
    </template>
  </UPopover>
</template>
