<script setup lang="ts">
import { computed, ref } from 'vue'
import { useTheme } from 'vuetify'
import { useRouter } from 'vue-router'
import { useAccountsStore } from '@/stores/useAccounts'

const copilotOpen = defineModel<boolean>('copilotOpen', { default: false })

const theme = useTheme()
const router = useRouter()
const accountsStore = useAccountsStore()

const notificationCount = ref(18)
const userName = ref('Deepak Vaidya')
const userInitials = ref('DV')
const userEmail = ref('deepak.v@maropost.com')
const userRole = ref('Super Admin')
const searchOpen = ref(false)
const searchQuery = ref('')
const appbarNotice = ref('')
const appbarNoticeVisible = ref(false)

const isDark = computed(() => theme.global.current.value.dark)

const currentAccountId = computed(() => accountsStore.activeId)
const settingsRoute = computed(() => ({ name: 'Settings' as const, params: { accountId: currentAccountId.value } }))
const appsRoute = computed(() => ({ name: 'AppStore' as const, params: { accountId: currentAccountId.value } }))

const searchSources = computed(() => [
  { group: 'Dashboards', icon: 'layout-dashboard', title: 'Marketing Dashboard', subtitle: 'Performance, revenue, and audience widgets', route: { name: 'Dashboard' as const, params: { accountId: currentAccountId.value } } },
  { group: 'Dashboards', icon: 'layout-list', title: 'Manage dashboards', subtitle: 'Create, edit, and assign dashboards', route: { name: 'DashboardsList' as const, params: { accountId: currentAccountId.value } } },
  { group: 'Commerce', icon: 'shopping-cart', title: 'Sales orders', subtitle: 'Find orders, payments, and fulfillment status', route: { name: 'SalesOrders' as const, params: { accountId: currentAccountId.value } } },
  { group: 'Marketing', icon: 'mail', title: 'Email campaigns', subtitle: 'Search campaigns, tags, folders, and sends', route: { name: 'EmailCampaigns' as const, params: { accountId: currentAccountId.value } } },
  { group: 'Contacts', icon: 'users', title: 'Contacts', subtitle: 'Profiles, lists, segments, and fields', route: { name: 'AllContacts' as const, params: { accountId: currentAccountId.value } } },
  { group: 'AI', icon: 'sparkles', title: 'Da Vinci insights', subtitle: 'Ask for automations, insights, and widget ideas', route: { name: 'DaVinciDashboard' as const, params: { accountId: currentAccountId.value } } },
  { group: 'Apps', icon: 'puzzle', title: 'Installed apps', subtitle: 'Connectors available for this customer', route: appsRoute.value },
  { group: 'Admin', icon: 'settings', title: 'Settings', subtitle: 'Company, billing, users, and permissions', route: settingsRoute.value },
])

const filteredSearchGroups = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  const results = query
    ? searchSources.value.filter((item) =>
      item.title.toLowerCase().includes(query)
      || item.subtitle.toLowerCase().includes(query)
      || item.group.toLowerCase().includes(query),
    )
    : searchSources.value.slice(0, 6)

  return Object.entries(
    results.reduce<Record<string, typeof results>>((groups, item) => {
      groups[item.group] = [...(groups[item.group] ?? []), item]
      return groups
    }, {}),
  )
})

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'maropostLight' : 'maropostDark'
}

function showAppbarNotice(message: string) {
  appbarNotice.value = message
  appbarNoticeVisible.value = true
}

function navigateToRoute(routeLocation: object) {
  searchOpen.value = false
  router.push(routeLocation)
}

function askDaVinciFromSearch() {
  searchOpen.value = false
  copilotOpen.value = true
}

function openStub(label: string) {
  showAppbarNotice(`${label} is represented as a prototype action.`)
}

</script>

<template>
  <v-app-bar height="60" color="surface" flat class="mp-appbar">
    <div class="mp-appbar-shell w-100 d-flex align-center px-4 gap-2">
      <v-menu v-model="searchOpen" location="bottom start" offset="8" :close-on-content-click="false">
        <template #activator="{ props }">
          <v-text-field
            v-bind="props"
            v-model="searchQuery"
            density="compact"
            variant="outlined"
            hide-details
            prepend-inner-icon="sparkles"
            placeholder="Ask Da Vinci or search"
            aria-label="Universal AI search"
            rounded="lg"
            class="appbar-search"
            bg-color="surface"
            clearable
            @focus="searchOpen = true"
            @keydown.enter.prevent="askDaVinciFromSearch"
          >
            <template #append-inner>
              <kbd class="appbar-search-cmd">⌘K</kbd>
            </template>
          </v-text-field>
        </template>
        <v-card width="620" rounded="lg" flat border class="appbar-search-menu">
          <div class="appbar-search-menu__hero">
            <v-icon size="20" color="secondary">sparkles</v-icon>
            <div class="min-width-0">
              <div class="text-subtitle-2 font-weight-bold">Ask Da Vinci</div>
              <div class="text-body-2 text-medium-emphasis text-truncate">
                {{ searchQuery.trim() ? `Search and answer “${searchQuery.trim()}” across this workspace` : 'Search dashboards, apps, orders, contacts, campaigns, and settings.' }}
              </div>
            </div>
            <v-btn size="small" color="secondary" variant="flat" class="text-none" @click="askDaVinciFromSearch">
              Ask
            </v-btn>
          </div>
          <v-divider />
          <div v-if="filteredSearchGroups.length" class="appbar-search-menu__results">
            <div v-for="[group, items] in filteredSearchGroups" :key="group" class="appbar-search-group">
              <div class="appbar-search-group__label">{{ group }}</div>
              <button
                v-for="item in items"
                :key="`${group}-${item.title}`"
                type="button"
                class="appbar-search-result"
                @click="navigateToRoute(item.route)"
              >
                <v-avatar size="30" variant="tonal" color="primary">
                  <v-icon size="17">{{ item.icon }}</v-icon>
                </v-avatar>
                <span class="min-width-0">
                  <strong>{{ item.title }}</strong>
                  <small>{{ item.subtitle }}</small>
                </span>
                <v-icon size="16">arrow-right</v-icon>
              </button>
            </div>
          </div>
          <div v-else class="pa-5 text-center text-body-2 text-medium-emphasis">
            No local prototype results. Ask Da Vinci to explore this request.
          </div>
        </v-card>
      </v-menu>

      <v-spacer />

      <div class="appbar-utilities">
        <v-tooltip text="Notifications" location="bottom">
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              variant="text"
              size="small"
              icon
              class="position-relative"
              :aria-label="notificationCount > 0 ? `Notifications, ${notificationCount} unread` : 'Notifications'"
            >
              <v-icon>bell</v-icon>
              <v-badge v-if="notificationCount > 0" :content="notificationCount" color="error" floating class="notification-badge" />
            </v-btn>
          </template>
        </v-tooltip>

        <v-tooltip text="Galaxy Help portal" location="bottom">
          <template #activator="{ props }">
            <v-btn v-bind="props" icon="book-open" variant="text" size="small" aria-label="Galaxy Help portal" @click="openStub('Galaxy Help portal')" />
          </template>
        </v-tooltip>

        <v-tooltip text="Settings" location="bottom">
          <template #activator="{ props }">
            <v-btn v-bind="props" icon="settings" variant="text" size="small" aria-label="Settings" :to="settingsRoute" />
          </template>
        </v-tooltip>
      </div>

      <span class="appbar-divider" aria-hidden="true"></span>

      <v-menu location="bottom end" offset="8">
        <template #activator="{ props }">
          <button
            v-bind="props"
            type="button"
            aria-label="Open user menu"
            class="user-pill"
          >
            <v-avatar color="primary" size="26" class="user-pill__avatar">{{ userInitials }}</v-avatar>
            <span class="user-pill__name d-none d-md-block">{{ userName }}</span>
            <v-icon size="14" class="user-pill__chevron">chevron-down</v-icon>
          </button>
        </template>
          <v-card width="280" rounded="lg" elevation="0" class="user-menu-card">
          <div class="user-menu-header d-flex align-center gap-3">
            <v-avatar color="primary" size="36" class="appbar-avatar-lg">{{ userInitials }}</v-avatar>
            <div>
              <div class="font-weight-bold text-body-2">{{ userName }}</div>
              <div class="text-caption text-medium-emphasis">{{ userEmail }}</div>
              <v-chip size="x-small" variant="tonal" color="primary" class="mt-1">{{ userRole }}</v-chip>
            </div>
          </div>

          <v-divider class="mx-4" />

          <v-list density="compact" :border="false" class="px-2 pt-2 pb-1">
            <v-list-subheader class="text-uppercase font-weight-bold appbar-subheader">Personal</v-list-subheader>
            <v-list-item prepend-icon="user" title="My Profile" :to="settingsRoute" rounded="lg" class="mb-0 menu-item" />
            <v-list-item
              :prepend-icon="isDark ? 'moon' : 'sun'"
              title="Theme"
              rounded="lg"
              class="mb-0 menu-item theme-toggle-item"
              @click="toggleTheme"
            >
              <template #append>
                <v-switch
                  :model-value="isDark"
                  density="compact"
                  hide-details
                  inset
                  color="primary"
                  readonly
                  tabindex="-1"
                  class="theme-switch"
                />
              </template>
            </v-list-item>
          </v-list>

          <v-divider class="mx-4" />

          <v-list density="compact" :border="false" class="px-2 pt-2 pb-1">
            <v-list-subheader class="text-uppercase font-weight-bold appbar-subheader">Account</v-list-subheader>
            <v-list-item prepend-icon="settings" title="Account Settings" :to="settingsRoute" rounded="lg" class="mb-0 menu-item" />
            <v-list-item prepend-icon="credit-card" title="Billing" :to="settingsRoute" rounded="lg" class="mb-0 menu-item" />
            <v-list-item prepend-icon="map-pin" title="Roadmap" rounded="lg" class="mb-0 menu-item" @click="openStub('Roadmap')" />
            <v-list-item prepend-icon="shield-check" title="System Status" rounded="lg" class="mb-0 menu-item" @click="openStub('System Status')" />
          </v-list>

          <v-divider class="mx-4" />

          <v-list density="compact" :border="false" class="px-2 py-1">
            <v-list-item
              prepend-icon="log-out"
              title="Sign Out"
              rounded="lg"
              class="menu-item sign-out-item"
              base-color="error"
            />
          </v-list>
        </v-card>
      </v-menu>
    </div>

    <v-snackbar v-model="appbarNoticeVisible" timeout="2400" color="surface" location="bottom right">
      {{ appbarNotice }}
    </v-snackbar>
  </v-app-bar>
</template>

<style scoped lang="scss">
.mp-appbar {
  border-bottom: 1px solid var(--hairline);
  background: var(--surface-1) !important;
}

.mp-appbar-shell {
  min-width: 0;
  padding: 0 22px;
  height: 100%;
}

.min-width-0 {
  min-width: 0;
}

.appbar-utilities {
  display: flex;
  align-items: center;
  gap: 2px;
}

.appbar-utilities :deep(.v-btn) {
  width: 32px;
  height: 32px;
  border-radius: var(--r-pill);
  color: var(--ink);
  opacity: 0.72;
  transition: background 120ms ease, opacity 120ms ease;
}

.appbar-utilities :deep(.v-btn:hover) {
  background: var(--surface-2);
  opacity: 1;
}

.appbar-utilities :deep(.v-icon) {
  font-size: 17px;
}

.appbar-divider {
  display: block;
  width: 1px;
  height: 22px;
  margin-inline: 8px;
  background: var(--hairline);
  flex-shrink: 0;
}

.user-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  border: 1px solid var(--hairline);
  border-radius: var(--r-pill);
  background: transparent;
  cursor: pointer;
  font: inherit;
  appearance: none;
  transition: background 120ms ease, border-color 120ms ease;
}

.user-pill:hover {
  background: var(--surface-2);
}

.user-pill:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px color-mix(in oklch, var(--accent) 18%, transparent);
}

.user-pill__avatar {
  font-size: 11px;
  font-weight: 700;
  color: var(--accent-fg) !important;
}

.user-pill__name {
  max-width: 96px;
  overflow: hidden;
  color: var(--ink);
  font-size: 13px;
  font-weight: 600;
  line-height: 1.15;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-pill__chevron {
  color: var(--muted);
}

.user-menu-card {
  border-color: var(--hairline);
}

.user-menu-header {
  background: var(--surface-2);
  padding: 12px 16px;
}

.user-menu-card :deep(.v-list-item.menu-item) {
  min-height: 32px;
  padding-inline: 10px;
}
.user-menu-card :deep(.menu-item .v-list-item-title) {
  font-size: 12px;
  font-weight: 560;
  line-height: 1.2;
}
.user-menu-card :deep(.menu-item .v-list-item__prepend > .v-icon) {
  font-size: 18px;
  margin-inline-end: 12px;
  opacity: 0.85;
}
.user-menu-card :deep(.v-list-subheader) {
  min-height: 24px;
  padding-inline-start: 10px;
}

.theme-switch {
  flex: 0 0 auto;
  margin: 0;
  pointer-events: none;
  transform: scale(0.8);
  transform-origin: center right;
}
.theme-switch :deep(.v-selection-control) {
  min-height: 0;
}
.theme-switch :deep(.v-switch__track) {
  background: rgba(var(--v-theme-on-surface), 0.32);
  opacity: 1;
}
.theme-switch :deep(.v-selection-control--dirty .v-switch__track) {
  background: var(--accent);
}
.theme-switch :deep(.v-switch__thumb) {
  background: var(--surface-1);
}
.theme-toggle-item :deep(.v-list-item__append) {
  align-self: center;
}
.sign-out-item {
  transition: background 120ms ease;
  color: rgb(var(--v-theme-error));
}
.sign-out-item:hover {
  background: rgba(var(--v-theme-error), 0.06);
}
.sign-out-item :deep(.v-list-item__prepend .v-icon),
.sign-out-item :deep(.v-list-item-title) {
  color: rgb(var(--v-theme-error));
}

.appbar-subheader {
  font-size: 11px;
  letter-spacing: 0.05em;
  color: var(--muted);
}

.appbar-search {
  flex: 1 1 460px;
  max-width: 560px;
  min-width: 260px;
}

:deep(.appbar-search .v-field) {
  border-radius: var(--r-pill);
  background: var(--surface-2);
  border: 1px solid var(--hairline);
}

:deep(.appbar-search .v-field__outline) {
  --v-field-border-opacity: 0;
}

:deep(.appbar-search .v-field--focused .v-field__outline) {
  --v-field-border-opacity: 0;
}

:deep(.appbar-search .v-field--focused) {
  background: var(--surface-1);
  box-shadow: 0 0 0 3px color-mix(in oklch, var(--accent) 12%, transparent);
  border-color: var(--accent);
}

:deep(.appbar-search .v-field__input) {
  font-size: 13.5px;
  font-weight: 500;
  min-height: 36px;
  padding-top: 6px;
  padding-bottom: 6px;
}

:deep(.appbar-search input::placeholder) {
  color: var(--muted);
  font-weight: 500;
}

:deep(.appbar-search .v-field__prepend-inner .v-icon) {
  color: var(--accent);
}

.appbar-search-cmd {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  padding: 1px 6px;
  border: 1px solid var(--hairline);
  border-radius: var(--r-pill);
  background: transparent;
  color: var(--muted);
  font-family: ui-monospace, "SF Mono", monospace;
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
}

.appbar-search-menu {
  border-color: var(--hairline);
  overflow: hidden;
}

.appbar-search-menu__hero {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
  padding: 14px;
  background: var(--surface-2);
}

.appbar-search-menu__results {
  max-height: 420px;
  overflow: auto;
  padding: 8px;
}

.appbar-search-group + .appbar-search-group {
  margin-top: 8px;
}

.appbar-search-group__label {
  padding: 8px 8px 4px;
  color: var(--muted);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.appbar-search-result {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-height: 58px;
  padding: 9px 10px;
  border: 0;
  border-radius: var(--r-chip);
  background: transparent;
  color: inherit;
  cursor: pointer;
  font: inherit;
  text-align: left;
}

.appbar-search-result:hover,
.appbar-search-result:focus-visible {
  background: var(--surface-2);
}

.appbar-search-result:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px color-mix(in oklch, var(--accent) 18%, transparent);
}

.appbar-search-result strong,
.appbar-search-result small {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.appbar-search-result strong {
  font-size: 13px;
  font-weight: 600;
  line-height: 1.3;
}

.appbar-search-result small {
  margin-top: 2px;
  color: var(--muted);
  font-size: 11px;
}

.notification-badge :deep(.v-badge__badge) {
  height: 16px;
  min-width: 16px;
  padding-inline: 4px;
  font-size: 10px;
  line-height: 16px;
  background: var(--neg) !important;
  box-shadow: 0 0 0 2px var(--surface-1);
}

@media (max-width: 1180px) {
  .appbar-search {
    max-width: 420px;
  }
}
</style>
