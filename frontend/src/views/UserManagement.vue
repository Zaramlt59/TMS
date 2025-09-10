<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-100">User Management</h1>
        <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">
          Manage system users and their roles
        </p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <button @click="openCreateUserModal" class="btn-primary">
          Add User
        </button>
      </div>
    </div>

    <!-- Users Table -->
    <div class="mt-8 card">
      <div class="card-body">
        <div v-if="loading" class="text-center py-12">
          <div class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow-lg rounded-lg text-white bg-gradient-to-r from-blue-500 to-blue-600">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading...
          </div>
        </div>

        <div v-else-if="users.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No users</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new user.</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-32">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-600">
              <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {{ user.username.charAt(0).toUpperCase() }}
                        </span>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ user.username }}</div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">{{ user.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        :class="getRoleBadgeClass(user.role)">
                    {{ getRoleDisplayName(user.role) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        :class="user.is_active ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'">
                    {{ user.is_active ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {{ formatDate(user.created_at) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex items-center space-x-2">
                    <button
                      @click="openEditUserModal(user)"
                      class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                    >
                      Edit
                    </button>
                    <button
                      @click="toggleUserStatus(user)"
                      :class="user.is_active ? 'text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300' : 'text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300'"
                    >
                      {{ user.is_active ? 'Deactivate' : 'Activate' }}
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Create/Edit User Modal -->
    <div v-if="showUserModal" class="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-80" @click="closeUserModal"></div>
        <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl dark:shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
              {{ editingUser ? 'Edit User' : 'Add User' }}
            </h3>
            <div class="mt-4 space-y-4">
              <div>
                <label class="form-label">Username *</label>
                <input
                  v-model="userForm.username"
                  type="text"
                  class="form-input"
                  placeholder="Enter username"
                  required
                />
              </div>
              <div>
                <label class="form-label">Email *</label>
                <input
                  v-model="userForm.email"
                  type="email"
                  class="form-input"
                  placeholder="Enter email"
                  required
                />
              </div>
              <div>
                <label class="form-label">Role *</label>
                <select v-model="userForm.role" class="form-select" required>
                  <option value="">Select role</option>
                  <option v-for="role in availableRoles" :key="role.value" :value="role.value">
                    {{ role.label }}
                  </option>
                </select>
              </div>
              <div v-if="!editingUser">
                <label class="form-label">Password *</label>
                <input
                  v-model="userForm.password"
                  type="password"
                  class="form-input"
                  placeholder="Enter password"
                  required
                />
              </div>
              <div class="flex items-center">
                <input
                  v-model="userForm.is_active"
                  type="checkbox"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded"
                />
                <label class="ml-2 block text-sm text-gray-900 dark:text-gray-100">Active</label>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button @click="saveUser" class="btn-primary sm:ml-3" :disabled="saving">
              {{ saving ? 'Saving...' : (editingUser ? 'Update' : 'Create') }}
            </button>
            <button @click="closeUserModal" class="btn-secondary mt-3 sm:mt-0 sm:ml-3">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { ROLES, ROLE_DISPLAY_NAMES, type UserRole } from '../constants/roles'
import { useRoleGuard } from '../composables/useRoleGuard'

// Role guard
const { isSuperAdmin } = useRoleGuard()

// Redirect if not super admin
if (!isSuperAdmin.value) {
  // In a real app, you'd redirect to unauthorized page
  console.warn('Access denied: Super admin role required')
}

// Types
interface User {
  id: number
  username: string
  email: string
  role: UserRole
  is_active: boolean
  created_at: string
}

interface UserForm {
  username: string
  email: string
  role: UserRole | ''
  password: string
  is_active: boolean
}

// State
const users = ref<User[]>([])
const loading = ref(false)
const saving = ref(false)
const showUserModal = ref(false)
const editingUser = ref<User | null>(null)

const userForm = ref<UserForm>({
  username: '',
  email: '',
  role: '',
  password: '',
  is_active: true
})

// Available roles for selection
const availableRoles = computed(() => [
  { value: ROLES.SUPER_ADMIN, label: ROLE_DISPLAY_NAMES[ROLES.SUPER_ADMIN] },
  { value: ROLES.ADMIN, label: ROLE_DISPLAY_NAMES[ROLES.ADMIN] },
  { value: ROLES.DEO, label: ROLE_DISPLAY_NAMES[ROLES.DEO] },
  { value: ROLES.SDEO, label: ROLE_DISPLAY_NAMES[ROLES.SDEO] },
  { value: ROLES.HOI, label: ROLE_DISPLAY_NAMES[ROLES.HOI] },
  { value: ROLES.TEACHER, label: ROLE_DISPLAY_NAMES[ROLES.TEACHER] }
])

// Methods
const loadUsers = async () => {
  loading.value = true
  try {
    const response = await fetch('/api/user-management', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      credentials: 'include'
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch users')
    }
    
    const data = await response.json()
    users.value = data.data || []
  } catch (error) {
    console.error('Failed to load users:', error)
  } finally {
    loading.value = false
  }
}

const openCreateUserModal = () => {
  editingUser.value = null
  userForm.value = {
    username: '',
    email: '',
    role: '',
    password: '',
    is_active: true
  }
  showUserModal.value = true
}

const openEditUserModal = (user: User) => {
  editingUser.value = user
  userForm.value = {
    username: user.username,
    email: user.email,
    role: user.role,
    password: '',
    is_active: user.is_active
  }
  showUserModal.value = true
}

const closeUserModal = () => {
  showUserModal.value = false
  editingUser.value = null
}

const saveUser = async () => {
  saving.value = true
  try {
    const url = editingUser.value 
      ? `/api/user-management/${editingUser.value.id}`
      : '/api/user-management'
    
    const method = editingUser.value ? 'PUT' : 'POST'
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      credentials: 'include',
      body: JSON.stringify(userForm.value)
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to save user')
    }
    
    closeUserModal()
    loadUsers()
  } catch (error) {
    console.error('Failed to save user:', error)
    alert('Failed to save user: ' + (error as Error).message)
  } finally {
    saving.value = false
  }
}

const toggleUserStatus = async (user: User) => {
  try {
    const response = await fetch(`/api/user-management/${user.id}/toggle-status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      credentials: 'include'
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to toggle user status')
    }
    
    const data = await response.json()
    // Update the user in the local state
    const userIndex = users.value.findIndex(u => u.id === user.id)
    if (userIndex !== -1) {
      users.value[userIndex] = data.data
    }
  } catch (error) {
    console.error('Failed to toggle user status:', error)
    alert('Failed to toggle user status: ' + (error as Error).message)
  }
}

const getRoleDisplayName = (role: UserRole): string => {
  return ROLE_DISPLAY_NAMES[role] || role
}

const getRoleBadgeClass = (role: UserRole): string => {
  switch (role) {
    case ROLES.SUPER_ADMIN:
      return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200'
    case ROLES.ADMIN:
      return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
    case ROLES.DEO:
      return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200'
    case ROLES.SDEO:
      return 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-200'
    case ROLES.HOI:
      return 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200'
    case ROLES.TEACHER:
      return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
    default:
      return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
  }
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString()
}

// Lifecycle
onMounted(() => {
  loadUsers()
})
</script>
