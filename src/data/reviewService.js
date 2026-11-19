import { reactive, computed } from 'vue'

const REVIEWS_KEY = 'prilans_reviews'

// Default seed reviews to demonstrate rating displays out of the box
const defaultReviews = [
  {
    id: 'rev-seed-1',
    applicationId: 'app-seed-comp-1',
    projectId: 2,
    projectTitle: 'Looking for Help to Build an iOS and Android App',
    reviewerId: 'client-techcorp',
    reviewerName: 'TechCorp Solutions',
    reviewerRole: 'client',
    reviewerAvatar: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?auto=format&fit=crop&w=160&q=80',
    revieweeId: 'student-akmal',
    revieweeName: 'Akmal Nasrulloh',
    revieweeRole: 'student',
    rating: 5,
    ratingsBreakdown: {
      communication: 5,
      quality: 5,
      professionalism: 5,
      timeliness: 5
    },
    comment: 'Outstanding student developer! Akmal demonstrated great Vue & frontend architectural skills, communicated clearly each day, and finished the project well ahead of deadline. Highly recommended.',
    createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString()
  },
  {
    id: 'rev-seed-2',
    applicationId: 'app-seed-comp-1',
    projectId: 2,
    projectTitle: 'Looking for Help to Build an iOS and Android App',
    reviewerId: 'student-akmal',
    reviewerName: 'Akmal Nasrulloh',
    reviewerRole: 'student',
    reviewerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
    revieweeId: 'client-techcorp',
    revieweeName: 'TechCorp Solutions',
    revieweeRole: 'client',
    rating: 5,
    ratingsBreakdown: {
      communication: 5,
      projectClarity: 5,
      professionalism: 5
    },
    comment: 'TechCorp Solutions was an exceptional client to collaborate with. Clear requirements, prompt feedback on code milestones, and very supportive of student schedules.',
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString()
  }
]

function loadStoredReviews() {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return defaultReviews
  }
  try {
    const saved = localStorage.getItem(REVIEWS_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch (e) {
    console.error('Error loading prilans_reviews from localStorage:', e)
  }
  return defaultReviews
}

export const reviewState = reactive({
  reviews: loadStoredReviews()
})

function persistReviews() {
  try {
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviewState.reviews))
  } catch (e) {
    console.error('Failed saving prilans_reviews:', e)
  }
}

/**
 * Check if a user has already reviewed a specific engagement/application.
 */
export function hasUserReviewed(applicationId, reviewerId) {
  return reviewState.reviews.some(
    r => String(r.applicationId) === String(applicationId) && r.reviewerId === reviewerId
  )
}

/**
 * Check eligibility for reviewing an application.
 * Rules:
 * - Application must be 'Accepted'
 * - Work status must be 'Completed'
 * - Reviewer must be either the student or client of this application
 * - Has not already submitted a review for this application
 */
export function canUserReview(application, currentUserId) {
  if (!application) return { eligible: false, reason: 'Application not found.' }
  if (application.status !== 'Accepted') {
    return { eligible: false, reason: 'Reviews are only permitted for Accepted applications.' }
  }
  if (application.workStatus !== 'Completed') {
    return { eligible: false, reason: 'Work must be marked as Completed before leaving a review.' }
  }

  const isStudent = application.studentId === currentUserId
  const isClient = application.clientId === currentUserId || (!application.clientId && currentUserId === 'client-techcorp')

  if (!isStudent && !isClient) {
    return { eligible: false, reason: 'Only the client and student involved in this project may leave a review.' }
  }

  if (hasUserReviewed(application.id, currentUserId)) {
    return { eligible: false, reason: 'You have already submitted a review for this project.' }
  }

  return { eligible: true, reviewerRole: isStudent ? 'student' : 'client' }
}

/**
 * Submit a new review.
 */
export function submitReview(reviewData) {
  // Validate basic criteria
  const rating = Number(reviewData.rating)
  if (isNaN(rating) || rating < 1 || rating > 5) {
    return { success: false, message: 'Rating must be between 1 and 5 stars.' }
  }

  const comment = (reviewData.comment || '').trim()
  if (comment.length < 5) {
    return { success: false, message: 'Please write feedback of at least 5 characters.' }
  }

  if (hasUserReviewed(reviewData.applicationId, reviewData.reviewerId)) {
    return { success: false, message: 'You have already submitted a review for this engagement.' }
  }

  const newReview = {
    id: 'rev-' + Date.now(),
    applicationId: reviewData.applicationId,
    projectId: reviewData.projectId,
    projectTitle: reviewData.projectTitle || 'Freelance Project',
    reviewerId: reviewData.reviewerId,
    reviewerName: reviewData.reviewerName || 'Anonymous',
    reviewerRole: reviewData.reviewerRole, // 'student' or 'client'
    reviewerAvatar: reviewData.reviewerAvatar || '',
    revieweeId: reviewData.revieweeId,
    revieweeName: reviewData.revieweeName || 'Member',
    revieweeRole: reviewData.revieweeRole, // 'student' or 'client'
    rating,
    ratingsBreakdown: reviewData.ratingsBreakdown || {},
    comment,
    createdAt: new Date().toISOString()
  }

  reviewState.reviews.unshift(newReview)
  persistReviews()
  return { success: true, review: newReview }
}

/**
 * Retrieve reviews for a student (as reviewee).
 */
export function getReviewsForStudent(studentId) {
  return reviewState.reviews.filter(
    r => r.revieweeId === studentId && r.revieweeRole === 'student'
  )
}

/**
 * Retrieve reviews for a client (as reviewee).
 */
export function getReviewsForClient(clientId) {
  return reviewState.reviews.filter(
    r => (r.revieweeId === clientId || (!r.revieweeId && clientId === 'client-techcorp')) && r.revieweeRole === 'client'
  )
}

/**
 * Retrieve reviews for a project.
 */
export function getReviewsForProject(projectId) {
  return reviewState.reviews.filter(r => String(r.projectId) === String(projectId))
}

/**
 * Retrieve reviews given by a reviewer.
 */
export function getReviewsGivenByUser(userId) {
  return reviewState.reviews.filter(r => r.reviewerId === userId)
}

/**
 * Retrieve reviews received by a user.
 */
export function getReviewsReceivedByUser(userId) {
  return reviewState.reviews.filter(r => r.revieweeId === userId)
}

/**
 * Calculate dynamic rating metrics for a set of reviews.
 */
export function calculateRatingMetrics(reviews = []) {
  if (!reviews || reviews.length === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      starsBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      formattedRating: '0.0'
    }
  }

  const totalReviews = reviews.length
  const sum = reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0)
  const averageRating = totalReviews > 0 ? sum / totalReviews : 0
  const formattedRating = averageRating.toFixed(1)

  const starsBreakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  reviews.forEach(r => {
    const star = Math.round(Number(r.rating))
    if (starsBreakdown[star] !== undefined) {
      starsBreakdown[star]++
    }
  })

  return {
    averageRating,
    totalReviews,
    starsBreakdown,
    formattedRating
  }
}

/**
 * Overall Platform rating stats for Admin.
 */
export const platformRatingStats = computed(() => {
  const all = reviewState.reviews
  return calculateRatingMetrics(all)
})
