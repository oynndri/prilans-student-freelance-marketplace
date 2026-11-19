<template>
  <div class="relative" ref="dropdownRef">
    <button
      @click="isOpen = !isOpen"
      type="button"
      class="w-full flex items-center justify-between p-1.5 -mx-1.5 rounded-lg hover:bg-black/5 transition text-left cursor-pointer select-none"
    >
      <div class="flex items-center gap-2.5 min-w-0">
        <div class="relative w-8 h-8 rounded-full overflow-hidden shrink-0 bg-neutral-200 border border-neutral-300">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
            alt="Akmal Nasrulloh"
            class="w-full h-full object-cover"
          />
        </div>
        <div class="min-w-0 flex-1">
          <div class="text-[13px] font-semibold text-neutral-900 leading-tight truncate">
            Akmal Nasrulloh
          </div>
          <div class="text-[11px] text-neutral-400 font-normal truncate leading-tight">
            akmalnslrh@gmail.com
          </div>
        </div>
      </div>
      <ChevronDown class="w-3.5 h-3.5 text-neutral-400 shrink-0 ml-1 transition-transform" :class="{ 'rotate-180': isOpen }" />
    </button>

    <!-- Dropdown Menu -->
    <div
      v-if="isOpen"
      class="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-neutral-200/80 py-1.5 z-50 text-[13px]"
    >
      <div class="px-3 py-1.5 border-b border-neutral-100">
        <p class="font-medium text-neutral-800">Student Profile</p>
        <p class="text-xs text-neutral-400">Computer Science • Level 3</p>
      </div>
      <button class="w-full text-left px-3 py-1.5 text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 flex items-center gap-2">
        <span>Edit Profile</span>
      </button>
      <button class="w-full text-left px-3 py-1.5 text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 flex items-center gap-2">
        <span>Billing & Wallet</span>
      </button>
      <button class="w-full text-left px-3 py-1.5 text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 flex items-center gap-2">
        <span>Account Settings</span>
      </button>
      <div class="my-1 border-t border-neutral-100"></div>
      <button class="w-full text-left px-3 py-1.5 text-red-600 hover:bg-red-50 flex items-center gap-2">
        <span>Sign Out</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { ChevronDown } from 'lucide-vue-next'

const isOpen = ref(false)
const dropdownRef = ref(null)

const handleClickOutside = (e) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside)
})
</script>
