<template>
  <div class="space-y-4">
    <!-- Big Headline and Subtitle -->
    <div>
      <h1 class="text-xl sm:text-2xl md:text-[26px] font-extrabold text-neutral-900 tracking-tight leading-tight">
        Find Millions of Projects Here!
      </h1>
      <p class="text-[12px] sm:text-[13px] text-neutral-400 mt-1 font-normal">
        Explore our newest project opportunities and apply for the top positions available today.
      </p>
    </div>

    <!-- Search Bar Controls -->
    <div
      class="bg-white rounded-2xl p-1.5 sm:p-2 border border-neutral-200/90 shadow-[0_1px_4px_rgba(0,0,0,0.02)] flex flex-col md:flex-row items-stretch md:items-center gap-2"
    >
      <!-- Keyword Input -->
      <div class="relative flex-1 flex items-center min-w-0">
        <Search class="w-4 h-4 text-neutral-400 absolute left-3.5 pointer-events-none stroke-[2]" />
        <input
          type="text"
          :value="searchQuery"
          @input="$emit('update:searchQuery', $event.target.value)"
          placeholder="Search projects, skills, or titles..."
          aria-label="Search projects by keywords"
          class="w-full pl-10 pr-9 py-2.5 text-[13px] text-neutral-800 placeholder-neutral-400 bg-transparent focus:outline-none focus:ring-1 focus:ring-neutral-400 rounded-lg transition"
        />
        <!-- Clear icon matching reference (x inside circle) -->
        <button
          v-if="searchQuery"
          @click="$emit('clear-search')"
          type="button"
          class="absolute right-3 text-neutral-400 hover:text-neutral-700 transition p-0.5 rounded-full cursor-pointer focus:outline-none"
          title="Clear search"
          aria-label="Clear search"
        >
          <XCircle class="w-4 h-4 fill-neutral-200 text-neutral-600 hover:text-neutral-900" />
        </button>
      </div>

      <!-- Divider line on desktop/tablet -->
      <div class="hidden md:block w-px h-6 bg-neutral-200"></div>

      <!-- Location Input -->
      <div class="relative flex-1 flex items-center min-w-0">
        <MapPin class="w-4 h-4 text-neutral-400 absolute left-3.5 pointer-events-none stroke-[2]" />
        <input
          type="text"
          :value="locationQuery"
          @input="$emit('update:locationQuery', $event.target.value)"
          placeholder="City, state, or zip code"
          aria-label="Filter by city, state, or zip code"
          class="w-full pl-10 pr-8 py-2.5 text-[13px] text-neutral-800 placeholder-neutral-400 bg-transparent focus:outline-none focus:ring-1 focus:ring-neutral-400 rounded-lg transition"
        />
        <button
          v-if="locationQuery"
          @click="$emit('update:locationQuery', '')"
          type="button"
          class="absolute right-3 text-neutral-400 hover:text-neutral-700 transition p-0.5 rounded-full cursor-pointer focus:outline-none"
          title="Clear location"
          aria-label="Clear location"
        >
          <XCircle class="w-4 h-4 fill-neutral-200 text-neutral-600" />
        </button>
      </div>

      <!-- Find Projects Button (dark rounded pill button matching reference) -->
      <button
        type="button"
        @click="$emit('submit-search')"
        class="w-full md:w-auto px-6 py-2.5 rounded-xl bg-[#0f172a] text-white text-[13px] font-semibold hover:bg-black transition shrink-0 shadow-sm cursor-pointer active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-neutral-700"
      >
        Find Projects
      </button>
    </div>
  </div>
</template>

<script setup>
import { Search, MapPin, XCircle } from 'lucide-vue-next'

defineProps({
  searchQuery: {
    type: String,
    default: ''
  },
  locationQuery: {
    type: String,
    default: ''
  }
})

defineEmits(['update:searchQuery', 'update:locationQuery', 'clear-search', 'submit-search'])
</script>
