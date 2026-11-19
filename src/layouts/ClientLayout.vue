<template>
  <div class="w-full min-h-screen h-[100dvh] flex flex-col bg-[#f1f4f9] text-[#0f172a] overflow-hidden antialiased font-sans">
    <!-- Mobile Header -->
    <header class="lg:hidden shrink-0 flex items-center justify-between px-4 py-3.5 bg-white border-b border-[#e2e8f0] shadow-xs z-30">
      <router-link to="/client/dashboard" class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-xl bg-[#0f172a] text-white flex items-center justify-center font-black text-sm">
          <span>P</span>
        </div>
        <span class="text-lg font-extrabold tracking-tight text-neutral-900">
          Prilans<span class="text-blue-600">.</span>
        </span>
      </router-link>

      <button
        @click="isMobileMenuOpen = !isMobileMenuOpen"
        class="p-2 rounded-xl bg-neutral-100 border border-neutral-200/80 text-neutral-700 hover:bg-neutral-200 transition cursor-pointer"
        aria-label="Toggle navigation menu"
      >
        <Menu class="w-5 h-5" />
      </button>
    </header>

    <!-- Main Shell -->
    <div class="flex flex-1 min-h-0 w-full overflow-hidden">
      <!-- Fixed Desktop Client Sidebar -->
      <div class="hidden lg:block shrink-0 h-full">
        <ClientSidebar />
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
            class="fixed inset-0 bg-black/50 backdrop-blur-2xs transition-opacity"
            @click="isMobileMenuOpen = false"
          ></div>

          <div class="relative w-[280px] max-w-[85vw] bg-[#f8fafc] h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            <div class="flex items-center justify-between p-4 border-b border-neutral-200/70">
              <router-link to="/client/dashboard" @click="isMobileMenuOpen = false" class="flex items-center gap-2">
                <div class="w-7 h-7 rounded-lg bg-[#0f172a] text-white flex items-center justify-center font-bold text-xs">
                  <span>P</span>
                </div>
                <span class="font-extrabold text-neutral-900 text-base">Prilans<span class="text-blue-600">.</span></span>
              </router-link>
              <button
                @click="isMobileMenuOpen = false"
                class="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-200/60 transition cursor-pointer"
              >
                <X class="w-5 h-5" />
              </button>
            </div>
            <div class="flex-1 overflow-y-auto">
              <ClientSidebar @select-nav="isMobileMenuOpen = false" />
            </div>
          </div>
        </div>
      </Teleport>

      <!-- Main Content Area -->
      <main class="flex-1 min-w-0 h-full overflow-y-auto bg-[#f1f4f9] p-4 sm:p-6 md:p-8 xl:p-10">
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
import ClientSidebar from '../components/client/ClientSidebar.vue'

const isMobileMenuOpen = ref(false)
</script>
