<template>
  <div class="space-y-6">
    <!-- Top Welcome & Completion Banner -->
    <div class="bg-white rounded-2xl p-6 border border-neutral-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
      <div class="flex items-center gap-4">
        <div class="relative w-16 h-16 rounded-full overflow-hidden border-2 border-neutral-200 shrink-0">
          <img :src="user.avatar" :alt="user.fullName" class="w-full h-full object-cover" />
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-xl font-extrabold text-neutral-900 tracking-tight">{{ user.fullName }}</h1>
            <span class="inline-flex items-center gap-1 text-[11px] font-semibold text-[#16a34a] bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
              <CheckCircle2 class="w-3 h-3" />
              Verified Student
            </span>
          </div>
          <p class="text-xs text-neutral-500 mt-0.5">
            {{ user.department }} • {{ user.university }}
          </p>
          <p class="text-[11px] text-neutral-400 font-mono">ID: {{ user.studentId }}</p>
        </div>
      </div>

      <!-- Profile Completion Gauge -->
      <div class="w-full md:w-64 bg-neutral-50 p-3.5 rounded-xl border border-neutral-200/80">
        <div class="flex justify-between items-center text-xs font-semibold mb-1.5">
          <span class="text-neutral-700">Profile Strength</span>
          <span class="text-[#16a34a] font-bold">{{ profileCompletionPercentage }}%</span>
        </div>
        <div class="w-full bg-neutral-200 h-2 rounded-full overflow-hidden mb-2">
          <div
            class="bg-[#16a34a] h-full transition-all duration-500 rounded-full"
            :style="{ width: `${profileCompletionPercentage}%` }"
          ></div>
        </div>
        <p class="text-[10px] text-neutral-400">
          {{ profileCompletionPercentage === 100 ? 'All profile sections completed!' : 'Complete more portfolio items to reach 100%.' }}
        </p>
      </div>
    </div>

    <!-- Main Profile Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column: Personal Bio, Experience, & Details -->
      <div class="lg:col-span-1 space-y-6">
        <!-- About / Bio Card -->
        <div class="bg-white rounded-2xl p-5 border border-neutral-200/90 shadow-2xs space-y-4">
          <div class="flex items-center justify-between border-b border-neutral-100 pb-2.5">
            <h3 class="text-xs font-bold uppercase tracking-wider text-neutral-500">About Me</h3>
            <button
              @click="isEditingBio = !isEditingBio"
              class="text-xs font-semibold text-neutral-700 hover:text-black cursor-pointer"
            >
              {{ isEditingBio ? 'Cancel' : 'Edit' }}
            </button>
          </div>

          <div v-if="isEditingBio" class="space-y-3">
            <textarea
              v-model="editForm.bio"
              rows="4"
              class="w-full text-xs p-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 resize-none"
            ></textarea>
            <button
              @click="saveBio"
              class="px-3.5 py-1.5 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-black transition cursor-pointer"
            >
              Save Bio
            </button>
          </div>
          <p v-else class="text-xs text-neutral-600 leading-relaxed">
            {{ user.bio }}
          </p>

          <div class="pt-3 border-t border-neutral-100 space-y-2 text-xs">
            <div class="flex justify-between text-neutral-600">
              <span class="text-neutral-400">Email:</span>
              <span class="font-medium text-neutral-800">{{ user.email }}</span>
            </div>
            <div class="flex justify-between text-neutral-600">
              <span class="text-neutral-400">Level:</span>
              <span class="font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded-md text-[11px]">{{ user.experienceLevel }}</span>
            </div>
          </div>
        </div>

        <!-- Experience Level Card -->
        <div class="bg-white rounded-2xl p-5 border border-neutral-200/90 shadow-2xs space-y-4">
          <div class="flex items-center justify-between border-b border-neutral-100 pb-2.5">
            <h3 class="text-xs font-bold uppercase tracking-wider text-neutral-500">Experience Tier</h3>
            <button
              @click="isEditingExp = !isEditingExp"
              class="text-xs font-semibold text-neutral-700 hover:text-black cursor-pointer"
            >
              {{ isEditingExp ? 'Cancel' : 'Change' }}
            </button>
          </div>

          <div v-if="isEditingExp" class="space-y-3">
            <select
              v-model="editForm.experienceLevel"
              class="w-full text-xs p-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900"
            >
              <option value="Entry Level">Entry Level</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Expert">Expert</option>
            </select>
            <textarea
              v-model="editForm.experienceDescription"
              rows="3"
              placeholder="Experience summary..."
              class="w-full text-xs p-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 resize-none"
            ></textarea>
            <button
              @click="saveExperience"
              class="px-3.5 py-1.5 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-black transition cursor-pointer"
            >
              Update Experience
            </button>
          </div>
          <div v-else>
            <div class="text-xs font-semibold text-neutral-800 mb-1">{{ user.experienceLevel }}</div>
            <p class="text-xs text-neutral-500 leading-relaxed">{{ user.experienceDescription }}</p>
          </div>
        </div>
      </div>

      <!-- Right Column: Skills & Portfolio -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Skills Section -->
        <div class="bg-white rounded-2xl p-6 border border-neutral-200/90 shadow-2xs space-y-4">
          <div class="flex items-center justify-between border-b border-neutral-100 pb-3">
            <div>
              <h2 class="text-sm font-bold text-neutral-900">Skills & Technical Competencies</h2>
              <p class="text-xs text-neutral-400">Add or remove verified skills displayed on your proposals.</p>
            </div>
            <span class="text-xs font-semibold text-neutral-500">{{ user.skills.length }} skills</span>
          </div>

          <!-- Active Skills Pills -->
          <div class="flex flex-wrap gap-2">
            <span
              v-for="skill in user.skills"
              :key="skill"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-50 border border-neutral-200/90 text-neutral-800 text-xs font-medium rounded-full shadow-2xs group"
            >
              <span>{{ skill }}</span>
              <button
                @click="removeSkill(skill)"
                class="text-neutral-400 hover:text-red-600 transition cursor-pointer"
                title="Remove skill"
              >
                ×
              </button>
            </span>
          </div>

          <!-- Add Skill Bar -->
          <div class="pt-3 border-t border-neutral-100 flex flex-col sm:flex-row gap-2">
            <input
              v-model="newSkillInput"
              @keydown.enter.prevent="addSkill"
              type="text"
              placeholder="Add skill (e.g. Laravel, React, Python)..."
              class="flex-1 text-xs px-3.5 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
            <button
              @click="addSkill"
              class="px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-black transition cursor-pointer"
            >
              + Add Skill
            </button>
          </div>
        </div>

        <!-- Portfolio Showcase -->
        <div class="bg-white rounded-2xl p-6 border border-neutral-200/90 shadow-2xs space-y-5">
          <div class="flex items-center justify-between border-b border-neutral-100 pb-3">
            <div>
              <h2 class="text-sm font-bold text-neutral-900">Portfolio Projects</h2>
              <p class="text-xs text-neutral-400">Real projects showcasing student abilities to clients.</p>
            </div>
            <button
              @click="showAddProject = !showAddProject"
              class="px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-xs font-semibold text-neutral-800 transition cursor-pointer"
            >
              {{ showAddProject ? 'Cancel' : '+ Add Project' }}
            </button>
          </div>

          <!-- Add Project Form Toggle -->
          <div v-if="showAddProject" class="p-4 bg-neutral-50/70 border border-neutral-200 rounded-xl space-y-3">
            <h4 class="text-xs font-bold text-neutral-900">Add New Portfolio Project</h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-[11px] font-semibold text-neutral-700 mb-1">Project Name *</label>
                <input
                  v-model="newProj.name"
                  type="text"
                  placeholder="e.g. Student Timetable App"
                  class="w-full text-xs px-3 py-1.5 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>
              <div>
                <label class="block text-[11px] font-semibold text-neutral-700 mb-1">Live URL / Repo</label>
                <input
                  v-model="newProj.url"
                  type="text"
                  placeholder="https://..."
                  class="w-full text-xs px-3 py-1.5 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>
            </div>

            <div>
              <label class="block text-[11px] font-semibold text-neutral-700 mb-1">Project Description</label>
              <textarea
                v-model="newProj.description"
                rows="2"
                placeholder="Key features and student contributions..."
                class="w-full text-xs p-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 resize-none"
              ></textarea>
            </div>

            <div>
              <label class="block text-[11px] font-semibold text-neutral-700 mb-1">Technologies Used (comma separated)</label>
              <input
                v-model="newProj.techInput"
                type="text"
                placeholder="Vue 3, Tailwind CSS, Vite"
                class="w-full text-xs px-3 py-1.5 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>

            <button
              @click="submitPortfolioProject"
              class="px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-black transition cursor-pointer"
            >
              Save Project
            </button>
          </div>

          <!-- Existing Projects List -->
          <div v-if="user.portfolio && user.portfolio.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="(p, index) in user.portfolio"
              :key="p.id || index"
              class="p-4 rounded-xl border border-neutral-200/90 bg-neutral-50/40 flex flex-col justify-between hover:border-neutral-300 transition"
            >
              <div>
                <div class="flex items-center justify-between mb-1.5">
                  <h4 class="text-xs font-bold text-neutral-900">{{ p.name }}</h4>
                  <button
                    @click="deletePortfolio(index)"
                    class="text-neutral-400 hover:text-red-600 text-xs cursor-pointer p-0.5"
                    title="Delete project"
                  >
                    <Trash2 class="w-3.5 h-3.5" />
                  </button>
                </div>
                <p class="text-xs text-neutral-500 leading-relaxed mb-3 line-clamp-3">
                  {{ p.description }}
                </p>
                <div class="flex flex-wrap gap-1 mb-3">
                  <span
                    v-for="t in p.technologies"
                    :key="t"
                    class="px-2 py-0.5 bg-white border border-neutral-200/80 rounded text-[10px] text-neutral-600 font-medium"
                  >
                    {{ t }}
                  </span>
                </div>
              </div>

              <div class="pt-2 border-t border-neutral-200/60 flex justify-between items-center text-xs">
                <a
                  v-if="p.url"
                  :href="p.url"
                  target="_blank"
                  class="text-blue-600 hover:underline flex items-center gap-1 font-medium"
                >
                  <ExternalLink class="w-3 h-3" />
                  <span>View Project</span>
                </a>
                <span v-else class="text-neutral-400 italic text-[11px]">No link</span>
              </div>
            </div>
          </div>

          <div v-else class="p-8 text-center border border-dashed border-neutral-200 rounded-xl text-neutral-400 text-xs">
            No portfolio projects added yet. Click "+ Add Project" to build your portfolio.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import {
  CheckCircle2,
  Trash2,
  ExternalLink
} from 'lucide-vue-next'
import {
  authState,
  saveCurrentUser,
  profileCompletionPercentage
} from '../data/auth'

const user = computed(() => authState.currentUser)

const isEditingBio = ref(false)
const isEditingExp = ref(false)
const showAddProject = ref(false)
const newSkillInput = ref('')

const editForm = reactive({
  bio: user.value.bio,
  experienceLevel: user.value.experienceLevel,
  experienceDescription: user.value.experienceDescription
})

const saveBio = () => {
  saveCurrentUser({ bio: editForm.bio })
  isEditingBio.value = false
}

const saveExperience = () => {
  saveCurrentUser({
    experienceLevel: editForm.experienceLevel,
    experienceDescription: editForm.experienceDescription
  })
  isEditingExp.value = false
}

const addSkill = () => {
  const val = newSkillInput.value.trim()
  if (val && !user.value.skills.includes(val)) {
    const updated = [...user.value.skills, val]
    saveCurrentUser({ skills: updated })
    newSkillInput.value = ''
  }
}

const removeSkill = (skill) => {
  const updated = user.value.skills.filter(s => s !== skill)
  saveCurrentUser({ skills: updated })
}

const newProj = reactive({
  name: '',
  url: '',
  description: '',
  techInput: ''
})

const submitPortfolioProject = () => {
  if (!newProj.name.trim()) return
  const techArr = newProj.techInput
    ? newProj.techInput.split(',').map(s => s.trim()).filter(Boolean)
    : ['JavaScript']

  const updatedPortfolio = [
    ...(user.value.portfolio || []),
    {
      id: Date.now(),
      name: newProj.name.trim(),
      url: newProj.url.trim(),
      description: newProj.description.trim(),
      technologies: techArr
    }
  ]

  saveCurrentUser({ portfolio: updatedPortfolio })
  newProj.name = ''
  newProj.url = ''
  newProj.description = ''
  newProj.techInput = ''
  showAddProject.value = false
}

const deletePortfolio = (index) => {
  const updated = [...user.value.portfolio]
  updated.splice(index, 1)
  saveCurrentUser({ portfolio: updated })
}
</script>
