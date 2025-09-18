<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-100">Medical Records</h1>
        <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">
          <span v-if="teacherName">Teacher: <span class="font-medium">{{ teacherName }}</span> ({{ teacherDisplayId }})</span>
          <span v-else-if="!showAllRecords">Teacher ID: {{ teacherDisplayId }}</span>
          <span v-else>All Medical Records</span>
        </p>
      </div>
      <div v-if="isAdmin" class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <button 
          @click="openCreate()" 
          :disabled="showAllRecords && teachers.length === 0"
          :class="showAllRecords && teachers.length === 0 ? 'btn-primary opacity-50 cursor-not-allowed' : 'btn-primary'"
        >
          Add Record
        </button>
      </div>
    </div>

    <!-- Search Bar -->
    <div class="mt-6">
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        <input
          v-model="searchQuery"
          type="text"
          class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 dark:focus:placeholder-gray-500 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          placeholder="Search by teacher name, ailment, severity, remarks, or diagnosis date..."
        />
        <div v-if="searchQuery" class="absolute inset-y-0 right-0 pr-3 flex items-center">
          <button
            @click="clearSearch"
            type="button"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div class="mt-6 card">
      <div class="card-body">
        <div v-if="loading" class="text-sm text-gray-500 dark:text-gray-400">Loading...</div>
        <div v-else-if="filteredRecords.length === 0 && searchQuery" class="text-sm text-gray-500 dark:text-gray-400">No records found matching your search.</div>
        <div v-else-if="filteredRecords.length === 0" class="text-sm text-gray-500 dark:text-gray-400">No records found.</div>
        <div v-else>
          <!-- Search Results Info -->
          <div v-if="searchQuery" class="mb-4 text-sm text-gray-600 dark:text-gray-400">
            Showing {{ filteredRecords.length }} of {{ records.length }} records
            <button @click="clearSearch" class="ml-2 text-primary-600 dark:text-blue-400 hover:text-primary-800 dark:hover:text-blue-300 underline">
              Clear search
            </button>
          </div>

          <!-- Pagination Info -->
          <div v-if="shouldShowPagination" class="mb-4 text-sm text-gray-600 dark:text-gray-400">
            Showing {{ ((pagination.page - 1) * pagination.limit) + 1 }} to {{ Math.min(pagination.page * pagination.limit, pagination.totalCount) }} of {{ pagination.totalCount }} records
          </div>
          <!-- Desktop Table View -->
          <div class="hidden md:block overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
              <thead class="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th v-if="showAllRecords" class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Teacher</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ailment</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Severity</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Diagnosis Date</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Treatment Status</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Remarks</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Documents</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created</th>
                  <th v-if="isAdmin" class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-32">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-600">
                <tr v-for="rec in filteredRecords" :key="rec.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200">
                  <td v-if="showAllRecords" class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                    <div class="font-medium">{{ rec.teachers?.teacher_name || 'Unknown Teacher' }}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">Teacher ID: {{ rec.teachers?.teacher_ID || 'Not assigned' }}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">School ID: {{ rec.teachers?.school_id || 'Not assigned' }}</div>
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{{ rec.ailment_name }}</td>
                  <td class="px-4 py-3 text-sm">
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                          :class="severityClass(rec.severity)">{{ rec.severity }}</span>
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{{ rec.diagnosis_date ? formatDate(rec.diagnosis_date) : '-' }}</td>
                  <td class="px-4 py-3 text-sm">
                    <span v-if="rec.treatment_status" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                          :class="treatmentStatusClass(rec.treatment_status)">{{ rec.treatment_status }}</span>
                    <span v-else class="text-gray-500 dark:text-gray-400">-</span>
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{{ rec.remarks || '-' }}</td>
                  <td class="px-4 py-3 text-sm">
                    <a v-if="rec.documents" :href="fileUrl(rec.documents)" target="_blank" rel="noopener" class="text-sm text-primary-600 dark:text-blue-400 hover:text-primary-900 dark:hover:text-blue-300">View</a>
                    <span v-else class="text-gray-500 dark:text-gray-400">-</span>
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{{ formatDate(rec.created_at) }}</td>
                  <td v-if="isAdmin" class="px-4 py-3 text-sm">
                    <div class="flex items-center space-x-2">
                      <button @click="openEdit(rec)" class="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-700 dark:text-blue-200 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:shadow-sm dark:hover:shadow-md rounded-md transition-all duration-200 border border-blue-200 dark:border-blue-700">
                        <svg class="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                        Edit
                      </button>
                      <button @click="remove(rec.id)" class="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-700 dark:text-red-200 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 hover:shadow-sm dark:hover:shadow-md rounded-md transition-all duration-200 border border-red-200 dark:border-red-700">
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

          <!-- Mobile Card View -->
          <div class="md:hidden space-y-4">
          <div 
            v-for="rec in filteredRecords" 
            :key="rec.id" 
            class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-md dark:hover:shadow-xl dark:shadow-gray-900/20 transition-all duration-200 p-4"
          >
            <div class="flex items-start justify-between mb-3">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ rec.ailment_name }}</h3>
              <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                    :class="severityClass(rec.severity)">{{ rec.severity }}</span>
            </div>
            
            <div v-if="showAllRecords" class="mb-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
              <div class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ rec.teachers?.teacher_name || 'Unknown Teacher' }}</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">Teacher ID: {{ rec.teachers?.teacher_ID || 'Not assigned' }}</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">School ID: {{ rec.teachers?.school_id || 'Not assigned' }}</div>
            </div>
            
            <div class="space-y-2">
              <div>
                <dt class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Diagnosis Date</dt>
                <dd class="text-sm text-gray-700 dark:text-gray-300">{{ rec.diagnosis_date ? formatDate(rec.diagnosis_date) : 'Not specified' }}</dd>
              </div>
              
              <div v-if="rec.treatment_status">
                <dt class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Treatment Status</dt>
                <dd class="text-sm">
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                        :class="treatmentStatusClass(rec.treatment_status)">{{ rec.treatment_status }}</span>
                </dd>
              </div>
              
              <div v-if="rec.remarks">
                <dt class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Remarks</dt>
                <dd class="text-sm text-gray-700 dark:text-gray-300">{{ rec.remarks }}</dd>
              </div>
              
              <div>
                <dt class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Documents</dt>
                <dd class="text-sm">
                  <a v-if="rec.documents" :href="fileUrl(rec.documents)" target="_blank" rel="noopener" class="text-primary-600 dark:text-blue-400 hover:text-primary-900 dark:hover:text-blue-300">View Document</a>
                  <span v-else class="text-gray-500 dark:text-gray-400">No documents</span>
                </dd>
              </div>
              
              <div>
                <dt class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created</dt>
                <dd class="text-sm text-gray-500 dark:text-gray-400">{{ formatDate(rec.created_at) }}</dd>
              </div>
            </div>
            
            <div v-if="isAdmin" class="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
              <div class="flex space-x-3">
                <button @click="openEdit(rec)" class="flex-1 inline-flex justify-center items-center px-3 py-2 text-sm font-medium rounded-md text-blue-700 dark:text-blue-200 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 border border-blue-200 dark:border-blue-700">
                  Edit
                </button>
                <button @click="remove(rec.id)" class="flex-1 inline-flex justify-center items-center px-3 py-2 text-sm font-medium rounded-md text-red-700 dark:text-red-200 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 border border-red-200 dark:border-red-700">
                  Delete
                </button>
              </div>
            </div>
          </div>

          <!-- Pagination Controls -->
          <div v-if="shouldShowPagination" class="mt-6 flex items-center justify-between">
            <div class="flex items-center">
              <label class="text-sm text-gray-700 dark:text-gray-300 mr-2">Records per page:</label>
              <select v-model="pageSize" @change="changePageSize" class="form-select w-20">
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
            </div>
            
            <div class="flex items-center space-x-2">
              <button
                @click="goToPage(1)"
                :disabled="!pagination.hasPrevPage"
                class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                First
              </button>
              <button
                @click="goToPage(pagination.page - 1)"
                :disabled="!pagination.hasPrevPage"
                class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Previous
              </button>
              
              <span class="px-3 py-1 text-sm text-gray-700 dark:text-gray-300">
                Page {{ pagination.page }} of {{ pagination.totalPages }}
              </span>
              
              <button
                @click="goToPage(pagination.page + 1)"
                :disabled="!pagination.hasNextPage"
                class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Next
              </button>
              <button
                @click="goToPage(pagination.totalPages)"
                :disabled="!pagination.hasNextPage"
                class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Last
              </button>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-80" @click="closeModal"></div>
        <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl dark:shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">{{ editing ? 'Edit Record' : 'Add Record' }}</h3>
            <div class="mt-4 space-y-3">
              <div v-if="showAllRecords">
                <label class="form-label">Teacher</label>
                <div v-if="!editing">
                  <div v-if="teachers.length === 0" class="mb-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-md">
                    <p class="text-sm text-blue-800 dark:text-blue-200">
                      <svg class="inline w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      All teachers already have medical records. No new records can be added at this time.
                    </p>
                  </div>
                  <div class="relative">
                    <input
                      v-model="teacherSearchQuery"
                      @focus="showTeacherDropdown = true"
                      @blur="hideTeacherDropdown"
                      @input="filterTeachers"
                      type="text"
                      class="form-input pr-10"
                      :class="{ 'opacity-50 cursor-not-allowed': teachers.length === 0 }"
                      :disabled="teachers.length === 0"
                      placeholder="Search teachers without medical records..."
                      required
                    />
                    <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                      </svg>
                    </div>
                    
                    <!-- Dropdown -->
                    <div v-if="showTeacherDropdown && filteredTeachers.length > 0" 
                         class="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
                      <div v-for="teacher in filteredTeachers" 
                           :key="teacher.id"
                           @mousedown="selectTeacher(teacher)"
                           class="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-200 dark:border-gray-600 last:border-b-0">
                        <div class="font-medium text-gray-900 dark:text-gray-100">{{ teacher.teacher_name }}</div>
                        <div class="text-sm text-gray-500 dark:text-gray-400">Teacher ID: {{ teacher.teacher_ID || 'Not assigned' }} | School: {{ teacher.school_id }}</div>
                      </div>
                    </div>
                    
                    <!-- No results -->
                    <div v-if="showTeacherDropdown && filteredTeachers.length === 0 && teacherSearchQuery" 
                         class="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg">
                      <div class="px-4 py-2 text-gray-500 dark:text-gray-400">No teachers without medical records found</div>
                    </div>
                  </div>
                </div>
                <div v-else class="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                  <div class="font-medium text-gray-900 dark:text-gray-100">{{ form.teacherName }}</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">{{ form.teacherDisplayId }}</div>
                </div>
              </div>
              <div>
                <label class="form-label">Ailment Name</label>
                <input v-model="form.ailmentName" type="text" class="form-input" placeholder="e.g., Hypertension" />
              </div>
              <div>
                <label class="form-label">Severity</label>
                <select v-model="form.severity" class="form-select">
                  <option value="">Select severity</option>
                  <option v-for="s in severities" :key="s" :value="s">{{ s }}</option>
                </select>
              </div>
              <div>
                <label class="form-label">Diagnosis Date</label>
                <input v-model="form.diagnosisDate" type="date" class="form-input" />
              </div>
              <div>
                <label class="form-label">Treatment Status</label>
                <select v-model="form.treatmentStatus" class="form-select">
                  <option value="">Select status</option>
                  <option v-for="status in treatmentStatuses" :key="status" :value="status">{{ status }}</option>
                </select>
              </div>
              <div>
                <label class="form-label">Remarks</label>
                <textarea v-model="form.remarks" class="form-input" rows="3" placeholder="Notes"></textarea>
              </div>
              <div>
                <label class="form-label">Documents</label>
                <div class="flex items-center gap-3">
                  <input ref="fileInput" type="file" @change="onFileChange" class="hidden" />
                  <button type="button" class="btn-secondary" @click="() => (fileInput as any)?.click()">Upload</button>
                  <span class="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs" v-if="uploadName">{{ uploadName }}</span>
                  <a v-if="form.documents" :href="fileUrl(form.documents)" target="_blank" rel="noopener" class="text-sm text-primary-600 dark:text-blue-400 hover:text-primary-900 dark:hover:text-blue-300">View current</a>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button @click="save" class="btn-primary sm:ml-3">{{ editing ? 'Update' : 'Create' }}</button>
            <button @click="closeModal" class="btn-secondary mt-3 sm:mt-0 sm:ml-3">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { medicalRecordsApi, teachersApi, uploadApi, type MedicalRecord } from '../services/api'

const route = useRoute()
const auth = useAuthStore()

const isAdmin = computed(() => auth.currentUser?.role === 'admin' || auth.currentUser?.role === 'super_admin')
const severities = ['Mild','Moderate','Severe','Critical'] as const
const treatmentStatuses = ['Pending','Ongoing','Completed','Cancelled'] as const

const teacherId = ref<number>(Number(route.params.id) || 0)
const teacherName = ref<string>('')
const teacherDisplayId = ref<string>('')
const records = ref<MedicalRecord[]>([])
const loading = ref(false)
const teachers = ref<any[]>([])
const teacherSearchQuery = ref('')
const showTeacherDropdown = ref(false)
const filteredTeachers = ref<any[]>([])

// Search functionality for main medical records list
const searchQuery = ref('')

// Pagination
const currentPage = ref(1)
const pageSize = ref(10)
const pagination = ref<any>(null)

// Check if we should show all records (when accessed from main navigation)
const showAllRecords = computed(() => route.name === 'MedicalRecords' || !teacherId.value || teacherId.value === 0)

// Watch for route changes to properly handle navigation
watch(() => route, (newRoute) => {
  if (newRoute.name === 'MedicalRecords') {
    // When navigating to main medical records page, reset teacherId
    teacherId.value = 0
    teacherName.value = ''
  } else if (newRoute.name === 'TeacherMedicalRecords' && newRoute.params.id) {
    // When navigating to teacher-specific medical records, set teacherId
    teacherId.value = Number(newRoute.params.id)
  }
}, { immediate: true, deep: true })

// Watch for teacherId changes to reload records
watch(teacherId, (newTeacherId, oldTeacherId) => {
  if (newTeacherId !== oldTeacherId) {
    loadRecords()
  }
})

const showModal = ref(false)
const editing = ref(false)
const editingId = ref<number | null>(null)
const form = ref<{ teacherId?: number; teacherName?: string; teacherDisplayId?: string; ailmentName: string; severity: any; diagnosisDate: string; treatmentStatus: string; remarks?: string; documents?: string }>({ teacherId: undefined, teacherName: '', teacherDisplayId: '', ailmentName: '', severity: '', diagnosisDate: '', treatmentStatus: '', remarks: '', documents: '' })
const fileInput = ref<HTMLInputElement | null>(null)
const uploadName = ref('')

const severityClass = (sev: string) => {
  switch (sev) {
    case 'Mild': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
    case 'Moderate': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200'
    case 'Severe': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200'
    case 'Critical': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
    default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
  }
}

const treatmentStatusClass = (status: string) => {
  switch (status) {
    case 'Pending': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200'
    case 'Ongoing': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
    case 'Completed': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
    case 'Cancelled': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
    default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
  }
}

const formatDate = (d: string) => new Date(d).toLocaleDateString()

const fileUrl = (url?: string | null) => {
  if (!url) return '#'
  // If already absolute (starts with http/https), return as is
  if (/^https?:\/\//i.test(url)) return url
  // If already starts with /uploads/, just prepend the base URL
  if (url.startsWith('/uploads/')) return `http://localhost:5004${url}`
  // Otherwise, prepend the API base URL with /uploads/
  return `http://localhost:5004/uploads/${url}`
}

const loadRecords = async () => {
  loading.value = true
  try {
    let resp
    if (showAllRecords.value) {
      // Load all medical records with pagination
      resp = await medicalRecordsApi.getAll(currentPage.value, pageSize.value)
    } else {
      // Load records for specific teacher (no pagination for teacher-specific view)
      if (!teacherId.value) return
      resp = await medicalRecordsApi.getByTeacher(teacherId.value)
    }
    
    if (resp.data?.success) {
      records.value = resp.data.data || []
      if (resp.data.pagination) {
        pagination.value = resp.data.pagination
      }
    } else {
      console.error('Failed to load medical records:', resp.data?.message)
    }
  } catch (error) {
    console.error('Error loading medical records:', error)
  } finally {
    loading.value = false
  }
}

const loadTeacherName = async () => {
  try {
    if (!teacherId.value) return
    const resp = await teachersApi.getById(teacherId.value)
    if (resp.data?.success && (resp.data as any).data) {
      const teacherData = (resp.data as any).data
      teacherName.value = teacherData.teacher_name || ''
      teacherDisplayId.value = teacherData.teacher_ID || `ID: ${teacherId.value}`
    }
  } catch (error) {
    console.error('Error loading teacher name:', error)
  }
}

const loadTeachers = async () => {
  try {
    const resp = await medicalRecordsApi.getTeachersWithoutRecords()
    if (resp.data?.success) {
      teachers.value = resp.data.data || []
      filteredTeachers.value = teachers.value
    }
  } catch (error) {
    console.error('Error loading teachers without medical records:', error)
  }
}

const filterTeachers = () => {
  if (!teacherSearchQuery.value.trim()) {
    filteredTeachers.value = teachers.value
    return
  }
  
  const query = teacherSearchQuery.value.toLowerCase().trim()
  filteredTeachers.value = teachers.value.filter(teacher => 
    teacher.teacher_name.toLowerCase().includes(query) ||
    teacher.id.toString().includes(query) ||
    teacher.school_id.toLowerCase().includes(query)
  )
}

const selectTeacher = (teacher: any) => {
  form.value.teacherId = teacher.id
  teacherSearchQuery.value = `${teacher.teacher_name} (ID: ${teacher.id})`
  showTeacherDropdown.value = false
}

const hideTeacherDropdown = () => {
  // Delay hiding to allow for click events
  setTimeout(() => {
    showTeacherDropdown.value = false
  }, 200)
}

// Filtered records based on search query
const filteredRecords = computed(() => {
  if (!searchQuery.value.trim()) {
    return records.value
  }
  
  const query = searchQuery.value.toLowerCase().trim()
  return records.value.filter(rec => {
    // Search in teacher name
    const teacherNameMatch = rec.teachers?.teacher_name?.toLowerCase().includes(query) || false
    
    // Search in teacher ID
    const teacherIdMatch = rec.teachers?.id?.toString().includes(query) || false
    
    // Search in school ID
    const schoolIdMatch = rec.teachers?.school_id?.toLowerCase().includes(query) || false
    
    // Search in ailment name
    const ailmentMatch = rec.ailment_name.toLowerCase().includes(query)
    
    // Search in severity
    const severityMatch = rec.severity.toLowerCase().includes(query)
    
    // Search in remarks
    const remarksMatch = rec.remarks?.toLowerCase().includes(query) || false
    
    // Search in diagnosis date
    const diagnosisDateMatch = rec.diagnosis_date ? formatDate(rec.diagnosis_date).toLowerCase().includes(query) : false
    
    // Search in treatment status
    const treatmentStatusMatch = rec.treatment_status?.toLowerCase().includes(query) || false
    
    return teacherNameMatch || teacherIdMatch || schoolIdMatch || ailmentMatch || severityMatch || remarksMatch || diagnosisDateMatch || treatmentStatusMatch
  })
})

// Check if we should show pagination (only when not searching and showing all records)
const shouldShowPagination = computed(() => {
  return showAllRecords.value && pagination.value && !searchQuery.value.trim()
})

const clearSearch = () => {
  searchQuery.value = ''
}

// Pagination methods
const goToPage = (page: number) => {
  if (page >= 1 && page <= (pagination.value?.totalPages || 1)) {
    currentPage.value = page
    loadRecords()
  }
}

const changePageSize = () => {
  currentPage.value = 1 // Reset to first page when changing page size
  loadRecords()
}

const openCreate = () => {
  editing.value = false
  editingId.value = null
  teacherSearchQuery.value = ''
  form.value = { 
    teacherId: showAllRecords.value ? undefined : teacherId.value,
    teacherName: '',
    ailmentName: '', 
    severity: '', 
    diagnosisDate: '', 
    treatmentStatus: '', 
    remarks: '', 
    documents: '' 
  }
  showModal.value = true
}

const openEdit = (rec: MedicalRecord) => {
  editing.value = true
  editingId.value = rec.id
  
  form.value = { 
    teacherId: showAllRecords.value ? rec.teacher_id : teacherId.value,
    teacherName: rec.teachers?.teacher_name || '',
    teacherDisplayId: rec.teachers?.teacher_ID || 'Not assigned',
    ailmentName: rec.ailment_name, 
    severity: rec.severity as any, 
    diagnosisDate: rec.diagnosis_date ? new Date(rec.diagnosis_date).toISOString().split('T')[0] : '', 
    treatmentStatus: rec.treatment_status || '', 
    remarks: rec.remarks || '', 
    documents: rec.documents || '' 
  }
  teacherSearchQuery.value = ''
  showTeacherDropdown.value = false
  showModal.value = true
}

const closeModal = () => { 
  showModal.value = false
  teacherSearchQuery.value = ''
  showTeacherDropdown.value = false
}

const save = async () => {
  const currentTeacherId = showAllRecords.value ? form.value.teacherId : teacherId.value
  if (!currentTeacherId) { 
    if (showAllRecords.value && teachers.value.length === 0) {
      alert('No teachers available for medical records. All teachers already have medical records.')
    } else {
      alert('Teacher selection is required')
    }
    return 
  }
  if (!form.value.ailmentName || !form.value.severity) { alert('Ailment and severity are required'); return }
  
  try {
    // Format diagnosis date to ISO string if provided
    const diagnosisDate = form.value.diagnosisDate ? new Date(form.value.diagnosisDate).toISOString() : undefined
    
    if (editing.value && editingId.value) {
      const resp = await medicalRecordsApi.update(editingId.value, {
        ailmentName: form.value.ailmentName,
        severity: form.value.severity,
        diagnosisDate: diagnosisDate,
        treatmentStatus: form.value.treatmentStatus || undefined,
        remarks: form.value.remarks,
        documents: form.value.documents
      })
      if (resp.data?.success) { 
        showModal.value = false
        loadRecords() 
      } else {
        alert('Failed to update record: ' + (resp.data?.message || 'Unknown error'))
      }
    } else {
      const resp = await medicalRecordsApi.create({
        teacherId: currentTeacherId,
        ailmentName: form.value.ailmentName,
        severity: form.value.severity,
        diagnosisDate: diagnosisDate,
        treatmentStatus: form.value.treatmentStatus || undefined,
        remarks: form.value.remarks,
        documents: form.value.documents
      })
      if (resp.data?.success) { 
        showModal.value = false
        loadRecords()
        if (showAllRecords.value) {
          loadTeachers() // Reload teachers list to remove the teacher who just got a record
        }
      } else {
        alert('Failed to create record: ' + (resp.data?.message || 'Unknown error'))
      }
    }
  } catch (error) {
    console.error('Error saving medical record:', error)
    alert('An error occurred while saving the record. Please try again.')
  }
}

const onFileChange = async (e: Event) => {
  const t = e.target as HTMLInputElement
  const file = t.files && t.files[0]
  if (!file) return
  uploadName.value = file.name
  try {
    const resp = await uploadApi.uploadMedicalRecord(file)
    if (resp.data?.success && (resp.data as any).data?.url) {
      form.value.documents = (resp.data as any).data.url
    } else {
      alert('Upload failed')
    }
  } catch (err) {
    alert('Upload failed')
  } finally {
    if (fileInput.value) fileInput.value.value = ''
  }
}

const remove = async (id: number) => {
  if (!confirm('Delete this medical record?')) return
  const resp = await medicalRecordsApi.delete(id)
  if (resp.data?.success) loadRecords()
}

onMounted(() => {
  if (teacherId.value) {
    loadTeacherName()
  }
  if (showAllRecords.value) {
    loadTeachers()
  }
  loadRecords()
})
</script>


