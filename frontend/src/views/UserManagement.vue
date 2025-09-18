<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <!-- Header with enhanced controls -->
    <div class="sm:flex sm:items-center sm:justify-between">
      <div class="sm:flex-auto">
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-100">User Management</h1>
        <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">
          Manage system users, roles, and permissions
        </p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none flex space-x-3">
        <button 
          @click="openBulkActionsModal" 
          :disabled="selectedUsers.length === 0"
          class="btn-secondary"
          :class="{ 'opacity-50 cursor-not-allowed': selectedUsers.length === 0 }"
        >
          Bulk Actions ({{ selectedUsers.length }})
        </button>
        <button @click="openCreateUserModal" class="btn-primary">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Add User
        </button>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="mt-6 bg-white dark:bg-gray-800 shadow rounded-lg p-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search</label>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search users..."
            class="form-input"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role Filter</label>
          <select v-model="roleFilter" class="form-select">
            <option value="">All Roles</option>
            <option v-for="role in availableRoles" :key="role.value" :value="role.value">
              {{ role.label }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status Filter</label>
          <select v-model="statusFilter" class="form-select">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div class="flex items-end">
          <button @click="clearFilters" class="btn-secondary w-full">
            Clear Filters
          </button>
        </div>
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

        <!-- Desktop Table View -->
        <div v-else class="hidden md:block overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th class="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    :checked="selectedUsers.length === filteredUsers.length && filteredUsers.length > 0"
                    :indeterminate="selectedUsers.length > 0 && selectedUsers.length < filteredUsers.length"
                    @change="toggleSelectAll"
                    class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded"
                  />
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Scope</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Last Login</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-40">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-600">
              <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200">
                <td class="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    :checked="selectedUsers.includes(user.id)"
                    @change="toggleUserSelection(user.id)"
                    class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded"
                  />
                </td>
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
                  <div class="flex items-center space-x-2">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          :class="getRoleBadgeClass(user.role)">
                      {{ getRoleDisplayName(user.role) }}
                    </span>
                    <button
                      @click="openRoleAssignmentModal(user)"
                      class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      title="Change Role"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                    </button>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  <div v-if="user.school_id" class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                    School: {{ user.school_id }}
                  </div>
                  <div v-else-if="user.district" class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    District: {{ user.district }}
                  </div>
                  <div v-else-if="user.rd_block" class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                    Block: {{ user.rd_block }}
                  </div>
                  <span v-else class="text-gray-400">System-wide</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        :class="user.is_active ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'">
                    {{ user.is_active ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {{ user.last_login ? formatDate(user.last_login) : 'Never' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex items-center space-x-2">
                    <button
                      @click="openEditUserModal(user)"
                      class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                      title="Edit User"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                    </button>
                    <button
                      @click="toggleUserStatus(user)"
                      :class="user.is_active ? 'text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300' : 'text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300'"
                      :title="user.is_active ? 'Deactivate User' : 'Activate User'"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path v-if="user.is_active" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"></path>
                        <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </button>
                    <button
                      @click="openUserDetailsModal(user)"
                      class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                      title="View Details"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Card View -->
        <div class="md:hidden space-y-4 p-4">
          <div
            v-for="user in filteredUsers"
            :key="user.id"
            class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-md dark:hover:shadow-xl dark:shadow-gray-900/20 transition-all duration-200"
          >
            <div class="p-4">
              <!-- Header with checkbox and user info -->
              <div class="flex items-start justify-between mb-4">
                <div class="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    :checked="selectedUsers.includes(user.id)"
                    @change="toggleUserSelection(user.id)"
                    class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded mt-1"
                  />
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {{ user.username.charAt(0).toUpperCase() }}
                        </span>
                      </div>
                    </div>
                    <div class="ml-3">
                      <div class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ user.username }}</div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">{{ user.email }}</div>
                    </div>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        :class="user.is_active ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'">
                    {{ user.is_active ? 'Active' : 'Inactive' }}
                  </span>
                </div>
              </div>

              <!-- User details -->
              <div class="space-y-3">
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                  <dt class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 sm:mb-0">
                    Role
                  </dt>
                  <dd class="text-sm text-gray-900 dark:text-gray-100">
                    <div class="flex items-center space-x-2">
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                            :class="getRoleBadgeClass(user.role)">
                        {{ getRoleDisplayName(user.role) }}
                      </span>
                      <button
                        @click="openRoleAssignmentModal(user)"
                        class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        title="Change Role"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                      </button>
                    </div>
                  </dd>
                </div>

                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                  <dt class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 sm:mb-0">
                    Scope
                  </dt>
                  <dd class="text-sm text-gray-500 dark:text-gray-400">
                    <div v-if="user.school_id" class="flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                      </svg>
                      School: {{ user.school_id }}
                    </div>
                    <div v-else-if="user.district" class="flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      District: {{ user.district }}
                    </div>
                    <div v-else-if="user.rd_block" class="flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                      </svg>
                      Block: {{ user.rd_block }}
                    </div>
                    <span v-else class="text-gray-400">System-wide</span>
                  </dd>
                </div>

                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                  <dt class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 sm:mb-0">
                    Last Login
                  </dt>
                  <dd class="text-sm text-gray-500 dark:text-gray-400">
                    {{ user.last_login ? formatDate(user.last_login) : 'Never' }}
                  </dd>
                </div>
              </div>
              
              <!-- Actions -->
              <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div class="flex space-x-3">
                  <button
                    @click="openEditUserModal(user)"
                    class="flex-1 inline-flex justify-center items-center px-3 py-2 text-sm font-medium rounded-md text-blue-700 dark:text-blue-200 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:shadow-sm dark:hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 border border-blue-200 dark:border-blue-700"
                  >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                    Edit
                  </button>
                  <button
                    @click="toggleUserStatus(user)"
                    :class="user.is_active ? 'flex-1 inline-flex justify-center items-center px-3 py-2 text-sm font-medium rounded-md text-red-700 dark:text-red-200 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 hover:shadow-sm dark:hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 border border-red-200 dark:border-red-700' : 'flex-1 inline-flex justify-center items-center px-3 py-2 text-sm font-medium rounded-md text-green-700 dark:text-green-200 bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50 hover:shadow-sm dark:hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 border border-green-200 dark:border-green-700'"
                    :title="user.is_active ? 'Deactivate User' : 'Activate User'"
                  >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path v-if="user.is_active" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"></path>
                      <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    {{ user.is_active ? 'Deactivate' : 'Activate' }}
                  </button>
                  <button
                    @click="openUserDetailsModal(user)"
                    class="flex-1 inline-flex justify-center items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 hover:shadow-sm dark:hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 border border-gray-200 dark:border-gray-600"
                  >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                    Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit User Modal -->
    <div v-if="showUserModal" class="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-80" @click="closeUserModal"></div>
        <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl dark:shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
              {{ editingUser ? 'Edit User' : 'Add User' }}
            </h3>
            <div class="mt-4 space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="form-label">Role *</label>
                  <select v-model="userForm.role" class="form-select" required @change="onRoleChange">
                    <option value="">Select role</option>
                    <option v-for="role in availableRoles" :key="role.value" :value="role.value">
                      {{ role.label }}
                    </option>
                  </select>
                </div>
                <div>
                  <label class="form-label">Phone</label>
                  <input
                    v-model="userForm.phone"
                    type="tel"
                    class="form-input"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <!-- Role-specific scope fields -->
              <div v-if="userForm.role === 'teacher' || userForm.role === 'hoi'" class="space-y-4">
                <div>
                  <label class="form-label">School ID *</label>
                  <input
                    v-model="userForm.school_id"
                    type="text"
                    class="form-input"
                    placeholder="Enter school ID"
                    :required="userForm.role === 'teacher' || userForm.role === 'hoi'"
                  />
                </div>
              </div>

              <div v-if="userForm.role === 'deo'" class="space-y-4">
                <div>
                  <label class="form-label">District *</label>
                  <input
                    v-model="userForm.district"
                    type="text"
                    class="form-input"
                    placeholder="Enter district name"
                    required
                  />
                </div>
              </div>

              <div v-if="userForm.role === 'sdeo'" class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="form-label">District *</label>
                    <input
                      v-model="userForm.district"
                      type="text"
                      class="form-input"
                      placeholder="Enter district name"
                      required
                    />
                  </div>
                  <div>
                    <label class="form-label">RD Block *</label>
                    <input
                      v-model="userForm.rd_block"
                      type="text"
                      class="form-input"
                      placeholder="Enter RD block name"
                      required
                    />
                  </div>
                </div>
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

    <!-- Role Assignment Modal -->
    <div v-if="showRoleModal" class="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-80" @click="closeRoleModal"></div>
        <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl dark:shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
              Change Role for {{ roleAssignmentUser?.username }}
            </h3>
            <div class="mt-4 space-y-4">
              <div>
                <label class="form-label">Current Role</label>
                <div class="mt-1">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        :class="getRoleBadgeClass(roleAssignmentUser?.role || '')">
                    {{ getRoleDisplayName(roleAssignmentUser?.role || '') }}
                  </span>
                </div>
              </div>
              <div>
                <label class="form-label">New Role *</label>
                <select v-model="newRole" class="form-select" required>
                  <option value="">Select new role</option>
                  <option v-for="role in availableRoles" :key="role.value" :value="role.value">
                    {{ role.label }}
                  </option>
                </select>
              </div>
              <div v-if="newRole && newRole !== roleAssignmentUser?.role" class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-4">
                <div class="flex">
                  <svg class="w-5 h-5 text-yellow-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div class="ml-3">
                    <h3 class="text-sm font-medium text-yellow-800 dark:text-yellow-200">Role Change Warning</h3>
                    <p class="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
                      Changing the role will affect the user's permissions and data access. This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button @click="saveRoleChange" class="btn-primary sm:ml-3" :disabled="!newRole || newRole === roleAssignmentUser?.role">
              Change Role
            </button>
            <button @click="closeRoleModal" class="btn-secondary mt-3 sm:mt-0 sm:ml-3">Cancel</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Bulk Actions Modal -->
    <div v-if="showBulkModal" class="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-80" @click="closeBulkModal"></div>
        <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl dark:shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
              Bulk Actions ({{ selectedUsers.length }} users)
            </h3>
            <div class="mt-4 space-y-4">
              <div>
                <label class="form-label">Action</label>
                <select v-model="bulkAction" class="form-select">
                  <option value="">Select action</option>
                  <option value="activate">Activate Users</option>
                  <option value="deactivate">Deactivate Users</option>
                  <option value="change_role">Change Role</option>
                  <option value="delete">Delete Users</option>
                </select>
              </div>
              
              <div v-if="bulkAction === 'change_role'">
                <label class="form-label">New Role</label>
                <select v-model="bulkRole" class="form-select">
                  <option value="">Select role</option>
                  <option v-for="role in availableRoles" :key="role.value" :value="role.value">
                    {{ role.label }}
                  </option>
                </select>
              </div>

              <div v-if="bulkAction === 'delete'" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
                <div class="flex">
                  <svg class="w-5 h-5 text-red-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div class="ml-3">
                    <h3 class="text-sm font-medium text-red-800 dark:text-red-200">Dangerous Action</h3>
                    <p class="mt-1 text-sm text-red-700 dark:text-red-300">
                      This will permanently delete {{ selectedUsers.length }} users. This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button @click="executeBulkAction" class="btn-primary sm:ml-3" :disabled="!bulkAction || (bulkAction === 'change_role' && !bulkRole)">
              Execute Action
            </button>
            <button @click="closeBulkModal" class="btn-secondary mt-3 sm:mt-0 sm:ml-3">Cancel</button>
          </div>
        </div>
      </div>
    </div>

    <!-- User Details Modal -->
    <div v-if="showDetailsModal" class="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-80" @click="closeDetailsModal"></div>
        <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl dark:shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
              User Details: {{ selectedUserDetails?.username }}
            </h3>
            <div v-if="selectedUserDetails" class="mt-4 space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Username</label>
                  <p class="text-sm text-gray-900 dark:text-gray-100">{{ selectedUserDetails.username }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
                  <p class="text-sm text-gray-900 dark:text-gray-100">{{ selectedUserDetails.email }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Role</label>
                  <p class="text-sm">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          :class="getRoleBadgeClass(selectedUserDetails.role)">
                      {{ getRoleDisplayName(selectedUserDetails.role) }}
                    </span>
                  </p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
                  <p class="text-sm">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          :class="selectedUserDetails.is_active ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'">
                      {{ selectedUserDetails.is_active ? 'Active' : 'Inactive' }}
                    </span>
                  </p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Created</label>
                  <p class="text-sm text-gray-900 dark:text-gray-100">{{ formatDate(selectedUserDetails.created_at) }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Last Login</label>
                  <p class="text-sm text-gray-900 dark:text-gray-100">{{ selectedUserDetails.last_login ? formatDate(selectedUserDetails.last_login) : 'Never' }}</p>
                </div>
              </div>
              
              <div v-if="selectedUserDetails.school_id || selectedUserDetails.district || selectedUserDetails.rd_block">
                <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Scope</label>
                <div class="mt-1 space-y-1">
                  <div v-if="selectedUserDetails.school_id" class="text-sm text-gray-900 dark:text-gray-100">
                    School: {{ selectedUserDetails.school_id }}
                  </div>
                  <div v-if="selectedUserDetails.district" class="text-sm text-gray-900 dark:text-gray-100">
                    District: {{ selectedUserDetails.district }}
                  </div>
                  <div v-if="selectedUserDetails.rd_block" class="text-sm text-gray-900 dark:text-gray-100">
                    RD Block: {{ selectedUserDetails.rd_block }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button @click="closeDetailsModal" class="btn-secondary">Close</button>
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
  phone?: string
  role: UserRole
  is_active: boolean
  school_id?: string
  district?: string
  rd_block?: string
  created_at: string
  last_login?: string
}

interface UserForm {
  username: string
  email: string
  phone: string
  role: UserRole | ''
  password: string
  is_active: boolean
  school_id: string
  district: string
  rd_block: string
}

// State
const users = ref<User[]>([])
const loading = ref(false)
const saving = ref(false)
const showUserModal = ref(false)
const showRoleModal = ref(false)
const showBulkModal = ref(false)
const showDetailsModal = ref(false)
const editingUser = ref<User | null>(null)
const roleAssignmentUser = ref<User | null>(null)
const selectedUserDetails = ref<User | null>(null)
const selectedUsers = ref<number[]>([])
const newRole = ref<UserRole | ''>('')
const bulkAction = ref('')
const bulkRole = ref<UserRole | ''>('')

// Filters
const searchQuery = ref('')
const roleFilter = ref('')
const statusFilter = ref('')

const userForm = ref<UserForm>({
  username: '',
  email: '',
  phone: '',
  role: '',
  password: '',
  is_active: true,
  school_id: '',
  district: '',
  rd_block: ''
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

// Filtered users based on search and filters
const filteredUsers = computed(() => {
  let filtered = users.value

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(user => 
      user.username.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.phone?.toLowerCase().includes(query)
    )
  }

  // Role filter
  if (roleFilter.value) {
    filtered = filtered.filter(user => user.role === roleFilter.value)
  }

  // Status filter
  if (statusFilter.value) {
    const isActive = statusFilter.value === 'active'
    filtered = filtered.filter(user => user.is_active === isActive)
  }

  return filtered
})

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

// Filter methods
const clearFilters = () => {
  searchQuery.value = ''
  roleFilter.value = ''
  statusFilter.value = ''
}

// Selection methods
const toggleSelectAll = () => {
  if (selectedUsers.value.length === filteredUsers.value.length) {
    selectedUsers.value = []
  } else {
    selectedUsers.value = filteredUsers.value.map(user => user.id)
  }
}

const toggleUserSelection = (userId: number) => {
  const index = selectedUsers.value.indexOf(userId)
  if (index > -1) {
    selectedUsers.value.splice(index, 1)
  } else {
    selectedUsers.value.push(userId)
  }
}

// Modal methods
const openCreateUserModal = () => {
  editingUser.value = null
  userForm.value = {
    username: '',
    email: '',
    phone: '',
    role: '',
    password: '',
    is_active: true,
    school_id: '',
    district: '',
    rd_block: ''
  }
  showUserModal.value = true
}

const openRoleAssignmentModal = (user: User) => {
  roleAssignmentUser.value = user
  newRole.value = user.role
  showRoleModal.value = true
}

const openBulkActionsModal = () => {
  bulkAction.value = ''
  bulkRole.value = ''
  showBulkModal.value = true
}

const openUserDetailsModal = (user: User) => {
  selectedUserDetails.value = user
  showDetailsModal.value = true
}

const closeRoleModal = () => {
  showRoleModal.value = false
  roleAssignmentUser.value = null
  newRole.value = ''
}

const closeBulkModal = () => {
  showBulkModal.value = false
  bulkAction.value = ''
  bulkRole.value = ''
}

const closeDetailsModal = () => {
  showDetailsModal.value = false
  selectedUserDetails.value = null
}

// Role change handler
const onRoleChange = () => {
  // Clear role-specific fields when role changes
  userForm.value.school_id = ''
  userForm.value.district = ''
  userForm.value.rd_block = ''
}

const openEditUserModal = (user: User) => {
  editingUser.value = user
  userForm.value = {
    username: user.username,
    email: user.email,
    phone: user.phone || '',
    role: user.role,
    password: '',
    is_active: user.is_active,
    school_id: user.school_id || '',
    district: user.district || '',
    rd_block: user.rd_block || ''
  }
  showUserModal.value = true
}

// Role assignment methods
const saveRoleChange = async () => {
  if (!roleAssignmentUser.value || !newRole.value) return

  try {
    const response = await fetch(`/api/user-management/${roleAssignmentUser.value.id}/role`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      credentials: 'include',
      body: JSON.stringify({ role: newRole.value })
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to change role')
    }
    
    closeRoleModal()
    loadUsers()
  } catch (error) {
    console.error('Failed to change role:', error)
    alert('Failed to change role: ' + (error as Error).message)
  }
}

// Bulk actions methods
const executeBulkAction = async () => {
  if (!bulkAction.value || selectedUsers.value.length === 0) return

  try {
    const response = await fetch('/api/user-management/bulk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      credentials: 'include',
      body: JSON.stringify({
        user_ids: selectedUsers.value,
        action: bulkAction.value,
        role: bulkRole.value
      })
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to execute bulk action')
    }
    
    closeBulkModal()
    selectedUsers.value = []
    loadUsers()
  } catch (error) {
    console.error('Failed to execute bulk action:', error)
    alert('Failed to execute bulk action: ' + (error as Error).message)
  }
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
    
    // Prepare data for submission
    const submitData = { ...userForm.value }
    
    // Remove empty role-specific fields if not applicable
    if (submitData.role !== 'teacher' && submitData.role !== 'hoi') {
      delete submitData.school_id
    }
    if (submitData.role !== 'deo' && submitData.role !== 'sdeo') {
      delete submitData.district
    }
    if (submitData.role !== 'sdeo') {
      delete submitData.rd_block
    }
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      credentials: 'include',
      body: JSON.stringify(submitData)
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
