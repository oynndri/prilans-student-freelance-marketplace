<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2">
          <span class="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-amber-50 text-amber-600">
            <Star class="w-4 h-4 fill-amber-400 text-amber-400" />
          </span>
          <h1 class="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
            {{ isClient ? 'Client Reviews & Reputation' : 'Student Feedback & Reviews' }}
          </h1>
        </div>
        <p class="text-xs text-neutral-500 mt-1">
          Manage your verified ratings, review project engagements, and provide feedback on completed milestones.
        </p>
      </div>

      <!-- Overall Score Badge -->
      <div class="flex items-center gap-3 bg-white px-4 py-3 rounded-2xl border border-neutral-200/90 shadow-2xs">
        <div class="text-right">
          <div class="text-xs font-bold uppercase tracking-wider text-neutral-400">Average Rating</div>
          <div class="text-xl font-black text-neutral-900">{{ ratingStats.formattedRating }} / 5.0</div>
        </div>
        <div class="pl-3 border-l border-neutral-200">
          <StarRating :model-value="ratingStats.averageRating" :readonly="true" size="md" />
          <div class="text-[10px] text-neutral-400 font-medium text-center mt-0.5">
            {{ ratingStats.totalReviews }} {{ ratingStats.totalReviews === 1 ? 'review' : 'reviews' }}
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation Tabs: Received vs Given vs Pending -->
    <div class="flex items-center gap-2 border-b border-neutral-200 pb-2">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        class="px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2"
        :class="[
          activeTab === tab.id
            ? 'bg-neutral-900 text-white shadow-xs'
            : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
        ]"
      >
        <span>{{ tab.label }}</span>
        <span
          class="px-1.5 py-0.2 rounded-full text-[10px] font-bold"
          :class="activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-neutral-200 text-neutral-700'"
        >
          {{ tab.count }}
        </span>
      </button>
    </div>

    <!-- Tab 1: Reviews Received -->
    <div v-if="activeTab === 'received'" class="space-y-4">
      <div v-if="receivedReviews.length > 0" class="space-y-3">
        <div
          v-for="rev in receivedReviews"
          :key="rev.id"
          class="bg-white rounded-2xl p-5 sm:p-6 border border-neutral-200/90 shadow-2xs space-y-3"
        >
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full overflow-hidden border border-neutral-200 bg-neutral-100 shrink-0">
                <img
                  :src="rev.reviewerAvatar || defaultAvatar"
                  :alt="rev.reviewerName"
                  class="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 class="font-bold text-neutral-900 text-xs sm:text-sm">{{ rev.reviewerName }}</h4>
                <p class="text-[11px] text-neutral-400">
                  Project: <strong class="text-neutral-700">{{ rev.projectTitle }}</strong>
                </p>
              </div>
            </div>

            <div class="text-right">
              <StarRating :model-value="rev.rating" :readonly="true" size="sm" :show-score="true" />
              <span class="text-[10px] text-neutral-400 block mt-0.5">{{ formatDate(rev.createdAt) }}</span>
            </div>
          </div>

          <!-- Review Comment -->
          <div class="p-3.5 bg-neutral-50 rounded-xl border border-neutral-100 text-xs text-neutral-700 leading-relaxed">
            "{{ rev.comment }}"
          </div>

          <!-- Breakdown pills -->
          <div v-if="rev.ratingsBreakdown && Object.keys(rev.ratingsBreakdown).length" class="flex flex-wrap gap-2 text-[10px] text-neutral-500">
            <span v-for="(val, cat) in rev.ratingsBreakdown" :key="cat" class="px-2 py-0.5 rounded bg-neutral-100 font-medium">
              {{ cat }}: {{ val }}★
            </span>
          </div>
        </div>
      </div>

      <div v-else class="bg-white rounded-2xl border border-neutral-200/90 p-12 text-center text-neutral-400 text-xs space-y-2">
        <Star class="w-8 h-8 text-neutral-300 mx-auto" />
        <p class="font-bold text-neutral-700">No reviews received yet</p>
        <p class="text-[11px]">When project collaborators mark engagements as completed, their ratings will appear here.</p>
      </div>
    </div>

    <!-- Tab 2: Reviews Given -->
    <div v-else-if="activeTab === 'given'" class="space-y-4">
      <div v-if="givenReviews.length > 0" class="space-y-3">
        <div
          v-for="rev in givenReviews"
          :key="rev.id"
          class="bg-white rounded-2xl p-5 sm:p-6 border border-neutral-200/90 shadow-2xs space-y-3"
        >
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span class="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Review Left for:</span>
              <h4 class="font-bold text-neutral-900 text-xs sm:text-sm">{{ rev.revieweeName }}</h4>
              <p class="text-[11px] text-neutral-400">
                Project: <strong class="text-neutral-700">{{ rev.projectTitle }}</strong>
              </p>
            </div>

            <div class="text-right">
              <StarRating :model-value="rev.rating" :readonly="true" size="sm" :show-score="true" />
              <span class="text-[10px] text-neutral-400 block mt-0.5">Submitted {{ formatDate(rev.createdAt) }}</span>
            </div>
          </div>

          <div class="p-3.5 bg-neutral-50 rounded-xl border border-neutral-100 text-xs text-neutral-700 leading-relaxed">
            "{{ rev.comment }}"
          </div>
        </div>
      </div>

      <div v-else class="bg-white rounded-2xl border border-neutral-200/90 p-12 text-center text-neutral-400 text-xs space-y-2">
        <Star class="w-8 h-8 text-neutral-300 mx-auto" />
        <p class="font-bold text-neutral-700">No reviews given yet</p>
        <p class="text-[11px]">Once your projects are completed, you can share feedback for your collaborator.</p>
      </div>
    </div>

    <!-- Tab 3: Pending Reviews -->
    <div v-else class="space-y-4">
      <div v-if="pendingReviewEngagements.length > 0" class="space-y-3">
        <div
          v-for="app in pendingReviewEngagements"
          :key="app.id"
          class="bg-white rounded-2xl p-5 sm:p-6 border border-neutral-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div class="space-y-1">
            <span class="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Completed Engagement
            </span>
            <h4 class="font-bold text-neutral-900 text-sm">{{ app.projectTitle }}</h4>
            <p class="text-xs text-neutral-500">
              Collaborator: <strong class="text-neutral-800">{{ isClient ? app.studentName : (app.clientId || 'Client Partner') }}</strong>
            </p>
          </div>

          <button
            @click="openReview(app)"
            class="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition cursor-pointer shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Star class="w-3.5 h-3.5 fill-white" />
            <span>Leave Review</span>
          </button>
        </div>
      </div>

      <div v-else class="bg-white rounded-2xl border border-neutral-200/90 p-12 text-center text-neutral-400 text-xs space-y-2">
        <CheckCircle2 class="w-8 h-8 text-emerald-500 mx-auto" />
        <p class="font-bold text-neutral-700">All caught up!</p>
        <p class="text-[11px]">No completed projects currently awaiting your review.</p>
      </div>
    </div>

    <!-- Review Modal -->
    <ReviewModal
      :is-open="isReviewModalOpen"
      :application="selectedApp"
      @close="isReviewModalOpen = false"
      @reviewed="onReviewSubmitted"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Star, CheckCircle2 } from 'lucide-vue-next'
import { authState } from '../data/auth'
import { applicationState } from '../data/applicationService'
import {
  getReviewsReceivedByUser,
  getReviewsGivenByUser,
  calculateRatingMetrics,
  hasUserReviewed
} from '../data/reviewService'
import StarRating from '../components/StarRating.vue'
import ReviewModal from '../components/ReviewModal.vue'

const currentUser = computed(() => authState.currentUser)
const currentUserId = computed(() => currentUser.value?.id || 'student-akmal')
const isClient = computed(() => currentUser.value?.role === 'client')

const activeTab = ref('received') // 'received', 'given', 'pending'
const isReviewModalOpen = ref(false)
const selectedApp = ref(null)

const defaultAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80'

// Reviews received by current user
const receivedReviews = computed(() => {
  return getReviewsReceivedByUser(currentUserId.value)
})

// Reviews given by current user
const givenReviews = computed(() => {
  return getReviewsGivenByUser(currentUserId.value)
})

// Metrics for received reviews
const ratingStats = computed(() => {
  return calculateRatingMetrics(receivedReviews.value)
})

// Completed engagements where this user has not yet submitted a review
const pendingReviewEngagements = computed(() => {
  const userId = currentUserId.value
  return applicationState.applications.filter(app => {
    if (app.status !== 'Accepted') return false
    if (app.workStatus !== 'Completed') return false

    const isParty = isClient.value
      ? (app.clientId === userId || (!app.clientId && userId === 'client-techcorp'))
      : (app.studentId === userId)

    if (!isParty) return false

    // Has user already reviewed?
    return !hasUserReviewed(app.id, userId)
  })
})

const tabs = computed(() => [
  { id: 'received', label: 'Reviews Received', count: receivedReviews.value.length },
  { id: 'given', label: 'Reviews Given', count: givenReviews.value.length },
  { id: 'pending', label: 'Pending Reviews', count: pendingReviewEngagements.value.length }
])

const openReview = (app) => {
  selectedApp.value = app
  isReviewModalOpen.value = true
}

const onReviewSubmitted = () => {
  // refresh
}

const formatDate = (dateStr) => {
  if (!dateStr) return 'Recently'
  try {
    return new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
  } catch (e) {
    return 'Recently'
  }
}
</script>
