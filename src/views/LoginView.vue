<template>
  <div class="min-h-screen modern-luxury-bg text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    <!-- Ambient Blur Circles -->
    <div class="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>

    <div class="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
      <!-- Brand Logo -->
      <router-link to="/" class="inline-flex items-center gap-2.5 mb-3 group">
        <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
          <span>P</span>
        </div>
        <span class="text-2xl font-extrabold tracking-tight text-white">
          Prilans<span class="text-emerald-400">.</span>
        </span>
      </router-link>
      <h2 class="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
        Sign In to Prilans
      </h2>
      <p class="mt-1 text-xs text-slate-400">
        Enter your credentials to access your portal automatically
      </p>
    </div>

    <div class="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
      <div class="glass-panel py-8 px-6 sm:px-10 rounded-3xl border border-white/10 shadow-2xl">
        <!-- Error Alert -->
        <div v-if="errorMessage" class="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
          <AlertCircle class="w-4 h-4 shrink-0 text-red-400" />
          <span>{{ errorMessage }}</span>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <!-- Email Input -->
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              Email Address <span class="text-red-400">*</span>
            </label>
            <div class="relative">
              <Mail class="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                v-model="email"
                type="email"
                placeholder="your.email@example.com"
                required
                class="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl glass-input placeholder-slate-500 focus:outline-none"
              />
            </div>
          </div>

          <!-- Password Input -->
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              Password <span class="text-red-400">*</span>
            </label>
            <div class="relative">
              <Lock class="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                v-model="password"
                type="password"
                placeholder="Enter your password"
                required
                class="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl glass-input placeholder-slate-500 focus:outline-none"
              />
            </div>
          </div>

          <!-- Remember Me & Forgot Password -->
          <div class="flex items-center justify-between text-xs pt-1">
            <label class="flex items-center gap-2 cursor-pointer select-none">
              <input
                v-model="rememberMe"
                type="checkbox"
                class="w-4 h-4 rounded border-white/20 bg-white/5 text-indigo-500 focus:ring-0 accent-indigo-500 cursor-pointer"
              />
              <span class="text-slate-300">Remember Me</span>
            </label>
            <a
              href="#forgot"
              @click.prevent="handleForgotPassword"
              class="font-semibold text-indigo-400 hover:text-indigo-300 transition"
            >
              Forgot Password?
            </a>
          </div>

          <!-- Submit Button with rich gradient -->
          <div class="pt-2">
            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold transition cursor-pointer shadow-lg shadow-indigo-500/25 active:scale-[0.98] disabled:opacity-50"
            >
              <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
              <span>{{ isSubmitting ? 'Signing in...' : 'Sign In' }}</span>
              <ArrowRight v-if="!isSubmitting" class="w-4 h-4" />
            </button>
          </div>
        </form>

        <div class="mt-6 border-t border-white/10 pt-4 text-center">
          <p class="text-xs text-slate-400">
            Don't have an account yet?
            <router-link to="/register" class="font-bold text-indigo-400 hover:text-indigo-300 hover:underline ml-1">
              Create account
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Mail, Lock, ArrowRight, AlertCircle, Loader2 } from 'lucide-vue-next'
import { loginUser } from '../data/auth'

const router = useRouter()
// Default empty fields - no pre-filled credentials
const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const isSubmitting = ref(false)
const errorMessage = ref('')

const handleLogin = () => {
  errorMessage.value = ''
  if (!email.value || !password.value) {
    errorMessage.value = 'Please enter both email and password.'
    return
  }

  isSubmitting.value = true
  setTimeout(() => {
    // Automatically detect user and role from credentials
    const result = loginUser(email.value.trim(), password.value)
    isSubmitting.value = false

    if (!result.success) {
      errorMessage.value = result.message || 'Login failed. Please check your credentials.'
      return
    }

    // Role-based automatic redirect:
    if (result.role === 'admin') {
      router.push('/admin/dashboard')
    } else if (result.role === 'client') {
      router.push('/client/dashboard')
    } else {
      router.push('/student/dashboard')
    }
  }, 400)
}

const handleForgotPassword = () => {
  alert('Password reset instructions have been dispatched to your email address.')
}
</script>
