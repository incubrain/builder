<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  title: 'Dashboard',
})

const { user } = useAuth()
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-highlighted mb-2">
      Welcome{{ user?.name ? `, ${user.name}` : '' }}
    </h1>
    <p class="text-muted mb-8">
      Here's what's happening with your app.
    </p>

    <UAlert
      icon="i-lucide-rocket"
      title="Get started"
      description="Your Builder app is running. Start adding features by creating new pages in your dashboard."
      color="info"
    />
  </div>
</template>
