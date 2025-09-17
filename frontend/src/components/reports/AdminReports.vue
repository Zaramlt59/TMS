<template>
  <div class="space-y-6">
    <!-- System Overview -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">System Overview</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="text-center">
          <div class="text-3xl font-bold text-blue-600 dark:text-blue-400">{{ data?.totalSchools || 0 }}</div>
          <div class="text-sm text-gray-500 dark:text-gray-400">Total Schools</div>
        </div>
        <div class="text-center">
          <div class="text-3xl font-bold text-green-600 dark:text-green-400">{{ data?.totalTeachers || 0 }}</div>
          <div class="text-sm text-gray-500 dark:text-gray-400">Total Teachers</div>
        </div>
        <div class="text-center">
          <div class="text-3xl font-bold text-purple-600 dark:text-purple-400">{{ data?.totalDistricts || 0 }}</div>
          <div class="text-sm text-gray-500 dark:text-gray-400">Districts</div>
        </div>
        <div class="text-center">
          <div class="text-3xl font-bold text-orange-600 dark:text-orange-400">{{ data?.totalRdBlocks || 0 }}</div>
          <div class="text-sm text-gray-500 dark:text-gray-400">RD Blocks</div>
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

    <!-- Recent Activity -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="text-center">
          <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ data?.recentActivity || 0 }}</div>
          <div class="text-sm text-gray-500 dark:text-gray-400">New Teachers (30 days)</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-green-600 dark:text-green-400">{{ data?.totalSchools || 0 }}</div>
          <div class="text-sm text-gray-500 dark:text-gray-400">Active Schools</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">{{ data?.totalTeachers || 0 }}</div>
          <div class="text-sm text-gray-500 dark:text-gray-400">Active Teachers</div>
        </div>
      </div>
    </div>

    <!-- System Health -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">System Health</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="flex items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-md flex items-center justify-center">
              <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-green-800 dark:text-green-200">System Status</p>
            <p class="text-sm text-green-600 dark:text-green-400">Operational</p>
          </div>
        </div>

        <div class="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-md flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-blue-800 dark:text-blue-200">Uptime</p>
            <p class="text-sm text-blue-600 dark:text-blue-400">99.9%</p>
          </div>
        </div>

        <div class="flex items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-md flex items-center justify-center">
              <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-purple-800 dark:text-purple-200">Performance</p>
            <p class="text-sm text-purple-600 dark:text-purple-400">Excellent</p>
          </div>
        </div>

        <div class="flex items-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-md flex items-center justify-center">
              <svg class="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-orange-800 dark:text-orange-200">Alerts</p>
            <p class="text-sm text-orange-600 dark:text-orange-400">0 Active</p>
          </div>
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
            <p class="text-sm text-gray-500 dark:text-gray-400">View and manage all schools</p>
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
            <p class="text-sm text-gray-500 dark:text-gray-400">View and manage all teachers</p>
          </div>
        </router-link>

        <router-link
          to="/user-management"
          class="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-md flex items-center justify-center">
              <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
              </svg>
            </div>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-900 dark:text-white">User Management</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">Manage users and roles</p>
          </div>
        </router-link>

        <router-link
          to="/reports"
          class="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-md flex items-center justify-center">
              <svg class="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-900 dark:text-white">Generate Reports</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">Create comprehensive reports</p>
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
</script>
