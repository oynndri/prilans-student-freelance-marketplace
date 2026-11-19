import { createRouter, createWebHistory } from 'vue-router'
import FindProjects from '../views/FindProjects.vue'
import RegisterView from '../views/RegisterView.vue'
import LoginView from '../views/LoginView.vue'
import ProfileSetupView from '../views/ProfileSetupView.vue'
import StudentProfileView from '../views/StudentProfileView.vue'

const routes = [
  {
    path: '/',
    name: 'FindProjects',
    component: FindProjects
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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
