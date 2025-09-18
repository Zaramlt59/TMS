<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="sm:flex sm:items-center sm:justify-between">
      <div class="sm:flex-auto">
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-100">Audit Logs</h1>
        <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">
          Monitor system activity and security events
        </p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none flex space-x-3">
        <button @click="exportLogs" class="btn-secondary">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          Export CSV
        </button>
        <button @click="refreshLogs" class="btn-primary">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          Refresh
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="mt-6 bg-white dark:bg-gray-800 shadow rounded-lg p-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search</label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Search logs..."
            class="form-input"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Action</label>
          <select v-model="filters.action" class="form-select">
            <option value="">All Actions</option>
            <option v-for="action in actionOptions" :key="action.value" :value="action.value">
              {{ action.label }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Resource Type</label>
          <select v-model="filters.resourceType" class="form-select">
            <option value="">All Resources</option>
            <option v-for="resource in resourceOptions" :key="resource.value" :value="resource.value">
              {{ resource.label }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
          <select v-model="filters.success" class="form-select">
            <option value="">All Status</option>
            <option value="true">Success</option>
            <option value="false">Failed</option>
          </select>
        </div>
        <div class="flex items-end">
          <button @click="clearFilters" class="btn-secondary w-full">
            Clear Filters
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Actions</dt>
                <dd class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ stats.totalActions || 0 }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Successful</dt>
                <dd class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ stats.successfulActions || 0 }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Failed</dt>
                <dd class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ stats.failedActions || 0 }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Security Alerts</dt>
                <dd class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ stats.securityAlerts || 0 }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Audit Logs Table -->
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

        <div v-else-if="auditLogs.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No audit logs</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">No audit logs found matching your criteria.</p>
        </div>

        <!-- Desktop Table View -->
        <div v-else class="hidden md:block overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Resource</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">IP Address</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Timestamp</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-32">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-600">
              <tr v-for="log in auditLogs" :key="log.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-8 w-8">
                      <div class="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                        <span class="text-xs font-medium text-gray-700 dark:text-gray-300">
                          {{ log.users?.username?.charAt(0).toUpperCase() || '?' }}
                        </span>
                      </div>
                    </div>
                    <div class="ml-3">
                      <div class="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {{ log.users?.username || 'Unknown' }}
                      </div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">
                        {{ log.users?.role || 'Unknown Role' }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        :class="getActionBadgeClass(log.action)">
                    {{ formatAction(log.action) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  <div>{{ formatResourceType(log.resource_type) }}</div>
                  <div v-if="log.resource_id" class="text-xs text-gray-500 dark:text-gray-400">
ID: {{ log.resource_id }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        :class="log.success ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'">
                    {{ log.success ? 'Success' : 'Failed' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {{ log.ip_address || 'Unknown' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {{ formatDate(log.created_at) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    @click="viewLogDetails(log)"
                    class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Card View -->
        <div class="md:hidden space-y-4 p-4">
          <div
            v-for="log in auditLogs"
            :key="log.id"
            class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-md dark:hover:shadow-xl dark:shadow-gray-900/20 transition-all duration-200"
          >
            <div class="p-4">
              <!-- Header with user info and status -->
              <div class="flex items-start justify-between mb-4">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-8 w-8">
                    <div class="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                      <span class="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {{ log.users?.username?.charAt(0).toUpperCase() || '?' }}
                      </span>
                    </div>
                  </div>
                  <div class="ml-3">
                    <div class="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {{ log.users?.username || 'Unknown' }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      {{ log.users?.role || 'Unknown Role' }}
                    </div>
                  </div>
                </div>
                <div class="flex flex-col items-end space-y-2">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        :class="log.success ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'">
                    {{ log.success ? 'Success' : 'Failed' }}
                  </span>
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        :class="getActionBadgeClass(log.action)">
                    {{ formatAction(log.action) }}
                  </span>
                </div>
              </div>

              <!-- Log details -->
              <div class="space-y-3">
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                  <dt class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 sm:mb-0">
                    Resource
                  </dt>
                  <dd class="text-sm text-gray-900 dark:text-gray-100">
                    <div>{{ formatResourceType(log.resource_type) }}</div>
                    <div v-if="log.resource_id" class="text-xs text-gray-500 dark:text-gray-400">
                      ID: {{ log.resource_id }}
                    </div>
                  </dd>
                </div>

                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                  <dt class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 sm:mb-0">
                    IP Address
                  </dt>
                  <dd class="text-sm text-gray-500 dark:text-gray-400">
                    {{ log.ip_address || 'Unknown' }}
                  </dd>
                </div>

                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                  <dt class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 sm:mb-0">
                    Timestamp
                  </dt>
                  <dd class="text-sm text-gray-500 dark:text-gray-400">
                    {{ formatDate(log.created_at) }}
                  </dd>
                </div>
              </div>
              
              <!-- Actions -->
              <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  @click="viewLogDetails(log)"
                  class="w-full inline-flex justify-center items-center px-3 py-2 text-sm font-medium rounded-md text-blue-700 dark:text-blue-200 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:shadow-sm dark:hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 border border-blue-200 dark:border-blue-700"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="pagination.totalPages > 1" class="mt-6 flex items-center justify-between">
          <div class="flex-1 flex justify-between sm:hidden">
            <button
              @click="changePage(pagination.page - 1)"
              :disabled="pagination.page <= 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              @click="changePage(pagination.page + 1)"
              :disabled="pagination.page >= pagination.totalPages"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700 dark:text-gray-300">
                Showing
                <span class="font-medium">{{ ((pagination.page - 1) * pagination.limit) + 1 }}</span>
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
                  :disabled="pagination.page <= 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  v-for="page in visiblePages"
                  :key="page"
                  @click="changePage(page)"
                  :class="page === pagination.page ? 'z-10 bg-primary-50 dark:bg-primary-900/20 border-primary-500 dark:border-primary-400 text-primary-600 dark:text-primary-400' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'"
                  class="relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                >
                  {{ page }}
                </button>
                <button
                  @click="changePage(pagination.page + 1)"
                  :disabled="pagination.page >= pagination.totalPages"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Log Details Modal -->
    <div v-if="showDetailsModal" class="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-80" @click="closeDetailsModal"></div>
        <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl dark:shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
              Audit Log Details
            </h3>
            <div v-if="selectedLog" class="mt-4 space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="text-sm font-medium text-gray-500 dark:text-gray-400">User</label>
                  <p class="text-sm text-gray-900 dark:text-gray-100">{{ selectedLog.users?.username || 'Unknown' }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Action</label>
                  <p class="text-sm text-gray-900 dark:text-gray-100">{{ formatAction(selectedLog.action) }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Resource Type</label>
                  <p class="text-sm text-gray-900 dark:text-gray-100">{{ formatResourceType(selectedLog.resource_type) }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Resource ID</label>
                  <p class="text-sm text-gray-900 dark:text-gray-100">{{ selectedLog.resource_id || 'N/A' }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
                  <p class="text-sm">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          :class="selectedLog.success ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'">
                      {{ selectedLog.success ? 'Success' : 'Failed' }}
                    </span>
                  </p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500 dark:text-gray-400">IP Address</label>
                  <p class="text-sm text-gray-900 dark:text-gray-100">{{ selectedLog.ip_address || 'Unknown' }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500 dark:text-gray-400">User Agent</label>
                  <p class="text-sm text-gray-900 dark:text-gray-100 break-all">{{ selectedLog.user_agent || 'Unknown' }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Timestamp</label>
                  <p class="text-sm text-gray-900 dark:text-gray-100">{{ formatDate(selectedLog.created_at) }}</p>
                </div>
              </div>
              
              <div v-if="selectedLog.details">
                <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Details</label>
                <pre class="mt-1 text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 p-3 rounded-md overflow-auto">{{ JSON.stringify(JSON.parse(selectedLog.details), null, 2) }}</pre>
              </div>
              
              <div v-if="selectedLog.error_message">
                <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Error Message</label>
                <p class="text-sm text-red-600 dark:text-red-400">{{ selectedLog.error_message }}</p>
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
import { ref, onMounted, computed, watch } from 'vue'
import { useRoleGuard } from '../composables/useRoleGuard'

// Role guard
const { isSuperAdmin } = useRoleGuard()

// Redirect if not super admin
if (!isSuperAdmin.value) {
  // In a real app, you'd redirect to unauthorized page
  console.warn('Access denied: Super admin role required')
}

// Types
interface AuditLog {
  id: number
  action: string
  resource_type: string
  resource_id?: string
  details?: string
  ip_address?: string
  user_agent?: string
  success: boolean
  error_message?: string
  created_at: string
  users?: {
    id: number
    username: string
    email: string
    role: string
  }
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

interface Stats {
  totalActions: number
  successfulActions: number
  failedActions: number
  securityAlerts: number
}

// State
const auditLogs = ref<AuditLog[]>([])
const loading = ref(false)
const showDetailsModal = ref(false)
const selectedLog = ref<AuditLog | null>(null)
const stats = ref<Stats>({
  totalActions: 0,
  successfulActions: 0,
  failedActions: 0,
  securityAlerts: 0
})

const pagination = ref<Pagination>({
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0
})

const filters = ref({
  search: '',
  action: '',
  resourceType: '',
  success: ''
})

// Options for filters
const actionOptions = [
  { value: 'login', label: 'Login' },
  { value: 'logout', label: 'Logout' },
  { value: 'login_failed', label: 'Login Failed' },
  { value: 'user_create', label: 'User Create' },
  { value: 'user_update', label: 'User Update' },
  { value: 'user_delete', label: 'User Delete' },
  { value: 'role_change', label: 'Role Change' },
  { value: 'view', label: 'View' },
  { value: 'create', label: 'Create' },
  { value: 'update', label: 'Update' },
  { value: 'delete', label: 'Delete' },
  { value: 'export', label: 'Export' },
  { value: 'unauthorized_access', label: 'Unauthorized Access' },
  { value: 'permission_denied', label: 'Permission Denied' }
]

const resourceOptions = [
  { value: 'auth', label: 'Authentication' },
  { value: 'user', label: 'User' },
  { value: 'school', label: 'School' },
  { value: 'teacher', label: 'Teacher' },
  { value: 'medical_record', label: 'Medical Record' },
  { value: 'report', label: 'Report' }
]

// Computed
const visiblePages = computed(() => {
  const current = pagination.value.page
  const total = pagination.value.totalPages
  const delta = 2
  
  let start = Math.max(1, current - delta)
  let end = Math.min(total, current + delta)
  
  if (end - start < delta * 2) {
    if (start === 1) {
      end = Math.min(total, start + delta * 2)
    } else {
      start = Math.max(1, end - delta * 2)
    }
  }
  
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

// Methods
const loadAuditLogs = async () => {
  loading.value = true
  try {
    const params = new URLSearchParams({
      page: pagination.value.page.toString(),
      limit: pagination.value.limit.toString()
    })

    if (filters.value.action) params.append('action', filters.value.action)
    if (filters.value.resourceType) params.append('resourceType', filters.value.resourceType)
    if (filters.value.success) params.append('success', filters.value.success)

    const response = await fetch(`/api/audit/logs?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      credentials: 'include'
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch audit logs')
    }
    
    const data = await response.json()
    auditLogs.value = data.data || []
    pagination.value = data.pagination || pagination.value
  } catch (error) {
    console.error('Failed to load audit logs:', error)
  } finally {
    loading.value = false
  }
}

const loadStats = async () => {
  try {
    const response = await fetch('/api/audit/stats', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      credentials: 'include'
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch audit stats')
    }
    
    const data = await response.json()
    stats.value = data.data || stats.value
  } catch (error) {
    console.error('Failed to load audit stats:', error)
  }
}

const refreshLogs = () => {
  loadAuditLogs()
  loadStats()
}

const exportLogs = async () => {
  try {
    const params = new URLSearchParams()
    if (filters.value.action) params.append('action', filters.value.action)
    if (filters.value.resourceType) params.append('resourceType', filters.value.resourceType)
    if (filters.value.success) params.append('success', filters.value.success)

    const response = await fetch(`/api/audit/export?${params}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      credentials: 'include'
    })
    
    if (!response.ok) {
      throw new Error('Failed to export audit logs')
    }
    
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `audit_logs_${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  } catch (error) {
    console.error('Failed to export audit logs:', error)
    alert('Failed to export audit logs: ' + (error as Error).message)
  }
}

const clearFilters = () => {
  filters.value = {
    search: '',
    action: '',
    resourceType: '',
    success: ''
  }
  pagination.value.page = 1
  loadAuditLogs()
}

const changePage = (page: number) => {
  if (page >= 1 && page <= pagination.value.totalPages) {
    pagination.value.page = page
    loadAuditLogs()
  }
}

const viewLogDetails = (log: AuditLog) => {
  selectedLog.value = log
  showDetailsModal.value = true
}

const closeDetailsModal = () => {
  showDetailsModal.value = false
  selectedLog.value = null
}

const formatAction = (action: string): string => {
  return action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

const formatResourceType = (resourceType: string): string => {
  return resourceType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

const getActionBadgeClass = (action: string): string => {
  if (action.includes('login') || action.includes('logout')) {
    return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
  } else if (action.includes('create') || action.includes('update')) {
    return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
  } else if (action.includes('delete')) {
    return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
  } else if (action.includes('unauthorized') || action.includes('permission') || action.includes('failed')) {
    return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200'
  } else {
    return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
  }
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString()
}

// Watch for filter changes
watch(filters, () => {
  pagination.value.page = 1
  loadAuditLogs()
}, { deep: true })

// Lifecycle
onMounted(() => {
  loadAuditLogs()
  loadStats()
})
</script>
