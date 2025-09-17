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
import UserManagement from '../views/UserManagement.vue'
import OTPLogin from '../views/OTPLogin.vue'
import Reports from '../views/Reports.vue'
import AuditLogs from '../views/AuditLogs.vue'
import { ROLES, hasPermission } from '../constants/roles'

// Extend RouteMeta interface
declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    permissions?: string[]
    roles?: string[]
  }
}

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false }
  },
  {
    path: '/otp-login',
    name: 'OTPLogin',
    component: OTPLogin,
    meta: { requiresAuth: false }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword,
    meta: { requiresAuth: false }
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: ResetPassword,
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/schools',
    name: 'SchoolList',
    component: SchoolList,
    meta: { 
      requiresAuth: true,
      permissions: ['schools.read']
    }
  },
  {
    path: '/schools/new',
    name: 'SchoolNew',
    component: SchoolForm,
    meta: { 
      requiresAuth: true,
      permissions: ['schools.create']
    }
  },
  {
    path: '/schools/:id/edit',
    name: 'SchoolEdit',
    component: SchoolForm,
    props: true,
    meta: { 
      requiresAuth: true,
      permissions: ['schools.update']
    }
  },
  {
    path: '/teachers',
    name: 'TeacherList',
    component: TeacherList,
    meta: { 
      requiresAuth: true,
      permissions: ['teachers.read']
    }
  },
  {
    path: '/teachers/new',
    name: 'TeacherNew',
    component: TeacherForm,
    meta: { 
      requiresAuth: true,
      permissions: ['teachers.create']
    }
  },
  {
    path: '/teachers/:id/edit',
    name: 'TeacherEdit',
    component: TeacherForm,
    props: true,
    meta: { 
      requiresAuth: true,
      permissions: ['teachers.update']
    }
  },
  {
    path: '/medical-records',
    name: 'MedicalRecords',
    component: MedicalRecords,
    meta: { 
      requiresAuth: true,
      permissions: ['medical_records.read']
    }
  },
  {
    path: '/teachers/:id/medical-records',
    name: 'TeacherMedicalRecords',
    component: MedicalRecords,
    props: true,
    meta: { 
      requiresAuth: true,
      permissions: ['medical_records.read']
    }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
    meta: { 
      requiresAuth: true,
      permissions: ['settings.read']
    }
  },
  {
    path: '/user-management',
    name: 'UserManagement',
    component: UserManagement,
    meta: { 
      requiresAuth: true,
      roles: [ROLES.SUPER_ADMIN]
    }
  },
  {
    path: '/reports',
    name: 'Reports',
    component: Reports,
    meta: {
      requiresAuth: true,
      permissions: ['reports.read']
    }
  },
  {
    path: '/audit-logs',
    name: 'AuditLogs',
    component: AuditLogs,
    meta: {
      requiresAuth: true,
      roles: ['super_admin']
    }
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
  const currentUser = auth.currentUser
  
  // Allow access to public pages
  if (to.meta.requiresAuth === false) {
    if (isAuthenticated && (to.path === '/login' || to.path === '/otp-login')) {
      // If already logged in, redirect to dashboard
      next('/')
    } else {
      next()
    }
    return
  }
  
  // Check authentication for protected routes
  if (!isAuthenticated) {
    next('/login')
    return
  }
  
  // Check role-based access
  if (to.meta.roles && currentUser) {
    const userRole = currentUser.role
    const requiredRoles = to.meta.roles as string[]
    
    if (!requiredRoles.includes(userRole)) {
      // User doesn't have required role, redirect to dashboard with error
      next({ 
        path: '/', 
        query: { error: 'insufficient_permissions' }
      })
      return
    }
  }
  
  // Check permission-based access
  if (to.meta.permissions && currentUser) {
    const userRole = currentUser.role
    const requiredPermissions = to.meta.permissions
    
    const hasRequiredPermissions = requiredPermissions.every(permission => 
      hasPermission(userRole, permission)
    )
    
    if (!hasRequiredPermissions) {
      // User doesn't have required permissions, redirect to dashboard with error
      next({ 
        path: '/', 
        query: { error: 'insufficient_permissions' }
      })
      return
    }
  }
  
  // All checks passed, allow access
  next()
})

export default router
