<template>
  <div class="min-h-screen flex items-start justify-center bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8 pt-8 sm:pt-16">
    <div class="w-full max-w-md space-y-6">
      <div>
        <h2 class="text-center text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-gray-100">Reset Password</h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">Paste the reset token you received and choose a new password.</p>
      </div>
      
      <form class="space-y-4" @submit.prevent="submit">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" for="token">Reset Token</label>
          <textarea 
            id="token" 
            v-model="token" 
            required 
            class="form-input w-full" 
            placeholder="Paste the reset token here" 
            rows="3"
          ></textarea>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" for="password">New Password</label>
          <input 
            id="password" 
            v-model="password" 
            type="password" 
            required 
            class="form-input w-full" 
            placeholder="Enter your new password" 
          />
        </div>
        
        <div v-if="message" class="text-sm p-3 rounded-md" :class="success ? 'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20' : 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20'">
          {{ message }}
        </div>
        
        <button 
          type="submit" 
          :disabled="loading" 
          class="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed py-3"
        >
          <span v-if="loading" class="inline-flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Resetting...
          </span>
          <span v-else>Reset Password</span>
        </button>
        
        <router-link to="/login" class="block text-center text-sm text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 transition-colors">
          Back to login
        </router-link>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../services/auth'

const router = useRouter()
const token = ref('')
const password = ref('')
const loading = ref(false)
const message = ref('')
const success = ref(false)

const submit = async () => {
  loading.value = true
  message.value = ''
  success.value = false
  try {
    const ok = await authService.resetPassword(token.value, password.value)
    success.value = ok
    message.value = ok ? 'Password updated. Redirecting to login...' : 'Failed to reset password.'
    if (ok) setTimeout(() => router.push('/login'), 1000)
  } catch {
    message.value = 'Failed to reset password.'
  } finally {
    loading.value = false
  }
}
</script>


