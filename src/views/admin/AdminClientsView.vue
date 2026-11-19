<template>
  <div class="space-y-6">
    <!-- Top Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
          Client Management
        </h1>
        <p class="text-xs text-neutral-500 mt-0.5">
          Oversee registered businesses, company profiles, published opportunities, and accounts.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <span class="text-xs font-bold px-3 py-1.5 rounded-xl bg-neutral-100 border border-neutral-200 text-neutral-800">
          {{ filteredClients.length }} Client(s) Registered
        </span>
      </div>
    </div>

    <!-- Search & Filter Controls -->
    <div class="bg-white p-4 rounded-2xl border border-neutral-200/90 shadow-2xs flex flex-col sm:flex-row gap-3 items-center justify-between">
      <div class="relative w-full sm:w-80">
        <Search class="w-4 h-4 text-neutral-400 absolute left-3 top-2.5 pointer-events-none" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by client name, company, or location..."
          class="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900"
        />
      </div>

      <div class="flex items-center gap-2 w-full sm:w-auto self-end sm:self-auto text-xs">
        <span class="text-neutral-400 font-semibold">Status:</span>
        <select
          v-model="statusFilter"
          class="px-3 py-2 rounded-xl border border-neutral-200 bg-white font-medium text-neutral-700 focus:outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active Only</option>
          <option value="suspended">Suspended Only</option>
        </select>
      </div>
    </div>

    <!-- Clients Table -->
    <div class="bg-white rounded-2xl border border-neutral-200/90 shadow-2xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-neutral-600">
          <thead class="bg-neutral-50 text-neutral-400 font-semibold uppercase text-[10px] tracking-wider border-b border-neutral-100">
            <tr>
              <th class="py-3 px-4">Client Contact</th>
              <th class="py-3 px-4">Company Name</th>
              <th class="py-3 px-4">Location</th>
              <th class="py-3 px-4">Published Projects</th>
              <th class="py-3 px-4">Status</th>
              <th class="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-100">
            <tr
              v-for="client in filteredClients"
              :key="client.id"
              class="hover:bg-neutral-50/60 transition"
            >
              <!-- Name & Email -->
              <td class="py-3.5 px-4 font-semibold text-neutral-900">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full overflow-hidden bg-neutral-200 shrink-0 border border-neutral-200">
                    <img :src="client.avatar" :alt="client.fullName" class="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div class="font-bold text-neutral-900">{{ client.fullName }}</div>
                    <div class="text-[11px] text-neutral-400 font-normal">{{ client.email }}</div>
                  </div>
                </div>
              </td>

              <!-- Company -->
              <td class="py-3.5 px-4 font-medium text-neutral-800">
                {{ client.company || 'Private Employer' }}
              </td>

              <!-- Location -->
              <td class="py-3.5 px-4 text-neutral-600">
                {{ client.location || 'Remote' }}
              </td>

              <!-- Project Count -->
              <td class="py-3.5 px-4">
                <span class="font-bold text-neutral-900">{{ getClientProjectCount(client.id) }}</span>
                <span class="text-neutral-400"> listings</span>
              </td>

              <!-- Status -->
              <td class="py-3.5 px-4">
                <span
                  class="px-2.5 py-0.5 rounded-full text-[10px] font-semibold"
                  :class="client.status === 'suspended' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'"
                >
                  {{ client.status || 'active' }}
                </span>
              </td>

              <!-- Actions -->
              <td class="py-3.5 px-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button
                    @click="viewClientModal(client)"
                    class="px-2.5 py-1 rounded-lg border border-neutral-200 text-neutral-700 hover:bg-neutral-100 text-xs font-semibold transition cursor-pointer"
                  >
                    Details
                  </button>

                  <button
                    v-if="client.status === 'suspended'"
                    @click="promptToggleStatus(client, 'active')"
                    class="px-2.5 py-1 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 text-xs font-semibold transition cursor-pointer"
                  >
                    Reactivate
                  </button>
                  <button
                    v-else
                    @click="promptToggleStatus(client, 'suspended')"
                    class="px-2.5 py-1 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-semibold transition cursor-pointer"
                  >
                    Suspend
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="filteredClients.length === 0" class="p-10 text-center text-xs text-neutral-400">
        No clients found matching your query.
      </div>
    </div>

    <!-- Client Profile Modal View -->
    <Teleport to="body">
      <div
        v-if="activeClientModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
        role="dialog"
        aria-modal="true"
      >
        <div class="bg-white rounded-2xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-neutral-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
          <div class="flex items-start justify-between border-b border-neutral-100 pb-3">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-full overflow-hidden border border-neutral-200">
                <img :src="activeClientModal.avatar" :alt="activeClientModal.fullName" class="w-full h-full object-cover" />
              </div>
              <div>
                <h3 class="text-base font-bold text-neutral-900">{{ activeClientModal.fullName }}</h3>
                <p class="text-xs text-neutral-500">{{ activeClientModal.company }}</p>
              </div>
            </div>
            <button @click="activeClientModal = null" class="text-neutral-400 hover:text-black p-1">
              <X class="w-5 h-5" />
            </button>
          </div>

          <div class="space-y-3 text-xs">
            <div class="grid grid-cols-2 gap-3 p-3 bg-neutral-50 rounded-xl">
              <div>
                <span class="text-neutral-400 block text-[11px]">Work Email</span>
                <span class="font-bold text-neutral-800">{{ activeClientModal.email }}</span>
              </div>
              <div>
                <span class="text-neutral-400 block text-[11px]">Headquarters</span>
                <span class="font-bold text-neutral-800">{{ activeClientModal.location || 'Remote' }}</span>
              </div>
              <div>
                <span class="text-neutral-400 block text-[11px]">Account Status</span>
                <span class="font-bold capitalize" :class="activeClientModal.status === 'suspended' ? 'text-red-600' : 'text-green-600'">
                  {{ activeClientModal.status || 'active' }}
                </span>
              </div>
              <div>
                <span class="text-neutral-400 block text-[11px]">Total Projects</span>
                <span class="font-bold text-neutral-800">{{ getClientProjectCount(activeClientModal.id) }} listings</span>
              </div>
            </div>

            <div>
              <span class="text-neutral-400 font-semibold block mb-1">Company Overview</span>
              <p class="text-neutral-700 leading-relaxed bg-neutral-50 p-3 rounded-xl">
                {{ activeClientModal.bio || 'Registered hiring client organization.' }}
              </p>
            </div>
          </div>

          <div class="pt-3 border-t border-neutral-100 flex justify-end">
            <button
              @click="activeClientModal = null"
              class="px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-black transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Suspend / Reactivate Confirmation Modal -->
    <Teleport to="body">
      <div
        v-if="actionClient"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
        role="dialog"
        aria-modal="true"
      >
        <div class="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-neutral-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
          <div class="flex items-center gap-3" :class="targetActionStatus === 'suspended' ? 'text-red-600' : 'text-green-600'">
            <AlertTriangle class="w-5 h-5 shrink-0" />
            <h3 class="text-sm font-bold text-neutral-900">
              Confirm Account {{ targetActionStatus === 'suspended' ? 'Suspension' : 'Reactivation' }}
            </h3>
          </div>
          <p class="text-xs text-neutral-500 leading-relaxed">
            Are you sure you want to mark client <strong class="text-neutral-900">{{ actionClient.fullName }}</strong> ({{ actionClient.company }}) as <strong class="capitalize">{{ targetActionStatus }}</strong>?
          </p>
          <div class="flex gap-2 pt-2">
            <button
              @click="actionClient = null"
              class="flex-1 py-2 rounded-xl bg-neutral-100 text-neutral-700 text-xs font-semibold hover:bg-neutral-200 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              @click="confirmStatusChange"
              class="flex-1 py-2 rounded-xl text-white text-xs font-semibold transition cursor-pointer shadow-xs"
              :class="targetActionStatus === 'suspended' ? 'bg-red-600 hover:bg-red-700' : 'bg-[#16a34a] hover:bg-green-700'"
            >
              Confirm {{ targetActionStatus }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Search, X, AlertTriangle } from 'lucide-vue-next'
import { getRegisteredUsers, updateUserRecord } from '../../data/auth'
import { projectState } from '../../data/projectService'

const searchQuery = ref('')
const statusFilter = ref('all')
const activeClientModal = ref(null)
const actionClient = ref(null)
const targetActionStatus = ref('suspended')

const allClients = computed(() => {
  return getRegisteredUsers().filter(u => u.role === 'client')
})

const getClientProjectCount = (clientId) => {
  return projectState.projects.filter(p => p.clientId === clientId).length
}

const filteredClients = computed(() => {
  let list = allClients.value

  if (statusFilter.value !== 'all') {
    list = list.filter(c => (c.status || 'active') === statusFilter.value)
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    list = list.filter(c => {
      const nameMatch = (c.fullName || '').toLowerCase().includes(q)
      const companyMatch = (c.company || '').toLowerCase().includes(q)
      const locMatch = (c.location || '').toLowerCase().includes(q)
      const emailMatch = (c.email || '').toLowerCase().includes(q)
      return nameMatch || companyMatch || locMatch || emailMatch
    })
  }

  return list
})

const viewClientModal = (client) => {
  activeClientModal.value = client
}

const promptToggleStatus = (client, status) => {
  actionClient.value = client
  targetActionStatus.value = status
}

const confirmStatusChange = () => {
  if (actionClient.value) {
    updateUserRecord(actionClient.value.id, { status: targetActionStatus.value })
    actionClient.value = null
  }
}
</script>
