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
  status: 'active', // 'active' | 'suspended'
  createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
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
  bio: 'Founder & Product Lead at Nova Digital Labs. We connect with talented university students for frontend, full-stack, and design projects.',
  status: 'active', // 'active' | 'suspended'
  createdAt: new Date(Date.now() - 3600000 * 72).toISOString()
}

export const defaultAdminProfile = {
  id: 'admin-1',
  role: 'admin',
  fullName: 'Prilans System Administrator',
  email: 'admin@prilans.demo',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&q=80',
  bio: 'Platform Moderator and Governance Administrator for Prilans Student Marketplace.',
  status: 'active'
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

export const isAdmin = computed(() => {
  return authState.isAuthenticated && currentRole.value === 'admin'
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

// Seed initial registered users if empty so Admin can immediately view seed accounts
function initSeedUsers() {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return
  try {
    const existing = localStorage.getItem(USERS_STORAGE_KEY)
    if (!existing) {
      const seeds = [
        { ...defaultStudentProfile, password: 'password123' },
        {
          id: 'student-2',
          role: 'student',
          fullName: 'Tanvir Hossain',
          email: 'tanvir.cse@aust.edu',
          university: 'Ahsanullah University of Science & Technology',
          department: 'Computer Science',
          studentId: 'AUST-2021-4412',
          skills: ['Python', 'Django', 'React', 'MySQL'],
          experienceLevel: 'Intermediate',
          status: 'active',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80',
          createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
          password: 'password123'
        },
        {
          id: 'student-3',
          role: 'student',
          fullName: 'Priya Sharma',
          email: 'priya.design@univ.edu',
          university: 'Brac University',
          department: 'Architecture & Design',
          studentId: 'BRAC-2023-1109',
          skills: ['UI/UX Design', 'Figma', 'Graphic Design', 'Prototyping'],
          experienceLevel: 'Entry Level',
          status: 'active',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80',
          createdAt: new Date(Date.now() - 3600000 * 36).toISOString(),
          password: 'password123'
        },
        { ...defaultClientProfile, password: 'password123' },
        {
          id: 'client-2',
          role: 'client',
          fullName: 'Marcus Vance',
          email: 'marcus@vancecreative.com',
          company: 'Vance Creative Studio',
          location: 'Berlin, Germany',
          status: 'active',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80',
          createdAt: new Date(Date.now() - 3600000 * 96).toISOString(),
          password: 'password123'
        },
        {
          ...defaultAdminProfile,
          password: 'admin123'
        }
      ]
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(seeds))
    }
  } catch (e) {
    console.error(e)
  }
}
initSeedUsers()

// Get all registered users from localStorage
export function getRegisteredUsers() {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return []
  try {
    const list = localStorage.getItem(USERS_STORAGE_KEY)
    if (list) return JSON.parse(list)
  } catch (e) {
    console.error(e)
  }
  return [defaultStudentProfile, defaultClientProfile, defaultAdminProfile]
}

// Update a user record (for suspension / activation)
export function updateUserRecord(userId, updates) {
  try {
    const list = getRegisteredUsers()
    const index = list.findIndex(u => u.id === userId)
    if (index !== -1) {
      list[index] = { ...list[index], ...updates }
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(list))

      // If updating currently logged in user, update state as well
      if (authState.currentUser?.id === userId) {
        saveCurrentUser(updates)
      }
      return list[index]
    }
  } catch (e) {
    console.error(e)
  }
  return null
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
    portfolio: [],
    status: 'active',
    createdAt: new Date().toISOString()
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
    bio: `Talent recruiter & project manager at ${registrationData.company}.`,
    status: 'active',
    createdAt: new Date().toISOString()
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
    const registered = getRegisteredUsers()
    const filtered = registered.filter(u => u.email.toLowerCase() !== userWithPassword.email.toLowerCase())
    filtered.push(userWithPassword)
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(filtered))
  } catch (e) {
    console.error(e)
  }
}

// Login user (Student, Client, or Admin)
export function loginUser(email, password, forcedRole = null) {
  const registered = getRegisteredUsers()
  let userToLogin = registered.find(u => u.email.toLowerCase() === email.toLowerCase())

  // Admin login check
  if (email.toLowerCase() === 'admin@prilans.demo' && password === 'admin123') {
    userToLogin = {
      ...defaultAdminProfile,
      role: 'admin'
    }
  }

  if (userToLogin && userToLogin.status === 'suspended') {
    return { success: false, message: 'This account has been suspended by the platform administrator.' }
  }

  if (!userToLogin) {
    if (forcedRole === 'client' || email.includes('client') || email.includes('nova') || email.includes('sarah')) {
      userToLogin = {
        ...defaultClientProfile,
        email: email,
        fullName: email.split('@')[0].replace('.', ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase()),
        role: 'client',
        status: 'active'
      }
    } else if (forcedRole === 'admin' || email.includes('admin')) {
      userToLogin = {
        ...defaultAdminProfile,
        email: email,
        role: 'admin',
        status: 'active'
      }
    } else {
      userToLogin = {
        ...defaultStudentProfile,
        email: email,
        fullName: email.split('@')[0].replace('.', ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase()),
        role: 'student',
        status: 'active'
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

// Quick demo role switch helper (Student, Client, Admin)
export function switchRole(role) {
  if (role === 'admin') {
    authState.currentUser = { ...defaultAdminProfile }
  } else if (role === 'client') {
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
