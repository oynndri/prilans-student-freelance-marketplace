<template>
  <div class="space-y-6">
    <!-- Top Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
          Application Management & Auditing
        </h1>
        <p class="text-xs text-neutral-500 mt-0.5">
          Monitor student proposal lifecycles, verify academic submissions, and inspect client hiring decisions.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <span class="text-xs font-bold px-3 py-1.5 rounded-xl bg-neutral-100 border border-neutral-200 text-neutral-800">
          {{ filteredApplications.length }} Proposal(s) Monitored
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
          placeholder="Search by student, project, or email..."
          class="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900"
        />
      </div>

      <div class="flex items-center gap-2 w-full sm:w-auto self-end sm:self-auto text-xs">
        <span class="text-neutral-400 font-semibold">Decision:</span>
        <select
          v-model="statusFilter"
          class="px-3 py-2 rounded-xl border border-neutral-200 bg-white font-medium text-neutral-700 focus:outline-none"
        >
          <option value="all">All Applications</option>
          <option value="Pending">Pending</option>
          <option value="Accepted">Accepted</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>
    </div>

    <!-- Applications Table -->
    <div class="bg-white rounded-2xl border border-neutral-200/90 shadow-2xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-neutral-600">
          <thead class="bg-neutral-50 text-neutral-400 font-semibold uppercase text-[10px] tracking-wider border-b border-neutral-100">
            <tr>
              <th class="py-3 px-4">App ID</th>
              <th class="py-3 px-4">Applicant Student</th>
              <th class="py-3 px-4">Target Project</th>
              <th class="py-3 px-4">Proposed Bid</th>
              <th class="py-3 px-4">Status</th>
              <th class="py-3 px-4">Applied Date</th>
              <th class="py-3 px-4 text-right">Details</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-100">
            <tr
              v-for="app in filteredApplications"
              :key="app.id"
              class="hover:bg-neutral-50/60 transition"
            >
              <!-- App ID -->
              <td class="py-3.5 px-4 font-mono text-[11px] text-neutral-400">
                {{ app.id }}
              </td>

              <!-- Student -->
              <td class="py-3.5 px-4 font-semibold text-neutral-900">
                <div class="flex items-center gap-2.5">
                  <div class="w-7 h-7 rounded-full overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200">
                    <img :src="app.studentAvatar" :alt="app.studentName" class="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div class="font-bold text-neutral-900">{{ app.studentName }}</div>
                    <div class="text-[10px] text-neutral-400 font-normal">{{ app.studentUniversity }}</div>
                  </div>
                </div>
              </td>

              <!-- Project Title -->
              <td class="py-3.5 px-4 max-w-xs font-medium text-neutral-800">
                <div class="truncate">{{ app.projectTitle }}</div>
                <div class="text-[10px] text-neutral-400">{{ app.projectCategory }}</div>
              </td>

              <!-- Bid -->
              <td class="py-3.5 px-4 font-semibold text-neutral-900">
                {{ app.proposedBudget }}
              </td>

              <!-- Status -->
              <td class="py-3.5 px-4">
                <span
                  class="px-2.5 py-0.5 rounded-full text-[10px] font-semibold"
                  :class="statusBadgeClass(app.status)"
                >
                  {{ app.status }}
                </span>
              </td>

              <!-- Applied Date -->
              <td class="py-3.5 px-4 text-neutral-400">
                {{ formatDate(app.appliedAt) }}
              </td>

              <!-- Actions -->
              <td class="py-3.5 px-4 text-right">
                <button
                  @click="selectedApp = app"
                  class="px-2.5 py-1 rounded-lg border border-neutral-200 text-neutral-700 hover:bg-neutral-100 text-xs font-semibold transition cursor-pointer"
                >
                  Inspect Proposal
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="filteredApplications.length === 0" class="p-10 text-center text-xs text-neutral-400">
        No applications match the current filter.
      </div>
    </div>

    <!-- Application Inspection Modal -->
    <Teleport to="body">
      <div
        v-if="selectedApp"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
        role="dialog"
        aria-modal="true"
      >
        <div class="bg-white rounded-2xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-neutral-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
          <div class="flex items-start justify-between border-b border-neutral-100 pb-3">
            <div>
              <span
                class="px-2 py-0.5 rounded-full text-[10px] font-semibold mb-1 inline-block"
                :class="statusBadgeClass(selectedApp.status)"
              >
                {{ selectedApp.status }}
              </span>
              <h3 class="text-base font-bold text-neutral-900">{{ selectedApp.projectTitle }}</h3>
              <p class="text-xs text-neutral-400">Applied by {{ selectedApp.studentName }} ({{ selectedApp.studentEmail }})</p>
            </div>
            <button @click="selectedApp = null" class="text-neutral-400 hover:text-black p-1">
              <X class="w-5 h-5" />
            </button>
          </div>

          <div class="space-y-3 text-xs">
            <div class="p-3 bg-neutral-50 rounded-xl space-y-1">
              <span class="text-neutral-400 font-semibold block text-[11px]">Academic Affiliation</span>
              <div class="font-bold text-neutral-800">{{ selectedApp.studentDepartment }} • {{ selectedApp.studentUniversity }}</div>
              <div class="text-neutral-500 text-[11px]">Experience: {{ selectedApp.studentExperienceLevel }}</div>
            </div>

            <div>
              <span class="text-neutral-400 font-semibold block mb-1">Proposal Cover Letter:</span>
              <div class="p-3 bg-neutral-50 rounded-xl border border-neutral-200/70 text-neutral-700 leading-relaxed whitespace-pre-line">
                {{ selectedApp.proposal }}
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3 p-3 bg-neutral-50 rounded-xl">
              <div>
                <span class="text-neutral-400 block text-[11px]">Proposed Rate</span>
                <span class="font-bold text-neutral-800">{{ selectedApp.proposedBudget }}</span>
              </div>
              <div>
                <span class="text-neutral-400 block text-[11px]">Duration Estimate</span>
                <span class="font-bold text-neutral-800">{{ selectedApp.estimatedDuration }}</span>
              </div>
            </div>

            <div v-if="selectedApp.additionalInfo">
              <span class="text-neutral-400 font-semibold block mb-0.5">Additional Notes / URLs:</span>
              <p class="text-neutral-600 bg-neutral-50 p-2 rounded-lg">{{ selectedApp.additionalInfo }}</p>
            </div>
          </div>

          <div class="pt-3 border-t border-neutral-100 flex justify-end">
            <button
              @click="selectedApp = null"
              class="px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-black transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Search, X } from 'lucide-vue-next'
import { applicationState } from '../../data/applicationService'

const searchQuery = ref('')
const statusFilter = ref('all')
const selectedApp = ref(null)

const allApplications = computed(() => applicationState.applications)

const filteredApplications = computed(() => {
  let list = allApplications.value

  if (statusFilter.value !== 'all') {
    list = list.filter(a => a.status === statusFilter.value)
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    list = list.filter(a => {
      const studentMatch = (a.studentName || '').toLowerCase().includes(q)
      const projMatch = (a.projectTitle || '').toLowerCase().includes(q)
      const emailMatch = (a.studentEmail || '').toLowerCase().includes(q)
      const univMatch = (a.studentUniversity || '').toLowerCase().includes(q)
      return studentMatch || projMatch || emailMatch || univMatch
    })
  }

  return list
})

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
