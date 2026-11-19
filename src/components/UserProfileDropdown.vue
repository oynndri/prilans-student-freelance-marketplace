<template>
  <div class="relative" ref="dropdownRef">
    <button
      @click="isOpen = !isOpen"
      type="button"
      class="w-full flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition text-left cursor-pointer select-none border border-white/5"
    >
      <div class="flex items-center gap-2.5 min-w-0">
        <div class="relative w-8 h-8 rounded-full overflow-hidden shrink-0 bg-slate-800 border border-white/20">
          <img
            :src="user.avatar"
            :alt="user.fullName"
            class="w-full h-full object-cover"
          />
        </div>
        <div class="min-w-0 flex-1">
          <div class="text-[13px] font-semibold text-white leading-tight truncate">
            {{ user.fullName }}
          </div>
          <div class="text-[11px] text-slate-400 font-normal truncate leading-tight">
            {{ user.email }}
          </div>
        </div>
      </div>
      <ChevronDown class="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1 transition-transform" :class="{ 'rotate-180': isOpen }" />
    </button>

    <!-- Dropdown Menu -->
    <div
      v-if="isOpen"
      class="absolute left-0 right-0 top-full mt-2 glass-dropdown rounded-2xl py-2 z-50 text-[13px]"
    >
      <div class="px-3.5 py-2 border-b border-white/10">
        <div class="flex items-center justify-between">
          <p class="font-bold text-white">{{ user.fullName }}</p>
          <span class="text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase"
            :class="isClient ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'"
          >
            {{ isClient ? 'Client' : 'Student' }}
          </span>
        </div>
        <p class="text-xs text-slate-400 truncate mt-0.5">
          {{ isClient ? user.company : user.department }}
        </p>
      </div>

      <!-- Role-based navigation items -->
      <template v-if="!isClient">
        <router-link
          to="/profile"
          @click="isOpen = false"
          class="w-full text-left px-3.5 py-2 text-slate-300 hover:bg-white/10 hover:text-white flex items-center gap-2.5 transition"
        >
          <User class="w-4 h-4 text-emerald-400" />
          <span>My Skill Profile</span>
        </router-link>

        <router-link
          to="/my-applications"
          @click="isOpen = false"
          class="w-full text-left px-3.5 py-2 text-slate-300 hover:bg-white/10 hover:text-white flex items-center gap-2.5 transition"
        >
          <FileText class="w-4 h-4 text-slate-400" />
          <span>My Applications</span>
        </router-link>

        <router-link
          to="/profile-setup"
          @click="isOpen = false"
          class="w-full text-left px-3.5 py-2 text-slate-300 hover:bg-white/10 hover:text-white flex items-center gap-2.5 transition"
        >
          <Sparkles class="w-4 h-4 text-amber-400" />
          <span>Profile Setup Wizard</span>
        </router-link>
      </template>

      <template v-else>
        <router-link
          to="/client/dashboard"
          @click="isOpen = false"
          class="w-full text-left px-3.5 py-2 text-slate-300 hover:bg-white/10 hover:text-white flex items-center gap-2.5 transition"
        >
          <LayoutDashboard class="w-4 h-4 text-blue-400" />
          <span>Client Dashboard</span>
        </router-link>

        <router-link
          to="/client/projects"
          @click="isOpen = false"
          class="w-full text-left px-3.5 py-2 text-slate-300 hover:bg-white/10 hover:text-white flex items-center gap-2.5 transition"
        >
          <Briefcase class="w-4 h-4 text-indigo-400" />
          <span>My Published Projects</span>
        </router-link>

        <router-link
          to="/client/projects/new"
          @click="isOpen = false"
          class="w-full text-left px-3.5 py-2 text-slate-300 hover:bg-white/10 hover:text-white flex items-center gap-2.5 transition"
        >
          <PlusCircle class="w-4 h-4 text-slate-400" />
          <span>Post a Project</span>
        </router-link>
      </template>

      <div class="my-1 border-t border-white/10"></div>

      <button
        @click="handleLogout"
        class="w-full text-left px-3.5 py-2 text-red-400 hover:bg-red-500/10 flex items-center gap-2.5 cursor-pointer font-medium transition"
      >
        <LogOut class="w-4 h-4 text-red-400" />
        <span>Sign Out</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  ChevronDown,
  User,
  Sparkles,
  LogOut,
  LayoutDashboard,
  Briefcase,
  PlusCircle,
  FileText
} from 'lucide-vue-next'
import { authState, isClient, logoutUser } from '../data/auth'

const router = useRouter()
const isOpen = ref(false)
const dropdownRef = ref(null)

const user = computed(() => authState.currentUser)

const handleLogout = () => {
  const wasClient = isClient.value
  logoutUser()
  isOpen.value = false
  if (wasClient) {
    router.push('/client/login')
  } else {
    router.push('/login')
  }
}

const handleClickOutside = (e) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside)
})
</script>
