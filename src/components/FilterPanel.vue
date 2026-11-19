<template>
  <aside
    class="glass-panel rounded-2xl p-4 space-y-4 text-slate-200"
  >
    <!-- Filter Header with Reset -->
    <div class="flex items-center justify-between pb-2 border-b border-white/10">
      <h3 class="text-[14px] font-bold text-white tracking-tight">
        Filters
      </h3>
      <button
        type="button"
        @click="$emit('reset-filters')"
        class="text-[12px] font-semibold text-emerald-400 hover:text-emerald-300 transition cursor-pointer"
      >
        Reset
      </button>
    </div>

    <!-- 1. Category -->
    <FilterSection title="Category">
      <div class="relative" ref="categoryDropdownRef">
        <button
          type="button"
          @click="isCategoryOpen = !isCategoryOpen"
          class="w-full flex items-center justify-between px-3 py-2 text-[12px] rounded-xl border border-white/10 bg-white/5 hover:border-white/20 text-slate-300 hover:text-white transition text-left cursor-pointer"
        >
          <span class="truncate" :class="{ 'text-white font-medium': selectedCategory !== 'All Categories' }">
            {{ selectedCategory === 'All Categories' ? 'Select categories' : selectedCategory }}
          </span>
          <ChevronDown class="w-3.5 h-3.5 text-slate-400 shrink-0 ml-2 transition-transform" :class="{ 'rotate-180': isCategoryOpen }" />
        </button>

        <div
          v-if="isCategoryOpen"
          class="absolute left-0 right-0 top-full mt-1.5 glass-dropdown rounded-xl py-1 z-30 text-[12px] max-h-48 overflow-y-auto"
        >
          <button
            v-for="cat in categories"
            :key="cat"
            type="button"
            @click="selectCat(cat)"
            class="w-full text-left px-3 py-1.5 hover:bg-white/10 flex items-center justify-between transition"
            :class="selectedCategory === cat ? 'text-white font-semibold bg-white/10' : 'text-slate-300'"
          >
            <span>{{ cat }}</span>
            <Check v-if="selectedCategory === cat" class="w-3 h-3 text-emerald-400" />
          </button>
        </div>
      </div>
    </FilterSection>

    <div class="border-t border-white/10"></div>

    <!-- 2. Experience Level -->
    <FilterSection title="Experience Level">
      <div class="space-y-2 pt-0.5">
        <label
          v-for="item in experienceLevels"
          :key="item.id"
          class="flex items-center justify-between text-[12px] text-slate-300 hover:text-white cursor-pointer select-none group"
        >
          <div class="flex items-center gap-2.5">
            <input
              type="checkbox"
              :value="item.id"
              :checked="isExperienceChecked(item.id)"
              @change="toggleExperience(item.id)"
              class="w-3.5 h-3.5 rounded border-white/20 bg-white/5 text-indigo-500 focus:ring-0 accent-indigo-500 cursor-pointer"
            />
            <span class="group-hover:text-white transition-colors" :class="{ 'font-semibold text-white': isExperienceChecked(item.id) }">
              {{ item.label }}
            </span>
          </div>
          <span class="text-[11px] text-slate-400 font-normal tabular-nums">
            {{ item.count }}
          </span>
        </label>
      </div>
    </FilterSection>

    <div class="border-t border-white/10"></div>

    <!-- 3. Project Type (Segmented control matching reference) -->
    <FilterSection title="Project Type">
      <div class="grid grid-cols-3 p-1 bg-white/5 rounded-xl border border-white/10 text-[11px] font-medium">
        <button
          type="button"
          @click="$emit('update:projectType', 'All')"
          class="py-1.5 rounded-lg text-center transition cursor-pointer"
          :class="projectType === 'All' ? 'bg-white/15 text-white font-semibold shadow-xs border border-white/10' : 'text-slate-400 hover:text-white'"
        >
          All
        </button>
        <button
          type="button"
          @click="$emit('update:projectType', 'Hourly')"
          class="py-1.5 rounded-lg text-center transition cursor-pointer"
          :class="projectType === 'Hourly' ? 'bg-white/15 text-white font-semibold shadow-xs border border-white/10' : 'text-slate-400 hover:text-white'"
        >
          Hourly
        </button>
        <button
          type="button"
          @click="$emit('update:projectType', 'Fixed Price')"
          class="py-1.5 rounded-lg text-center transition cursor-pointer"
          :class="projectType === 'Fixed Price' ? 'bg-white/15 text-white font-semibold shadow-xs border border-white/10' : 'text-slate-400 hover:text-white'"
        >
          Fixed
        </button>
      </div>
    </FilterSection>

    <div class="border-t border-white/10"></div>

    <!-- 4. Budget -->
    <FilterSection title="Budget">
      <div class="space-y-2 pt-0.5">
        <label
          v-for="item in budgetRanges"
          :key="item.id"
          class="flex items-center justify-between text-[12px] text-slate-300 hover:text-white cursor-pointer select-none group"
        >
          <div class="flex items-center gap-2.5">
            <input
              type="checkbox"
              :value="item.id"
              :checked="isBudgetChecked(item.id)"
              @change="toggleBudget(item.id)"
              class="w-3.5 h-3.5 rounded border-white/20 bg-white/5 text-indigo-500 focus:ring-0 accent-indigo-500 cursor-pointer"
            />
            <span class="group-hover:text-white transition-colors" :class="{ 'font-semibold text-white': isBudgetChecked(item.id) }">
              {{ item.label }}
            </span>
          </div>
          <span class="text-[11px] text-slate-400 font-normal tabular-nums">
            {{ item.count }}
          </span>
        </label>
      </div>
    </FilterSection>

    <div class="border-t border-white/10"></div>

    <!-- 5. Number of Proposals -->
    <FilterSection title="Number of Proposals">
      <div class="space-y-2 pt-0.5">
        <label
          v-for="item in proposalRanges"
          :key="item.id"
          class="flex items-center justify-between text-[12px] text-slate-300 hover:text-white cursor-pointer select-none group"
        >
          <div class="flex items-center gap-2.5">
            <input
              type="checkbox"
              :value="item.id"
              :checked="isProposalChecked(item.id)"
              @change="toggleProposal(item.id)"
              class="w-3.5 h-3.5 rounded border-white/20 bg-white/5 text-indigo-500 focus:ring-0 accent-indigo-500 cursor-pointer"
            />
            <span class="group-hover:text-white transition-colors" :class="{ 'font-semibold text-white': isProposalChecked(item.id) }">
              {{ item.label }}
            </span>
          </div>
          <span class="text-[11px] text-slate-400 font-normal tabular-nums">
            {{ item.count }}
          </span>
        </label>
      </div>
    </FilterSection>
  </aside>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { ChevronDown, Check } from 'lucide-vue-next'
import FilterSection from './FilterSection.vue'

const props = defineProps({
  categories: {
    type: Array,
    default: () => []
  },
  selectedCategory: {
    type: String,
    default: 'All Categories'
  },
  experienceLevels: {
    type: Array,
    default: () => []
  },
  selectedExperience: {
    type: Array,
    default: () => []
  },
  projectType: {
    type: String,
    default: 'All'
  },
  budgetRanges: {
    type: Array,
    default: () => []
  },
  selectedBudgets: {
    type: Array,
    default: () => []
  },
  proposalRanges: {
    type: Array,
    default: () => []
  },
  selectedProposals: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits([
  'reset-filters',
  'update:selectedCategory',
  'update:selectedExperience',
  'update:projectType',
  'update:selectedBudgets',
  'update:selectedProposals'
])

const isCategoryOpen = ref(false)
const categoryDropdownRef = ref(null)

const selectCat = (cat) => {
  emit('update:selectedCategory', cat)
  isCategoryOpen.value = false
}

const handleClickOutside = (e) => {
  if (categoryDropdownRef.value && !categoryDropdownRef.value.contains(e.target)) {
    isCategoryOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside)
})

const isExperienceChecked = (id) => props.selectedExperience.includes(id)
const toggleExperience = (id) => {
  let updated = [...props.selectedExperience]
  if (id === 'any') {
    updated = ['any']
  } else {
    updated = updated.filter(x => x !== 'any')
    if (updated.includes(id)) {
      updated = updated.filter(x => x !== id)
    } else {
      updated.push(id)
    }
    if (updated.length === 0) {
      updated = ['any']
    }
  }
  emit('update:selectedExperience', updated)
}

const isBudgetChecked = (id) => props.selectedBudgets.includes(id)
const toggleBudget = (id) => {
  let updated = [...props.selectedBudgets]
  if (id === 'any') {
    updated = ['any']
  } else {
    updated = updated.filter(x => x !== 'any')
    if (updated.includes(id)) {
      updated = updated.filter(x => x !== id)
    } else {
      updated.push(id)
    }
  }
  emit('update:selectedBudgets', updated)
}

const isProposalChecked = (id) => props.selectedProposals.includes(id)
const toggleProposal = (id) => {
  let updated = [...props.selectedProposals]
  if (updated.includes(id)) {
    updated = updated.filter(x => x !== id)
  } else {
    updated.push(id)
  }
  emit('update:selectedProposals', updated)
}
</script>
