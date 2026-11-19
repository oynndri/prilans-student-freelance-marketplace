<template>
  <div class="space-y-6">
    <!-- Top Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
          Project Moderation & Management
        </h1>
        <p class="text-xs text-neutral-500 mt-0.5">
          Audit opportunities, enforce community standards, hide inappropriate listings, or restore marketplace visibility.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <span class="text-xs font-bold px-3 py-1.5 rounded-xl bg-neutral-100 border border-neutral-200 text-neutral-800">
          {{ filteredProjects.length }} Project(s) Audited
        </span>
      </div>
    </div>

    <!-- Search & Filter Controls -->
    <div class="bg-white p-4 rounded-2xl border border-neutral-200/90 shadow-2xs flex flex-col sm:flex-row gap-3 items-center justify-between">
      <div class="relative w-full sm:w-80">
        <Search class="w-4 h-4 text-neutral-400 absolute left-3 top-2.5 pointer-events-none" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by title, category, or skill..."
          class="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900"
        />
      </div>

      <div class="flex items-center gap-2 w-full sm:w-auto self-end sm:self-auto text-xs">
        <span class="text-neutral-400 font-semibold">Moderation:</span>
        <select
          v-model="statusFilter"
          class="px-3 py-2 rounded-xl border border-neutral-200 bg-white font-medium text-neutral-700 focus:outline-none"
        >
          <option value="all">All Projects</option>
          <option value="visible">Visible Only</option>
          <option value="moderated">Moderated / Hidden</option>
        </select>
      </div>
    </div>

    <!-- Projects Table -->
    <div class="bg-white rounded-2xl border border-neutral-200/90 shadow-2xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-neutral-600">
          <thead class="bg-neutral-50 text-neutral-400 font-semibold uppercase text-[10px] tracking-wider border-b border-neutral-100">
            <tr>
              <th class="py-3 px-4">Project Title</th>
              <th class="py-3 px-4">Category</th>
              <th class="py-3 px-4">Budget / Rate</th>
              <th class="py-3 px-4">Client Status</th>
              <th class="py-3 px-4">Moderation State</th>
              <th class="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-100">
            <tr
              v-for="project in filteredProjects"
              :key="project.id"
              class="hover:bg-neutral-50/60 transition"
            >
              <!-- Title -->
              <td class="py-3.5 px-4 font-semibold text-neutral-900 max-w-sm">
                <div class="font-bold text-neutral-900 truncate">{{ project.title }}</div>
                <div class="text-[11px] text-neutral-400 line-clamp-1 font-normal">{{ project.description }}</div>
              </td>

              <!-- Category -->
              <td class="py-3.5 px-4 font-medium text-neutral-800">
                {{ project.category }}
              </td>

              <!-- Budget -->
              <td class="py-3.5 px-4 font-semibold text-neutral-900">
                {{ project.priceDisplay }}
              </td>

              <!-- Client Status -->
              <td class="py-3.5 px-4">
                <span
                  class="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                  :class="statusBadgeClass(project.status || 'Open')"
                >
                  {{ project.status || 'Open' }}
                </span>
              </td>

              <!-- Moderation State -->
              <td class="py-3.5 px-4">
                <span
                  v-if="project.isModerated"
                  class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 border border-red-200"
                >
                  <EyeOff class="w-3 h-3" />
                  Hidden by Admin
                </span>
                <span
                  v-else
                  class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-green-50 text-green-700 border border-green-200"
                >
                  <Eye class="w-3 h-3" />
                  Marketplace Visible
                </span>
              </td>

              <!-- Actions -->
              <td class="py-3.5 px-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <router-link
                    :to="`/projects/${project.id}`"
                    class="px-2.5 py-1 rounded-lg border border-neutral-200 text-neutral-700 hover:bg-neutral-100 text-xs font-semibold transition"
                  >
                    View
                  </router-link>

                  <button
                    v-if="project.isModerated"
                    @click="promptModeration(project, false)"
                    class="px-2.5 py-1 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 text-xs font-semibold transition cursor-pointer"
                  >
                    Restore
                  </button>
                  <button
                    v-else
                    @click="promptModeration(project, true)"
                    class="px-2.5 py-1 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-semibold transition cursor-pointer"
                  >
                    Hide
                  </button>

                  <button
                    @click="promptDelete(project)"
                    class="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                    title="Delete permanently"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="filteredProjects.length === 0" class="p-10 text-center text-xs text-neutral-400">
        No projects found matching the filter.
      </div>
    </div>

    <!-- Moderation Modal Confirmation -->
    <Teleport to="body">
      <div
        v-if="actionProject"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
        role="dialog"
        aria-modal="true"
      >
        <div class="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-neutral-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
          <div class="flex items-center gap-3" :class="isHideAction ? 'text-red-600' : 'text-green-600'">
            <AlertTriangle class="w-5 h-5 shrink-0" />
            <h3 class="text-sm font-bold text-neutral-900">
              Confirm Moderation Action
            </h3>
          </div>
          <p class="text-xs text-neutral-500 leading-relaxed">
            Are you sure you want to {{ isHideAction ? 'hide' : 'restore visibility for' }} <strong class="text-neutral-900">"{{ actionProject.title }}"</strong>?
            {{ isHideAction ? 'Students will immediately no longer see this opportunity in Find Projects.' : 'This project will be restored to student marketplace listings.' }}
          </p>
          <div class="flex gap-2 pt-2">
            <button
              @click="actionProject = null"
              class="flex-1 py-2 rounded-xl bg-neutral-100 text-neutral-700 text-xs font-semibold hover:bg-neutral-200 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              @click="confirmModeration"
              class="flex-1 py-2 rounded-xl text-white text-xs font-semibold transition cursor-pointer shadow-xs"
              :class="isHideAction ? 'bg-red-600 hover:bg-red-700' : 'bg-[#16a34a] hover:bg-green-700'"
            >
              {{ isHideAction ? 'Hide Project' : 'Restore Listing' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

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
            <h3 class="text-sm font-bold text-neutral-900">Permanently Delete</h3>
          </div>
          <p class="text-xs text-neutral-500 leading-relaxed">
            This will permanently remove <strong class="text-neutral-900">"{{ projectToDelete.title }}"</strong> from all client and student dashboards.
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
              Delete
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
  Search,
  Eye,
  EyeOff,
  Trash2,
  AlertTriangle
} from 'lucide-vue-next'
import {
  projectState,
  toggleProjectModeration,
  deleteProject
} from '../../data/projectService'

const searchQuery = ref('')
const statusFilter = ref('all')
const actionProject = ref(null)
const isHideAction = ref(true)
const projectToDelete = ref(null)

const allProjects = computed(() => projectState.projects)

const filteredProjects = computed(() => {
  let list = allProjects.value

  if (statusFilter.value === 'visible') {
    list = list.filter(p => !p.isModerated)
  } else if (statusFilter.value === 'moderated') {
    list = list.filter(p => p.isModerated)
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    list = list.filter(p => {
      const titleMatch = (p.title || '').toLowerCase().includes(q)
      const catMatch = (p.category || '').toLowerCase().includes(q)
      const skillMatch = (p.skills || []).some(s => s.toLowerCase().includes(q))
      return titleMatch || catMatch || skillMatch
    })
  }

  return list
})

const promptModeration = (proj, shouldHide) => {
  actionProject.value = proj
  isHideAction.value = shouldHide
}

const confirmModeration = () => {
  if (actionProject.value) {
    toggleProjectModeration(actionProject.value.id)
    actionProject.value = null
  }
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
