<template>
  <div class="w-full min-h-screen h-[100dvh] flex flex-col modern-luxury-bg text-slate-100 overflow-hidden antialiased font-sans">
    <!-- Mobile Header -->
    <header class="lg:hidden shrink-0 flex items-center justify-between px-4 py-3.5 glass-header shadow-md z-30">
      <router-link to="/client/dashboard" class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-md shadow-blue-500/30">
          <span>P</span>
        </div>
        <span class="text-lg font-extrabold tracking-tight text-white">
          Prilans<span class="text-blue-400">.</span>
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
            class="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            @click="isMobileMenuOpen = false"
          ></div>

          <div class="relative w-[280px] max-w-[85vw] glass-dropdown h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200 border-r border-white/10">
            <div class="flex items-center justify-between p-4 border-b border-white/10">
              <router-link to="/client/dashboard" @click="isMobileMenuOpen = false" class="flex items-center gap-2">
                <div class="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  <span>P</span>
                </div>
                <span class="font-extrabold text-white text-base">Prilans<span class="text-blue-400">.</span></span>
              </router-link>
              <button
                @click="isMobileMenuOpen = false"
                class="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
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
      <main class="flex-1 min-w-0 h-full overflow-y-auto p-4 sm:p-6 md:p-8 xl:p-10">
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
