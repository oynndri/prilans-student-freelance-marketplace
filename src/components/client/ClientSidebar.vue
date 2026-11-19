<template>
  <aside
    class="w-[260px] shrink-0 bg-[#f8fafc] border-r border-[#e2e8f0] flex flex-col justify-between py-6 px-4 select-none h-full overflow-y-auto"
  >
    <!-- Top Branding & Navigation -->
    <div class="space-y-6">
      <!-- Brand Logo -->
      <router-link to="/client/dashboard" class="flex items-center gap-2.5 px-2 group">
        <div class="w-8 h-8 rounded-xl bg-[#0f172a] text-white flex items-center justify-center font-black text-sm shadow-xs group-hover:scale-105 transition-transform">
          <span>P</span>
        </div>
        <div>
          <span class="text-[19px] font-extrabold tracking-tight text-neutral-900 block leading-tight">
            Prilans<span class="text-blue-600">.</span>
          </span>
          <span class="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
            Client Portal
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
          RECRUITMENT
        </div>
        <nav class="space-y-1" aria-label="Client Navigation">
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

            <span
              v-if="item.badge"
              class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-neutral-100 text-neutral-700 border border-neutral-200"
            >
              {{ item.badge }}
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

    <!-- Bottom Client Escrow Note -->
    <div class="p-4 bg-white rounded-2xl border border-neutral-200/80 shadow-2xs space-y-1.5">
      <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-blue-600"></span>
        <span class="text-xs font-bold text-neutral-900">Escrow Protected</span>
      </div>
      <p class="text-[11px] text-neutral-400 leading-relaxed">
        Payments to students remain securely locked until project milestones are verified.
      </p>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  LayoutDashboard,
  PlusCircle,
  Briefcase,
  Users,
  Star,
  Bell,
  Settings,
  LogOut
} from 'lucide-vue-next'
import UserProfileDropdown from '../UserProfileDropdown.vue'
import { authState, logoutUser } from '../../data/auth'
import { projectState } from '../../data/projectService'

const route = useRoute()
const router = useRouter()

const client = computed(() => authState.currentUser)
const clientProjectCount = computed(() => {
  return projectState.projects.filter(p => p.clientId === client.value?.id || !p.clientId).length
})

const navItems = computed(() => [
  { label: 'Dashboard', path: '/client/dashboard', icon: LayoutDashboard },
  { label: 'Post a Project', path: '/client/projects/new', icon: PlusCircle },
  { label: 'My Projects', path: '/client/projects', icon: Briefcase, badge: clientProjectCount.value },
  { label: 'Client Reviews', path: '/client/reviews', icon: Star },
  { label: 'Find Freelancers', path: '/student/projects', icon: Users },
  { label: 'Notifications', path: '/notifications', icon: Bell }
])

const isRouteActive = (p) => {
  if (p === '/client/projects' && route.path.startsWith('/client/projects') && route.path !== '/client/projects/new') {
    return true
  }
  return route.path === p
}

const handleLogout = () => {
  logoutUser()
  router.push('/login')
}
</script>
