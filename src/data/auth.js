import { reactive, computed } from 'vue'

const STORAGE_KEY = 'prilans_current_user'
const USERS_STORAGE_KEY = 'prilans_registered_users'
const SESSION_KEY = 'prilans_session'

export const defaultStudentProfile = {
  id: 'student-akmal',
  role: 'student',
  fullName: 'Akmal Nasrulloh',
  email: 'akmalnslrh@gmail.com',
  university: 'University of Dhaka',
  department: 'Computer Science & Engineering',
  studentId: 'CS-2022-8921',
  bio: 'Passionate student developer and UI/UX enthusiast. Experienced in creating modern Vue 3 web applications and responsive landing pages.',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
  experienceLevel: 'Intermediate',
  experienceDescription: '2+ years building frontend web interfaces, contributing to academic projects and freelance clients.',
  skills: [
    'Frontend Development',
    'Vue',
    'JavaScript',
    'Tailwind CSS',
    'UI/UX Design',
    'Web Development'
  ],
  portfolio: [
    {
      id: 1,
      name: 'EduTrack - Student Learning Portal',
      description: 'An interactive course management dashboard for university students with timetable scheduling and grade calculations.',
      url: 'https://edutrack-demo.example.com',
      technologies: ['Vue 3', 'Tailwind CSS', 'Vite'],
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 2,
      name: 'EcoShop - Green Marketplace Landing Page',
      description: 'High-converting responsive e-commerce landing page with product filtering and basket checkout simulation.',
      url: 'https://ecoshop-demo.example.com',
      technologies: ['JavaScript', 'HTML5', 'CSS3', 'Figma'],
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80'
    }
  ]
}

export const defaultClientProfile = {
  id: 'client-techcorp',
  role: 'client',
  fullName: 'Sarah Jenkins',
  email: 'sarah.jenkins@novadigital.io',
  company: 'Nova Digital Labs',
  location: 'San Francisco, CA',
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&q=80',
  bio: 'Founder & Product Lead at Nova Digital Labs. We connect with talented university students for frontend, full-stack, and design projects.'
}

function loadInitialUser() {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return defaultStudentProfile
  }
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (!parsed.role) parsed.role = 'student'
      return parsed
    }
  } catch (e) {
    console.error('Failed to load user from localStorage:', e)
  }
  return defaultStudentProfile
}

function loadInitialSession() {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return true
  }
  try {
    const session = localStorage.getItem(SESSION_KEY)
    if (session !== null) {
      return JSON.parse(session)
    }
  } catch (e) {
    console.error(e)
  }
  return true
}

export const authState = reactive({
  currentUser: loadInitialUser(),
  isAuthenticated: loadInitialSession(),
  setupCompleted: true
})

export const currentRole = computed(() => {
  return authState.currentUser?.role || 'student'
})

export const isClient = computed(() => {
  return authState.isAuthenticated && currentRole.value === 'client'
})

export const isStudent = computed(() => {
  return authState.isAuthenticated && currentRole.value === 'student'
})

// Save user helper
export function saveCurrentUser(updatedUser) {
  authState.currentUser = { ...authState.currentUser, ...updatedUser }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authState.currentUser))
  } catch (e) {
    console.error('Error saving user to localStorage:', e)
  }
}

// Register student
export function registerUser(registrationData) {
  const newUser = {
    ...defaultStudentProfile,
    id: 'student-' + Date.now(),
    role: 'student',
    fullName: registrationData.fullName,
    email: registrationData.email,
    university: registrationData.university,
    studentId: registrationData.studentId,
    department: registrationData.department,
    bio: `Student at ${registrationData.university}, Department of ${registrationData.department}.`,
    skills: ['Web Development', 'Frontend Development'],
    portfolio: []
  }

  saveToRegisteredUsers({ ...newUser, password: registrationData.password })

  authState.currentUser = newUser
  authState.isAuthenticated = true
  authState.setupCompleted = false
  localStorage.setItem(SESSION_KEY, 'true')
  saveCurrentUser(newUser)
  return { success: true }
}

// Register client
export function registerClient(registrationData) {
  const newClient = {
    ...defaultClientProfile,
    id: 'client-' + Date.now(),
    role: 'client',
    fullName: registrationData.fullName,
    email: registrationData.email,
    company: registrationData.company,
    location: registrationData.location || 'Remote',
    bio: `Talent recruiter & project manager at ${registrationData.company}.`
  }

  saveToRegisteredUsers({ ...newClient, password: registrationData.password })

  authState.currentUser = newClient
  authState.isAuthenticated = true
  authState.setupCompleted = true
  localStorage.setItem(SESSION_KEY, 'true')
  saveCurrentUser(newClient)
  return { success: true }
}

function saveToRegisteredUsers(userWithPassword) {
  try {
    const registered = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]')
    const filtered = registered.filter(u => u.email.toLowerCase() !== userWithPassword.email.toLowerCase())
    filtered.push(userWithPassword)
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(filtered))
  } catch (e) {
    console.error(e)
  }
}

// Login user (Student or Client)
export function loginUser(email, password, forcedRole = null) {
  let userToLogin = null
  try {
    const registered = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]')
    const match = registered.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (match) {
      userToLogin = match
    }
  } catch (e) {
    console.error(e)
  }

  if (!userToLogin) {
    // If logging into client portal specifically
    if (forcedRole === 'client' || email.includes('client') || email.includes('nova') || email.includes('sarah')) {
      userToLogin = {
        ...defaultClientProfile,
        email: email,
        fullName: email.split('@')[0].replace('.', ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase()),
        role: 'client'
      }
    } else {
      userToLogin = {
        ...defaultStudentProfile,
        email: email,
        fullName: email.split('@')[0].replace('.', ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase()),
        role: 'student'
      }
    }
  }

  if (forcedRole && userToLogin.role !== forcedRole) {
    userToLogin.role = forcedRole
  }

  authState.currentUser = userToLogin
  authState.isAuthenticated = true
  authState.setupCompleted = true
  try {
    localStorage.setItem(SESSION_KEY, 'true')
  } catch (e) {}
  saveCurrentUser(userToLogin)
  return { success: true, role: userToLogin.role }
}

// Quick demo role switch helper (makes testing painless)
export function switchRole(role) {
  if (role === 'client') {
    authState.currentUser = { ...defaultClientProfile }
  } else {
    authState.currentUser = { ...defaultStudentProfile }
  }
  authState.isAuthenticated = true
  saveCurrentUser(authState.currentUser)
}

// Logout user
export function logoutUser() {
  authState.isAuthenticated = false
  try {
    localStorage.setItem(SESSION_KEY, 'false')
  } catch (e) {}
}

// Profile completion percentage calculator
export const profileCompletionPercentage = computed(() => {
  const u = authState.currentUser
  if (!u) return 0
  let score = 0
  if (u.fullName) score += 15
  if (u.email) score += 10
  if (u.university && u.department && u.studentId) score += 20
  if (u.bio && u.bio.length > 20) score += 15
  if (u.skills && u.skills.length >= 3) score += 20
  if (u.experienceLevel) score += 10
  if (u.portfolio && u.portfolio.length > 0) score += 10
  return Math.min(score, 100)
})

export const availableSkillsList = [
  'Web Development',
  'Frontend Development',
  'Backend Development',
  'Java',
  'JavaScript',
  'PHP',
  'Laravel',
  'React',
  'Vue',
  'UI/UX Design',
  'Graphic Design',
  'Content Writing',
  'Digital Marketing',
  'Python',
  'HTML',
  'CSS',
  'MySQL'
]
