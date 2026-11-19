<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- Top Back & Header -->
    <div class="flex items-center justify-between">
      <router-link
        to="/client/projects"
        class="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition"
      >
        <ArrowLeft class="w-4 h-4" />
        <span>Back to Projects</span>
      </router-link>
      <span class="text-xs text-neutral-400">Step by step publishing</span>
    </div>

    <div class="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200/90 shadow-2xs space-y-8">
      <div>
        <h1 class="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
          {{ isEditMode ? 'Edit Freelance Project' : 'Post a New Student Project' }}
        </h1>
        <p class="text-xs text-neutral-500 mt-1">
          Define project scope, skills, budget, and requirements for verified university freelancers.
        </p>
      </div>

      <!-- Error / Validation Banner -->
      <div v-if="validationError" class="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
        <AlertCircle class="w-4 h-4 shrink-0 text-red-600" />
        <span>{{ validationError }}</span>
      </div>

      <!-- Success Notification Banner -->
      <div v-if="successMessage" class="p-3.5 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs flex items-center gap-2">
        <CheckCircle2 class="w-4 h-4 shrink-0 text-green-600" />
        <span>{{ successMessage }}</span>
      </div>

      <form @submit.prevent="handleSubmit(false)" class="space-y-8">
        <!-- SECTION A: Project Information -->
        <div class="space-y-4">
          <div class="border-b border-neutral-100 pb-2">
            <h2 class="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Section A — Project Information
            </h2>
          </div>

          <div>
            <label class="block text-xs font-semibold text-neutral-700 mb-1">
              Project Title <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.title"
              type="text"
              placeholder="e.g. Modern Landing Page Redesign with Vue 3 & Tailwind"
              required
              class="w-full text-xs px-3.5 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-neutral-700 mb-1">
                Project Category <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.category"
                class="w-full text-xs px-3.5 py-2.5 border border-neutral-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900"
              >
                <option value="Web Design">Web Design</option>
                <option value="Web Development">Web Development</option>
                <option value="Mobile Design">Mobile Design</option>
                <option value="Graphic Design">Graphic Design</option>
                <option value="Content Writing">Content Writing</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold text-neutral-700 mb-1">
                Preferred Freelancer Location
              </label>
              <input
                v-model="form.location"
                type="text"
                placeholder="e.g. United States, Germany, Remote"
                class="w-full text-xs px-3.5 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-neutral-700 mb-1">
              Project Description <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="form.description"
              rows="4"
              placeholder="Detailed description of deliverables, student responsibilities, milestones, and expected project outcomes..."
              required
              class="w-full text-xs p-3.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 resize-none leading-relaxed"
            ></textarea>
          </div>
        </div>

        <!-- SECTION B: Required Skills -->
        <div class="space-y-4">
          <div class="border-b border-neutral-100 pb-2 flex items-center justify-between">
            <h2 class="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Section B — Required Skills ({{ form.skills.length }} selected)
            </h2>
            <span class="text-[11px] text-neutral-400">Click pills to toggle</span>
          </div>

          <div class="flex flex-wrap gap-2">
            <button
              v-for="s in requiredSkillsBank"
              :key="s"
              type="button"
              @click="toggleSkill(s)"
              class="px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer flex items-center gap-1.5"
              :class="[
                form.skills.includes(s)
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-neutral-100 hover:bg-neutral-200/80 text-neutral-700 border border-neutral-200/60'
              ]"
            >
              <span>{{ s }}</span>
              <Check v-if="form.skills.includes(s)" class="w-3 h-3 stroke-[3]" />
              <Plus v-else class="w-3 h-3 text-neutral-400" />
            </button>
          </div>

          <!-- Add custom skill -->
          <div class="flex gap-2 max-w-md pt-1">
            <input
              v-model="customSkill"
              @keydown.enter.prevent="addCustomSkill"
              type="text"
              placeholder="Add other custom skill (e.g. Next.js, Docker)..."
              class="flex-1 text-xs px-3 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900"
            />
            <button
              type="button"
              @click="addCustomSkill"
              class="px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold transition cursor-pointer"
            >
              Add
            </button>
          </div>
        </div>

        <!-- SECTION C: Project Budget -->
        <div class="space-y-4">
          <div class="border-b border-neutral-100 pb-2">
            <h2 class="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Section C — Project Budget
            </h2>
          </div>

          <!-- Hourly vs Fixed Price -->
          <div>
            <label class="block text-xs font-semibold text-neutral-700 mb-2">Budget Type</label>
            <div class="grid grid-cols-2 max-w-xs p-1 bg-neutral-100 rounded-xl border border-neutral-200 text-xs font-semibold">
              <button
                type="button"
                @click="form.projectType = 'Hourly'"
                class="py-2 rounded-lg transition cursor-pointer text-center"
                :class="form.projectType === 'Hourly' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'"
              >
                Hourly Rate
              </button>
              <button
                type="button"
                @click="form.projectType = 'Fixed Price'"
                class="py-2 rounded-lg transition cursor-pointer text-center"
                :class="form.projectType === 'Fixed Price' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'"
              >
                Fixed Price
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label class="block text-xs font-semibold text-neutral-700 mb-1">
                Currency
              </label>
              <select
                v-model="form.currency"
                class="w-full text-xs px-3.5 py-2.5 border border-neutral-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900"
              >
                <option value="$">USD ($)</option>
                <option value="€">EUR (€)</option>
                <option value="£">GBP (£)</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold text-neutral-700 mb-1">
                {{ form.projectType === 'Hourly' ? 'Min Hourly Rate ($)' : 'Project Budget ($)' }} <span class="text-red-500">*</span>
              </label>
              <input
                v-model.number="form.minBudget"
                type="number"
                min="5"
                placeholder="20"
                required
                class="w-full text-xs px-3.5 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>

            <div v-if="form.projectType === 'Hourly'">
              <label class="block text-xs font-semibold text-neutral-700 mb-1">
                Max Hourly Rate ($)
              </label>
              <input
                v-model.number="form.maxBudget"
                type="number"
                min="5"
                placeholder="40"
                class="w-full text-xs px-3.5 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>
          </div>
        </div>

        <!-- SECTION D: Project Requirements -->
        <div class="space-y-4">
          <div class="border-b border-neutral-100 pb-2">
            <h2 class="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Section D — Project Requirements
            </h2>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label class="block text-xs font-semibold text-neutral-700 mb-1">
                Experience Level <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.experienceLevel"
                class="w-full text-xs px-3.5 py-2.5 border border-neutral-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900"
              >
                <option value="Entry Level">Entry Level</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Expert">Expert</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold text-neutral-700 mb-1">
                Project Deadline
              </label>
              <input
                v-model="form.deadline"
                type="text"
                placeholder="e.g. 2 weeks, 1 month"
                class="w-full text-xs px-3.5 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-neutral-700 mb-1">
                Open Positions
              </label>
              <input
                v-model.number="form.positions"
                type="number"
                min="1"
                placeholder="1"
                class="w-full text-xs px-3.5 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-neutral-700 mb-1">
              Additional Requirements or Screening Questions
            </label>
            <textarea
              v-model="form.additionalRequirements"
              rows="2"
              placeholder="e.g. Must share GitHub repository or live Vue prototype links with proposal."
              class="w-full text-xs p-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 resize-none"
            ></textarea>
          </div>
        </div>

        <!-- SECTION E: Publishing Controls -->
        <div class="pt-4 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <router-link
            to="/client/projects"
            class="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 text-center"
          >
            Cancel
          </router-link>

          <div class="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              @click="handleSubmit(true)"
              class="flex-1 sm:flex-none px-5 py-2.5 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-800 text-xs font-semibold transition cursor-pointer shadow-2xs"
            >
              Save as Draft
            </button>

            <button
              type="submit"
              class="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-[#0f172a] hover:bg-black text-white text-xs font-semibold transition cursor-pointer shadow-xs active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Check class="w-4 h-4 stroke-[3]" />
              <span>{{ isEditMode ? 'Update Project' : 'Publish Project' }}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft, Check, Plus, AlertCircle, CheckCircle2 } from 'lucide-vue-next'
import { authState } from '../../data/auth'
import { createProject, updateProject, getProjectById } from '../../data/projectService'

const router = useRouter()
const route = useRoute()

const isEditMode = computed(() => !!route.params.id)
const validationError = ref('')
const successMessage = ref('')
const customSkill = ref('')

const requiredSkillsBank = [
  'HTML',
  'CSS',
  'JavaScript',
  'Vue',
  'React',
  'PHP',
  'Laravel',
  'Java',
  'Python',
  'MySQL',
  'UI/UX Design',
  'Graphic Design',
  'Content Writing',
  'Digital Marketing'
]

const form = reactive({
  title: '',
  category: 'Web Development',
  description: '',
  location: 'Remote',
  skills: ['Vue', 'JavaScript', 'Tailwind CSS'],
  projectType: 'Hourly',
  currency: '$',
  minBudget: 25,
  maxBudget: 40,
  experienceLevel: 'Intermediate',
  deadline: '1 month',
  positions: 1,
  additionalRequirements: ''
})

onMounted(() => {
  if (isEditMode.value) {
    const existing = getProjectById(route.params.id)
    if (existing) {
      Object.assign(form, {
        title: existing.title,
        category: existing.category,
        description: existing.description,
        location: existing.country || existing.location || 'Remote',
        skills: [...(existing.skills || [])],
        projectType: existing.projectType || 'Hourly',
        currency: existing.currency || '$',
        minBudget: existing.minBudget || existing.price || 25,
        maxBudget: existing.maxBudget || 40,
        experienceLevel: existing.experienceLevel || 'Intermediate',
        deadline: existing.deadline || '1 month',
        positions: existing.positions || 1,
        additionalRequirements: existing.additionalRequirements || ''
      })
    }
  }
})

const toggleSkill = (s) => {
  if (form.skills.includes(s)) {
    form.skills = form.skills.filter(item => item !== s)
  } else {
    form.skills.push(s)
  }
}

const addCustomSkill = () => {
  const val = customSkill.value.trim()
  if (val && !form.skills.includes(val)) {
    form.skills.push(val)
    customSkill.value = ''
  }
}

const handleSubmit = (isDraft = false) => {
  validationError.value = ''
  successMessage.value = ''

  if (!form.title.trim()) {
    validationError.value = 'Please provide a project title.'
    return
  }

  if (!form.description.trim() || form.description.trim().length < 20) {
    validationError.value = 'Please write a descriptive project brief (at least 20 characters).'
    return
  }

  if (form.skills.length === 0) {
    validationError.value = 'Please select at least 1 required skill.'
    return
  }

  if (!form.minBudget || form.minBudget <= 0) {
    validationError.value = 'Please enter a valid budget amount.'
    return
  }

  const clientId = authState.currentUser?.id || 'client-demo'

  if (isEditMode.value) {
    updateProject(Number(route.params.id) || route.params.id, {
      ...form,
      status: isDraft ? 'Draft' : 'Open'
    })
    successMessage.value = 'Project updated successfully!'
  } else {
    createProject(form, clientId, isDraft)
    successMessage.value = isDraft
      ? 'Project saved as draft!'
      : 'Project successfully published to Student Marketplace!'
  }

  setTimeout(() => {
    router.push('/client/projects')
  }, 700)
}
</script>
