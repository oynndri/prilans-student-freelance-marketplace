<template>
  <div class="space-y-7">
    <!-- Top Governance Welcome Banner with Current Date & Refresh Data -->
    <div class="bg-white rounded-2xl p-6 sm:p-7 border border-neutral-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 mb-2">
          <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-[11px] font-bold">
            <ShieldAlert class="w-3.5 h-3.5" />
            <span>Platform Governance Console</span>
          </span>
          <span class="text-xs text-neutral-400 font-medium">
            {{ currentDate }}
          </span>
        </div>
        <h1 class="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
          Welcome, System Administrator
        </h1>
        <p class="text-xs text-neutral-500 mt-0.5">
          Real-time oversight of verified students, client organizations, published projects, and applications.
        </p>
      </div>

      <div class="flex items-center gap-2.5">
        <button
          @click="handleRefresh"
          type="button"
          class="px-3.5 py-2 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition flex items-center gap-1.5 cursor-pointer"
          :class="{ 'opacity-60': isRefreshing }"
        >
          <RotateCw class="w-3.5 h-3.5 text-neutral-500" :class="{ 'animate-spin': isRefreshing }" />
          <span>{{ isRefreshing ? 'Refreshing...' : 'Refresh Data' }}</span>
        </button>

        <router-link
          to="/admin/projects"
          class="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-semibold transition shadow-xs flex items-center gap-1.5"
        >
          <EyeOff class="w-4 h-4 text-red-400" />
          <span>Moderate Projects</span>
        </router-link>
      </div>
    </div>

    <!-- 7 Summary KPI Metric Cards (Calculated directly from localStorage records) -->
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3.5">
      <!-- Total Students -->
      <div class="bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200/90 shadow-2xs space-y-1">
        <div class="flex items-center justify-between text-neutral-400">
          <span class="text-[11px] font-bold uppercase tracking-wider text-neutral-500">Students</span>
          <GraduationCap class="w-4 h-4 text-blue-600" />
        </div>
        <div class="text-2xl font-black text-neutral-900">{{ metrics.totalStudents }}</div>
        <p class="text-[10px] text-neutral-400">Enrolled learners</p>
      </div>

      <!-- Total Clients -->
      <div class="bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200/90 shadow-2xs space-y-1">
        <div class="flex items-center justify-between text-neutral-400">
          <span class="text-[11px] font-bold uppercase tracking-wider text-neutral-500">Clients</span>
          <Building class="w-4 h-4 text-indigo-600" />
        </div>
        <div class="text-2xl font-black text-neutral-900">{{ metrics.totalClients }}</div>
        <p class="text-[10px] text-neutral-400">Hiring employers</p>
      </div>

      <!-- Total Projects -->
      <div class="bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200/90 shadow-2xs space-y-1">
        <div class="flex items-center justify-between text-neutral-400">
          <span class="text-[11px] font-bold uppercase tracking-wider text-neutral-500">Projects</span>
          <Briefcase class="w-4 h-4 text-neutral-700" />
        </div>
        <div class="text-2xl font-black text-neutral-900">{{ metrics.totalProjects }}</div>
        <p class="text-[10px] text-neutral-400">All opportunities</p>
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
        <p class="text-[10px] text-neutral-400">Total student bids</p>
      </div>

      <!-- Pending Applications -->
      <div class="bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200/90 shadow-2xs space-y-1">
        <div class="flex items-center justify-between text-amber-600">
          <span class="text-[11px] font-bold uppercase tracking-wider text-neutral-500">Pending</span>
          <Clock class="w-4 h-4" />
        </div>
        <div class="text-2xl font-black text-amber-600">{{ metrics.pendingApplications }}</div>
        <p class="text-[10px] text-neutral-400">Awaiting decision</p>
      </div>

      <!-- Platform Reviews KPI -->
      <div class="bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200/90 shadow-2xs space-y-1 col-span-2 md:col-span-1">
        <div class="flex items-center justify-between text-amber-500">
          <span class="text-[11px] font-bold uppercase tracking-wider text-neutral-500">Reviews</span>
          <Star class="w-4 h-4 fill-amber-400 text-amber-400" />
        </div>
        <div class="text-2xl font-black text-neutral-900">{{ platformStats.totalReviews }}</div>
        <p class="text-[10px] text-neutral-400">Avg {{ platformStats.formattedRating }}★</p>
      </div>
    </div>

    <!-- Section D: Project Status Overview Bar -->
    <div class="bg-white rounded-2xl p-6 border border-neutral-200/90 shadow-2xs space-y-3">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xs font-bold uppercase tracking-wider text-neutral-500">
            Project Status Overview
          </h2>
          <p class="text-xs text-neutral-400">Distribution of platform listings across lifecycle statuses.</p>
        </div>
        <span class="text-xs font-bold text-neutral-700">{{ projectStatusBreakdown.total }} Total</span>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
        <div class="p-3.5 rounded-xl bg-green-50/70 border border-green-200/60 flex items-center justify-between">
          <div>
            <span class="text-[11px] font-bold text-green-700 uppercase block">Open</span>
            <span class="text-lg font-black text-green-900">{{ projectStatusBreakdown.open }}</span>
          </div>
          <span class="w-2.5 h-2.5 rounded-full bg-green-600"></span>
        </div>

        <div class="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/60 flex items-center justify-between">
          <div>
            <span class="text-[11px] font-bold text-amber-700 uppercase block">Draft</span>
            <span class="text-lg font-black text-amber-900">{{ projectStatusBreakdown.draft }}</span>
          </div>
          <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
        </div>

        <div class="p-3.5 rounded-xl bg-neutral-100/70 border border-neutral-200 flex items-center justify-between">
          <div>
            <span class="text-[11px] font-bold text-neutral-600 uppercase block">Paused</span>
            <span class="text-lg font-black text-neutral-800">{{ projectStatusBreakdown.paused }}</span>
          </div>
          <span class="w-2.5 h-2.5 rounded-full bg-neutral-400"></span>
        </div>

        <div class="p-3.5 rounded-xl bg-red-50/70 border border-red-200/60 flex items-center justify-between">
          <div>
            <span class="text-[11px] font-bold text-red-700 uppercase block">Closed</span>
            <span class="text-lg font-black text-red-900">{{ projectStatusBreakdown.closed }}</span>
          </div>
          <span class="w-2.5 h-2.5 rounded-full bg-red-500"></span>
        </div>
      </div>
    </div>

    <!-- Management Grids: Recent Registrations & Projects -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Section A: Recent Student Registrations -->
      <div class="bg-white rounded-2xl p-6 border border-neutral-200/90 shadow-2xs space-y-4">
        <div class="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div>
            <h2 class="text-sm font-bold text-neutral-900">Recent Student Registrations</h2>
            <p class="text-xs text-neutral-400">Newly joined student talent.</p>
          </div>
          <router-link to="/admin/students" class="text-xs font-semibold text-blue-600 hover:underline">
            Manage Students →
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
                <div class="text-[11px] text-neutral-400 truncate">{{ s.university }} • {{ s.email }}</div>
              </div>
            </div>

            <div class="flex items-center gap-2 shrink-0">
              <span class="text-[11px] text-neutral-400">{{ formatDate(s.createdAt) }}</span>
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

      <!-- Section B: Recent Projects -->
      <div class="bg-white rounded-2xl p-6 border border-neutral-200/90 shadow-2xs space-y-4">
        <div class="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div>
            <h2 class="text-sm font-bold text-neutral-900">Recent Projects</h2>
            <p class="text-xs text-neutral-400">Published and drafted opportunities.</p>
          </div>
          <router-link to="/admin/projects" class="text-xs font-semibold text-blue-600 hover:underline">
            Manage Projects →
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
              <div class="text-[11px] text-neutral-400">
                Budget: <span class="text-neutral-700 font-semibold">{{ p.priceDisplay }}</span>
                • {{ p.category }}
              </div>
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

    <!-- Section C: Recent Applications Lifecycle Table -->
    <div class="bg-white rounded-2xl p-6 border border-neutral-200/90 shadow-2xs space-y-4">
      <div class="flex items-center justify-between border-b border-neutral-100 pb-3">
        <div>
          <h2 class="text-sm font-bold text-neutral-900">Recent Applications</h2>
          <p class="text-xs text-neutral-400">Candidate proposal submissions and current status.</p>
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
              <th class="py-2.5 px-3">Applied Date</th>
              <th class="py-2.5 px-3">Quote</th>
              <th class="py-2.5 px-3">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-100">
            <tr v-for="app in recentApplications" :key="app.id" class="hover:bg-neutral-50/50">
              <td class="py-2.5 px-3 font-semibold text-neutral-900">{{ app.studentName }}</td>
              <td class="py-2.5 px-3 truncate max-w-xs">{{ app.projectTitle }}</td>
              <td class="py-2.5 px-3 text-neutral-400">{{ formatDate(app.appliedAt) }}</td>
              <td class="py-2.5 px-3 font-medium text-neutral-800">{{ app.proposedBudget }}</td>
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

    <!-- Section E: Platform Reviews & Feedback Oversight -->
    <div class="bg-white rounded-2xl p-6 border border-neutral-200/90 shadow-2xs space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-3">
        <div>
          <div class="flex items-center gap-2">
            <h2 class="text-sm font-bold text-neutral-900">Recent Ratings & Reviews Oversight</h2>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
              Avg {{ platformStats.formattedRating }}★ • {{ platformStats.totalReviews }} Feedbacks
            </span>
          </div>
          <p class="text-xs text-neutral-400">Monitoring quality of feedback between students and clients across completed projects.</p>
        </div>

        <div class="flex items-center gap-2">
          <StarRating :model-value="platformStats.averageRating" :readonly="true" size="sm" />
          <span class="text-xs font-black text-neutral-800">{{ platformStats.formattedRating }} / 5.0</span>
        </div>
      </div>

      <div v-if="recentReviews.length > 0" class="divide-y divide-neutral-100">
        <div
          v-for="rev in recentReviews"
          :key="rev.id"
          class="py-3.5 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
        >
          <div class="space-y-1 min-w-0 flex-1">
            <div class="flex items-center gap-2">
              <span class="font-bold text-neutral-900">{{ rev.reviewerName }}</span>
              <span class="px-1.5 py-0.2 rounded text-[10px] font-semibold uppercase tracking-wider bg-neutral-100 text-neutral-600">
                {{ rev.reviewerRole }}
              </span>
              <span class="text-neutral-400 text-[11px]">reviewed</span>
              <span class="font-bold text-neutral-800">{{ rev.revieweeName }}</span>
              <span class="px-1.5 py-0.2 rounded text-[10px] font-semibold uppercase tracking-wider bg-neutral-100 text-neutral-600">
                {{ rev.revieweeRole }}
              </span>
            </div>
            <p class="text-neutral-600 italic line-clamp-1 bg-neutral-50 px-2.5 py-1 rounded-lg border border-neutral-100">
              "{{ rev.comment }}"
            </p>
            <div class="text-[11px] text-neutral-400">
              Project: <strong class="text-neutral-700">{{ rev.projectTitle }}</strong>
            </div>
          </div>

          <div class="flex items-center gap-3 shrink-0 self-end md:self-auto">
            <div class="text-right">
              <StarRating :model-value="rev.rating" :readonly="true" size="sm" />
              <span class="text-[10px] text-neutral-400 block mt-0.5">{{ formatDate(rev.createdAt) }}</span>
            </div>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-200">
              Verified
            </span>
          </div>
        </div>
      </div>

      <div v-else class="p-8 text-center text-xs text-neutral-400">
        No platform reviews submitted yet.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  GraduationCap,
  Building,
  Briefcase,
  CheckCircle2,
  FileText,
  Clock,
  ShieldAlert,
  RotateCw,
  EyeOff,
  Star
} from 'lucide-vue-next'
import { getRegisteredUsers } from '../../data/auth'
import { projectState } from '../../data/projectService'
import { applicationState } from '../../data/applicationService'
import { reviewState, platformRatingStats } from '../../data/reviewService'
import StarRating from '../../components/StarRating.vue'

const isRefreshing = ref(false)

const currentDate = computed(() => {
  return new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const handleRefresh = () => {
  isRefreshing.value = true
  setTimeout(() => {
    isRefreshing.value = false
  }, 400)
}

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

const projectStatusBreakdown = computed(() => {
  const all = projectState.projects
  return {
    total: all.length,
    open: all.filter(p => !p.status || p.status === 'Open').length,
    draft: all.filter(p => p.status === 'Draft').length,
    paused: all.filter(p => p.status === 'Paused').length,
    closed: all.filter(p => p.status === 'Closed').length
  }
})

const recentStudents = computed(() => allStudents.value.slice(0, 5))
const recentProjects = computed(() => projectState.projects.slice(0, 5))
const recentApplications = computed(() => applicationState.applications.slice(0, 5))
const recentReviews = computed(() => reviewState.reviews.slice(0, 5))
const platformStats = computed(() => platformRatingStats.value)

const formatDate = (dateStr) => {
  if (!dateStr) return 'Recently'
  try {
    return new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
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
