<template>
  <div class="space-y-2">
    <div v-if="title" class="text-[12px] font-bold text-neutral-900 tracking-tight">
      {{ title }}
    </div>
    <div>
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  }
})
</script>
