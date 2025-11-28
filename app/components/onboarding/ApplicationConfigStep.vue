<script setup lang="ts">
const emit = defineEmits<{
  complete: [];
}>();
</script>

<template>
  <AdminSettingsForm @complete="emit('complete')" />
</template>
