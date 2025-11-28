<script setup lang="ts">
const randomLabelText = [
  "I told you not to click me!",
  "You will regret this!",
  "Why are you not listening to me?",
  "You might not want to do this...",
  "Final warning!",
  "You will be sorry if you click me again!",
];

const isOpen = ref(false);
const buttonClicks = ref(0);
const hasBeenOpened = ref(false);

const hasBeenClicked = ref(false);

const label = computed(() => {
  if (hasBeenOpened.value) {
    return "Told you!";
  }
  switch (buttonClicks.value) {
    case 0:
      return "Secret button, dont click me!";

    default:
      return randomLabelText[
        Math.floor(Math.random() * randomLabelText.length)
      ];
  }
});

watch(buttonClicks, (newVal) => {
  if (newVal > 4) {
    isOpen.value = true;
    hasBeenOpened.value = true;
  }
});

function onClick() {
  if (!hasBeenClicked.value) {
    hasBeenClicked.value = true;
  }

  if (hasBeenOpened.value) {
    hasBeenOpened.value = false;
  }
  buttonClicks.value++;
}

// Close modal when video ends
function onVideoEnded() {
  isOpen.value = false;
  buttonClicks.value = 0;
}
</script>

<template>
  <div>
    <UButton
      :label="label"
      @click="onClick"
      class="data-[hasBeenClicked='false']:opacity-3"
      :data-hasBeenClicked="hasBeenClicked"
    />
  </div>
  <UModal
    v-model:open="isOpen"
    fullscreen
    :ui="{ content: 'bg-black' }"
    :dismissible="false"
  >
    <template #content>
      <video
        src="/video/rick_grimes.mp4"
        autoplay
        class="flex-1"
        @ended="onVideoEnded"
      ></video>
    </template>
  </UModal>
</template>
