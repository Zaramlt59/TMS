<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-2xl font-semibold text-gray-900">Settings</h1>
        <p class="mt-2 text-sm text-gray-700">
          Manage master data for the system
        </p>
      </div>
    </div>

    <!-- Settings Tabs -->
    <div class="mt-8">
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex space-x-2 sm:space-x-8 overflow-x-auto">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              activeTab === tab.id
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-2 px-1 sm:px-1 border-b-2 font-medium text-xs sm:text-sm flex-shrink-0'
            ]"
          >
            {{ tab.name }}
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <div class="mt-8">
        <!-- Districts Tab -->
        <div v-if="activeTab === 'districts'" class="space-y-6">
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
            <h3 class="text-lg font-medium text-gray-900">Districts</h3>
            <button @click="openModal('districts')" class="btn-primary w-full sm:w-auto">
              Add District
            </button>
          </div>
          <DataTable
            :data="districts"
            :columns="districtColumns"
            :loading="loading"
            @edit="editItem('districts', $event)"
            @delete="deleteItem('districts', $event)"
          />
        </div>

        <!-- RD Blocks Tab -->
        <div v-if="activeTab === 'rdBlocks'" class="space-y-6">
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
            <h3 class="text-lg font-medium text-gray-900">RD Blocks</h3>
            <button @click="openModal('rdBlocks')" class="btn-primary w-full sm:w-auto">
              Add RD Block
            </button>
          </div>
          <DataTable
            :data="rdBlocks"
            :columns="rdBlockColumns"
            :loading="loading"
            @edit="editItem('rdBlocks', $event)"
            @delete="deleteItem('rdBlocks', $event)"
          />
        </div>

        <!-- Habitations Tab -->
        <div v-if="activeTab === 'habitations'" class="space-y-6">
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
            <h3 class="text-lg font-medium text-gray-900">Habitations</h3>
            <button @click="openModal('habitations')" class="btn-primary w-full sm:w-auto">
              Add Habitation
            </button>
          </div>
          <DataTable
            :data="habitations"
            :columns="habitationColumns"
            :loading="loading"
            @edit="editItem('habitations', $event)"
            @delete="deleteItem('habitations', $event)"
          />
        </div>

        <!-- Block Offices Tab -->
        <div v-if="activeTab === 'blockOffices'" class="space-y-6">
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
            <h3 class="text-lg font-medium text-gray-900">Block Offices</h3>
            <button @click="openModal('blockOffices')" class="btn-primary w-full sm:w-auto">
              Add Block Office
            </button>
          </div>
          <DataTable
            :data="blockOffices"
            :columns="blockOfficeColumns"
            :loading="loading"
            @edit="editItem('blockOffices', $event)"
            @delete="deleteItem('blockOffices', $event)"
          />
        </div>

        <!-- Subjects Tab -->
        <div v-if="activeTab === 'subjects'" class="space-y-6">
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
            <h3 class="text-lg font-medium text-gray-900">Subjects Taught</h3>
            <button @click="openModal('subjects')" class="btn-primary w-full sm:w-auto">
              Add Subject
            </button>
          </div>
          <DataTable
            :data="subjects"
            :columns="subjectColumns"
            :loading="loading"
            @edit="editItem('subjects', $event)"
            @delete="deleteItem('subjects', $event)"
          />
        </div>

        <!-- Mediums Tab -->
        <div v-if="activeTab === 'mediums'" class="space-y-6">
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
            <h3 class="text-lg font-medium text-gray-900">Mediums</h3>
            <button @click="openModal('mediums')" class="btn-primary w-full sm:w-auto">
              Add Medium
            </button>
          </div>
          <DataTable
            :data="mediums"
            :columns="mediumColumns"
            :loading="loading"
            @edit="editItem('mediums', $event)"
            @delete="deleteItem('mediums', $event)"
          />
        </div>

        <!-- School Types Tab -->
        <div v-if="activeTab === 'schoolTypes'" class="space-y-6">
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
            <h3 class="text-lg font-medium text-gray-900">School Types</h3>
            <button @click="openModal('schoolTypes')" class="btn-primary w-full sm:w-auto">
              Add School Type
            </button>
          </div>
          <DataTable
            :data="schoolTypes"
            :columns="schoolTypeColumns"
            :loading="loading"
            @edit="editItem('schoolTypes', $event)"
            @delete="deleteItem('schoolTypes', $event)"
          />
        </div>

        <!-- Management Types Tab -->
        <div v-if="activeTab === 'managementTypes'" class="space-y-6">
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
            <h3 class="text-lg font-medium text-gray-900">Management Types</h3>
            <button @click="openModal('managementTypes')" class="btn-primary w-full sm:w-auto">
              Add Management Type
            </button>
          </div>
          <DataTable
            :data="managementTypes"
            :columns="managementTypeColumns"
            :loading="loading"
            @edit="editItem('managementTypes', $event)"
            @delete="deleteItem('managementTypes', $event)"
          />
        </div>

        <!-- Religions Tab -->
        <div v-if="activeTab === 'religions'" class="space-y-6">
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
            <h3 class="text-lg font-medium text-gray-900">Religions</h3>
            <button @click="openModal('religions')" class="btn-primary w-full sm:w-auto">
              Add Religion
            </button>
          </div>
          <DataTable
            :data="religions"
            :columns="religionColumns"
            :loading="loading"
            @edit="editItem('religions', $event)"
            @delete="deleteItem('religions', $event)"
          />
        </div>
      </div>
    </div>

    <!-- Modal for Add/Edit -->
    <Modal
      v-if="showModal"
      :title="modalTitle"
      @close="closeModal"
      @save="saveItem"
    >
      <div class="space-y-4">
        <div v-if="activeTab === 'rdBlocks'" class="space-y-4">
          <div>
            <label class="form-label">District *</label>
            <select v-model="formData.district_id" required class="form-select">
              <option value="">Select district</option>
              <option v-for="district in districts" :key="district.id" :value="district.id">
                {{ district.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="form-label">RD Block Name *</label>
            <input id="rd-block-name" name="rd-block-name" v-model="formData.name" type="text" required class="form-input" placeholder="Enter RD block name" />
          </div>
          <div>
            <label class="form-label">Status</label>
            <select v-model="formData.is_active" class="form-select">
              <option :value="true">Active</option>
              <option :value="false">Inactive</option>
            </select>
          </div>
        </div>

        <div v-else-if="activeTab === 'habitations'" class="space-y-4">
          <div>
            <label class="form-label">District *</label>
            <select v-model="formData.district_id" required class="form-select" @change="onDistrictChange">
              <option value="">Select district</option>
              <option v-for="district in districts" :key="district.id" :value="district.id">
                {{ district.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="form-label">RD Block *</label>
            <select v-model="formData.rd_block_id" required class="form-select" :disabled="!formData.district_id">
              <option value="">Select RD block</option>
              <option v-for="rdBlock in filteredRdBlocks" :key="rdBlock.id" :value="rdBlock.id">
                {{ rdBlock.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="form-label">Habitation Name *</label>
            <input id="habitation-name" name="habitation-name" v-model="formData.name" type="text" required class="form-input" placeholder="Enter habitation name" />
          </div>
          <div>
            <label class="form-label">Status</label>
            <select v-model="formData.is_active" class="form-select">
              <option :value="true">Active</option>
              <option :value="false">Inactive</option>
            </select>
          </div>
        </div>

        <div v-else-if="activeTab === 'subjects'" class="space-y-4">
          <div>
            <label class="form-label">Subject Name *</label>
            <input id="subject-name" name="subject-name" v-model="formData.name" type="text" required class="form-input" placeholder="Enter subject name" />
          </div>
          <div>
            <label class="form-label">Subject Code</label>
            <input id="subject-code" name="subject-code" v-model="formData.code" type="text" class="form-input" placeholder="Enter subject code" />
          </div>
          <div>
            <label class="form-label">Classes Taught *</label>
            <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <label v-for="classItem in CLASSES" :key="classItem" class="flex items-center">
                <input
                  type="checkbox"
                  :value="classItem"
                  v-model="formData.classes"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span class="ml-2 text-sm text-gray-700">{{ classItem }}</span>
              </label>
            </div>
          </div>
        </div>

        <div v-else-if="activeTab === 'mediums'" class="space-y-4">
          <div>
            <label class="form-label">Medium Name *</label>
            <input id="medium-name" name="medium-name" v-model="formData.name" type="text" required class="form-input" placeholder="Enter medium name" />
          </div>
          <div>
            <label class="form-label">Status</label>
            <select v-model="formData.is_active" class="form-select">
              <option :value="true">Active</option>
              <option :value="false">Inactive</option>
            </select>
          </div>
        </div>

        <div v-else-if="activeTab === 'schoolTypes'" class="space-y-4">
          <div>
            <label class="form-label">School Type *</label>
            <input id="school-type-name" name="school-type-name" v-model="formData.name" type="text" required class="form-input" placeholder="Enter school type" />
          </div>
          <div>
            <label class="form-label">Status</label>
            <select v-model="formData.is_active" class="form-select">
              <option :value="true">Active</option>
              <option :value="false">Inactive</option>
            </select>
          </div>
        </div>

        <div v-else-if="activeTab === 'managementTypes'" class="space-y-4">
          <div>
            <label class="form-label">Management Type *</label>
            <input id="management-type-name" name="management-type-name" v-model="formData.name" type="text" required class="form-input" placeholder="Enter management type" />
          </div>
          <div>
            <label class="form-label">Status</label>
            <select v-model="formData.is_active" class="form-select">
              <option :value="true">Active</option>
              <option :value="false">Inactive</option>
            </select>
          </div>
        </div>

        <div v-else-if="activeTab === 'religions'" class="space-y-4">
          <div>
            <label class="form-label">Religion Name *</label>
            <input id="religion-name" name="religion-name" v-model="formData.name" type="text" required class="form-input" placeholder="Enter religion name" />
          </div>
          <div>
            <label class="form-label">Status</label>
            <select v-model="formData.is_active" class="form-select">
              <option :value="true">Active</option>
              <option :value="false">Inactive</option>
            </select>
          </div>
        </div>

        <div v-else-if="activeTab === 'blockOffices'" class="space-y-4">
          <div>
            <label class="form-label">Block Office Name *</label>
            <input id="block-office-name" name="block-office-name" v-model="formData.name" type="text" required class="form-input" placeholder="Enter block office name" />
          </div>
          <div>
            <label class="form-label">Status</label>
            <select v-model="formData.is_active" class="form-select">
              <option :value="true">Active</option>
              <option :value="false">Inactive</option>
            </select>
          </div>
        </div>

        <div v-else-if="activeTab === 'districts'" class="space-y-4">
          <div>
            <label class="form-label">District Name *</label>
            <input id="district-name" name="district-name" v-model="formData.name" type="text" required class="form-input" placeholder="Enter district name" />
          </div>
          <div>
            <label class="form-label">Status</label>
            <select v-model="formData.is_active" class="form-select">
              <option :value="true">Active</option>
              <option :value="false">Inactive</option>
            </select>
          </div>
        </div>

        <div v-else class="space-y-4">
          <div>
            <label class="form-label">Name *</label>
            <input id="generic-name" name="generic-name" v-model="formData.name" type="text" required class="form-input" placeholder="Enter name" />
          </div>
        </div>
      </div>
    </Modal>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div 
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
          aria-hidden="true"
          @click="showDeleteModal = false"
        ></div>

        <!-- Modal panel -->
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Delete Confirmation
                </h3>
                <div class="mt-4">
                  <p class="mb-6 text-gray-600">
                    Do you really want to delete <strong>{{ itemToDelete?.name }}</strong> permanently?
                  </p>
                  
                  <div class="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <button 
                      @click="confirmDelete(true)" 
                      class="btn-danger flex-1"
                    >
                      Yes, Delete Permanently
                    </button>
                    <button 
                      @click="confirmDelete(false)" 
                      class="btn-secondary flex-1"
                    >
                      No, Just Set Inactive
                    </button>
                  </div>
                  
                  <div class="mt-4 text-sm text-gray-500">
                    <p><strong>Delete Permanently:</strong> Item will be completely removed from the database</p>
                    <p><strong>Set Inactive:</strong> Item will remain but won't appear in forms (you can reactivate later)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              @click="showDeleteModal = false"
              class="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { 
  districtsApi, 
  mediumsApi, 
  managementTypesApi, 
  blockOfficesApi,
  locationsApi,
  subjectsApi,
  schoolTypesApi,
  religionsApi
} from '../services/api'
import { CLASSES } from '../constants'
import DataTable from '../components/DataTable.vue'
import Modal from '../components/Modal.vue'

// Types - using imported types from types/index.ts
import type { District, Medium, ManagementType, BlockOffice, Subject, SchoolType, Religion } from '../types'

interface RdBlock {
  id: number
  name: string
  district_id: number
  district_name?: string
  is_active?: boolean
}

interface Habitation {
  id: number
  name: string
  rd_block_id: number
  rd_block_name?: string
  district_name?: string
  is_active?: boolean
}

// Reactive data
const activeTab = ref('districts')
const loading = ref(false)
const showModal = ref(false)
const editingItem = ref<any>(null)

// Delete confirmation modal state
const showDeleteModal = ref(false)
const itemToDelete = ref<any>(null)
const deleteType = ref<string>('')

// Data arrays
const districts = ref<District[]>([])
const rdBlocks = ref<RdBlock[]>([])
const habitations = ref<Habitation[]>([])
const subjects = ref<Subject[]>([])
const mediums = ref<Medium[]>([])
const schoolTypes = ref<SchoolType[]>([])
const managementTypes = ref<ManagementType[]>([])
const religions = ref<Religion[]>([])
const blockOffices = ref<BlockOffice[]>([])

// Form data
const formData = ref<any>({
  name: '',
  code: '',
  district_id: '',
  rd_block_id: '',
  classes: []
})

// Tabs configuration
const tabs = [
  { id: 'districts', name: 'Districts' },
  { id: 'rdBlocks', name: 'RD Blocks' },
  { id: 'habitations', name: 'Habitations' },
  { id: 'blockOffices', name: 'Block Offices' },
  { id: 'subjects', name: 'Subjects' },
  { id: 'mediums', name: 'Mediums' },
  { id: 'schoolTypes', name: 'School Types' },
  { id: 'managementTypes', name: 'Management Types' },
  { id: 'religions', name: 'Religions' }
]

// Computed properties
const modalTitle = computed(() => {
  if (editingItem.value) {
    return `Edit ${activeTab.value.slice(0, -1)}`
  }
  return `Add ${activeTab.value.slice(0, -1)}`
})

const filteredRdBlocks = computed(() => {
  if (!formData.value.district_id) return []
  return rdBlocks.value.filter(block => block.district_id === formData.value.district_id)
})

// Table columns configuration
const districtColumns = [
  { key: 'name', label: 'Name' },
  { key: 'is_active', label: 'Status', formatter: (value: boolean) => value ? 'Active' : 'Inactive' }
]

const rdBlockColumns = [
  { key: 'name', label: 'Name' },
  { key: 'district_name', label: 'District' },
  { key: 'is_active', label: 'Status', formatter: (value: boolean) => value ? 'Active' : 'Inactive' }
]

const habitationColumns = [
  { key: 'name', label: 'Name' },
  { key: 'rd_block_name', label: 'RD Block' },
  { key: 'district_name', label: 'District' },
  { key: 'is_active', label: 'Status', formatter: (value: boolean) => value ? 'Active' : 'Inactive' }
]

const subjectColumns = [
  { key: 'name', label: 'Name' },
  { key: 'code', label: 'Code' },
  { key: 'classes', label: 'Classes', html: true, formatter: (value: string) => {
    if (!value) return 'No classes assigned'
    // Split the comma-separated string and create badges
    const classList = value.split(',').map(cls => cls.trim()).filter(cls => cls)
    if (classList.length === 0) return 'No classes assigned'
    return classList.map(cls => `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-1 mb-1">${cls}</span>`).join('')
  }}
]

const mediumColumns = [
  { key: 'name', label: 'Name' },
  { key: 'is_active', label: 'Status', formatter: (value: boolean) => value ? 'Active' : 'Inactive' }
]

const schoolTypeColumns = [
  { key: 'name', label: 'Name' },
  { key: 'is_active', label: 'Status', formatter: (value: boolean) => value ? 'Active' : 'Inactive' }
]

const managementTypeColumns = [
  { key: 'name', label: 'Name' },
  { key: 'is_active', label: 'Status', formatter: (value: boolean) => value ? 'Active' : 'Inactive' }
]

const religionColumns = [
  { key: 'name', label: 'Name' },
  { key: 'is_active', label: 'Status', formatter: (value: boolean) => value ? 'Active' : 'Inactive' }
]

const blockOfficeColumns = [
  { key: 'name', label: 'Name' },
  { key: 'is_active', label: 'Status', formatter: (value: boolean) => value ? 'Active' : 'Inactive' }
]

// Methods
const loadData = async () => {
  loading.value = true
  try {
    // Load all data in parallel
    const [
      districtsResponse,
      mediumsResponse,
      managementTypesResponse,
      blockOfficesResponse
    ] = await Promise.all([
      districtsApi.getAllIncludingInactive(),
      mediumsApi.getAllIncludingInactive(),
      managementTypesApi.getAll(),
      blockOfficesApi.getAllIncludingInactive()
    ])

    if (districtsResponse.data.success && districtsResponse.data.data) districts.value = districtsResponse.data.data
    if (mediumsResponse.data.success && mediumsResponse.data.data) mediums.value = mediumsResponse.data.data
    if (managementTypesResponse.data.success && managementTypesResponse.data.data) managementTypes.value = managementTypesResponse.data.data
    if (blockOfficesResponse.data.success && blockOfficesResponse.data.data) blockOffices.value = blockOfficesResponse.data.data

    // Load RD blocks and habitations
    await loadRdBlocks()
    await loadHabitations()

    // Load subjects and other data (you'll need to create these APIs)
    await loadSubjects()
    await loadSchoolTypes()
    await loadReligions()

  } catch (error) {
    console.error('Failed to load data:', error)
  } finally {
    loading.value = false
  }
}

const loadRdBlocks = async () => {
  try {
    const response = await locationsApi.getAllRdBlocks()
    if (response.data.success && response.data.data) {
      rdBlocks.value = response.data.data.map((block: any) => ({
        ...block,
        district_name: districts.value.find(d => d.id === block.district_id)?.name
      }))
    }
  } catch (error) {
    console.error('Failed to load RD blocks:', error)
  }
}

const loadHabitations = async () => {
  try {
    const response = await locationsApi.getAllVillages()
    if (response.data.success && response.data.data) {
      habitations.value = response.data.data.map((habitation: any) => {
        const rdBlock = rdBlocks.value.find(b => b.id === habitation.rd_block_id)
        return {
          ...habitation,
          rd_block_name: rdBlock?.name,
          district_name: districts.value.find(d => d.id === rdBlock?.district_id)?.name
        }
      })
    }
  } catch (error) {
    console.error('Failed to load habitations:', error)
  }
}

const loadSubjects = async () => {
  try {
    const response = await subjectsApi.getAll()
    if (response.data.success && response.data.data) {
      subjects.value = response.data.data
    }
  } catch (error) {
    console.error('Failed to load subjects:', error)
  }
}

const loadSchoolTypes = async () => {
  try {
    const response = await schoolTypesApi.getAllIncludingInactive()
    if (response.data.success && response.data.data) {
      schoolTypes.value = response.data.data
    }
  } catch (error) {
    console.error('Failed to load school types:', error)
  }
}

const loadReligions = async () => {
  try {
    const response = await religionsApi.getAll()
    if (response.data.success && response.data.data) {
      religions.value = response.data.data
    }
  } catch (error) {
    console.error('Failed to load religions:', error)
  }
}

const openModal = (type: string) => {
  editingItem.value = null
  
  // Set default form data based on type
  switch (type) {
    case 'subjects':
      formData.value = {
        name: '',
        code: '',
        classes: [],
        is_active: true
      }
      break
    case 'districts':
      formData.value = {
        name: '',
        is_active: true
      }
      break
    case 'rdBlocks':
      formData.value = {
        name: '',
        district_id: '',
        is_active: true
      }
      break
    case 'habitations':
      formData.value = {
        name: '',
        rd_block_id: '',
        is_active: true
      }
      break
    case 'blockOffices':
      formData.value = {
        name: '',
        is_active: true
      }
      break
    case 'mediums':
      formData.value = {
        name: '',
        is_active: true
      }
      break
    case 'schoolTypes':
      formData.value = {
        name: '',
        is_active: true
      }
      break
    case 'managementTypes':
      formData.value = {
        name: '',
        is_active: true
      }
      break
    case 'religions':
      formData.value = {
        name: '',
        is_active: true
      }
      break
    default:
      formData.value = {
        name: '',
        code: '',
        district_id: '',
        rd_block_id: '',
        classes: [],
        is_active: true
      }
  }
  
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingItem.value = null
  // Reset form data to default values
  formData.value = {
    name: '',
    code: '',
    district_id: '',
    rd_block_id: '',
    classes: [],
    is_active: true
  }
}

const editItem = (type: string, item: any) => {
  editingItem.value = item
  console.log('🔍 Editing item:', type, item)
  
  if (type === 'subjects' && item.classes) {
    // Convert classes string to array for the form checkboxes
    const subjectData = { ...item }
    console.log('🔍 Original classes:', item.classes)
    console.log('🔍 Classes type:', typeof item.classes)
    
    if (typeof subjectData.classes === 'string') {
      subjectData.classes = subjectData.classes.split(',').map((cls: string) => cls.trim()).filter((cls: string) => cls)
      console.log('🔍 Converted classes array:', subjectData.classes)
    }
    
    formData.value = subjectData
    console.log('🔍 Final form data for subjects:', formData.value)
  } else {
    formData.value = { ...item }
  }
  showModal.value = true
}

const deleteItem = async (type: string, item: any) => {
  itemToDelete.value = item
  deleteType.value = type
  showDeleteModal.value = true
}

const confirmDelete = async (permanent: boolean) => {
  if (!itemToDelete.value || !deleteType.value) return
  
  try {
    let response
    
    if (permanent) {
      // Permanent delete - call the API
      switch (deleteType.value) {
        case 'districts':
          response = await districtsApi.hardDelete(itemToDelete.value.id)
          break
        case 'rdBlocks':
          response = await locationsApi.hardDeleteRdBlock(itemToDelete.value.id)
          break
        case 'habitations':
          response = await locationsApi.hardDeleteHabitation(itemToDelete.value.id)
          break
        case 'blockOffices':
          response = await blockOfficesApi.hardDelete(itemToDelete.value.id)
          break
        case 'subjects':
          response = await subjectsApi.delete(itemToDelete.value.id)
          break
        case 'mediums':
          response = await mediumsApi.hardDelete(itemToDelete.value.id)
          break
        case 'schoolTypes':
          response = await schoolTypesApi.hardDelete(itemToDelete.value.id)
          break
        case 'managementTypes':
          response = await managementTypesApi.hardDelete(itemToDelete.value.id)
          break
        case 'religions':
          response = await religionsApi.hardDelete(itemToDelete.value.id)
          break
      }

      if (response?.data.success) {
        await loadData() // Reload data
        alert(`${deleteType.value.slice(0, -1)} deleted permanently`)
      } else {
        const errorMessage = response?.data.error || response?.data.message || 'Unknown error'
        alert(`Failed to delete item: ${errorMessage}`)
      }
    } else {
      // Status change - set to inactive
      const updateData = { ...itemToDelete.value, is_active: false }
      
      switch (deleteType.value) {
        case 'districts':
          response = await districtsApi.update(itemToDelete.value.id, updateData)
          break
        case 'rdBlocks':
          response = await locationsApi.updateRdBlock(itemToDelete.value.id, updateData)
          break
        case 'habitations':
          response = await locationsApi.updateHabitation(itemToDelete.value.id, updateData)
          break
        case 'blockOffices':
          response = await blockOfficesApi.update(itemToDelete.value.id, updateData)
          break
        case 'subjects':
          response = await subjectsApi.update(itemToDelete.value.id, updateData)
          break
        case 'mediums':
          response = await mediumsApi.update(itemToDelete.value.id, updateData)
          break
        case 'schoolTypes':
          response = await schoolTypesApi.update(itemToDelete.value.id, updateData)
          break
        case 'managementTypes':
          response = await managementTypesApi.update(itemToDelete.value.id, updateData)
          break
        case 'religions':
          response = await religionsApi.update(itemToDelete.value.id, updateData)
          break
      }

      if (response?.data.success) {
        await loadData() // Reload data
        alert(`${deleteType.value.slice(0, -1)} status changed to inactive`)
      } else {
        const errorMessage = response?.data.error || response?.data.message || 'Unknown error'
        alert(`Failed to update item: ${errorMessage}`)
      }
    }
  } catch (error) {
    console.error(`Failed to ${permanent ? 'delete' : 'update'} ${deleteType.value}:`, error)
    alert(`An error occurred while ${permanent ? 'deleting' : 'updating'} the item`)
  } finally {
    showDeleteModal.value = false
    itemToDelete.value = null
    deleteType.value = ''
  }
}

const saveItem = async () => {
  try {
    // Check for duplicates before saving (only for new items)
    if (!editingItem.value) {
      const isDuplicate = await checkForDuplicates()
      if (isDuplicate) {
        return // Stop if duplicate found
      }
    }
    
    let response
    if (editingItem.value) {
      // Update existing item
      switch (activeTab.value) {
        case 'districts':
          response = await districtsApi.update(editingItem.value.id, formData.value)
          break
        case 'rdBlocks':
          response = await locationsApi.updateRdBlock(editingItem.value.id, formData.value)
          break
        case 'habitations':
          response = await locationsApi.updateHabitation(editingItem.value.id, formData.value)
          break
        case 'blockOffices':
          response = await blockOfficesApi.update(editingItem.value.id, formData.value)
          break
        case 'subjects':
          // Convert classes array to comma-separated string for subjects
          const subjectData = { ...formData.value }
          if (Array.isArray(subjectData.classes)) {
            subjectData.classes = subjectData.classes.join(', ')
          }
          response = await subjectsApi.update(editingItem.value.id, subjectData)
          break
        case 'mediums':
          response = await mediumsApi.update(editingItem.value.id, formData.value)
          break
        case 'schoolTypes':
          response = await schoolTypesApi.update(editingItem.value.id, formData.value)
          break
        case 'managementTypes':
          response = await managementTypesApi.update(editingItem.value.id, formData.value)
          break
        case 'religions':
          response = await religionsApi.update(editingItem.value.id, formData.value)
          break
      }
    } else {
      // Create new item
      switch (activeTab.value) {
        case 'districts':
          response = await districtsApi.create(formData.value)
          break
        case 'rdBlocks':
          response = await locationsApi.createRdBlock(formData.value)
          break
        case 'habitations':
          response = await locationsApi.createHabitation(formData.value)
          break
        case 'blockOffices':
          response = await blockOfficesApi.create(formData.value)
          break
        case 'subjects':
          // Convert classes array to comma-separated string for subjects
          const subjectData = { ...formData.value }
          if (Array.isArray(subjectData.classes)) {
            subjectData.classes = subjectData.classes.join(', ')
          }
          response = await subjectsApi.create(subjectData)
          break
        case 'mediums':
          response = await mediumsApi.create(formData.value)
          break
        case 'schoolTypes':
          response = await schoolTypesApi.create(formData.value)
          break
        case 'managementTypes':
          response = await managementTypesApi.create(formData.value)
          break
        case 'religions':
          response = await religionsApi.create(formData.value)
          break
      }
    }

    if (response?.data.success) {
      await loadData() // Reload data
      closeModal()
    } else {
      alert(`Failed to ${editingItem.value ? 'update' : 'create'} item: ${response?.data.message}`)
    }
  } catch (error) {
    console.error('Failed to save item:', error)
    alert('An error occurred while saving the item')
  }
}

const onDistrictChange = () => {
  formData.value.rd_block_id = ''
}

// Check for duplicate entries
const checkForDuplicates = async (): Promise<boolean> => {
  try {
    // Basic validation - check if name is provided
    if (!formData.value.name || formData.value.name.trim() === '') {
      alert('Please enter a name!')
      return true
    }
    
    switch (activeTab.value) {
      case 'districts':
        // Check if district name already exists
        const existingDistrict = districts.value.find(
          d => d.name.toLowerCase() === formData.value.name.toLowerCase() && d.is_active
        )
        if (existingDistrict) {
          alert('A district with this name already exists!')
          return true
        }
        break
        
      case 'rdBlocks':
        // Check if district is selected
        if (!formData.value.district_id) {
          alert('Please select a district first!')
          return true
        }
        // Check if RD block name already exists in the same district
        const existingRdBlock = rdBlocks.value.find(
          rb => rb.name.toLowerCase() === formData.value.name.toLowerCase() && 
                rb.district_id === formData.value.district_id && 
                rb.is_active
        )
        if (existingRdBlock) {
          alert('An RD block with this name already exists in the selected district!')
          return true
        }
        break
        
      case 'habitations':
        // Check if RD block is selected
        if (!formData.value.rd_block_id) {
          alert('Please select an RD block first!')
          return true
        }
        // Check if habitation name already exists in the same RD block
        const existingHabitation = habitations.value.find(
          h => h.name.toLowerCase() === formData.value.name.toLowerCase() && 
               h.rd_block_id === formData.value.rd_block_id && 
               h.is_active
        )
        if (existingHabitation) {
          alert('A habitation with this name already exists in the selected RD block!')
          return true
        }
        break
        
      case 'blockOffices':
        // Check if block office name already exists
        const existingBlockOffice = blockOffices.value.find(
          bo => bo.name.toLowerCase() === formData.value.name.toLowerCase() && bo.is_active
        )
        if (existingBlockOffice) {
          alert('A block office with this name already exists!')
          return true
        }
        break
        
      case 'subjects':
        // Check if subject name already exists
        const existingSubject = subjects.value.find(
          s => s.name.toLowerCase() === formData.value.name.toLowerCase()
        )
        if (existingSubject) {
          alert('A subject with this name already exists!')
          return true
        }
        break
        
      case 'mediums':
        // Check if medium name already exists
        const existingMedium = mediums.value.find(
          m => m.name.toLowerCase() === formData.value.name.toLowerCase() && m.is_active
        )
        if (existingMedium) {
          alert('A medium with this name already exists!')
          return true
        }
        break
        
      case 'schoolTypes':
        // Check if school type name already exists
        const existingSchoolType = schoolTypes.value.find(
          st => st.name.toLowerCase() === formData.value.name.toLowerCase() && st.is_active
        )
        if (existingSchoolType) {
          alert('A school type with this name already exists!')
          return true
        }
        break
        
      case 'managementTypes':
        // Check if management type name already exists
        const existingManagementType = managementTypes.value.find(
          mt => mt.name.toLowerCase() === formData.value.name.toLowerCase() && mt.is_active
        )
        if (existingManagementType) {
          alert('A management type with this name already exists!')
          return true
        }
        break
        
      case 'religions':
        // Check if religion name already exists
        const existingReligion = religions.value.find(
          r => r.name.toLowerCase() === formData.value.name.toLowerCase() && r.is_active
        )
        if (existingReligion) {
          alert('A religion with this name already exists!')
          return true
        }
        break
    }
    
    return false // No duplicates found
  } catch (error) {
    console.error('Error checking for duplicates:', error)
    return false
  }
}

// Lifecycle
onMounted(() => {
  loadData()
})
</script>

<style scoped>
/* Custom placeholder styling for all input fields */
.form-input::placeholder,
.form-select::placeholder {
  color: #6B7280; /* Medium gray color - clearer but still subtle */
  opacity: 0.8; /* More visible than before */
  font-style: normal; /* Normal style - no italic */
  font-weight: 400; /* Normal font weight */
}

/* Focus state placeholder styling */
.form-input:focus::placeholder,
.form-select:focus::placeholder {
  color: #9CA3AF; /* Light gray when focused */
  opacity: 0.6; /* Slightly faded when focused */
}

/* Hover state placeholder styling */
.form-input:hover::placeholder,
.form-select:hover::placeholder {
  color: #6B7280; /* Consistent with default state */
  opacity: 0.9; /* More visible on hover */
}

/* Specific styling for readonly fields */
.form-input[readonly]::placeholder {
  color: #9CA3AF; /* Light gray for readonly fields */
  opacity: 0.5; /* Faded for readonly fields */
  font-style: normal; /* Normal style for readonly fields */
}
</style>
