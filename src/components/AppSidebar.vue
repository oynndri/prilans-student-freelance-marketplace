<template>
  <aside
    class="w-[240px] shrink-0 bg-[#f8fafc] border-r border-[#e2e8f0] flex flex-col justify-between py-5 px-4 select-none min-h-screen lg:min-h-0"
  >
    <!-- Top Branding & Navigation -->
    <div class="space-y-6">
      <!-- Brand Logo -->
      <div class="flex items-center gap-2.5 px-2">
        <!-- Logo icon matching the reference (speech bubble with outline) -->
        <div class="relative w-8 h-8 rounded-lg border-2 border-neutral-900 flex items-center justify-center font-bold text-neutral-900">
          <div class="w-3.5 h-3.5 border-t-2 border-l-2 border-neutral-900 absolute -bottom-1 -left-1 bg-[#f8fafc] transform rotate-45"></div>
          <span class="text-xs tracking-tighter">💬</span>
        </div>
        <span class="text-[19px] font-extrabold tracking-tight text-neutral-900">
          Prilans<span class="text-neutral-900 font-black">.</span>
        </span>
      </div>

      <!-- User Profile Dropdown -->
      <div class="px-1">
        <UserProfileDropdown />
      </div>

      <!-- Navigation Section 1: MENU -->
      <div>
        <div class="text-[10px] font-bold tracking-wider text-neutral-400 uppercase px-2 mb-2">
          MENU
        </div>
        <nav class="space-y-1">
          <button
            v-for="item in menuItems"
            :key="item.id"
            @click="$emit('select-nav', item.id)"
            type="button"
            class="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium transition-all text-left cursor-pointer"
            :class="[
              activeNav === item.id
                ? 'bg-white text-neutral-900 shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-neutral-200/90 font-semibold'
                : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/50'
            ]"
          >
            <component
              :is="item.icon"
              class="w-4 h-4 shrink-0"
              :class="activeNav === item.id ? 'text-neutral-900 stroke-[2.2]' : 'text-neutral-400 stroke-[1.8]'"
            />
            <span>{{ item.label }}</span>
          </button>
        </nav>
      </div>

      <!-- Navigation Section 2: PREFERENCES -->
      <div>
        <div class="text-[10px] font-bold tracking-wider text-neutral-400 uppercase px-2 mb-2">
          PREFERENCES
        </div>
        <nav class="space-y-1">
          <button
            v-for="item in preferenceItems"
            :key="item.id"
            @click="$emit('select-nav', item.id)"
            type="button"
            class="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium transition-all text-left cursor-pointer"
            :class="[
              activeNav === item.id
                ? 'bg-white text-neutral-900 shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-neutral-200/90 font-semibold'
                : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/50'
            ]"
          >
            <component
              :is="item.icon"
              class="w-4 h-4 shrink-0"
              :class="activeNav === item.id ? 'text-neutral-900 stroke-[2.2]' : 'text-neutral-400 stroke-[1.8]'"
            />
            <span>{{ item.label }}</span>
          </button>
        </nav>
      </div>
    </div>

    <!-- Bottom Promo: Plus Plan -->
    <div class="pt-6">
      <PlusPlanCard @upgrade="$emit('upgrade')" />
    </div>
  </aside>
</template>

<script setup>
import {
  Search,
  Users,
  Building2,
  FileText,
  Mail,
  Bell,
  Settings,
  HelpCircle
} from 'lucide-vue-next'
import UserProfileDropdown from './UserProfileDropdown.vue'
import PlusPlanCard from './PlusPlanCard.vue'

defineProps({
  activeNav: {
    type: String,
    default: 'find-project'
  }
})

defineEmits(['select-nav', 'upgrade'])

const menuItems = [
  { id: 'find-project', label: 'Find Project', icon: Search },
  { id: 'find-freelancers', label: 'Find Freelancers', icon: Users },
  { id: 'companies', label: 'Companies', icon: Building2 },
  { id: 'my-proposal', label: 'My Proposal', icon: FileText },
  { id: 'message', label: 'Message', icon: Mail },
  { id: 'notification', label: 'Notification', icon: Bell }
]

const preferenceItems = [
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'help', label: 'Help', icon: HelpCircle }
]
</script>
