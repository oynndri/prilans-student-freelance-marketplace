import { createRouter, createWebHistory } from 'vue-router'
import { authState } from '../data/auth'

// Student & Public Views
import FindProjects from '../views/FindProjects.vue'
import RegisterView from '../views/RegisterView.vue'
import LoginView from '../views/LoginView.vue'
import ProfileSetupView from '../views/ProfileSetupView.vue'
import StudentProfileView from '../views/StudentProfileView.vue'
import ProjectDetailsPublicView from '../views/ProjectDetailsPublicView.vue'
import ApplyProjectView from '../views/ApplyProjectView.vue'
import MyApplicationsView from '../views/MyApplicationsView.vue'
import NotificationsView from '../views/NotificationsView.vue'

// Client Views
import ClientRegisterView from '../views/client/ClientRegisterView.vue'
import ClientLoginView from '../views/client/ClientLoginView.vue'
import ClientDashboardView from '../views/client/ClientDashboardView.vue'
import PostProjectView from '../views/client/PostProjectView.vue'
import ManageProjectsView from '../views/client/ManageProjectsView.vue'
import ProjectDetailsView from '../views/client/ProjectDetailsView.vue'
import ProjectApplicantsView from '../views/client/ProjectApplicantsView.vue'

// Phase 04 Admin Views
import AdminLoginView from '../views/admin/AdminLoginView.vue'
import AdminDashboardView from '../views/admin/AdminDashboardView.vue'
import AdminStudentsView from '../views/admin/AdminStudentsView.vue'
import AdminClientsView from '../views/admin/AdminClientsView.vue'
import AdminProjectsView from '../views/admin/AdminProjectsView.vue'
import AdminApplicationsView from '../views/admin/AdminApplicationsView.vue'

const routes = [
  // Public & Student Routes
  {
    path: '/',
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
    component: ApplyProjectView
  },
  {
    path: '/my-applications',
    name: 'MyApplications',
    component: MyApplicationsView
  },
  {
    path: '/notifications',
    name: 'Notifications',
    component: NotificationsView
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
    component: ProfileSetupView
  },
  {
    path: '/profile',
    name: 'StudentProfile',
    component: StudentProfileView
  },

  // Client Portal Routes
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
    component: ClientDashboardView
  },
  {
    path: '/client/projects/new',
    name: 'PostProject',
    component: PostProjectView
  },
  {
    path: '/client/projects/:id/edit',
    name: 'EditProject',
    component: PostProjectView
  },
  {
    path: '/client/projects',
    name: 'ManageProjects',
    component: ManageProjectsView
  },
  {
    path: '/client/projects/:id',
    name: 'ProjectDetails',
    component: ProjectDetailsView
  },
  {
    path: '/client/projects/:id/applicants',
    name: 'ProjectApplicants',
    component: ProjectApplicantsView
  },

  // Phase 04 Admin Routes
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: AdminLoginView
  },
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: AdminDashboardView,
    meta: { requiresAdmin: true }
  },
  {
    path: '/admin/students',
    name: 'AdminStudents',
    component: AdminStudentsView,
    meta: { requiresAdmin: true }
  },
  {
    path: '/admin/clients',
    name: 'AdminClients',
    component: AdminClientsView,
    meta: { requiresAdmin: true }
  },
  {
    path: '/admin/projects',
    name: 'AdminProjects',
    component: AdminProjectsView,
    meta: { requiresAdmin: true }
  },
  {
    path: '/admin/applications',
    name: 'AdminApplications',
    component: AdminApplicationsView,
    meta: { requiresAdmin: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Route Guards: Protect Admin Routes
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAdmin) {
    const isUserAdmin = authState.isAuthenticated && authState.currentUser?.role === 'admin'
    if (!isUserAdmin) {
      next('/admin/login')
      return
    }
  }
  next()
})

export default router
