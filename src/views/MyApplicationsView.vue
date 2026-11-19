<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
          My Applications
        </h1>
        <p class="text-xs text-neutral-500 mt-0.5">
          Track proposal statuses, reviews, client updates, and accepted student gigs.
        </p>
      </div>

      <router-link
        to="/"
        class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0f172a] text-white text-xs font-semibold hover:bg-black transition shadow-xs self-start sm:self-auto cursor-pointer"
      >
        <Search class="w-4 h-4" />
        <span>Browse More Projects</span>
      </router-link>
    </div>

    <!-- Summary Metrics Cards -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div class="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-2xs space-y-1">
        <div class="flex items-center justify-between text-neutral-400">
          <span class="text-xs font-semibold uppercase tracking-wider">Total</span>
          <FileText class="w-4 h-4 text-neutral-600" />
        </div>
        <div class="text-2xl font-extrabold text-neutral-900">{{ metrics.total }}</div>
        <p class="text-[11px] text-neutral-400">Applications submitted</p>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-2xs space-y-1">
        <div class="flex items-center justify-between text-amber-500">
          <span class="text-xs font-semibold uppercase tracking-wider text-neutral-600">Pending</span>
          <Clock class="w-4 h-4" />
        </div>
        <div class="text-2xl font-extrabold text-amber-600">{{ metrics.pending }}</div>
        <p class="text-[11px] text-neutral-400">Under client review</p>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-2xs space-y-1">
        <div class="flex items-center justify-between text-[#16a34a]">
          <span class="text-xs font-semibold uppercase tracking-wider text-neutral-600">Accepted</span>
          <CheckCircle2 class="w-4 h-4" />
        </div>
        <div class="text-2xl font-extrabold text-[#16a34a]">{{ metrics.accepted }}</div>
        <p class="text-[11px] text-neutral-400">Gigs landed</p>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-2xs space-y-1">
        <div class="flex items-center justify-between text-red-500">
          <span class="text-xs font-semibold uppercase tracking-wider text-neutral-600">Rejected</span>
          <XCircle class="w-4 h-4" />
        </div>
        <div class="text-2xl font-extrabold text-red-600">{{ metrics.rejected }}</div>
        <p class="text-[11px] text-neutral-400">Not selected</p>
      </div>
    </div>

    <!-- Filters & Sort Controls -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
      <!-- Status Tabs -->
      <div class="flex items-center gap-2 overflow-x-auto text-xs pb-1 sm:pb-0">
        <button
          v-for="t in ['all', 'Pending', 'Accepted', 'Rejected']"
          :key="t"
          @click="activeStatus = t"
          class="px-3.5 py-1.5 rounded-lg font-semibold transition cursor-pointer whitespace-nowrap"
          :class="activeStatus === t ? 'bg-neutral-900 text-white shadow-xs' : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/60'"
        >
          {{ t === 'all' ? 'All Applications' : t }}
        </button>
      </div>

      <!-- Sorting -->
      <div class="flex items-center gap-2 text-xs self-end sm:self-auto">
        <span class="text-neutral-400">Sort by:</span>
        <select
          v-model="sortOrder"
          class="px-2.5 py-1 bg-white border border-neutral-200 rounded-lg text-xs font-semibold text-neutral-700 focus:outline-none"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>
    </div>

    <!-- Applications List -->
    <div class="bg-white rounded-2xl border border-neutral-200/90 shadow-2xs overflow-hidden">
      <div v-if="filteredApplications.length > 0" class="divide-y divide-neutral-100">
        <div
          v-for="app in filteredApplications"
          :key="app.id"
          class="p-5 hover:bg-neutral-50/50 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <!-- Left details -->
          <div class="space-y-1.5 min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-2">
              <router-link
                :to="`/projects/${app.projectId}`"
                class="text-sm font-bold text-neutral-900 hover:text-blue-600 transition truncate"
              >
                {{ app.projectTitle }}
              </router-link>
              <span
                class="px-2.5 py-0.5 rounded-full text-[10px] font-semibold"
                :class="statusBadgeClass(app.status)"
              >
                {{ app.status }}
              </span>
              <span
                v-if="app.status === 'Accepted'"
                class="px-2 py-0.5 rounded-full text-[10px] font-bold"
                :class="app.workStatus === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-blue-50 text-blue-700 border border-blue-200'"
              >
                Work: {{ app.workStatus || 'In Progress' }}
              </span>
              <span class="text-[11px] text-neutral-400 font-normal">
                {{ app.projectCategory }}
              </span>
            </div>

            <p class="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
              {{ app.proposal }}
            </p>

            <div class="flex flex-wrap items-center gap-4 text-xs text-neutral-500 pt-1">
              <span>Proposed: <strong class="text-neutral-800">{{ app.proposedBudget }}</strong></span>
              <span>•</span>
              <span>Estimated: <strong class="text-neutral-800">{{ app.estimatedDuration }}</strong></span>
              <span>•</span>
              <span class="text-neutral-400">Applied {{ formatDate(app.appliedAt) }}</span>
            </div>
          </div>

          <!-- Right actions -->
          <div class="flex flex-wrap items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-neutral-100">
            <!-- Review Client button for completed engagements -->
            <template v-if="app.status === 'Accepted' && app.workStatus === 'Completed'">
              <button
                v-if="!hasReviewedApp(app.id)"
                @click="openReviewModal(app)"
                class="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition cursor-pointer shadow-2xs flex items-center gap-1.5"
              >
                <Star class="w-3.5 h-3.5 fill-white" />
                <span>Review Your Experience</span>
              </button>
              <span
                v-else
                class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neutral-100 text-neutral-600 text-xs font-semibold"
              >
                <Check class="w-3.5 h-3.5 text-emerald-600" />
                <span>Reviewed</span>
              </span>
            </template>

            <button
              @click="openDetails(app)"
              class="px-3.5 py-1.5 rounded-lg border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 transition cursor-pointer"
            >
              View Proposal
            </button>

            <!-- Withdraw Pending Button -->
            <button
              v-if="app.status === 'Pending'"
              @click="promptWithdraw(app)"
              class="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 transition cursor-pointer"
            >
              Withdraw
            </button>
          </div>
        </div>
      </div>

      <div v-else class="p-12 text-center text-xs text-neutral-400 space-y-3">
        <FileText class="w-8 h-8 text-neutral-300 mx-auto" />
        <p>No applications match the current filter.</p>
        <router-link
          to="/"
          class="inline-block px-4 py-2 rounded-xl bg-neutral-900 text-white font-semibold text-xs"
        >
          Explore Projects
        </router-link>
      </div>
    </div>

    <!-- Application Details Modal -->
    <Teleport to="body">
      <div
        v-if="selectedApp"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
        role="dialog"
        aria-modal="true"
      >
        <div class="bg-white rounded-2xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-neutral-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
          <div class="flex justify-between items-start border-b border-neutral-100 pb-3">
            <div>
              <span
                class="px-2 py-0.5 rounded-full text-[10px] font-semibold mb-1 inline-block"
                :class="statusBadgeClass(selectedApp.status)"
              >
                {{ selectedApp.status }}
              </span>
              <h3 class="text-base font-bold text-neutral-900">{{ selectedApp.projectTitle }}</h3>
              <p class="text-xs text-neutral-400">Applied on {{ formatDate(selectedApp.appliedAt) }}</p>
            </div>
            <button @click="selectedApp = null" class="text-neutral-400 hover:text-black p-1">
              <X class="w-5 h-5" />
            </button>
          </div>

          <!-- Proposal Content -->
          <div class="space-y-3 text-xs">
            <div>
              <span class="text-neutral-400 font-semibold block mb-1">Your Submitted Cover Letter:</span>
              <div class="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/80 leading-relaxed text-neutral-700 whitespace-pre-line">
                {{ selectedApp.proposal }}
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3 p-3 bg-neutral-50/60 rounded-xl border border-neutral-200/60">
              <div>
                <span class="text-neutral-400 block text-[11px]">Proposed Rate</span>
                <span class="font-bold text-neutral-800">{{ selectedApp.proposedBudget }}</span>
              </div>
              <div>
                <span class="text-neutral-400 block text-[11px]">Delivery Time</span>
                <span class="font-bold text-neutral-800">{{ selectedApp.estimatedDuration }}</span>
              </div>
            </div>

            <div v-if="selectedApp.additionalInfo">
              <span class="text-neutral-400 font-semibold block mb-0.5">Additional Notes:</span>
              <p class="text-neutral-600">{{ selectedApp.additionalInfo }}</p>
            </div>
          </div>

          <div class="pt-2 border-t border-neutral-100 flex justify-end">
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

    <!-- Withdraw Confirmation Modal -->
    <Teleport to="body">
      <div
        v-if="appToWithdraw"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
        role="dialog"
        aria-modal="true"
      >
        <div class="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-neutral-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
          <div class="flex items-center gap-3 text-amber-600">
            <AlertTriangle class="w-5 h-5 shrink-0" />
            <h3 class="text-sm font-bold text-neutral-900">Withdraw Application</h3>
          </div>
          <p class="text-xs text-neutral-500 leading-relaxed">
            Are you sure you want to withdraw your proposal for <strong class="text-neutral-900">"{{ appToWithdraw.projectTitle }}"</strong>? You can re-apply later if the opportunity is still open.
          </p>
          <div class="flex gap-2 pt-2">
            <button
              @click="appToWithdraw = null"
              class="flex-1 py-2 rounded-xl bg-neutral-100 text-neutral-700 text-xs font-semibold hover:bg-neutral-200 transition cursor-pointer"
            >
              Keep Proposal
            </button>
            <button
              @click="confirmWithdraw"
              class="flex-1 py-2 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition cursor-pointer shadow-xs"
            >
              Withdraw
            </button>
          </div>
        </div>
      </div>
    </Teleport>
    <!-- Review Submission Modal -->
    <ReviewModal
      :is-open="isReviewModalOpen"
      :application="reviewTargetApp"
      @close="isReviewModalOpen = false"
      @reviewed="onReviewSubmitted"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  X,
  AlertTriangle,
  Star,
  Check
} from 'lucide-vue-next'
import { authState } from '../data/auth'
import {
  getApplicationsByStudent,
  withdrawApplication
} from '../data/applicationService'
import { hasUserReviewed } from '../data/reviewService'
import ReviewModal from '../components/ReviewModal.vue'

const activeStatus = ref('all')
const sortOrder = ref('newest')
const selectedApp = ref(null)
const appToWithdraw = ref(null)

const isReviewModalOpen = ref(false)
const reviewTargetApp = ref(null)

const hasReviewedApp = (appId) => {
  return hasUserReviewed(appId, studentId.value)
}

const openReviewModal = (app) => {
  reviewTargetApp.value = app
  isReviewModalOpen.value = true
}

const onReviewSubmitted = () => {
  // review submitted
}

const studentId = computed(() => authState.currentUser?.id || 'student-akmal')

const myApplications = computed(() => {
  return getApplicationsByStudent(studentId.value)
})

const metrics = computed(() => {
  const all = myApplications.value
  return {
    total: all.length,
    pending: all.filter(a => a.status === 'Pending').length,
    accepted: all.filter(a => a.status === 'Accepted').length,
    rejected: all.filter(a => a.status === 'Rejected').length
  }
})

const filteredApplications = computed(() => {
  let list = [...myApplications.value]
  if (activeStatus.value !== 'all') {
    list = list.filter(a => a.status === activeStatus.value)
  }
  if (sortOrder.value === 'newest') {
    list.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt))
  } else {
    list.sort((a, b) => new Date(a.appliedAt) - new Date(b.appliedAt))
  }
  return list
})

const openDetails = (app) => {
  selectedApp.value = app
}

const promptWithdraw = (app) => {
  appToWithdraw.value = app
}

const confirmWithdraw = () => {
  if (appToWithdraw.value) {
    withdrawApplication(appToWithdraw.value.id, studentId.value)
    appToWithdraw.value = null
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
