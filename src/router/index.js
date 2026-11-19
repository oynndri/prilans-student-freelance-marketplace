import { createRouter, createWebHistory } from 'vue-router'
import FindProjects from '../views/FindProjects.vue'
import RegisterView from '../views/RegisterView.vue'
import LoginView from '../views/LoginView.vue'
import ProfileSetupView from '../views/ProfileSetupView.vue'
import StudentProfileView from '../views/StudentProfileView.vue'

// Phase 03 Public & Student Views
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

const routes = [
  // Student & Public Marketplace Routes
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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
