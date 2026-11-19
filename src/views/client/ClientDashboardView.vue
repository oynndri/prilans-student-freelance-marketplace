<template>
  <div class="space-y-6">
    <!-- Welcome Header & Quick Action -->
    <div class="bg-white rounded-2xl p-6 sm:p-7 border border-neutral-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div>
        <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-semibold mb-2">
          <span>Client Organization Portal</span>
        </div>
        <h1 class="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
          Welcome back, {{ client.fullName }}!
        </h1>
        <p class="text-xs text-neutral-500 mt-0.5">
          {{ client.company }} • {{ client.location }} • Manage and publish opportunities for university student talent.
        </p>
      </div>

      <router-link
        to="/client/projects/new"
        class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0f172a] text-white text-xs font-semibold hover:bg-black transition shadow-xs cursor-pointer active:scale-[0.98] shrink-0"
      >
        <PlusCircle class="w-4 h-4" />
        <span>Post a New Project</span>
      </router-link>
    </div>

    <!-- Statistics Overview Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-5 gap-4">
      <!-- Total Projects -->
      <div class="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-2xs space-y-1">
        <div class="flex items-center justify-between text-neutral-400">
          <span class="text-xs font-semibold uppercase tracking-wider">Total</span>
          <Briefcase class="w-4 h-4 text-neutral-600" />
        </div>
        <div class="text-2xl font-extrabold text-neutral-900">{{ stats.total }}</div>
        <p class="text-[11px] text-neutral-400">All registered projects</p>
      </div>

      <!-- Active Projects -->
      <div class="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-2xs space-y-1">
        <div class="flex items-center justify-between text-[#16a34a]">
          <span class="text-xs font-semibold uppercase tracking-wider text-neutral-600">Active</span>
          <CheckCircle2 class="w-4 h-4" />
        </div>
        <div class="text-2xl font-extrabold text-[#16a34a]">{{ stats.active }}</div>
        <p class="text-[11px] text-neutral-400">Live on marketplace</p>
      </div>

      <!-- Draft Projects -->
      <div class="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-2xs space-y-1">
        <div class="flex items-center justify-between text-neutral-400">
          <span class="text-xs font-semibold uppercase tracking-wider text-neutral-600">Drafts</span>
          <FileEdit class="w-4 h-4 text-neutral-500" />
        </div>
        <div class="text-2xl font-extrabold text-neutral-800">{{ stats.draft }}</div>
        <p class="text-[11px] text-neutral-400">Unpublished drafts</p>
      </div>

      <!-- Closed Projects -->
      <div class="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-2xs space-y-1">
        <div class="flex items-center justify-between text-neutral-400">
          <span class="text-xs font-semibold uppercase tracking-wider text-neutral-600">Closed</span>
          <Archive class="w-4 h-4 text-neutral-500" />
        </div>
        <div class="text-2xl font-extrabold text-neutral-800">{{ stats.closed }}</div>
        <p class="text-[11px] text-neutral-400">Completed or ended</p>
      </div>

      <!-- Total Student Applications -->
      <div class="col-span-2 lg:col-span-1 bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-2xs space-y-1">
        <div class="flex items-center justify-between text-[#7c3aed]">
          <span class="text-xs font-semibold uppercase tracking-wider text-neutral-600">Applications</span>
          <Users class="w-4 h-4" />
        </div>
        <div class="text-2xl font-extrabold text-[#7c3aed]">{{ stats.proposals }}</div>
        <p class="text-[11px] text-neutral-400">Student submissions</p>
      </div>
    </div>

    <!-- Quick Shortcuts & Recent Projects -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Recent Projects (2 Cols) -->
      <div class="lg:col-span-2 bg-white rounded-2xl p-6 border border-neutral-200/90 shadow-2xs space-y-4">
        <div class="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div>
            <h2 class="text-sm font-bold text-neutral-900">Recent Projects</h2>
            <p class="text-xs text-neutral-400">Latest projects created by your organization.</p>
          </div>
          <router-link to="/client/projects" class="text-xs font-semibold text-neutral-700 hover:text-black flex items-center gap-1">
            <span>View All</span>
            <ChevronRight class="w-3.5 h-3.5" />
          </router-link>
        </div>

        <div v-if="recentProjects.length > 0" class="divide-y divide-neutral-100">
          <div
            v-for="proj in recentProjects"
            :key="proj.id"
            class="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div class="min-w-0 flex-1 space-y-1">
              <div class="flex items-center gap-2">
                <router-link
                  :to="`/client/projects/${proj.id}`"
                  class="text-xs font-bold text-neutral-900 hover:text-blue-600 truncate"
                >
                  {{ proj.title }}
                </router-link>
                <span
                  class="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                  :class="statusBadgeClass(proj.status || 'Open')"
                >
                  {{ proj.status || 'Open' }}
                </span>
              </div>
              <div class="flex flex-wrap items-center gap-3 text-[11px] text-neutral-400">
                <span>{{ proj.category }}</span>
                <span>•</span>
                <span>{{ proj.priceDisplay }}</span>
                <span>•</span>
                <span>{{ proj.postedTime || 'Recently' }}</span>
              </div>
            </div>

            <div class="flex items-center gap-2 shrink-0">
              <router-link
                :to="`/client/projects/${proj.id}`"
                class="px-3 py-1.5 rounded-lg border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition"
              >
                View
              </router-link>
              <router-link
                :to="`/client/projects/${proj.id}/edit`"
                class="px-3 py-1.5 rounded-lg bg-neutral-900 text-white text-xs font-semibold hover:bg-black transition"
              >
                Edit
              </router-link>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-12 text-neutral-400 text-xs space-y-3">
          <p>No projects created yet.</p>
          <router-link
            to="/client/projects/new"
            class="inline-block px-4 py-2 rounded-xl bg-neutral-900 text-white font-semibold text-xs"
          >
            Create your first project
          </router-link>
        </div>
      </div>

      <!-- Quick Shortcuts & Marketplace Tips -->
      <div class="space-y-6">
        <!-- Shortcuts Card -->
        <div class="bg-white rounded-2xl p-5 border border-neutral-200/90 shadow-2xs space-y-3">
          <h3 class="text-xs font-bold uppercase tracking-wider text-neutral-500">
            Project Shortcuts
          </h3>
          <div class="space-y-2">
            <router-link
              to="/client/projects/new"
              class="flex items-center justify-between p-3 rounded-xl border border-neutral-200/80 hover:bg-neutral-50 transition text-xs font-semibold text-neutral-800"
            >
              <span class="flex items-center gap-2">
                <PlusCircle class="w-4 h-4 text-[#16a34a]" />
                <span>Publish New Project</span>
              </span>
              <ChevronRight class="w-3.5 h-3.5 text-neutral-400" />
            </router-link>

            <router-link
              to="/client/projects"
              class="flex items-center justify-between p-3 rounded-xl border border-neutral-200/80 hover:bg-neutral-50 transition text-xs font-semibold text-neutral-800"
            >
              <span class="flex items-center gap-2">
                <ListFilter class="w-4 h-4 text-blue-600" />
                <span>Manage Project Listings</span>
              </span>
              <ChevronRight class="w-3.5 h-3.5 text-neutral-400" />
            </router-link>

            <router-link
              to="/"
              class="flex items-center justify-between p-3 rounded-xl border border-neutral-200/80 hover:bg-neutral-50 transition text-xs font-semibold text-neutral-800"
            >
              <span class="flex items-center gap-2">
                <Globe class="w-4 h-4 text-[#7c3aed]" />
                <span>Browse Student View</span>
              </span>
              <ChevronRight class="w-3.5 h-3.5 text-neutral-400" />
            </router-link>
          </div>
        </div>

        <!-- Client Rating & Reputation Card -->
        <div class="bg-white rounded-2xl p-5 border border-neutral-200/90 shadow-2xs space-y-3">
          <div class="flex items-center justify-between border-b border-neutral-100 pb-2.5">
            <h3 class="text-xs font-bold uppercase tracking-wider text-neutral-500">Company Reputation</h3>
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Student Reviews
            </span>
          </div>

          <div class="flex items-center justify-between gap-3">
            <div>
              <span class="text-2xl font-black text-neutral-900 block leading-tight">
                {{ clientRatingStats.formattedRating }}
              </span>
              <div class="flex items-center gap-1.5 mt-0.5">
                <StarRating :model-value="clientRatingStats.averageRating" :readonly="true" size="sm" />
                <span class="text-[11px] text-neutral-400 font-medium">
                  ({{ clientRatingStats.totalReviews }})
                </span>
              </div>
            </div>
            <router-link
              to="/client/reviews"
              class="text-xs font-semibold text-blue-600 hover:underline"
            >
              View Feedbacks →
            </router-link>
          </div>
        </div>

        <!-- Hiring Student Freelancers Tip Card -->
        <div class="bg-gradient-to-br from-[#0f172a] to-neutral-900 text-white rounded-2xl p-5 shadow-xs space-y-2">
          <span class="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/10 text-emerald-400">
            Pro Hiring Tip
          </span>
          <h4 class="text-xs font-bold">Fast-Track University Talent</h4>
          <p class="text-[11px] text-neutral-300 leading-relaxed">
            University students excel with clearly defined requirements, responsive design scopes, and modern tech stacks (Vue 3, Tailwind, Python).
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  PlusCircle,
  Briefcase,
  CheckCircle2,
  FileEdit,
  Archive,
  Users,
  ChevronRight,
  ListFilter,
  Globe
} from 'lucide-vue-next'
import { authState } from '../../data/auth'
import { projectState } from '../../data/projectService'
import { getReviewsForClient, calculateRatingMetrics } from '../../data/reviewService'
import StarRating from '../../components/StarRating.vue'

const client = computed(() => authState.currentUser)

const clientReviews = computed(() => {
  return getReviewsForClient(client.value?.id || 'client-techcorp')
})

const clientRatingStats = computed(() => {
  return calculateRatingMetrics(clientReviews.value)
})

const clientProjects = computed(() => {
  return projectState.projects.filter(p => p.clientId === client.value.id || !p.clientId)
})

const stats = computed(() => {
  const all = clientProjects.value
  const active = all.filter(p => !p.status || p.status === 'Open').length
  const draft = all.filter(p => p.status === 'Draft').length
  const closed = all.filter(p => p.status === 'Closed' || p.status === 'Paused').length
  const proposals = all.reduce((sum, p) => sum + (p.proposalCount || 0), 0)

  return {
    total: all.length,
    active,
    draft,
    closed,
    proposals
  }
})

const recentProjects = computed(() => {
  return clientProjects.value.slice(0, 5)
})

const statusBadgeClass = (status) => {
  switch (status) {
    case 'Open':
      return 'bg-green-50 text-green-700 border border-green-200'
    case 'Draft':
      return 'bg-amber-50 text-amber-700 border border-amber-200'
    case 'Paused':
      return 'bg-neutral-100 text-neutral-600 border border-neutral-300'
    case 'Closed':
      return 'bg-red-50 text-red-600 border border-red-200'
    default:
      return 'bg-green-50 text-green-700 border border-green-200'
  }
}
</script>
