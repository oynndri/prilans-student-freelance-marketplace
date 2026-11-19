<template>
  <div class="w-full min-h-screen h-[100dvh] flex flex-col bg-[#f1f4f9] text-[#0f172a] overflow-hidden antialiased font-sans">
    <!-- Full-Screen Initial Branded Loading Screen -->
    <AppLoadingScreen :is-loading="isLoading" />

    <!-- Top Navigation Bar for Mobile and Tablet (<1024px) -->
    <header class="lg:hidden shrink-0 flex items-center justify-between px-4 py-3.5 bg-white border-b border-[#e2e8f0] shadow-xs z-30">
      <router-link to="/" class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-xl bg-[#0f172a] text-white flex items-center justify-center font-black text-sm">
          <span>P</span>
        </div>
        <span class="text-lg font-extrabold tracking-tight text-neutral-900">
          Prilans<span class="text-[#22c55e]">.</span>
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
      <!-- Desktop Fixed/Sticky Sidebar (lg:block, width 260px) - Hidden on auth pages -->
      <div v-if="!isAuthPage" class="hidden lg:block shrink-0 h-full">
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
              <AppSidebar
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
          <!-- Secondary Nav Placeholders when on home route but non-find-project active -->
          <div
            v-if="!isAuthPage && route.path === '/' && activeNav !== 'find-project'"
            class="bg-white rounded-2xl p-8 sm:p-12 border border-neutral-200/90 shadow-xs text-center py-20 max-w-2xl mx-auto my-8"
          >
            <div class="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-4 text-neutral-700">
              <Component :is="currentNavIcon" class="w-7 h-7 stroke-[1.8]" />
            </div>
            <h2 class="text-xl sm:text-2xl font-bold text-neutral-900 capitalize mb-2">
              {{ currentNavTitle }}
            </h2>
            <p class="text-sm text-neutral-500 leading-relaxed max-w-md mx-auto mb-6">
              This section is configured for student freelancers and clients. Switch back to Find Projects to browse opportunities.
            </p>
            <button
              @click="activeNav = 'find-project'"
              class="px-5 py-2.5 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-black transition cursor-pointer shadow-xs active:scale-[0.98]"
            >
              Back to Find Projects
            </button>
          </div>

          <!-- Dynamic Route View -->
          <router-view v-else />
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
  Search,
  UserCheck,
  Building2,
  FileText,
  Mail,
  Bell,
  Settings,
  HelpCircle,
  Rocket
} from 'lucide-vue-next'
import AppLoadingScreen from './components/AppLoadingScreen.vue'
import AppSidebar from './components/AppSidebar.vue'

const route = useRoute()
const isLoading = ref(true)
const activeNav = ref('find-project')
const isMobileMenuOpen = ref(false)
const showUpgradeModal = ref(false)

const isAuthPage = computed(() => {
  return ['/register', '/login'].includes(route.path)
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

const navMeta = {
  'find-project': { title: 'Find Project', icon: Search },
  'student-profile': { title: 'My Skill Profile', icon: UserCheck },
  'companies': { title: 'Companies', icon: Building2 },
  'my-proposal': { title: 'My Proposal', icon: FileText },
  'message': { title: 'Message', icon: Mail },
  'notification': { title: 'Notification', icon: Bell },
  'settings': { title: 'Settings', icon: Settings },
  'help': { title: 'Help & Support', icon: HelpCircle }
}

const currentNavTitle = computed(() => navMeta[activeNav.value]?.title || 'Section')
const currentNavIcon = computed(() => navMeta[activeNav.value]?.icon || Search)
</script>
