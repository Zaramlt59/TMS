<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Government Header -->
    <div class="text-white shadow-sm" style="background-color: #220A06;">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between py-1 sm:py-0 sm:h-12">
          <div class="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-0">
            <img src="/src/assests/Inidan-Flag.svg" alt="Indian Flag" class="h-5 sm:h-6 w-auto flex-shrink-0" />
            <span class="text-xs sm:text-sm font-medium truncate">School Education Deptt. GoM</span>
          </div>
          <div class="flex flex-wrap items-center gap-1 sm:gap-4 text-[10px] sm:text-sm leading-none w-full sm:w-auto">
            <span class="cursor-pointer hover:text-amber-200 truncate max-w-[140px] sm:max-w-none">Skip to Main Content</span>
            <div class="flex items-center space-x-1 leading-none">
              <span class="px-0.5 sm:px-2 py-0.5 rounded cursor-pointer hover:bg-amber-700 text-xs">A⁻</span>
              <span class="px-0.5 sm:px-2 py-0.5 rounded bg-amber-700 text-xs">A</span>
              <span class="px-0.5 sm:px-2 py-0.5 rounded cursor-pointer hover:bg-amber-700 text-xs">A⁺</span>
            </div>
            <div class="w-4 h-4 sm:w-6 sm:h-6 cursor-pointer hover:bg-amber-700 rounded flex items-center justify-center flex-shrink-0">
              <div class="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-2 border-white"></div>
            </div>
            <div class="w-4 h-4 sm:w-6 sm:h-6 cursor-pointer hover:bg-amber-700 rounded flex items-center justify-center flex-shrink-0">
              <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="flex items-center space-x-1 cursor-pointer hover:bg-amber-700 rounded px-1 sm:px-2 py-0.5 flex-shrink-0 leading-none">
              <span class="text-xs sm:text-sm leading-none">English</span>
              <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Navigation -->
    <nav v-if="$route.path !== '/login'" class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <img src="/src/assests/TMS logo 1.svg" alt="TMS Logo" class="h-8 w-auto" />
            </div>
            <div class="hidden md:ml-6 md:flex md:space-x-8">
              <router-link
                to="/"
                class="text-gray-900 dark:text-gray-100 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                :class="[$route.path === '/' ? 'border-primary-500' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600']"
              >
                Dashboard
              </router-link>
              <router-link
                to="/schools"
                class="text-gray-900 dark:text-gray-100 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                :class="[$route.path.startsWith('/schools') ? 'border-primary-500' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600']"
              >
                Schools
              </router-link>
              <router-link
                to="/teachers"
                class="text-gray-900 dark:text-gray-100 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                :class="[$route.path.startsWith('/teachers') ? 'border-primary-500' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600']"
              >
                Teachers
              </router-link>
              <router-link
                v-if="showUserManagement"
                to="/users"
                class="text-gray-900 dark:text-gray-100 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                :class="[$route.path === '/users' ? 'border-primary-500' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600']"
              >
                Users
              </router-link>
              <router-link
                v-if="showSettings"
                to="/settings"
                class="text-gray-900 dark:text-gray-100 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                :class="[$route.path === '/settings' ? 'border-primary-500' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600']"
              >
                Settings
              </router-link>
            </div>
          </div>
          
          <!-- Desktop User Menu and Logout -->
          <div class="hidden md:flex items-center space-x-4">
            <DarkModeToggle />
            <div class="text-sm text-gray-700 dark:text-gray-300">
              Welcome, <span class="font-medium">{{ currentUser?.username }}</span>
            </div>
                   <button
                     @click="handleLogout"
                     class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-500 transition-colors duration-150"
                   >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              Logout
            </button>
          </div>

          <!-- Mobile menu button -->
          <div class="md:hidden flex items-center space-x-2">
            <DarkModeToggle />
            <div class="text-sm text-gray-700 dark:text-gray-300">
              {{ currentUser?.username }}
            </div>
            <button
              @click="mobileMenuOpen = !mobileMenuOpen"
              class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              aria-expanded="false"
            >
              <span class="sr-only">Open main menu</span>
              <!-- Hamburger icon -->
              <svg v-if="!mobileMenuOpen" class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <!-- Close icon -->
              <svg v-else class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile menu -->
        <div v-if="mobileMenuOpen" class="md:hidden">
          <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200 dark:border-gray-700">
            <router-link
              to="/"
              @click="closeMobileMenu"
              class="text-gray-900 dark:text-gray-100 block px-3 py-2 rounded-md text-base font-medium"
              :class="[$route.path === '/' ? 'bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700']"
            >
              Dashboard
            </router-link>
            <router-link
              to="/schools"
              @click="closeMobileMenu"
              class="text-gray-900 dark:text-gray-100 block px-3 py-2 rounded-md text-base font-medium"
              :class="[$route.path.startsWith('/schools') ? 'bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700']"
            >
              Schools
            </router-link>
            <router-link
              to="/teachers"
              @click="closeMobileMenu"
              class="text-gray-900 dark:text-gray-100 block px-3 py-2 rounded-md text-base font-medium"
              :class="[$route.path.startsWith('/teachers') ? 'bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700']"
            >
              Teachers
            </router-link>
            <router-link
              v-if="showUserManagement"
              to="/users"
              @click="closeMobileMenu"
              class="text-gray-900 dark:text-gray-100 block px-3 py-2 rounded-md text-base font-medium"
              :class="[$route.path === '/users' ? 'bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700']"
            >
              Users
            </router-link>
            <router-link
              v-if="showSettings"
              to="/settings"
              @click="closeMobileMenu"
              class="text-gray-900 dark:text-gray-100 block px-3 py-2 rounded-md text-base font-medium"
              :class="[$route.path === '/settings' ? 'bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700']"
            >
              Settings
            </router-link>
            <div class="border-t border-gray-200 dark:border-gray-700 pt-4 pb-3">
              <div class="px-3 mb-3">
                <div class="text-base font-medium text-gray-800 dark:text-gray-200">Welcome, {{ currentUser?.username }}</div>
              </div>
                     <button
                       @click="handleLogout"
                       class="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150"
                     >
                <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
                Logout
              </button>
            </div>
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
import { themeStore } from './stores/theme'
import DarkModeToggle from './components/DarkModeToggle.vue'
import { useRoleGuard } from './composables/useRoleGuard'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const currentUser = computed(() => auth.currentUser)

// Role guard
const { showUserManagement, showSettings } = useRoleGuard()

// Mobile menu state
const mobileMenuOpen = ref(false)

const handleLogout = async () => {
  await auth.logout()
  mobileMenuOpen.value = false
  router.push('/login')
}

// Close mobile menu when route changes
const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

onMounted(() => {
  // Initialize theme
  themeStore.initializeTheme()
  
  // Check if user is authenticated
  if (!auth.isAuthenticated) {
    router.push('/login')
  }
})
</script>
