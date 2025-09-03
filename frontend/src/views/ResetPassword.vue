<template>
  <div class="h-screen flex items-start justify-center bg-gray-50 px-4 sm:px-6 lg:px-8 pt-16">
    <div class="w-full max-w-md space-y-4">
      <h2 class="text-center text-lg font-extrabold text-gray-900">Reset Password</h2>
      <p class="text-center text-xs text-gray-600">Paste the reset token you received and choose a new password.</p>
      <form class="space-y-3" @submit.prevent="submit">
        <div>
          <label class="sr-only" for="token">Token</label>
          <textarea id="token" v-model="token" required class="form-input w-full" placeholder="Reset token" rows="3"></textarea>
        </div>
        <div>
          <label class="sr-only" for="password">New Password</label>
          <input id="password" v-model="password" type="password" required class="form-input w-full" placeholder="New password" />
        </div>
        <div v-if="message" class="text-sm" :class="success ? 'text-green-600' : 'text-red-600'">{{ message }}</div>
        <button type="submit" :disabled="loading" class="btn-primary w-full disabled:opacity-50">{{ loading ? 'Resetting...' : 'Reset Password' }}</button>
        <router-link to="/login" class="block text-center text-sm text-primary-600">Back to login</router-link>
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


