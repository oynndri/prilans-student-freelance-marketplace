<template>
  <div class="space-y-7">
    <!-- Top Governance Welcome Banner -->
    <div class="bg-white rounded-2xl p-6 sm:p-7 border border-neutral-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-[11px] font-bold mb-2">
          <span>Prilans Governance Console</span>
        </div>
        <h1 class="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
          Admin Platform Overview
        </h1>
        <p class="text-xs text-neutral-500 mt-0.5">
          Real-time platform metrics derived dynamically from verified student registrations, client listings, and active applications.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <router-link
          to="/admin/projects"
          class="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-semibold transition shadow-xs flex items-center gap-1.5"
        >
          <ShieldAlert class="w-4 h-4 text-red-400" />
          <span>Moderate Projects</span>
        </router-link>
      </div>
    </div>

    <!-- 6 Summary KPI Metric Cards -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
      <!-- Total Students -->
      <div class="bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200/90 shadow-2xs space-y-1">
        <div class="flex items-center justify-between text-neutral-400">
          <span class="text-[11px] font-bold uppercase tracking-wider text-neutral-500">Students</span>
          <GraduationCap class="w-4 h-4 text-blue-600" />
        </div>
        <div class="text-2xl font-black text-neutral-900">{{ metrics.totalStudents }}</div>
        <p class="text-[10px] text-neutral-400">Verified learners</p>
      </div>

      <!-- Total Clients -->
      <div class="bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200/90 shadow-2xs space-y-1">
        <div class="flex items-center justify-between text-neutral-400">
          <span class="text-[11px] font-bold uppercase tracking-wider text-neutral-500">Clients</span>
          <Building class="w-4 h-4 text-indigo-600" />
        </div>
        <div class="text-2xl font-black text-neutral-900">{{ metrics.totalClients }}</div>
        <p class="text-[10px] text-neutral-400">Hiring organizations</p>
      </div>

      <!-- Total Projects -->
      <div class="bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200/90 shadow-2xs space-y-1">
        <div class="flex items-center justify-between text-neutral-400">
          <span class="text-[11px] font-bold uppercase tracking-wider text-neutral-500">Projects</span>
          <Briefcase class="w-4 h-4 text-neutral-700" />
        </div>
        <div class="text-2xl font-black text-neutral-900">{{ metrics.totalProjects }}</div>
        <p class="text-[10px] text-neutral-400">All registered listings</p>
      </div>

      <!-- Active Projects -->
      <div class="bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200/90 shadow-2xs space-y-1">
        <div class="flex items-center justify-between text-[#16a34a]">
          <span class="text-[11px] font-bold uppercase tracking-wider text-neutral-500">Active</span>
          <CheckCircle2 class="w-4 h-4" />
        </div>
        <div class="text-2xl font-black text-[#16a34a]">{{ metrics.activeProjects }}</div>
        <p class="text-[10px] text-neutral-400">Marketplace visible</p>
      </div>

      <!-- Total Applications -->
      <div class="bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200/90 shadow-2xs space-y-1">
        <div class="flex items-center justify-between text-[#7c3aed]">
          <span class="text-[11px] font-bold uppercase tracking-wider text-neutral-500">Proposals</span>
          <FileText class="w-4 h-4" />
        </div>
        <div class="text-2xl font-black text-[#7c3aed]">{{ metrics.totalApplications }}</div>
        <p class="text-[10px] text-neutral-400">Submitted bids</p>
      </div>

      <!-- Pending Applications -->
      <div class="bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200/90 shadow-2xs space-y-1">
        <div class="flex items-center justify-between text-amber-600">
          <span class="text-[11px] font-bold uppercase tracking-wider text-neutral-500">Pending</span>
          <Clock class="w-4 h-4" />
        </div>
        <div class="text-2xl font-black text-amber-600">{{ metrics.pendingApplications }}</div>
        <p class="text-[10px] text-neutral-400">Awaiting client decision</p>
      </div>
    </div>

    <!-- Management Grids: Recent Registrations & Applications -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 1. Recent Student Registrations -->
      <div class="bg-white rounded-2xl p-6 border border-neutral-200/90 shadow-2xs space-y-4">
        <div class="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div>
            <h2 class="text-sm font-bold text-neutral-900">Recent Student Registrations</h2>
            <p class="text-xs text-neutral-400">Latest students onboarded onto Prilans.</p>
          </div>
          <router-link to="/admin/students" class="text-xs font-semibold text-blue-600 hover:underline">
            Manage All Students →
          </router-link>
        </div>

        <div class="divide-y divide-neutral-100">
          <div
            v-for="s in recentStudents"
            :key="s.id"
            class="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3 text-xs"
          >
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-9 h-9 rounded-full overflow-hidden bg-neutral-100 border border-neutral-200 shrink-0">
                <img :src="s.avatar" :alt="s.fullName" class="w-full h-full object-cover" />
              </div>
              <div class="min-w-0 flex-1">
                <div class="font-bold text-neutral-900 truncate">{{ s.fullName }}</div>
                <div class="text-[11px] text-neutral-400 truncate">{{ s.department }} • {{ s.university }}</div>
              </div>
            </div>

            <div class="flex items-center gap-2 shrink-0">
              <span
                class="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                :class="s.status === 'suspended' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'"
              >
                {{ s.status || 'active' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. Recently Published Projects -->
      <div class="bg-white rounded-2xl p-6 border border-neutral-200/90 shadow-2xs space-y-4">
        <div class="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div>
            <h2 class="text-sm font-bold text-neutral-900">Recently Published Projects</h2>
            <p class="text-xs text-neutral-400">Monitored client opportunities.</p>
          </div>
          <router-link to="/admin/projects" class="text-xs font-semibold text-blue-600 hover:underline">
            Manage All Projects →
          </router-link>
        </div>

        <div class="divide-y divide-neutral-100">
          <div
            v-for="p in recentProjects"
            :key="p.id"
            class="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3 text-xs"
          >
            <div class="min-w-0 flex-1">
              <div class="font-bold text-neutral-900 truncate">{{ p.title }}</div>
              <div class="text-[11px] text-neutral-400">{{ p.category }} • {{ p.priceDisplay }}</div>
            </div>

            <div class="flex items-center gap-2 shrink-0">
              <span
                v-if="p.isModerated"
                class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700"
              >
                Moderated
              </span>
              <span
                v-else
                class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-50 text-green-700 border border-green-200"
              >
                {{ p.status || 'Open' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. Recent Applications Lifecycle Table -->
    <div class="bg-white rounded-2xl p-6 border border-neutral-200/90 shadow-2xs space-y-4">
      <div class="flex items-center justify-between border-b border-neutral-100 pb-3">
        <div>
          <h2 class="text-sm font-bold text-neutral-900">Recent Student Applications</h2>
          <p class="text-xs text-neutral-400">Real-time candidate submissions and status outcomes.</p>
        </div>
        <router-link to="/admin/applications" class="text-xs font-semibold text-blue-600 hover:underline">
          View All Applications →
        </router-link>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-neutral-600">
          <thead class="bg-neutral-50 text-neutral-400 font-semibold uppercase text-[10px] tracking-wider border-b border-neutral-100">
            <tr>
              <th class="py-2.5 px-3">Student</th>
              <th class="py-2.5 px-3">Project Title</th>
              <th class="py-2.5 px-3">Quote</th>
              <th class="py-2.5 px-3">Applied</th>
              <th class="py-2.5 px-3">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-100">
            <tr v-for="app in recentApplications" :key="app.id" class="hover:bg-neutral-50/50">
              <td class="py-2.5 px-3 font-semibold text-neutral-900">{{ app.studentName }}</td>
              <td class="py-2.5 px-3 truncate max-w-xs">{{ app.projectTitle }}</td>
              <td class="py-2.5 px-3 font-medium">{{ app.proposedBudget }}</td>
              <td class="py-2.5 px-3 text-neutral-400">{{ formatDate(app.appliedAt) }}</td>
              <td class="py-2.5 px-3">
                <span
                  class="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                  :class="statusBadgeClass(app.status)"
                >
                  {{ app.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  GraduationCap,
  Building,
  Briefcase,
  CheckCircle2,
  FileText,
  Clock,
  ShieldAlert
} from 'lucide-vue-next'
import { getRegisteredUsers } from '../../data/auth'
import { projectState } from '../../data/projectService'
import { applicationState } from '../../data/applicationService'

const allUsers = computed(() => getRegisteredUsers())

const allStudents = computed(() => allUsers.value.filter(u => u.role === 'student' || !u.role))
const allClients = computed(() => allUsers.value.filter(u => u.role === 'client'))

const metrics = computed(() => {
  const allProjs = projectState.projects
  const activeProjs = allProjs.filter(p => (!p.status || p.status === 'Open') && !p.isModerated)
  const allApps = applicationState.applications
  const pendingApps = allApps.filter(a => a.status === 'Pending')

  return {
    totalStudents: allStudents.value.length,
    totalClients: allClients.value.length,
    totalProjects: allProjs.length,
    activeProjects: activeProjs.length,
    totalApplications: allApps.length,
    pendingApplications: pendingApps.length
  }
})

const recentStudents = computed(() => allStudents.value.slice(0, 5))
const recentProjects = computed(() => projectState.projects.slice(0, 5))
const recentApplications = computed(() => applicationState.applications.slice(0, 5))

const formatDate = (dateStr) => {
  if (!dateStr) return 'Recently'
  try {
    return new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  } catch (e) {
    return 'Recently'
  }
}

const statusBadgeClass = (status) => {
  switch (status) {
    case 'Accepted':
      return 'bg-green-50 text-green-700 border border-green-200'
    case 'Pending':
      return 'bg-amber-50 text-amber-700 border border-amber-200'
    case 'Rejected':
      return 'bg-red-50 text-red-600 border border-red-200'
    default:
      return 'bg-neutral-100 text-neutral-600'
  }
}
</script>
