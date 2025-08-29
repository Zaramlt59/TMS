<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-2xl font-semibold text-gray-900">
          {{ isEditing ? 'Edit School' : 'Add New School' }}
        </h1>
        <p class="mt-2 text-sm text-gray-700">
          {{ isEditing ? 'Update school information' : 'Create a new school record' }}
        </p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <router-link to="/schools" class="btn-secondary">
          Back to Schools
        </router-link>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="mt-8 space-y-6">
      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-medium text-gray-900">Basic Information</h3>
        </div>
        <div class="card-body space-y-4">
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label class="form-label">School ID *</label>
              <input
                v-model="form.school_id"
                type="text"
                required
                class="form-input"
                :disabled="isEditing"
                placeholder="Enter unique school ID"
                @input="validateSchoolId"
                @keypress="allowOnlyNumbers"
              />
            </div>
            <div>
              <label class="form-label">School Name *</label>
              <input
                v-model="form.school_name"
                type="text"
                required
                class="form-input"
                placeholder="Enter school name"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label class="form-label">School Type *</label>
              <select v-model="form.school_type" required class="form-select">
                <option value="">Select school type</option>
                <option v-for="type in schoolTypes" :key="type.id" :value="type.name">
                  {{ type.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="form-label">Medium *</label>
              <select v-model="form.medium" required class="form-select">
                <option value="">Select medium</option>
                <option v-for="medium in mediums" :key="medium.id" :value="medium.name">
                  {{ medium.name }}
                </option>
              </select>
            </div>
          </div>

          <div>
            <label class="form-label">School Level *</label>
            <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <label v-for="level in SCHOOL_LEVELS" :key="level" class="flex items-center">
                <input
                  type="checkbox"
                  :value="level"
                  v-model="form.school_level"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span class="ml-2 text-sm text-gray-700">{{ level }}</span>
              </label>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label class="form-label">Management *</label>
              <select v-model="form.management" required class="form-select">
                <option value="">Select management type</option>
                <option v-for="management in managementTypes" :key="management.id" :value="management.name">
                  {{ management.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="form-label">Block Office *</label>
              <select v-model="form.block_office" required class="form-select">
                <option value="">Select block office</option>
                <option v-for="office in BLOCK_OFFICES" :key="office" :value="office">
                  {{ office }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-medium text-gray-900">Location Information</h3>
        </div>
        <div class="card-body space-y-6">
          <!-- Cascading Location Dropdowns -->
          <div>
            <h4 class="text-sm font-medium text-gray-700 mb-3">Geographic Location</h4>
            <LocationDropdowns 
              v-model="locationSelection"
              @update:modelValue="onLocationChange"
            />
          </div>

          <!-- Additional Location Details -->
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                     <div>
              <label class="form-label">Pincode</label>
              <input
                v-model="form.pincode"
                type="text"
                class="form-input"
                placeholder="Enter pincode"
                maxlength="6"
                pattern="[0-9]{6}"
                title="Please enter exactly 6 digits"
                @input="validatePincode"
                @keypress="allowOnlyNumbers"
              />
            </div>
            <div>
              <label class="form-label">Habitation Class</label>
              <select v-model="form.habitation_class" class="form-select">
                <option value="">Select habitation class</option>
                <option v-for="habClass in HABITATION_CLASSES" :key="habClass" :value="habClass">
                  {{ habClass }}
                </option>
              </select>
            </div>
            <div>
              <label class="form-label">Habitation Category</label>
              <select v-model="form.habitation_category" class="form-select">
                <option value="">Select habitation category</option>
                <option v-for="category in HABITATION_CATEGORIES" :key="category" :value="category">
                  {{ category }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-medium text-gray-900">Contact Information</h3>
        </div>
        <div class="card-body space-y-4">
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                         <div>
               <label class="form-label">School Phone</label>
               <input
                 v-model="form.school_phone"
                 type="tel"
                 class="form-input"
                 placeholder="Enter phone number"
                 maxlength="11"
                 pattern="[0-9]{11}"
                 title="Please enter exactly 11 digits"
               />
             </div>
            <div>
              <label class="form-label">School Email</label>
              <input
                v-model="form.school_email"
                type="email"
                class="form-input"
                placeholder="Enter email address"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="flex justify-end space-x-3">
        <router-link to="/schools" class="btn-secondary">
          Cancel
        </router-link>
        <button
          type="submit"
          :disabled="loading"
          class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="loading" class="inline-flex items-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isEditing ? 'Updating...' : 'Creating...' }}
          </span>
          <span v-else>{{ isEditing ? 'Update School' : 'Create School' }}</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { schoolsApi, districtsApi, mediumsApi, managementTypesApi, schoolTypesApi, locationsApi } from '../services/api'
import type { School, District, Medium, ManagementType, SchoolType } from '../types'
import {
  SCHOOL_LEVELS,
  HABITATION_CLASSES,
  HABITATION_CATEGORIES,
  BLOCK_OFFICES
} from '../constants'
import LocationDropdowns from '../components/LocationDropdowns.vue'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const isEditing = computed(() => !!route.params.id)

const districts = ref<District[]>([])
const mediums = ref<Medium[]>([])
const managementTypes = ref<ManagementType[]>([])
const schoolTypes = ref<SchoolType[]>([])

// Location selection for cascading dropdowns
const locationSelection = ref({
  districtId: undefined as number | undefined,
  rdBlockId: undefined as number | undefined,
  villageId: undefined as number | undefined
})

// Create a local interface that extends School for form handling
interface SchoolFormData extends Omit<School, 'school_level' | 'school_id'> {
  school_level: string[] // Use array for form checkboxes
  school_id: string // Keep as string for form input, will be converted to number for API
}

const form = ref<SchoolFormData>({
  school_id: '',
  school_name: '',
  school_type: 'Co-educational',
  school_level: [],
  management: 'Select management type', // Default to placeholder text
  medium: 'English',
  pincode: '',
  district: 'Aizawl', // Default to Aizawl
  rd_block: '',
  school_phone: '',
  school_email: '',
  habitation: '',
  habitation_class: 'Rural',
  habitation_category: 'Village',
  block_office: 'DEO Aizawl'
})

const loadDistricts = async () => {
  try {
    const response = await districtsApi.getAll()
    if (response.data.success) {
      districts.value = response.data.data || []
    }
  } catch (error) {
    console.error('Failed to load districts:', error)
  }
}

const loadMediums = async () => {
  try {
    const response = await mediumsApi.getActive()
    if (response.data.success) {
      mediums.value = response.data.data || []
    }
  } catch (error) {
    console.error('Failed to load mediums:', error)
  }
}

const loadManagementTypes = async () => {
  try {
    const response = await managementTypesApi.getActive()
    if (response.data.success) {
      managementTypes.value = response.data.data || []
    }
  } catch (error) {
    console.error('Failed to load management types:', error)
  }
}

const loadSchoolTypes = async () => {
  try {
    const response = await schoolTypesApi.getActive()
    if (response.data.success) {
      schoolTypes.value = response.data.data || []
    }
  } catch (error) {
    console.error('Failed to load school types:', error)
  }
}

// Validate school ID to ensure it's a positive number
const validateSchoolId = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value
  
  // Remove any non-numeric characters
  const numericValue = value.replace(/[^0-9]/g, '')
  
  // Update the form value with only numeric characters
  form.value.school_id = numericValue
}

// Prevent non-numeric characters from being typed
const allowOnlyNumbers = (event: KeyboardEvent) => {
  const key = event.key
  const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End']
  
  if (!allowedKeys.includes(key)) {
    event.preventDefault()
  }
}

// Helper functions for loading location data
const rdBlocks = ref<any[]>([])
const villages = ref<any[]>([])

const loadRdBlocksForDistrict = async (districtId: number) => {
  try {
    const response = await locationsApi.getRdBlocks(districtId)
    if (response.data.success) {
      rdBlocks.value = response.data.data || []
    }
  } catch (error) {
    console.error('Failed to load RD blocks:', error)
  }
}

const loadVillagesForRdBlock = async (rdBlockId: number) => {
  try {
    const response = await locationsApi.getVillages(rdBlockId)
    if (response.data.success) {
      villages.value = response.data.data || []
    }
  } catch (error) {
    console.error('Failed to load villages:', error)
  }
}

// Handle location selection changes from cascading dropdowns
const onLocationChange = async (location: { districtId?: number, rdBlockId?: number, villageId?: number }) => {
  // Update form fields based on selected location IDs
  if (location.districtId) {
    const selectedDistrict = districts.value.find(d => d.id === location.districtId)
    if (selectedDistrict) {
      form.value.district = selectedDistrict.name
    }
  }
  
  if (location.rdBlockId) {
    // Fetch and store the RD block name instead of ID
    try {
      const response = await locationsApi.getRdBlocks(location.districtId || 1)
      if (response.data.success && response.data.data) {
        const selectedRdBlock = response.data.data.find((rb: any) => rb.id === location.rdBlockId)
        if (selectedRdBlock) {
          form.value.rd_block = selectedRdBlock.name
        }
      }
    } catch (error) {
      console.error('Failed to fetch RD block name:', error)
    }
  }
  
  if (location.villageId) {
    // Fetch and store the village name instead of ID
    try {
      const response = await locationsApi.getVillages(location.rdBlockId || 1)
      if (response.data.success && response.data.data) {
        const selectedVillage = response.data.data.find((v: any) => v.id === location.villageId)
        if (selectedVillage) {
          form.value.habitation = selectedVillage.name
        }
      }
    } catch (error) {
      console.error('Failed to fetch village name:', error)
    }
  }
}

// Set default location selection based on current form values
const setDefaultLocationSelection = () => {
  // Set default district to Aizawl (ID 1) if not set
  if (!locationSelection.value.districtId) {
    const aizawlDistrict = districts.value.find(d => d.name === 'Aizawl')
    if (aizawlDistrict) {
      locationSelection.value.districtId = aizawlDistrict.id
    }
  }
}

const loadSchool = async (schoolId: string) => {
  try {
    const response = await schoolsApi.getById(schoolId)
    if (response.data.success && response.data.data) {
      const schoolData = response.data.data as School
      
      // Convert School type to SchoolFormData type
      form.value = {
        ...schoolData,
        school_level: typeof schoolData.school_level === 'string' && schoolData.school_level 
          ? schoolData.school_level.split(',').map(level => level.trim()).filter(level => level)
          : []
      }
      
      // Ensure district has a valid value
      if (!form.value.district || !districts.value.some(d => d.name === form.value.district)) {
        form.value.district = 'Aizawl'
      }
      if (!form.value.medium || !mediums.value.some(m => m.name === form.value.medium)) {
        form.value.medium = 'English'
      }
      if (!form.value.management || form.value.management === 'Select management type' || !managementTypes.value.some(m => m.name === form.value.management)) {
        // Set to first available active management type
        if (managementTypes.value.length > 0) {
          form.value.management = managementTypes.value[0].name
        } else {
          form.value.management = 'Select management type'
        }
      }
      
      if (!form.value.school_type || !schoolTypes.value.some(t => t.name === form.value.school_type)) {
        // Set to first available active school type
        if (schoolTypes.value.length > 0) {
          form.value.school_type = schoolTypes.value[0].name as 'Co-educational' | 'Girls'
        } else {
          form.value.school_type = 'Co-educational' // Default value
        }
      }

      // Set location selection based on form values
      if (form.value.district) {
        const district = districts.value.find(d => d.name === form.value.district)
        if (district && district.id) {
          locationSelection.value.districtId = district.id
          // Load RD blocks for this district
          await loadRdBlocksForDistrict(district.id)
          
          if (form.value.rd_block) {
            // Find RD block ID by name
            const rdBlock = rdBlocks.value.find(rb => rb.name === form.value.rd_block)
            if (rdBlock && rdBlock.id) {
              locationSelection.value.rdBlockId = rdBlock.id
              // Load villages for this RD block
              await loadVillagesForRdBlock(rdBlock.id)
              
              if (form.value.habitation) {
                // Find village ID by name
                const village = villages.value.find(v => v.name === form.value.habitation)
                if (village && village.id) {
                  locationSelection.value.villageId = village.id
                }
              }
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('Failed to load school:', error)
  }
}

const handleSubmit = async () => {
  if (form.value.school_level.length === 0) {
    alert('Please select at least one school level')
    return
  }

  if (form.value.management === 'Select management type') {
    alert('Please select a management type')
    return
  }

  loading.value = true
  try {
    // Convert SchoolFormData back to School type for API
    const schoolData: School = {
      ...form.value,
      school_id: form.value.school_id, // Keep as string as per School interface
      school_level: form.value.school_level.join(', ')
    }

    let response
    if (isEditing.value) {
      response = await schoolsApi.update(route.params.id as string, schoolData)
    } else {
      response = await schoolsApi.create(schoolData)
    }

    if (response.data.success) {
      router.push('/schools')
    } else {
      alert(response.data.message || 'Operation failed')
    }
  } catch (error: any) {
    console.error('Form submission failed:', error)
    alert(error.response?.data?.message || 'Operation failed')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await Promise.all([loadDistricts(), loadMediums(), loadManagementTypes(), loadSchoolTypes()])
  
  // Set default location selection after districts are loaded
  setDefaultLocationSelection()
  
  // Set default management type if none is selected or if it's still the placeholder
  if ((!form.value.management || form.value.management === 'Select management type') && managementTypes.value.length > 0) {
    form.value.management = managementTypes.value[0].name
  }
  
  // Set default school type if none is selected
  if (!form.value.school_type && schoolTypes.value.length > 0) {
    form.value.school_type = schoolTypes.value[0].name as 'Co-educational' | 'Girls'
  }
  
  if (isEditing.value) {
    await loadSchool(route.params.id as string)
  }
})

// Watch for route changes to refresh data when user navigates back from Settings
watch(() => route.path, async (newPath, oldPath) => {
  // If user navigated back to this form from Settings, refresh the data
  if (newPath === route.path && oldPath && oldPath.includes('/settings')) {
    console.log('Refreshing form data after returning from Settings...')
    await Promise.all([loadDistricts(), loadMediums(), loadManagementTypes(), loadSchoolTypes()])
    
    // Re-validate form data after refresh
    if (isEditing.value) {
      await loadSchool(route.params.id as string)
    }
  }
})

// Add focus event listener to refresh data when user returns to the form
onMounted(() => {
  window.addEventListener('focus', async () => {
    // Check if we're on this form and refresh data
    if (document.activeElement && document.activeElement.closest('form')) {
      console.log('Form focused, refreshing data...')
      await Promise.all([loadDistricts(), loadMediums(), loadManagementTypes(), loadSchoolTypes()])
      
      // Re-validate form data after refresh
      if (isEditing.value) {
        await loadSchool(route.params.id as string)
      }
    }
  })
})

// Validate pincode to ensure it only contains numbers
const validatePincode = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value
  
  // Remove any non-numeric characters
  const numericValue = value.replace(/[^0-9]/g, '')
  
  // Update the form value with only numbers
  form.value.pincode = numericValue
}
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
