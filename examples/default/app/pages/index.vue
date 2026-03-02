<script setup lang="ts">
definePageMeta({
  layout: 'default',
})
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center p-8">
    <UIcon name="i-lucide-blocks" class="size-16 text-primary mb-6" />

    <h1 class="text-4xl font-bold text-highlighted mb-4 text-center">
      Build faster with Builder
    </h1>

    <p class="text-lg text-muted mb-8 text-center max-w-md">
      Auth, database, dashboard, and deployment — everything you need to
      go from idea to beta.
    </p>

    <div class="flex gap-3">
      <UButton
        label="Get started"
        to="/login"
        size="lg"
        icon="i-lucide-arrow-right"
        trailing
      />
      <UButton
        label="Dashboard"
        to="/dashboard"
        size="lg"
        color="neutral"
        variant="outline"
      />
    </div>
  </div>
</template>
