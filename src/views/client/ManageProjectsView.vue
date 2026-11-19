<template>
  <div class="space-y-6">
    <!-- Top Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
          Manage Projects
        </h1>
        <p class="text-xs text-neutral-500 mt-0.5">
          Review, pause, edit, and track status for your published student opportunities.
        </p>
      </div>

      <router-link
        to="/client/projects/new"
        class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0f172a] text-white text-xs font-semibold hover:bg-black transition shadow-xs cursor-pointer active:scale-[0.98] self-start sm:self-auto"
      >
        <PlusCircle class="w-4 h-4" />
        <span>Post New Project</span>
      </router-link>
    </div>

    <!-- Filter Bar / Status Tabs -->
    <div class="flex items-center gap-2 border-b border-neutral-200/80 pb-2 overflow-x-auto text-xs">
      <button
        v-for="tab in statusTabs"
        :key="tab.id"
        @click="activeStatusFilter = tab.id"
        class="px-3.5 py-1.5 rounded-lg font-semibold transition cursor-pointer whitespace-nowrap"
        :class="activeStatusFilter === tab.id ? 'bg-neutral-900 text-white shadow-xs' : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/50'"
      >
        {{ tab.label }} ({{ getCountForTab(tab.id) }})
      </button>
    </div>

    <!-- Projects Table / Cards -->
    <div class="bg-white rounded-2xl border border-neutral-200/90 shadow-2xs overflow-hidden">
      <div v-if="filteredProjects.length > 0" class="divide-y divide-neutral-100">
        <div
          v-for="project in filteredProjects"
          :key="project.id"
          class="p-5 hover:bg-neutral-50/60 transition flex flex-col lg:flex-row lg:items-center justify-between gap-4"
        >
          <!-- Left project info -->
          <div class="space-y-2 min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-2">
              <router-link
                :to="`/client/projects/${project.id}`"
                class="text-sm font-bold text-neutral-900 hover:text-blue-600 transition truncate"
              >
                {{ project.title }}
              </router-link>
              <span
                class="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                :class="statusBadgeClass(project.status || 'Open')"
              >
                {{ project.status || 'Open' }}
              </span>
              <span class="text-[11px] text-neutral-400 font-normal">
                {{ project.category }}
              </span>
            </div>

            <!-- Skills preview -->
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="skill in (project.skills || []).slice(0, 5)"
                :key="skill"
                class="px-2 py-0.5 rounded-md bg-neutral-100 border border-neutral-200/60 text-[10px] text-neutral-600 font-medium"
              >
                {{ skill }}
              </span>
              <span
                v-if="(project.skills || []).length > 5"
                class="text-[10px] text-neutral-400 self-center"
              >
                +{{ project.skills.length - 5 }} more
              </span>
            </div>

            <!-- Metadata info -->
            <div class="flex flex-wrap items-center gap-4 text-xs text-neutral-500 pt-1">
              <span class="font-semibold text-neutral-800">{{ project.priceDisplay }}</span>
              <span>•</span>
              <span>{{ project.experienceLevel }}</span>
              <span>•</span>
              <span class="text-neutral-400">Created: {{ formatDate(project.createdAt) }}</span>
              <span>•</span>
              <!-- Direct Applicants Counter with Link -->
              <router-link
                :to="`/client/projects/${project.id}/applicants`"
                class="font-semibold text-blue-600 hover:underline flex items-center gap-1"
              >
                <Users class="w-3.5 h-3.5" />
                <span>{{ getApplicantsCount(project.id) }} Candidate(s)</span>
              </router-link>
            </div>
          </div>

          <!-- Actions toolbar -->
          <div class="flex flex-wrap items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-neutral-100">
            <!-- Find Matching Students (Phase 06 Bonus) -->
            <router-link
              :to="`/client/projects/${project.id}/recommended-students`"
              class="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-bold transition flex items-center gap-1 border border-indigo-200"
              title="Find students matching required skills"
            >
              <Sparkles class="w-3.5 h-3.5 text-indigo-600" />
              <span>Matching Students</span>
            </router-link>

            <!-- View Applicants Button -->
            <router-link
              :to="`/client/projects/${project.id}/applicants`"
              class="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold transition flex items-center gap-1"
            >
              <Users class="w-3.5 h-3.5" />
              <span>Applicants</span>
            </router-link>

            <router-link
              :to="`/client/projects/${project.id}`"
              class="px-3 py-1.5 rounded-lg border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 transition"
            >
              Details
            </router-link>

            <router-link
              :to="`/client/projects/${project.id}/edit`"
              class="px-3 py-1.5 rounded-lg border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 transition"
            >
              Edit
            </router-link>

            <!-- Toggle Pause / Resume -->
            <button
              v-if="project.status === 'Paused'"
              @click="changeStatus(project.id, 'Open')"
              type="button"
              class="px-3 py-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 text-xs font-semibold transition cursor-pointer"
            >
              Resume
            </button>
            <button
              v-else-if="project.status === 'Open'"
              @click="changeStatus(project.id, 'Paused')"
              type="button"
              class="px-3 py-1.5 rounded-lg bg-neutral-100 text-neutral-700 hover:bg-neutral-200 text-xs font-semibold transition cursor-pointer"
            >
              Pause
            </button>

            <!-- Close Project -->
            <button
              v-if="project.status !== 'Closed'"
              @click="changeStatus(project.id, 'Closed')"
              type="button"
              class="px-3 py-1.5 rounded-lg border border-neutral-200 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50 text-xs font-semibold transition cursor-pointer"
            >
              Close
            </button>

            <!-- Delete with Confirmation -->
            <button
              @click="promptDelete(project)"
              type="button"
              class="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
              title="Delete project"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div v-else class="p-12 text-center text-xs text-neutral-400 space-y-3">
        <FolderSearch class="w-8 h-8 text-neutral-300 mx-auto" />
        <p>No projects found matching the selected filter.</p>
        <router-link
          to="/client/projects/new"
          class="inline-block px-4 py-2 rounded-xl bg-neutral-900 text-white font-semibold text-xs"
        >
          Post a Project
        </router-link>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <div
        v-if="projectToDelete"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
        role="dialog"
        aria-modal="true"
      >
        <div class="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-neutral-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
          <div class="flex items-center gap-3 text-red-600">
            <AlertTriangle class="w-5 h-5 shrink-0" />
            <h3 class="text-sm font-bold text-neutral-900">Confirm Deletion</h3>
          </div>
          <p class="text-xs text-neutral-500 leading-relaxed">
            Are you sure you want to permanently delete <strong class="text-neutral-900">"{{ projectToDelete.title }}"</strong>? This action will remove it from both your client portal and the marketplace.
          </p>
          <div class="flex gap-2 pt-2">
            <button
              @click="projectToDelete = null"
              class="flex-1 py-2 rounded-xl bg-neutral-100 text-neutral-700 text-xs font-semibold hover:bg-neutral-200 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              @click="confirmDelete"
              class="flex-1 py-2 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition cursor-pointer shadow-xs"
            >
              Delete Project
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  PlusCircle,
  Trash2,
  AlertTriangle,
  FolderSearch,
  Users,
  Sparkles
} from 'lucide-vue-next'
import { authState } from '../../data/auth'
import {
  projectState,
  setProjectStatus,
  deleteProject
} from '../../data/projectService'
import { getApplicationsByProject } from '../../data/applicationService'

const activeStatusFilter = ref('all')
const projectToDelete = ref(null)

const client = computed(() => authState.currentUser)

const statusTabs = [
  { id: 'all', label: 'All Projects' },
  { id: 'Open', label: 'Open' },
  { id: 'Draft', label: 'Draft' },
  { id: 'Paused', label: 'Paused' },
  { id: 'Closed', label: 'Closed' }
]

const clientProjects = computed(() => {
  return projectState.projects.filter(p => p.clientId === client.value.id || !p.clientId)
})

const getApplicantsCount = (projectId) => {
  return getApplicationsByProject(projectId).length
}

const getCountForTab = (tabId) => {
  if (tabId === 'all') return clientProjects.value.length
  return clientProjects.value.filter(p => (p.status || 'Open') === tabId).length
}

const filteredProjects = computed(() => {
  if (activeStatusFilter.value === 'all') return clientProjects.value
  return clientProjects.value.filter(p => (p.status || 'Open') === activeStatusFilter.value)
})

const changeStatus = (id, status) => {
  setProjectStatus(id, status)
}

const promptDelete = (proj) => {
  projectToDelete.value = proj
}

const confirmDelete = () => {
  if (projectToDelete.value) {
    deleteProject(projectToDelete.value.id)
    projectToDelete.value = null
  }
}

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
