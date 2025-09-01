<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-2xl font-semibold text-gray-900">Teachers</h1>
        <p class="mt-2 text-sm text-gray-700">
          Manage all teacher records in the system
        </p>
      </div>
             <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none flex space-x-3">
         <button
           @click="exportToExcel"
           :disabled="loading || teachers.length === 0"
           class="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
         >
           Export to Excel
         </button>
         <router-link
           to="/teachers/new"
           class="btn-primary"
         >
           Add Teacher
         </router-link>
       </div>
    </div>

    <!-- Search and Filters -->
    <div class="mt-8 flex flex-col sm:flex-row gap-4">
      <div class="flex-1">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search teachers by name, school, or district..."
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

    <!-- Teachers Table -->
    <div class="mt-8 card">
      <div class="card-body p-0">
        <div v-if="loading" class="text-center py-12">
          <div class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-primary-500 hover:bg-primary-400 transition ease-in-out duration-150 cursor-not-allowed">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading...
          </div>
        </div>

        <div v-else-if="teachers.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No teachers</h3>
          <p class="mt-1 text-sm text-gray-500">Get started by creating a new teacher.</p>
          <div class="mt-6">
            <router-link to="/teachers/new" class="btn-primary">
              Add Teacher
            </router-link>
          </div>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                  Teacher Details
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                  School Information
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                  Subjects & Classes
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                  Posting History
                </th>
                <th class="w-48 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deputation History
                </th>
                <th class="w-48 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attachment History
                </th>
                <th class="w-40 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="teacher in teachers" :key="teacher.id" class="hover:bg-gray-50">
                <td class="px-4 py-4 w-48">
                                     <div>
                                                                 <!-- Teacher Name -->
                     <div class="text-sm font-medium text-gray-900">
                       {{ teacher.teacher_name }}
                     </div>
                     <div class="text-sm text-gray-500">DOB: {{ formatDate(teacher.date_of_birth) }}</div>
                     <div class="text-sm text-gray-500">Joined: {{ formatDate(teacher.joining_date) }}</div>
                   </div>
                </td>
                <td class="px-4 py-4 w-48">
                  <div>
                    <div class="text-sm text-gray-900">{{ teacher.current_school_name }}</div>
                    <div class="text-sm text-gray-500">ID: {{ teacher.school_id }}</div>
                    <div class="text-sm text-gray-500">{{ teacher.management }}</div>
                  </div>
                </td>
                <td class="px-4 py-4 w-48">
                  <div>
                    <div class="text-sm text-gray-900">{{ parseSubjectsTaught(teacher.subjects_taught).join(', ') }}</div>
                    <div class="text-sm text-gray-500">{{ parseClassesTaught(teacher.classes_taught).join(', ') }}</div>
                  </div>
                </td>
                <td class="px-4 py-4 w-48">
                  <div v-if="teacher.posting_history && teacher.posting_history.length > 0">
                    <div class="text-sm text-gray-900 font-medium cursor-pointer hover:text-primary-600" 
                         @click="togglePostingHistory(teacher.id!)"
                         :title="`Click to view ${teacher.posting_history.length} posting${teacher.posting_history.length > 1 ? 's' : ''}`">
                      {{ teacher.posting_history.length }} Previous Posting{{ teacher.posting_history.length > 1 ? 's' : '' }}
                      <svg class="inline w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ teacher.posting_history[0].school_name }}
                      <span v-if="teacher.posting_history.length > 1" class="text-xs text-gray-400">
                        +{{ teacher.posting_history.length - 1 }} more
                      </span>
                    </div>
                    <div class="text-xs text-gray-400">
                      {{ formatDate(teacher.posting_history[0].from_date) }} - {{ teacher.posting_history[0].to_date ? formatDate(teacher.posting_history[0].to_date) : 'Current' }}
                      <span v-if="!teacher.posting_history[0].to_date" class="ml-1 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Ongoing
                      </span>
                      <span v-if="teacher.posting_history[0].status" class="ml-1 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium" 
                            :class="teacher.posting_history[0].status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'">
                        {{ teacher.posting_history[0].status }}
                      </span>
                    </div>
                    
                    <!-- Expanded Posting History Details -->
                    <div v-if="expandedPostingHistory === teacher.id" class="mt-3 p-3 bg-gray-50 rounded-lg border">
                      <div class="text-xs font-medium text-gray-700 mb-2">Full Posting History:</div>
                      <div v-for="(posting, index) in teacher.posting_history" :key="index" class="mb-2 pb-2 border-b border-gray-200 last:border-b-0">
                        <div class="text-xs font-medium text-gray-600">{{ index + 1 }}. {{ posting.school_name }}</div>
                        <div class="text-xs text-gray-500">
                          {{ posting.medium }} • {{ posting.management }} • {{ posting.district }}
                        </div>
                        <div class="text-xs text-gray-400">
                          {{ formatDate(posting.from_date) }} - {{ posting.to_date ? formatDate(posting.to_date) : 'Current' }}
                          <span v-if="!posting.to_date" class="ml-1 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Ongoing
                          </span>
                          <span v-if="posting.status" class="ml-1 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium" 
                                :class="posting.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'">
                            {{ posting.status }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else class="text-sm text-gray-400 italic">
                    No previous postings
                  </div>
                </td>
                <td class="px-4 py-4 w-48">
                  <div v-if="teacher.deputation && teacher.deputation.length > 0">
                    <div class="text-sm text-gray-900 font-medium cursor-pointer hover:text-primary-600" 
                         @click="toggleDeputationHistory(teacher.id!)"
                         :title="`Click to view ${teacher.deputation.length} deputation${teacher.deputation.length > 1 ? 's' : ''}`">
                      {{ teacher.deputation.length }} Deputation{{ teacher.deputation.length > 1 ? 's' : '' }}
                      <svg class="inline w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ teacher.deputation[0].department_name }}
                      <span v-if="teacher.deputation.length > 1" class="text-xs text-gray-400">
                        +{{ teacher.deputation.length - 1 }} more
                      </span>
                    </div>
                    <div class="text-xs text-gray-400">
                      {{ formatDate(teacher.deputation[0].joining_date) }} - {{ teacher.deputation[0].end_date ? formatDate(teacher.deputation[0].end_date) : 'Current' }}
                      <span v-if="!teacher.deputation[0].end_date" class="ml-1 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Ongoing
                      </span>
                      <span v-if="teacher.deputation[0].status" class="ml-1 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium" 
                            :class="teacher.deputation[0].status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'">
                        {{ teacher.deputation[0].status }}
                      </span>
                    </div>
                    
                    <!-- Expanded Deputation History Details -->
                    <div v-if="expandedDeputationHistory === teacher.id" class="mt-3 p-3 bg-gray-50 rounded-lg border">
                      <div class="text-xs font-medium text-gray-700 mb-2">Full Deputation History:</div>
                      <div v-for="(deputation, index) in teacher.deputation" :key="index" class="mb-2 pb-2 border-b border-gray-200 last:border-b-0">
                        <div class="text-xs font-medium text-gray-600">{{ index + 1 }}. {{ deputation.department_name }}</div>
                        <div class="text-xs text-gray-500">
                          {{ deputation.designation }}
                        </div>
                        <div class="text-xs text-gray-400">
                          {{ formatDate(deputation.joining_date) }} - {{ deputation.end_date ? formatDate(deputation.end_date) : 'Current' }}
                          <span v-if="!deputation.end_date" class="ml-1 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Ongoing
                          </span>
                          <span v-if="deputation.status" class="ml-1 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium" 
                                :class="deputation.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'">
                            {{ deputation.status }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else class="text-sm text-gray-400 italic">
                    No deputation
                  </div>
                </td>
                <td class="px-4 py-4 w-48">
                  <div v-if="teacher.attachment && teacher.attachment.length > 0">
                    <div class="text-sm text-gray-900 font-medium cursor-pointer hover:text-primary-600" 
                         @click="toggleAttachmentHistory(teacher.id!)"
                         :title="`Click to view ${teacher.attachment.length} attachment${teacher.attachment.length > 1 ? 's' : ''}`">
                      {{ teacher.attachment.length }} Attachment{{ teacher.attachment.length > 1 ? 's' : '' }}
                      <svg class="inline w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ teacher.attachment[0].department_name }}
                      <span v-if="teacher.attachment.length > 1" class="text-xs text-gray-400">
                        +{{ teacher.attachment.length - 1 }} more
                      </span>
                    </div>
                    <div class="text-xs text-gray-400">
                      {{ formatDate(teacher.attachment[0].joining_date) }} - {{ teacher.attachment[0].end_date ? formatDate(teacher.attachment[0].end_date) : 'Current' }}
                      <span v-if="!teacher.attachment[0].end_date" class="ml-1 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Ongoing
                      </span>
                      <span v-if="teacher.attachment[0].status" class="ml-1 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium" 
                            :class="teacher.attachment[0].status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'">
                        {{ teacher.attachment[0].status }}
                      </span>
                    </div>
                    
                    <!-- Expanded Attachment History Details -->
                    <div v-if="expandedAttachmentHistory === teacher.id" class="mt-3 p-3 bg-gray-50 rounded-lg border">
                      <div class="text-xs font-medium text-gray-700 mb-2">Full Attachment History:</div>
                      <div v-for="(attachment, index) in teacher.attachment" :key="index" class="mb-2 pb-2 border-b border-gray-200 last:border-b-0">
                        <div class="text-xs font-medium text-gray-600">{{ index + 1 }}. {{ attachment.department_name }}</div>
                        <div class="text-xs text-gray-500">
                          {{ attachment.designation }}
                        </div>
                        <div class="text-xs text-gray-400">
                          {{ formatDate(attachment.joining_date) }} - {{ attachment.end_date ? formatDate(attachment.end_date) : 'Current' }}
                          <span v-if="!attachment.end_date" class="ml-1 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Ongoing
                          </span>
                          <span v-if="attachment.status" class="ml-1 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium" 
                                :class="attachment.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'">
                            {{ attachment.status }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else class="text-sm text-gray-400 italic">
                    No attachment
                  </div>
                </td>
                <td class="px-4 py-4 w-40">
                  <div>
                    <div class="text-sm text-gray-900">{{ teacher.district || 'N/A' }}</div>
                    <div class="text-sm text-gray-500">{{ teacher.habitation || 'N/A' }}</div>
                    <div class="text-sm text-gray-500">{{ teacher.habitation_class || 'N/A' }}</div>
                  </div>
                </td>
                <td class="px-4 py-4 w-32 text-sm font-medium">
                  <div class="flex space-x-2">
                    <router-link
                      :to="`/teachers/${teacher.id}/edit`"
                      class="text-primary-600 hover:text-primary-900"
                    >
                      Edit
                    </router-link>
                    <button
                      @click="deleteTeacher(teacher.id!)"
                      class="text-danger-600 hover:text-danger-900"
                    >
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
import { teachersApi } from '../services/api'
import type { Teacher, TeacherListResponse } from '../types'
import * as XLSX from 'xlsx'

const teachers = ref<Teacher[]>([])
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

const expandedPostingHistory = ref<number | null>(null)
const expandedDeputationHistory = ref<number | null>(null)
const expandedAttachmentHistory = ref<number | null>(null)

const togglePostingHistory = (teacherId: number) => {
  expandedPostingHistory.value = expandedPostingHistory.value === teacherId ? null : teacherId
}

const toggleDeputationHistory = (teacherId: number) => {
  expandedDeputationHistory.value = expandedDeputationHistory.value === teacherId ? null : teacherId
}

const toggleAttachmentHistory = (teacherId: number) => {
  expandedAttachmentHistory.value = expandedAttachmentHistory.value === teacherId ? null : teacherId
}

const loadTeachers = async (page = 1) => {
  loading.value = true
  try {
    const response = await teachersApi.getAll(page, pagination.value.limit)
    console.log('=== TEACHER LIST DEBUG ===')
    console.log('API Response:', response)
    console.log('Response data:', response.data)
    console.log('Teachers array:', response.data.data)
    
    if (response.data.success) {
      // The API returns a simple array of teachers, not a paginated response
      teachers.value = response.data.data || []
      
      // Debug individual teacher data
      if (teachers.value.length > 0) {
        console.log('First teacher data:', teachers.value[0])
        console.log('First teacher posting_history:', teachers.value[0].posting_history)
        console.log('First teacher deputation:', teachers.value[0].deputation)
        console.log('First teacher attachment:', teachers.value[0].attachment)
      }
      
      // Set pagination to simple values since we're not using pagination yet
      pagination.value = {
        page: 1,
        limit: teachers.value.length,
        total: teachers.value.length,
        totalPages: 1
      }
    }
  } catch (error) {
    console.error('Failed to load teachers:', error)
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
        const response = await teachersApi.search(searchQuery.value.trim())
        if (response.data.success) {
          teachers.value = response.data.data || []
          pagination.value = {
            page: 1,
            limit: 10,
            total: teachers.value.length,
            totalPages: 1
          }
        }
      } catch (error) {
        console.error('Search failed:', error)
      }
    } else {
      loadTeachers(1)
    }
  }, 300)
}

const changePage = (page: number) => {
  if (page >= 1 && page <= pagination.value.totalPages) {
    pagination.value.page = page
    loadTeachers(page)
  }
}

const deleteTeacher = async (teacherId: number) => {
  if (!confirm('Are you sure you want to delete this teacher? This action cannot be undone.')) {
    return
  }
  
  try {
    const response = await teachersApi.delete(teacherId)
    if (response.data.success) {
      await loadTeachers(pagination.value.page)
    }
  } catch (error) {
    console.error('Failed to delete teacher:', error)
  }
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString()
}

// Helper functions to parse subjects and classes from database
// These can be either JSON arrays or comma-separated strings
const parseSubjectsTaught = (subjectsString: string): string[] => {
  try {
    if (!subjectsString) return []
    
    // Try to parse as JSON first
    if (subjectsString.startsWith('[') && subjectsString.endsWith(']')) {
      return JSON.parse(subjectsString)
    }
    
    // If not JSON, split by comma and trim
    return subjectsString.split(',').map(s => s.trim()).filter(s => s.length > 0)
  } catch (error) {
    console.error('Error parsing subjects_taught:', error)
    // Fallback: split by comma
    return subjectsString.split(',').map(s => s.trim()).filter(s => s.length > 0)
  }
}

const parseClassesTaught = (classesString: string): string[] => {
  try {
    if (!classesString) return []
    
    // Try to parse as JSON first
    if (classesString.startsWith('[') && classesString.endsWith(']')) {
      return JSON.parse(classesString)
    }
    
    // If not JSON, split by comma and trim
    return classesString.split(',').map(s => s.trim()).filter(s => s.length > 0)
  } catch (error) {
    console.error('Error parsing classes_taught:', error)
    // Fallback: split by comma
    return classesString.split(',').map(s => s.trim()).filter(s => s.length > 0)
  }
}

const exportToExcel = () => {
  try {
    // Prepare data for export
    const exportData = teachers.value.map(teacher => ({
      // ===== BASIC TEACHER INFORMATION =====
      'Teacher Name': teacher.teacher_name || '',
      'Date of Birth': formatDate(teacher.date_of_birth) || '',
      'Joining Date': formatDate(teacher.joining_date) || '',
      'Gender': teacher.gender || '',
      'Social Group': teacher.social_group || '',
      'Religion': teacher.religion || '',
      'Aadhaar Number': teacher.aadhaar_number || '',
      
      // ===== CONTACT INFORMATION =====
      'Phone Number': teacher.phone_number || '',
      'Email': teacher.email || '',
      
      // ===== ACADEMIC QUALIFICATIONS =====
      'Subjects Taught': parseSubjectsTaught(teacher.subjects_taught).join(', '),
      'Classes Taught': parseClassesTaught(teacher.classes_taught).join(', '),
      
      // ===== CURRENT SCHOOL ASSIGNMENT =====
      'School ID': teacher.school_id || '',
      'Current School Name': teacher.current_school_name || '',
      'School Level': teacher.school_level || '',
      'Management Type': teacher.management || '',
      'Medium of Institution': teacher.medium || '',
      
      // ===== LOCATION INFORMATION =====
      'District': teacher.district || '',
      'RD Block': teacher.rd_block || '',
      'Habitation': teacher.habitation || '',
      'Pincode': teacher.pincode || '',
      'Habitation Class': teacher.habitation_class || '',
      'Habitation Category': teacher.habitation_category || '',
      'Block Office': teacher.block_office || '',
      'School Phone': teacher.school_phone || '',
      
      // ===== HISTORY SUMMARY =====
      'Total Posting Records': teacher.posting_history ? teacher.posting_history.length : 0,
      'Total Deputation Records': teacher.deputation ? teacher.deputation.length : 0,
      'Total Attachment Records': teacher.attachment ? teacher.attachment.length : 0,
      
      // ===== LATEST POSTING DETAILS =====
      'Latest Posting School': teacher.posting_history && teacher.posting_history.length > 0 ? teacher.posting_history[0].school_name : '',
      'Latest Posting Type': teacher.posting_history && teacher.posting_history.length > 0 ? teacher.posting_history[0].school_type : '',
      'Latest Posting Medium': teacher.posting_history && teacher.posting_history.length > 0 ? teacher.posting_history[0].medium : '',
      'Latest Posting Management': teacher.posting_history && teacher.posting_history.length > 0 ? teacher.posting_history[0].management : '',
      'Latest Posting District': teacher.posting_history && teacher.posting_history.length > 0 ? teacher.posting_history[0].district : '',
      'Latest Posting Block Office': teacher.posting_history && teacher.posting_history.length > 0 ? teacher.posting_history[0].block_office : '',
      'Latest Posting Start Date': teacher.posting_history && teacher.posting_history.length > 0 ? formatDate(teacher.posting_history[0].from_date) : '',
      'Latest Posting End Date': teacher.posting_history && teacher.posting_history.length > 0 && teacher.posting_history[0].to_date ? formatDate(teacher.posting_history[0].to_date) : '',
      'Latest Posting Status': teacher.posting_history && teacher.posting_history.length > 0 ? teacher.posting_history[0].status : '',
      
      // ===== LATEST DEPUTATION DETAILS =====
      'Latest Deputation Department': teacher.deputation && teacher.deputation.length > 0 ? teacher.deputation[0].department_name : '',
      'Latest Deputation Designation': teacher.deputation && teacher.deputation.length > 0 ? teacher.deputation[0].designation : '',
      'Latest Deputation Start Date': teacher.deputation && teacher.deputation.length > 0 ? formatDate(teacher.deputation[0].joining_date) : '',
      'Latest Deputation End Date': teacher.deputation && teacher.deputation.length > 0 && teacher.deputation[0].end_date ? formatDate(teacher.deputation[0].end_date) : '',
      'Latest Deputation Status': teacher.deputation && teacher.deputation.length > 0 ? teacher.deputation[0].status : '',
      
      // ===== LATEST ATTACHMENT DETAILS =====
      'Latest Attachment Department': teacher.attachment && teacher.attachment.length > 0 ? teacher.attachment[0].department_name : '',
      'Latest Attachment Designation': teacher.attachment && teacher.attachment.length > 0 ? teacher.attachment[0].designation : '',
              'Latest Attachment District': teacher.attachment && teacher.attachment.length > 0 ? teacher.attachment[0].district : '',
        'Latest Attachment RD Block': teacher.attachment && teacher.attachment.length > 0 ? teacher.attachment[0].rd_block : '',
        'Latest Attachment Habitation': teacher.attachment && teacher.attachment.length > 0 ? teacher.attachment[0].habitation : '',
        'Latest Attachment Start Date': teacher.attachment && teacher.attachment.length > 0 ? formatDate(teacher.attachment[0].joining_date) : '',
      'Latest Attachment End Date': teacher.attachment && teacher.attachment.length > 0 && teacher.attachment[0].end_date ? formatDate(teacher.attachment[0].end_date) : '',
      'Latest Attachment Status': teacher.attachment && teacher.attachment.length > 0 ? teacher.attachment[0].status : '',
      
      // ===== SYSTEM INFORMATION =====
      'Record Created Date': teacher.created_at ? formatDate(teacher.created_at) : '',
      'Record Last Updated': teacher.updated_at ? formatDate(teacher.updated_at) : ''
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
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Teachers Report')

    // Generate filename with current date
    const currentDate = new Date().toISOString().split('T')[0]
    const filename = `teachers_report_${currentDate}.xlsx`

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
  loadTeachers()
})
</script>
