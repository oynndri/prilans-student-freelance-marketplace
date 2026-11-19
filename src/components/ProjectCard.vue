<template>
  <div
    class="glass-card rounded-2xl p-5 flex flex-col justify-between group relative"
  >
    <!-- Top Metadata: Experience level, posted time, and more options -->
    <div>
      <div class="flex items-center justify-between text-[11px] text-slate-400 font-normal mb-2">
        <span class="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300">
          {{ project.experienceLevel }}
        </span>
        <div class="flex items-center gap-2">
          <span>{{ project.postedTime || 'Recently' }}</span>
          <div class="relative" ref="cardMenuRef">
            <button
              type="button"
              @click.stop="isMenuOpen = !isMenuOpen"
              class="p-1 -mr-1 rounded-md hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <MoreVertical class="w-3.5 h-3.5" />
            </button>

            <!-- Card context menu -->
            <div
              v-if="isMenuOpen"
              class="absolute right-0 top-full mt-1 glass-dropdown rounded-xl py-1 z-30 min-w-[140px] text-[12px]"
            >
              <router-link
                :to="`/projects/${project.id}`"
                class="block w-full text-left px-3 py-1.5 hover:bg-white/10 text-slate-200 hover:text-white"
              >
                View Full Details
              </router-link>
              <button
                @click="isMenuOpen = false"
                type="button"
                class="w-full text-left px-3 py-1.5 hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer"
              >
                Save Project
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Project Title -->
      <h3 class="text-[16px] font-bold text-white tracking-tight leading-snug mb-2 group-hover:text-indigo-400 transition-colors">
        <router-link :to="`/projects/${project.id}`" class="hover:underline">
          {{ project.title }}
        </router-link>
      </h3>

      <!-- Badges: Verified, Country, Hiring status -->
      <div class="flex flex-wrap items-center gap-3 text-[11px] font-medium text-slate-400 mb-3">
        <!-- Verified badge -->
        <div class="flex items-center gap-1 text-emerald-400">
          <CheckCircle2 class="w-3.5 h-3.5" />
          <span>Verified Client</span>
        </div>

        <!-- Country with Pin -->
        <div class="flex items-center gap-1 text-slate-400">
          <MapPin class="w-3.5 h-3.5" />
          <span>{{ project.country || project.location || 'Remote' }}</span>
        </div>

        <!-- Hiring Status indicator -->
        <div class="flex items-center gap-1">
          <span
            v-if="project.hiringType === 'selecting' || !project.hiringType"
            class="inline-flex items-center gap-1 text-emerald-400 font-medium"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            {{ project.hiringStatus || 'Still Selecting' }}
          </span>
          <span
            v-else
            class="inline-flex items-center gap-1 text-amber-400 font-medium"
          >
            <UserCheck class="w-3.5 h-3.5 text-amber-400" />
            {{ project.hiringStatus }}
          </span>
        </div>
      </div>

      <!-- Short Project Description -->
      <p class="text-[12px] text-slate-300 leading-relaxed font-normal mb-4 line-clamp-2">
        {{ project.description }}
      </p>

      <!-- Skill Pills -->
      <div class="flex flex-wrap gap-1.5 mb-5">
        <span
          v-for="skill in project.skills"
          :key="skill"
          class="px-2.5 py-1 text-[11px] font-medium text-indigo-300 rounded-lg border border-indigo-500/20 bg-indigo-500/10 hover:bg-indigo-500/20 transition select-none"
        >
          {{ skill }}
        </span>
      </div>
    </div>

    <!-- Bottom Footer: Price, Proposals & Apply Button -->
    <div class="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
      <!-- Price & Proposal count with glow accents -->
      <div class="flex items-center gap-3.5 text-[12px] font-semibold text-white">
        <!-- Dollar Icon -->
        <div class="flex items-center gap-1.5">
          <div class="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
            <DollarSign class="w-3 h-3 text-emerald-400 stroke-[2.5]" />
          </div>
          <span class="font-bold">{{ project.priceDisplay }}</span>
        </div>

        <!-- Proposal/Doc Icon -->
        <div class="flex items-center gap-1.5 font-normal text-slate-400">
          <div class="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
            <FileText class="w-3 h-3 text-indigo-400 stroke-[2]" />
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
        class="px-4 py-2 rounded-xl text-[12px] font-bold transition shrink-0 cursor-pointer active:scale-[0.98]"
        :class="[
          hasApplied
            ? 'bg-white/10 text-slate-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-lg shadow-emerald-500/20'
        ]"
      >
        {{ hasApplied ? 'Applied' : 'Apply Now' }}
      </button>

      <!-- Client Owner indicator -->
      <router-link
        v-else
        :to="`/client/projects/${project.id}/applicants`"
        class="px-3.5 py-1.5 rounded-xl text-[11px] font-bold bg-white/10 hover:bg-white/20 text-white transition border border-white/10"
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
