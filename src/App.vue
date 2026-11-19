<template>
  <div class="min-h-screen bg-[#eef1f5] text-[#0f172a] p-2 sm:p-4 md:p-6 lg:p-8 flex justify-center font-sans">
    <!-- Simulated Browser Window Container matching reference frame -->
    <div
      class="w-full max-w-[1440px] bg-white rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.08)] border border-neutral-200/90 overflow-hidden flex flex-col"
    >
      <!-- Simulated Browser Top Chrome / Nav Bar (like the reference screenshot) -->
      <header
        class="bg-[#f8fafc] border-b border-[#e2e8f0] px-4 py-3 flex items-center justify-between text-neutral-500 text-xs select-none"
      >
        <!-- Window Traffic Lights (Red, Yellow, Green) -->
        <div class="flex items-center gap-2">
          <div class="flex items-center gap-1.5 mr-2">
            <span class="w-2.5 h-2.5 rounded-full bg-[#ef4444]"></span>
            <span class="w-2.5 h-2.5 rounded-full bg-[#f59e0b]"></span>
            <span class="w-2.5 h-2.5 rounded-full bg-[#10b981]"></span>
          </div>

          <!-- Browser History & Tabs Controls -->
          <div class="hidden sm:flex items-center gap-2 text-neutral-400">
            <button class="hover:text-neutral-700 transition"><PanelLeft class="w-3.5 h-3.5" /></button>
            <button class="hover:text-neutral-700 transition"><ChevronLeft class="w-3.5 h-3.5" /></button>
            <button class="hover:text-neutral-700 transition"><ChevronRight class="w-3.5 h-3.5" /></button>
          </div>
        </div>

        <!-- Center Address Bar -->
        <div class="flex-1 max-w-sm sm:max-w-md mx-3">
          <div class="bg-white border border-neutral-200/90 rounded-lg px-3 py-1 flex items-center justify-center gap-2 text-[12px] text-neutral-600 shadow-2xs">
            <ShieldCheck class="w-3.5 h-3.5 text-neutral-400" />
            <span class="font-medium text-neutral-700">prilans.com</span>
            <RotateCw class="w-3 h-3 text-neutral-400 ml-auto hidden sm:block" />
          </div>
        </div>

        <!-- Right Browser Icons -->
        <div class="flex items-center gap-3 text-neutral-400">
          <button class="hover:text-neutral-700 transition"><Share2 class="w-3.5 h-3.5" /></button>
          <button class="hover:text-neutral-700 transition"><Plus class="w-3.5 h-3.5" /></button>
          <button class="hover:text-neutral-700 transition"><Copy class="w-3.5 h-3.5" /></button>
        </div>
      </header>

      <!-- Mobile Top Navigation Bar (Shown on small screens to toggle sidebar) -->
      <div class="lg:hidden flex items-center justify-between px-4 py-3 bg-[#f8fafc] border-b border-[#e2e8f0]">
        <div class="flex items-center gap-2 font-extrabold text-neutral-900 text-base">
          <span>Prilans.</span>
        </div>
        <button
          @click="isMobileMenuOpen = !isMobileMenuOpen"
          class="p-2 rounded-lg bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100 transition"
        >
          <Menu class="w-5 h-5" />
        </button>
      </div>

      <!-- Main Application Layout Body -->
      <div class="flex flex-1 relative min-h-[850px] bg-[#f8fafc]">
        <!-- Desktop Sidebar -->
        <div class="hidden lg:block shrink-0">
          <AppSidebar
            :active-nav="activeNav"
            @select-nav="handleNavSelect"
            @upgrade="showUpgradeModal = true"
          />
        </div>

        <!-- Mobile Drawer Sidebar -->
        <div
          v-if="isMobileMenuOpen"
          class="fixed inset-0 z-50 lg:hidden flex"
        >
          <!-- Backdrop -->
          <div class="fixed inset-0 bg-black/40 backdrop-blur-xs" @click="isMobileMenuOpen = false"></div>
          <!-- Drawer Content -->
          <div class="relative w-[260px] bg-[#f8fafc] h-full shadow-2xl flex flex-col z-10">
            <div class="flex justify-end p-2">
              <button @click="isMobileMenuOpen = false" class="p-1 rounded-lg text-neutral-500 hover:text-black">
                <X class="w-5 h-5" />
              </button>
            </div>
            <div class="flex-1 overflow-y-auto">
              <AppSidebar
                :active-nav="activeNav"
                @select-nav="handleNavSelect"
                @upgrade="showUpgradeModal = true; isMobileMenuOpen = false"
              />
            </div>
          </div>
        </div>

        <!-- Main Content Area -->
        <main class="flex-1 p-4 sm:p-6 lg:p-7 min-w-0 overflow-y-auto">
          <!-- Primary Find Projects View -->
          <FindProjects v-if="activeNav === 'find-project'" />

          <!-- Placeholder Views for Secondary Navigation items -->
          <div v-else class="bg-white rounded-2xl p-8 border border-neutral-200/90 shadow-sm text-center py-20">
            <div class="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-3 text-neutral-600">
              <Component :is="currentNavIcon" class="w-6 h-6 stroke-[1.8]" />
            </div>
            <h2 class="text-xl font-bold text-neutral-900 capitalize mb-1">
              {{ currentNavTitle }}
            </h2>
            <p class="text-sm text-neutral-500 max-w-md mx-auto mb-5">
              This section is configured for student freelancers and clients. Switch back to Find Project to view live marketplace postings.
            </p>
            <button
              @click="activeNav = 'find-project'"
              class="px-5 py-2.5 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-black transition cursor-pointer"
            >
              Back to Find Project
            </button>
          </div>
        </main>
      </div>
    </div>

    <!-- Upgrade Modal (when clicking Plus Plan Upgrade Now) -->
    <div
      v-if="showUpgradeModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
    >
      <div class="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-neutral-200">
        <div class="flex justify-between items-start mb-4">
          <div class="flex items-center gap-2">
            <span class="w-8 h-8 rounded-xl bg-[#22c55e] flex items-center justify-center text-white">
              <Rocket class="w-4 h-4 fill-white" />
            </span>
            <h3 class="text-lg font-bold text-neutral-900">Upgrade to Plus Plan</h3>
          </div>
          <button @click="showUpgradeModal = false" class="text-neutral-400 hover:text-black">
            <X class="w-5 h-5" />
          </button>
        </div>
        <p class="text-xs text-neutral-500 mb-4 leading-relaxed">
          Gain student-first superpowers: view competitor proposal prices, send 50 free monthly proposals, and enjoy guaranteed escrow payouts.
        </p>
        <div class="p-3 bg-neutral-50 rounded-xl border border-neutral-200/80 mb-5">
          <div class="flex justify-between items-center text-xs">
            <span class="font-semibold text-neutral-900">Student Plus Monthly</span>
            <span class="font-extrabold text-neutral-900 text-sm">$9.99/mo</span>
          </div>
        </div>
        <div class="flex gap-2">
          <button
            @click="showUpgradeModal = false"
            class="flex-1 py-2.5 rounded-xl bg-neutral-100 text-neutral-700 text-xs font-semibold hover:bg-neutral-200 transition"
          >
            Cancel
          </button>
          <button
            @click="showUpgradeModal = false"
            class="flex-1 py-2.5 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-black transition"
          >
            Confirm Upgrade
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  PanelLeft,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  RotateCw,
  Share2,
  Plus,
  Copy,
  Menu,
  X,
  Search,
  Users,
  Building2,
  FileText,
  Mail,
  Bell,
  Settings,
  HelpCircle,
  Rocket
} from 'lucide-vue-next'
import AppSidebar from './components/AppSidebar.vue'
import FindProjects from './views/FindProjects.vue'

const activeNav = ref('find-project')
const isMobileMenuOpen = ref(false)
const showUpgradeModal = ref(false)

const handleNavSelect = (id) => {
  activeNav.value = id
  isMobileMenuOpen.value = false
}

const navMeta = {
  'find-project': { title: 'Find Project', icon: Search },
  'find-freelancers': { title: 'Find Freelancers', icon: Users },
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
