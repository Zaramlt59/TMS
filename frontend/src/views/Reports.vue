<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ reportTitle }}
            </h1>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {{ reportDescription }}
            </p>
          </div>
          <div class="flex space-x-3">
            <button
              @click="exportData('excel')"
              :disabled="loading"
              class="btn-secondary flex items-center"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Export Excel
            </button>
            <button
              @click="exportData('csv')"
              :disabled="loading"
              class="btn-secondary flex items-center"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Export CSV
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
        <div class="flex">
          <svg class="w-5 h-5 text-red-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800 dark:text-red-200">Error loading reports</h3>
            <p class="mt-1 text-sm text-red-700 dark:text-red-300">{{ error }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Reports Content -->
    <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Teacher Reports -->
      <div v-if="isTeacher" class="space-y-6">
        <TeacherReports :data="reportData" />
      </div>

      <!-- HOI Reports -->
      <div v-else-if="isHOI" class="space-y-6">
        <HOIReports :data="reportData" />
      </div>

      <!-- SDEO Reports -->
      <div v-else-if="isSDEO" class="space-y-6">
        <SDEOReports :data="reportData" />
      </div>

      <!-- DEO Reports -->
      <div v-else-if="isDEO" class="space-y-6">
        <DEOReports :data="reportData" />
      </div>

      <!-- Admin Reports -->
      <div v-else-if="isAdmin || isSuperAdmin" class="space-y-6">
        <AdminReports :data="reportData" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoleGuard } from '../composables/useRoleGuard'
import TeacherReports from '../components/reports/TeacherReports.vue'
import HOIReports from '../components/reports/HOIReports.vue'
import SDEOReports from '../components/reports/SDEOReports.vue'
import DEOReports from '../components/reports/DEOReports.vue'
import AdminReports from '../components/reports/AdminReports.vue'

const {
  isTeacher,
  isHOI,
  isSDEO,
  isDEO,
  isAdmin,
  isSuperAdmin,
  currentRole
} = useRoleGuard()

const loading = ref(true)
const error = ref('')
const reportData = ref(null)

// Computed properties for dynamic content
const reportTitle = computed(() => {
  switch (currentRole.value) {
    case 'teacher': return 'My School Reports'
    case 'hoi': return 'School Management Reports'
    case 'sdeo': return 'Sub-Division Reports'
    case 'deo': return 'District Reports'
    case 'admin': return 'System Reports'
    case 'super_admin': return 'System Reports'
    default: return 'Reports'
  }
})

const reportDescription = computed(() => {
  switch (currentRole.value) {
    case 'teacher': return 'View your school\'s data and statistics'
    case 'hoi': return 'Manage and analyze your school\'s performance'
    case 'sdeo': return 'Monitor sub-division educational metrics'
    case 'deo': return 'Track district-wide educational performance'
    case 'admin': return 'Comprehensive system-wide analytics'
    case 'super_admin': return 'Complete system overview and analytics'
    default: return 'View role-specific reports and analytics'
  }
})

// Load dashboard statistics
const loadReports = async () => {
  try {
    loading.value = true
    error.value = ''
    
    const response = await fetch('/api/reports/dashboard-stats', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    })
    
    const data = await response.json()
    
    if (data.success) {
      reportData.value = data.data
    } else {
      error.value = data.message || 'Failed to load reports'
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to load reports'
  } finally {
    loading.value = false
  }
}

// Export data
const exportData = async (format: 'excel' | 'csv') => {
  try {
    const response = await fetch(`/api/reports/export?format=${format}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (response.ok) {
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `reports_${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : 'csv'}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } else {
      const errorData = await response.json()
      error.value = errorData.message || 'Export failed'
    }
  } catch (err: any) {
    error.value = err.message || 'Export failed'
  }
}

onMounted(() => {
  loadReports()
})
</script>
