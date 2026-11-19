import { reactive, computed } from 'vue'
import { mockProjects as initialMockProjects, mockCategories } from './projects'

const PROJECTS_STORAGE_KEY = 'prilans_projects'

function loadStoredProjects() {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return initialMockProjects
  }
  try {
    const saved = localStorage.getItem(PROJECTS_STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (e) {
    console.error('Error loading prilans_projects from localStorage:', e)
  }
  return initialMockProjects
}

export const projectState = reactive({
  projects: loadStoredProjects()
})

function persistProjects() {
  try {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projectState.projects))
  } catch (e) {
    console.error('Failed to save projects to localStorage:', e)
  }
}

// Student-facing available projects (only 'Open' projects, plus initial mock projects without explicit non-open status, AND not hidden/moderated by Admin)
export const studentAvailableProjects = computed(() => {
  return projectState.projects.filter(p => {
    // If moderated or hidden by Admin, hide from student marketplace
    if (p.isModerated || p.isHiddenByAdmin) {
      return false
    }
    // If it has status property, it must be 'Open'
    if (p.status) {
      return p.status === 'Open'
    }
    return true
  })
})

// Create / Publish Project (Client)
export function createProject(projectData, clientId, isDraft = false) {
  const isHourly = projectData.projectType === 'Hourly'
  const minBudget = Number(projectData.minBudget) || 15
  const maxBudget = Number(projectData.maxBudget) || 30
  const currency = projectData.currency || '$'
  const price = isHourly ? minBudget : minBudget

  const priceDisplay = isHourly
    ? `${currency}${minBudget.toFixed(2)} - ${currency}${maxBudget.toFixed(2)} /hour`
    : `${currency}${minBudget.toLocaleString()}`

  const newProj = {
    id: Date.now(),
    clientId: clientId || 'client-techcorp',
    title: projectData.title,
    description: projectData.description,
    category: projectData.category || 'Web Development',
    skills: [...projectData.skills],
    projectType: projectData.projectType, // 'Hourly' or 'Fixed Price'
    minBudget,
    maxBudget,
    price,
    priceDisplay,
    currency,
    experienceLevel: projectData.experienceLevel || 'Intermediate',
    country: projectData.location || 'Remote',
    deadline: projectData.deadline || '30 days',
    positions: Number(projectData.positions) || 1,
    additionalRequirements: projectData.additionalRequirements || '',
    status: isDraft ? 'Draft' : 'Open', // 'Draft', 'Open', 'Paused', 'Closed'
    isModerated: false,
    isHiddenByAdmin: false,
    postedTime: 'Just now',
    postedMinutesAgo: 0,
    verified: true,
    hiringStatus: 'Still Selecting',
    hiringType: 'selecting',
    proposalCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  // Prepend to project list
  projectState.projects.unshift(newProj)
  persistProjects()
  return newProj
}

// Update / Edit Project (Client or Admin moderation)
export function updateProject(id, updatedFields) {
  const index = projectState.projects.findIndex(p => String(p.id) === String(id))
  if (index !== -1) {
    const existing = projectState.projects[index]
    const merged = { ...existing, ...updatedFields, updatedAt: new Date().toISOString() }

    // Recompute priceDisplay if budgets changed
    if (updatedFields.minBudget || updatedFields.projectType || updatedFields.currency) {
      const isHourly = merged.projectType === 'Hourly'
      const min = Number(merged.minBudget) || 15
      const max = Number(merged.maxBudget) || min
      const cur = merged.currency || '$'
      merged.price = min
      merged.priceDisplay = isHourly
        ? `${cur}${min.toFixed(2)} - ${cur}${max.toFixed(2)} /hour`
        : `${cur}${min.toLocaleString()}`
    }

    projectState.projects[index] = merged
    persistProjects()
    return merged
  }
  return null
}

// Admin project moderation: Hide / Show
export function toggleProjectModeration(id) {
  const p = projectState.projects.find(item => String(item.id) === String(id))
  if (p) {
    p.isModerated = !p.isModerated
    p.isHiddenByAdmin = p.isModerated
    persistProjects()
    return p
  }
  return null
}

// Delete Project (Client or Admin)
export function deleteProject(id) {
  projectState.projects = projectState.projects.filter(p => String(p.id) !== String(id))
  persistProjects()
}

// Status change convenience methods
export function setProjectStatus(id, newStatus) {
  return updateProject(id, { status: newStatus })
}

// Get Client Projects
export function getProjectsByClient(clientId) {
  return projectState.projects.filter(p => p.clientId === clientId)
}

// Find single project
export function getProjectById(id) {
  return projectState.projects.find(p => String(p.id) === String(id))
}

export { mockCategories }
