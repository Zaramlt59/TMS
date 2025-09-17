<template>
  <div class="card shadow-sm dark:shadow-xl dark:shadow-gray-900/20 border-gray-200 dark:border-gray-600">
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

      <div v-else-if="data.length === 0" class="text-center py-12 bg-gray-50 dark:bg-gray-800/50">
        <svg class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No data</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">No records found.</p>
      </div>

      <!-- Desktop Table View -->
      <div v-else class="hidden md:block overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
          <thead class="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
            <tr>
              <th 
                v-for="column in columns" 
                :key="column.key"
                class="px-6 py-4 text-left text-xs font-bold text-gray-800 dark:text-gray-100 uppercase tracking-wider"
              >
                {{ column.label }}
              </th>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-800 dark:text-gray-100 uppercase tracking-wider w-32">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-600">
            <tr v-for="item in data" :key="item.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 group">
              <td 
                v-for="column in columns" 
                :key="column.key"
                class="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 group-hover:text-gray-700 dark:group-hover:text-gray-50"
              >
                <span v-if="column.formatter && column.html">
                  <span v-html="column.formatter(item[column.key])"></span>
                </span>
                <span v-else-if="column.formatter">
                  {{ column.formatter(item[column.key]) }}
                </span>
                <span v-else>
                  {{ item[column.key] || '-' }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm font-medium">
                <div class="flex items-center space-x-2">
                  <button
                    @click="$emit('edit', item)"
                    class="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-700 dark:text-blue-200 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:shadow-sm dark:hover:shadow-md rounded-md transition-all duration-200 border border-blue-200 dark:border-blue-700"
                  >
                    <svg class="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                    Edit
                  </button>
                  <button
                    @click="$emit('delete', item)"
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

      <!-- Mobile Card View -->
      <div class="md:hidden space-y-4 p-4">
        <div
          v-for="item in data"
          :key="item.id"
          class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-md dark:hover:shadow-xl dark:shadow-gray-900/20 transition-all duration-200 group"
        >
          <div class="p-4">
            <!-- Main content area -->
            <div class="space-y-3">
              <div
                v-for="column in columns"
                :key="column.key"
                class="flex flex-col sm:flex-row sm:justify-between sm:items-start"
              >
                <dt class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 sm:mb-0">
                  {{ column.label }}
                </dt>
                <dd class="text-sm text-gray-900 dark:text-gray-100 break-words">
                  <span v-if="column.formatter && column.html">
                    <span v-html="column.formatter(item[column.key])"></span>
                  </span>
                  <span v-else-if="column.formatter">
                    {{ column.formatter(item[column.key]) }}
                  </span>
                  <span v-else>
                    {{ item[column.key] || '-' }}
                  </span>
                </dd>
              </div>
            </div>
            
            <!-- Actions -->
            <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div class="flex space-x-3">
                <button
                  @click="$emit('edit', item)"
                  class="flex-1 inline-flex justify-center items-center px-3 py-2 text-sm font-medium rounded-md text-blue-700 dark:text-blue-200 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:shadow-sm dark:hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 border border-blue-200 dark:border-blue-700"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                  Edit
                </button>
                <button
                  @click="$emit('delete', item)"
                  class="flex-1 inline-flex justify-center items-center px-3 py-2 text-sm font-medium rounded-md text-red-700 dark:text-red-200 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 hover:shadow-sm dark:hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 border border-red-200 dark:border-red-700"
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
  </div>
</template>

<script setup lang="ts">
interface Column {
  key: string
  label: string
  formatter?: (value: any) => string
  html?: boolean
}

interface Props {
  data: any[]
  columns: Column[]
  loading: boolean
}

defineProps<Props>()

defineEmits<{
  edit: [item: any]
  delete: [item: any]
}>()
</script>
