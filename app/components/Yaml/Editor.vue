<script setup lang="ts">
const yamlContent = defineModel<string>({ required: true });

interface Props {
  loading?: boolean;
  showSaveButton?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  showSaveButton: true,
});

const emit = defineEmits<{
  save: [];
}>();

// Draft content (what user is editing)
const draftContent = ref("");
const showDiff = ref(false);

// Initialize draft from model value
watch(
  () => yamlContent.value,
  (newContent) => {
    if (!showDiff.value) {
      draftContent.value = newContent;
    }
  },
  { immediate: true }
);

const hasChanges = computed(() => draftContent.value !== yamlContent.value);

const handleSaveClick = () => {
  if (!hasChanges.value) {
    return;
  }

  // Show diff editor
  showDiff.value = true;
};

const confirmSave = () => {
  // Apply changes
  yamlContent.value = draftContent.value;
  showDiff.value = false;
  emit("save");
};

const cancelSave = () => {
  // Just go back to editing, keep changes
  showDiff.value = false;
};
</script>

<template>
  <!-- Action Buttons -->
  <div
    v-if="showSaveButton && (showDiff || hasChanges)"
    class="flex justify-end gap-2 mb-4"
  >
    <UButton
      v-if="showDiff"
      variant="ghost"
      @click="cancelSave"
      :disabled="loading"
    >
      Cancel
    </UButton>
    <UButton
      v-if="showDiff"
      color="primary"
      :loading="loading"
      :disabled="loading"
      size="lg"
      icon="i-heroicons-check"
      @click="confirmSave"
    >
      Confirm & Save
    </UButton>
    <UButton
      v-else
      :loading="loading"
      :disabled="loading"
      size="lg"
      icon="i-heroicons-check"
      @click="handleSaveClick"
    >
      Save Changes
    </UButton>
  </div>

  <!-- Diff Editor (shown when confirming) -->
  <MonacoDiffEditor
    v-if="showDiff"
    :original="yamlContent"
    v-model="draftContent"
    lang="yaml"
    :style="{ height: '600px' }"
    :options="{
      readOnly: false,
      renderSideBySide: true,
      originalEditable: false,
    }"
  />

  <!-- Normal Monaco Editor (shown when editing) -->
  <MonacoEditor
    v-else
    v-model="draftContent"
    lang="yaml"
    :style="{ height: '600px' }"
    :options="{
      minimap: { enabled: false },
      lineNumbers: 'on',
      wordWrap: 'on',
      tabSize: 2,
      insertSpaces: true,
    }"
  />

  <p
    v-if="showSaveButton && hasChanges && !showDiff"
    class="text-sm opacity-75 mt-4"
  >
    You have unsaved changes
  </p>
</template>
