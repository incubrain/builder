<script setup lang="ts">
definePageMeta({
  layout: 'default',
})
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center p-8" aria-label="Landing page">
    <UIcon name="i-lucide-blocks" class="size-16 text-primary mb-6" aria-hidden="true" />

    <h1 class="text-4xl font-bold text-highlighted mb-4 text-center">
      Build faster with Builder
    </h1>

    <p class="text-lg text-muted mb-8 text-center max-w-md">
      Auth, database, dashboard, and deployment — everything you need to
      go from idea to beta.
    </p>

    <nav class="flex gap-3" aria-label="Get started actions">
      <UButton
        aria-label="Get started - go to login"
        label="Get started"
        to="/login"
        size="lg"
        icon="i-lucide-arrow-right"
        trailing
      />
      <UButton
        aria-label="Go to dashboard"
        label="Dashboard"
        to="/dashboard"
        size="lg"
        color="neutral"
        variant="outline"
      />
    </nav>
  </div>
</template>
