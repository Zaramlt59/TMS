<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-2xl font-semibold text-gray-900">Medical Records</h1>
        <p class="mt-2 text-sm text-gray-700">
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
        <div v-if="loading" class="text-sm text-gray-500">Loading...</div>
        <div v-else-if="records.length === 0" class="text-sm text-gray-500">No records found.</div>
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ailment</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documents</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th v-if="isAdmin" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="rec in records" :key="rec.id">
                <td class="px-4 py-3 text-sm text-gray-900">{{ rec.ailment_name }}</td>
                <td class="px-4 py-3 text-sm">
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                        :class="severityClass(rec.severity)">{{ rec.severity }}</span>
                </td>
                <td class="px-4 py-3 text-sm text-gray-700">{{ rec.remarks || '-' }}</td>
                <td class="px-4 py-3 text-sm">
                  <a v-if="rec.documents" :href="fileUrl(rec.documents)" target="_blank" rel="noopener" class="text-sm text-primary-600">View</a>
                  <span v-else>-</span>
                </td>
                <td class="px-4 py-3 text-sm text-gray-500">{{ formatDate(rec.created_at) }}</td>
                <td v-if="isAdmin" class="px-4 py-3 text-sm">
                  <button @click="openEdit(rec)" class="text-primary-600 mr-2">Edit</button>
                  <button @click="remove(rec.id)" class="text-danger-600">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75" @click="closeModal"></div>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg leading-6 font-medium text-gray-900">{{ editing ? 'Edit Record' : 'Add Record' }}</h3>
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
                  <span class="text-xs text-gray-500 truncate max-w-xs" v-if="uploadName">{{ uploadName }}</span>
                  <a v-if="form.documents" :href="fileUrl(form.documents)" target="_blank" rel="noopener" class="text-sm text-primary-600">View current</a>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
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
    case 'Mild': return 'bg-green-100 text-green-800'
    case 'Moderate': return 'bg-yellow-100 text-yellow-800'
    case 'Severe': return 'bg-orange-100 text-orange-800'
    case 'Critical': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
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
    if (resp.data?.success) records.value = resp.data.data || []
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
  } catch {}
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


