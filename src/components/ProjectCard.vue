<template>
  <div
    class="bg-white rounded-2xl p-5 border border-neutral-200/90 shadow-[0_1px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:border-neutral-300 transition group relative"
  >
    <!-- Top Metadata: Experience level, posted time, and more options -->
    <div>
      <div class="flex items-center justify-between text-[11px] text-neutral-400 font-normal mb-2">
        <span class="font-normal text-neutral-400">
          {{ project.experienceLevel }}
        </span>
        <div class="flex items-center gap-2">
          <span>{{ project.postedTime || 'Recently' }}</span>
          <div class="relative" ref="cardMenuRef">
            <button
              type="button"
              @click.stop="isMenuOpen = !isMenuOpen"
              class="p-1 -mr-1 rounded-md hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition cursor-pointer"
            >
              <MoreVertical class="w-3.5 h-3.5" />
            </button>

            <!-- Card context menu -->
            <div
              v-if="isMenuOpen"
              class="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-neutral-200 py-1 z-30 min-w-[130px] text-[12px]"
            >
              <router-link
                :to="`/projects/${project.id}`"
                class="block w-full text-left px-3 py-1.5 hover:bg-neutral-50 text-neutral-700"
              >
                View Full Details
              </router-link>
              <button
                @click="isMenuOpen = false"
                type="button"
                class="w-full text-left px-3 py-1.5 hover:bg-neutral-50 text-neutral-700 cursor-pointer"
              >
                Save Project
              </button>
              <button
                @click="isMenuOpen = false"
                type="button"
                class="w-full text-left px-3 py-1.5 hover:bg-neutral-50 text-neutral-500 cursor-pointer"
              >
                Share Link
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Project Title -->
      <h3 class="text-[15px] font-bold text-neutral-900 tracking-tight leading-snug mb-2 group-hover:text-neutral-950">
        <router-link :to="`/projects/${project.id}`" class="hover:underline">
          {{ project.title }}
        </router-link>
      </h3>

      <!-- Badges: Verified, Country, Hiring status -->
      <div class="flex flex-wrap items-center gap-3 text-[11px] font-medium text-neutral-500 mb-3">
        <!-- Verified badge with blue check circle -->
        <div class="flex items-center gap-1 text-neutral-600">
          <CheckCircle2 class="w-3.5 h-3.5 text-blue-500 fill-blue-50" />
          <span>Verified</span>
        </div>

        <!-- Country with Pin -->
        <div class="flex items-center gap-1 text-neutral-600">
          <MapPin class="w-3.5 h-3.5 text-neutral-400" />
          <span>{{ project.country || project.location || 'Remote' }}</span>
        </div>

        <!-- Hiring Status indicator (Green for Still Selecting, Subtle orange for 1 hired) -->
        <div class="flex items-center gap-1">
          <span
            v-if="project.hiringType === 'selecting' || !project.hiringType"
            class="inline-flex items-center gap-1 text-[#16a34a] font-medium"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-[#16a34a]"></span>
            {{ project.hiringStatus || 'Still Selecting' }}
          </span>
          <span
            v-else
            class="inline-flex items-center gap-1 text-amber-600 font-medium"
          >
            <UserCheck class="w-3.5 h-3.5 text-amber-500" />
            {{ project.hiringStatus }}
          </span>
        </div>
      </div>

      <!-- Short Project Description -->
      <p class="text-[12px] text-neutral-500 leading-relaxed font-normal mb-4 line-clamp-2">
        {{ project.description }}
      </p>

      <!-- Skill Pills (outlined rounded pills matching reference) -->
      <div class="flex flex-wrap gap-1.5 mb-5">
        <span
          v-for="skill in project.skills"
          :key="skill"
          class="px-2.5 py-1 text-[11px] font-medium text-neutral-600 rounded-full border border-neutral-200/90 bg-neutral-50/50 hover:bg-neutral-100 transition select-none"
        >
          {{ skill }}
        </span>
      </div>
    </div>

    <!-- Bottom Footer: Price, Proposals & Apply Button -->
    <div class="pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
      <!-- Price & Proposal count with violet icons -->
      <div class="flex items-center gap-3.5 text-[12px] font-semibold text-neutral-800">
        <!-- Violet Dollar Icon -->
        <div class="flex items-center gap-1.5">
          <div class="w-5 h-5 rounded-full bg-[#f3e8ff] flex items-center justify-center shrink-0">
            <DollarSign class="w-3 h-3 text-[#7c3aed] stroke-[2.5]" />
          </div>
          <span>{{ project.priceDisplay }}</span>
        </div>

        <!-- Violet Proposal/Doc Icon -->
        <div class="flex items-center gap-1.5 font-normal text-neutral-500">
          <div class="w-5 h-5 rounded-full bg-[#f3e8ff] flex items-center justify-center shrink-0">
            <FileText class="w-3 h-3 text-[#7c3aed] stroke-[2]" />
          </div>
          <span>{{ liveProposalsCount }} proposals</span>
        </div>
      </div>

      <!-- Action Button: Apply Now or Applied -->
      <button
        v-if="!isClient"
        type="button"
        @click="handleApplyClick"
        :disabled="hasApplied"
        class="px-4 py-2 rounded-xl text-[12px] font-semibold transition shrink-0 cursor-pointer active:scale-[0.98]"
        :class="[
          hasApplied
            ? 'bg-[#cbd5e1] text-white cursor-not-allowed'
            : 'bg-[#0f172a] text-white hover:bg-black shadow-xs'
        ]"
      >
        {{ hasApplied ? 'Applied' : 'Apply Now' }}
      </button>

      <!-- Client Owner indicator -->
      <router-link
        v-else
        :to="`/client/projects/${project.id}/applicants`"
        class="px-3 py-1.5 rounded-xl text-[11px] font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition"
      >
        View Applicants
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  MoreVertical,
  CheckCircle2,
  MapPin,
  DollarSign,
  FileText,
  UserCheck
} from 'lucide-vue-next'
import { authState, isClient } from '../data/auth'
import { hasStudentApplied, getApplicationsByProject } from '../data/applicationService'

const props = defineProps({
  project: {
    type: Object,
    required: true
  },
  isApplied: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['apply'])
const router = useRouter()

const isMenuOpen = ref(false)
const cardMenuRef = ref(null)

const studentId = computed(() => authState.currentUser?.id || 'student-akmal')

const hasApplied = computed(() => {
  return props.isApplied || hasStudentApplied(props.project.id, studentId.value)
})

const liveProposalsCount = computed(() => {
  const realCount = getApplicationsByProject(props.project.id).length
  return Math.max(props.project.proposalCount || 0, realCount)
})

const handleApplyClick = () => {
  if (hasApplied.value) return
  // Navigate directly to the Phase 03 dedicated application submission screen
  router.push(`/projects/${props.project.id}/apply`)
  emit('apply', props.project.id)
}

const handleClickOutside = (e) => {
  if (cardMenuRef.value && !cardMenuRef.value.contains(e.target)) {
    isMenuOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside)
})
</script>
