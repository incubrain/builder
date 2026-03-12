import { auth, TEST_USER } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  if (!import.meta.dev) {
    throw createError({ statusCode: 404 })
  }

  const appUrl = useRuntimeConfig().public.appUrl || 'http://localhost:3000'

  // Ensure test user exists — sign up first (ignores if already exists)
  try {
    const signUpRes = await auth.api.signUpEmail({
      body: {
        email: TEST_USER.email,
        password: TEST_USER.password,
        name: TEST_USER.name,
      },
      returnHeaders: true,
    })
    const setCookie = signUpRes.headers?.get('set-cookie')
    if (setCookie) {
      appendResponseHeader(event, 'set-cookie', setCookie)
    }
    return { ok: true, user: signUpRes.response.user, redirect: `${appUrl}/dashboard` }
  }
  catch {
    // User already exists — sign in instead
  }

  const signInRes = await auth.api.signInEmail({
    body: { email: TEST_USER.email, password: TEST_USER.password },
    returnHeaders: true,
  })

  const setCookie = signInRes.headers?.get('set-cookie')
  if (setCookie) {
    appendResponseHeader(event, 'set-cookie', setCookie)
  }

  return { ok: true, user: signInRes.response.user, redirect: `${appUrl}/dashboard` }
})
