<script setup lang="ts">
import type { NuxtError } from "#app";

const props = defineProps<{ error: NuxtError }>();
</script>

<template>
  <div>
    <h1>{{ JSON.stringify({ error: error.toJSON() }) }}</h1>
    <NuxtLink to="/">Go back home</NuxtLink>
  </div>
</template>
