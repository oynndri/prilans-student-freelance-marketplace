<template>
  <aside
    class="w-[260px] shrink-0 glass-sidebar flex flex-col justify-between py-6 px-4 select-none h-full overflow-y-auto"
  >
    <!-- Top Branding & Navigation -->
    <div class="space-y-6">
      <!-- Brand Logo -->
      <router-link to="/client/dashboard" class="flex items-center gap-2.5 px-2 group">
        <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center font-black text-sm shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
          <span>P</span>
        </div>
        <div>
          <span class="text-[19px] font-extrabold tracking-tight text-white block leading-tight">
            Prilans<span class="text-blue-400">.</span>
          </span>
          <span class="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">
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
        <div class="text-[10px] font-bold tracking-wider text-slate-400 uppercase px-2 mb-2">
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
                ? 'bg-white/10 text-white shadow-xs border border-white/10 font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            ]"
          >
            <div class="flex items-center gap-3">
              <component
                :is="item.icon"
                class="w-4 h-4 shrink-0"
                :class="isRouteActive(item.path) ? 'text-blue-400 stroke-[2.2]' : 'text-slate-400 stroke-[1.8]'"
              />
              <span>{{ item.label }}</span>
            </div>

            <span
              v-if="item.badge"
              class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-slate-300"
            >
              {{ item.badge }}
            </span>
          </router-link>
        </nav>
      </div>

      <!-- PREFERENCES -->
      <div>
        <div class="text-[10px] font-bold tracking-wider text-slate-400 uppercase px-2 mb-2">
          PREFERENCES
        </div>
        <nav class="space-y-1">
          <button
            type="button"
            class="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium text-slate-400 hover:text-white hover:bg-white/5 transition cursor-pointer"
          >
            <Settings class="w-4 h-4 text-slate-400 stroke-[1.8]" />
            <span>Settings</span>
          </button>
          <button
            type="button"
            @click="handleLogout"
            class="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium text-red-400 hover:bg-red-500/10 transition cursor-pointer"
          >
            <LogOut class="w-4 h-4 text-red-400 stroke-[1.8]" />
            <span>Sign Out</span>
          </button>
        </nav>
      </div>
    </div>

    <!-- Bottom Client Escrow Note -->
    <div class="p-4 bg-white/5 rounded-2xl border border-white/10 shadow-xs space-y-1.5">
      <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-blue-500"></span>
        <span class="text-xs font-bold text-white">Escrow Protected</span>
      </div>
      <p class="text-[11px] text-slate-400 leading-relaxed">
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
  router.push('/client/login')
}
</script>
