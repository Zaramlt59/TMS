<template>
  <div class="min-h-screen flex items-start justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20">
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="mx-auto flex items-center justify-center">
          <img src="/src/assests/TMS logo 1.svg" alt="TMS Logo" class="h-12 w-auto" />
        </div>
        <h2 class="mt-4 text-center text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-gray-100">
          TMS - Teacher Management System
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Teacher Login - Enter your phone number to receive OTP
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="sendOTP">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="phone" class="sr-only">Phone Number</label>
            <input
              id="phone"
              v-model="phone"
              name="phone"
              type="tel"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Enter your phone number"
            />
          </div>
        </div>

        <div v-if="otpSent" class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="otp" class="sr-only">OTP</label>
            <input
              id="otp"
              v-model="otp"
              name="otp"
              type="text"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Enter 6-digit OTP"
              maxlength="6"
            />
          </div>
        </div>

        <div v-if="otpSent" class="text-center">
          <button
            type="button"
            @click="resendOTP"
            :disabled="resendCooldown > 0"
            class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : 'Resend OTP' }}
          </button>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            {{ otpSent ? 'Verify OTP' : 'Send OTP' }}
          </button>
        </div>

        <div class="text-center">
          <router-link
            to="/login"
            class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            Back to regular login
          </router-link>
        </div>
      </form>

      <!-- Error message -->
      <div v-if="error" class="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800 dark:text-red-200">
              {{ error }}
            </h3>
          </div>
        </div>
      </div>

      <!-- Success message -->
      <div v-if="successMessage" class="rounded-md bg-green-50 dark:bg-green-900/20 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-green-800 dark:text-green-200">
              {{ successMessage }}
            </h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// Reactive data
const phone = ref('')
const otp = ref('')
const otpSent = ref(false)
const loading = ref(false)
const error = ref('')
const successMessage = ref('')
const resendCooldown = ref(0)

// Timer for resend cooldown
let resendTimer: NodeJS.Timeout | null = null

// Methods
const sendOTP = async () => {
  if (otpSent.value) {
    await verifyOTP()
    return
  }

  loading.value = true
  error.value = ''
  successMessage.value = ''

  try {
    console.log('Sending OTP request for phone:', phone.value)
    const response = await fetch('/api/otp-auth/send-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ phone: phone.value })
    })

    console.log('OTP response status:', response.status)
    const data = await response.json()
    console.log('OTP response data:', data)

    if (data.success) {
      otpSent.value = true
      successMessage.value = 'OTP sent successfully! Check your email or phone.'
      startResendCooldown()
    } else {
      error.value = data.message || 'Failed to send OTP'
    }
  } catch (err) {
    console.error('OTP send error:', err)
    error.value = 'Network error. Please try again.'
  } finally {
    loading.value = false
  }
}

const verifyOTP = async () => {
  loading.value = true
  error.value = ''
  successMessage.value = ''

  try {
    console.log('Verifying OTP for phone:', phone.value, 'OTP:', otp.value)
    const response = await fetch('/api/otp-auth/verify-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        phone: phone.value,
        otp: otp.value
      })
    })

    console.log('Verify OTP response status:', response.status)
    const data = await response.json()
    console.log('Verify OTP response data:', data)

    if (data.success) {
      // Store token and user data
      authStore.setToken(data.token)
      authStore.setUser(data.user)
      authStore.setAuthenticated(true)

      successMessage.value = 'Login successful! Redirecting...'
      
      // Redirect to dashboard
      setTimeout(() => {
        router.push('/')
      }, 1000)
    } else {
      error.value = data.message || 'Invalid OTP'
    }
  } catch (err) {
    console.error('Verify OTP error:', err)
    error.value = 'Network error. Please try again.'
  } finally {
    loading.value = false
  }
}

const resendOTP = async () => {
  if (resendCooldown.value > 0) return

  loading.value = true
  error.value = ''
  successMessage.value = ''

  try {
    console.log('Resending OTP for phone:', phone.value)
    const response = await fetch('/api/otp-auth/resend-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ phone: phone.value })
    })

    console.log('Resend OTP response status:', response.status)
    const data = await response.json()
    console.log('Resend OTP response data:', data)

    if (data.success) {
      successMessage.value = 'OTP resent successfully!'
      startResendCooldown()
    } else {
      error.value = data.message || 'Failed to resend OTP'
    }
  } catch (err) {
    console.error('Resend OTP error:', err)
    error.value = 'Network error. Please try again.'
  } finally {
    loading.value = false
  }
}

const startResendCooldown = () => {
  resendCooldown.value = 60
  resendTimer = setInterval(() => {
    resendCooldown.value--
    if (resendCooldown.value <= 0) {
      clearInterval(resendTimer!)
      resendTimer = null
    }
  }, 1000)
}

// Cleanup
onUnmounted(() => {
  if (resendTimer) {
    clearInterval(resendTimer)
  }
})
</script>
