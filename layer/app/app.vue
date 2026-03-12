<script setup lang="ts">
const { appName } = useRuntimeConfig().public

useHead({
  meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
  link: [{ rel: 'icon', href: '/favicon.ico' }],
  htmlAttrs: { lang: 'en', dir: 'ltr' },
})

useSeoMeta({
  titleTemplate: `%s - ${appName}`,
  title: appName,
})
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator color="var(--ui-primary)" />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

  </UApp>
</template>
