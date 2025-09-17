<template>
  <div class="space-y-6">
    <!-- RD Block Overview -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Sub-Division Overview</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="text-center">
          <div class="text-3xl font-bold text-blue-600 dark:text-blue-400">{{ data?.schoolsInBlock?.length || 0 }}</div>
          <div class="text-sm text-gray-500 dark:text-gray-400">Schools in Block</div>
        </div>
        <div class="text-center">
          <div class="text-3xl font-bold text-green-600 dark:text-green-400">{{ getTotalTeachers() }}</div>
          <div class="text-sm text-gray-500 dark:text-gray-400">Total Teachers</div>
        </div>
        <div class="text-center">
          <div class="text-3xl font-bold text-purple-600 dark:text-purple-400">{{ data?.recentActivity || 0 }}</div>
          <div class="text-sm text-gray-500 dark:text-gray-400">Recent Activities</div>
        </div>
      </div>
    </div>

    <!-- Schools in Block -->
    <div v-if="data?.schoolsInBlock" class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Schools in Your Sub-Division</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">School Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Management</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">District</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="school in data.schoolsInBlock" :key="school.school_id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ school.school_name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ school.school_type }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ school.management }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ school.district }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Teacher Statistics -->
    <div v-if="data?.teachersInBlock" class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Teacher Statistics</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Gender Distribution -->
        <div>
          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Gender Distribution</h3>
          <div class="space-y-2">
            <div v-for="stat in data.teachersInBlock" :key="stat.gender" class="flex justify-between items-center">
              <span class="text-sm text-gray-900 dark:text-white">{{ stat.gender }}</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ stat._count.id }}</span>
            </div>
          </div>
        </div>

        <!-- Social Group Distribution -->
        <div>
          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Social Group Distribution</h3>
          <div class="space-y-2">
            <div v-for="stat in data.teachersInBlock" :key="stat.social_group" class="flex justify-between items-center">
              <span class="text-sm text-gray-900 dark:text-white">{{ stat.social_group }}</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ stat._count.id }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- District Distribution -->
    <div v-if="data?.districtDistribution" class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">District Distribution</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="district in data.districtDistribution"
          :key="district.district"
          class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
        >
          <span class="text-sm text-gray-900 dark:text-white">{{ district.district }}</span>
          <span class="text-sm font-medium text-gray-900 dark:text-white">{{ district._count.id }} schools</span>
        </div>
      </div>
    </div>

    <!-- Management Distribution -->
    <div v-if="data?.managementDistribution" class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Management Type Distribution</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="management in data.managementDistribution"
          :key="management.management"
          class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
        >
          <span class="text-sm text-gray-900 dark:text-white">{{ management.management }}</span>
          <span class="text-sm font-medium text-gray-900 dark:text-white">{{ management._count.id }} schools</span>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <router-link
          to="/schools"
          class="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-md flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
            </div>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-900 dark:text-white">Manage Schools</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">View and manage schools</p>
          </div>
        </router-link>

        <router-link
          to="/teachers"
          class="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-md flex items-center justify-center">
              <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
              </svg>
            </div>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-900 dark:text-white">Manage Teachers</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">View and manage teachers</p>
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
            <p class="text-sm text-gray-500 dark:text-gray-400">View medical records</p>
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

const getTotalTeachers = () => {
  // This would be calculated from the teachersInBlock data
  // For now, return a placeholder
  return 0
}
</script>
