<template>
  <div class="space-y-6">
    <!-- Top Hero / Header banner -->
    <div class="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-sm">
      <div class="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="relative z-10 max-w-2xl space-y-3">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold backdrop-blur-xs border border-emerald-500/30">
          <Sparkles class="w-3.5 h-3.5" />
          <span>Skill-Based Smart Match Algorithm</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-black tracking-tight">
          Personalized Project Recommendations
        </h1>
        <p class="text-emerald-100/80 text-xs sm:text-sm leading-relaxed">
          Projects automatically scored and prioritized based on the skills in your Student Profile.
          Matched opportunities give you the highest probability of proposal acceptance.
        </p>

        <!-- Current student skills tags & quick edit button -->
        <div class="pt-2 flex flex-wrap items-center gap-2">
          <span class="text-xs text-white/70 font-medium">Your Profile Skills:</span>
          <span
            v-for="s in studentSkills"
            :key="s"
            class="px-2 py-0.5 rounded-md bg-white/10 text-white text-[11px] font-medium border border-white/15"
          >
            {{ s }}
          </span>
          <router-link
            to="/profile"
            class="text-[11px] font-semibold text-emerald-300 hover:text-white underline underline-offset-2 ml-1"
          >
            Edit Skills
          </router-link>
        </div>
      </div>
    </div>

    <!-- Match Tier Statistics Bar -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
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
        <div class="text-[10px] opacity-70 mt-0.5">Projects matching ≥ 1 skill</div>
      </button>

      <button
        type="button"
        @click="selectedTier = 'best'"
        class="p-4 rounded-xl border text-left transition cursor-pointer"
        :class="[
          selectedTier === 'best'
            ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
            : 'bg-white text-neutral-800 border-neutral-200/90 hover:border-emerald-300'
        ]"
      >
        <div class="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider" :class="selectedTier === 'best' ? 'text-emerald-100' : 'text-emerald-700'">
          <span>Best Match</span>
          <span class="text-[10px] font-semibold px-1.5 py-0.2 rounded-full" :class="selectedTier === 'best' ? 'bg-emerald-700 text-white' : 'bg-emerald-100 text-emerald-800'">
            80–100%
          </span>
        </div>
        <div class="text-2xl font-black mt-1">{{ stats.best }}</div>
        <div class="text-[10px] opacity-70 mt-0.5">Highest fit opportunities</div>
      </button>

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
        <div class="text-[10px] opacity-70 mt-0.5">Strong compatible fit</div>
      </button>

      <button
        type="button"
        @click="selectedTier = 'other'"
        class="p-4 rounded-xl border text-left transition cursor-pointer"
        :class="[
          selectedTier === 'other'
            ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
            : 'bg-white text-neutral-800 border-neutral-200/90 hover:border-amber-300'
        ]"
      >
        <div class="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider" :class="selectedTier === 'other' ? 'text-amber-100' : 'text-amber-700'">
          <span>Other Match</span>
          <span class="text-[10px] font-semibold px-1.5 py-0.2 rounded-full" :class="selectedTier === 'other' ? 'bg-amber-700 text-white' : 'bg-amber-100 text-amber-800'">
            1–49%
          </span>
        </div>
        <div class="text-2xl font-black mt-1">{{ stats.other }}</div>
        <div class="text-[10px] opacity-70 mt-0.5">Skill growth opportunities</div>
      </button>
    </div>

    <!-- Filter & Sort Controls Bar -->
    <div class="bg-white rounded-2xl p-4 border border-neutral-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3">
      <div class="flex flex-wrap items-center gap-2">
        <!-- Category Filter -->
        <select
          v-model="selectedCategory"
          class="text-xs font-medium bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-neutral-700 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
        >
          <option value="All">All Categories</option>
          <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>

        <!-- Experience Level Filter -->
        <select
          v-model="selectedExperience"
          class="text-xs font-medium bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-neutral-700 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
        >
          <option value="All">All Experience Levels</option>
          <option value="Entry Level">Entry Level</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Expert">Expert</option>
        </select>

        <!-- Project Type Filter -->
        <select
          v-model="selectedProjectType"
          class="text-xs font-medium bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-neutral-700 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
        >
          <option value="All">All Budget Types</option>
          <option value="Hourly">Hourly</option>
          <option value="Fixed Price">Fixed Price</option>
        </select>
      </div>

      <div class="flex items-center gap-2">
        <span class="text-xs text-neutral-400 font-medium">Sort by:</span>
        <select
          v-model="sortBy"
          class="text-xs font-semibold bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-neutral-800 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
        >
          <option value="match_desc">Highest Match %</option>
          <option value="newest">Most Recent</option>
          <option value="budget_high">Highest Budget</option>
        </select>
      </div>
    </div>

    <!-- Recommendations Project Cards Feed -->
    <div v-if="recommendedList.length > 0" class="space-y-4">
      <div
        v-for="project in recommendedList"
        :key="project.id"
        class="bg-white rounded-2xl border border-neutral-200/90 shadow-2xs hover:shadow-md transition-all p-5 sm:p-6 space-y-4"
      >
        <!-- Card Top Bar: Badges & Price -->
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div class="flex flex-wrap items-center gap-2">
            <!-- Match Percentage & Tier Badge -->
            <div
              class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border shadow-2xs"
              :class="project.matchDetails.badgeClass"
            >
              <CheckCircle2 class="w-3.5 h-3.5 shrink-0" />
              <span>{{ project.matchDetails.matchPercentage }}% Match</span>
              <span class="opacity-60">•</span>
              <span class="font-bold">{{ project.matchDetails.tierLabel }}</span>
            </div>

            <!-- Category badge -->
            <span class="px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-600 text-xs font-medium">
              {{ project.category }}
            </span>

            <!-- Experience badge -->
            <span class="px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-600 text-xs font-medium">
              {{ project.experienceLevel }}
            </span>
          </div>

          <!-- Price Display -->
          <div class="text-right">
            <span class="text-lg font-black text-neutral-900 block leading-tight">
              {{ project.priceDisplay }}
            </span>
            <span class="text-[11px] text-neutral-400 font-medium">
              {{ project.projectType || 'Project Budget' }}
            </span>
          </div>
        </div>

        <!-- Project Title & Description -->
        <div class="space-y-1.5">
          <router-link
            :to="`/projects/${project.id}`"
            class="text-base sm:text-lg font-black text-neutral-900 hover:text-emerald-700 transition line-clamp-1"
          >
            {{ project.title }}
          </router-link>
          <p class="text-xs sm:text-sm text-neutral-600 line-clamp-2 leading-relaxed">
            {{ project.description }}
          </p>
        </div>

        <!-- Match Explanation Breakdown -->
        <div class="p-3.5 rounded-xl bg-[#f8fafc] border border-neutral-200/80 space-y-2">
          <div class="flex items-center justify-between text-xs">
            <span class="font-bold text-neutral-700 flex items-center gap-1.5">
              <Sparkles class="w-3.5 h-3.5 text-emerald-600" />
              <span>Matches {{ project.matchDetails.matchedCount }} of {{ project.matchDetails.totalRequired }} required skills</span>
            </span>
            <span class="text-[11px] text-neutral-400">
              Posted {{ project.postedTime || 'recently' }}
            </span>
          </div>

          <!-- Skills breakdown: Matched skills (green) & Missing skills (gray) -->
          <div class="flex flex-wrap items-center gap-1.5 pt-1">
            <!-- Matched Skills -->
            <span
              v-for="s in project.matchDetails.matchedSkills"
              :key="'matched-' + s"
              class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-100/90 text-emerald-800 border border-emerald-300"
              title="Matched with your student profile skills"
            >
              <Check class="w-3 h-3 text-emerald-700 stroke-[3]" />
              <span>{{ s }}</span>
            </span>

            <!-- Missing Skills -->
            <span
              v-for="s in project.matchDetails.missingSkills"
              :key="'missing-' + s"
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-neutral-100 text-neutral-500 border border-neutral-200"
              title="Skill required for project, not currently in your profile"
            >
              <span>{{ s }}</span>
            </span>
          </div>
        </div>

        <!-- Actions Footer -->
        <div class="flex items-center justify-between pt-1">
          <div class="text-xs text-neutral-400 font-medium">
            Location: <span class="text-neutral-700">{{ project.country || 'Remote' }}</span>
          </div>

          <div class="flex items-center gap-2">
            <router-link
              :to="`/projects/${project.id}`"
              class="px-4 py-2 rounded-xl text-xs font-bold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition"
            >
              Details
            </router-link>
            <router-link
              :to="`/projects/${project.id}/apply`"
              class="px-5 py-2 rounded-xl text-xs font-extrabold text-white bg-neutral-900 hover:bg-black transition shadow-xs flex items-center gap-1.5"
            >
              <span>Apply Now</span>
              <ArrowRight class="w-3.5 h-3.5" />
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
          No recommendations match your current filter
        </h3>
        <p class="text-xs text-neutral-500 max-w-md mx-auto">
          Try switching to "All Matched" or updating your student skills in your profile to expand your matches.
        </p>
      </div>
      <div class="flex items-center justify-center gap-3 pt-2">
        <button
          type="button"
          @click="resetFilters"
          class="px-4 py-2 rounded-xl text-xs font-bold bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition cursor-pointer"
        >
          Reset Filters
        </button>
        <router-link
          to="/profile"
          class="px-4 py-2 rounded-xl text-xs font-bold bg-neutral-900 text-white hover:bg-black transition"
        >
          Update Skills Profile
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  Sparkles,
  CheckCircle2,
  Check,
  Search,
  ArrowRight
} from 'lucide-vue-next'
import { authState } from '../../data/auth'
import { mockCategories } from '../../data/projects'
import { getRecommendedProjects } from '../../data/recommendationService'

const selectedTier = ref('all') // 'all', 'best', 'good', 'other'
const selectedCategory = ref('All')
const selectedExperience = ref('All')
const selectedProjectType = ref('All')
const sortBy = ref('match_desc')

const categories = mockCategories

const student = computed(() => authState.currentUser)
const studentSkills = computed(() => student.value?.skills || [])

// Full list of recommendations for counting stats
const allRawRecommendations = computed(() => {
  return getRecommendedProjects(student.value, {
    tier: 'all',
    category: 'All',
    experienceLevel: 'All',
    projectType: 'All',
    sortBy: 'match_desc'
  })
})

const stats = computed(() => {
  const all = allRawRecommendations.value
  return {
    all: all.length,
    best: all.filter(p => p.matchDetails.matchPercentage >= 80).length,
    good: all.filter(p => p.matchDetails.matchPercentage >= 50 && p.matchDetails.matchPercentage < 80).length,
    other: all.filter(p => p.matchDetails.matchPercentage > 0 && p.matchDetails.matchPercentage < 50).length
  }
})

// Filtered recommendations feed
const recommendedList = computed(() => {
  return getRecommendedProjects(student.value, {
    tier: selectedTier.value,
    category: selectedCategory.value,
    experienceLevel: selectedExperience.value,
    projectType: selectedProjectType.value,
    sortBy: sortBy.value
  })
})

const resetFilters = () => {
  selectedTier.value = 'all'
  selectedCategory.value = 'All'
  selectedExperience.value = 'All'
  selectedProjectType.value = 'All'
  sortBy.value = 'match_desc'
}
</script>
