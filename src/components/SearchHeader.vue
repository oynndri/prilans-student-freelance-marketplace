<template>
  <div class="space-y-4">
    <!-- Big Headline and Subtitle -->
    <div>
      <h1 class="text-xl sm:text-2xl md:text-[28px] font-black text-white tracking-tight leading-tight">
        Find Verified Student Projects
      </h1>
      <p class="text-[13px] text-slate-400 mt-1 font-normal">
        Explore innovative opportunities, land contracts, and build your real-world portfolio.
      </p>
    </div>

    <!-- Search Bar Controls (Glassmorphism Luxury Container) -->
    <div
      class="glass-panel rounded-2xl p-2 flex flex-col md:flex-row items-stretch md:items-center gap-2 shadow-xl"
    >
      <!-- Keyword Input -->
      <div class="relative flex-1 flex items-center min-w-0">
        <Search class="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none stroke-[2]" />
        <input
          type="text"
          :value="searchQuery"
          @input="$emit('update:searchQuery', $event.target.value)"
          placeholder="Search projects, skills, or titles..."
          aria-label="Search projects by keywords"
          class="w-full pl-10 pr-9 py-2.5 text-[13px] text-white placeholder-slate-400 bg-transparent focus:outline-none rounded-lg transition"
        />
        <!-- Clear icon -->
        <button
          v-if="searchQuery"
          @click="$emit('clear-search')"
          type="button"
          class="absolute right-3 text-slate-400 hover:text-white transition p-0.5 rounded-full cursor-pointer focus:outline-none"
          title="Clear search"
          aria-label="Clear search"
        >
          <XCircle class="w-4 h-4 fill-slate-700 text-slate-300 hover:text-white" />
        </button>
      </div>

      <!-- Divider line on desktop/tablet -->
      <div class="hidden md:block w-px h-6 bg-white/10"></div>

      <!-- Location Input -->
      <div class="relative flex-1 flex items-center min-w-0">
        <MapPin class="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none stroke-[2]" />
        <input
          type="text"
          :value="locationQuery"
          @input="$emit('update:locationQuery', $event.target.value)"
          placeholder="Location (e.g. Remote, Dhaka, San Francisco)..."
          aria-label="Search projects by location"
          class="w-full pl-10 pr-9 py-2.5 text-[13px] text-white placeholder-slate-400 bg-transparent focus:outline-none rounded-lg transition"
        />
        <button
          v-if="locationQuery"
          @click="$emit('update:locationQuery', '')"
          type="button"
          class="absolute right-3 text-slate-400 hover:text-white transition p-0.5 rounded-full cursor-pointer focus:outline-none"
          title="Clear location"
        >
          <XCircle class="w-4 h-4 fill-slate-700 text-slate-300 hover:text-white" />
        </button>
      </div>

      <!-- Search Submit Button with glow accent -->
      <button
        @click="$emit('submit-search')"
        type="button"
        class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-500/25 cursor-pointer active:scale-[0.98] shrink-0"
      >
        Search
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
