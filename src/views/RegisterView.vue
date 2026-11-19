<template>
  <div class="min-h-screen modern-luxury-bg text-slate-100 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    <!-- Ambient Glow Accent -->
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
        Create your Prilans account
      </h2>
      <p class="mt-1 text-xs text-slate-400">
        Sign up to start landing student projects or hire university talent
      </p>
    </div>

    <div class="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
      <div class="glass-panel py-8 px-6 sm:px-10 rounded-3xl border border-white/10 shadow-2xl">
        <!-- Error Alert -->
        <div v-if="errorMessage" class="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
          <AlertCircle class="w-4 h-4 shrink-0 text-red-400" />
          <span>{{ errorMessage }}</span>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- 1. Please Select Your Role Dropdown -->
          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1">
              Please Select Your Role <span class="text-red-400">*</span>
            </label>
            <div class="relative">
              <select
                v-model="form.role"
                required
                class="w-full px-3 py-2.5 text-xs font-semibold rounded-xl glass-input text-white focus:outline-none cursor-pointer"
              >
                <option value="" disabled class="bg-slate-900 text-slate-400">-- Please Select Your Role --</option>
                <option value="student" class="bg-slate-900 text-white">Student</option>
                <option value="client" class="bg-slate-900 text-white">Client</option>
              </select>
            </div>
            <p class="text-[11px] text-slate-400 mt-1">
              {{ form.role === 'student' ? 'Access projects, build skill profile, and submit proposals.' : form.role === 'client' ? 'Post projects, review student applicants, and hire talent.' : 'Choose Student to find work or Client to hire.' }}
            </p>
          </div>

          <!-- 2. Full Name -->
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              Full Name <span class="text-red-400">*</span>
            </label>
            <div class="relative">
              <User class="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                v-model="form.fullName"
                type="text"
                placeholder="Enter your full name"
                required
                class="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl glass-input placeholder-slate-500 focus:outline-none"
              />
            </div>
          </div>

          <!-- 3. Email -->
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              Email Address <span class="text-red-400">*</span>
            </label>
            <div class="relative">
              <Mail class="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                v-model="form.email"
                type="email"
                placeholder="your.email@example.com"
                required
                class="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl glass-input placeholder-slate-500 focus:outline-none"
              />
            </div>
          </div>

          <!-- 4. Password -->
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              Password <span class="text-red-400">*</span>
            </label>
            <div class="relative">
              <Lock class="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                v-model="form.password"
                type="password"
                placeholder="Minimum 6 characters"
                required
                class="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl glass-input placeholder-slate-500 focus:outline-none"
              />
            </div>
          </div>

          <!-- 5. Confirm Password -->
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              Confirm Password <span class="text-red-400">*</span>
            </label>
            <div class="relative">
              <Lock class="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                v-model="form.confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                required
                class="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl glass-input placeholder-slate-500 focus:outline-none"
              />
            </div>
          </div>

          <!-- Terms Checkbox -->
          <div class="pt-1">
            <label class="flex items-start gap-2.5 cursor-pointer text-xs text-slate-300 select-none">
              <input
                v-model="form.agreeTerms"
                type="checkbox"
                required
                class="mt-0.5 w-4 h-4 rounded border-white/20 bg-white/5 text-indigo-500 focus:ring-0 accent-indigo-500 cursor-pointer"
              />
              <span>
                I agree to the <a href="#" class="font-semibold text-indigo-400 hover:underline">Terms of Service</a> and <a href="#" class="font-semibold text-indigo-400 hover:underline">Privacy Policy</a> of Prilans.
              </span>
            </label>
          </div>

          <!-- Submit Button -->
          <div class="pt-2">
            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold transition cursor-pointer shadow-lg shadow-indigo-500/25 active:scale-[0.98] disabled:opacity-50"
            >
              <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
              <span>
                {{ isSubmitting ? 'Creating account...' : 'Create Account' }}
              </span>
              <ArrowRight v-if="!isSubmitting" class="w-4 h-4" />
            </button>
          </div>
        </form>

        <div class="mt-6 border-t border-white/10 pt-4 text-center">
          <p class="text-xs text-slate-400">
            Already have an account?
            <router-link to="/login" class="font-bold text-indigo-400 hover:text-indigo-300 hover:underline ml-1">
              Log in here
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  Loader2
} from 'lucide-vue-next'
import { registerUser, registerClient } from '../data/auth'

const router = useRouter()
const isSubmitting = ref(false)
const errorMessage = ref('')

const form = reactive({
  role: 'student', // default 'student' or 'client'
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false
})

const handleSubmit = () => {
  errorMessage.value = ''

  if (!form.role) {
    errorMessage.value = 'Please select your role (Student or Client).'
    return
  }

  if (form.password.length < 6) {
    errorMessage.value = 'Password must be at least 6 characters long.'
    return
  }

  if (form.password !== form.confirmPassword) {
    errorMessage.value = 'Passwords do not match.'
    return
  }

  if (!form.agreeTerms) {
    errorMessage.value = 'Please agree to the terms and conditions to proceed.'
    return
  }

  isSubmitting.value = true

  setTimeout(() => {
    if (form.role === 'student') {
      registerUser({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        university: 'University Student',
        department: 'General Studies',
        studentId: 'STU-' + Math.floor(1000 + Math.random() * 9000)
      })
      isSubmitting.value = false
      router.push('/student/dashboard')
    } else {
      registerClient({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        company: form.fullName + ' Enterprises',
        location: 'Remote'
      })
      isSubmitting.value = false
      router.push('/client/dashboard')
    }
  }, 400)
}
</script>
