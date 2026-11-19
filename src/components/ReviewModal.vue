<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div
        class="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-neutral-200 space-y-5 animate-in fade-in zoom-in-95 duration-150 my-8"
      >
        <!-- Modal Header -->
        <div class="flex items-start justify-between border-b border-neutral-100 pb-4">
          <div>
            <div class="flex items-center gap-2">
              <span class="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-amber-50 text-amber-600">
                <Star class="w-4 h-4 fill-amber-400 text-amber-400" />
              </span>
              <h2 class="text-base sm:text-lg font-black text-neutral-900 tracking-tight">
                {{ isClientReviewer ? 'Review Student Performance' : 'Review Your Experience with Client' }}
              </h2>
            </div>
            <p class="text-xs text-neutral-500 mt-1">
              Project: <strong class="text-neutral-800">{{ application?.projectTitle }}</strong>
            </p>
          </div>
          <button
            @click="closeModal"
            class="text-neutral-400 hover:text-neutral-900 p-1 rounded-lg hover:bg-neutral-100 transition cursor-pointer"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Reviewee Context Pill -->
        <div class="flex items-center gap-3 p-3 bg-neutral-50 rounded-2xl border border-neutral-100">
          <div class="w-10 h-10 rounded-full overflow-hidden border border-neutral-200 shrink-0">
            <img :src="targetAvatar" :alt="targetName" class="w-full h-full object-cover" />
          </div>
          <div class="min-w-0 flex-1 text-xs">
            <p class="font-bold text-neutral-900 truncate">{{ targetName }}</p>
            <p class="text-neutral-500 text-[11px] truncate">
              {{ isClientReviewer ? `${application?.studentDepartment} • ${application?.studentUniversity}` : 'Client Partner' }}
            </p>
          </div>
        </div>

        <!-- Rating Form -->
        <form @submit.prevent="handleSubmit" class="space-y-4 text-xs">
          <!-- Overall Rating -->
          <div class="text-center py-2 space-y-1.5 bg-neutral-50/70 rounded-2xl border border-neutral-100">
            <span class="block text-xs font-bold uppercase tracking-wider text-neutral-600">
              Overall Rating
            </span>
            <div class="flex justify-center">
              <StarRating v-model="rating" size="lg" :show-score="true" />
            </div>
            <p class="text-[11px] text-neutral-400 font-medium">
              {{ ratingText(rating) }}
            </p>
          </div>

          <!-- Rating Breakdown Categories -->
          <div class="space-y-3 pt-1">
            <span class="block text-[11px] font-bold uppercase tracking-wider text-neutral-400">
              Category Breakdown
            </span>

            <!-- Client Reviewing Student -->
            <div v-if="isClientReviewer" class="space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-neutral-700 font-medium">Communication</span>
                <StarRating v-model="ratingsBreakdown.communication" size="sm" />
              </div>
              <div class="flex items-center justify-between">
                <span class="text-neutral-700 font-medium">Work Quality</span>
                <StarRating v-model="ratingsBreakdown.quality" size="sm" />
              </div>
              <div class="flex items-center justify-between">
                <span class="text-neutral-700 font-medium">Professionalism</span>
                <StarRating v-model="ratingsBreakdown.professionalism" size="sm" />
              </div>
              <div class="flex items-center justify-between">
                <span class="text-neutral-700 font-medium">Timeliness</span>
                <StarRating v-model="ratingsBreakdown.timeliness" size="sm" />
              </div>
            </div>

            <!-- Student Reviewing Client -->
            <div v-else class="space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-neutral-700 font-medium">Communication & Responsiveness</span>
                <StarRating v-model="ratingsBreakdown.communication" size="sm" />
              </div>
              <div class="flex items-center justify-between">
                <span class="text-neutral-700 font-medium">Project Clarity & Scope</span>
                <StarRating v-model="ratingsBreakdown.projectClarity" size="sm" />
              </div>
              <div class="flex items-center justify-between">
                <span class="text-neutral-700 font-medium">Professionalism</span>
                <StarRating v-model="ratingsBreakdown.professionalism" size="sm" />
              </div>
            </div>
          </div>

          <!-- Written Review Feedback -->
          <div class="space-y-1.5 pt-1">
            <div class="flex justify-between items-center">
              <label class="font-bold text-neutral-700 text-xs">
                Written Feedback & Experience
              </label>
              <span class="text-[10px] text-neutral-400 font-medium">
                {{ comment.length }}/500 chars (min 5)
              </span>
            </div>
            <textarea
              v-model="comment"
              rows="4"
              maxlength="500"
              placeholder="Share how the collaboration went, milestones achieved, communication quality, etc..."
              class="w-full text-xs p-3.5 border rounded-2xl focus:outline-hidden focus:ring-1 focus:ring-neutral-900 transition resize-none leading-relaxed"
              :class="commentError ? 'border-red-300 bg-red-50/30' : 'border-neutral-200'"
            ></textarea>
            <p v-if="commentError" class="text-[11px] text-red-600 font-medium">
              {{ commentError }}
            </p>
          </div>

          <!-- Error Alert if any -->
          <div v-if="errorMessage" class="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
            {{ errorMessage }}
          </div>

          <!-- Modal Actions -->
          <div class="flex items-center gap-2.5 pt-3">
            <button
              type="button"
              @click="closeModal"
              class="flex-1 py-2.5 rounded-xl border border-neutral-200 text-neutral-700 text-xs font-bold hover:bg-neutral-100 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="flex-1 py-2.5 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-black transition cursor-pointer shadow-xs disabled:opacity-50"
            >
              {{ isSubmitting ? 'Submitting...' : 'Submit Review' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { Star, X } from 'lucide-vue-next'
import StarRating from './StarRating.vue'
import { submitReview } from '../data/reviewService'
import { authState } from '../data/auth'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  application: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'reviewed'])

const currentUser = computed(() => authState.currentUser)
const isClientReviewer = computed(() => currentUser.value?.role === 'client')

const targetName = computed(() => {
  if (isClientReviewer.value) {
    return props.application?.studentName || 'Student Freelancer'
  }
  return 'TechCorp Solutions' // Client name
})

const targetAvatar = computed(() => {
  if (isClientReviewer.value) {
    return props.application?.studentAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80'
  }
  return 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?auto=format&fit=crop&w=160&q=80'
})

const rating = ref(5)
const comment = ref('')
const commentError = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)

const ratingsBreakdown = reactive({
  communication: 5,
  quality: 5,
  professionalism: 5,
  timeliness: 5,
  projectClarity: 5
})

watch(() => props.isOpen, (open) => {
  if (open) {
    rating.value = 5
    comment.value = ''
    commentError.value = ''
    errorMessage.value = ''
    ratingsBreakdown.communication = 5
    ratingsBreakdown.quality = 5
    ratingsBreakdown.professionalism = 5
    ratingsBreakdown.timeliness = 5
    ratingsBreakdown.projectClarity = 5
  }
})

const ratingText = (stars) => {
  switch (stars) {
    case 5: return '★★★★★ Excellent Experience'
    case 4: return '★★★★☆ Very Good'
    case 3: return '★★★☆☆ Average Collaboration'
    case 2: return '★★☆☆☆ Poor'
    case 1: return '★☆☆☆☆ Unsatisfactory'
    default: return 'Select star rating'
  }
}

const closeModal = () => {
  emit('close')
}

const handleSubmit = () => {
  commentError.value = ''
  errorMessage.value = ''

  if (comment.value.trim().length < 5) {
    commentError.value = 'Please provide written feedback of at least 5 characters.'
    return
  }

  isSubmitting.value = true

  const reviewerRole = isClientReviewer.value ? 'client' : 'student'
  const revieweeRole = isClientReviewer.value ? 'student' : 'client'
  const revieweeId = isClientReviewer.value
    ? props.application.studentId
    : (props.application.clientId || 'client-techcorp')

  const result = submitReview({
    applicationId: props.application.id,
    projectId: props.application.projectId,
    projectTitle: props.application.projectTitle,
    reviewerId: currentUser.value?.id,
    reviewerName: currentUser.value?.fullName || currentUser.value?.companyName || 'Verified Member',
    reviewerRole,
    reviewerAvatar: currentUser.value?.avatar || '',
    revieweeId,
    revieweeName: targetName.value,
    revieweeRole,
    rating: rating.value,
    ratingsBreakdown: { ...ratingsBreakdown },
    comment: comment.value.trim()
  })

  isSubmitting.value = false

  if (result.success) {
    emit('reviewed', result.review)
    closeModal()
  } else {
    errorMessage.value = result.message || 'Failed to submit review.'
  }
}
</script>
