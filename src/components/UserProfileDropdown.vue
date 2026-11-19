<template>
  <div class="relative" ref="dropdownRef">
    <button
      @click="isOpen = !isOpen"
      type="button"
      class="w-full flex items-center justify-between p-1.5 -mx-1.5 rounded-lg hover:bg-black/5 transition text-left cursor-pointer select-none"
    >
      <div class="flex items-center gap-2.5 min-w-0">
        <div class="relative w-8 h-8 rounded-full overflow-hidden shrink-0 bg-neutral-200 border border-neutral-300">
          <img
            :src="user.avatar"
            :alt="user.fullName"
            class="w-full h-full object-cover"
          />
        </div>
        <div class="min-w-0 flex-1">
          <div class="text-[13px] font-semibold text-neutral-900 leading-tight truncate">
            {{ user.fullName }}
          </div>
          <div class="text-[11px] text-neutral-400 font-normal truncate leading-tight">
            {{ user.email }}
          </div>
        </div>
      </div>
      <ChevronDown class="w-3.5 h-3.5 text-neutral-400 shrink-0 ml-1 transition-transform" :class="{ 'rotate-180': isOpen }" />
    </button>

    <!-- Dropdown Menu -->
    <div
      v-if="isOpen"
      class="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-neutral-200/80 py-1.5 z-50 text-[13px]"
    >
      <div class="px-3 py-1.5 border-b border-neutral-100">
        <div class="flex items-center justify-between">
          <p class="font-medium text-neutral-800">{{ user.fullName }}</p>
          <span class="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase"
            :class="isClient ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'"
          >
            {{ isClient ? 'Client' : 'Student' }}
          </span>
        </div>
        <p class="text-xs text-neutral-400 truncate">
          {{ isClient ? user.company : user.department }}
        </p>
      </div>

      <!-- Role-based navigation items -->
      <template v-if="!isClient">
        <router-link
          to="/profile"
          @click="isOpen = false"
          class="w-full text-left px-3 py-1.5 text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 flex items-center gap-2"
        >
          <User class="w-3.5 h-3.5 text-neutral-400" />
          <span>Student Skill Profile</span>
        </router-link>

        <router-link
          to="/profile-setup"
          @click="isOpen = false"
          class="w-full text-left px-3 py-1.5 text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 flex items-center gap-2"
        >
          <Sparkles class="w-3.5 h-3.5 text-neutral-400" />
          <span>Profile Setup Wizard</span>
        </router-link>
      </template>

      <template v-else>
        <router-link
          to="/client/dashboard"
          @click="isOpen = false"
          class="w-full text-left px-3 py-1.5 text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 flex items-center gap-2"
        >
          <LayoutDashboard class="w-3.5 h-3.5 text-neutral-400" />
          <span>Client Dashboard</span>
        </router-link>

        <router-link
          to="/client/projects"
          @click="isOpen = false"
          class="w-full text-left px-3 py-1.5 text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 flex items-center gap-2"
        >
          <Briefcase class="w-3.5 h-3.5 text-neutral-400" />
          <span>My Published Projects</span>
        </router-link>

        <router-link
          to="/client/projects/new"
          @click="isOpen = false"
          class="w-full text-left px-3 py-1.5 text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 flex items-center gap-2"
        >
          <PlusCircle class="w-3.5 h-3.5 text-neutral-400" />
          <span>Post a Project</span>
        </router-link>
      </template>

      <!-- Fast Role Switcher in Demo Dropdown -->
      <div class="my-1 border-t border-neutral-100"></div>
      <div class="px-3 py-1 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
        Demo Role Switcher
      </div>
      <button
        type="button"
        @click="handleSwitchRole(isClient ? 'student' : 'client')"
        class="w-full text-left px-3 py-1.5 text-neutral-700 hover:bg-neutral-50 flex items-center gap-2 cursor-pointer font-medium"
      >
        <ArrowLeftRight class="w-3.5 h-3.5 text-neutral-500" />
        <span>Switch to {{ isClient ? 'Student View' : 'Client View' }}</span>
      </button>

      <div class="my-1 border-t border-neutral-100"></div>

      <button
        @click="handleLogout"
        class="w-full text-left px-3 py-1.5 text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
      >
        <LogOut class="w-3.5 h-3.5 text-red-500" />
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
  ArrowLeftRight
} from 'lucide-vue-next'
import { authState, isClient, logoutUser, switchRole } from '../data/auth'

const router = useRouter()
const isOpen = ref(false)
const dropdownRef = ref(null)

const user = computed(() => authState.currentUser)

const handleSwitchRole = (newRole) => {
  switchRole(newRole)
  isOpen.value = false
  if (newRole === 'client') {
    router.push('/client/dashboard')
  } else {
    router.push('/')
  }
}

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
