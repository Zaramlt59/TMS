<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Government Header -->
    <div class="text-white shadow-sm" style="background-color: #220A06;">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between py-2 sm:py-0 sm:h-12">
          <div class="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-0">
            <img src="/src/assests/Inidan-Flag.svg" alt="Indian Flag" class="h-5 sm:h-6 w-auto flex-shrink-0" />
            <span class="text-xs sm:text-sm font-medium truncate">School Education Deptt. GoM</span>
          </div>
          <div class="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm w-full sm:w-auto">
            <span class="cursor-pointer hover:text-amber-200 whitespace-nowrap">Skip to Main Content</span>
            <div class="flex items-center space-x-1">
              <span class="px-1 sm:px-2 py-1 rounded cursor-pointer hover:bg-amber-700 text-xs">A⁻</span>
              <span class="px-1 sm:px-2 py-1 rounded bg-amber-700 text-xs">A</span>
              <span class="px-1 sm:px-2 py-1 rounded cursor-pointer hover:bg-amber-700 text-xs">A⁺</span>
            </div>
            <div class="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer hover:bg-amber-700 rounded flex items-center justify-center flex-shrink-0">
              <div class="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-2 border-white"></div>
            </div>
            <div class="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer hover:bg-amber-700 rounded flex items-center justify-center flex-shrink-0">
              <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="flex items-center space-x-1 cursor-pointer hover:bg-amber-700 rounded px-1 sm:px-2 py-1 flex-shrink-0">
              <span class="text-xs sm:text-sm">English</span>
              <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Navigation -->
    <nav v-if="$route.path !== '/login'" class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <img src="/src/assests/TMS logo 1.svg" alt="TMS Logo" class="h-8 w-auto" />
            </div>
            <div class="hidden md:ml-6 md:flex md:space-x-8">
              <router-link
                to="/"
                class="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                :class="[$route.path === '/' ? 'border-primary-500' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']"
              >
                Dashboard
              </router-link>
              <router-link
                to="/schools"
                class="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                :class="[$route.path.startsWith('/schools') ? 'border-primary-500' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']"
              >
                Schools
              </router-link>
              <router-link
                to="/teachers"
                class="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                :class="[$route.path.startsWith('/teachers') ? 'border-primary-500' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']"
              >
                Teachers
              </router-link>
              <router-link
                to="/settings"
                class="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                :class="[$route.path === '/settings' ? 'border-primary-500' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']"
              >
                Settings
              </router-link>
            </div>
          </div>
          
          <!-- User Menu and Logout -->
          <div class="flex items-center space-x-4">
            <div class="text-sm text-gray-700">
              Welcome, <span class="font-medium">{{ currentUser?.username }}</span>
            </div>
            <button
              @click="handleLogout"
              class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const currentUser = computed(() => auth.currentUser)

const handleLogout = async () => {
  await auth.logout()
  router.push('/login')
}

onMounted(() => {
  // Check if user is authenticated
  if (!auth.isLoggedIn) {
    router.push('/login')
  }
})
</script>
