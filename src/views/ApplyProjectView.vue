<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <!-- Top Back Navigation -->
    <div>
      <router-link
        :to="`/projects/${projectId}`"
        class="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition"
      >
        <ArrowLeft class="w-4 h-4" />
        <span>Back to Project Overview</span>
      </router-link>
    </div>

    <!-- Application Form Card -->
    <div class="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200/90 shadow-2xs space-y-6">
      <!-- Header -->
      <div class="border-b border-neutral-100 pb-4">
        <span class="text-[11px] font-bold text-[#16a34a] uppercase tracking-wider block mb-1">
          Student Project Application
        </span>
        <h1 class="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
          Apply for: {{ project?.title || 'Freelance Project' }}
        </h1>
        <p class="text-xs text-neutral-500 mt-1">
          Category: {{ project?.category }} • Client Budget: {{ project?.priceDisplay }}
        </p>
      </div>

      <!-- Error Message Banner -->
      <div v-if="errorMessage" class="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
        <AlertCircle class="w-4 h-4 shrink-0 text-red-600" />
        <span>{{ errorMessage }}</span>
      </div>

      <!-- Success Message Banner -->
      <div v-if="successMessage" class="p-3.5 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs flex items-center gap-2">
        <CheckCircle2 class="w-4 h-4 shrink-0 text-green-600" />
        <span>{{ successMessage }}</span>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-5">
        <!-- 1. Student Info (Auto-Filled from logged-in user) -->
        <div class="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/80 space-y-2">
          <span class="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block">
            Applicant Information
          </span>
          <div class="flex items-center justify-between text-xs">
            <span class="font-semibold text-neutral-800">{{ student.fullName }}</span>
            <span class="text-neutral-500">{{ student.department }} • {{ student.university }}</span>
          </div>
          <!-- Student Skills Display -->
          <div class="flex flex-wrap gap-1.5 pt-1">
            <span
              v-for="skill in student.skills"
              :key="skill"
              class="px-2 py-0.5 bg-white border border-neutral-200 text-[10px] text-neutral-600 rounded font-medium"
            >
              {{ skill }}
            </span>
          </div>
        </div>

        <!-- 2. Proposed Budget / Rate -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-neutral-700 mb-1">
              Proposed Budget / Hourly Bid <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.proposedBudget"
              type="text"
              placeholder="e.g. $20.00 /hour or $350 fixed"
              required
              class="w-full text-xs px-3.5 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-neutral-700 mb-1">
              Estimated Completion Time <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.estimatedDuration"
              type="text"
              placeholder="e.g. 7 days, 2 weeks"
              required
              class="w-full text-xs px-3.5 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>
        </div>

        <!-- 3. Cover Letter / Proposal -->
        <div>
          <div class="flex justify-between items-center mb-1">
            <label class="block text-xs font-semibold text-neutral-700">
              Cover Letter / Proposal <span class="text-red-500">*</span>
            </label>
            <span class="text-[11px] text-neutral-400 tabular-nums">
              {{ form.proposal.length }} / 800 chars (min 50)
            </span>
          </div>
          <textarea
            v-model="form.proposal"
            rows="5"
            maxlength="800"
            placeholder="Explain why you are the best fit for this project, relevant coursework or freelance portfolio items, and how you will execute the deliverables..."
            required
            class="w-full text-xs p-3.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 resize-none leading-relaxed"
          ></textarea>
        </div>

        <!-- 4. Additional Information (Optional) -->
        <div>
          <label class="block text-xs font-semibold text-neutral-700 mb-1">
            Additional Information / Questions (Optional)
          </label>
          <input
            v-model="form.additionalInfo"
            type="text"
            placeholder="e.g. GitHub link, Figma preview, weekly availability"
            class="w-full text-xs px-3.5 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
          />
        </div>

        <!-- Action Buttons -->
        <div class="pt-3 border-t border-neutral-100 flex items-center justify-between">
          <router-link
            :to="`/projects/${projectId}`"
            class="px-4 py-2 text-xs font-semibold text-neutral-500 hover:text-black"
          >
            Cancel
          </router-link>

          <button
            type="submit"
            :disabled="isSubmitting"
            class="px-6 py-2.5 rounded-xl bg-[#0f172a] hover:bg-black text-white text-xs font-semibold transition cursor-pointer shadow-xs active:scale-[0.98] flex items-center gap-2 disabled:opacity-50"
          >
            <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
            <span>{{ isSubmitting ? 'Submitting Application...' : 'Submit Application' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, AlertCircle, CheckCircle2, Loader2 } from 'lucide-vue-next'
import { authState } from '../data/auth'
import { getProjectById } from '../data/projectService'
import { submitApplication, hasStudentApplied } from '../data/applicationService'

const route = useRoute()
const router = useRouter()

const projectId = route.params.id
const project = computed(() => getProjectById(projectId))
const student = computed(() => authState.currentUser)

const errorMessage = ref('')
const successMessage = ref('')
const isSubmitting = ref(false)

const form = reactive({
  proposedBudget: '',
  estimatedDuration: '',
  proposal: '',
  additionalInfo: ''
})

onMounted(() => {
  if (project.value) {
    form.proposedBudget = project.value.priceDisplay || '$20.00 /hour'
    form.estimatedDuration = project.value.deadline || '2 weeks'
  }

  // Duplicate check
  if (hasStudentApplied(projectId, student.value.id)) {
    errorMessage.value = 'You have already submitted an application for this project.'
  }
})

const handleSubmit = () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (!project.value) {
    errorMessage.value = 'Project not found.'
    return
  }

  if (hasStudentApplied(projectId, student.value.id)) {
    errorMessage.value = 'You have already submitted an application for this project.'
    return
  }

  if (form.proposal.trim().length < 50) {
    errorMessage.value = 'Please write at least 50 characters in your cover letter proposal.'
    return
  }

  isSubmitting.value = true

  setTimeout(() => {
    const result = submitApplication({
      projectId: project.value.id,
      projectTitle: project.value.title,
      projectCategory: project.value.category,
      projectPriceDisplay: project.value.priceDisplay,
      studentId: student.value.id,
      studentName: student.value.fullName,
      studentEmail: student.value.email,
      studentUniversity: student.value.university,
      studentDepartment: student.value.department,
      studentAvatar: student.value.avatar,
      studentSkills: student.value.skills,
      studentExperienceLevel: student.value.experienceLevel,
      clientId: project.value.clientId || 'client-techcorp',
      proposal: form.proposal,
      proposedBudget: form.proposedBudget,
      estimatedDuration: form.estimatedDuration,
      additionalInfo: form.additionalInfo
    })

    isSubmitting.value = false

    if (result.success) {
      successMessage.value = 'Application submitted successfully! Redirecting to My Applications...'
      setTimeout(() => {
        router.push('/my-applications')
      }, 700)
    } else {
      errorMessage.value = result.message
    }
  }, 500)
}
</script>
