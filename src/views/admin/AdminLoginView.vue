<template>
  <div class="min-h-screen bg-[#0f172a] text-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md text-center">
      <!-- Admin Shield Logo -->
      <div class="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-red-600 text-white shadow-lg shadow-red-900/40 mb-3">
        <ShieldAlert class="w-6 h-6 stroke-[2.2]" />
      </div>
      <h2 class="text-2xl font-black tracking-tight text-white">
        Prilans Admin Portal
      </h2>
      <p class="mt-1 text-xs text-neutral-400">
        Platform Governance, Student Verifications & Opportunity Moderation
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-neutral-900/90 py-8 px-6 sm:px-10 border border-neutral-800 rounded-3xl shadow-2xl backdrop-blur-md">
        <!-- Error Alert -->
        <div v-if="errorMessage" class="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
          <AlertCircle class="w-4 h-4 shrink-0 text-red-500" />
          <span>{{ errorMessage }}</span>
        </div>

        <!-- Quick Demo Credentials Box -->
        <div class="mb-5 p-3.5 bg-white/5 border border-white/10 rounded-xl space-y-1">
          <span class="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
            Demo Admin Credentials
          </span>
          <div class="text-xs text-neutral-300 font-mono flex justify-between">
            <span>Email: admin@prilans.demo</span>
            <span>Pass: admin123</span>
          </div>
        </div>

        <form @submit.prevent="handleAdminLogin" class="space-y-4">
          <!-- Email Input -->
          <div>
            <label class="block text-xs font-semibold text-neutral-300 mb-1">
              Admin Email Address <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <Mail class="w-4 h-4 text-neutral-500 absolute left-3 top-3 pointer-events-none" />
              <input
                v-model="email"
                type="email"
                placeholder="admin@prilans.demo"
                required
                class="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl bg-neutral-800/80 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
              />
            </div>
          </div>

          <!-- Password Input -->
          <div>
            <label class="block text-xs font-semibold text-neutral-300 mb-1">
              Admin Password <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <Lock class="w-4 h-4 text-neutral-500 absolute left-3 top-3 pointer-events-none" />
              <input
                v-model="password"
                type="password"
                placeholder="admin123"
                required
                class="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl bg-neutral-800/80 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
              />
            </div>
          </div>

          <!-- Submit Button -->
          <div class="pt-2">
            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition cursor-pointer shadow-md shadow-red-900/30 active:scale-[0.98] disabled:opacity-50"
            >
              <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
              <span>{{ isSubmitting ? 'Authenticating Admin...' : 'Sign In to Admin Console' }}</span>
              <ArrowRight v-if="!isSubmitting" class="w-4 h-4" />
            </button>
          </div>
        </form>

        <div class="mt-6 border-t border-neutral-800 pt-4 flex items-center justify-between text-xs text-neutral-400">
          <router-link to="/" class="hover:text-white transition">
            ← Return to Marketplace
          </router-link>
          <router-link to="/client/login" class="hover:text-white transition">
            Client Portal →
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  ShieldAlert,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  Loader2
} from 'lucide-vue-next'
import { loginUser } from '../../data/auth'

const router = useRouter()
const email = ref('admin@prilans.demo')
const password = ref('admin123')
const isSubmitting = ref(false)
const errorMessage = ref('')

const handleAdminLogin = () => {
  errorMessage.value = ''

  if (email.value.trim().toLowerCase() !== 'admin@prilans.demo' || password.value !== 'admin123') {
    errorMessage.value = 'Invalid admin credentials. Use admin@prilans.demo and admin123.'
    return
  }

  isSubmitting.value = true
  setTimeout(() => {
    loginUser('admin@prilans.demo', 'admin123', 'admin')
    isSubmitting.value = false
    router.push('/admin/dashboard')
  }, 500)
}
</script>
