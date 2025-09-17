<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-100">{{ dashboardTitle }}</h1>
        <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">
          {{ dashboardDescription }}
        </p>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Welcome back, <span class="font-medium text-primary-600 dark:text-blue-400">{{ currentUser?.username }}</span>! 👋
          <span v-if="currentRole" class="ml-2 px-2 py-1 text-xs font-medium bg-primary-100 dark:bg-primary-900/20 text-primary-800 dark:text-primary-200 rounded-full">
            {{ currentRole.replace('_', ' ').toUpperCase() }}
          </span>
        </p>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <!-- Show different stats based on role -->
      <div v-if="canManageSchools || isTeacher" class="card">
        <div class="card-body">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-primary-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-primary-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Schools
              </p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-gray-100">{{ stats.schools }}</p>
            </div>
          </div>
        </div>
      </div>

      <div v-if="canManageTeachers || isTeacher" class="card">
        <div class="card-body">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-success-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-success-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Teachers
              </p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-gray-100">{{ stats.teachers }}</p>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!isTeacher" class="card">
        <div class="card-body">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-warning-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-warning-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Districts</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-gray-100">{{ stats.districts }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Districts count for teachers -->
      <div v-if="isTeacher" class="card">
        <div class="card-body">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-warning-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-warning-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Districts</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-gray-100">{{ stats.districts }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="mt-8" v-if="quickActions.length > 0">
      <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Quick Actions</h2>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <router-link
          v-for="action in quickActions"
          :key="action.to"
          :to="action.to"
          class="card hover:shadow-md transition-shadow duration-200 cursor-pointer"
        >
          <div class="card-body text-center">
            <div :class="`w-12 h-12 bg-${action.color}-100 dark:bg-${action.color}-900/20 rounded-lg flex items-center justify-center mx-auto mb-3`">
              <svg :class="`w-6 h-6 text-${action.color}-600 dark:text-${action.color}-400`" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="action.icon"></path>
              </svg>
            </div>
            <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ action.title }}</h3>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ action.description }}</p>
          </div>
        </router-link>
      </div>
    </div>


    <!-- Recent Activity -->
    <div class="mt-8">
      <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Recent Activity</h2>
      <div class="card">
        <div class="card-body">
          <div v-if="recentSchools.length === 0 && recentTeachers.length === 0" class="text-center py-8">
            <p class="text-gray-500 dark:text-gray-400">No recent activity</p>
          </div>
          <div v-else class="space-y-4">
            <div v-for="school in recentSchools.slice(0, 3)" :key="school.id" class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-primary-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                <svg class="w-4 h-4 text-primary-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  New school added: {{ school.school_name }}
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ school.created_at ? formatDate(school.created_at) : '' }}</p>
              </div>
            </div>
            <div v-for="teacher in recentTeachers.slice(0, 3)" :key="teacher.id" class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-success-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <svg class="w-4 h-4 text-success-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  New teacher added: {{ teacher.teacher_name }}
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ teacher.created_at ? formatDate(teacher.created_at) : '' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { schoolsApi, teachersApi } from '../services/api'
import type { School, Teacher } from '../types'
import { authService } from '../services/auth'
import { useRoleGuard } from '../composables/useRoleGuard'
import { ROLES } from '../constants/roles'

const currentUser = ref(authService.getCurrentUser())
const { 
  currentRole, 
  isSuperAdmin, 
  isAdmin, 
  isDEO, 
  isSDEO, 
  isHOI, 
  isTeacher,
  canManageSchools,
  canManageTeachers,
  canManageUsers,
  canViewReports,
  canExportData
} = useRoleGuard()

const stats = ref({
  schools: 0,
  teachers: 0,
  districts: 0
})

const recentSchools = ref<School[]>([])
const recentTeachers = ref<Teacher[]>([])

// Role-specific dashboard content
const dashboardTitle = computed(() => {
  switch (currentRole.value) {
    case ROLES.SUPER_ADMIN:
      return 'Super Administrator Dashboard'
    case ROLES.ADMIN:
      return 'Administrator Dashboard'
    case ROLES.DEO:
      return 'District Education Officer Dashboard'
    case ROLES.SDEO:
      return 'Sub-Division Education Officer Dashboard'
    case ROLES.HOI:
      return 'Head of Institution Dashboard'
    case ROLES.TEACHER:
      return 'Teacher Dashboard'
    default:
      return 'Dashboard'
  }
})

const dashboardDescription = computed(() => {
  switch (currentRole.value) {
    case ROLES.SUPER_ADMIN:
      return 'Complete system overview and management controls'
    case ROLES.ADMIN:
      return 'School and teacher management overview'
    case ROLES.DEO:
      return 'District-level school and teacher oversight'
    case ROLES.SDEO:
      return 'Sub-division level educational data management'
    case ROLES.HOI:
      return 'School-level teacher and student management'
    case ROLES.TEACHER:
      return 'Your personal teaching profile and school information'
    default:
      return 'Overview of the School & Teacher Data Entry System'
  }
})

// Role-specific quick actions
const quickActions = computed(() => {
  const actions: Array<{
    to: string;
    icon: string;
    title: string;
    description: string;
    color: string;
  }> = []
  
  if (canManageSchools) {
    actions.push({
      to: '/schools/new',
      icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6',
      title: 'Add New School',
      description: 'Create a new school record',
      color: 'primary'
    })
  }
  
  if (canManageTeachers) {
    actions.push({
      to: '/teachers/new',
      icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6',
      title: 'Add New Teacher',
      description: 'Create a new teacher record',
      color: 'success'
    })
  }
  
  if (isSuperAdmin && currentRole.value === ROLES.SUPER_ADMIN) {
    actions.push({
      to: '/user-management',
      icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z',
      title: 'Manage Users',
      description: 'User accounts and role management',
      color: 'warning'
    })
  }
  
  if (canViewReports) {
    actions.push({
      to: '/reports',
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      title: 'View Reports',
      description: 'Analytics and data reports',
      color: 'info'
    })
  }
  
  // Always show view actions
  if (canManageSchools || isTeacher) {
    actions.push({
      to: '/schools',
      icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
      title: 'View Schools',
      description: 'Browse all school records',
      color: 'warning'
    })
  }
  
  if (canManageTeachers || isTeacher) {
    actions.push({
      to: '/teachers',
      icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z',
      title: 'View Teachers',
      description: 'Browse all teacher records',
      color: 'danger'
    })
  }
  
  return actions
})

const loadStats = async () => {
  try {
    const [schoolsResponse, teachersResponse] = await Promise.all([
      schoolsApi.getStats(),
      teachersApi.getStats()
    ])

    if (schoolsResponse.data.success) {
      stats.value.schools = schoolsResponse.data.data?.totalSchools || 0
      stats.value.districts = schoolsResponse.data.data?.uniqueDistricts || 0
    }
    if (teachersResponse.data.success) {
      stats.value.teachers = teachersResponse.data.data?.total || 0
    }
  } catch (error) {
    console.error('Failed to load stats:', error)
  }
}

const loadRecentActivity = async () => {
  try {
    const [schoolsResponse, teachersResponse] = await Promise.all([
      schoolsApi.getAll(1, 5),
      teachersApi.getAll(1, 5)
    ])

    if (schoolsResponse.data.success) {
      // The API returns a simple array, slice it to get recent items
      recentSchools.value = (schoolsResponse.data.data || []).slice(0, 5)
    }
    if (teachersResponse.data.success) {
      // The API returns a simple array, slice it to get recent items
      recentTeachers.value = (teachersResponse.data.data || []).slice(0, 5)
    }
  } catch (error) {
    console.error('Failed to load recent activity:', error)
  }
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString()
}

onMounted(() => {
  loadStats()
  loadRecentActivity()
})
</script>
