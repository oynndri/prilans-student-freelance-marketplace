<template>
  <div class="min-h-screen bg-[#f1f4f9] text-[#0f172a] py-10 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
    <div class="max-w-3xl mx-auto w-full">
      <!-- Top Branding -->
      <div class="text-center mb-8">
        <router-link to="/" class="inline-flex items-center gap-2.5 mb-2 group">
          <div class="w-8 h-8 rounded-xl bg-[#0f172a] text-white flex items-center justify-center font-black text-sm">
            <span>P</span>
          </div>
          <span class="text-xl font-extrabold tracking-tight text-neutral-900">
            Prilans<span class="text-[#22c55e]">.</span>
          </span>
        </router-link>
        <h1 class="text-2xl font-extrabold text-neutral-900 tracking-tight">
          Create Student Skill Profile
        </h1>
        <p class="text-xs text-neutral-500 mt-1">
          Complete your profile to get recommended for high-paying student freelance gigs
        </p>

        <!-- Profile Completion Progress Bar -->
        <div class="mt-5 max-w-md mx-auto">
          <div class="flex items-center justify-between text-xs font-semibold mb-1.5">
            <span class="text-neutral-600">Profile Completion</span>
            <span class="text-[#16a34a] font-bold">{{ completionPercentage }}%</span>
          </div>
          <div class="w-full bg-neutral-200/90 h-2 rounded-full overflow-hidden">
            <div
              class="bg-[#16a34a] h-full transition-all duration-500 rounded-full"
              :style="{ width: `${completionPercentage}%` }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Step Indicator Navigation -->
      <div class="bg-white rounded-2xl p-4 mb-6 border border-neutral-200/90 shadow-2xs">
        <div class="grid grid-cols-4 gap-2 text-center">
          <button
            v-for="(s, idx) in steps"
            :key="s.id"
            @click="currentStep = s.id"
            type="button"
            class="flex flex-col sm:flex-row items-center justify-center gap-2 py-2 px-1 rounded-xl transition cursor-pointer text-xs"
            :class="[
              currentStep === s.id
                ? 'bg-neutral-900 text-white font-semibold shadow-xs'
                : currentStep > s.id
                  ? 'text-[#16a34a] bg-green-50 font-medium'
                  : 'text-neutral-400 hover:text-neutral-700'
            ]"
          >
            <span class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border"
              :class="currentStep === s.id ? 'border-white bg-white/20' : currentStep > s.id ? 'border-green-500 bg-green-100 text-green-700' : 'border-neutral-300'"
            >
              <Check v-if="currentStep > s.id" class="w-3 h-3 stroke-[3]" />
              <span v-else>{{ idx + 1 }}</span>
            </span>
            <span class="truncate hidden sm:inline">{{ s.title }}</span>
          </button>
        </div>
      </div>

      <!-- Step Content Card -->
      <div class="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200/90 shadow-sm">
        <!-- STEP 1: Basic Information -->
        <div v-if="currentStep === 1" class="space-y-5">
          <div class="border-b border-neutral-100 pb-3">
            <h2 class="text-base font-bold text-neutral-900">Step 1: Basic Information</h2>
            <p class="text-xs text-neutral-500">Provide your academic details and avatar so clients know who you are.</p>
          </div>

          <!-- Avatar selection -->
          <div class="flex items-center gap-4">
            <div class="relative w-16 h-16 rounded-full overflow-hidden border-2 border-neutral-200 bg-neutral-100 shrink-0">
              <img :src="profileData.avatar" alt="Avatar" class="w-full h-full object-cover" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-neutral-700 mb-1">Profile Picture URL</label>
              <input
                v-model="profileData.avatar"
                type="text"
                placeholder="https://..."
                class="w-full text-xs px-3 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
              <p class="text-[11px] text-neutral-400 mt-1">Image URL for your student portfolio avatar.</p>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-neutral-700 mb-1">Full Name</label>
              <input
                v-model="profileData.fullName"
                type="text"
                class="w-full text-xs px-3 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-neutral-700 mb-1">University</label>
              <input
                v-model="profileData.university"
                type="text"
                class="w-full text-xs px-3 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-neutral-700 mb-1">Department</label>
              <input
                v-model="profileData.department"
                type="text"
                class="w-full text-xs px-3 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-neutral-700 mb-1">Student ID</label>
              <input
                v-model="profileData.studentId"
                type="text"
                class="w-full text-xs px-3 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-neutral-700 mb-1">Short Bio</label>
            <textarea
              v-model="profileData.bio"
              rows="3"
              placeholder="Tell clients about your background, interests, and availability..."
              class="w-full text-xs p-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 resize-none"
            ></textarea>
          </div>
        </div>

        <!-- STEP 2: Skills -->
        <div v-else-if="currentStep === 2" class="space-y-5">
          <div class="border-b border-neutral-100 pb-3">
            <h2 class="text-base font-bold text-neutral-900">Step 2: Skills & Competencies</h2>
            <p class="text-xs text-neutral-500">Pick the core technologies and skills you offer to prospective clients.</p>
          </div>

          <!-- Suggested skills grid -->
          <div>
            <label class="block text-xs font-semibold text-neutral-700 mb-2">Available Skills (Click to toggle)</label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="skill in availableSkillsList"
                :key="skill"
                type="button"
                @click="toggleSkill(skill)"
                class="px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer flex items-center gap-1.5"
                :class="[
                  profileData.skills.includes(skill)
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'bg-neutral-100 hover:bg-neutral-200/80 text-neutral-700 border border-neutral-200/60'
                ]"
              >
                <span>{{ skill }}</span>
                <Check v-if="profileData.skills.includes(skill)" class="w-3 h-3 stroke-[3]" />
                <Plus v-else class="w-3 h-3 text-neutral-400" />
              </button>
            </div>
          </div>

          <!-- Add custom skill -->
          <div class="pt-2">
            <label class="block text-xs font-semibold text-neutral-700 mb-1">Add Custom Skill</label>
            <div class="flex gap-2 max-w-md">
              <input
                v-model="customSkillInput"
                @keydown.enter.prevent="addCustomSkill"
                type="text"
                placeholder="e.g. Tailwind CSS, Next.js, Figma..."
                class="flex-1 text-xs px-3 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
              <button
                type="button"
                @click="addCustomSkill"
                class="px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold transition cursor-pointer"
              >
                Add Skill
              </button>
            </div>
          </div>

          <!-- Selected Skills Preview -->
          <div class="p-3 bg-neutral-50 rounded-xl border border-neutral-200/80">
            <span class="text-[11px] font-semibold text-neutral-600 block mb-2">
              Selected Skills ({{ profileData.skills.length }})
            </span>
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="s in profileData.skills"
                :key="s"
                class="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-neutral-200 text-neutral-800 text-xs font-medium rounded-full shadow-2xs"
              >
                <span>{{ s }}</span>
                <button @click="removeSkill(s)" class="text-neutral-400 hover:text-black ml-0.5 cursor-pointer">×</button>
              </span>
              <span v-if="profileData.skills.length === 0" class="text-xs text-neutral-400 italic">
                No skills selected yet. Select at least 1 skill.
              </span>
            </div>
          </div>
        </div>

        <!-- STEP 3: Experience -->
        <div v-else-if="currentStep === 3" class="space-y-5">
          <div class="border-b border-neutral-100 pb-3">
            <h2 class="text-base font-bold text-neutral-900">Step 3: Experience Level</h2>
            <p class="text-xs text-neutral-500">Highlight your expertise level to match suitable freelance rates.</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              v-for="level in experienceTiers"
              :key="level.id"
              type="button"
              @click="profileData.experienceLevel = level.id"
              class="p-4 rounded-xl border text-left transition cursor-pointer relative"
              :class="[
                profileData.experienceLevel === level.id
                  ? 'border-neutral-900 bg-neutral-50/80 ring-1 ring-neutral-900 shadow-xs'
                  : 'border-neutral-200 bg-white hover:border-neutral-300'
              ]"
            >
              <div class="flex justify-between items-center mb-1">
                <span class="text-xs font-bold text-neutral-900">{{ level.title }}</span>
                <span v-if="profileData.experienceLevel === level.id" class="w-2 h-2 rounded-full bg-[#16a34a]"></span>
              </div>
              <p class="text-[11px] text-neutral-500 leading-normal">{{ level.desc }}</p>
            </button>
          </div>

          <div>
            <label class="block text-xs font-semibold text-neutral-700 mb-1">Experience Summary</label>
            <textarea
              v-model="profileData.experienceDescription"
              rows="3"
              placeholder="Detail your freelance experience, hackathons, academic coursework, or student projects..."
              class="w-full text-xs p-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 resize-none"
            ></textarea>
          </div>
        </div>

        <!-- STEP 4: Portfolio -->
        <div v-else-if="currentStep === 4" class="space-y-5">
          <div class="border-b border-neutral-100 pb-3">
            <h2 class="text-base font-bold text-neutral-900">Step 4: Portfolio Projects</h2>
            <p class="text-xs text-neutral-500">Showcase real projects, course assignments, or client works you've built.</p>
          </div>

          <!-- Existing Portfolio List -->
          <div v-if="profileData.portfolio.length > 0" class="space-y-3">
            <div
              v-for="(item, idx) in profileData.portfolio"
              :key="item.id || idx"
              class="p-4 rounded-xl border border-neutral-200/90 bg-neutral-50/50 flex flex-col sm:flex-row items-start justify-between gap-3"
            >
              <div class="space-y-1 min-w-0 flex-1">
                <div class="flex items-center gap-2">
                  <h4 class="text-xs font-bold text-neutral-900">{{ item.name }}</h4>
                  <a v-if="item.url" :href="item.url" target="_blank" class="text-blue-600 hover:underline text-[11px] flex items-center gap-0.5">
                    <ExternalLink class="w-3 h-3" />
                    <span>Live Demo</span>
                  </a>
                </div>
                <p class="text-[11px] text-neutral-500 leading-relaxed">{{ item.description }}</p>
                <div class="flex flex-wrap gap-1 pt-1">
                  <span
                    v-for="tech in item.technologies"
                    :key="tech"
                    class="px-2 py-0.5 rounded-md bg-white border border-neutral-200 text-[10px] text-neutral-600"
                  >
                    {{ tech }}
                  </span>
                </div>
              </div>
              <button
                @click="removePortfolioItem(idx)"
                type="button"
                class="text-red-500 hover:text-red-700 text-xs font-semibold p-1 shrink-0 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>

          <!-- Add New Portfolio Item Form -->
          <div class="p-4 rounded-xl border border-dashed border-neutral-300 bg-white space-y-3">
            <h3 class="text-xs font-bold text-neutral-900">Add Portfolio Project</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-[11px] font-semibold text-neutral-700 mb-1">Project Name *</label>
                <input
                  v-model="newProject.name"
                  type="text"
                  placeholder="e.g. Student Task Manager"
                  class="w-full text-xs px-3 py-1.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>
              <div>
                <label class="block text-[11px] font-semibold text-neutral-700 mb-1">Project URL / GitHub</label>
                <input
                  v-model="newProject.url"
                  type="text"
                  placeholder="https://github.com/..."
                  class="w-full text-xs px-3 py-1.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>
            </div>

            <div>
              <label class="block text-[11px] font-semibold text-neutral-700 mb-1">Project Description</label>
              <textarea
                v-model="newProject.description"
                rows="2"
                placeholder="What problem does it solve and what was your role?"
                class="w-full text-xs p-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 resize-none"
              ></textarea>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-[11px] font-semibold text-neutral-700 mb-1">Technologies Used (comma-separated)</label>
                <input
                  v-model="newProject.techInput"
                  type="text"
                  placeholder="Vue 3, Tailwind CSS, Vite"
                  class="w-full text-xs px-3 py-1.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>
              <div>
                <label class="block text-[11px] font-semibold text-neutral-700 mb-1">Optional Preview Image URL</label>
                <input
                  v-model="newProject.image"
                  type="text"
                  placeholder="https://..."
                  class="w-full text-xs px-3 py-1.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>
            </div>

            <button
              @click="addPortfolioProject"
              type="button"
              class="px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-black transition cursor-pointer"
            >
              + Add to Portfolio
            </button>
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="mt-8 pt-4 border-t border-neutral-100 flex items-center justify-between">
          <button
            v-if="currentStep > 1"
            type="button"
            @click="currentStep--"
            class="px-4 py-2 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition cursor-pointer"
          >
            Back
          </button>
          <div v-else></div>

          <button
            v-if="currentStep < 4"
            type="button"
            @click="currentStep++"
            class="px-5 py-2.5 rounded-xl bg-[#0f172a] text-white text-xs font-semibold hover:bg-black transition cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <span>Next Step</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </button>

          <button
            v-else
            type="button"
            @click="saveAndFinish"
            class="px-6 py-2.5 rounded-xl bg-[#16a34a] text-white text-xs font-semibold hover:bg-green-700 transition cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <Check class="w-4 h-4 stroke-[3]" />
            <span>Complete Profile</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Check, Plus, ExternalLink, ArrowRight } from 'lucide-vue-next'
import {
  authState,
  saveCurrentUser,
  availableSkillsList
} from '../data/auth'

const router = useRouter()
const currentStep = ref(1)

const steps = [
  { id: 1, title: 'Basic Info' },
  { id: 2, title: 'Skills' },
  { id: 3, title: 'Experience' },
  { id: 4, title: 'Portfolio' }
]

const experienceTiers = [
  { id: 'Entry Level', title: 'Entry Level', desc: 'Starting freelance career, coursework & hobby projects' },
  { id: 'Intermediate', title: 'Intermediate', desc: '1-3 years practical experience & client projects' },
  { id: 'Expert', title: 'Expert', desc: '3+ years with advanced full-stack & leadership skills' }
]

const profileData = reactive({
  ...authState.currentUser
})

const customSkillInput = ref('')

const toggleSkill = (skill) => {
  if (profileData.skills.includes(skill)) {
    profileData.skills = profileData.skills.filter(s => s !== skill)
  } else {
    profileData.skills.push(skill)
  }
}

const addCustomSkill = () => {
  const val = customSkillInput.value.trim()
  if (val && !profileData.skills.includes(val)) {
    profileData.skills.push(val)
    customSkillInput.value = ''
  }
}

const removeSkill = (skill) => {
  profileData.skills = profileData.skills.filter(s => s !== skill)
}

// Portfolio
const newProject = reactive({
  name: '',
  url: '',
  description: '',
  techInput: '',
  image: ''
})

const addPortfolioProject = () => {
  if (!newProject.name.trim()) return
  const techArr = newProject.techInput
    ? newProject.techInput.split(',').map(s => s.trim()).filter(Boolean)
    : ['JavaScript']

  profileData.portfolio.push({
    id: Date.now(),
    name: newProject.name.trim(),
    url: newProject.url.trim(),
    description: newProject.description.trim(),
    technologies: techArr,
    image: newProject.image.trim()
  })

  newProject.name = ''
  newProject.url = ''
  newProject.description = ''
  newProject.techInput = ''
  newProject.image = ''
}

const removePortfolioItem = (index) => {
  profileData.portfolio.splice(index, 1)
}

const completionPercentage = computed(() => {
  let score = 0
  if (profileData.fullName) score += 15
  if (profileData.university && profileData.department) score += 20
  if (profileData.bio && profileData.bio.length > 20) score += 15
  if (profileData.skills.length >= 3) score += 25
  if (profileData.experienceLevel) score += 10
  if (profileData.portfolio.length > 0) score += 15
  return Math.min(score, 100)
})

const saveAndFinish = () => {
  saveCurrentUser(profileData)
  router.push('/profile')
}
</script>
