import { computed } from 'vue'
import { studentAvailableProjects } from './projectService'
import { hasStudentApplied } from './applicationService'

/**
 * Normalizes a skill string for case-insensitive and trimmed comparison.
 * Also cleans punctuation or standardizes common variants if applicable.
 */
export function normalizeSkill(skill) {
  if (!skill || typeof skill !== 'string') return ''
  return skill.trim().toLowerCase()
}

/**
 * Calculates skill match details between a student's skills and a project's required skills.
 * 
 * Formula:
 * Match Percentage = Math.round((Matched Required Skills / Total Required Skills) * 100)
 * 
 * @param {Array<string>} studentSkills - The student's skills array
 * @param {Array<string>} projectRequiredSkills - The project's required skills array
 * @returns {Object} { matchPercentage, matchedSkills, missingSkills, totalRequired, matchedCount, tier }
 */
export function calculateSkillMatch(studentSkills = [], projectRequiredSkills = []) {
  if (!Array.isArray(projectRequiredSkills) || projectRequiredSkills.length === 0) {
    return {
      matchPercentage: 0,
      matchedSkills: [],
      missingSkills: [],
      totalRequired: 0,
      matchedCount: 0,
      tier: 'No Match',
      tierLabel: 'No Match',
      badgeClass: 'bg-neutral-100 text-neutral-600 border-neutral-200'
    }
  }

  const normalizedStudentSkills = new Set(
    (Array.isArray(studentSkills) ? studentSkills : [])
      .map(s => normalizeSkill(s))
      .filter(Boolean)
  )

  const matchedSkills = []
  const missingSkills = []

  projectRequiredSkills.forEach(reqSkill => {
    const normalizedReq = normalizeSkill(reqSkill)
    if (!normalizedReq) return

    // Check direct normalized match or partial synonym/substring containment
    // e.g. "vue" vs "vue 3", "ui/ux design" vs "ui design", etc.
    const hasMatch = Array.from(normalizedStudentSkills).some(stuSkill => {
      if (stuSkill === normalizedReq) return true
      // Flexible matching for typical compound tech skills:
      if (
        (stuSkill.includes('vue') && normalizedReq.includes('vue')) ||
        (stuSkill.includes('tailwind') && normalizedReq.includes('tailwind')) ||
        (stuSkill.includes('ui/ux') && (normalizedReq.includes('ui design') || normalizedReq.includes('ux design'))) ||
        (stuSkill.includes('ui design') && (normalizedReq.includes('ui/ux') || normalizedReq.includes('ui design'))) ||
        (stuSkill.includes('web development') && normalizedReq.includes('web development'))
      ) {
        return true
      }
      return false
    })

    if (hasMatch) {
      matchedSkills.push(reqSkill)
    } else {
      missingSkills.push(reqSkill)
    }
  })

  const totalRequired = projectRequiredSkills.length
  const matchedCount = matchedSkills.length
  const matchPercentage = totalRequired > 0 ? Math.round((matchedCount / totalRequired) * 100) : 0

  let tier = 'No Match'
  let tierLabel = 'No Match'
  let badgeClass = 'bg-neutral-100 text-neutral-600 border-neutral-200'

  if (matchPercentage >= 80) {
    tier = 'Best Match'
    tierLabel = 'Best Match'
    badgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-1 ring-emerald-400/20'
  } else if (matchPercentage >= 50) {
    tier = 'Good Match'
    tierLabel = 'Good Match'
    badgeClass = 'bg-blue-50 text-blue-700 border-blue-200 ring-1 ring-blue-400/20'
  } else if (matchPercentage > 0) {
    tier = 'Other Opportunities'
    tierLabel = 'Other Match'
    badgeClass = 'bg-amber-50 text-amber-700 border-amber-200 ring-1 ring-amber-400/20'
  }

  return {
    matchPercentage,
    matchedSkills,
    missingSkills,
    totalRequired,
    matchedCount,
    tier,
    tierLabel,
    badgeClass
  }
}

/**
 * Gets ranked recommendations for a given student.
 * Excludes:
 * - Projects the student has already applied to
 * - Projects with 0% match
 * 
 * Sorts by match percentage descending, then newest posted time.
 * 
 * @param {Object} studentUser - The current student user object with `id` and `skills`
 * @param {Object} options - Filter & sorting options { minMatchTier, category, experienceLevel, projectType, sortBy }
 * @returns {Array<Object>} List of project objects enriched with `matchDetails`
 */
export function getRecommendedProjects(studentUser, options = {}) {
  if (!studentUser) return []

  const studentSkills = studentUser.skills || []
  const studentId = studentUser.id

  const results = []

  for (const project of studentAvailableProjects.value) {
    // Exclude projects student has already applied to
    if (studentId && hasStudentApplied(project.id, studentId)) {
      continue
    }

    const matchDetails = calculateSkillMatch(studentSkills, project.skills || [])

    // Only recommend if match percentage > 0
    if (matchDetails.matchPercentage > 0) {
      results.push({
        ...project,
        matchDetails
      })
    }
  }

  // Filter options
  let filtered = results

  if (options.tier && options.tier !== 'all') {
    filtered = filtered.filter(item => {
      if (options.tier === 'best') return item.matchDetails.matchPercentage >= 80
      if (options.tier === 'good') return item.matchDetails.matchPercentage >= 50 && item.matchDetails.matchPercentage < 80
      if (options.tier === 'other') return item.matchDetails.matchPercentage > 0 && item.matchDetails.matchPercentage < 50
      return true
    })
  }

  if (options.category && options.category !== 'All') {
    filtered = filtered.filter(item => item.category === options.category)
  }

  if (options.experienceLevel && options.experienceLevel !== 'All') {
    filtered = filtered.filter(item => item.experienceLevel === options.experienceLevel)
  }

  if (options.projectType && options.projectType !== 'All') {
    filtered = filtered.filter(item => item.projectType === options.projectType)
  }

  // Sorting
  const sortBy = options.sortBy || 'match_desc'
  filtered.sort((a, b) => {
    if (sortBy === 'match_desc') {
      if (b.matchDetails.matchPercentage !== a.matchDetails.matchPercentage) {
        return b.matchDetails.matchPercentage - a.matchDetails.matchPercentage
      }
      return (a.postedMinutesAgo || 0) - (b.postedMinutesAgo || 0)
    } else if (sortBy === 'newest') {
      return (a.postedMinutesAgo || 0) - (b.postedMinutesAgo || 0)
    } else if (sortBy === 'budget_high') {
      const budgetA = a.price || a.minBudget || 0
      const budgetB = b.price || b.minBudget || 0
      return budgetB - budgetA
    }
    return 0
  })

  return filtered
}
