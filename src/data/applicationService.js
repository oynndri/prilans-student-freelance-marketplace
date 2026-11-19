import { reactive, computed } from 'vue'

const APPLICATIONS_KEY = 'prilans_applications'
const NOTIFICATIONS_KEY = 'prilans_notifications'

// Initial seed mock applications to demonstrate the dashboard immediately
const defaultApplications = [
  {
    id: 'app-seed-comp-1',
    projectId: 2,
    projectTitle: 'Looking for Help to Build an iOS and Android App',
    projectCategory: 'Mobile Development',
    projectPriceDisplay: '$32.00 /hour',
    studentId: 'student-akmal',
    studentName: 'Akmal Nasrulloh',
    studentEmail: 'akmalnslrh@gmail.com',
    studentUniversity: 'University of Dhaka',
    studentDepartment: 'Computer Science & Engineering',
    studentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
    studentSkills: ['Vue', 'JavaScript', 'Tailwind CSS', 'Mobile Development'],
    studentExperienceLevel: 'Intermediate',
    clientId: 'client-techcorp',
    proposal: 'Completed the hybrid mobile wrapper components and responsive dashboard screens successfully.',
    proposedBudget: '$32.00 /hour',
    estimatedDuration: '3 weeks',
    additionalInfo: 'Delivered all deliverables on GitHub.',
    status: 'Accepted',
    workStatus: 'Completed', // 'In Progress', 'Completed'
    appliedAt: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString()
  },
  {
    id: 'app-seed-1',
    projectId: 3, // Web Designer for E-Commerce Website (pre-applied in reference screenshot)
    projectTitle: 'Web Designer for E-Commerce Website',
    projectCategory: 'Web Development',
    projectPriceDisplay: '$25.00 /hour',
    studentId: 'student-akmal',
    studentName: 'Akmal Nasrulloh',
    studentEmail: 'akmalnslrh@gmail.com',
    studentUniversity: 'University of Dhaka',
    studentDepartment: 'Computer Science & Engineering',
    studentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
    studentSkills: ['Vue', 'JavaScript', 'Tailwind CSS', 'WordPress', 'UI/UX Design'],
    studentExperienceLevel: 'Intermediate',
    clientId: 'client-techcorp',
    proposal: 'Hello! I have 2+ years of WordPress & Vue theme customization experience. I can redesign your responsive WooCommerce layout, optimize the navigation menu, and deliver pixel-perfect landing components efficiently.',
    proposedBudget: '$25.00 /hour',
    estimatedDuration: '2 weeks',
    additionalInfo: 'Available 20 hours per week. Can start immediately.',
    status: 'Accepted', // Let's make this accepted & in progress so client can test marking as Completed
    workStatus: 'In Progress',
    appliedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: 'app-seed-2',
    projectId: 1, // Let's Collaborate on HAV's Website Redesign
    projectTitle: "Let's Collaborate on HAV's Website Redesign",
    projectCategory: 'Web Design',
    projectPriceDisplay: '$15.00 /hour',
    studentId: 'student-samir',
    studentName: 'Samir Chowdhury',
    studentEmail: 'samir.c@univ.edu',
    studentUniversity: 'North South University',
    studentDepartment: 'Software Engineering',
    studentAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=160&q=80',
    studentSkills: ['UI Design', 'Figma', 'Landing Page', 'WordPress'],
    studentExperienceLevel: 'Entry Level',
    clientId: 'client-techcorp',
    proposal: 'Passionate student designer eager to collaborate on HAV. I have built multiple landing page wireframes and converted them to live sites.',
    proposedBudget: '$15.00 /hour',
    estimatedDuration: '10 days',
    additionalInfo: '',
    status: 'Pending',
    workStatus: null,
    appliedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString()
  }
]

const defaultNotifications = [
  {
    id: 'notif-1',
    userId: 'student-akmal',
    title: 'Application Submitted',
    message: 'Your application for "Web Designer for E-Commerce Website" has been successfully received by the client.',
    isRead: false,
    type: 'submission',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
  }
]

function loadStoredApplications() {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return defaultApplications
  }
  try {
    const saved = localStorage.getItem(APPLICATIONS_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch (e) {
    console.error('Error loading prilans_applications from localStorage:', e)
  }
  return defaultApplications
}

function loadStoredNotifications() {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return defaultNotifications
  }
  try {
    const saved = localStorage.getItem(NOTIFICATIONS_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed)) return parsed
    }
  } catch (e) {
    console.error('Error loading prilans_notifications from localStorage:', e)
  }
  return defaultNotifications
}

export const applicationState = reactive({
  applications: loadStoredApplications(),
  notifications: loadStoredNotifications()
})

function persistApplications() {
  try {
    localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(applicationState.applications))
  } catch (e) {
    console.error('Failed saving applications:', e)
  }
}

function persistNotifications() {
  try {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(applicationState.notifications))
  } catch (e) {
    console.error('Failed saving notifications:', e)
  }
}

// Check if student already applied to a project
export function hasStudentApplied(projectId, studentId) {
  return applicationState.applications.some(
    app => String(app.projectId) === String(projectId) && app.studentId === studentId
  )
}

// Submit Application
export function submitApplication(data) {
  // Prevent duplicate
  if (hasStudentApplied(data.projectId, data.studentId)) {
    return { success: false, message: 'You have already applied for this project.' }
  }

  const newApp = {
    id: 'app-' + Date.now(),
    projectId: data.projectId,
    projectTitle: data.projectTitle,
    projectCategory: data.projectCategory || 'Web Development',
    projectPriceDisplay: data.projectPriceDisplay || '$20.00 /hour',
    studentId: data.studentId,
    studentName: data.studentName,
    studentEmail: data.studentEmail,
    studentUniversity: data.studentUniversity || 'University Student',
    studentDepartment: data.studentDepartment || 'Engineering',
    studentAvatar: data.studentAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
    studentSkills: [...(data.studentSkills || [])],
    studentExperienceLevel: data.studentExperienceLevel || 'Intermediate',
    clientId: data.clientId || 'client-techcorp',
    proposal: data.proposal,
    proposedBudget: data.proposedBudget,
    estimatedDuration: data.estimatedDuration,
    additionalInfo: data.additionalInfo || '',
    status: 'Pending',
    appliedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  applicationState.applications.unshift(newApp)
  persistApplications()

  // Generate confirmation notification for student
  createNotification({
    userId: data.studentId,
    title: 'Application Submitted Successfully',
    message: `Your proposal for "${data.projectTitle}" is now under review by the client.`,
    type: 'submission'
  })

  return { success: true, application: newApp }
}

// Withdraw pending application
export function withdrawApplication(applicationId, studentId) {
  const index = applicationState.applications.findIndex(
    a => a.id === applicationId && a.studentId === studentId
  )
  if (index !== -1) {
    const target = applicationState.applications[index]
    if (target.status !== 'Pending') {
      return { success: false, message: 'Only Pending applications can be withdrawn.' }
    }
    applicationState.applications.splice(index, 1)
    persistApplications()
    return { success: true }
  }
  return { success: false, message: 'Application not found.' }
}

// Client action: Update status (Accept / Reject)
export function updateApplicationStatus(applicationId, newStatus, clientNote = '') {
  const app = applicationState.applications.find(a => a.id === applicationId)
  if (!app) return { success: false, message: 'Application not found.' }

  app.status = newStatus
  app.updatedAt = new Date().toISOString()
  if (clientNote) app.clientNote = clientNote

  // When accepted, initiate workStatus as 'In Progress'
  if (newStatus === 'Accepted' && !app.workStatus) {
    app.workStatus = 'In Progress'
  } else if (newStatus !== 'Accepted') {
    app.workStatus = null
  }

  persistApplications()

  // Notification for the student
  const title = newStatus === 'Accepted'
    ? 'Congratulations! Application Accepted'
    : 'Application Status Update'

  const message = newStatus === 'Accepted'
    ? `Your application for "${app.projectTitle}" has been accepted! The engagement is now In Progress.`
    : `Your application for "${app.projectTitle}" was not selected. We encourage you to apply for other matching gigs.`

  createNotification({
    userId: app.studentId,
    title,
    message,
    type: newStatus.toLowerCase()
  })

  return { success: true, application: app }
}

// Client action: Update Work Completion Status ('In Progress' -> 'Completed')
export function updateWorkStatus(applicationId, workStatus) {
  const app = applicationState.applications.find(a => a.id === applicationId)
  if (!app) return { success: false, message: 'Application not found.' }

  if (app.status !== 'Accepted') {
    return { success: false, message: 'Work completion status can only be updated for Accepted applications.' }
  }

  app.workStatus = workStatus // 'In Progress' | 'Completed'
  app.updatedAt = new Date().toISOString()
  persistApplications()

  if (workStatus === 'Completed') {
    // Notify student that project has been marked completed and reviews are open
    createNotification({
      userId: app.studentId,
      title: 'Project Completed! Review Available',
      message: `Your project "${app.projectTitle}" has been marked Completed by the client. You can now leave a review for your experience!`,
      type: 'completed'
    })
  }

  return { success: true, application: app }
}

// Notification helpers
export function createNotification({ userId, title, message, type = 'info' }) {
  const notif = {
    id: 'notif-' + Date.now(),
    userId,
    title,
    message,
    type,
    isRead: false,
    createdAt: new Date().toISOString()
  }
  applicationState.notifications.unshift(notif)
  persistNotifications()
  return notif
}

export function markNotificationAsRead(id) {
  const n = applicationState.notifications.find(item => item.id === id)
  if (n) {
    n.isRead = true
    persistNotifications()
  }
}

export function markAllNotificationsAsRead(userId) {
  applicationState.notifications.forEach(n => {
    if (!userId || n.userId === userId) {
      n.isRead = true
    }
  })
  persistNotifications()
}

// Queries
export function getApplicationsByStudent(studentId) {
  return applicationState.applications.filter(a => a.studentId === studentId)
}

export function getApplicationsByProject(projectId) {
  return applicationState.applications.filter(a => String(a.projectId) === String(projectId))
}

export function getApplicationsByClient(clientId) {
  return applicationState.applications.filter(a => a.clientId === clientId)
}

export function getNotificationsByUser(userId) {
  return applicationState.notifications.filter(n => n.userId === userId)
}

export function getUnreadNotificationCount(userId) {
  return applicationState.notifications.filter(n => n.userId === userId && !n.isRead).length
}
