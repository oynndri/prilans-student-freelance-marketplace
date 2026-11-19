<template>
  <div class="space-y-6">
    <!-- Top Search Header Component -->
    <SearchHeader
      v-model:searchQuery="searchQuery"
      v-model:locationQuery="locationQuery"
      @clear-search="searchQuery = ''"
      @submit-search="handleSearchSubmit"
    />

    <!-- Main Two-Column Content: Filter Panel (Left) & Project Results (Right) -->
    <div class="flex flex-col xl:flex-row gap-6 items-start">
      <!-- Left Filter Panel (approx 240px width on desktop) -->
      <div class="w-full xl:w-[240px] shrink-0">
        <!-- Tablet & Mobile Filter Toggle Button -->
        <button
          type="button"
          @click="showMobileFilters = !showMobileFilters"
          class="xl:hidden w-full mb-3 flex items-center justify-between px-4 py-2.5 bg-white rounded-xl border border-neutral-200 text-[13px] font-semibold text-neutral-800 shadow-2xs hover:bg-neutral-50 transition cursor-pointer"
        >
          <span class="flex items-center gap-2">
            <span>Filter Options</span>
            <span v-if="activeFilterCount > 0" class="px-2 py-0.5 rounded-full bg-neutral-900 text-white text-[11px] font-bold">
              {{ activeFilterCount }}
            </span>
          </span>
          <span class="text-xs text-neutral-500 font-medium">{{ showMobileFilters ? 'Hide Filters ▲' : 'Show Filters ▼' }}</span>
        </button>

        <!-- Desktop Always-Visible Filter, Mobile/Tablet Collapsible -->
        <div :class="['xl:block', showMobileFilters ? 'block' : 'hidden']">
          <FilterPanel
            :categories="mockCategories"
            v-model:selectedCategory="selectedCategory"
            :experienceLevels="filterOptions.experienceLevels"
            v-model:selectedExperience="selectedExperience"
            :projectType="projectType"
            @update:projectType="projectType = $event"
            :budgetRanges="filterOptions.budgetRanges"
            v-model:selectedBudgets="selectedBudgets"
            :proposalRanges="filterOptions.proposalRanges"
            v-model:selectedProposals="selectedProposals"
            @reset-filters="resetAllFilters"
          />
        </div>
      </div>

      <!-- Right Project Results Panel -->
      <div class="flex-1 w-full min-w-0 space-y-4">
        <!-- Results Header: Count, Sorting, List/Grid Switcher -->
        <ProjectResultsHeader
          :count="totalSimulatedCount"
          v-model:sortBy="sortBy"
          v-model:viewMode="viewMode"
        />

        <!-- Active Filter Tags (if any selected beyond defaults) -->
        <div v-if="hasActiveFilterPills" class="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
          <span class="text-neutral-400 font-medium">Applied:</span>
          <span
            v-if="selectedCategory !== 'All Categories'"
            class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-neutral-200 text-neutral-800 rounded-full shadow-2xs"
          >
            {{ selectedCategory }}
            <button @click="selectedCategory = 'All Categories'" class="hover:text-black font-bold cursor-pointer">×</button>
          </span>
          <span
            v-for="exp in nonDefaultExperience"
            :key="exp"
            class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-neutral-200 text-neutral-800 rounded-full shadow-2xs"
          >
            {{ exp }}
            <button @click="removeExp(exp)" class="hover:text-black font-bold cursor-pointer">×</button>
          </span>
          <span
            v-for="b in nonDefaultBudgets"
            :key="b"
            class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-neutral-200 text-neutral-800 rounded-full shadow-2xs"
          >
            {{ getBudgetLabel(b) }}
            <button @click="removeBudget(b)" class="hover:text-black font-bold cursor-pointer">×</button>
          </span>
          <button
            @click="resetAllFilters"
            class="text-[11px] font-semibold text-neutral-500 hover:text-neutral-900 underline ml-1 cursor-pointer"
          >
            Clear all
          </button>
        </div>

        <!-- Project Grid / List -->
        <ProjectGrid
          :projects="filteredAndSortedProjects"
          :view-mode="viewMode"
          :applied-project-ids="appliedProjectIds"
          @apply="handleApply"
          @reset-filters="resetAllFilters"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import SearchHeader from '../components/SearchHeader.vue'
import FilterPanel from '../components/FilterPanel.vue'
import ProjectResultsHeader from '../components/ProjectResultsHeader.vue'
import ProjectGrid from '../components/ProjectGrid.vue'
import { filterOptions } from '../data/filters'
import { studentAvailableProjects, mockCategories } from '../data/projectService'

// Filter states matching the screenshot initial state
const searchQuery = ref('Web Design')
const locationQuery = ref('')
const selectedCategory = ref('All Categories')
const selectedExperience = ref(['any']) // 'any' is checked in screenshot
const projectType = ref('Hourly') // 'Hourly' selected in segmented control
const selectedBudgets = ref([]) // empty initially
const selectedProposals = ref(['10to15']) // 10 to 15 is checked in reference screenshot!
const sortBy = ref('newest')
const viewMode = ref('grid')
const showMobileFilters = ref(false)

// Applied projects tracking
const appliedProjectIds = ref([3])

const handleApply = (id) => {
  if (!appliedProjectIds.value.includes(id)) {
    appliedProjectIds.value.push(id)
  }
}

const handleSearchSubmit = () => {
  // Triggers reactive re-filter automatically
}

const resetAllFilters = () => {
  searchQuery.value = ''
  locationQuery.value = ''
  selectedCategory.value = 'All Categories'
  selectedExperience.value = ['any']
  projectType.value = 'Hourly'
  selectedBudgets.value = []
  selectedProposals.value = []
  sortBy.value = 'newest'
}

const removeExp = (exp) => {
  selectedExperience.value = selectedExperience.value.filter(e => e !== exp)
  if (selectedExperience.value.length === 0) {
    selectedExperience.value = ['any']
  }
}

const removeBudget = (bId) => {
  selectedBudgets.value = selectedBudgets.value.filter(b => b !== bId)
}

const getBudgetLabel = (bId) => {
  const found = filterOptions.budgetRanges.find(r => r.id === bId)
  return found ? found.label : bId
}

const nonDefaultExperience = computed(() => {
  return selectedExperience.value.filter(e => e !== 'any')
})

const nonDefaultBudgets = computed(() => {
  return selectedBudgets.value.filter(b => b !== 'any')
})

const hasActiveFilterPills = computed(() => {
  return (
    selectedCategory.value !== 'All Categories' ||
    nonDefaultExperience.value.length > 0 ||
    nonDefaultBudgets.value.length > 0
  )
})

const activeFilterCount = computed(() => {
  let count = 0
  if (selectedCategory.value !== 'All Categories') count++
  if (nonDefaultExperience.value.length > 0) count += nonDefaultExperience.value.length
  if (nonDefaultBudgets.value.length > 0) count += nonDefaultBudgets.value.length
  if (selectedProposals.value.length > 0) count += selectedProposals.value.length
  return count
})

// Simulated large results count for header realism (matching 2,450 from screenshot)
const totalSimulatedCount = computed(() => {
  const base = 2450
  if (!searchQuery.value && selectedCategory.value === 'All Categories' && selectedExperience.value.includes('any')) {
    return base
  }
  return Math.max(filteredAndSortedProjects.value.length * 245, filteredAndSortedProjects.value.length)
})

// Filter and Sort Pipeline
const filteredAndSortedProjects = computed(() => {
  let result = [...studentAvailableProjects.value]

  // 1. Search Query (title, description, skills)
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    result = result.filter(p => {
      const titleMatch = (p.title || '').toLowerCase().includes(q)
      const descMatch = (p.description || '').toLowerCase().includes(q)
      const skillMatch = (p.skills || []).some(s => s.toLowerCase().includes(q))
      return titleMatch || descMatch || skillMatch
    })
  }

  // 2. Location Query
  if (locationQuery.value.trim()) {
    const loc = locationQuery.value.toLowerCase().trim()
    result = result.filter(p => (p.country || p.location || '').toLowerCase().includes(loc))
  }

  // 3. Category Filter
  if (selectedCategory.value && selectedCategory.value !== 'All Categories') {
    result = result.filter(p => p.category === selectedCategory.value)
  }

  // 4. Experience Level
  if (selectedExperience.value.length > 0 && !selectedExperience.value.includes('any')) {
    result = result.filter(p => selectedExperience.value.includes(p.experienceLevel))
  }

  // 5. Project Type (Hourly vs Fixed Price)
  if (projectType.value) {
    result = result.filter(p => p.projectType === projectType.value)
  }

  // 6. Budget
  if (selectedBudgets.value.length > 0 && !selectedBudgets.value.includes('any')) {
    result = result.filter(p => {
      return selectedBudgets.value.some(bId => {
        const range = filterOptions.budgetRanges.find(r => r.id === bId)
        if (!range) return true
        return (p.price || 0) >= range.min && (p.price || 0) <= range.max
      })
    })
  }

  // 7. Proposals count
  if (selectedProposals.value.length > 0) {
    result = result.filter(p => {
      return selectedProposals.value.some(pId => {
        const range = filterOptions.proposalRanges.find(r => r.id === pId)
        if (!range) return true
        return (p.proposalCount || 0) >= range.min && (p.proposalCount || 0) <= range.max
      })
    })
  }

  // 8. Sorting
  if (sortBy.value === 'newest') {
    result.sort((a, b) => (a.postedMinutesAgo || 0) - (b.postedMinutesAgo || 0))
  } else if (sortBy.value === 'oldest') {
    result.sort((a, b) => (b.postedMinutesAgo || 0) - (a.postedMinutesAgo || 0))
  } else if (sortBy.value === 'lowest-budget') {
    result.sort((a, b) => (a.price || 0) - (b.price || 0))
  } else if (sortBy.value === 'highest-budget') {
    result.sort((a, b) => (b.price || 0) - (a.price || 0))
  }

  return result
})
</script>
