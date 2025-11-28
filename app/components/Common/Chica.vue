<script setup lang="ts">
const vids = [
  // "/video/chica.mp4",
  "/video/chica_again.mp4",
];

const isOpen = ref(false);
const hasBeenOpened = ref(false);
const src = ref(vids[Math.floor(Math.random() * vids.length)]);

const label = computed(() => {
  return "Click me for a good time";
});

function onClick() {
  src.value = vids[Math.floor(Math.random() * vids.length)];
  isOpen.value = true;
}

// Close modal when video ends
function onVideoEnded() {
  isOpen.value = false;
}
</script>

<template>
  <UButton
    :label="label"
    @click="onClick"
    color="neutral"
    variant="ghost"
    class="w-full"
  />
  <UModal
    v-model:open="isOpen"
    fullscreen
    :ui="{ content: 'bg-black' }"
    :dismissible="false"
  >
    <template #content>
      <video :src autoplay class="flex-1" @ended="onVideoEnded"></video>
    </template>
  </UModal>
</template>
