<template>
  <aside
    class="w-[260px] shrink-0 bg-[#f8fafc] border-r border-[#e2e8f0] flex flex-col justify-between py-6 px-4 select-none h-full overflow-y-auto"
  >
    <!-- Top Branding & Navigation -->
    <div class="space-y-6">
      <!-- Brand Logo -->
      <router-link to="/" class="flex items-center gap-2.5 px-2 group">
        <div class="w-8 h-8 rounded-xl bg-[#0f172a] text-white flex items-center justify-center font-black text-sm shadow-xs group-hover:scale-105 transition-transform">
          <span>P</span>
        </div>
        <div>
          <span class="text-[19px] font-extrabold tracking-tight text-neutral-900 block leading-tight">
            Prilans<span class="text-[#22c55e]">.</span>
          </span>
          <span class="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">
            {{ isClient ? 'Client Portal' : 'Student Portal' }}
          </span>
        </div>
      </router-link>

      <!-- User Profile Dropdown -->
      <div class="px-1">
        <UserProfileDropdown />
      </div>

      <!-- Navigation Section 1: MENU -->
      <div>
        <div class="text-[10px] font-bold tracking-wider text-neutral-400 uppercase px-2 mb-2">
          MENU
        </div>
        <nav class="space-y-1" aria-label="Main Menu">
          <button
            v-for="item in activeMenuItems"
            :key="item.id"
            @click="navigateItem(item)"
            type="button"
            class="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-neutral-400"
            :class="[
              isItemActive(item)
                ? 'bg-white text-neutral-900 shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-neutral-200/90 font-semibold'
                : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/50'
            ]"
          >
            <div class="flex items-center gap-3">
              <component
                :is="item.icon"
                class="w-4 h-4 shrink-0"
                :class="isItemActive(item) ? 'text-neutral-900 stroke-[2.2]' : 'text-neutral-400 stroke-[1.8]'"
              />
              <span>{{ item.label }}</span>
            </div>

            <!-- Unread notification count badge -->
            <span
              v-if="item.id === 'notification' && unreadCount > 0"
              class="px-1.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold"
            >
              {{ unreadCount }}
            </span>
          </button>
        </nav>
      </div>

      <!-- Navigation Section 2: PREFERENCES -->
      <div>
        <div class="text-[10px] font-bold tracking-wider text-neutral-400 uppercase px-2 mb-2">
          PREFERENCES
        </div>
        <nav class="space-y-1" aria-label="Preferences">
          <button
            v-for="item in preferenceItems"
            :key="item.id"
            @click="navigateItem(item)"
            type="button"
            class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-neutral-400"
            :class="[
              isItemActive(item)
                ? 'bg-white text-neutral-900 shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-neutral-200/90 font-semibold'
                : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/50'
            ]"
          >
            <component
              :is="item.icon"
              class="w-4 h-4 shrink-0"
              :class="isItemActive(item) ? 'text-neutral-900 stroke-[2.2]' : 'text-neutral-400 stroke-[1.8]'"
            />
            <span>{{ item.label }}</span>
          </button>
        </nav>
      </div>
    </div>

    <!-- Bottom Promo: Plus Plan -->
    <div class="pt-6">
      <PlusPlanCard @upgrade="$emit('upgrade')" />
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  Search,
  UserCheck,
  Building2,
  FileText,
  Mail,
  Bell,
  Settings,
  HelpCircle,
  LayoutDashboard,
  PlusCircle,
  Briefcase,
  Users
} from 'lucide-vue-next'
import UserProfileDropdown from './UserProfileDropdown.vue'
import PlusPlanCard from './PlusPlanCard.vue'
import { authState, isClient } from '../data/auth'
import { getUnreadNotificationCount } from '../data/applicationService'

const props = defineProps({
  activeNav: {
    type: String,
    default: 'find-project'
  }
})

const emit = defineEmits(['select-nav', 'upgrade'])
const router = useRouter()
const route = useRoute()

const userId = computed(() => authState.currentUser?.id || 'student-akmal')
const unreadCount = computed(() => getUnreadNotificationCount(userId.value))

// Student specific navigation
const studentMenuItems = [
  { id: 'find-project', label: 'Find Project', icon: Search, route: '/' },
  { id: 'student-profile', label: 'My Skill Profile', icon: UserCheck, route: '/profile' },
  { id: 'my-applications', label: 'My Applications', icon: FileText, route: '/my-applications' },
  { id: 'companies', label: 'Companies', icon: Building2 },
  { id: 'message', label: 'Message', icon: Mail },
  { id: 'notification', label: 'Notification', icon: Bell, route: '/notifications' }
]

// Client specific navigation
const clientMenuItems = [
  { id: 'client-dashboard', label: 'Dashboard', icon: LayoutDashboard, route: '/client/dashboard' },
  { id: 'post-project', label: 'Post a Project', icon: PlusCircle, route: '/client/projects/new' },
  { id: 'my-projects', label: 'My Projects', icon: Briefcase, route: '/client/projects' },
  { id: 'find-freelancers', label: 'Find Freelancers', icon: Users, route: '/' },
  { id: 'message', label: 'Message', icon: Mail },
  { id: 'notification', label: 'Notification', icon: Bell, route: '/notifications' }
]

const activeMenuItems = computed(() => {
  return isClient.value ? clientMenuItems : studentMenuItems
})

const preferenceItems = [
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'help', label: 'Help', icon: HelpCircle }
]

const isItemActive = (item) => {
  if (item.route && route.path === item.route) return true
  if (route.path === '/' && item.id === 'find-project' && !isClient.value) return true
  if (route.path.startsWith('/client/projects') && item.id === 'my-projects') return true
  if (route.path === '/my-applications' && item.id === 'my-applications') return true
  return props.activeNav === item.id
}

const navigateItem = (item) => {
  if (item.route) {
    router.push(item.route)
  }
  emit('select-nav', item.id)
}
</script>
