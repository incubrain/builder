<script setup lang="ts">
definePageMeta({
  layout: 'default',
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <h1 class="text-6xl font-bold text-highlighted mb-4">
        404
      </h1>
      <p class="text-muted text-lg mb-6">
        Page not found
      </p>
      <UButton
        label="Go home"
        to="/"
        icon="i-lucide-arrow-left"
        variant="soft"
      />
    </div>
  </div>
</template>
