<template>
  <div class="max-w-3xl mx-auto space-y-6">
    <!-- Top Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
          Notifications
        </h1>
        <p class="text-xs text-neutral-500 mt-0.5">
          Real-time alerts on project applications, client status decisions, and system messages.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          v-if="hasUnread"
          @click="markAllRead"
          class="px-3.5 py-1.5 rounded-xl border border-neutral-200 hover:bg-neutral-100 text-xs font-semibold text-neutral-700 transition cursor-pointer"
        >
          Mark all as read
        </button>
      </div>
    </div>

    <!-- Notifications List -->
    <div class="bg-white rounded-2xl border border-neutral-200/90 shadow-2xs overflow-hidden">
      <div v-if="userNotifications.length > 0" class="divide-y divide-neutral-100">
        <div
          v-for="notif in userNotifications"
          :key="notif.id"
          class="p-5 flex items-start justify-between gap-4 transition"
          :class="notif.isRead ? 'bg-white' : 'bg-blue-50/30'"
        >
          <div class="flex items-start gap-3.5 min-w-0">
            <!-- Icon by type -->
            <div
              class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
              :class="iconBg(notif.type)"
            >
              <CheckCircle2 v-if="notif.type === 'accepted'" class="w-4 h-4 text-green-600" />
              <XCircle v-else-if="notif.type === 'rejected'" class="w-4 h-4 text-red-600" />
              <Send v-else-if="notif.type === 'submission'" class="w-4 h-4 text-blue-600" />
              <Bell v-else class="w-4 h-4 text-neutral-600" />
            </div>

            <!-- Content -->
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <h4 class="text-xs font-bold text-neutral-900" :class="{ 'text-neutral-950 font-extrabold': !notif.isRead }">
                  {{ notif.title }}
                </h4>
                <span v-if="!notif.isRead" class="w-2 h-2 rounded-full bg-blue-600"></span>
              </div>
              <p class="text-xs text-neutral-600 leading-relaxed">
                {{ notif.message }}
              </p>
              <div class="text-[11px] text-neutral-400">
                {{ formatDate(notif.createdAt) }}
              </div>
            </div>
          </div>

          <!-- Mark single read -->
          <button
            v-if="!notif.isRead"
            @click="markRead(notif.id)"
            class="text-[11px] text-blue-600 hover:underline font-semibold shrink-0 cursor-pointer pt-1"
          >
            Mark read
          </button>
        </div>
      </div>

      <div v-else class="p-14 text-center text-xs text-neutral-400 space-y-3">
        <Bell class="w-8 h-8 text-neutral-300 mx-auto" />
        <p>No notifications yet.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  Bell,
  CheckCircle2,
  XCircle,
  Send
} from 'lucide-vue-next'
import { authState } from '../data/auth'
import {
  getNotificationsByUser,
  markNotificationAsRead,
  markAllNotificationsAsRead
} from '../data/applicationService'

const userId = computed(() => authState.currentUser?.id || 'student-akmal')

const userNotifications = computed(() => {
  return getNotificationsByUser(userId.value)
})

const hasUnread = computed(() => {
  return userNotifications.value.some(n => !n.isRead)
})

const markRead = (id) => {
  markNotificationAsRead(id)
}

const markAllRead = () => {
  markAllNotificationsAsRead(userId.value)
}

const iconBg = (type) => {
  switch (type) {
    case 'accepted':
      return 'bg-green-100'
    case 'rejected':
      return 'bg-red-100'
    case 'submission':
      return 'bg-blue-100'
    default:
      return 'bg-neutral-100'
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return 'Recently'
  try {
    return new Date(dateStr).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (e) {
    return 'Recently'
  }
}
</script>
