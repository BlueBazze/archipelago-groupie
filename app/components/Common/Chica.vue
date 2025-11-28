<script setup lang="ts">
const vids = [
  // "/video/chica.mp4",
  "/video/chica_again.mp4",
];

const imgs = [
  "/img/seal1.jpg",
  "/img/seal2.jpg",
  "/img/seal3.jpg",
]

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
  <div class="relative">
    
    <UButton
      @click="onClick"
      color="neutral"
      variant="ghost"
      class="w-full relative p-0"
    >
    <img :src="imgs[Math.floor(Math.random() * imgs.length)]" class="w-full h-full object-cover max-h-72">
    <div class="absolute top-0 left-0 right-0  bg-black">
      <span class="text-white text-2xl font-bold">Hot seals your area</span>
    </div>
  </img>
</UButton>

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
  </div>
</template>
