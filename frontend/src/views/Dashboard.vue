<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p class="mt-2 text-sm text-gray-700">
          Overview of the School & Teacher Data Entry System
        </p>
        <p class="mt-1 text-sm text-gray-600">
          Welcome back, <span class="font-medium text-primary-600">{{ currentUser?.username }}</span>! 👋
        </p>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <div class="card">
        <div class="card-body">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Total Schools</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.schools }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-success-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Total Teachers</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.teachers }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-warning-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Districts</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.districts }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="mt-8">
      <h2 class="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <router-link
          to="/schools/new"
          class="card hover:shadow-md transition-shadow duration-200 cursor-pointer"
        >
          <div class="card-body text-center">
            <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
            </div>
            <h3 class="text-sm font-medium text-gray-900">Add New School</h3>
            <p class="text-xs text-gray-500 mt-1">Create a new school record</p>
          </div>
        </router-link>

        <router-link
          to="/teachers/new"
          class="card hover:shadow-md transition-shadow duration-200 cursor-pointer"
        >
          <div class="card-body text-center">
            <div class="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg class="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
            </div>
            <h3 class="text-sm font-medium text-gray-900">Add New Teacher</h3>
            <p class="text-xs text-gray-500 mt-1">Create a new teacher record</p>
          </div>
        </router-link>

        <router-link
          to="/settings"
          class="card hover:shadow-md transition-shadow duration-200 cursor-pointer"
        >
          <div class="card-body text-center">
            <div class="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg class="w-6 h-6 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>
            <h3 class="text-sm font-medium text-gray-900">Settings</h3>
            <p class="text-xs text-gray-500 mt-1">Manage master data</p>
          </div>
        </router-link>

        <router-link
          to="/schools"
          class="card hover:shadow-md transition-shadow duration-200 cursor-pointer"
        >
          <div class="card-body text-center">
            <div class="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg class="w-6 h-6 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
            </div>
            <h3 class="text-sm font-medium text-gray-900">View Schools</h3>
            <p class="text-xs text-gray-500 mt-1">Browse all school records</p>
          </div>
        </router-link>

        <router-link
          to="/teachers"
          class="card hover:shadow-md transition-shadow duration-200 cursor-pointer"
        >
          <div class="card-body text-center">
            <div class="w-12 h-12 bg-danger-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg class="w-6 h-6 text-danger-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
              </svg>
            </div>
            <h3 class="text-sm font-medium text-gray-900">View Teachers</h3>
            <p class="text-xs text-gray-500 mt-1">Browse all teacher records</p>
          </div>
        </router-link>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="mt-8">
      <h2 class="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
      <div class="card">
        <div class="card-body">
          <div v-if="recentSchools.length === 0 && recentTeachers.length === 0" class="text-center py-8">
            <p class="text-gray-500">No recent activity</p>
          </div>
          <div v-else class="space-y-4">
            <div v-for="school in recentSchools.slice(0, 3)" :key="school.id" class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <svg class="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">
                  New school added: {{ school.school_name }}
                </p>
                <p class="text-sm text-gray-500">{{ school.created_at ? formatDate(school.created_at) : '' }}</p>
              </div>
            </div>
            <div v-for="teacher in recentTeachers.slice(0, 3)" :key="teacher.id" class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-success-100 rounded-full flex items-center justify-center">
                <svg class="w-4 h-4 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">
                  New teacher added: {{ teacher.teacher_name }}
                </p>
                <p class="text-sm text-gray-500">{{ teacher.created_at ? formatDate(teacher.created_at) : '' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { schoolsApi, teachersApi } from '../services/api'
import type { School, Teacher } from '../types'
import { authService } from '../services/auth'

const currentUser = ref(authService.getCurrentUser())

const stats = ref({
  schools: 0,
  teachers: 0,
  districts: 0
})

const recentSchools = ref<School[]>([])
const recentTeachers = ref<Teacher[]>([])

const loadStats = async () => {
  try {
    const [schoolsResponse, teachersResponse, statsResponse] = await Promise.all([
      schoolsApi.getAll(1, 1),
      teachersApi.getAll(1, 1),
      schoolsApi.getStats()
    ])

    if (schoolsResponse.data.success) {
      stats.value.schools = schoolsResponse.data.data?.pagination?.total || 0
    }
    if (teachersResponse.data.success) {
      stats.value.teachers = teachersResponse.data.data?.pagination?.total || 0
    }
    if (statsResponse.data.success) {
      stats.value.districts = statsResponse.data.data?.uniqueDistricts || 0
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
      recentSchools.value = schoolsResponse.data.data?.schools || []
    }
    if (teachersResponse.data.success) {
      recentTeachers.value = teachersResponse.data.data?.teachers || []
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
