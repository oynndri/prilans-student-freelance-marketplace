<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- Top Back Navigation -->
    <div class="flex items-center justify-between">
      <router-link
        to="/"
        class="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition"
      >
        <ArrowLeft class="w-4 h-4" />
        <span>Back to Projects</span>
      </router-link>

      <!-- Apply Now or Applied Button for Students -->
      <div v-if="!isClient && project">
        <span
          v-if="hasApplied"
          class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-100 text-neutral-500 font-semibold text-xs border border-neutral-200"
        >
          <CheckCircle2 class="w-4 h-4 text-[#16a34a]" />
          <span>Application Submitted</span>
        </span>
        <button
          v-else-if="canApply"
          @click="goToApply"
          class="px-6 py-2.5 rounded-xl bg-[#0f172a] hover:bg-black text-white text-xs font-semibold transition cursor-pointer shadow-xs active:scale-[0.98]"
        >
          Apply Now
        </button>
        <span
          v-else
          class="text-xs text-neutral-400 italic"
        >
          {{ (project.status && project.status !== 'Open') ? 'Project Closed to Applications' : '' }}
        </span>
      </div>
    </div>

    <!-- Main Project Info Card -->
    <div v-if="project" class="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200/90 shadow-2xs space-y-6">
      <!-- Title & Header Details -->
      <div class="border-b border-neutral-100 pb-5 space-y-3">
        <div class="flex flex-wrap items-center gap-2">
          <span
            class="px-2.5 py-0.5 rounded-full text-xs font-semibold"
            :class="statusBadgeClass(project.status || 'Open')"
          >
            {{ project.status || 'Open' }}
          </span>
          <span class="text-xs text-neutral-500 font-medium">{{ project.category }}</span>
          <span class="text-xs text-neutral-300">•</span>
          <span class="text-xs text-neutral-400">Posted {{ project.postedTime || 'Recently' }}</span>
        </div>

        <h1 class="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight leading-snug">
          {{ project.title }}
        </h1>

        <!-- Rates, Location, Verified Badges -->
        <div class="flex flex-wrap items-center gap-4 text-xs text-neutral-600 pt-1">
          <div class="flex items-center gap-1.5 font-bold text-neutral-900 text-sm">
            <div class="w-5 h-5 rounded-full bg-[#f3e8ff] flex items-center justify-center shrink-0">
              <DollarSign class="w-3 h-3 text-[#7c3aed] stroke-[2.5]" />
            </div>
            <span>{{ project.priceDisplay }}</span>
            <span class="text-xs font-normal text-neutral-400">({{ project.projectType }})</span>
          </div>
          <span>•</span>
          <div class="flex items-center gap-1">
            <CheckCircle2 class="w-3.5 h-3.5 text-blue-500 fill-blue-50" />
            <span>Verified Client</span>
          </div>
          <span>•</span>
          <div class="flex items-center gap-1">
            <MapPin class="w-3.5 h-3.5 text-neutral-400" />
            <span>{{ project.country || project.location || 'Remote' }}</span>
          </div>
          <span>•</span>
          <div class="flex items-center gap-1 text-[#16a34a] font-medium">
            <span class="w-1.5 h-1.5 rounded-full bg-[#16a34a]"></span>
            <span>{{ projectApplicationsCount }} Proposals</span>
          </div>
        </div>
      </div>

      <!-- Quick Specifications Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-neutral-50/80 border border-neutral-200/60 text-xs">
        <div>
          <span class="text-neutral-400 block text-[11px]">Experience Level</span>
          <span class="font-bold text-neutral-800">{{ project.experienceLevel }}</span>
        </div>
        <div>
          <span class="text-neutral-400 block text-[11px]">Deadline</span>
          <span class="font-bold text-neutral-800">{{ project.deadline || 'Flexible timeline' }}</span>
        </div>
        <div>
          <span class="text-neutral-400 block text-[11px]">Positions</span>
          <span class="font-bold text-neutral-800">{{ project.positions || 1 }} Student(s)</span>
        </div>
        <div>
          <span class="text-neutral-400 block text-[11px]">Hiring State</span>
          <span class="font-bold text-neutral-800">{{ project.hiringStatus || 'Still Selecting' }}</span>
        </div>
      </div>

      <!-- Project Scope Description -->
      <div class="space-y-2">
        <h3 class="text-xs font-bold uppercase tracking-wider text-neutral-500">
          Project Description & Scope
        </h3>
        <p class="text-xs sm:text-[13px] text-neutral-700 leading-relaxed whitespace-pre-line">
          {{ project.description }}
        </p>
      </div>

      <!-- Required Skills -->
      <div class="space-y-2">
        <h3 class="text-xs font-bold uppercase tracking-wider text-neutral-500">
          Required Skills & Qualifications
        </h3>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="skill in (project.skills || [])"
            :key="skill"
            class="px-3 py-1 text-xs font-medium text-neutral-700 rounded-full border border-neutral-200/90 bg-neutral-50"
          >
            {{ skill }}
          </span>
        </div>
      </div>

      <!-- Screening Questions / Additional Info -->
      <div v-if="project.additionalRequirements" class="space-y-2 pt-2 border-t border-neutral-100">
        <h3 class="text-xs font-bold uppercase tracking-wider text-neutral-500">
          Client Requirements
        </h3>
        <p class="text-xs text-neutral-600 leading-relaxed">
          {{ project.additionalRequirements }}
        </p>
      </div>

      <!-- Bottom Call-to-Action for Students -->
      <div v-if="!isClient" class="pt-6 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-neutral-50/50 p-4 rounded-xl border border-neutral-200/60">
        <div>
          <h4 class="text-xs font-bold text-neutral-900">Interested in working on this project?</h4>
          <p class="text-[11px] text-neutral-500">Submit your rate, timeframe, and custom proposal to the client.</p>
        </div>
        <div class="shrink-0">
          <button
            v-if="hasApplied"
            disabled
            class="px-5 py-2.5 rounded-xl bg-neutral-200 text-neutral-500 text-xs font-semibold cursor-not-allowed"
          >
            Already Applied
          </button>
          <button
            v-else-if="canApply"
            @click="goToApply"
            class="px-6 py-2.5 rounded-xl bg-[#0f172a] hover:bg-black text-white text-xs font-semibold transition cursor-pointer shadow-xs active:scale-[0.98]"
          >
            Apply for this Project
          </button>
        </div>
      </div>
    </div>

    <!-- Not found state -->
    <div v-else class="bg-white rounded-2xl p-12 text-center text-xs text-neutral-400 border border-neutral-200">
      <p>Project details could not be found.</p>
      <router-link to="/" class="text-blue-600 underline mt-2 inline-block">
        Return to Find Projects
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ArrowLeft,
  DollarSign,
  MapPin,
  CheckCircle2
} from 'lucide-vue-next'
import { authState, isClient } from '../data/auth'
import { getProjectById } from '../data/projectService'
import { hasStudentApplied, getApplicationsByProject } from '../data/applicationService'

const route = useRoute()
const router = useRouter()

const project = computed(() => getProjectById(route.params.id))

const studentId = computed(() => authState.currentUser?.id || 'student-akmal')

const hasApplied = computed(() => {
  if (!project.value) return false
  return hasStudentApplied(project.value.id, studentId.value)
})

const canApply = computed(() => {
  if (!project.value) return false
  const status = project.value.status || 'Open'
  return status === 'Open'
})

const projectApplicationsCount = computed(() => {
  if (!project.value) return 0
  const realApps = getApplicationsByProject(project.value.id).length
  return Math.max(project.value.proposalCount || 0, realApps)
})

const goToApply = () => {
  router.push(`/projects/${project.value.id}/apply`)
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
