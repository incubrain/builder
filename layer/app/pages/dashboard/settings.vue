<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  title: 'Settings',
})

const { user, signOut } = await useAuth()
</script>

<template>
  <div class="max-w-2xl">
    <h1 class="text-2xl font-bold text-highlighted mb-6">
      Settings
    </h1>

    <UCard>
      <template #header>
        <h2 class="font-semibold">
          Profile
        </h2>
      </template>

      <div class="space-y-4">
        <div class="flex items-center gap-4">
          <UAvatar
            :src="user?.image ?? undefined"
            :alt="user?.name || 'User'"
            size="lg"
          />
          <div>
            <p class="font-medium text-highlighted">
              {{ user?.name || 'No name set' }}
            </p>
            <p class="text-sm text-muted">
              {{ user?.email || 'No email' }}
            </p>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end">
          <UButton
            label="Sign out"
            color="error"
            variant="soft"
            icon="i-lucide-log-out"
            @click="signOut"
          />
        </div>
      </template>
    </UCard>
  </div>
</template>
