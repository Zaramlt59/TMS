<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-100">Schools</h1>
        <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">
          Manage all school records in the system
        </p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none flex space-x-3">
        <button
          @click="exportToExcel"
          class="btn-secondary"
        >
          Export to Excel
        </button>
        <router-link
          to="/schools/new"
          class="btn-primary"
        >
          Add School
        </router-link>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="mt-8 flex flex-col sm:flex-row gap-4">
      <div class="flex-1">
        <div class="relative">
          <input
            id="school-search"
            name="school-search"
            v-model="searchQuery"
            type="text"
            placeholder="Search schools by name, ID, or district..."
            class="form-input pl-10"
            @input="handleSearch"
          />
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Schools Table - Desktop View -->
    <div class="mt-8 card hidden md:block">
      <div class="card-body p-0">
        <div v-if="loading" class="text-center py-12 bg-gray-50 dark:bg-gray-800/50">
          <div class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow-lg rounded-lg text-white bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 hover:from-blue-600 hover:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 transition-all duration-200 cursor-not-allowed">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading...
          </div>
        </div>

        <div v-else-if="schools.length === 0" class="text-center py-12 bg-gray-50 dark:bg-gray-800/50">
          <svg class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No schools</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new school.</p>
          <div class="mt-6">
            <router-link to="/schools/new" class="btn-primary">
              Add School
            </router-link>
          </div>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
            <thead class="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-800 dark:text-gray-100 uppercase tracking-wider">
                  School Details
                </th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-800 dark:text-gray-100 uppercase tracking-wider">
                  Location
                </th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-800 dark:text-gray-100 uppercase tracking-wider">
                  Type & Level
                </th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-800 dark:text-gray-100 uppercase tracking-wider">
                  Management
                </th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-800 dark:text-gray-100 uppercase tracking-wider">
                  Block Office
                </th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-800 dark:text-gray-100 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-600">
              <tr v-for="school in schools" :key="school.school_id" class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 group">
                <td class="px-6 py-4">
                  <div class="space-y-1">
                    <div class="text-sm font-semibold text-gray-900 dark:text-gray-100">{{ school.school_name }}</div>
                    <div class="flex items-center space-x-2">
                      <span class="text-xs text-gray-600 dark:text-gray-400">
                        ID: {{ school.school_id }}
                      </span>
                      <span class="text-xs text-gray-600 dark:text-gray-400">
                        {{ school.medium }} Medium
                      </span>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="space-y-1">
                    <div class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ school.district || 'N/A' }}</div>
                    <div class="text-sm text-gray-600 dark:text-gray-300">{{ school.habitation || 'N/A' }}</div>
                    <div class="text-xs text-gray-600 dark:text-gray-400">
                      {{ school.habitation_class || 'N/A' }}
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="space-y-1">
                    <div class="text-sm text-gray-900 dark:text-gray-100">
                      {{ formatDisplayText(school.school_type) }}
                    </div>
                    <div class="text-sm text-gray-600 dark:text-gray-300">
                      {{ school.school_level }}
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div>
                    <div class="text-sm text-gray-900 dark:text-gray-100">
                      {{ formatDisplayText(school.management) }}
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div>
                    <div class="text-sm text-gray-900 dark:text-gray-100">
                      {{ formatDisplayText(school.block_office) }}
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 text-sm font-medium">
                  <div class="flex items-center space-x-2">
                    <router-link
                      :to="`/schools/${school.school_id}/edit`"
                      class="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-700 dark:text-blue-200 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:shadow-sm dark:hover:shadow-md rounded-md transition-all duration-200 border border-blue-200 dark:border-blue-700"
                    >
                      <svg class="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                      Edit
                    </router-link>
                    <button
                      @click="deleteSchool(school.school_id)"
                      class="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-700 dark:text-red-200 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 hover:shadow-sm dark:hover:shadow-md rounded-md transition-all duration-200 border border-red-200 dark:border-red-700"
                    >
                      <svg class="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Schools Cards - Mobile View -->
    <div class="mt-8 md:hidden">
      <div v-if="loading" class="text-center py-12 bg-gray-50 dark:bg-gray-800/50">
        <div class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow-lg rounded-lg text-white bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 hover:from-blue-600 hover:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 transition-all duration-200 cursor-not-allowed">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </div>
      </div>

      <div v-else-if="schools.length === 0" class="text-center py-12 bg-gray-50 dark:bg-gray-800/50">
        <svg class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No schools</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new school.</p>
        <div class="mt-6">
          <router-link to="/schools/new" class="btn-primary">
            Add School
          </router-link>
        </div>
      </div>

      <div v-else class="space-y-4">
        <div 
          v-for="school in schools" 
          :key="school.school_id" 
          class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-md dark:hover:shadow-xl dark:shadow-gray-900/20 transition-all duration-200 group"
        >
          <div class="p-4">
            <!-- School Header -->
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1 min-w-0">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-gray-700 dark:group-hover:text-gray-50">{{ school.school_name }}</h3>
                <div class="flex items-center space-x-2 mt-1">
                  <span class="text-xs text-gray-600 dark:text-gray-400">
                    ID: {{ school.school_id }}
                  </span>
                  <span class="text-xs text-gray-600 dark:text-gray-400">
                    {{ school.medium }} Medium
                  </span>
                </div>
              </div>
            </div>

            <!-- School Details -->
            <div class="space-y-4">
              <div class="grid grid-cols-1 gap-4">
                <div>
                  <dt class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Location</dt>
                  <dd class="space-y-2">
                    <div class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ school.district || 'N/A' }}</div>
                    <div class="text-sm text-gray-600 dark:text-gray-300">{{ school.habitation || 'N/A' }}</div>
                    <div class="text-xs text-gray-600 dark:text-gray-400">
                      {{ school.habitation_class || 'N/A' }}
                    </div>
                  </dd>
                </div>
                
                <div>
                  <dt class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Type & Level</dt>
                  <dd class="space-y-1">
                    <div class="text-sm text-gray-900 dark:text-gray-100">
                      {{ formatDisplayText(school.school_type) }}
                    </div>
                    <div class="text-sm text-gray-600 dark:text-gray-300">{{ school.school_level }}</div>
                  </dd>
                </div>
                
                <div>
                  <dt class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Management</dt>
                  <dd>
                    <div class="text-sm text-gray-900 dark:text-gray-100">
                      {{ formatDisplayText(school.management) }}
                    </div>
                  </dd>
                </div>
                
                <div>
                  <dt class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Block Office</dt>
                  <dd>
                    <div class="text-sm text-gray-900 dark:text-gray-100">
                      {{ formatDisplayText(school.block_office) }}
                    </div>
                  </dd>
                </div>
              </div>
            </div>
            
            <!-- Actions -->
            <div class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div class="flex space-x-3">
                <router-link
                  :to="`/schools/${school.school_id}/edit`"
                  class="flex-1 inline-flex justify-center items-center px-3 py-2 text-sm font-medium rounded-md text-blue-700 dark:text-blue-200 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:shadow-sm dark:hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 border border-blue-200 dark:border-blue-700"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                  Edit
                </router-link>
                <button
                  @click="deleteSchool(school.school_id)"
                  class="flex-1 inline-flex justify-center items-center px-3 py-2 text-sm font-medium rounded-md text-red-700 dark:text-red-200 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 hover:shadow-sm dark:hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 border border-red-200 dark:border-red-700"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="pagination.totalPages > 1" class="mt-8 flex items-center justify-between">
      <div class="flex-1 flex justify-between sm:hidden">
        <button
          @click="changePage(pagination.page - 1)"
          :disabled="pagination.page === 1"
          class="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          @click="changePage(pagination.page + 1)"
          :disabled="pagination.page === pagination.totalPages"
          class="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
      <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700">
            Showing
            <span class="font-medium">{{ (pagination.page - 1) * pagination.limit + 1 }}</span>
            to
            <span class="font-medium">{{ Math.min(pagination.page * pagination.limit, pagination.total) }}</span>
            of
            <span class="font-medium">{{ pagination.total }}</span>
            results
          </p>
        </div>
        <div>
          <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            <button
              @click="changePage(pagination.page - 1)"
              :disabled="pagination.page === 1"
              class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="changePage(page)"
              :class="[
                page === pagination.page
                  ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                'relative inline-flex items-center px-4 py-2 border text-sm font-medium'
              ]"
            >
              {{ page }}
            </button>
            <button
              @click="changePage(pagination.page + 1)"
              :disabled="pagination.page === pagination.totalPages"
              class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { schoolsApi } from '../services/api'
import type { School, SchoolListResponse } from '../types'
import * as XLSX from 'xlsx'

// Helper function to format underscores to spaces
const formatDisplayText = (text: string): string => {
  if (!text) return ''
  return text.replace(/_/g, ' ')
}

const schools = ref<School[]>([])
const loading = ref(false)
const searchQuery = ref('')
const searchTimeout = ref<NodeJS.Timeout>()

const pagination = ref({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0
})

const visiblePages = computed(() => {
  const pages: number[] = []
  const start = Math.max(1, pagination.value.page - 2)
  const end = Math.min(pagination.value.totalPages, pagination.value.page + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

const loadSchools = async (page = 1) => {
  loading.value = true
  try {
    const response = await schoolsApi.getAll(page, pagination.value.limit)
    if (response.data.success) {
      schools.value = response.data.data || []
      if (response.data.pagination) {
        pagination.value = response.data.pagination
      }
    }
  } catch (error) {
    console.error('Failed to load schools:', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  
  searchTimeout.value = setTimeout(async () => {
    if (searchQuery.value.trim()) {
      try {
        const response = await schoolsApi.search(searchQuery.value.trim())
        if (response.data.success) {
          schools.value = response.data.data || []
          pagination.value = {
            page: 1,
            limit: 10,
            total: schools.value.length,
            totalPages: 1
          }
        }
      } catch (error) {
        console.error('Search failed:', error)
      }
    } else {
      loadSchools(1)
    }
  }, 300)
}

const changePage = (page: number) => {
  if (page >= 1 && page <= pagination.value.totalPages) {
    pagination.value.page = page
    loadSchools(page)
  }
}



const deleteSchool = async (schoolId: string) => {
  if (!confirm('Are you sure you want to delete this school? This action cannot be undone.')) {
    return
  }
  
  try {
    const response = await schoolsApi.deleteBySchoolId(schoolId)
    if (response.data.success) {
      await loadSchools(pagination.value.page)
    }
  } catch (error) {
    console.error('Failed to delete school:', error)
  }
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString()
}

const exportToExcel = () => {
  try {
    // Prepare data for export - Organized in logical groups
    const exportData = schools.value.map(school => ({
      // ===== BASIC SCHOOL INFORMATION =====
      'School ID': school.school_id || '',
      'School Name': school.school_name || '',
      'School Type': formatDisplayText(school.school_type || ''),
      
      // ===== ACADEMIC INFORMATION =====
      'School Level': school.school_level || '',
      'Medium of Institution': school.medium || '',
      'Management Type': formatDisplayText(school.management || ''),
      
      // ===== LOCATION INFORMATION =====
      'District': school.district || '',
      'RD Block': school.rd_block || '',
      'Habitation': school.habitation || '',
      'Pincode': school.pincode || '',
      'Habitation Class': school.habitation_class || '',
      'Habitation Category': school.habitation_category || '',
      'Block Office': formatDisplayText(school.block_office || ''),
      
      // ===== CONTACT INFORMATION =====
      'School Phone': school.school_phone || '',
      'School Email': school.school_email || '',
      
      // ===== SYSTEM INFORMATION =====
      'Record Created Date': school.created_at ? formatDate(school.created_at) : '',
      'Record Last Updated': school.updated_at ? formatDate(school.updated_at) : ''
    }))

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.json_to_sheet(exportData)

    // Auto-size columns
    const columnWidths = Object.keys(exportData[0] || {}).map(key => ({
      wch: Math.max(key.length, 15)
    }))
    worksheet['!cols'] = columnWidths

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Schools Report')

    // Generate filename with current date
    const currentDate = new Date().toISOString().split('T')[0]
    const filename = `schools_report_${currentDate}.xlsx`

    // Save the file
    XLSX.writeFile(workbook, filename)

    // Show success message
    alert(`Excel file "${filename}" has been downloaded successfully!`)
  } catch (error) {
    console.error('Error exporting to Excel:', error)
    alert('Failed to export Excel file. Please try again.')
  }
}

onMounted(() => {
  loadSchools()
})
</script>
