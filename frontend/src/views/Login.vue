<template>
  <div class="min-h-screen flex items-start justify-center bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8 overflow-x-hidden overflow-y-auto pt-8 sm:pt-16">
    <div class="w-full max-w-md space-y-4">
      <div>
        <div class="mx-auto flex items-center justify-center">
          <img src="/src/assests/TMS logo 1.svg" alt="TMS Logo" class="h-12 w-auto" />
        </div>
        <h2 class="mt-4 text-center text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-gray-100">
          TMS - Teacher Management System
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Sign in to access the dashboard
        </p>
      </div>
    
      <form class="mt-6 space-y-4" @submit.prevent="handleLogin">
        <div class="space-y-4">
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
            <input
              id="username"
              v-model="username"
              name="username"
              type="text"
              required
              class="form-input w-full"
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
            <input
              id="password"
              v-model="password"
              name="password"
              type="password"
              required
              class="form-input w-full"
              placeholder="Enter your password"
            />
          </div>
        </div>

        <div v-if="error" class="text-red-600 dark:text-red-400 text-sm text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-md">
          {{ error }}
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            <span v-if="!loading">Sign in</span>
            <span v-else>Signing in...</span>
          </button>
        </div>
        <div class="text-center">
          <router-link to="/forgot-password" class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 transition-colors">Forgot password?</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
body {
  overflow: hidden;
}
</style>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../services/auth'

const router = useRouter()
const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const success = await authService.login(username.value, password.value)
    
    if (success) {
      // Redirect to dashboard
      router.push('/')
    } else {
      error.value = 'Invalid username or password'
    }
  } catch (err) {
    error.value = 'Login failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
