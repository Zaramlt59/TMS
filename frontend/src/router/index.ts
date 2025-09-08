import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import SchoolList from '../views/SchoolList.vue'
import SchoolForm from '../views/SchoolForm.vue'
import TeacherList from '../views/TeacherList.vue'
import TeacherForm from '../views/TeacherForm.vue'
import Settings from '../views/Settings.vue'
import Login from '../views/Login.vue'
import { useAuthStore } from '../stores/auth'
import ForgotPassword from '../views/ForgotPassword.vue'
import ResetPassword from '../views/ResetPassword.vue'
import MedicalRecords from '../views/MedicalRecords.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/teachers/:id/medical-records',
    name: 'MedicalRecords',
    component: MedicalRecords,
    props: true
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: ResetPassword
  },
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/schools',
    name: 'SchoolList',
    component: SchoolList
  },
  {
    path: '/schools/new',
    name: 'SchoolNew',
    component: SchoolForm
  },
  {
    path: '/schools/:id/edit',
    name: 'SchoolEdit',
    component: SchoolForm,
    props: true
  },
  {
    path: '/teachers',
    name: 'TeacherList',
    component: TeacherList
  },
  {
    path: '/teachers/new',
    name: 'TeacherNew',
    component: TeacherForm
  },
  {
    path: '/teachers/:id/edit',
    name: 'TeacherEdit',
    component: TeacherForm,
    props: true
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard to protect routes
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  if (!auth.isAuthenticated) auth.initializeFromStorage()
  const isAuthenticated = auth.isLoggedIn
  
  // Allow access to login page
  if (to.path === '/login') {
    if (isAuthenticated) {
      // If already logged in, redirect to dashboard
      next('/')
    } else {
      next()
    }
  } else {
    // Check if user is authenticated for other routes
    if (isAuthenticated) {
      next()
    } else {
      // Redirect to login if not authenticated
      next('/login')
    }
  }
})

export default router
