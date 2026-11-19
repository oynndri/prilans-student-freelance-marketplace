<template>
  <div class="space-y-6">
    <!-- Top Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
          Student Management
        </h1>
        <p class="text-xs text-neutral-500 mt-0.5">
          Verify enrolled learners, inspect skill profiles, and moderate student access.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <span class="text-xs font-bold px-3 py-1.5 rounded-xl bg-neutral-100 border border-neutral-200 text-neutral-800">
          {{ filteredStudents.length }} Student(s) Listed
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
          placeholder="Search by student name, university, or skill..."
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

    <!-- Students Table -->
    <div class="bg-white rounded-2xl border border-neutral-200/90 shadow-2xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-neutral-600">
          <thead class="bg-neutral-50 text-neutral-400 font-semibold uppercase text-[10px] tracking-wider border-b border-neutral-100">
            <tr>
              <th class="py-3 px-4">Student</th>
              <th class="py-3 px-4">University & Dept</th>
              <th class="py-3 px-4">Key Skills</th>
              <th class="py-3 px-4">Status</th>
              <th class="py-3 px-4">Joined</th>
              <th class="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-100">
            <tr
              v-for="student in filteredStudents"
              :key="student.id"
              class="hover:bg-neutral-50/60 transition"
            >
              <!-- Name & Email -->
              <td class="py-3.5 px-4 font-semibold text-neutral-900">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full overflow-hidden bg-neutral-200 shrink-0 border border-neutral-200">
                    <img :src="student.avatar" :alt="student.fullName" class="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div class="font-bold text-neutral-900">{{ student.fullName }}</div>
                    <div class="text-[11px] text-neutral-400 font-normal">{{ student.email }}</div>
                  </div>
                </div>
              </td>

              <!-- University & Dept -->
              <td class="py-3.5 px-4">
                <div class="font-medium text-neutral-800">{{ student.university }}</div>
                <div class="text-[11px] text-neutral-400">{{ student.department }}</div>
              </td>

              <!-- Skills preview -->
              <td class="py-3.5 px-4 max-w-xs">
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="s in (student.skills || []).slice(0, 3)"
                    :key="s"
                    class="px-2 py-0.5 rounded bg-neutral-100 border border-neutral-200 text-[10px] font-medium text-neutral-600"
                  >
                    {{ s }}
                  </span>
                  <span v-if="(student.skills || []).length > 3" class="text-[10px] text-neutral-400">
                    +{{ student.skills.length - 3 }}
                  </span>
                </div>
              </td>

              <!-- Status -->
              <td class="py-3.5 px-4">
                <span
                  class="px-2.5 py-0.5 rounded-full text-[10px] font-semibold"
                  :class="student.status === 'suspended' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'"
                >
                  {{ student.status || 'active' }}
                </span>
              </td>

              <!-- Registration Date -->
              <td class="py-3.5 px-4 text-neutral-400">
                {{ formatDate(student.createdAt) }}
              </td>

              <!-- Actions -->
              <td class="py-3.5 px-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button
                    @click="viewStudentModal(student)"
                    class="px-2.5 py-1 rounded-lg border border-neutral-200 text-neutral-700 hover:bg-neutral-100 text-xs font-semibold transition cursor-pointer"
                  >
                    Profile
                  </button>

                  <button
                    v-if="student.status === 'suspended'"
                    @click="promptToggleStatus(student, 'active')"
                    class="px-2.5 py-1 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 text-xs font-semibold transition cursor-pointer"
                  >
                    Reactivate
                  </button>
                  <button
                    v-else
                    @click="promptToggleStatus(student, 'suspended')"
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

      <div v-if="filteredStudents.length === 0" class="p-10 text-center text-xs text-neutral-400">
        No students matched your search criteria.
      </div>
    </div>

    <!-- Student Profile Modal View -->
    <Teleport to="body">
      <div
        v-if="activeStudentModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
        role="dialog"
        aria-modal="true"
      >
        <div class="bg-white rounded-2xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-neutral-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
          <div class="flex items-start justify-between border-b border-neutral-100 pb-3">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-full overflow-hidden border border-neutral-200">
                <img :src="activeStudentModal.avatar" :alt="activeStudentModal.fullName" class="w-full h-full object-cover" />
              </div>
              <div>
                <h3 class="text-base font-bold text-neutral-900">{{ activeStudentModal.fullName }}</h3>
                <p class="text-xs text-neutral-500">{{ activeStudentModal.email }}</p>
              </div>
            </div>
            <button @click="activeStudentModal = null" class="text-neutral-400 hover:text-black p-1">
              <X class="w-5 h-5" />
            </button>
          </div>

          <div class="space-y-3 text-xs">
            <div class="grid grid-cols-2 gap-3 p-3 bg-neutral-50 rounded-xl">
              <div>
                <span class="text-neutral-400 block text-[11px]">University</span>
                <span class="font-bold text-neutral-800">{{ activeStudentModal.university }}</span>
              </div>
              <div>
                <span class="text-neutral-400 block text-[11px]">Department</span>
                <span class="font-bold text-neutral-800">{{ activeStudentModal.department }}</span>
              </div>
              <div>
                <span class="text-neutral-400 block text-[11px]">Student ID</span>
                <span class="font-mono text-neutral-700">{{ activeStudentModal.studentId || 'N/A' }}</span>
              </div>
              <div>
                <span class="text-neutral-400 block text-[11px]">Experience</span>
                <span class="font-bold text-neutral-800">{{ activeStudentModal.experienceLevel || 'Intermediate' }}</span>
              </div>
            </div>

            <div>
              <span class="text-neutral-400 font-semibold block mb-1">Biography</span>
              <p class="text-neutral-700 leading-relaxed bg-neutral-50 p-3 rounded-xl">
                {{ activeStudentModal.bio || 'No bio provided.' }}
              </p>
            </div>

            <div>
              <span class="text-neutral-400 font-semibold block mb-1.5">Verified Skills</span>
              <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="s in activeStudentModal.skills"
                  :key="s"
                  class="px-2.5 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-[11px] font-medium text-neutral-700"
                >
                  {{ s }}
                </span>
              </div>
            </div>
          </div>

          <div class="pt-3 border-t border-neutral-100 flex justify-end">
            <button
              @click="activeStudentModal = null"
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
        v-if="actionStudent"
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
            Are you sure you want to mark student <strong class="text-neutral-900">{{ actionStudent.fullName }}</strong> as <strong class="capitalize">{{ targetActionStatus }}</strong>? Suspended students cannot log in or apply for projects.
          </p>
          <div class="flex gap-2 pt-2">
            <button
              @click="actionStudent = null"
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

const searchQuery = ref('')
const statusFilter = ref('all')
const activeStudentModal = ref(null)
const actionStudent = ref(null)
const targetActionStatus = ref('suspended')

const allStudents = computed(() => {
  return getRegisteredUsers().filter(u => u.role === 'student' || !u.role)
})

const filteredStudents = computed(() => {
  let list = allStudents.value

  if (statusFilter.value !== 'all') {
    list = list.filter(s => (s.status || 'active') === statusFilter.value)
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    list = list.filter(s => {
      const nameMatch = (s.fullName || '').toLowerCase().includes(q)
      const emailMatch = (s.email || '').toLowerCase().includes(q)
      const univMatch = (s.university || '').toLowerCase().includes(q)
      const skillMatch = (s.skills || []).some(skill => skill.toLowerCase().includes(q))
      return nameMatch || emailMatch || univMatch || skillMatch
    })
  }

  return list
})

const viewStudentModal = (student) => {
  activeStudentModal.value = student
}

const promptToggleStatus = (student, status) => {
  actionStudent.value = student
  targetActionStatus.value = status
}

const confirmStatusChange = () => {
  if (actionStudent.value) {
    updateUserRecord(actionStudent.value.id, { status: targetActionStatus.value })
    actionStudent.value = null
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return 'Recently'
  try {
    return new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
  } catch (e) {
    return 'Recently'
  }
}
</script>
