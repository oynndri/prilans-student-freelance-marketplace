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
      <h2 class="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
        Create your Prilans account
      </h2>
      <p class="mt-1 text-xs text-neutral-500">
        Join the student freelance marketplace to work or hire
      </p>
    </div>

    <div class="mt-6 sm:mx-auto sm:w-full sm:max-w-lg">
      <div class="bg-white py-8 px-6 sm:px-10 shadow-sm border border-neutral-200/90 rounded-2xl">
        <!-- Error Alert -->
        <div v-if="errorMessage" class="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle class="w-4 h-4 shrink-0 text-red-600" />
          <span>{{ errorMessage }}</span>
        </div>

        <!-- Role Selector Tabs -->
        <div class="mb-6">
          <label class="block text-xs font-bold text-neutral-700 mb-2 uppercase tracking-wider text-[11px]">
            I want to register as a:
          </label>
          <div class="grid grid-cols-2 p-1.5 bg-neutral-100 rounded-2xl border border-neutral-200 gap-1.5">
            <button
              type="button"
              @click="selectedRole = 'student'"
              class="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition cursor-pointer"
              :class="selectedRole === 'student' ? 'bg-white text-neutral-900 shadow-xs border border-neutral-200/80' : 'text-neutral-500 hover:text-neutral-900'"
            >
              <GraduationCap class="w-4 h-4" :class="selectedRole === 'student' ? 'text-emerald-600' : 'text-neutral-400'" />
              <span>Student Freelancer</span>
            </button>
            <button
              type="button"
              @click="selectedRole = 'client'"
              class="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition cursor-pointer"
              :class="selectedRole === 'client' ? 'bg-white text-neutral-900 shadow-xs border border-neutral-200/80' : 'text-neutral-500 hover:text-neutral-900'"
            >
              <Building class="w-4 h-4" :class="selectedRole === 'client' ? 'text-blue-600' : 'text-neutral-400'" />
              <span>Client / Employer</span>
            </button>
          </div>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Full Name -->
          <div>
            <label class="block text-xs font-semibold text-neutral-700 mb-1">
              {{ selectedRole === 'student' ? 'Full Name' : 'Contact Person Full Name' }} <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <User class="w-4 h-4 text-neutral-400 absolute left-3 top-3 pointer-events-none" />
              <input
                v-model="form.fullName"
                type="text"
                :placeholder="selectedRole === 'student' ? 'e.g. Akmal Nasrulloh' : 'e.g. Sarah Jenkins'"
                required
                class="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition"
              />
            </div>
          </div>

          <!-- Email -->
          <div>
            <label class="block text-xs font-semibold text-neutral-700 mb-1">
              {{ selectedRole === 'student' ? 'University Email' : 'Business / Organization Email' }} <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <Mail class="w-4 h-4 text-neutral-400 absolute left-3 top-3 pointer-events-none" />
              <input
                v-model="form.email"
                type="email"
                :placeholder="selectedRole === 'student' ? 'student@university.edu' : 'contact@company.com'"
                required
                class="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition"
              />
            </div>
          </div>

          <!-- STUDENT SPECIFIC FIELDS -->
          <template v-if="selectedRole === 'student'">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-neutral-700 mb-1">
                  University Name <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <Building class="w-4 h-4 text-neutral-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    v-model="form.university"
                    type="text"
                    placeholder="e.g. University of Dhaka"
                    required
                    class="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition"
                  />
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold text-neutral-700 mb-1">
                  Department <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <GraduationCap class="w-4 h-4 text-neutral-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    v-model="form.department"
                    type="text"
                    placeholder="e.g. Computer Science"
                    required
                    class="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition"
                  />
                </div>
              </div>
            </div>

            <!-- Student ID -->
            <div>
              <label class="block text-xs font-semibold text-neutral-700 mb-1">
                Student ID / Roll Number <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <CreditCard class="w-4 h-4 text-neutral-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  v-model="form.studentId"
                  type="text"
                  placeholder="e.g. CS-2022-8921"
                  required
                  class="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition font-mono"
                />
              </div>
            </div>
          </template>

          <!-- CLIENT SPECIFIC FIELDS -->
          <template v-else>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-neutral-700 mb-1">
                  Company / Organization <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <Briefcase class="w-4 h-4 text-neutral-400 absolute left-3 top-3 pointer-events-none" />
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
                  Location / City <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <Building class="w-4 h-4 text-neutral-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    v-model="form.location"
                    type="text"
                    placeholder="e.g. San Francisco, CA / Remote"
                    required
                    class="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition"
                  />
                </div>
              </div>
            </div>
          </template>

          <!-- Password Grid -->
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
                  placeholder="Minimum 6 characters"
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
                  placeholder="Re-enter password"
                  required
                  class="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition"
                />
              </div>
            </div>
          </div>

          <!-- Terms Checkbox -->
          <div class="pt-1">
            <label class="flex items-start gap-2.5 cursor-pointer text-xs text-neutral-600 select-none">
              <input
                v-model="form.agreeTerms"
                type="checkbox"
                required
                class="mt-0.5 w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-0 accent-neutral-900 cursor-pointer"
              />
              <span>
                I agree to the <a href="#" class="font-semibold text-neutral-900 hover:underline">Terms of Service</a> and <a href="#" class="font-semibold text-neutral-900 hover:underline">Privacy Policy</a> of Prilans.
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
              <span>
                {{ isSubmitting ? 'Creating account...' : `Create ${selectedRole === 'student' ? 'Student' : 'Client'} Account` }}
              </span>
              <ArrowRight v-if="!isSubmitting" class="w-4 h-4" />
            </button>
          </div>
        </form>

        <div class="mt-6 border-t border-neutral-100 pt-4 text-center">
          <p class="text-xs text-neutral-500">
            Already have an account?
            <router-link to="/login" class="font-bold text-neutral-900 hover:underline ml-1">
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
  Building,
  GraduationCap,
  Briefcase,
  CreditCard,
  Lock,
  ArrowRight,
  AlertCircle,
  Loader2
} from 'lucide-vue-next'
import { registerUser, registerClient } from '../data/auth'

const router = useRouter()
const isSubmitting = ref(false)
const errorMessage = ref('')
const selectedRole = ref('student') // 'student' | 'client'

const form = reactive({
  fullName: '',
  email: '',
  university: '',
  department: '',
  studentId: '',
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
    errorMessage.value = 'Please agree to the terms and conditions to proceed.'
    return
  }

  isSubmitting.value = true

  setTimeout(() => {
    if (selectedRole.value === 'student') {
      registerUser(form)
      isSubmitting.value = false
      router.push('/profile-setup')
    } else {
      registerClient(form)
      isSubmitting.value = false
      router.push('/client/dashboard')
    }
  }, 500)
}
</script>
