<template>
  <button
    @click="toggleTheme"
    class="w-5 h-5 sm:w-7 sm:h-7 cursor-pointer hover:bg-amber-700 rounded flex items-center justify-center flex-shrink-0 text-white transition-colors duration-200"
    :title="isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'"
  >
    <span class="sr-only">{{ isDarkMode ? 'Switch to light mode' : 'Switch to dark mode' }}</span>
    
    <!-- Sun icon (shown in dark mode) -->
    <svg
      v-if="isDarkMode"
      class="w-3 h-3 sm:w-4 sm:h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
    
    <!-- Moon icon (shown in light mode) -->
    <svg
      v-else
      class="w-3 h-3 sm:w-4 sm:h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      />
    </svg>
  </button>
</template>

<script setup lang="ts">
import { useThemeStore } from '../stores/theme'

const { isDarkMode, toggleTheme } = useThemeStore()
</script>
