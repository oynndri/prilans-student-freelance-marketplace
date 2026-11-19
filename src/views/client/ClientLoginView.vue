<template>
  <div class="min-h-screen bg-[#f1f4f9] text-[#0f172a] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md text-center">
      <!-- Brand Logo -->
      <router-link to="/" class="inline-flex items-center gap-2.5 mb-3 group">
        <div class="w-9 h-9 rounded-xl bg-[#0f172a] text-white flex items-center justify-center font-black text-base shadow-xs group-hover:scale-105 transition-transform">
          <span>P</span>
        </div>
        <span class="text-2xl font-extrabold tracking-tight text-neutral-900">
          Prilans<span class="text-[#22c55e]">.</span>
        </span>
      </router-link>
      <div class="inline-block px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-semibold mb-2">
        Client & Employer Portal
      </div>
      <h2 class="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
        Client Sign In
      </h2>
      <p class="mt-1 text-xs text-neutral-500">
        Log in to publish projects, review student proposals, and manage gigs
      </p>
    </div>

    <div class="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-6 sm:px-10 shadow-sm border border-neutral-200/90 rounded-2xl">
        <!-- Error Alert -->
        <div v-if="errorMessage" class="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle class="w-4 h-4 shrink-0 text-red-600" />
          <span>{{ errorMessage }}</span>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <!-- Email Input -->
          <div>
            <label class="block text-xs font-semibold text-neutral-700 mb-1">
              Client / Business Email <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <Mail class="w-4 h-4 text-neutral-400 absolute left-3 top-3 pointer-events-none" />
              <input
                v-model="email"
                type="email"
                placeholder="sarah.jenkins@novadigital.io"
                required
                class="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition"
              />
            </div>
          </div>

          <!-- Password Input -->
          <div>
            <label class="block text-xs font-semibold text-neutral-700 mb-1">
              Password <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <Lock class="w-4 h-4 text-neutral-400 absolute left-3 top-3 pointer-events-none" />
              <input
                v-model="password"
                type="password"
                placeholder="Enter client password"
                required
                class="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition"
              />
            </div>
          </div>

          <!-- Remember Me & Forgot Password -->
          <div class="flex items-center justify-between text-xs pt-1">
            <label class="flex items-center gap-2 cursor-pointer select-none">
              <input
                v-model="rememberMe"
                type="checkbox"
                class="w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-0 accent-neutral-900 cursor-pointer"
              />
              <span class="text-neutral-600">Remember Me</span>
            </label>
            <a
              href="#forgot"
              @click.prevent="handleForgotPassword"
              class="font-semibold text-neutral-700 hover:text-black transition"
            >
              Forgot Password?
            </a>
          </div>

          <!-- Submit Button -->
          <div class="pt-2">
            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#0f172a] text-white text-xs font-semibold hover:bg-black transition cursor-pointer shadow-sm active:scale-[0.98] disabled:opacity-50"
            >
              <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
              <span>{{ isSubmitting ? 'Signing in as Client...' : 'Sign In as Client' }}</span>
              <ArrowRight v-if="!isSubmitting" class="w-4 h-4" />
            </button>
          </div>
        </form>

        <div class="mt-6 border-t border-neutral-100 pt-4 flex items-center justify-between text-xs text-neutral-500">
          <div>
            Need a client account?
            <router-link to="/client/register" class="font-bold text-neutral-900 hover:underline ml-1">
              Register Client
            </router-link>
          </div>
          <router-link to="/login" class="text-blue-600 hover:underline">
            Student Login
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Mail, Lock, ArrowRight, AlertCircle, Loader2 } from 'lucide-vue-next'
import { loginUser } from '../../data/auth'

const router = useRouter()
const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const isSubmitting = ref(false)
const errorMessage = ref('')

const handleLogin = () => {
  errorMessage.value = ''
  if (!email.value || !password.value) {
    errorMessage.value = 'Please enter email and password.'
    return
  }

  isSubmitting.value = true
  setTimeout(() => {
    loginUser(email.value, password.value, 'client')
    isSubmitting.value = false
    router.push('/client/dashboard')
  }, 500)
}

const handleForgotPassword = () => {
  alert('Client password reset instructions have been dispatched to your work email.')
}
</script>
