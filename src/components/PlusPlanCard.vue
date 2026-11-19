<template>
  <div class="relative bg-white rounded-2xl p-4 border border-neutral-150/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden">
    <!-- Subtle graph paper/grid pattern in the background matching reference -->
    <div
      class="absolute right-0 top-0 w-24 h-24 pointer-events-none opacity-[0.25]"
      style="background-image: radial-gradient(#22c55e 1px, transparent 1px), linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px); background-size: 14px 14px;"
    ></div>

    <div class="relative z-10">
      <!-- Green Icon with Rocket/Spark -->
      <div class="w-8 h-8 rounded-xl bg-[#22c55e] flex items-center justify-center text-white shadow-sm mb-3">
        <Rocket class="w-4 h-4 fill-white" />
      </div>

      <h4 class="text-[13px] font-bold text-neutral-900 tracking-tight mb-1">
        Plus Plan
      </h4>

      <p class="text-[11px] leading-relaxed text-neutral-400 mb-3 font-normal">
        Get exclusive access to the Freelancer Plus group and competitor bids for any projects.
      </p>

      <a
        href="#upgrade"
        @click.prevent="$emit('upgrade')"
        class="inline-flex items-center gap-1.5 text-[12px] font-bold text-neutral-900 hover:text-black group cursor-pointer"
      >
        <span>Upgrade Now</span>
        <ArrowRight class="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 text-neutral-900" />
      </a>
    </div>
  </div>
</template>

<script setup>
import { Rocket, ArrowRight } from 'lucide-vue-next'

defineEmits(['upgrade'])
</script>
