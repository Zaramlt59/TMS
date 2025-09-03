<template>
  <div class="h-screen flex items-start justify-center bg-gray-50 px-4 sm:px-6 lg:px-8 overflow-hidden overflow-y-hidden pt-16">
    <div class="w-full max-w-md space-y-3">
              <div>
          <div class="mx-auto flex items-center justify-center">
            <img src="/src/assests/TMS logo 1.svg" alt="TMS Logo" class="h-12 w-auto" />
          </div>
          <h2 class="mt-2 text-center text-lg font-extrabold text-gray-900">
            TMS - Teacher Management System
          </h2>
          <p class="mt-1 text-center text-xs text-gray-600">
            Sign in to access the dashboard
          </p>
        </div>
      
      <form class="mt-3 space-y-2" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="username" class="sr-only">Username</label>
            <input
              id="username"
              v-model="username"
              name="username"
              type="text"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
              placeholder="Username"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input
              id="password"
              v-model="password"
              name="password"
              type="password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
              placeholder="Password"
            />
          </div>
        </div>

        <div v-if="error" class="text-red-600 text-sm text-center">
          {{ error }}
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
