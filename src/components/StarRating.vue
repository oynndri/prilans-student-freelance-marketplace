<template>
  <div class="inline-flex items-center gap-1" :class="readonly ? '' : 'cursor-pointer'">
    <button
      v-for="star in 5"
      :key="star"
      type="button"
      :disabled="readonly"
      @click="setRating(star)"
      @mouseenter="hoverRating = star"
      @mouseleave="hoverRating = 0"
      class="p-0.5 transition-transform focus:outline-hidden disabled:cursor-default"
      :class="[!readonly && 'hover:scale-110 active:scale-95']"
      :title="`${star} star${star > 1 ? 's' : ''}`"
    >
      <Star
        :class="[sizeClass, isFilled(star) ? 'fill-amber-400 text-amber-400' : 'text-neutral-300 fill-transparent']"
        stroke-width="1.8"
      />
    </button>
    <span v-if="showScore" class="text-xs font-bold text-neutral-800 ml-1">
      {{ Number(modelValue || 0).toFixed(1) }}
    </span>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Star } from 'lucide-vue-next'

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0
  },
  readonly: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'md' // 'sm', 'md', 'lg'
  },
  showScore: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const hoverRating = ref(0)

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'w-3.5 h-3.5'
    case 'lg':
      return 'w-6 h-6'
    case 'md':
    default:
      return 'w-4 h-4'
  }
})

const isFilled = (star) => {
  if (!props.readonly && hoverRating.value > 0) {
    return star <= hoverRating.value
  }
  return star <= Math.round(props.modelValue)
}

const setRating = (star) => {
  if (props.readonly) return
  emit('update:modelValue', star)
  emit('change', star)
}
</script>
