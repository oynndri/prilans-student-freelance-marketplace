<template>
  <div class="w-full min-h-screen h-[100dvh] flex flex-col bg-[#0f172a] text-white overflow-hidden antialiased font-sans">
    <!-- Mobile Header -->
    <header class="lg:hidden shrink-0 flex items-center justify-between px-4 py-3.5 bg-neutral-900 border-b border-neutral-800 shadow-xs z-30">
      <router-link to="/admin/dashboard" class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center font-black text-sm">
          <span>P</span>
        </div>
        <span class="text-lg font-extrabold tracking-tight text-white">
          Prilans<span class="text-red-500">.</span>
        </span>
      </router-link>

      <button
        @click="isMobileMenuOpen = !isMobileMenuOpen"
        class="p-2 rounded-xl bg-neutral-800 border border-neutral-700 text-neutral-300 hover:bg-neutral-700 transition cursor-pointer"
        aria-label="Toggle navigation menu"
      >
        <Menu class="w-5 h-5" />
      </button>
    </header>

    <!-- Main Shell -->
    <div class="flex flex-1 min-h-0 w-full overflow-hidden">
      <!-- Fixed Desktop Admin Sidebar -->
      <div class="hidden lg:block shrink-0 h-full">
        <AdminSidebar />
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
            class="fixed inset-0 bg-black/60 backdrop-blur-2xs transition-opacity"
            @click="isMobileMenuOpen = false"
          ></div>

          <div class="relative w-[280px] max-w-[85vw] bg-[#0f172a] h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            <div class="flex items-center justify-between p-4 border-b border-white/10">
              <router-link to="/admin/dashboard" @click="isMobileMenuOpen = false" class="flex items-center gap-2">
                <div class="w-7 h-7 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold text-xs">
                  <span>P</span>
                </div>
                <span class="font-extrabold text-white text-base">Prilans<span class="text-red-500">.</span></span>
              </router-link>
              <button
                @click="isMobileMenuOpen = false"
                class="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <X class="w-5 h-5" />
              </button>
            </div>
            <div class="flex-1 overflow-y-auto">
              <AdminSidebar @select-nav="isMobileMenuOpen = false" />
            </div>
          </div>
        </div>
      </Teleport>

      <!-- Main Admin Content Area (Slightly lighter dark/cool slate for crisp contrast) -->
      <main class="flex-1 min-w-0 h-full overflow-y-auto bg-[#f8fafc] text-[#0f172a] p-4 sm:p-6 md:p-8 xl:p-10">
        <div class="max-w-[1600px] mx-auto w-full">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Menu, X } from 'lucide-vue-next'
import AdminSidebar from '../components/AdminSidebar.vue'

const isMobileMenuOpen = ref(false)
</script>
