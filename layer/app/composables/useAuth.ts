import { createAuthClient } from 'better-auth/vue'
import { magicLinkClient } from 'better-auth/client/plugins'

const authClient = createAuthClient({
  plugins: [magicLinkClient()],
})

export async function useAuth() {
  const session = await authClient.useSession(useFetch)

  return {
    session,
    signInWithGitHub: () => {
      authClient.signIn.social({
        provider: 'github',
        callbackURL: '/dashboard',
      })
    },
    signInWithMagicLink: (email: string) =>
      authClient.signIn.magicLink({
        email,
        callbackURL: '/dashboard',
      }),
    signOut: () => {
      authClient.signOut({
        fetchOptions: {
          onSuccess: () => { navigateTo('/') },
        },
      })
    },
    user: computed(() => session.data.value?.user),
    isAuthenticated: computed(() => !!session.data.value?.user),
  }
}
