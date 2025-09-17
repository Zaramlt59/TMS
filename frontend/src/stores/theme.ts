import { ref, computed } from 'vue'

export const useThemeStore = () => {
  const isDarkMode = ref(false)

  // Initialize theme from localStorage or system preference
  const initializeTheme = () => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      isDarkMode.value = savedTheme === 'dark'
    } else {
      // Check system preference
      isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    applyTheme()
  }

  // Apply theme to document
  const applyTheme = () => {
    if (isDarkMode.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light')
  }

  // Toggle theme
  const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value
    applyTheme()
  }

  // Set specific theme
  const setTheme = (theme: 'light' | 'dark') => {
    isDarkMode.value = theme === 'dark'
    applyTheme()
  }

  // Computed properties
  const theme = computed(() => isDarkMode.value ? 'dark' : 'light')
  const isLightMode = computed(() => !isDarkMode.value)

  return {
    isDarkMode,
    theme,
    isLightMode,
    initializeTheme,
    toggleTheme,
    setTheme,
    applyTheme
  }
}

// Global theme store instance
export const themeStore = useThemeStore()
