<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-100">Medical Records</h1>
        <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">
          <span v-if="teacherName">Teacher: <span class="font-medium">{{ teacherName }}</span> (ID: {{ teacherId }})</span>
          <span v-else>Teacher ID: {{ teacherId }}</span>
        </p>
      </div>
      <div v-if="isAdmin" class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <button @click="openCreate()" class="btn-primary">Add Record</button>
      </div>
    </div>

    <div class="mt-6 card">
      <div class="card-body">
        <div v-if="loading" class="text-sm text-gray-500 dark:text-gray-400">Loading...</div>
        <div v-else-if="records.length === 0" class="text-sm text-gray-500 dark:text-gray-400">No records found.</div>
        <div v-else>
          <!-- Desktop Table View -->
          <div class="hidden md:block overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
              <thead class="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ailment</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Severity</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Remarks</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Documents</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created</th>
                  <th v-if="isAdmin" class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-32">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-600">
                <tr v-for="rec in records" :key="rec.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200">
                  <td class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{{ rec.ailment_name }}</td>
                  <td class="px-4 py-3 text-sm">
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                          :class="severityClass(rec.severity)">{{ rec.severity }}</span>
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{{ rec.remarks || '-' }}</td>
                  <td class="px-4 py-3 text-sm">
                    <a v-if="rec.documents" :href="fileUrl(rec.documents)" target="_blank" rel="noopener" class="text-sm text-primary-600 dark:text-blue-400 hover:text-primary-900 dark:hover:text-blue-300">View</a>
                    <span v-else class="text-gray-500 dark:text-gray-400">-</span>
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{{ formatDate(rec.created_at) }}</td>
                  <td v-if="isAdmin" class="px-4 py-3 text-sm">
                    <button @click="openEdit(rec)" class="text-primary-600 dark:text-blue-400 hover:text-primary-900 dark:hover:text-blue-300 mr-2">Edit</button>
                    <button @click="remove(rec.id)" class="text-danger-600 dark:text-red-400 hover:text-danger-900 dark:hover:text-red-300">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Mobile Card View -->
          <div class="md:hidden space-y-4">
          <div 
            v-for="rec in records" 
            :key="rec.id" 
            class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-md dark:hover:shadow-xl dark:shadow-gray-900/20 transition-all duration-200 p-4"
          >
            <div class="flex items-start justify-between mb-3">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ rec.ailment_name }}</h3>
              <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                    :class="severityClass(rec.severity)">{{ rec.severity }}</span>
            </div>
            
            <div class="space-y-2">
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
            <button @click="save" class="btn-primary sm:ml-3">Save</button>
            <button @click="closeModal" class="btn-secondary mt-3 sm:mt-0 sm:ml-3">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { medicalRecordsApi, teachersApi, uploadApi, type MedicalRecord } from '../services/api'

const route = useRoute()
const auth = useAuthStore()

const isAdmin = computed(() => auth.currentUser?.role === 'admin')
const severities = ['Mild','Moderate','Severe','Critical'] as const

const teacherId = ref<number>(Number(route.params.id) || 0)
const teacherName = ref<string>('')
const records = ref<MedicalRecord[]>([])
const loading = ref(false)

const showModal = ref(false)
const editing = ref(false)
const editingId = ref<number | null>(null)
const form = ref<{ ailmentName: string; severity: any; remarks?: string; documents?: string }>({ ailmentName: '', severity: '', remarks: '', documents: '' })
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

const formatDate = (d: string) => new Date(d).toLocaleDateString()

const fileUrl = (url?: string | null) => {
  if (!url) return '#'
  // If already absolute (starts with http/https), return as is
  if (/^https?:\/\//i.test(url)) return url
  // Otherwise prefix with backend origin (same origin as API responses)
  const origin = window.location.origin.replace(/:\d+$/, ':5004')
  return `${origin}${url.startsWith('/') ? url : `/${url}`}`
}

const loadRecords = async () => {
  if (!teacherId.value) return
  loading.value = true
  try {
    const resp = await medicalRecordsApi.getByTeacher(teacherId.value)
    if (resp.data?.success) {
      records.value = resp.data.data || []
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
      teacherName.value = (resp.data as any).data.teacher_name || ''
    }
  } catch (error) {
    console.error('Error loading teacher name:', error)
  }
}

const openCreate = () => {
  editing.value = false
  editingId.value = null
  form.value = { ailmentName: '', severity: '', remarks: '', documents: '' }
  showModal.value = true
}

const openEdit = (rec: MedicalRecord) => {
  editing.value = true
  editingId.value = rec.id
  form.value = { ailmentName: rec.ailment_name, severity: rec.severity as any, remarks: rec.remarks || '', documents: rec.documents || '' }
  showModal.value = true
}

const closeModal = () => { showModal.value = false }

const save = async () => {
  if (!teacherId.value) return
  if (!form.value.ailmentName || !form.value.severity) { alert('Ailment and severity are required'); return }
  if (editing.value && editingId.value) {
    const resp = await medicalRecordsApi.update(editingId.value, {
      ailmentName: form.value.ailmentName,
      severity: form.value.severity,
      remarks: form.value.remarks,
      documents: form.value.documents
    })
    if (resp.data?.success) { showModal.value = false; loadRecords() }
  } else {
    const resp = await medicalRecordsApi.create({
      teacherId: teacherId.value,
      ailmentName: form.value.ailmentName,
      severity: form.value.severity,
      remarks: form.value.remarks,
      documents: form.value.documents
    })
    if (resp.data?.success) { showModal.value = false; loadRecords() }
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
    loadRecords()
  }
})
</script>


