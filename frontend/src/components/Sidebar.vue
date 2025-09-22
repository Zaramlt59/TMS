<template>
  <div class="flex flex-col h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 w-64">
    <!-- Logo Section -->
    <div class="flex items-center justify-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
      <img src="/src/assests/TMS logo 1.svg" alt="TMS Logo" class="h-8 w-auto" />
    </div>

    <!-- Navigation Links -->
    <nav class="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
      <!-- Dashboard -->
      <router-link
        to="/"
        class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200"
        :class="[
          $route.path === '/' 
            ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300' 
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
        ]"
      >
        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"></path>
        </svg>
        Dashboard
      </router-link>

      <!-- Schools -->
      <router-link
        v-if="canManageSchools || isTeacher"
        to="/schools"
        class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200"
        :class="[
          $route.path.startsWith('/schools') 
            ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300' 
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
        ]"
      >
        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
        </svg>
        Schools
      </router-link>

      <!-- Teachers -->
      <router-link
        v-if="canManageTeachers || isTeacher"
        to="/teachers"
        class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200"
        :class="[
          $route.path.startsWith('/teachers') 
            ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300' 
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
        ]"
      >
        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
        </svg>
        Teachers
      </router-link>

      <!-- Medical Records -->
      <router-link
        v-if="canManageMedicalRecords"
        to="/medical-records"
        class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200"
        :class="[
          $route.path.startsWith('/medical-records') 
            ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300' 
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
        ]"
      >
        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        Medical Records
      </router-link>

      <!-- Reports -->
      <router-link
        v-if="canViewReports"
        to="/reports"
        class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200"
        :class="[
          $route.path.startsWith('/reports') 
            ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300' 
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
        ]"
      >
        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
        </svg>
        Reports
      </router-link>

      <!-- User Management -->
      <router-link
        v-if="isSuperAdmin"
        to="/user-management"
        class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200"
        :class="[
          $route.path.startsWith('/user-management') 
            ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300' 
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
        ]"
      >
        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
        </svg>
        User Management
      </router-link>

      <!-- Audit Logs -->
      <router-link
        v-if="isSuperAdmin"
        to="/audit-logs"
        class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200"
        :class="[
          $route.path.startsWith('/audit-logs') 
            ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300' 
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
        ]"
      >
        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
        </svg>
        Audit Logs
      </router-link>

      <!-- Settings -->
      <router-link
        v-if="showSettings"
        to="/settings"
        class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200"
        :class="[
          $route.path === '/settings' 
            ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300' 
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
        ]"
      >
        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
        </svg>
        Settings
      </router-link>
    </nav>

    <!-- User Info and Logout -->
    <div class="px-4 py-16 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div class="flex items-center mb-4">
        <div class="flex-shrink-0">
          <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-sm">
            <span class="text-sm font-semibold text-white">{{ currentUser?.username?.charAt(0).toUpperCase() }}</span>
          </div>
        </div>
        <div class="ml-3 flex-1 min-w-0">
          <p class="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{{ currentUser?.username }}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400 capitalize mt-1">{{ currentUser?.role?.replace('_', ' ') }}</p>
        </div>
      </div>
      <button
        @click="handleLogout"
        class="w-full flex items-center justify-center px-4 py-3 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 group"
      >
        <svg class="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
        </svg>
        Logout
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useRoleGuard } from '../composables/useRoleGuard'

const router = useRouter()
const auth = useAuthStore()
const currentUser = computed(() => auth.currentUser)

// Role guard
const { 
  showSettings,
  canManageSchools,
  canManageTeachers,
  canManageMedicalRecords,
  canViewReports,
  isTeacher
} = useRoleGuard()

// Super admin check
const isSuperAdmin = computed(() => {
  return currentUser.value?.role === 'super_admin'
})

const handleLogout = async () => {
  await auth.logout()
  router.push('/login')
}
</script>
