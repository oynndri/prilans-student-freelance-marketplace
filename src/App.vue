<template>
  <div class="w-full min-h-screen h-[100dvh] flex flex-col overflow-hidden antialiased font-sans">
    <AppLoadingScreen :is-loading="isLoading" />

    <!-- Unauthenticated Public & Auth Pages (No persistent sidebar wrapper) -->
    <template v-if="isAuthOrPublicRoute">
      <router-view />
    </template>

    <!-- Admin Portal Dedicated Layout -->
    <AdminLayout v-else-if="isAdminRoute">
      <router-view />
    </AdminLayout>

    <!-- Client Portal Dedicated Layout -->
    <ClientLayout v-else-if="isClientRoute">
      <router-view />
    </ClientLayout>

    <!-- Student Portal Dedicated Layout -->
    <StudentLayout v-else>
      <router-view />
    </StudentLayout>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppLoadingScreen from './components/AppLoadingScreen.vue'
import StudentLayout from './layouts/StudentLayout.vue'
import ClientLayout from './layouts/ClientLayout.vue'
import AdminLayout from './layouts/AdminLayout.vue'

const route = useRoute()
const isLoading = ref(true)

const isAuthOrPublicRoute = computed(() => {
  return [
    '/login',
    '/register',
    '/client/login',
    '/client/register',
    '/admin/login'
  ].includes(route.path)
})

const isAdminRoute = computed(() => {
  return route.path.startsWith('/admin')
})

const isClientRoute = computed(() => {
  return route.path.startsWith('/client')
})

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 850)
})
</script>
