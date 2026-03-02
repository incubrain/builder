<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

const { signInWithGitHub, isAuthenticated } = useAuth()
const email = ref('')
const magicLinkSent = ref(false)
const toast = useToast()

// Redirect if already authenticated
watch(isAuthenticated, (val) => {
  if (val) navigateTo('/dashboard')
}, { immediate: true })

async function handleMagicLink() {
  if (!email.value) return
  try {
    const { signInWithMagicLink } = useAuth()
    await signInWithMagicLink(email.value)
    magicLinkSent.value = true
    toast.add({ title: 'Check your email', description: 'We sent you a magic link to sign in.', color: 'success' })
  }
  catch {
    toast.add({ title: 'Error', description: 'Failed to send magic link. Please try again.', color: 'error' })
  }
}
</script>

<template>
  <div>
    <div class="text-center mb-8">
      <UIcon name="i-lucide-blocks" class="size-10 text-primary mb-4" />
      <h1 class="text-2xl font-bold text-highlighted">
        Welcome back
      </h1>
      <p class="text-muted mt-1">
        Sign in to your account
      </p>
    </div>

    <div class="space-y-4">
      <!-- GitHub OAuth -->
      <UButton
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
        <form class="space-y-3" @submit.prevent="handleMagicLink">
          <UFormField label="Email">
            <UInput
              v-model="email"
              type="email"
              placeholder="you@example.com"
              size="lg"
              icon="i-lucide-mail"
              required
            />
          </UFormField>
          <UButton
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
