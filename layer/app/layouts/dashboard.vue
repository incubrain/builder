<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const { user, signOut } = await useAuth()

const navItems: NavigationMenuItem[] = [
  {
    label: 'Home',
    icon: 'i-lucide-house',
    to: '/dashboard',
  },
  {
    label: 'Settings',
    icon: 'i-lucide-settings',
    to: '/dashboard/settings',
  },
]

const bottomItems: NavigationMenuItem[] = [
  {
    label: 'Help',
    icon: 'i-lucide-circle-help',
    to: '#',
  },
]
</script>

<template>
  <UDashboardGroup>
    <UDashboardSidebar
      aria-label="Main sidebar"
      collapsible
      resizable
      :ui="{ footer: 'border-t border-default' }"
    >
      <template #header="{ collapsed }">
        <div class="flex items-center" :class="collapsed ? 'justify-center' : 'gap-2 px-1'">
          <UIcon name="i-lucide-blocks" class="size-6 text-primary shrink-0" aria-hidden="true" />
          <span v-if="!collapsed" class="font-semibold text-highlighted truncate">Builder</span>
        </div>
      </template>

      <template #default="{ collapsed }">
        <UNavigationMenu
          aria-label="Main navigation"
          :collapsed="collapsed"
          :items="navItems"
          orientation="vertical"
        />

        <UNavigationMenu
          aria-label="Secondary navigation"
          :collapsed="collapsed"
          :items="bottomItems"
          orientation="vertical"
          class="mt-auto"
        />
      </template>

      <template #footer="{ collapsed }">
        <UDropdownMenu
          :items="[[{
            label: 'Sign out',
            icon: 'i-lucide-log-out',
            onSelect: signOut,
          }]]"
        >
          <UButton
            aria-label="User menu"
            :avatar="user?.image ? { src: user.image } : undefined"
            :icon="!user?.image ? 'i-lucide-user' : undefined"
            :label="collapsed ? undefined : (user?.name || user?.email || 'Account')"
            color="neutral"
            variant="ghost"
            class="w-full"
            :block="collapsed"
          />
        </UDropdownMenu>
      </template>
    </UDashboardSidebar>

    <UDashboardPanel aria-label="Main content">
      <template #header>
        <UDashboardNavbar :title="$route.meta.title as string || 'Dashboard'" />
      </template>

      <main class="p-6">
        <slot />
      </main>
    </UDashboardPanel>
  </UDashboardGroup>
</template>
