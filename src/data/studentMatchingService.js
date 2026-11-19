import { normalizeSkill, calculateSkillMatch } from './recommendationService'
import { getRegisteredUsers, profileCompletionPercentage } from './auth'
import { getReviewsForStudent, calculateRatingMetrics } from './reviewService'
import { applicationState } from './applicationService'

/**
 * Calculates candidate match details for a student against a project's required skills.
 * 
 * Formula:
 * Match Percentage = Math.round((Matched Required Skills / Total Required Skills) * 100)
 * 
 * Classification:
 * - Excellent Match: 80%–100%
 * - Good Match: 50%–79%
 * - Partial Match: 1%–49%
 * - 0% Match: Excluded
 * 
 * @param {Object} student - The registered student object
 * @param {Array<string>} projectRequiredSkills - Project's skills list
 * @param {string|number} projectId - ID of the project
 * @returns {Object} Student enriched with matchDetails, applicationStatus, ratings
 */
export function evaluateStudentMatch(student, projectRequiredSkills = [], projectId = null) {
  const matchResult = calculateSkillMatch(student.skills || [], projectRequiredSkills)

  let tier = 'No Match'
  let tierLabel = 'No Match'
  let badgeClass = 'bg-neutral-100 text-neutral-600 border-neutral-200'

  if (matchResult.matchPercentage >= 80) {
    tier = 'excellent'
    tierLabel = 'Excellent Match'
    badgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-1 ring-emerald-400/20'
  } else if (matchResult.matchPercentage >= 50) {
    tier = 'good'
    tierLabel = 'Good Match'
    badgeClass = 'bg-blue-50 text-blue-700 border-blue-200 ring-1 ring-blue-400/20'
  } else if (matchResult.matchPercentage > 0) {
    tier = 'partial'
    tierLabel = 'Partial Match'
    badgeClass = 'bg-amber-50 text-amber-700 border-amber-200 ring-1 ring-amber-400/20'
  }

  // Calculate student reviews and rating metrics
  const reviews = getReviewsForStudent(student.id)
  const ratingMetrics = calculateRatingMetrics(reviews)

  // Calculate profile completeness score
  let completeness = 40
  if (student.skills && student.skills.length >= 3) completeness += 20
  if (student.portfolio && student.portfolio.length > 0) completeness += 20
  if (student.bio && student.bio.length > 20) completeness += 10
  if (student.experienceLevel) completeness += 10
  completeness = Math.min(completeness, 100)

  // Check application status for this specific project
  let applicationStatus = null
  let existingApplication = null
  if (projectId) {
    existingApplication = applicationState.applications.find(
      app => String(app.projectId) === String(projectId) && app.studentId === student.id
    )
    if (existingApplication) {
      applicationStatus = existingApplication.status // 'Pending', 'Accepted', 'Rejected'
    }
  }

  return {
    ...student,
    completeness,
    ratingMetrics,
    applicationStatus,
    existingApplication,
    matchDetails: {
      ...matchResult,
      tier,
      tierLabel,
      badgeClass
    }
  }
}

/**
 * Gets ranked student recommendations for a project.
 * 
 * Rules:
 * - Must be student role
 * - Excludes suspended accounts (status must be 'active' or undefined)
 * - Excludes students with 0% matching skills
 * - Orders by Match Percentage descending
 * - Tie-breaker: Profile completeness descending, then average rating descending
 * 
 * @param {Object} project - The project object
 * @param {Object} options - Filter & sorting options { minTier, experienceLevel, university, sortBy }
 * @returns {Array<Object>} List of recommended students with match details
 */
export function getRecommendedStudentsForProject(project, options = {}) {
  if (!project || !project.skills || project.skills.length === 0) {
    return []
  }

  const allUsers = getRegisteredUsers()
  const students = allUsers.filter(u => {
    // Only student accounts
    if (u.role && u.role !== 'student') return false
    // Only active, non-suspended accounts
    if (u.status === 'suspended') return false
    return true
  })

  const results = []

  for (const student of students) {
    const evaluated = evaluateStudentMatch(student, project.skills, project.id)

    // Exclude students with zero matching skills from recommendations
    if (evaluated.matchDetails.matchPercentage > 0) {
      results.push(evaluated)
    }
  }

  // Filter by Tier
  let filtered = results
  if (options.tier && options.tier !== 'all') {
    filtered = filtered.filter(s => s.matchDetails.tier === options.tier)
  }

  // Filter by Experience Level
  if (options.experienceLevel && options.experienceLevel !== 'All') {
    filtered = filtered.filter(s => s.experienceLevel === options.experienceLevel)
  }

  // Filter by University
  if (options.university && options.university !== 'All') {
    filtered = filtered.filter(s => s.university === options.university)
  }

  // Sorting
  const sortBy = options.sortBy || 'match_desc'
  filtered.sort((a, b) => {
    if (sortBy === 'match_desc') {
      if (b.matchDetails.matchPercentage !== a.matchDetails.matchPercentage) {
        return b.matchDetails.matchPercentage - a.matchDetails.matchPercentage
      }
      // Tie-breaker 1: Profile completeness
      if (b.completeness !== a.completeness) {
        return b.completeness - a.completeness
      }
      // Tie-breaker 2: Average rating
      return b.ratingMetrics.averageRating - a.ratingMetrics.averageRating
    } else if (sortBy === 'rating_desc') {
      if (b.ratingMetrics.averageRating !== a.ratingMetrics.averageRating) {
        return b.ratingMetrics.averageRating - a.ratingMetrics.averageRating
      }
      return b.matchDetails.matchPercentage - a.matchDetails.matchPercentage
    } else if (sortBy === 'completeness_desc') {
      if (b.completeness !== a.completeness) {
        return b.completeness - a.completeness
      }
      return b.matchDetails.matchPercentage - a.matchDetails.matchPercentage
    }
    return 0
  })

  return filtered
}
