<template>
  <div>
    <!-- Empty state if no projects match filters -->
    <div
      v-if="projects.length === 0"
      class="bg-white rounded-2xl p-10 border border-neutral-200/90 text-center py-16"
    >
      <div class="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-3 text-neutral-400">
        <Search class="w-6 h-6 stroke-[1.5]" />
      </div>
      <h4 class="text-[15px] font-bold text-neutral-900 mb-1">No matching projects found</h4>
      <p class="text-[13px] text-neutral-400 max-w-sm mx-auto mb-4">
        Try adjusting your search criteria, clearing some filters, or exploring other categories.
      </p>
      <button
        @click="$emit('reset-filters')"
        type="button"
        class="px-4 py-2 rounded-xl bg-neutral-900 text-white text-[12px] font-semibold hover:bg-black transition cursor-pointer"
      >
        Reset Filters
      </button>
    </div>

    <!-- Grid / List rendering -->
    <div
      v-else
      :class="[
        viewMode === 'grid'
          ? 'grid grid-cols-1 xl:grid-cols-2 gap-4'
          : 'flex flex-col gap-3'
      ]"
    >
      <ProjectCard
        v-for="project in projects"
        :key="project.id"
        :project="project"
        :is-applied="appliedProjectIds.includes(project.id)"
        @apply="$emit('apply', $event)"
      />
    </div>
  </div>
</template>

<script setup>
import { Search } from 'lucide-vue-next'
import ProjectCard from './ProjectCard.vue'

defineProps({
  projects: {
    type: Array,
    required: true
  },
  viewMode: {
    type: String,
    default: 'grid'
  },
  appliedProjectIds: {
    type: Array,
    default: () => []
  }
})

defineEmits(['apply', 'reset-filters'])
</script>
