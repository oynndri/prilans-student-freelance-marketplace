<template>
  <div class="space-y-6">
    <!-- Welcome Header & Profile Strength -->
    <div class="bg-white rounded-2xl p-6 sm:p-7 border border-neutral-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
      <div class="flex items-center gap-4">
        <div class="relative w-16 h-16 rounded-full overflow-hidden border-2 border-neutral-200 shrink-0">
          <img :src="student.avatar" :alt="student.fullName" class="w-full h-full object-cover" />
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
              Welcome back, {{ student.fullName }}!
            </h1>
            <span class="inline-flex items-center gap-1 text-[11px] font-semibold text-[#16a34a] bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
              <CheckCircle2 class="w-3 h-3" />
              Verified Student
            </span>
          </div>
          <p class="text-xs text-neutral-500 mt-0.5">
            {{ student.department }} • {{ student.university }}
          </p>
          <p class="text-[11px] text-neutral-400 mt-1">
            Track your proposals, review matching opportunities, and level up your freelance career.
          </p>
        </div>
      </div>

      <!-- Profile Strength Gauge & Setup Wizard Link -->
      <div class="w-full md:w-64 bg-neutral-50 p-4 rounded-xl border border-neutral-200/80 shrink-0">
        <div class="flex justify-between items-center text-xs font-semibold mb-1.5">
          <span class="text-neutral-700">Profile Strength</span>
          <span class="text-[#16a34a] font-bold">{{ profileCompletionPercentage }}%</span>
        </div>
        <div class="w-full bg-neutral-200 h-2 rounded-full overflow-hidden mb-2">
          <div
            class="bg-[#16a34a] h-full transition-all duration-500 rounded-full"
            :style="{ width: `${profileCompletionPercentage}%` }"
          ></div>
        </div>
        <div class="flex justify-between items-center text-[10px]">
          <span class="text-neutral-400">Complete more portfolio items</span>
          <router-link to="/profile" class="text-blue-600 font-bold hover:underline">
            Edit Profile →
          </router-link>
        </div>
      </div>
    </div>

    <!-- Quick Status Overview Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-2xs space-y-1">
        <div class="flex items-center justify-between text-neutral-400">
          <span class="text-xs font-semibold uppercase tracking-wider text-neutral-500">My Proposals</span>
          <FileText class="w-4 h-4 text-neutral-700" />
        </div>
        <div class="text-2xl font-extrabold text-neutral-900">{{ appMetrics.total }}</div>
        <p class="text-[11px] text-neutral-400">Total submitted applications</p>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-2xs space-y-1">
        <div class="flex items-center justify-between text-amber-500">
          <span class="text-xs font-semibold uppercase tracking-wider text-neutral-500">Under Review</span>
          <Clock class="w-4 h-4" />
        </div>
        <div class="text-2xl font-extrabold text-amber-600">{{ appMetrics.pending }}</div>
        <p class="text-[11px] text-neutral-400">Pending client decision</p>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-2xs space-y-1">
        <div class="flex items-center justify-between text-[#16a34a]">
          <span class="text-xs font-semibold uppercase tracking-wider text-neutral-500">Gigs Landed</span>
          <CheckCircle2 class="w-4 h-4" />
        </div>
        <div class="text-2xl font-extrabold text-[#16a34a]">{{ appMetrics.accepted }}</div>
        <p class="text-[11px] text-neutral-400">Accepted client proposals</p>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-2xs space-y-1">
        <div class="flex items-center justify-between text-blue-600">
          <span class="text-xs font-semibold uppercase tracking-wider text-neutral-500">Live Projects</span>
          <Search class="w-4 h-4" />
        </div>
        <div class="text-2xl font-extrabold text-blue-600">{{ availableCount }}</div>
        <p class="text-[11px] text-neutral-400">Open student opportunities</p>
      </div>
    </div>

    <!-- Main Grid: Recommended Projects & Recent Applications -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Recommended Projects (2 Cols) -->
      <div class="lg:col-span-2 space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-base font-extrabold text-neutral-900 tracking-tight">
                Recommended For You
              </h2>
              <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                <Sparkles class="w-3 h-3 text-emerald-600" />
                <span>Smart Match</span>
              </span>
            </div>
            <p class="text-xs text-neutral-400">
              Matched with your skills: <span class="text-neutral-700 font-medium">{{ student.skills?.slice(0, 4).join(', ') }}</span>
            </p>
          </div>
          <router-link
            to="/student/recommendations"
            class="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100/70 px-3 py-1.5 rounded-xl border border-emerald-200/80 transition"
          >
            <span>View All Matches ({{ recommendedProjects.length }})</span>
            <ChevronRight class="w-3.5 h-3.5" />
          </router-link>
        </div>

        <!-- Project Grid preview with Match Badges -->
        <div v-if="recommendedProjects.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="project in recommendedProjects.slice(0, 4)"
            :key="project.id"
            class="bg-white rounded-2xl border border-neutral-200/90 shadow-2xs hover:shadow-md transition p-4 sm:p-5 flex flex-col justify-between space-y-3 relative group"
          >
            <!-- Match Badge Top -->
            <div class="flex items-center justify-between gap-2">
              <span
                class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border"
                :class="project.matchDetails.badgeClass"
              >
                <span>{{ project.matchDetails.matchPercentage }}% Match</span>
                <span class="opacity-50">•</span>
                <span>{{ project.matchDetails.tierLabel }}</span>
              </span>

              <span class="text-xs font-bold text-neutral-900">
                {{ project.priceDisplay }}
              </span>
            </div>

            <!-- Title & Category -->
            <div class="space-y-1">
              <div class="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                {{ project.category }}
              </div>
              <router-link
                :to="`/projects/${project.id}`"
                class="font-black text-neutral-900 hover:text-emerald-700 transition text-sm sm:text-base line-clamp-1 block"
              >
                {{ project.title }}
              </router-link>
              <p class="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                {{ project.description }}
              </p>
            </div>

            <!-- Matched vs Missing preview -->
            <div class="p-2.5 rounded-xl bg-[#f8fafc] border border-neutral-100 space-y-1.5">
              <div class="text-[11px] text-neutral-600 font-semibold flex items-center justify-between">
                <span>Skill Match:</span>
                <span class="text-emerald-700 font-bold">
                  {{ project.matchDetails.matchedCount }}/{{ project.matchDetails.totalRequired }} matched
                </span>
              </div>
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="s in project.matchDetails.matchedSkills.slice(0, 3)"
                  :key="s"
                  class="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100/80 text-emerald-800"
                >
                  ✓ {{ s }}
                </span>
                <span
                  v-if="project.matchDetails.missingSkills.length > 0"
                  class="px-1.5 py-0.5 rounded text-[10px] text-neutral-400 bg-neutral-100"
                >
                  +{{ project.matchDetails.missingSkills.length }} more
                </span>
              </div>
            </div>

            <!-- Footer Action -->
            <div class="pt-1 flex items-center justify-between border-t border-neutral-100">
              <span class="text-[11px] text-neutral-400">
                {{ project.country || 'Remote' }}
              </span>
              <router-link
                :to="`/projects/${project.id}/apply`"
                class="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-neutral-900 text-white hover:bg-black transition flex items-center gap-1"
              >
                <span>Apply</span>
                <ChevronRight class="w-3 h-3" />
              </router-link>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-else class="bg-white rounded-2xl border border-neutral-200/90 p-8 text-center space-y-2">
          <p class="text-xs text-neutral-500">No project recommendations matched your current skill set.</p>
          <router-link to="/profile" class="text-xs font-bold text-emerald-700 hover:underline inline-block">
            Update your profile skills to view recommendations →
          </router-link>
        </div>
      </div>

      <!-- Right Column: Recent Applications & Quick Shortcuts -->
      <div class="space-y-6">
        <!-- Recent Applications -->
        <div class="bg-white rounded-2xl p-5 border border-neutral-200/90 shadow-2xs space-y-3">
          <div class="flex items-center justify-between border-b border-neutral-100 pb-2.5">
            <h3 class="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Recent Proposals
            </h3>
            <router-link to="/my-applications" class="text-xs font-semibold text-blue-600 hover:underline">
              View all
            </router-link>
          </div>

          <div v-if="recentApplications.length > 0" class="divide-y divide-neutral-100">
            <div
              v-for="app in recentApplications"
              :key="app.id"
              class="py-2.5 first:pt-0 last:pb-0 space-y-1 text-xs"
            >
              <div class="flex justify-between items-start gap-2">
                <router-link :to="`/projects/${app.projectId}`" class="font-bold text-neutral-900 hover:underline truncate">
                  {{ app.projectTitle }}
                </router-link>
                <span
                  class="px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0"
                  :class="statusBadgeClass(app.status)"
                >
                  {{ app.status }}
                </span>
              </div>
              <div class="text-[11px] text-neutral-400 flex justify-between">
                <span>{{ app.proposedBudget }}</span>
                <span>Applied {{ formatDate(app.appliedAt) }}</span>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-6 text-neutral-400 text-xs">
            No applications submitted yet.
            <router-link to="/student/projects" class="text-blue-600 font-semibold block mt-1 hover:underline">
              Apply to your first project →
            </router-link>
          </div>
        </div>

        <!-- Quick Links Card -->
        <div class="bg-white rounded-2xl p-5 border border-neutral-200/90 shadow-2xs space-y-2">
          <h3 class="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
            Quick Actions
          </h3>
          <router-link
            to="/student/projects"
            class="flex items-center justify-between p-3 rounded-xl border border-neutral-200/80 hover:bg-neutral-50 transition text-xs font-semibold text-neutral-800"
          >
            <span class="flex items-center gap-2">
              <Search class="w-4 h-4 text-[#16a34a]" />
              <span>Explore Marketplace Projects</span>
            </span>
            <ChevronRight class="w-3.5 h-3.5 text-neutral-400" />
          </router-link>

          <router-link
            to="/profile"
            class="flex items-center justify-between p-3 rounded-xl border border-neutral-200/80 hover:bg-neutral-50 transition text-xs font-semibold text-neutral-800"
          >
            <span class="flex items-center gap-2">
              <UserCheck class="w-4 h-4 text-blue-600" />
              <span>Update Skills & Portfolio</span>
            </span>
            <ChevronRight class="w-3.5 h-3.5 text-neutral-400" />
          </router-link>

          <router-link
            to="/my-applications"
            class="flex items-center justify-between p-3 rounded-xl border border-neutral-200/80 hover:bg-neutral-50 transition text-xs font-semibold text-neutral-800"
          >
            <span class="flex items-center gap-2">
              <FileText class="w-4 h-4 text-[#7c3aed]" />
              <span>Check Proposal Statuses</span>
            </span>
            <ChevronRight class="w-3.5 h-3.5 text-neutral-400" />
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  CheckCircle2,
  FileText,
  Clock,
  Search,
  ChevronRight,
  UserCheck,
  Sparkles
} from 'lucide-vue-next'
import { authState, profileCompletionPercentage } from '../../data/auth'
import { studentAvailableProjects } from '../../data/projectService'
import { getApplicationsByStudent } from '../../data/applicationService'
import { getRecommendedProjects } from '../../data/recommendationService'
import ProjectCard from '../../components/ProjectCard.vue'

const student = computed(() => authState.currentUser)

const myApps = computed(() => getApplicationsByStudent(student.value?.id || 'student-akmal'))

const appMetrics = computed(() => {
  const all = myApps.value
  return {
    total: all.length,
    pending: all.filter(a => a.status === 'Pending').length,
    accepted: all.filter(a => a.status === 'Accepted').length,
    rejected: all.filter(a => a.status === 'Rejected').length
  }
})

const availableCount = computed(() => studentAvailableProjects.value.length)

// Algorithmic skill-matched recommended projects
const recommendedProjects = computed(() => {
  return getRecommendedProjects(student.value, { sortBy: 'match_desc' })
})

const recentApplications = computed(() => {
  return myApps.value.slice(0, 4)
})

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
