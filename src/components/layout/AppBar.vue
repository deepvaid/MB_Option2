<script setup lang="ts">
import { ref } from 'vue'
import { useTheme } from 'vuetify'

const copilotOpen = defineModel<boolean>('copilotOpen', { default: false })

const theme = useTheme()
const notificationCount = ref(18)
const userName = ref('Deepak Vaidya')
const userInitials = ref('DV')
const userEmail = ref('deepak.v@maropost.com')
const userRole = ref('Super Admin')
const accountName = ref('MMC-MSC-MCC Scooter Village')

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'maropostLight' : 'maropostDark'
}
</script>

<template>
  <v-app-bar height="56" color="surface" flat class="mp-appbar">
    <div class="mp-appbar-shell w-100 d-flex align-center px-4 gap-3">
      <!-- Global search -->
      <v-text-field
        density="comfortable"
        variant="outlined"
        hide-details
        prepend-inner-icon="mdi-magnify"
        placeholder="Search campaigns, contacts, orders..."
        aria-label="Search workspace content"
        rounded="lg"
        class="appbar-search"
        bg-color="surface-variant"
      />

      <!-- Account switcher -->
      <v-menu location="bottom start" offset="8">
        <template v-slot:activator="{ props }">
          <button
            v-bind="props"
            type="button"
            :aria-label="`Switch workspace. Current workspace ${accountName}`"
            class="d-flex align-center gap-2 cursor-pointer py-1 px-2 rounded-lg account-switcher-trigger"
          >
            <v-avatar color="primary" size="26" class="appbar-avatar-sm account-avatar">{{ userInitials }}</v-avatar>
            <div class="d-none d-md-block account-summary">
              <div class="text-caption font-weight-medium text-truncate account-name">{{ accountName }}</div>
              <div class="text-caption text-medium-emphasis account-user">{{ userName }}</div>
            </div>
            <v-icon size="14" color="medium-emphasis">mdi-chevron-down</v-icon>
          </button>
        </template>
        <v-card width="320" rounded="xl" flat border class="account-switcher-card">
          <!-- Current account header -->
          <div class="account-menu-header d-flex align-center gap-3">
            <v-avatar color="primary" size="40" class="appbar-avatar-md">{{ userInitials }}</v-avatar>
            <div class="account-min-width">
              <div class="font-weight-semibold text-body-2 text-truncate">{{ accountName }}</div>
              <div class="text-caption text-medium-emphasis">{{ userName }}</div>
            </div>
          </div>
          <v-divider />
          <v-list density="compact" :border="false" class="pa-3">
            <v-list-subheader class="text-uppercase mb-1 appbar-subheader">Switch Account</v-list-subheader>
            <v-list-item rounded="lg" class="mb-1 account-list-item" active active-color="primary">
              <template v-slot:prepend>
                <v-avatar size="28" color="primary" variant="tonal" class="mr-3 appbar-avatar-initials">MP</v-avatar>
              </template>
              <div class="text-body-2 font-weight-medium account-item-text">MMC-MSC-MCC Scooter Village</div>
              <template v-slot:append>
                <v-icon size="16" color="primary">mdi-check-circle</v-icon>
              </template>
            </v-list-item>
            <v-list-item rounded="lg" class="account-list-item">
              <template v-slot:prepend>
                <v-avatar size="28" color="secondary" variant="tonal" class="mr-3 appbar-avatar-initials">MD</v-avatar>
              </template>
              <div class="text-body-2 account-item-text">Maropost Demo Store</div>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>

      <div class="mx-2" />

      <v-spacer />

      <!-- Da Vinci Copilot trigger -->
      <v-tooltip text="Da Vinci Copilot" location="bottom">
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            size="small"
            :variant="copilotOpen ? 'flat' : 'text'"
            icon
            :aria-label="copilotOpen ? 'Close Da Vinci Copilot' : 'Open Da Vinci Copilot'"
            @click="copilotOpen = !copilotOpen"
            :class="['copilot-trigger', { 'copilot-trigger--active': copilotOpen }]"
          >
            <v-icon>mdi-creation</v-icon>
          </v-btn>
        </template>
      </v-tooltip>

      <!-- Notification bell -->
      <v-btn
        variant="text"
        size="small"
        icon
        class="position-relative"
        :aria-label="notificationCount > 0 ? `Notifications, ${notificationCount} unread` : 'Notifications'"
      >
        <v-icon>mdi-bell-outline</v-icon>
        <v-badge v-if="notificationCount > 0" :content="notificationCount" color="error" floating class="notification-badge" />
      </v-btn>

      <!-- Theme toggle -->
      <v-tooltip text="Toggle dark mode" location="bottom">
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            icon="mdi-theme-light-dark"
            variant="text"
            size="small"
            :aria-label="theme.global.current.value.dark ? 'Switch to light theme' : 'Switch to dark theme'"
            @click="toggleTheme"
          />
        </template>
      </v-tooltip>

      <div class="mx-2" />

      <!-- User menu -->
      <v-menu location="bottom end" offset="8">
        <template v-slot:activator="{ props }">
          <button
            v-bind="props"
            type="button"
            aria-label="Open user menu"
            class="d-flex align-center gap-2 cursor-pointer py-1 px-2 rounded-lg user-menu-trigger"
          >
            <v-avatar color="primary" size="30" class="user-avatar-ring appbar-avatar-sm">{{ userInitials }}</v-avatar>
            <span class="text-body-2 font-weight-medium d-none d-sm-block">{{ userName }}</span>
            <v-icon size="16" color="medium-emphasis">mdi-chevron-down</v-icon>
          </button>
        </template>
        <v-card min-width="280" rounded="xl" elevation="0" class="user-menu-card">
          <!-- User header -->
          <div class="user-menu-header d-flex align-center gap-3">
            <v-avatar color="primary" size="44" class="appbar-avatar-lg">{{ userInitials }}</v-avatar>
            <div>
              <div class="font-weight-bold text-body-2">{{ userName }}</div>
              <div class="text-caption text-medium-emphasis">{{ userEmail }}</div>
              <v-chip size="x-small" variant="tonal" color="primary" class="mt-1">{{ userRole }}</v-chip>
            </div>
          </div>

          <v-divider class="mx-4" />

          <!-- Personal -->
          <v-list density="compact" :border="false" class="px-3 pt-3 pb-1">
            <v-list-subheader class="text-uppercase font-weight-bold appbar-subheader">Personal</v-list-subheader>
            <v-list-item prepend-icon="mdi-account-outline" title="My Profile" subtitle="View and edit your info" to="/settings" rounded="lg" class="mb-1" />
          </v-list>

          <v-divider class="mx-4" />

          <!-- Account -->
          <v-list density="compact" :border="false" class="px-3 pt-3 pb-1">
            <v-list-subheader class="text-uppercase font-weight-bold appbar-subheader">Account</v-list-subheader>
            <v-list-item prepend-icon="mdi-cog-outline" title="Account Settings" subtitle="Company, users, permissions" to="/settings" rounded="lg" class="mb-1" />
            <v-list-item prepend-icon="mdi-credit-card-outline" title="Billing" subtitle="Plan, usage, invoices" to="/settings" rounded="lg" class="mb-1" />
          </v-list>

          <v-divider class="mx-4" />

          <!-- Sign Out -->
          <v-list density="compact" :border="false" class="px-3 py-2">
            <v-list-item prepend-icon="mdi-logout" title="Sign Out" rounded="lg" class="sign-out-item" color="error" />
          </v-list>
        </v-card>
      </v-menu>
    </div>
  </v-app-bar>
</template>

<style scoped lang="scss">
.mp-appbar {
  border-bottom: 1px solid var(--mp-border-subtle);
  background: rgb(var(--v-theme-surface));
}

.mp-appbar-shell {
  min-width: 0;
  padding-block: 8px;
}

.user-menu-trigger {
  transition: background $mp-transition-fast, border-color $mp-transition-fast;
  appearance: none;
  border: 1px solid transparent;
  background: transparent;
  font: inherit;
  text-align: left;
}
.user-menu-trigger:hover {
  background: rgba(var(--v-theme-surface-variant), 0.58);
  border-color: rgba(var(--v-theme-border), 0.92);
}
.user-avatar-ring {
  box-shadow: inset 0 0 0 1px rgba(var(--v-theme-secondary), 0.08);
  transition: box-shadow $mp-transition-fast;
}
.user-menu-trigger:hover .user-avatar-ring {
  box-shadow: inset 0 0 0 1px rgba(var(--v-theme-secondary), 0.12);
}
.user-menu-card {
  box-shadow: none;
  border-color: var(--mp-border-subtle);
}
.user-menu-header {
  background: rgba(var(--v-theme-surface-variant), 0.66);
  padding: $mp-space-6;
}
.sign-out-item {
  transition: background $mp-transition-fast;
}
.sign-out-item:hover {
  background: rgba(var(--v-theme-error), 0.06);
}
.account-switcher-trigger {
  transition: background $mp-transition-fast, border-color $mp-transition-fast;
  appearance: none;
  border: 1px solid transparent;
  background: transparent;
  font: inherit;
  text-align: left;
}
.account-switcher-trigger:hover {
  background: rgba(var(--v-theme-surface-variant), 0.58);
  border-color: rgba(var(--v-theme-border), 0.92);
}

.user-menu-trigger:focus-visible,
.account-switcher-trigger:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(var(--v-theme-primary), 0.18);
}
.account-switcher-card {
  box-shadow: none;
  border-color: var(--mp-border-subtle);
}
.account-menu-header {
  padding: $mp-space-6;
  background: rgba(var(--v-theme-surface-variant), 0.66);
}
.copilot-trigger {
  transition: background-color $mp-transition-base, color $mp-transition-base, border-color $mp-transition-base, box-shadow $mp-transition-base, transform $mp-transition-base;
  border: 1px solid var(--mp-aurora-border);
  background: var(--mp-aurora-soft-gradient);
  color: rgb(var(--v-theme-primary));
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.35);
}
.copilot-trigger:hover {
  color: rgb(var(--v-theme-primary));
  border-color: rgba(79, 109, 255, 0.32);
  box-shadow: var(--mp-aurora-shadow);
}

.copilot-trigger--active {
  background: var(--mp-aurora-gradient) !important;
  color: var(--mp-aurora-ink) !important;
  border-color: transparent;
  box-shadow: var(--mp-aurora-shadow);
}

.copilot-trigger--active:hover {
  filter: brightness(1.03);
}

:deep(.copilot-trigger .v-btn__overlay) {
  opacity: 0 !important;
}

:deep(.copilot-trigger .v-icon) {
  color: inherit !important;
}

.appbar-search {
  flex: 1 1 var(--mp-layout-searchMaxWidth);
  max-width: 440px;
  min-width: 240px;
}

:deep(.appbar-search .v-field) {
  border-radius: 999px;
  background: rgb(var(--v-theme-surface));
}

:deep(.appbar-search .v-field__outline) {
  color: rgba(var(--v-theme-border), 1);
}

:deep(.appbar-search .v-field--focused .v-field__outline) {
  color: rgba(var(--v-theme-secondary), 0.18);
}

.account-avatar {
  color: rgb(var(--v-theme-secondary));
}

:deep(.appbar-search .v-field__input) {
  font-size: 0.94rem;
}

:deep(.account-list-item.v-list-item--active) {
  background: rgba(var(--v-theme-primary), 0.22);
  color: rgb(var(--v-theme-secondary));
}

:deep(.account-list-item.v-list-item--active .v-list-item__overlay) {
  opacity: 0;
}
.appbar-avatar-sm {
  font-size: var(--mp-typography-fontSize-xs);
  font-weight: var(--mp-typography-fontWeight-bold);
  color: rgb(var(--v-theme-on-primary));
}
.appbar-avatar-md {
  font-weight: var(--mp-typography-fontWeight-bold);
  color: rgb(var(--v-theme-on-primary));
  flex-shrink: 0;
}
.appbar-avatar-lg {
  font-weight: var(--mp-typography-fontWeight-bold);
  color: rgb(var(--v-theme-on-primary));
  flex-shrink: 0;
}
.account-summary {
  line-height: 1.2;
}
.account-name {
  max-width: 160px;
}
.account-user {
  font-size: var(--mp-typography-fontSize-xs);
}
.appbar-subheader {
  font-size: var(--mp-typography-fontSize-xs);
  letter-spacing: 0.05em;
}
.appbar-avatar-initials {
  font-size: var(--mp-typography-fontSize-xs);
  font-weight: var(--mp-typography-fontWeight-bold);
}
.account-item-text {
  white-space: normal;
  line-height: 1.3;
}
.account-min-width {
  min-width: 0;
}
.notification-badge {
  font-size: var(--mp-typography-fontSize-xs);
}
</style>
