<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <!-- District Dropdown -->
    <div>
      <label class="form-label">District *</label>
      <select 
        v-model="selectedDistrict" 
        @change="onDistrictChange"
        required 
        class="form-select"
        :disabled="loading.districts"
      >
        <option value="">Select District</option>
        <option 
          v-for="district in districts" 
          :key="district.id" 
          :value="district.id"
        >
          {{ district.name }}
        </option>
      </select>
      <div v-if="loading.districts" class="text-xs text-gray-500 mt-1">Loading districts...</div>
    </div>

    <!-- RD Block Dropdown -->
    <div>
      <label class="form-label">RD Block *</label>
      <select 
        v-model="selectedRdBlock" 
        @change="onRdBlockChange"
        required 
        class="form-select"
        :disabled="!selectedDistrict || loading.rdBlocks"
      >
        <option value="">Select RD Block</option>
        <option 
          v-for="rdBlock in rdBlocks" 
          :key="rdBlock.id" 
          :value="rdBlock.id"
        >
          {{ rdBlock.name }}
        </option>
      </select>
      <div v-if="loading.rdBlocks" class="text-xs text-gray-500 mt-1">Loading RD blocks...</div>
      <div v-if="!selectedDistrict" class="text-xs text-gray-500 mt-1">Please select a district first</div>
    </div>

    <!-- Village/Habitation Dropdown -->
    <div>
      <label class="form-label">Habitation *</label>
      <select 
        v-model="selectedVillage" 
        @change="onVillageChange"
        required 
        class="form-select"
        :disabled="!selectedRdBlock || loading.villages"
      >
        <option value="">Select Habitation</option>
        <option 
          v-for="village in villages" 
          :key="village.id" 
          :value="village.id"
        >
          {{ village.name }}
        </option>
      </select>
      <div v-if="loading.villages" class="text-xs text-gray-500 mt-1">Loading villages...</div>
      <div v-if="!selectedRdBlock" class="text-xs text-gray-500 mt-1">Please select an RD block first</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useLocationsStore } from '../stores/locations'

interface Location {
  id: number
  name: string
}

interface Props {
  modelValue?: {
    districtId?: number
    rdBlockId?: number
    villageId?: number
  }
}

interface Emits {
  (e: 'update:modelValue', value: { districtId?: number, rdBlockId?: number, villageId?: number }): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Reactive data
const districts = ref<Location[]>([])
const rdBlocks = ref<Location[]>([])
const villages = ref<Location[]>([])

const selectedDistrict = ref<number>(props.modelValue?.districtId || 0)
const selectedRdBlock = ref<number>(props.modelValue?.rdBlockId || 0)
const selectedVillage = ref<number>(props.modelValue?.villageId || 0)

const loading = ref({
  districts: false,
  rdBlocks: false,
  villages: false
})

const locationsStore = useLocationsStore()

// Load districts on component mount (via store cache)
onMounted(async () => {
  await loadDistricts()
})

// Watch for prop changes and update selections
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    selectedDistrict.value = newValue.districtId || 0
    selectedRdBlock.value = newValue.rdBlockId || 0
    selectedVillage.value = newValue.villageId || 0
    
    // Load dependent data if needed
    if (selectedDistrict.value) {
      loadRdBlocks(selectedDistrict.value)
    }
    if (selectedRdBlock.value) {
      loadVillages(selectedRdBlock.value)
    }
  }
}, { deep: true })

// Load all districts
const loadDistricts = async () => {
  loading.value.districts = true
  try {
    districts.value = await locationsStore.getDistricts()
  } catch (error) {
    console.error('Failed to load districts:', error)
  } finally {
    loading.value.districts = false
  }
}

// Load RD blocks for selected district
const loadRdBlocks = async (districtId: number) => {
  loading.value.rdBlocks = true
  try {
    rdBlocks.value = await locationsStore.getRdBlocks(districtId)
  } catch (error) {
    console.error('Failed to load RD blocks:', error)
  } finally {
    loading.value.rdBlocks = false
  }
}

// Load villages for selected RD block
const loadVillages = async (rdBlockId: number) => {
  loading.value.villages = true
  try {
    villages.value = await locationsStore.getVillages(rdBlockId)
  } catch (error) {
    console.error('Failed to load villages:', error)
  } finally {
    loading.value.villages = false
  }
}

// Event handlers
const onDistrictChange = async () => {
  // Reset dependent selections
  selectedRdBlock.value = 0
  selectedVillage.value = 0
  rdBlocks.value = []
  villages.value = []
  
  // Load RD blocks for selected district
  if (selectedDistrict.value) {
    await loadRdBlocks(selectedDistrict.value)
  }
  
  emitUpdate()
}

const onRdBlockChange = async () => {
  // Reset village selection
  selectedVillage.value = 0
  villages.value = []
  
  // Load villages for selected RD block
  if (selectedRdBlock.value) {
    await loadVillages(selectedRdBlock.value)
  }
  
  emitUpdate()
}

const onVillageChange = () => {
  emitUpdate()
}

// Emit updated values
const emitUpdate = () => {
  emit('update:modelValue', {
    districtId: selectedDistrict.value || undefined,
    rdBlockId: selectedRdBlock.value || undefined,
    villageId: selectedVillage.value || undefined
  })
}

// Expose methods for parent component
defineExpose({
  reset: () => {
    selectedDistrict.value = 0
    selectedRdBlock.value = 0
    selectedVillage.value = 0
    rdBlocks.value = []
    villages.value = []
    emitUpdate()
  },
  
  getSelectedValues: () => ({
    districtId: selectedDistrict.value,
    rdBlockId: selectedRdBlock.value,
    villageId: selectedVillage.value
  })
})
</script>
