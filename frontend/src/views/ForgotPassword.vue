<template>
  <div class="h-screen flex items-start justify-center bg-gray-50 px-4 sm:px-6 lg:px-8 pt-16">
    <div class="w-full max-w-md space-y-4">
      <h2 class="text-center text-lg font-extrabold text-gray-900">Forgot Password</h2>
      <p class="text-center text-xs text-gray-600">Enter your email. If it exists, we will send a reset link.</p>
      <form class="space-y-3" @submit.prevent="submit">
        <div>
          <label class="sr-only" for="email">Email</label>
          <input id="email" v-model="email" type="email" required class="form-input w-full" placeholder="you@example.com" />
        </div>
        <div v-if="message" class="text-sm" :class="success ? 'text-green-600' : 'text-red-600'">{{ message }}</div>
        <button type="submit" :disabled="loading" class="btn-primary w-full disabled:opacity-50">{{ loading ? 'Sending...' : 'Send reset link' }}</button>
        <router-link to="/login" class="block text-center text-sm text-primary-600">Back to login</router-link>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { authService } from '../services/auth'

const email = ref('')
const loading = ref(false)
const message = ref('')
const success = ref(false)

const submit = async () => {
  loading.value = true
  message.value = ''
  success.value = false
  try {
    const ok = await authService.requestPasswordReset(email.value)
    success.value = ok
    message.value = ok ? 'If account exists, a reset link has been sent.' : 'Failed to send reset link.'
  } catch {
    message.value = 'Failed to send reset link.'
  } finally {
    loading.value = false
  }
}
</script>


