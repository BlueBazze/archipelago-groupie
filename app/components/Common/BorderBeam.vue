<template>
  <!-- {{ JSON.stringify({ idle, idledFor, durationValue }) }} -->
  <div
    class="pointer-events-none absolute inset-0 rounded-[inherit] border border-transparent mask-[linear-gradient(transparent,transparent),linear-gradient(#000,#000)] mask-intersect [mask-clip:padding-box,border-box]"
    v-if="idle"
  >
    <div
      class="border-beam absolute aspect-square bg-linear-to-l from-(--color-from) via-(--color-to) to-transparent"
      :style="{
        width: `${size}px`,
        offsetPath: `rect(0 auto auto 0 round ${size}px)`,
        '--color-from': colorFrom,
        '--color-to': colorTo,
        '--duration': `${currentDuration}s`,
        '--initial-offset': `${initialOffset}%`,
        '--delay': `${-props.delay}s`,
        ...style,
      }"
      :class="{ reverse: reverse }"
    />
  </div>
</template>

<script lang="ts">
import type { CSSProperties, HTMLAttributes } from "vue";

interface BorderBeamProps {
  /**
   * The size of the border beam.
   */
  size?: number;

  /**
   * The delay of the border beam.
   */
  delay?: number;
  /**
   * The color of the border beam from.
   */
  colorFrom?: string;
  /**
   * The color of the border beam to.
   */
  colorTo?: string;
  /**
   * The class name of the border beam.
   */
  class?: HTMLAttributes["class"];
  /**
   * The style of the border beam.
   */
  style?: CSSProperties;
  /**
   * Whether to reverse the animation direction.
   */
  reverse?: boolean;
  /**
   * The initial offset position (0-100).
   */
  initialOffset?: number;
}
</script>

<script lang="ts" setup>
const props = withDefaults(defineProps<BorderBeamProps>(), {
  size: 50,
  delay: 0,
  colorFrom: "#ffaa40",
  colorTo: "#9c40ff",
  reverse: false,
  initialOffset: 0,
});

const { idle, lastActive } = useIdle(5 * 1000);
const now = useTimestamp({ interval: 1000 });

const idledFor = computed(() => {
  const active = Math.floor((now.value - lastActive.value) / 1000);
  return active > 0 ? active : 0;
});

const MIN_DURATION = 0.5;
const MAX_DURATION = 18;

// Compute duration based on idle time - directly as computed without separate ref
const currentDuration = computed(() => {
  const idleSecs = idledFor.value;
  // Use exponential decay: duration = MAX_DURATION * 2^(-idleSecs/10)
  const decay = Math.pow(2, -idleSecs / 10);
  const newDuration = Math.max(MIN_DURATION, MAX_DURATION * decay);
  console.log("duration:", newDuration, "idle for:", idleSecs, "seconds");
  return newDuration;
});
</script>

<style scoped>
@keyframes border-beam {
  from {
    offset-distance: var(--initial-offset);
  }
  to {
    offset-distance: calc(var(--initial-offset) + 100%);
  }
}

@keyframes border-beam-reverse {
  from {
    offset-distance: calc(100% - var(--initial-offset));
  }
  to {
    offset-distance: calc(-1 * var(--initial-offset));
  }
}

.border-beam {
  animation: border-beam var(--duration) linear infinite;
  animation-delay: var(--delay);
}

.border-beam.reverse {
  animation-name: border-beam-reverse;
}
</style>
