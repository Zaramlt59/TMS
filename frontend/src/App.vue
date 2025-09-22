<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Government Header -->
    <div class="text-white shadow-sm font-size-fixed fixed-header" style="background-color: #220A06;">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between py-1 sm:py-0 sm:h-12">
          <div class="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-0">
            <img src="/src/assests/Inidan-Flag.svg" alt="Indian Flag" class="h-5 sm:h-6 w-auto flex-shrink-0" />
            <span class="text-xs sm:text-sm font-medium truncate">School Education Deptt. GoM</span>
          </div>
          <div class="flex flex-wrap items-center gap-1 sm:gap-4 text-[10px] sm:text-sm leading-none w-full sm:w-auto">
            <span class="cursor-pointer hover:text-amber-200 truncate max-w-[140px] sm:max-w-none">Skip to Main Content</span>
            <div class="flex items-center space-x-1 leading-none">
              <button 
                @click="decreaseFontSize"
                :disabled="!canDecrease"
                class="px-0.5 sm:px-2 py-0.5 rounded cursor-pointer hover:bg-amber-700 text-xs disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                :class="canDecrease ? 'hover:bg-amber-700' : ''"
                title="Decrease font size"
              >
                A⁻
              </button>
              <button 
                @click="resetFontSize"
                class="px-0.5 sm:px-2 py-0.5 rounded bg-amber-700 text-xs cursor-pointer hover:bg-amber-600 transition-colors duration-200"
                title="Reset font size"
              >
                A
              </button>
              <button 
                @click="increaseFontSize"
                :disabled="!canIncrease"
                class="px-0.5 sm:px-2 py-0.5 rounded cursor-pointer hover:bg-amber-700 text-xs disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                :class="canIncrease ? 'hover:bg-amber-700' : ''"
                title="Increase font size"
              >
                A⁺
              </button>
            </div>
            <div class="flex items-center justify-center flex-shrink-0">
              <!-- Dark Mode Toggle -->
              <DarkModeToggle />
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
    
    <!-- Main Layout with Sidebar -->
    <div v-if="$route.path !== '/login' && $route.path !== '/otp-login'" class="flex" style="height: calc(100vh - 48px); position: absolute; top: 48px; left: 0; right: 0; overflow: hidden;">
      <!-- Desktop Sidebar -->
      <div class="hidden lg:flex lg:flex-shrink-0">
        <Sidebar />
            </div>

      <!-- Mobile Sidebar Overlay -->
      <div v-if="sidebarOpen" class="fixed inset-0 z-40 lg:hidden">
        <div class="fixed inset-0 bg-gray-600 bg-opacity-75" @click="closeSidebar"></div>
        <div class="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-800" style="top: 48px; height: calc(100vh - 48px);">
          <Sidebar />
        </div>
      </div>
          
      <!-- Main Content Area -->
      <div class="flex-1 flex flex-col">
        <!-- Mobile Toggle Button (Fixed Position) -->
        <div class="fixed top-16 left-4 z-50 lg:hidden">
          <SidebarToggle :is-open="sidebarOpen" @toggle="toggleSidebar" />
        </div>

        <!-- Main Content -->
        <main class="flex-1 bg-gray-50 dark:bg-gray-900" style="overflow-y: auto; height: calc(100vh - 48px);">
          <div class="py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
            <!-- Mobile spacing for toggle button -->
            <div class="lg:hidden h-12"></div>
            <router-view />
          </div>
        </main>
      </div>
    </div>

    <!-- Login/OTP Pages (Full Screen) -->
    <div v-else class="h-screen flex flex-col">
      <main class="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
      <router-view />
    </main>
    </div>
  </div>
</template>

<style>
/* Global font scaling using CSS custom property */
:root {
  --font-scale: 1;
}

/* Apply font scaling to main content and navigation only */
main, nav {
  font-size: calc(1rem * var(--font-scale, 1));
}

/* Completely isolate government header from any font scaling */
.font-size-fixed {
  font-size: 16px !important;
  zoom: 1 !important;
  transform: scale(1) !important;
}

/* Fixed header size - completely unaffected by font scaling */
.fixed-header {
  height: 48px !important;
  min-height: 48px !important;
  max-height: 48px !important;
  font-size: 16px !important;
  line-height: 1.5 !important;
  box-sizing: border-box !important;
}

.font-size-fixed * {
  font-size: inherit !important;
  zoom: 1 !important;
  transform: scale(1) !important;
}

/* Force specific font sizes for all text elements in government header */
.font-size-fixed .text-xs {
  font-size: 0.75rem !important;
  line-height: 1rem !important;
}

.font-size-fixed .text-sm {
  font-size: 0.875rem !important;
  line-height: 1.25rem !important;
}

.font-size-fixed .text-base {
  font-size: 1rem !important;
  line-height: 1.5rem !important;
}

.font-size-fixed .text-lg {
  font-size: 1.125rem !important;
  line-height: 1.75rem !important;
}

.font-size-fixed .text-xl {
  font-size: 1.25rem !important;
  line-height: 1.75rem !important;
}

/* Reset any potential scaling on buttons and spans */
.font-size-fixed button,
.font-size-fixed span,
.font-size-fixed div {
  font-size: inherit !important;
  zoom: 1 !important;
  transform: scale(1) !important;
}

/* Ensure fixed header elements maintain their size */
.fixed-header .h-5 {
  height: 1.25rem !important;
}

.fixed-header .h-6 {
  height: 1.5rem !important;
}

.fixed-header .w-4 {
  width: 1rem !important;
}

.fixed-header .w-5 {
  width: 1.25rem !important;
}

.fixed-header .w-6 {
  width: 1.5rem !important;
}

.fixed-header .w-7 {
  width: 1.75rem !important;
}

.fixed-header .h-4 {
  height: 1rem !important;
}

.fixed-header .h-7 {
  height: 1.75rem !important;
}
</style>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { themeStore } from './stores/theme'
import { useFontSizeStore } from './stores/fontSize'
import DarkModeToggle from './components/DarkModeToggle.vue'
import Sidebar from './components/Sidebar.vue'
import SidebarToggle from './components/SidebarToggle.vue'
import { useRoleGuard } from './composables/useRoleGuard'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const fontSizeStore = useFontSizeStore()
const currentUser = computed(() => auth.currentUser)

// Font size controls
const { canDecrease, canIncrease } = fontSizeStore
const decreaseFontSize = () => fontSizeStore.decreaseFontSize()
const increaseFontSize = () => fontSizeStore.increaseFontSize()
const resetFontSize = () => fontSizeStore.resetFontSize()

// Role guard
const { 
  showUserManagement, 
  showSettings,
  canManageSchools,
  canManageTeachers,
  canManageMedicalRecords,
  canViewReports,
  isTeacher
} = useRoleGuard()

// Super admin check
const isSuperAdmin = computed(() => {
  return currentUser.value?.role === 'super_admin'
})

// Sidebar state
const sidebarOpen = ref(false)

// Sidebar controls
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const closeSidebar = () => {
  sidebarOpen.value = false
}

// Initialize font size on mount
onMounted(() => {
  fontSizeStore.loadFontSize()
})

const handleLogout = async () => {
  await auth.logout()
  sidebarOpen.value = false
  router.push('/login')
}

// Close sidebar when route changes (mobile)
const closeSidebarOnRouteChange = () => {
  sidebarOpen.value = false
}

// Watch for route changes to close sidebar on mobile
watch(() => route.path, () => {
  closeSidebarOnRouteChange()
})

onMounted(() => {
  // Initialize theme
  themeStore.initializeTheme()
  
  // Check if user is authenticated
  if (!auth.isAuthenticated) {
    router.push('/login')
  }
})
</script>
