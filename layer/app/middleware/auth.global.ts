export default defineNuxtRouteMiddleware(async (to) => {
  const { isAuthenticated } = await useAuth()

  // Protect dashboard routes
  if (to.path.startsWith('/dashboard') && !isAuthenticated.value) {
    return navigateTo('/login')
  }

  // Redirect authenticated users away from login
  if (to.path === '/login' && isAuthenticated.value) {
    return navigateTo('/dashboard')
  }
})
