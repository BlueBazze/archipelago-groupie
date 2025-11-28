<script setup lang="ts">
definePageMeta({
  layout: "none",
});

const { loggedIn } = useUserSession();
const confetti = useConfetti();

// If already logged in, redirect to home
if (loggedIn.value) {
  navigateTo("/");
}

function randomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
const triggerFireworks = () => {
  const duration = 5 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
  const interval: NodeJS.Timeout = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    // since particles fall down, start a bit higher than random
    useConfetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
    });
    useConfetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
    });
  }, 250);
};

const triggerSnow = () => {
  const duration = 5000;
  const animationEnd = Date.now() + duration;
  let skew = 1;

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  function frame() {
    const timeLeft = animationEnd - Date.now();
    const ticks = Math.max(200, 500 * (timeLeft / duration));
    skew = Math.max(0.8, skew - 0.001);

    useConfetti({
      particleCount: 1,
      startVelocity: 0,
      ticks: ticks,
      origin: {
        x: Math.random(),
        // since particles fall down, skew start toward the top
        y: Math.random() * skew - 0.2,
      },
      colors: useColorMode().value === "dark" ? ["#ffffff"] : ["#000000"],
      shapes: ["circle"],
      gravity: randomInRange(0.4, 0.6),
      scalar: randomInRange(0.4, 1),
      drift: randomInRange(-0.4, 0.4),
    });

    if (timeLeft > 0) {
      requestAnimationFrame(frame);
    }
  }

  requestAnimationFrame(frame);
};
const triggerCanon = () => {
  const colors = ["#bb0000", "#0000ee"];
  const end = Date.now() + 5 * 1000;
  function frame() {
    useConfetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: colors,
    });
    useConfetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: colors,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }
  requestAnimationFrame(frame);
};
function onComplete() {
  triggerFireworks();
  triggerSnow();
  triggerCanon();

  navigateTo("/", { replace: true });
  // setTimeout(() => {
  // }, 8000);
}
</script>

<template>
  <UContainer class="min-h-screen flex items-center justify-center py-12">
    <div class="w-full max-w-md mx-auto">
      <!-- Logo/Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold mb-2">Archipelago Groupie</h1>
        <p class="text-muted">
          Create a player account to manage your game sessions
        </p>
      </div>

      <AuthSignupForm @complete="onComplete" />

      <!-- Footer Info -->
      <p class="mt-6 text-center text-sm text-muted">
        Coordinate and manage Archipelago game sessions with your group
      </p>
    </div>
  </UContainer>
</template>
