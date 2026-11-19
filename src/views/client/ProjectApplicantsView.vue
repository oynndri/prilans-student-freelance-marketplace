<template>
  <div class="space-y-6">
    <!-- Top Back Navigation & Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <router-link
          to="/client/projects"
          class="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition mb-1"
        >
          <ArrowLeft class="w-4 h-4" />
          <span>Back to Projects</span>
        </router-link>
        <h1 class="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
          Applicants: {{ project?.title || 'Project' }}
        </h1>
        <p class="text-xs text-neutral-500 mt-0.5">
          Review student proposals, verify academic skill credentials, and accept or reject candidates.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <span class="text-xs font-bold px-3 py-1.5 rounded-xl bg-neutral-100 border border-neutral-200 text-neutral-800">
          {{ projectApplications.length }} Applicant(s)
        </span>
      </div>
    </div>

    <!-- Applicants List -->
    <div class="bg-white rounded-2xl border border-neutral-200/90 shadow-2xs overflow-hidden">
      <div v-if="projectApplications.length > 0" class="divide-y divide-neutral-100">
        <div
          v-for="app in projectApplications"
          :key="app.id"
          class="p-6 space-y-4 hover:bg-neutral-50/40 transition"
        >
          <!-- Applicant Header Bar -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <!-- Student Profile Badge -->
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-full overflow-hidden border-2 border-neutral-200 shrink-0">
                <img :src="app.studentAvatar" :alt="app.studentName" class="w-full h-full object-cover" />
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h3 class="text-sm font-bold text-neutral-900">{{ app.studentName }}</h3>
                  <span
                    class="px-2.5 py-0.5 rounded-full text-[10px] font-semibold"
                    :class="statusBadgeClass(app.status)"
                  >
                    {{ app.status }}
                  </span>
                </div>
                <p class="text-xs text-neutral-500">
                  {{ app.studentDepartment }} • {{ app.studentUniversity }}
                </p>
                <span class="text-[11px] text-neutral-400 font-medium">Level: {{ app.studentExperienceLevel }}</span>
              </div>
            </div>

            <!-- Rate & Duration Quote -->
            <div class="text-right sm:text-right text-xs">
              <div class="font-bold text-neutral-900 text-sm">{{ app.proposedBudget }}</div>
              <div class="text-neutral-400">Duration: {{ app.estimatedDuration }}</div>
              <div class="text-[11px] text-neutral-400">Applied {{ formatDate(app.appliedAt) }}</div>
            </div>
          </div>

          <!-- Skills list -->
          <div class="flex flex-wrap gap-1.5">
            <span
              v-for="skill in app.studentSkills"
              :key="skill"
              class="px-2.5 py-1 rounded-full bg-neutral-100 border border-neutral-200/70 text-[11px] text-neutral-700 font-medium"
            >
              {{ skill }}
            </span>
          </div>

          <!-- Proposal Cover Letter -->
          <div class="p-4 bg-neutral-50 rounded-xl border border-neutral-200/70 text-xs text-neutral-700 leading-relaxed whitespace-pre-line">
            <span class="text-neutral-400 font-semibold block text-[11px] mb-1 uppercase tracking-wider">
              Student Cover Letter / Proposal:
            </span>
            {{ app.proposal }}
            <div v-if="app.additionalInfo" class="mt-2 pt-2 border-t border-neutral-200/50 text-[11px] text-neutral-500">
              <strong>Additional Link / Availability:</strong> {{ app.additionalInfo }}
            </div>
          </div>

          <!-- Client Action Controls -->
          <div class="flex items-center justify-between pt-2 border-t border-neutral-100">
            <span class="text-xs text-neutral-400">
              Decision: <strong class="text-neutral-800">{{ app.status }}</strong>
            </span>

            <div class="flex items-center gap-2">
              <button
                v-if="app.status !== 'Accepted'"
                @click="promptDecision(app, 'Accepted')"
                class="px-4 py-2 rounded-xl bg-[#16a34a] hover:bg-green-700 text-white text-xs font-semibold transition cursor-pointer shadow-xs active:scale-[0.98] flex items-center gap-1.5"
              >
                <Check class="w-3.5 h-3.5 stroke-[3]" />
                <span>Accept Candidate</span>
              </button>

              <button
                v-if="app.status !== 'Rejected'"
                @click="promptDecision(app, 'Rejected')"
                class="px-4 py-2 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold transition cursor-pointer"
              >
                Reject
              </button>

              <button
                v-if="app.status !== 'Pending'"
                @click="promptDecision(app, 'Pending')"
                class="px-3 py-2 rounded-xl border border-neutral-200 text-neutral-600 hover:bg-neutral-100 text-xs font-semibold transition cursor-pointer"
              >
                Reopen
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else class="p-14 text-center text-neutral-400 text-xs space-y-3">
        <Users class="w-8 h-8 text-neutral-300 mx-auto" />
        <p>No student applications received yet for this project.</p>
        <p class="text-[11px] text-neutral-400">Student proposals will appear here as soon as they apply.</p>
      </div>
    </div>

    <!-- Accept / Reject Confirmation Modal -->
    <Teleport to="body">
      <div
        v-if="actionCandidate"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
        role="dialog"
        aria-modal="true"
      >
        <div class="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-neutral-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
          <div class="flex items-center gap-3" :class="targetStatus === 'Accepted' ? 'text-green-600' : 'text-red-600'">
            <AlertCircle class="w-5 h-5 shrink-0" />
            <h3 class="text-sm font-bold text-neutral-900">
              Confirm Application Decision
            </h3>
          </div>
          <p class="text-xs text-neutral-500 leading-relaxed">
            Are you sure you want to mark <strong class="text-neutral-900">{{ actionCandidate.studentName }}</strong> as <strong class="capitalize" :class="targetStatus === 'Accepted' ? 'text-green-700' : 'text-red-700'">{{ targetStatus }}</strong>? The student will immediately receive an automated notification.
          </p>
          <div class="flex gap-2 pt-2">
            <button
              @click="actionCandidate = null"
              class="flex-1 py-2 rounded-xl bg-neutral-100 text-neutral-700 text-xs font-semibold hover:bg-neutral-200 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              @click="confirmDecision"
              class="flex-1 py-2 rounded-xl text-white text-xs font-semibold transition cursor-pointer shadow-xs"
              :class="targetStatus === 'Accepted' ? 'bg-[#16a34a] hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'"
            >
              Confirm {{ targetStatus }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  ArrowLeft,
  Check,
  Users,
  AlertCircle
} from 'lucide-vue-next'
import { getProjectById } from '../../data/projectService'
import {
  getApplicationsByProject,
  updateApplicationStatus
} from '../../data/applicationService'

const route = useRoute()
const projectId = route.params.id

const project = computed(() => getProjectById(projectId))

const projectApplications = computed(() => {
  return getApplicationsByProject(projectId)
})

const actionCandidate = ref(null)
const targetStatus = ref('Accepted')

const promptDecision = (app, status) => {
  actionCandidate.value = app
  targetStatus.value = status
}

const confirmDecision = () => {
  if (actionCandidate.value) {
    updateApplicationStatus(actionCandidate.value.id, targetStatus.value)
    actionCandidate.value = null
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
    case 'Accepted':
      return 'bg-green-50 text-green-700 border border-green-200'
    case 'Pending':
      return 'bg-amber-50 text-amber-700 border border-amber-200'
    case 'Rejected':
      return 'bg-red-50 text-red-600 border border-red-200'
    default:
      return 'bg-neutral-100 text-neutral-600 border border-neutral-200'
  }
}
</script>
