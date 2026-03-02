<script setup lang="ts">
const props = defineProps<{
  error: {
    statusCode: number
    statusMessage: string
    message: string
  }
}>()

function handleError() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <h1 class="text-6xl font-bold text-highlighted mb-4">
        {{ error.statusCode }}
      </h1>
      <p class="text-muted text-lg mb-6">
        {{ error.statusMessage || error.message || 'Something went wrong' }}
      </p>
      <UButton
        label="Go home"
        icon="i-lucide-arrow-left"
        variant="soft"
        @click="handleError"
      />
    </div>
  </div>
</template>
