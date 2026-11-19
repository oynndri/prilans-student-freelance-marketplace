<template>
  <aside
    class="w-[260px] shrink-0 bg-[#f8fafc] border-r border-[#e2e8f0] flex flex-col justify-between py-6 px-4 select-none h-full overflow-y-auto"
  >
    <!-- Top Branding & Navigation -->
    <div class="space-y-6">
      <!-- Brand Logo -->
      <router-link to="/student/dashboard" class="flex items-center gap-2.5 px-2 group">
        <div class="w-8 h-8 rounded-xl bg-[#0f172a] text-white flex items-center justify-center font-black text-sm shadow-xs group-hover:scale-105 transition-transform">
          <span>P</span>
        </div>
        <div>
          <span class="text-[19px] font-extrabold tracking-tight text-neutral-900 block leading-tight">
            Prilans<span class="text-[#22c55e]">.</span>
          </span>
          <span class="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
            Student Portal
          </span>
        </div>
      </router-link>

      <!-- User Profile Dropdown -->
      <div class="px-1">
        <UserProfileDropdown />
      </div>

      <!-- Navigation Section: MENU -->
      <div>
        <div class="text-[10px] font-bold tracking-wider text-neutral-400 uppercase px-2 mb-2">
          MENU
        </div>
        <nav class="space-y-1" aria-label="Student Navigation">
          <router-link
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all"
            :class="[
              isRouteActive(item.path)
                ? 'bg-white text-neutral-900 shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-neutral-200/90 font-semibold'
                : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/50'
            ]"
          >
            <div class="flex items-center gap-3">
              <component
                :is="item.icon"
                class="w-4 h-4 shrink-0"
                :class="isRouteActive(item.path) ? 'text-neutral-900 stroke-[2.2]' : 'text-neutral-400 stroke-[1.8]'"
              />
              <span>{{ item.label }}</span>
            </div>

            <!-- Unread badge on notifications -->
            <span
              v-if="item.path === '/notifications' && unreadNotifs > 0"
              class="px-1.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold"
            >
              {{ unreadNotifs }}
            </span>
          </router-link>
        </nav>
      </div>

      <!-- PREFERENCES -->
      <div>
        <div class="text-[10px] font-bold tracking-wider text-neutral-400 uppercase px-2 mb-2">
          PREFERENCES
        </div>
        <nav class="space-y-1">
          <button
            type="button"
            class="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/50 transition cursor-pointer"
          >
            <Settings class="w-4 h-4 text-neutral-400 stroke-[1.8]" />
            <span>Settings</span>
          </button>
          <button
            type="button"
            @click="handleLogout"
            class="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium text-red-600 hover:bg-red-50 transition cursor-pointer"
          >
            <LogOut class="w-4 h-4 text-red-500 stroke-[1.8]" />
            <span>Sign Out</span>
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
import { useRoute, useRouter } from 'vue-router'
import {
  LayoutDashboard,
  Search,
  Sparkles,
  UserCheck,
  FileText,
  Star,
  Bell,
  Settings,
  LogOut
} from 'lucide-vue-next'
import UserProfileDropdown from '../UserProfileDropdown.vue'
import PlusPlanCard from '../PlusPlanCard.vue'
import { authState, logoutUser } from '../../data/auth'
import { getUnreadNotificationCount } from '../../data/applicationService'

defineEmits(['upgrade'])

const route = useRoute()
const router = useRouter()

const userId = computed(() => authState.currentUser?.id || 'student-akmal')
const unreadNotifs = computed(() => getUnreadNotificationCount(userId.value))

const navItems = [
  { label: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
  { label: 'Recommended', path: '/student/recommendations', icon: Sparkles },
  { label: 'Find Projects', path: '/student/projects', icon: Search },
  { label: 'My Skill Profile', path: '/profile', icon: UserCheck },
  { label: 'My Applications', path: '/my-applications', icon: FileText },
  { label: 'My Reviews', path: '/student/reviews', icon: Star },
  { label: 'Notifications', path: '/notifications', icon: Bell }
]

const isRouteActive = (p) => {
  return route.path === p
}

const handleLogout = () => {
  logoutUser()
  router.push('/login')
}
</script>
