<template>
  <div class="min-h-screen bg-[#f1f4f9] text-[#0f172a] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
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
        Employer & Client Portal
      </div>
      <h2 class="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
        Register as a Client
      </h2>
      <p class="mt-1 text-xs text-neutral-500">
        Hire top university students for web development, design, and software projects
      </p>
    </div>

    <div class="mt-6 sm:mx-auto sm:w-full sm:max-w-lg">
      <div class="bg-white py-8 px-6 sm:px-10 shadow-sm border border-neutral-200/90 rounded-2xl">
        <!-- Error Alert -->
        <div v-if="errorMessage" class="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle class="w-4 h-4 shrink-0 text-red-600" />
          <span>{{ errorMessage }}</span>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Full Name -->
          <div>
            <label class="block text-xs font-semibold text-neutral-700 mb-1">
              Contact Person Full Name <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <User class="w-4 h-4 text-neutral-400 absolute left-3 top-3 pointer-events-none" />
              <input
                v-model="form.fullName"
                type="text"
                placeholder="e.g. Sarah Jenkins"
                required
                class="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition"
              />
            </div>
          </div>

          <!-- Business Email -->
          <div>
            <label class="block text-xs font-semibold text-neutral-700 mb-1">
              Business / Work Email <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <Mail class="w-4 h-4 text-neutral-400 absolute left-3 top-3 pointer-events-none" />
              <input
                v-model="form.email"
                type="email"
                placeholder="sarah@company.com"
                required
                class="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition"
              />
            </div>
          </div>

          <!-- Company / Organization & Location -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-neutral-700 mb-1">
                Company / Organization <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <Building class="w-4 h-4 text-neutral-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  v-model="form.company"
                  type="text"
                  placeholder="e.g. Nova Digital Labs"
                  required
                  class="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-neutral-700 mb-1">
                Location <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <MapPin class="w-4 h-4 text-neutral-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  v-model="form.location"
                  type="text"
                  placeholder="e.g. San Francisco, CA"
                  required
                  class="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition"
                />
              </div>
            </div>
          </div>

          <!-- Password & Confirm Password Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-neutral-700 mb-1">
                Password <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <Lock class="w-4 h-4 text-neutral-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  v-model="form.password"
                  type="password"
                  placeholder="At least 6 characters"
                  required
                  class="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-neutral-700 mb-1">
                Confirm Password <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <Lock class="w-4 h-4 text-neutral-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  v-model="form.confirmPassword"
                  type="password"
                  placeholder="Repeat your password"
                  required
                  class="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition"
                />
              </div>
            </div>
          </div>

          <!-- Terms & Conditions checkbox -->
          <div class="pt-1">
            <label class="flex items-start gap-2 cursor-pointer select-none">
              <input
                v-model="form.agreeTerms"
                type="checkbox"
                required
                class="w-4 h-4 mt-0.5 rounded border-neutral-300 text-neutral-900 focus:ring-0 accent-neutral-900 cursor-pointer"
              />
              <span class="text-xs text-neutral-600 leading-normal">
                I agree to the <a href="#" class="font-semibold text-neutral-900 underline hover:text-black">Client Service Agreement</a> and Escrow Payment Terms.
              </span>
            </label>
          </div>

          <!-- Submit Button -->
          <div class="pt-2">
            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#0f172a] text-white text-xs font-semibold hover:bg-black transition cursor-pointer shadow-sm active:scale-[0.98] disabled:opacity-50"
            >
              <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
              <span>{{ isSubmitting ? 'Registering client account...' : 'Create Client Account' }}</span>
              <ArrowRight v-if="!isSubmitting" class="w-4 h-4" />
            </button>
          </div>
        </form>

        <div class="mt-6 border-t border-neutral-100 pt-4 flex items-center justify-between text-xs text-neutral-500">
          <div>
            Already registered?
            <router-link to="/client/login" class="font-bold text-neutral-900 hover:underline ml-1">
              Client Sign In
            </router-link>
          </div>
          <router-link to="/register" class="text-blue-600 hover:underline">
            Are you a student?
          </router-link>
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
  Building,
  MapPin,
  Lock,
  ArrowRight,
  AlertCircle,
  Loader2
} from 'lucide-vue-next'
import { registerClient } from '../data/auth'

const router = useRouter()
const isSubmitting = ref(false)
const errorMessage = ref('')

const form = reactive({
  fullName: '',
  email: '',
  company: '',
  location: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false
})

const handleSubmit = () => {
  errorMessage.value = ''

  if (form.password.length < 6) {
    errorMessage.value = 'Password must be at least 6 characters long.'
    return
  }

  if (form.password !== form.confirmPassword) {
    errorMessage.value = 'Passwords do not match.'
    return
  }

  if (!form.agreeTerms) {
    errorMessage.value = 'Please agree to the service agreement to continue.'
    return
  }

  isSubmitting.value = true

  setTimeout(() => {
    registerClient(form)
    isSubmitting.value = false
    router.push('/client/dashboard')
  }, 600)
}
</script>
