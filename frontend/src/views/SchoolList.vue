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
          v-if="canExportData"
          @click="exportToExcel"
          class="btn-secondary"
        >
          Export to Excel
        </button>
        <router-link
          v-if="canManageSchools"
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

        <div v-else class="overflow-x-auto -mx-4 sm:mx-0">
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
                    <!-- View button - always visible -->
                    <button
                      @click="viewSchool(school)"
                      class="inline-flex items-center px-3 py-1.5 text-xs font-medium text-green-700 dark:text-green-200 bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50 hover:shadow-sm dark:hover:shadow-md rounded-md transition-all duration-200 border border-green-200 dark:border-green-700"
                    >
                      <svg class="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                      View
                    </button>
                    
                    <!-- Edit button - only for users who can update schools -->
                    <router-link
                      v-if="canManageSchools"
                      :to="`/schools/${school.school_id}/edit`"
                      class="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-700 dark:text-blue-200 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:shadow-sm dark:hover:shadow-md rounded-md transition-all duration-200 border border-blue-200 dark:border-blue-700"
                    >
                      <svg class="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                      Edit
                    </router-link>
                    
                    <!-- Delete button - only for users who can delete schools -->
                    <button
                      v-if="canManageSchools"
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
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <!-- View button - always visible -->
                <button
                  @click="viewSchool(school)"
                  class="inline-flex justify-center items-center px-3 py-2 text-sm font-medium rounded-md text-green-700 dark:text-green-200 bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50 hover:shadow-sm dark:hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 border border-green-200 dark:border-green-700"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                  View
                </button>
                
                <!-- Edit button - only for users who can update schools -->
                <router-link
                  v-if="canManageSchools"
                  :to="`/schools/${school.school_id}/edit`"
                  class="inline-flex justify-center items-center px-3 py-2 text-sm font-medium rounded-md text-blue-700 dark:text-blue-200 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:shadow-sm dark:hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 border border-blue-200 dark:border-blue-700"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                  Edit
                </router-link>
                
                <!-- Delete button - only for users who can delete schools -->
                <button
                  v-if="canManageSchools"
                  @click="deleteSchool(school.school_id)"
                  class="inline-flex justify-center items-center px-3 py-2 text-sm font-medium rounded-md text-red-700 dark:text-red-200 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 hover:shadow-sm dark:hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 border border-red-200 dark:border-red-700"
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

    <!-- School Details Modal -->
    <div v-if="showSchoolModal" class="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-80" @click="closeSchoolModal"></div>
        <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl dark:shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                  School Details
                </h3>
                <div v-if="selectedSchool" class="mt-4 space-y-6">
                  <!-- Basic School Information -->
                  <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <h4 class="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center">
                      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                      </svg>
                      Basic Information
                    </h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label class="text-sm font-medium text-blue-700 dark:text-blue-300">School Name</label>
                        <p class="mt-1 text-sm font-semibold text-blue-900 dark:text-blue-100">{{ selectedSchool.school_name }}</p>
                      </div>
                      <div>
                        <label class="text-sm font-medium text-blue-700 dark:text-blue-300">School ID</label>
                        <p class="mt-1 text-sm font-mono text-blue-900 dark:text-blue-100 bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded">{{ selectedSchool.school_id }}</p>
                      </div>
                      <div>
                        <label class="text-sm font-medium text-blue-700 dark:text-blue-300">School Type</label>
                        <p class="mt-1 text-sm text-blue-900 dark:text-blue-100">
                          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200">
                            {{ formatDisplayText(selectedSchool.school_type) }}
                          </span>
                        </p>
                      </div>
                      <div>
                        <label class="text-sm font-medium text-blue-700 dark:text-blue-300">School Level</label>
                        <p class="mt-1 text-sm text-blue-900 dark:text-blue-100">{{ selectedSchool.school_level || 'Not specified' }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Location Information -->
                  <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                    <h4 class="text-lg font-semibold text-green-900 dark:text-green-100 mb-4 flex items-center">
                      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      Location Details
                    </h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label class="text-sm font-medium text-green-700 dark:text-green-300">District</label>
                        <p class="mt-1 text-sm text-green-900 dark:text-green-100">{{ selectedSchool.district || 'Not specified' }}</p>
                      </div>
                      <div>
                        <label class="text-sm font-medium text-green-700 dark:text-green-300">Block Office</label>
                        <p class="mt-1 text-sm text-green-900 dark:text-green-100">{{ selectedSchool.block_office || 'Not specified' }}</p>
                      </div>
                      <div>
                        <label class="text-sm font-medium text-green-700 dark:text-green-300">Village/Habitation</label>
                        <p class="mt-1 text-sm text-green-900 dark:text-green-100">{{ selectedSchool.habitation || 'Not specified' }}</p>
                      </div>
                      <div>
                        <label class="text-sm font-medium text-green-700 dark:text-green-300">Pin Code</label>
                        <p class="mt-1 text-sm text-green-900 dark:text-green-100">{{ selectedSchool.pincode || 'Not specified' }}</p>
                      </div>
                      <div>
                        <label class="text-sm font-medium text-green-700 dark:text-green-300">RD Block</label>
                        <p class="mt-1 text-sm text-green-900 dark:text-green-100">{{ selectedSchool.rd_block || 'Not specified' }}</p>
                      </div>
                      <div>
                        <label class="text-sm font-medium text-green-700 dark:text-green-300">Habitation Type</label>
                        <p class="mt-1 text-sm text-green-900 dark:text-green-100">
                          <span v-if="selectedSchool.habitation_class" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200">
                            {{ formatDisplayText(selectedSchool.habitation_class) }}
                          </span>
                          <span v-else class="text-gray-500">Not specified</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Educational Details -->
                  <div class="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                    <h4 class="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-4 flex items-center">
                      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                      </svg>
                      Educational Information
                    </h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label class="text-sm font-medium text-purple-700 dark:text-purple-300">Management Type</label>
                        <p class="mt-1 text-sm text-purple-900 dark:text-purple-100">
                          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200">
                            {{ formatDisplayText(selectedSchool.management) || 'Not specified' }}
                          </span>
                        </p>
                      </div>
                      <div>
                        <label class="text-sm font-medium text-purple-700 dark:text-purple-300">Medium of Instruction</label>
                        <p class="mt-1 text-sm text-purple-900 dark:text-purple-100">
                          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200">
                            {{ formatDisplayText(selectedSchool.medium) || 'Not specified' }}
                          </span>
                        </p>
                      </div>
                      <div v-if="selectedSchool.habitation_category" class="md:col-span-2">
                        <label class="text-sm font-medium text-purple-700 dark:text-purple-300">Habitation Category</label>
                        <p class="mt-1 text-sm text-purple-900 dark:text-purple-100">
                          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200">
                            {{ formatDisplayText(selectedSchool.habitation_category) }}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Contact Information -->
                  <div class="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                    <h4 class="text-lg font-semibold text-orange-900 dark:text-orange-100 mb-4 flex items-center">
                      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                      </svg>
                      Contact Information
                    </h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label class="text-sm font-medium text-orange-700 dark:text-orange-300">Complete Address</label>
                        <p class="mt-1 text-sm text-orange-900 dark:text-orange-100">
                          {{ getCompleteAddress(selectedSchool) }}
                        </p>
                      </div>
                      <div>
                        <label class="text-sm font-medium text-orange-700 dark:text-orange-300">Phone Number</label>
                        <p class="mt-1 text-sm text-orange-900 dark:text-orange-100">
                          <span v-if="selectedSchool.school_phone" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-800 text-orange-800 dark:text-orange-200">
                            {{ selectedSchool.school_phone }}
                          </span>
                          <span v-else class="text-gray-500">Not specified</span>
                        </p>
                      </div>
                      <div>
                        <label class="text-sm font-medium text-orange-700 dark:text-orange-300">Email Address</label>
                        <p class="mt-1 text-sm text-orange-900 dark:text-orange-100">
                          <span v-if="selectedSchool.school_email" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-800 text-orange-800 dark:text-orange-200">
                            {{ selectedSchool.school_email }}
                          </span>
                          <span v-else class="text-gray-500">Not specified</span>
                        </p>
                      </div>
                      <div>
                        <label class="text-sm font-medium text-orange-700 dark:text-orange-300">Pin Code</label>
                        <p class="mt-1 text-sm text-orange-900 dark:text-orange-100">
                          <span v-if="selectedSchool.pincode" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-800 text-orange-800 dark:text-orange-200">
                            {{ selectedSchool.pincode }}
                          </span>
                          <span v-else class="text-gray-500">Not specified</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button @click="closeSchoolModal" class="btn-secondary">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { schoolsApi, cascadeApi } from '../services/api'
import type { School, SchoolListResponse } from '../types'
import * as XLSX from 'xlsx'
import { useRoleGuard } from '../composables/useRoleGuard'

// Role guard
const { canManageSchools, canExportData } = useRoleGuard()

// Helper function to format underscores to spaces
const formatDisplayText = (text: string): string => {
  if (!text) return ''
  return text.replace(/_/g, ' ')
}

const schools = ref<School[]>([])
const loading = ref(false)
const searchQuery = ref('')
const searchTimeout = ref<NodeJS.Timeout>()
const showSchoolModal = ref(false)
const selectedSchool = ref<School | null>(null)

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



const viewSchool = (school: School) => {
  selectedSchool.value = school
  showSchoolModal.value = true
}

const closeSchoolModal = () => {
  showSchoolModal.value = false
  selectedSchool.value = null
}

const getCompleteAddress = (school: School) => {
  const addressParts: string[] = []
  
  if (school.habitation) addressParts.push(school.habitation)
  if (school.block_office) addressParts.push(school.block_office)
  if (school.district) addressParts.push(school.district)
  if (school.pincode) addressParts.push(school.pincode)
  
  return addressParts.length > 0 ? addressParts.join(', ') : 'Not specified'
}

const deleteSchool = async (schoolId: string) => {
  try {
    console.log('🔍 Frontend deleteSchool - schoolId:', schoolId)
    
    // First, check cascade information
    const cascadeResponse = await cascadeApi.getSchoolCascadeInfo(schoolId)
    const cascadeInfo = cascadeResponse.data.data?.cascadeInfo
    
    if (!cascadeInfo) {
      alert('Failed to get cascade information. Please try again.')
      return
    }
    
    const totalAffected = cascadeInfo.teachers + cascadeInfo.medicalRecords + 
                         cascadeInfo.attachments + cascadeInfo.deputations + 
                         cascadeInfo.postingHistories

    let confirmMessage = 'Are you sure you want to delete this school?'
    if (totalAffected > 0) {
      confirmMessage += `\n\nThis will also delete:\n`
      if (cascadeInfo.teachers > 0) confirmMessage += `• ${cascadeInfo.teachers} teacher(s)\n`
      if (cascadeInfo.medicalRecords > 0) confirmMessage += `• ${cascadeInfo.medicalRecords} medical record(s)\n`
      if (cascadeInfo.attachments > 0) confirmMessage += `• ${cascadeInfo.attachments} attachment(s)\n`
      if (cascadeInfo.deputations > 0) confirmMessage += `• ${cascadeInfo.deputations} deputation(s)\n`
      if (cascadeInfo.postingHistories > 0) confirmMessage += `• ${cascadeInfo.postingHistories} posting histor(ies)\n`
      confirmMessage += `\nThis action cannot be undone.`
    } else {
      confirmMessage += ' This action cannot be undone.'
    }

    if (!confirm(confirmMessage)) {
      return
    }
    
    // Use cascade API for safe deletion
    const response = await cascadeApi.safeDeleteSchool(schoolId, true)
    if (response.data.success) {
      await loadSchools(pagination.value.page)
      alert('School deleted successfully!')
    } else {
      alert(`Failed to delete school: ${response.data.message}`)
    }
  } catch (error: any) {
    console.error('Failed to delete school:', error)
    if (error.response?.data?.message) {
      alert(`Failed to delete school: ${error.response.data.message}`)
    } else {
      alert('Failed to delete school. Please try again.')
    }
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
