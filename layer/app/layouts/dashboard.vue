<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const { user, signOut } = useAuth()

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
      collapsible
      resizable
      :ui="{ footer: 'border-t border-default' }"
    >
      <template #header="{ collapsed }">
        <div class="flex items-center" :class="collapsed ? 'justify-center' : 'gap-2 px-1'">
          <UIcon name="i-lucide-blocks" class="size-6 text-primary shrink-0" />
          <span v-if="!collapsed" class="font-semibold text-highlighted truncate">Builder</span>
        </div>
      </template>

      <template #default="{ collapsed }">
        <UNavigationMenu
          :collapsed="collapsed"
          :items="navItems"
          orientation="vertical"
        />

        <UNavigationMenu
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

    <UDashboardPanel>
      <template #header>
        <UDashboardNavbar :title="$route.meta.title as string || 'Dashboard'" />
      </template>

      <div class="p-6">
        <slot />
      </div>
    </UDashboardPanel>
  </UDashboardGroup>
</template>
