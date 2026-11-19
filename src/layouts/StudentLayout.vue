<template>
  <div class="w-full min-h-screen h-[100dvh] flex flex-col modern-luxury-bg text-slate-100 overflow-hidden antialiased font-sans">
    <!-- Mobile Header -->
    <header class="lg:hidden shrink-0 flex items-center justify-between px-4 py-3.5 glass-header shadow-md z-30">
      <router-link to="/student/dashboard" class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center font-black text-sm shadow-md shadow-indigo-500/30">
          <span>P</span>
        </div>
        <span class="text-lg font-extrabold tracking-tight text-white">
          Prilans<span class="text-emerald-400">.</span>
        </span>
      </router-link>

      <button
        @click="isMobileMenuOpen = !isMobileMenuOpen"
        class="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-200 hover:bg-white/10 transition cursor-pointer"
        aria-label="Toggle navigation menu"
      >
        <Menu class="w-5 h-5" />
      </button>
    </header>

    <!-- Main Shell -->
    <div class="flex flex-1 min-h-0 w-full overflow-hidden">
      <!-- Fixed Desktop Student Sidebar -->
      <div class="hidden lg:block shrink-0 h-full">
        <StudentSidebar @upgrade="showUpgradeModal = true" />
      </div>

      <!-- Mobile Drawer -->
      <Teleport to="body">
        <div
          v-if="isMobileMenuOpen"
          class="fixed inset-0 z-50 lg:hidden flex"
          role="dialog"
          aria-modal="true"
        >
          <div
            class="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            @click="isMobileMenuOpen = false"
          ></div>

          <div class="relative w-[280px] max-w-[85vw] glass-dropdown h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200 border-r border-white/10">
            <div class="flex items-center justify-between p-4 border-b border-white/10">
              <router-link to="/student/dashboard" @click="isMobileMenuOpen = false" class="flex items-center gap-2">
                <div class="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  <span>P</span>
                </div>
                <span class="font-extrabold text-white text-base">Prilans<span class="text-emerald-400">.</span></span>
              </router-link>
              <button
                @click="isMobileMenuOpen = false"
                class="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <X class="w-5 h-5" />
              </button>
            </div>
            <div class="flex-1 overflow-y-auto">
              <StudentSidebar @upgrade="showUpgradeModal = true; isMobileMenuOpen = false" />
            </div>
          </div>
        </div>
      </Teleport>

      <!-- Main Content Area -->
      <main class="flex-1 min-w-0 h-full overflow-y-auto p-4 sm:p-6 md:p-8 xl:p-10">
        <div class="max-w-[1600px] mx-auto w-full">
          <slot />
        </div>
      </main>
    </div>

    <!-- Upgrade Modal -->
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
import { ref } from 'vue'
import { Menu, X, Rocket } from 'lucide-vue-next'
import StudentSidebar from '../components/student/StudentSidebar.vue'

const isMobileMenuOpen = ref(false)
const showUpgradeModal = ref(false)
</script>
