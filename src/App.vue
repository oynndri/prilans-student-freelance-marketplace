<template>
  <div class="w-full min-h-screen h-[100dvh] flex flex-col bg-[#f1f4f9] text-[#0f172a] overflow-hidden antialiased font-sans">
    <!-- Full-Screen Initial Branded Loading Screen -->
    <AppLoadingScreen :is-loading="isLoading" />

    <!-- Top Navigation Bar for Mobile and Tablet (<1024px) -->
    <header class="lg:hidden shrink-0 flex items-center justify-between px-4 py-3.5 bg-white border-b border-[#e2e8f0] shadow-xs z-30">
      <router-link :to="isAdmin ? '/admin/dashboard' : '/'" class="flex items-center gap-2.5">
        <div
          class="w-8 h-8 rounded-xl text-white flex items-center justify-center font-black text-sm"
          :class="isAdmin ? 'bg-red-600' : 'bg-[#0f172a]'"
        >
          <span>P</span>
        </div>
        <span class="text-lg font-extrabold tracking-tight text-neutral-900">
          Prilans<span :class="isAdmin ? 'text-red-500' : 'text-[#22c55e]'">.</span>
        </span>
      </router-link>

      <div class="flex items-center gap-2">
        <button
          @click="isMobileMenuOpen = !isMobileMenuOpen"
          class="p-2 rounded-xl bg-neutral-100 border border-neutral-200/80 text-neutral-700 hover:bg-neutral-200 transition cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          <Menu class="w-5 h-5" />
        </button>
      </div>
    </header>

    <!-- Main Application Shell -->
    <div class="flex flex-1 min-h-0 w-full overflow-hidden">
      <!-- Admin Sidebar (when on Admin pages and logged in as Admin) -->
      <div v-if="isAdminRoute && !isAuthPage" class="hidden lg:block shrink-0 h-full">
        <AdminSidebar />
      </div>

      <!-- Standard Student / Client Sidebar (when on non-admin routes) -->
      <div v-else-if="!isAuthPage" class="hidden lg:block shrink-0 h-full">
        <AppSidebar
          :active-nav="activeNav"
          @select-nav="handleNavSelect"
          @upgrade="showUpgradeModal = true"
        />
      </div>

      <!-- Mobile/Tablet Drawer Navigation with Backdrop -->
      <Teleport to="body">
        <div
          v-if="isMobileMenuOpen && !isAuthPage"
          class="fixed inset-0 z-50 lg:hidden flex"
          role="dialog"
          aria-modal="true"
        >
          <!-- Backdrop overlay -->
          <div
            class="fixed inset-0 bg-black/50 backdrop-blur-2xs transition-opacity"
            @click="isMobileMenuOpen = false"
          ></div>

          <!-- Slide-out Drawer Panel -->
          <div class="relative w-[280px] max-w-[85vw] bg-[#f8fafc] h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            <!-- Header of drawer -->
            <div class="flex items-center justify-between p-4 border-b border-neutral-200/70">
              <router-link to="/" @click="isMobileMenuOpen = false" class="flex items-center gap-2">
                <div class="w-7 h-7 rounded-lg bg-[#0f172a] text-white flex items-center justify-center font-bold text-xs">
                  <span>P</span>
                </div>
                <span class="font-extrabold text-neutral-900 text-base">Prilans<span class="text-[#22c55e]">.</span></span>
              </router-link>
              <button
                @click="isMobileMenuOpen = false"
                class="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-200/60 transition cursor-pointer"
                aria-label="Close navigation menu"
              >
                <X class="w-5 h-5" />
              </button>
            </div>

            <!-- Drawer body -->
            <div class="flex-1 overflow-y-auto">
              <AdminSidebar v-if="isAdminRoute" />
              <AppSidebar
                v-else
                :active-nav="activeNav"
                @select-nav="handleNavSelect"
                @upgrade="showUpgradeModal = true; isMobileMenuOpen = false"
              />
            </div>
          </div>
        </div>
      </Teleport>

      <!-- Main Content Area: Fills remaining viewport, scrolls vertically independently -->
      <main
        class="flex-1 min-w-0 h-full overflow-y-auto"
        :class="isAuthPage ? 'p-0' : 'bg-[#f1f4f9] p-4 sm:p-6 md:p-8 xl:p-10'"
      >
        <div :class="isAuthPage ? 'w-full' : 'max-w-[1600px] mx-auto w-full'">
          <!-- Dynamic Route View -->
          <router-view />
        </div>
      </main>
    </div>

    <!-- Upgrade Modal (when clicking Plus Plan Upgrade Now) -->
    <Teleport to="body">
      <div
        v-if="showUpgradeModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
        role="dialog"
        aria-modal="true"
      >
        <div class="bg-white rounded-2xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-150">
          <div class="flex justify-between items-start mb-4">
            <div class="flex items-center gap-3">
              <span class="w-9 h-9 rounded-xl bg-[#22c55e] flex items-center justify-center text-white shadow-xs">
                <Rocket class="w-4 h-4 fill-white" />
              </span>
              <div>
                <h3 class="text-lg font-bold text-neutral-900">Upgrade to Plus Plan</h3>
                <p class="text-[11px] text-neutral-400">Exclusive student freelance advantages</p>
              </div>
            </div>
            <button @click="showUpgradeModal = false" class="text-neutral-400 hover:text-black p-1">
              <X class="w-5 h-5" />
            </button>
          </div>
          <p class="text-xs text-neutral-500 mb-4 leading-relaxed">
            Gain student-first superpowers: view competitor proposal prices, send 50 free monthly proposals, and enjoy guaranteed escrow payouts.
          </p>
          <div class="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/80 mb-5">
            <div class="flex justify-between items-center text-xs">
              <div>
                <span class="font-semibold text-neutral-900 block">Student Plus Monthly</span>
                <span class="text-[11px] text-neutral-400">Billed monthly, cancel anytime</span>
              </div>
              <span class="font-extrabold text-neutral-900 text-base">$9.99<span class="text-xs font-normal text-neutral-500">/mo</span></span>
            </div>
          </div>
          <div class="flex gap-2.5">
            <button
              @click="showUpgradeModal = false"
              class="flex-1 py-2.5 rounded-xl bg-neutral-100 text-neutral-700 text-xs font-semibold hover:bg-neutral-200 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              @click="showUpgradeModal = false"
              class="flex-1 py-2.5 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-black transition cursor-pointer shadow-xs active:scale-[0.98]"
            >
              Confirm Upgrade
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import {
  Menu,
  X,
  Rocket
} from 'lucide-vue-next'
import AppLoadingScreen from './components/AppLoadingScreen.vue'
import AppSidebar from './components/AppSidebar.vue'
import AdminSidebar from './components/AdminSidebar.vue'
import { isAdmin } from './data/auth'

const route = useRoute()
const isLoading = ref(true)
const activeNav = ref('find-project')
const isMobileMenuOpen = ref(false)
const showUpgradeModal = ref(false)

const isAuthPage = computed(() => {
  return ['/register', '/login', '/client/register', '/client/login', '/admin/login'].includes(route.path)
})

const isAdminRoute = computed(() => {
  return route.path.startsWith('/admin')
})

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 900)
})

const handleNavSelect = (id) => {
  activeNav.value = id
  isMobileMenuOpen.value = false
}
</script>
