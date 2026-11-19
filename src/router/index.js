import { createRouter, createWebHistory } from 'vue-router'
import { authState } from '../data/auth'

// Student Views
import StudentDashboardView from '../views/student/StudentDashboardView.vue'
import RecommendedProjectsView from '../views/student/RecommendedProjectsView.vue'
import FindProjects from '../views/FindProjects.vue'
import RegisterView from '../views/RegisterView.vue'
import LoginView from '../views/LoginView.vue'
import ProfileSetupView from '../views/ProfileSetupView.vue'
import StudentProfileView from '../views/StudentProfileView.vue'
import ProjectDetailsPublicView from '../views/ProjectDetailsPublicView.vue'
import ApplyProjectView from '../views/ApplyProjectView.vue'
import MyApplicationsView from '../views/MyApplicationsView.vue'
import NotificationsView from '../views/NotificationsView.vue'
import ReviewsView from '../views/ReviewsView.vue'

// Client Views
import ClientRegisterView from '../views/client/ClientRegisterView.vue'
import ClientLoginView from '../views/client/ClientLoginView.vue'
import ClientDashboardView from '../views/client/ClientDashboardView.vue'
import PostProjectView from '../views/client/PostProjectView.vue'
import ManageProjectsView from '../views/client/ManageProjectsView.vue'
import ProjectDetailsView from '../views/client/ProjectDetailsView.vue'
import ProjectApplicantsView from '../views/client/ProjectApplicantsView.vue'
import RecommendedStudentsView from '../views/client/RecommendedStudentsView.vue'

// Admin Views
import AdminLoginView from '../views/admin/AdminLoginView.vue'
import AdminDashboardView from '../views/admin/AdminDashboardView.vue'
import AdminStudentsView from '../views/admin/AdminStudentsView.vue'
import AdminClientsView from '../views/admin/AdminClientsView.vue'
import AdminProjectsView from '../views/admin/AdminProjectsView.vue'
import AdminApplicationsView from '../views/admin/AdminApplicationsView.vue'

const routes = [
  // 1. Student Portal Routes
  {
    path: '/',
    redirect: () => {
      if (authState.isAuthenticated) {
        if (authState.currentUser?.role === 'admin') return '/admin/dashboard'
        if (authState.currentUser?.role === 'client') return '/client/dashboard'
        return '/student/dashboard'
      }
      return '/student/projects'
    }
  },
  {
    path: '/student/dashboard',
    name: 'StudentDashboard',
    component: StudentDashboardView,
    meta: { requiresRole: 'student' }
  },
  {
    path: '/student/recommendations',
    name: 'RecommendedProjects',
    component: RecommendedProjectsView,
    meta: { requiresRole: 'student' }
  },
  {
    path: '/student/projects',
    name: 'FindProjects',
    component: FindProjects
  },
  {
    path: '/projects/:id',
    name: 'ProjectDetailsPublic',
    component: ProjectDetailsPublicView
  },
  {
    path: '/projects/:id/apply',
    name: 'ApplyProject',
    component: ApplyProjectView,
    meta: { requiresRole: 'student' }
  },
  {
    path: '/my-applications',
    name: 'MyApplications',
    component: MyApplicationsView,
    meta: { requiresRole: 'student' }
  },
  {
    path: '/notifications',
    name: 'Notifications',
    component: NotificationsView
  },
  {
    path: '/student/reviews',
    name: 'StudentReviews',
    component: ReviewsView,
    meta: { requiresRole: 'student' }
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/profile-setup',
    name: 'ProfileSetup',
    component: ProfileSetupView,
    meta: { requiresRole: 'student' }
  },
  {
    path: '/profile',
    name: 'StudentProfile',
    component: StudentProfileView,
    meta: { requiresRole: 'student' }
  },

  // 2. Client Portal Routes
  {
    path: '/client/register',
    name: 'ClientRegister',
    component: ClientRegisterView
  },
  {
    path: '/client/login',
    name: 'ClientLogin',
    component: ClientLoginView
  },
  {
    path: '/client/dashboard',
    name: 'ClientDashboard',
    component: ClientDashboardView,
    meta: { requiresRole: 'client' }
  },
  {
    path: '/client/projects/new',
    name: 'PostProject',
    component: PostProjectView,
    meta: { requiresRole: 'client' }
  },
  {
    path: '/client/projects/:id/edit',
    name: 'EditProject',
    component: PostProjectView,
    meta: { requiresRole: 'client' }
  },
  {
    path: '/client/projects',
    name: 'ManageProjects',
    component: ManageProjectsView,
    meta: { requiresRole: 'client' }
  },
  {
    path: '/client/projects/:id',
    name: 'ProjectDetails',
    component: ProjectDetailsView,
    meta: { requiresRole: 'client' }
  },
  {
    path: '/client/projects/:id/applicants',
    name: 'ProjectApplicants',
    component: ProjectApplicantsView,
    meta: { requiresRole: 'client' }
  },
  {
    path: '/client/projects/:id/recommended-students',
    name: 'RecommendedStudents',
    component: RecommendedStudentsView,
    meta: { requiresRole: 'client' }
  },
  {
    path: '/client/reviews',
    name: 'ClientReviews',
    component: ReviewsView,
    meta: { requiresRole: 'client' }
  },

  // 3. Admin Portal Routes
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: AdminLoginView
  },
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: AdminDashboardView,
    meta: { requiresRole: 'admin' }
  },
  {
    path: '/admin/students',
    name: 'AdminStudents',
    component: AdminStudentsView,
    meta: { requiresRole: 'admin' }
  },
  {
    path: '/admin/clients',
    name: 'AdminClients',
    component: AdminClientsView,
    meta: { requiresRole: 'admin' }
  },
  {
    path: '/admin/projects',
    name: 'AdminProjects',
    component: AdminProjectsView,
    meta: { requiresRole: 'admin' }
  },
  {
    path: '/admin/applications',
    name: 'AdminApplications',
    component: AdminApplicationsView,
    meta: { requiresRole: 'admin' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Centralized Role-Based Route Guard
router.beforeEach((to, from, next) => {
  const requiresRole = to.meta.requiresRole

  if (requiresRole) {
    if (!authState.isAuthenticated) {
      if (requiresRole === 'admin') return next('/admin/login')
      if (requiresRole === 'client') return next('/client/login')
      return next('/login')
    }

    const userRole = authState.currentUser?.role || 'student'
    if (userRole !== requiresRole) {
      // Wrong role entered via URL -> Redirect to their own portal dashboard
      if (userRole === 'admin') return next('/admin/dashboard')
      if (userRole === 'client') return next('/client/dashboard')
      return next('/student/dashboard')
    }
  }

  next()
})

export default router
