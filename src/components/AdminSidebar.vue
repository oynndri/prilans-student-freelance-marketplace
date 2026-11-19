<template>
  <aside
    class="w-[260px] shrink-0 bg-[#0f172a] text-white flex flex-col justify-between py-6 px-4 select-none h-full overflow-y-auto"
  >
    <!-- Top Branding & Navigation -->
    <div class="space-y-6">
      <!-- Admin Brand Logo -->
      <router-link to="/admin/dashboard" class="flex items-center gap-2.5 px-2 group">
        <div class="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center font-black text-sm shadow-xs group-hover:scale-105 transition-transform">
          <ShieldAlert class="w-4 h-4 text-white" />
        </div>
        <div>
          <span class="text-[19px] font-extrabold tracking-tight text-white block leading-tight">
            Prilans<span class="text-red-500">.</span>
          </span>
          <span class="text-[10px] font-bold text-red-400 uppercase tracking-wider block">
            Admin Governance
          </span>
        </div>
      </router-link>

      <!-- Admin Profile Box -->
      <div class="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
        <div class="flex items-center gap-2.5 min-w-0">
          <div class="w-8 h-8 rounded-full overflow-hidden bg-white/10 border border-white/20 shrink-0">
            <img :src="adminUser.avatar" alt="Admin" class="w-full h-full object-cover" />
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-xs font-bold text-white truncate">{{ adminUser.fullName }}</p>
            <p class="text-[10px] text-neutral-400 truncate">{{ adminUser.email }}</p>
          </div>
        </div>
      </div>

      <!-- Navigation Section: ADMIN CONTROLS -->
      <div>
        <div class="text-[10px] font-bold tracking-wider text-neutral-400 uppercase px-2 mb-2">
          ADMINISTRATION
        </div>
        <nav class="space-y-1" aria-label="Admin Navigation">
          <router-link
            v-for="item in adminNavItems"
            :key="item.path"
            :to="item.path"
            class="flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all"
            :class="[
              route.path === item.path
                ? 'bg-white/15 text-white font-semibold shadow-xs border border-white/10'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            ]"
          >
            <div class="flex items-center gap-3">
              <component
                :is="item.icon"
                class="w-4 h-4 shrink-0"
                :class="route.path === item.path ? 'text-white stroke-[2.2]' : 'text-neutral-400 stroke-[1.8]'"
              />
              <span>{{ item.label }}</span>
            </div>
            <span
              v-if="item.badge"
              class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-neutral-300"
            >
              {{ item.badge }}
            </span>
          </router-link>
        </nav>
      </div>

      <!-- Quick Platform Switcher -->
      <div>
        <div class="text-[10px] font-bold tracking-wider text-neutral-400 uppercase px-2 mb-2">
          MARKETPLACE
        </div>
        <div class="space-y-1">
          <router-link
            to="/"
            class="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-neutral-400 hover:text-white hover:bg-white/5 transition"
          >
            <ExternalLink class="w-4 h-4" />
            <span>Student Marketplace</span>
          </router-link>
          <router-link
            to="/client/dashboard"
            class="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-neutral-400 hover:text-white hover:bg-white/5 transition"
          >
            <Briefcase class="w-4 h-4" />
            <span>Client Portal</span>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Bottom Sign Out -->
    <div class="pt-6 border-t border-white/10 space-y-2">
      <button
        @click="handleLogout"
        type="button"
        class="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white/10 hover:bg-red-600/80 text-white text-xs font-semibold transition cursor-pointer"
      >
        <LogOut class="w-4 h-4" />
        <span>Exit Admin Mode</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  LayoutDashboard,
  GraduationCap,
  Building,
  Briefcase,
  FileCheck2,
  LogOut,
  ShieldAlert,
  ExternalLink
} from 'lucide-vue-next'
import { authState, logoutUser, defaultAdminProfile } from '../data/auth'
import { projectState } from '../data/projectService'
import { applicationState } from '../data/applicationService'

const route = useRoute()
const router = useRouter()

const adminUser = computed(() => authState.currentUser || defaultAdminProfile)

const totalProjects = computed(() => projectState.projects.length)
const totalApps = computed(() => applicationState.applications.length)

const adminNavItems = [
  { label: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Students', path: '/admin/students', icon: GraduationCap },
  { label: 'Clients', path: '/admin/clients', icon: Building },
  { label: 'Projects', path: '/admin/projects', icon: Briefcase, badge: totalProjects.value },
  { label: 'Applications', path: '/admin/applications', icon: FileCheck2, badge: totalApps.value }
]

const handleLogout = () => {
  logoutUser()
  router.push('/admin/login')
}
</script>
