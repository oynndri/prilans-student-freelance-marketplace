<template>
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
    <!-- Left: Showing Results (Count) and Sort by Dropdown -->
    <div class="flex flex-wrap items-center gap-4">
      <div class="text-[15px] font-bold text-neutral-900 tracking-tight flex items-center gap-1.5">
        <span>Showing Results</span>
        <span class="text-neutral-400 font-medium text-[13px]">({{ countText }})</span>
      </div>

      <!-- Sorting dropdown -->
      <div class="relative" ref="sortDropdownRef">
        <button
          type="button"
          @click="isSortOpen = !isSortOpen"
          class="flex items-center gap-1.5 text-[12px] font-semibold text-neutral-700 hover:text-neutral-900 cursor-pointer select-none"
        >
          <span class="text-neutral-400 font-normal">Sort by:</span>
          <span>{{ currentSortLabel }}</span>
          <ChevronDown class="w-3.5 h-3.5 text-neutral-400 transition-transform" :class="{ 'rotate-180': isSortOpen }" />
        </button>

        <div
          v-if="isSortOpen"
          class="absolute left-0 top-full mt-1.5 bg-white rounded-xl shadow-lg border border-neutral-200 py-1 z-30 min-w-[140px] text-[12px]"
        >
          <button
            v-for="opt in sortOptions"
            :key="opt.id"
            type="button"
            @click="selectSort(opt.id)"
            class="w-full text-left px-3 py-1.5 hover:bg-neutral-50 flex items-center justify-between"
            :class="sortBy === opt.id ? 'font-semibold text-neutral-900 bg-neutral-50' : 'text-neutral-600'"
          >
            <span>{{ opt.label }}</span>
            <Check v-if="sortBy === opt.id" class="w-3 h-3 text-green-600" />
          </button>
        </div>
      </div>
    </div>

    <!-- Right: List / Grid Layout Switcher -->
    <div class="flex items-center bg-white p-1 rounded-xl border border-neutral-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] self-end sm:self-auto">
      <button
        type="button"
        @click="$emit('update:viewMode', 'list')"
        class="p-1.5 rounded-lg transition cursor-pointer"
        :class="viewMode === 'list' ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-400 hover:text-neutral-700'"
        title="List view"
      >
        <List class="w-4 h-4 stroke-[2]" />
      </button>
      <button
        type="button"
        @click="$emit('update:viewMode', 'grid')"
        class="p-1.5 rounded-lg transition cursor-pointer"
        :class="viewMode === 'grid' ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-400 hover:text-neutral-700'"
        title="Grid view"
      >
        <LayoutGrid class="w-4 h-4 stroke-[2]" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ChevronDown, List, LayoutGrid, Check } from 'lucide-vue-next'

const props = defineProps({
  count: {
    type: Number,
    default: 2450
  },
  sortBy: {
    type: String,
    default: 'newest'
  },
  viewMode: {
    type: String,
    default: 'grid'
  }
})

const emit = defineEmits(['update:sortBy', 'update:viewMode'])

const sortOptions = [
  { id: 'newest', label: 'Newest' },
  { id: 'oldest', label: 'Oldest' },
  { id: 'lowest-budget', label: 'Lowest Budget' },
  { id: 'highest-budget', label: 'Highest Budget' }
]

const currentSortLabel = computed(() => {
  const found = sortOptions.find(o => o.id === props.sortBy)
  return found ? found.label : 'Newest'
})

const countText = computed(() => {
  return props.count.toLocaleString()
})

const isSortOpen = ref(false)
const sortDropdownRef = ref(null)

const selectSort = (id) => {
  emit('update:sortBy', id)
  isSortOpen.value = false
}

const handleClickOutside = (e) => {
  if (sortDropdownRef.value && !sortDropdownRef.value.contains(e.target)) {
    isSortOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside)
})
</script>
