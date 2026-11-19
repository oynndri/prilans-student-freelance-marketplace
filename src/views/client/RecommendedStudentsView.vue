<template>
  <div class="space-y-6">
    <!-- Top Back Navigation -->
    <div>
      <router-link
        to="/client/projects"
        class="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition mb-2"
      >
        <ArrowLeft class="w-4 h-4" />
        <span>Back to My Projects</span>
      </router-link>
    </div>

    <!-- Permission Check: Check if Client owns this project -->
    <div
      v-if="!isProjectOwner"
      class="bg-red-50 rounded-2xl p-8 border border-red-200 text-center space-y-3"
    >
      <ShieldAlert class="w-10 h-10 text-red-500 mx-auto" />
      <h2 class="text-base font-extrabold text-neutral-900">Access Restricted</h2>
      <p class="text-xs text-neutral-600 max-w-md mx-auto">
        Only the client organization that published this project may access candidate recommendations.
      </p>
      <router-link
        to="/client/projects"
        class="inline-block px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-bold"
      >
        Return to My Projects
      </router-link>
    </div>

    <template v-else-if="project">
      <!-- Hero Banner with Project Info & Match Meta -->
      <div class="bg-gradient-to-r from-slate-900 via-neutral-900 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-sm">
        <div class="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div class="relative z-10 space-y-4">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold backdrop-blur-xs border border-indigo-500/30">
              <Sparkles class="w-3.5 h-3.5" />
              <span>Reverse Skill-Matching Candidate Algorithm</span>
            </div>

            <!-- Quick Link to Project Details & Applicants -->
            <div class="flex items-center gap-2">
              <router-link
                :to="`/client/projects/${project.id}`"
                class="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition"
              >
                Project Details
              </router-link>
              <router-link
                :to="`/client/projects/${project.id}/applicants`"
                class="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition flex items-center gap-1.5"
              >
                <Users class="w-3.5 h-3.5" />
                <span>View Applicants ({{ applicationCount }})</span>
              </router-link>
            </div>
          </div>

          <div>
            <h1 class="text-xl sm:text-2xl font-black tracking-tight">
              {{ project.title }}
            </h1>
            <p class="text-neutral-300 text-xs sm:text-sm mt-1 max-w-2xl line-clamp-2 leading-relaxed">
              {{ project.description }}
            </p>
          </div>

          <!-- Project Required Skills Header Tags -->
          <div class="pt-2 border-t border-white/10 flex flex-wrap items-center gap-2 text-xs">
            <span class="text-neutral-400 font-semibold">Required Skills ({{ project.skills?.length || 0 }}):</span>
            <span
              v-for="s in project.skills"
              :key="s"
              class="px-2.5 py-0.5 rounded-md bg-white/10 text-white text-[11px] font-medium border border-white/15"
            >
              {{ s }}
            </span>
          </div>
        </div>
      </div>

      <!-- Quick KPI Stats Bar -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <!-- All Recommended Candidates -->
        <button
          type="button"
          @click="selectedTier = 'all'"
          class="p-4 rounded-xl border text-left transition cursor-pointer"
          :class="[
            selectedTier === 'all'
              ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
              : 'bg-white text-neutral-800 border-neutral-200/90 hover:border-neutral-300'
          ]"
        >
          <div class="text-[11px] font-bold uppercase tracking-wider opacity-75">All Matched</div>
          <div class="text-2xl font-black mt-1">{{ stats.all }}</div>
          <div class="text-[10px] opacity-70 mt-0.5">Students matching ≥ 1 skill</div>
        </button>

        <!-- Excellent Match -->
        <button
          type="button"
          @click="selectedTier = 'excellent'"
          class="p-4 rounded-xl border text-left transition cursor-pointer"
          :class="[
            selectedTier === 'excellent'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
              : 'bg-white text-neutral-800 border-neutral-200/90 hover:border-emerald-300'
          ]"
        >
          <div class="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider" :class="selectedTier === 'excellent' ? 'text-emerald-100' : 'text-emerald-700'">
            <span>Excellent</span>
            <span class="text-[10px] font-semibold px-1.5 py-0.2 rounded-full" :class="selectedTier === 'excellent' ? 'bg-emerald-700 text-white' : 'bg-emerald-100 text-emerald-800'">
              80–100%
            </span>
          </div>
          <div class="text-2xl font-black mt-1">{{ stats.excellent }}</div>
          <div class="text-[10px] opacity-70 mt-0.5">Top-tier candidate fit</div>
        </button>

        <!-- Good Match -->
        <button
          type="button"
          @click="selectedTier = 'good'"
          class="p-4 rounded-xl border text-left transition cursor-pointer"
          :class="[
            selectedTier === 'good'
              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
              : 'bg-white text-neutral-800 border-neutral-200/90 hover:border-blue-300'
          ]"
        >
          <div class="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider" :class="selectedTier === 'good' ? 'text-blue-100' : 'text-blue-700'">
            <span>Good Match</span>
            <span class="text-[10px] font-semibold px-1.5 py-0.2 rounded-full" :class="selectedTier === 'good' ? 'bg-blue-700 text-white' : 'bg-blue-100 text-blue-800'">
              50–79%
            </span>
          </div>
          <div class="text-2xl font-black mt-1">{{ stats.good }}</div>
          <div class="text-[10px] opacity-70 mt-0.5">High skill overlap</div>
        </button>

        <!-- Highest Match Score -->
        <div class="bg-white p-4 rounded-xl border border-neutral-200/90 shadow-2xs space-y-1">
          <div class="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Highest Score</div>
          <div class="text-2xl font-black text-emerald-600">{{ highestScore }}%</div>
          <div class="text-[10px] text-neutral-400">Peak profile match</div>
        </div>
      </div>

      <!-- Filters & Sorting Bar -->
      <div class="bg-white rounded-2xl p-4 border border-neutral-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div class="flex flex-wrap items-center gap-2">
          <!-- Experience Filter -->
          <select
            v-model="selectedExperience"
            class="text-xs font-medium bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-neutral-700 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
          >
            <option value="All">All Experience Levels</option>
            <option value="Entry Level">Entry Level</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Expert">Expert</option>
          </select>

          <!-- University Filter -->
          <select
            v-model="selectedUniversity"
            class="text-xs font-medium bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-neutral-700 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 max-w-xs truncate"
          >
            <option value="All">All Universities</option>
            <option v-for="uni in universities" :key="uni" :value="uni">{{ uni }}</option>
          </select>
        </div>

        <div class="flex items-center gap-2">
          <span class="text-xs text-neutral-400 font-medium">Sort by:</span>
          <select
            v-model="sortBy"
            class="text-xs font-semibold bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-neutral-800 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
          >
            <option value="match_desc">Best Match %</option>
            <option value="rating_desc">Highest Rated</option>
            <option value="completeness_desc">Profile Completeness</option>
          </select>
        </div>
      </div>

      <!-- Candidate Cards Feed -->
      <div v-if="recommendedStudents.length > 0" class="space-y-4">
        <div
          v-for="candidate in recommendedStudents"
          :key="candidate.id"
          class="bg-white rounded-2xl border border-neutral-200/90 shadow-2xs hover:shadow-md transition p-5 sm:p-6 space-y-4"
        >
          <!-- Card Header: Profile Info + Match Badge -->
          <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <!-- Student Bio & Identity -->
            <div class="flex items-start gap-4">
              <div class="w-14 h-14 rounded-full overflow-hidden border-2 border-neutral-200 shrink-0">
                <img :src="candidate.avatar" :alt="candidate.fullName" class="w-full h-full object-cover" />
              </div>

              <div class="space-y-1">
                <div class="flex flex-wrap items-center gap-2">
                  <h3 class="text-base font-black text-neutral-900 leading-tight">
                    {{ candidate.fullName }}
                  </h3>
                  <!-- Verified Tag -->
                  <span class="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 class="w-3 h-3" />
                    <span>Verified Student</span>
                  </span>

                  <!-- Application Status if already applied -->
                  <span
                    v-if="candidate.applicationStatus"
                    class="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider"
                    :class="[
                      candidate.applicationStatus === 'Accepted' ? 'bg-green-100 text-green-800' :
                      candidate.applicationStatus === 'Pending' ? 'bg-amber-100 text-amber-800' :
                      'bg-red-100 text-red-800'
                    ]"
                  >
                    Already Applied ({{ candidate.applicationStatus }})
                  </span>
                </div>

                <p class="text-xs text-neutral-600 font-medium">
                  {{ candidate.department }} • {{ candidate.university }}
                </p>

                <!-- Experience & Rating Preview -->
                <div class="flex flex-wrap items-center gap-3 text-xs text-neutral-400 pt-0.5">
                  <span class="font-medium text-neutral-700">Tier: {{ candidate.experienceLevel || 'Intermediate' }}</span>
                  <span>•</span>
                  <div class="flex items-center gap-1">
                    <StarRating :model-value="candidate.ratingMetrics.averageRating" :readonly="true" size="sm" />
                    <span class="font-bold text-neutral-800">{{ candidate.ratingMetrics.formattedRating }}</span>
                    <span class="text-[10px]">({{ candidate.ratingMetrics.totalReviews }})</span>
                  </div>
                  <span>•</span>
                  <span>Profile Strength: <strong class="text-neutral-700">{{ candidate.completeness }}%</strong></span>
                </div>
              </div>
            </div>

            <!-- Match Percentage & Tier Badge -->
            <div class="sm:text-right shrink-0">
              <div
                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border shadow-2xs"
                :class="candidate.matchDetails.badgeClass"
              >
                <Sparkles class="w-3.5 h-3.5 shrink-0" />
                <span>{{ candidate.matchDetails.matchPercentage }}% Match</span>
                <span class="opacity-60">•</span>
                <span class="font-bold">{{ candidate.matchDetails.tierLabel }}</span>
              </div>
            </div>
          </div>

          <!-- Matching Skills Breakdown -->
          <div class="p-3.5 rounded-xl bg-[#f8fafc] border border-neutral-200/80 space-y-2">
            <div class="flex items-center justify-between text-xs">
              <span class="font-bold text-neutral-700 flex items-center gap-1.5">
                <Check class="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                <span>Matches {{ candidate.matchDetails.matchedCount }} of {{ candidate.matchDetails.totalRequired }} required skills</span>
              </span>
            </div>

            <!-- Skills pills -->
            <div class="flex flex-wrap items-center gap-1.5 pt-1">
              <!-- Matched skills in green -->
              <span
                v-for="s in candidate.matchDetails.matchedSkills"
                :key="'match-' + s"
                class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300"
              >
                <Check class="w-3 h-3 text-emerald-700 stroke-[3]" />
                <span>{{ s }}</span>
              </span>

              <!-- Missing skills in gray outline -->
              <span
                v-for="s in candidate.matchDetails.missingSkills"
                :key="'miss-' + s"
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-neutral-100 text-neutral-500 border border-neutral-200"
              >
                <span>Missing: {{ s }}</span>
              </span>
            </div>
          </div>

          <!-- Portfolio Preview if candidate has works -->
          <div v-if="candidate.portfolio && candidate.portfolio.length > 0" class="space-y-1.5 pt-1">
            <span class="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block">
              Portfolio Highlight:
            </span>
            <div class="p-3 bg-neutral-50 rounded-xl border border-neutral-100 flex items-center justify-between text-xs">
              <div>
                <span class="font-bold text-neutral-900">{{ candidate.portfolio[0].name }}</span>
                <p class="text-neutral-500 text-[11px] line-clamp-1">{{ candidate.portfolio[0].description }}</p>
              </div>
              <a
                v-if="candidate.portfolio[0].url"
                :href="candidate.portfolio[0].url"
                target="_blank"
                class="text-blue-600 hover:underline flex items-center gap-1 text-xs font-semibold ml-2 shrink-0"
              >
                <ExternalLink class="w-3.5 h-3.5" />
                <span>Demo</span>
              </a>
            </div>
          </div>

          <!-- Card Actions Footer -->
          <div class="flex items-center justify-between pt-2 border-t border-neutral-100">
            <span class="text-xs text-neutral-400">
              Student ID: <code class="font-mono text-neutral-700">{{ candidate.studentId }}</code>
            </span>

            <div class="flex items-center gap-2">
              <button
                type="button"
                @click="inspectCandidate(candidate)"
                class="px-4 py-2 rounded-xl text-xs font-bold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition cursor-pointer"
              >
                View Full Profile
              </button>

              <router-link
                v-if="candidate.applicationStatus"
                :to="`/client/projects/${project.id}/applicants`"
                class="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Review Proposal
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else
        class="bg-white rounded-2xl border border-neutral-200/90 p-12 text-center space-y-4 shadow-2xs"
      >
        <div class="w-14 h-14 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
          <Search class="w-7 h-7" />
        </div>
        <div class="space-y-1">
          <h3 class="text-base font-extrabold text-neutral-900">
            No matching students found
          </h3>
          <p class="text-xs text-neutral-500 max-w-md mx-auto">
            Try adjusting your filter criteria or broadening your project's required skill set.
          </p>
        </div>
        <button
          type="button"
          @click="resetFilters"
          class="px-4 py-2 rounded-xl text-xs font-bold bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition cursor-pointer"
        >
          Reset Filters
        </button>
      </div>

      <!-- Candidate Modal Inspection -->
      <Teleport to="body">
        <div
          v-if="activeInspection"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div class="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-neutral-200 space-y-5 animate-in fade-in zoom-in-95 duration-150 my-8">
            <div class="flex items-start justify-between border-b border-neutral-100 pb-3">
              <div class="flex items-center gap-3">
                <img :src="activeInspection.avatar" :alt="activeInspection.fullName" class="w-12 h-12 rounded-full object-cover border" />
                <div>
                  <h3 class="font-extrabold text-neutral-900 text-base">{{ activeInspection.fullName }}</h3>
                  <p class="text-xs text-neutral-500">{{ activeInspection.department }} • {{ activeInspection.university }}</p>
                </div>
              </div>
              <button @click="activeInspection = null" class="text-neutral-400 hover:text-black p-1">
                <X class="w-5 h-5" />
              </button>
            </div>

            <!-- Bio -->
            <div class="space-y-1 text-xs">
              <span class="font-bold text-neutral-500 uppercase tracking-wider text-[10px]">Student Bio:</span>
              <p class="text-neutral-700 leading-relaxed bg-neutral-50 p-3 rounded-xl border border-neutral-100">
                {{ activeInspection.bio || 'No bio provided.' }}
              </p>
            </div>

            <!-- Skills -->
            <div class="space-y-1.5 text-xs">
              <span class="font-bold text-neutral-500 uppercase tracking-wider text-[10px]">All Profile Skills:</span>
              <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="s in activeInspection.skills"
                  :key="s"
                  class="px-2 py-0.5 rounded-md text-[11px] font-medium bg-neutral-100 text-neutral-700 border"
                >
                  {{ s }}
                </span>
              </div>
            </div>

            <!-- Portfolio -->
            <div class="space-y-2 text-xs" v-if="activeInspection.portfolio && activeInspection.portfolio.length > 0">
              <span class="font-bold text-neutral-500 uppercase tracking-wider text-[10px]">Portfolio Items:</span>
              <div class="space-y-2 max-h-48 overflow-y-auto">
                <div
                  v-for="p in activeInspection.portfolio"
                  :key="p.id"
                  class="p-3 rounded-xl border border-neutral-200/80 space-y-1"
                >
                  <div class="flex justify-between items-center">
                    <span class="font-bold text-neutral-900">{{ p.name }}</span>
                    <a v-if="p.url" :href="p.url" target="_blank" class="text-blue-600 hover:underline flex items-center gap-1 text-[11px]">
                      <ExternalLink class="w-3 h-3" />
                      <span>Link</span>
                    </a>
                  </div>
                  <p class="text-[11px] text-neutral-500">{{ p.description }}</p>
                </div>
              </div>
            </div>

            <div class="pt-2">
              <button
                @click="activeInspection = null"
                class="w-full py-2.5 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-bold transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </Teleport>
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  ArrowLeft,
  Sparkles,
  Users,
  CheckCircle2,
  Check,
  Search,
  ExternalLink,
  ShieldAlert,
  X
} from 'lucide-vue-next'
import { getProjectById } from '../../data/projectService'
import { getApplicationsByProject } from '../../data/applicationService'
import { authState } from '../../data/auth'
import { getRecommendedStudentsForProject } from '../../data/studentMatchingService'
import StarRating from '../../components/StarRating.vue'

const route = useRoute()
const projectId = route.params.id

const project = computed(() => getProjectById(projectId))
const currentUser = computed(() => authState.currentUser)

// Verify project ownership (current client or default techcorp)
const isProjectOwner = computed(() => {
  if (!project.value) return false
  if (currentUser.value?.role === 'admin') return true
  const clientId = currentUser.value?.id || 'client-techcorp'
  return project.value.clientId === clientId || !project.value.clientId
})

const applicationCount = computed(() => {
  return getApplicationsByProject(projectId).length
})

// Filter states
const selectedTier = ref('all') // 'all', 'excellent', 'good'
const selectedExperience = ref('All')
const selectedUniversity = ref('All')
const sortBy = ref('match_desc')
const activeInspection = ref(null)

// Raw recommended students for stats
const rawRecommendations = computed(() => {
  if (!project.value) return []
  return getRecommendedStudentsForProject(project.value, {
    tier: 'all',
    experienceLevel: 'All',
    university: 'All',
    sortBy: 'match_desc'
  })
})

const stats = computed(() => {
  const all = rawRecommendations.value
  return {
    all: all.length,
    excellent: all.filter(s => s.matchDetails.tier === 'excellent').length,
    good: all.filter(s => s.matchDetails.tier === 'good').length,
    partial: all.filter(s => s.matchDetails.tier === 'partial').length
  }
})

const highestScore = computed(() => {
  if (rawRecommendations.value.length === 0) return 0
  return rawRecommendations.value[0]?.matchDetails.matchPercentage || 0
})

const universities = computed(() => {
  const unis = new Set()
  rawRecommendations.value.forEach(s => {
    if (s.university) unis.add(s.university)
  })
  return Array.from(unis)
})

// Filtered student candidates
const recommendedStudents = computed(() => {
  if (!project.value) return []
  return getRecommendedStudentsForProject(project.value, {
    tier: selectedTier.value,
    experienceLevel: selectedExperience.value,
    university: selectedUniversity.value,
    sortBy: sortBy.value
  })
})

const inspectCandidate = (candidate) => {
  activeInspection.value = candidate
}

const resetFilters = () => {
  selectedTier.value = 'all'
  selectedExperience.value = 'All'
  selectedUniversity.value = 'All'
  sortBy.value = 'match_desc'
}
</script>
