<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

const { signInWithGitHub, isAuthenticated } = await useAuth()
const email = ref('')
const magicLinkSent = ref(false)
const toast = useToast()
const isDev = import.meta.dev

// Redirect if already authenticated
watch(isAuthenticated, (val) => {
  if (val) navigateTo('/dashboard')
}, { immediate: true })

async function handleMagicLink() {
  if (!email.value) return
  try {
    const { signInWithMagicLink } = await useAuth()
    await signInWithMagicLink(email.value)
    magicLinkSent.value = true
    toast.add({ title: 'Check your email', description: 'We sent you a magic link to sign in.', color: 'success' })
  }
  catch {
    toast.add({ title: 'Error', description: 'Failed to send magic link. Please try again.', color: 'error' })
  }
}

async function handleDevLogin() {
  try {
    const res = await $fetch('/api/_dev/login', { method: 'POST' })
    if (res.redirect) navigateTo(res.redirect)
  }
  catch {
    toast.add({ title: 'Error', description: 'Dev login failed.', color: 'error' })
  }
}
</script>

<template>
  <div aria-label="Login page">
    <div class="text-center mb-8">
      <UIcon name="i-lucide-blocks" class="size-10 text-primary mb-4" aria-hidden="true" />
      <h1 class="text-2xl font-bold text-highlighted">
        Welcome back
      </h1>
      <p class="text-muted mt-1">
        Sign in to your account
      </p>
    </div>

    <div class="space-y-4">
      <!-- Dev Login (development only) -->
      <template v-if="isDev">
        <UButton
          aria-label="Sign in as test user"
          icon="i-lucide-bug"
          label="Dev Login (test user)"
          color="warning"
          variant="soft"
          block
          size="lg"
          @click="handleDevLogin"
        />
        <UDivider label="or" />
      </template>

      <!-- GitHub OAuth -->
      <UButton
        aria-label="Sign in with GitHub"
        icon="i-lucide-github"
        label="Continue with GitHub"
        color="neutral"
        variant="solid"
        block
        size="lg"
        @click="signInWithGitHub"
      />

      <UDivider label="or" />

      <!-- Magic Link -->
      <template v-if="!magicLinkSent">
        <form aria-label="Magic link sign in" class="space-y-3" @submit.prevent="handleMagicLink">
          <UFormField label="Email">
            <UInput
              v-model="email"
              aria-label="Email address"
              type="email"
              placeholder="you@example.com"
              size="lg"
              icon="i-lucide-mail"
              required
            />
          </UFormField>
          <UButton
            aria-label="Send magic link"
            type="submit"
            label="Send magic link"
            block
            size="lg"
          />
        </form>
      </template>
      <template v-else>
        <UAlert
          icon="i-lucide-mail-check"
          title="Check your email"
          description="We sent a magic link to your email. Click the link to sign in."
          color="success"
        />
      </template>
    </div>
  </div>
</template>
