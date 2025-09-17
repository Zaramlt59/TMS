<template>
  <div class="space-y-6">
    <!-- School Information Card -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">School Information</h2>
      <div v-if="data?.schoolInfo" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label class="text-sm font-medium text-gray-500 dark:text-gray-400">School Name</label>
          <p class="text-sm text-gray-900 dark:text-white">{{ data.schoolInfo.school_name }}</p>
        </div>
        <div>
          <label class="text-sm font-medium text-gray-500 dark:text-gray-400">School Type</label>
          <p class="text-sm text-gray-900 dark:text-white">{{ data.schoolInfo.school_type }}</p>
        </div>
        <div>
          <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Management</label>
          <p class="text-sm text-gray-900 dark:text-white">{{ data.schoolInfo.management }}</p>
        </div>
        <div>
          <label class="text-sm font-medium text-gray-500 dark:text-gray-400">District</label>
          <p class="text-sm text-gray-900 dark:text-white">{{ data.schoolInfo.district }}</p>
        </div>
        <div>
          <label class="text-sm font-medium text-gray-500 dark:text-gray-400">RD Block</label>
          <p class="text-sm text-gray-900 dark:text-white">{{ data.schoolInfo.rd_block }}</p>
        </div>
        <div>
          <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Established</label>
          <p class="text-sm text-gray-900 dark:text-white">{{ formatDate(data.schoolInfo.created_at) }}</p>
        </div>
      </div>
    </div>

    <!-- Teacher Statistics -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Teacher Statistics</h2>
      <div v-if="data?.teacherStats" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Gender Distribution -->
        <div>
          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Gender Distribution</h3>
          <div class="space-y-2">
            <div v-for="stat in data.teacherStats" :key="stat.gender" class="flex justify-between items-center">
              <span class="text-sm text-gray-900 dark:text-white">{{ stat.gender }}</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ stat._count.id }}</span>
            </div>
          </div>
        </div>

        <!-- Social Group Distribution -->
        <div>
          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Social Group Distribution</h3>
          <div class="space-y-2">
            <div v-for="stat in data.teacherStats" :key="stat.social_group" class="flex justify-between items-center">
              <span class="text-sm text-gray-900 dark:text-white">{{ stat.social_group }}</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ stat._count.id }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Subject Distribution -->
    <div v-if="data?.subjectDistribution" class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Subject Distribution</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="(count, subject) in data.subjectDistribution"
          :key="subject"
          class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
        >
          <span class="text-sm text-gray-900 dark:text-white">{{ subject }}</span>
          <span class="text-sm font-medium text-gray-900 dark:text-white">{{ count }}</span>
        </div>
      </div>
    </div>

    <!-- Medical Records Summary -->
    <div v-if="data?.medicalRecords" class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Medical Records Summary</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="record in data.medicalRecords"
          :key="record.severity"
          class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
        >
          <span class="text-sm text-gray-900 dark:text-white">{{ record.severity }}</span>
          <span class="text-sm font-medium text-gray-900 dark:text-white">{{ record._count.id }}</span>
        </div>
      </div>
    </div>

    <!-- Performance Metrics -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance Metrics</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="text-center">
          <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ data?.performanceMetrics || 0 }}</div>
          <div class="text-sm text-gray-500 dark:text-gray-400">Recent Activities (90 days)</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-green-600 dark:text-green-400">{{ data?.teacherStats?.length || 0 }}</div>
          <div class="text-sm text-gray-500 dark:text-gray-400">Total Teachers</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">{{ data?.medicalRecords?.length || 0 }}</div>
          <div class="text-sm text-gray-500 dark:text-gray-400">Health Records</div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <router-link
          to="/teachers"
          class="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-md flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
              </svg>
            </div>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-900 dark:text-white">Manage Teachers</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">Add, edit, or remove teachers</p>
          </div>
        </router-link>

        <router-link
          to="/medical-records"
          class="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-md flex items-center justify-center">
              <svg class="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-900 dark:text-white">Health Records</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">Manage medical records</p>
          </div>
        </router-link>

        <router-link
          to="/schools"
          class="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-md flex items-center justify-center">
              <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
            </div>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-900 dark:text-white">School Details</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">Update school information</p>
          </div>
        </router-link>

        <router-link
          to="/reports"
          class="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-md flex items-center justify-center">
              <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-900 dark:text-white">Generate Reports</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">Create detailed reports</p>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  data: any
}>()

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString()
}
</script>
