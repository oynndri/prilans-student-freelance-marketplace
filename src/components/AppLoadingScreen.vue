<template>
  <Transition name="fade">
    <div
      v-if="isLoading"
      class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#f8fafc] text-neutral-900 select-none"
      role="status"
      aria-live="polite"
      aria-label="Loading Prilans Marketplace"
    >
      <!-- Centered Branded Logo and Mark -->
      <div class="flex flex-col items-center">
        <!-- Logo Icon with smooth pulse/glow -->
        <div class="relative flex items-center justify-center mb-4 logo-animation">
          <div class="w-14 h-14 rounded-2xl bg-[#0f172a] text-white flex items-center justify-center shadow-lg shadow-black/10 relative overflow-hidden">
            <span class="text-2xl font-black tracking-tight">P</span>
            <!-- Shimmer effect across the icon -->
            <div class="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          </div>
          <!-- Subtle green accent indicator dot -->
          <span class="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#22c55e] border-2 border-[#f8fafc] animate-ping"></span>
          <span class="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#22c55e] border-2 border-[#f8fafc]"></span>
        </div>

        <!-- Brand Name -->
        <h1 class="text-2xl font-extrabold tracking-tight text-neutral-900 mb-1 flex items-center">
          Prilans<span class="text-[#22c55e]">.</span>
        </h1>
        <p class="text-xs text-neutral-400 font-medium tracking-wide uppercase mb-6">
          Student Freelance Marketplace
        </p>

        <!-- Elegant Animated Progress Bar -->
        <div class="w-48 h-1 bg-neutral-200/80 rounded-full overflow-hidden relative">
          <div class="progress-bar-fill h-full bg-[#0f172a] rounded-full"></div>
        </div>

        <p class="text-[11px] text-neutral-400 mt-3 font-normal">
          Connecting student talent with clients...
        </p>
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  isLoading: {
    type: Boolean,
    default: true
  }
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.98);
}

.logo-animation {
  animation: logoPulse 1.2s ease-in-out infinite alternate;
}

@keyframes logoPulse {
  0% {
    transform: scale(0.96);
  }
  100% {
    transform: scale(1.02);
  }
}

.progress-bar-fill {
  width: 100%;
  transform-origin: left;
  animation: progressFill 1.1s cubic-bezier(0.65, 0, 0.35, 1) forwards;
}

@keyframes progressFill {
  0% {
    transform: scaleX(0);
  }
  60% {
    transform: scaleX(0.7);
  }
  100% {
    transform: scaleX(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .fade-enter-active,
  .fade-leave-active,
  .logo-animation,
  .progress-bar-fill {
    animation: none !important;
    transition: none !important;
  }
}
</style>
