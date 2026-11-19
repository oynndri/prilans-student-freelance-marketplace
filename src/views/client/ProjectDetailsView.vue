<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- Top Back Navigation -->
    <div class="flex items-center justify-between">
      <router-link
        to="/client/projects"
        class="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition"
      >
        <ArrowLeft class="w-4 h-4" />
        <span>Back to All Projects</span>
      </router-link>

      <div class="flex items-center gap-2">
        <router-link
          v-if="project"
          :to="`/client/projects/${project.id}/edit`"
          class="px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-black transition shadow-xs"
        >
          Edit Project
        </router-link>
      </div>
    </div>

    <!-- Project Details Card -->
    <div v-if="project" class="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200/90 shadow-2xs space-y-6">
      <!-- Title & Status Header -->
      <div class="border-b border-neutral-100 pb-5 space-y-3">
        <div class="flex flex-wrap items-center gap-2">
          <span
            class="px-2.5 py-0.5 rounded-full text-xs font-semibold"
            :class="statusBadgeClass(project.status || 'Open')"
          >
            {{ project.status || 'Open' }}
          </span>
          <span class="text-xs text-neutral-400 font-medium">{{ project.category }}</span>
          <span class="text-xs text-neutral-300">•</span>
          <span class="text-xs text-neutral-400">Created {{ formatDate(project.createdAt) }}</span>
        </div>

        <h1 class="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight leading-snug">
          {{ project.title }}
        </h1>

        <div class="flex flex-wrap items-center gap-4 text-xs text-neutral-500 pt-1">
          <div class="flex items-center gap-1.5 font-bold text-neutral-900 text-sm">
            <span>{{ project.priceDisplay }}</span>
            <span class="text-xs font-normal text-neutral-400">({{ project.projectType }})</span>
          </div>
          <span>•</span>
          <div class="flex items-center gap-1">
            <MapPin class="w-3.5 h-3.5 text-neutral-400" />
            <span>{{ project.country || project.location || 'Remote' }}</span>
          </div>
          <span>•</span>
          <div class="flex items-center gap-1 text-[#16a34a] font-medium">
            <span class="w-1.5 h-1.5 rounded-full bg-[#16a34a]"></span>
            <span>{{ project.proposalCount || 0 }} student proposals</span>
          </div>
        </div>
      </div>

      <!-- Overview Stats Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-neutral-50/80 border border-neutral-200/60 text-xs">
        <div>
          <span class="text-neutral-400 block text-[11px]">Experience Level</span>
          <span class="font-bold text-neutral-800">{{ project.experienceLevel }}</span>
        </div>
        <div>
          <span class="text-neutral-400 block text-[11px]">Timeline / Deadline</span>
          <span class="font-bold text-neutral-800">{{ project.deadline || 'Flexible' }}</span>
        </div>
        <div>
          <span class="text-neutral-400 block text-[11px]">Positions</span>
          <span class="font-bold text-neutral-800">{{ project.positions || 1 }} Student(s)</span>
        </div>
        <div>
          <span class="text-neutral-400 block text-[11px]">Hiring Status</span>
          <span class="font-bold text-neutral-800">{{ project.hiringStatus || 'Still Selecting' }}</span>
        </div>
      </div>

      <!-- Description Section -->
      <div class="space-y-2">
        <h3 class="text-xs font-bold uppercase tracking-wider text-neutral-500">
          Project Brief & Description
        </h3>
        <p class="text-xs text-neutral-700 leading-relaxed whitespace-pre-line">
          {{ project.description }}
        </p>
      </div>

      <!-- Required Skills -->
      <div class="space-y-2">
        <h3 class="text-xs font-bold uppercase tracking-wider text-neutral-500">
          Required Skills ({{ (project.skills || []).length }})
        </h3>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="skill in project.skills"
            :key="skill"
            class="px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200/80 text-neutral-800 text-xs font-medium"
          >
            {{ skill }}
          </span>
        </div>
      </div>

      <!-- Additional Requirements -->
      <div v-if="project.additionalRequirements" class="space-y-2 pt-2 border-t border-neutral-100">
        <h3 class="text-xs font-bold uppercase tracking-wider text-neutral-500">
          Special Screening Requirements
        </h3>
        <p class="text-xs text-neutral-600 leading-relaxed">
          {{ project.additionalRequirements }}
        </p>
      </div>
    </div>

    <!-- Not Found state -->
    <div v-else class="bg-white rounded-2xl p-12 text-center text-xs text-neutral-400 border border-neutral-200">
      <p>Project not found or may have been deleted.</p>
      <router-link to="/client/projects" class="text-blue-600 underline mt-2 inline-block">
        Return to My Projects
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft, MapPin } from 'lucide-vue-next'
import { getProjectById } from '../../data/projectService'

const route = useRoute()

const project = computed(() => {
  return getProjectById(route.params.id)
})

const formatDate = (dateStr) => {
  if (!dateStr) return 'Recently'
  try {
    return new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
  } catch (e) {
    return 'Recently'
  }
}

const statusBadgeClass = (status) => {
  switch (status) {
    case 'Open':
      return 'bg-green-50 text-green-700 border border-green-200'
    case 'Draft':
      return 'bg-amber-50 text-amber-700 border border-amber-200'
    case 'Paused':
      return 'bg-neutral-100 text-neutral-600 border border-neutral-300'
    case 'Closed':
      return 'bg-red-50 text-red-600 border border-red-200'
    default:
      return 'bg-green-50 text-green-700 border border-green-200'
  }
}
</script>
