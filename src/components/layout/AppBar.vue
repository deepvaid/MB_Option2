<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useTheme } from 'vuetify'
import { useRouter } from 'vue-router'
import { useAccountsStore } from '@/stores/useAccounts'
import { useCopilotStore } from '@/stores/useCopilot'

const copilot = useCopilotStore()

const theme = useTheme()
const router = useRouter()
const accountsStore = useAccountsStore()

const notificationCount = ref(18)
const userName = ref('Ross Andrew Paquette')
const userInitials = ref('RP')
const userEmail = ref('Ross@maropost.com')
const userRole = ref('Super Admin')
const userAvatarUrl = ref('https://i.pravatar.cc/128?img=12')
const searchOpen = ref(false)
const searchQuery = ref('')
const appbarNotice = ref('')
const appbarNoticeVisible = ref(false)

const currentAccountId = computed(() => accountsStore.activeId)
const settingsRoute = computed(() => ({ name: 'Settings' as const, params: { accountId: currentAccountId.value } }))
const profileRoute = computed(() => `/accounts/${currentAccountId.value}/settings/profile`)
const appsRoute = computed(() => ({ name: 'AppStore' as const, params: { accountId: currentAccountId.value } }))

const accounts = computed(() => accountsStore.accounts)
const activeAccountId = computed(() => accountsStore.activeId)
type ThemeMode = 'light' | 'dark' | 'auto'
const STORAGE_KEY = 'mp-theme-mode'

function getInitialThemeMode(): ThemeMode {
  if (typeof window === 'undefined') return 'light'
  const stored = window.localStorage.getItem(STORAGE_KEY) as ThemeMode | null
  if (stored === 'light' || stored === 'dark' || stored === 'auto') return stored
  return 'light'
}

function applyTheme(mode: ThemeMode) {
  let resolved: 'maropostLight' | 'maropostDark'
  if (mode === 'auto') {
    const prefersDark = typeof window !== 'undefined'
      && window.matchMedia?.('(prefers-color-scheme: dark)').matches
    resolved = prefersDark ? 'maropostDark' : 'maropostLight'
  } else {
    resolved = mode === 'dark' ? 'maropostDark' : 'maropostLight'
  }
  theme.global.name.value = resolved
}

const themeToggleValue = ref<ThemeMode>(getInitialThemeMode())

watch(themeToggleValue, (next) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, next)
  }
  applyTheme(next)
})

let mql: MediaQueryList | null = null
const handleSystemThemeChange = () => {
  if (themeToggleValue.value === 'auto') applyTheme('auto')
}

onMounted(() => {
  applyTheme(themeToggleValue.value)
  if (typeof window !== 'undefined' && window.matchMedia) {
    mql = window.matchMedia('(prefers-color-scheme: dark)')
    mql.addEventListener?.('change', handleSystemThemeChange)
  }
})

onUnmounted(() => {
  mql?.removeEventListener?.('change', handleSystemThemeChange)
})

function switchAccount(id: string) {
  accountsStore.switchTo(id)
}

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
  copilot.open()
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
        <v-card width="620" max-width="calc(100vw - 32px)" rounded="lg" flat border class="appbar-search-menu">
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
        <v-tooltip text="Da Vinci AI" location="bottom">
          <template #activator="{ props }">
            <v-btn v-bind="props" icon variant="text" class="appbar-action-btn" aria-label="Da Vinci AI" @click="copilot.toggle()">
              <v-icon>sparkles</v-icon>
            </v-btn>
          </template>
        </v-tooltip>

        <v-tooltip text="Notifications" location="bottom">
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              variant="text"
              icon
              class="appbar-action-btn position-relative"
              :aria-label="notificationCount > 0 ? `Notifications, ${notificationCount} unread` : 'Notifications'"
            >
              <v-icon>bell</v-icon>
              <v-badge v-if="notificationCount > 0" :content="notificationCount" color="error" floating class="notification-badge" />
            </v-btn>
          </template>
        </v-tooltip>

        <v-tooltip text="Galaxy" location="bottom">
          <template #activator="{ props }">
            <v-btn v-bind="props" icon variant="text" class="appbar-action-btn" aria-label="Galaxy" @click="openStub('Galaxy')">
              <v-icon>book-open</v-icon>
            </v-btn>
          </template>
        </v-tooltip>

        <v-tooltip text="Settings" location="bottom">
          <template #activator="{ props }">
            <v-btn v-bind="props" icon variant="text" class="appbar-action-btn" aria-label="Settings" :to="settingsRoute">
              <v-icon>settings</v-icon>
            </v-btn>
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
            <v-avatar size="26" class="user-pill__avatar">
              <v-img :src="userAvatarUrl" :alt="userName" cover>
                <template #placeholder>
                  <div class="user-avatar-fallback user-avatar-fallback--sm">{{ userInitials }}</div>
                </template>
                <template #error>
                  <div class="user-avatar-fallback user-avatar-fallback--sm">{{ userInitials }}</div>
                </template>
              </v-img>
            </v-avatar>
            <span class="user-pill__name d-none d-md-block">{{ userName }}</span>
            <v-icon size="14" class="user-pill__chevron">chevron-down</v-icon>
          </button>
        </template>
          <div class="user-menu-card">
            <!-- Header block -->
            <div class="um-header">
              <v-avatar size="56" class="flex-shrink-0">
                <v-img :src="userAvatarUrl" :alt="userName" cover>
                  <template #placeholder>
                    <div class="user-avatar-fallback user-avatar-fallback--lg">{{ userInitials }}</div>
                  </template>
                  <template #error>
                    <div class="user-avatar-fallback user-avatar-fallback--lg">{{ userInitials }}</div>
                  </template>
                </v-img>
              </v-avatar>
              <div class="um-header__info">
                <div class="um-header__name">{{ userName }}</div>
                <div class="um-header__email">{{ userEmail }}</div>
                <v-chip size="x-small" variant="tonal" color="primary" class="mt-1">{{ userRole }}</v-chip>
              </div>
            </div>

            <div class="um-divider" />

            <!-- PERSONAL -->
            <div class="um-section">
              <div class="um-subheader">Personal</div>
              <div class="um-item" @click="$router.push(profileRoute)">
                <v-icon class="um-item__icon" size="20">user</v-icon>
                <div class="um-item__body">
                  <div class="um-item__title">My Profile</div>
                  <div class="um-item__sub">View and edit your info</div>
                </div>
              </div>
              <div class="um-item">
                <v-icon class="um-item__icon" size="20">sun-moon</v-icon>
                <div class="um-item__body">
                  <div class="um-item__title">Theme</div>
                  <div class="um-item__sub">Toggle light or dark mode</div>
                </div>
                <v-btn-toggle
                  v-model="themeToggleValue"
                  density="comfortable"
                  mandatory
                  class="theme-segment ml-auto"
                >
                  <v-btn value="light" icon="sun" variant="text" aria-label="Light theme" />
                  <v-btn value="dark" icon="moon" variant="text" aria-label="Dark theme" />
                  <v-btn value="auto" icon="monitor" variant="text" aria-label="Match system theme" />
                </v-btn-toggle>
              </div>
            </div>

            <div class="um-divider" />

            <!-- ACCOUNT -->
            <div class="um-section">
              <div class="um-subheader">Account</div>
              <div class="um-item" @click="$router.push(settingsRoute)">
                <v-icon class="um-item__icon" size="20">settings</v-icon>
                <div class="um-item__body"><div class="um-item__title">Account Settings</div><div class="um-item__sub">Company, users, permissions</div></div>
              </div>
              <div class="um-item" @click="openStub('Billing')">
                <v-icon class="um-item__icon" size="20">credit-card</v-icon>
                <div class="um-item__body"><div class="um-item__title">Billing</div><div class="um-item__sub">Plan, usage, invoices</div></div>
              </div>
              <div class="um-item" @click="openStub('Galaxy')">
                <v-icon class="um-item__icon" size="20">target</v-icon>
                <div class="um-item__body"><div class="um-item__title">Galaxy</div><div class="um-item__sub">Cross-product workspace</div></div>
              </div>
              <div class="um-item" @click="openStub('Roadmap')">
                <v-icon class="um-item__icon" size="20">route</v-icon>
                <div class="um-item__body"><div class="um-item__title">Roadmap</div><div class="um-item__sub">Planned product work</div></div>
              </div>
              <div class="um-item" @click="openStub('System Status')">
                <v-icon class="um-item__icon" size="20">shield-check</v-icon>
                <div class="um-item__body"><div class="um-item__title">System Status</div><div class="um-item__sub">Trust and availability</div></div>
              </div>
            </div>

            <div class="um-divider" />

            <!-- SWITCH ACCOUNT -->
            <div class="um-section">
              <div class="um-subheader">Switch Account</div>
              <div
                v-for="account in accounts"
                :key="account.id"
                class="um-item"
                :class="{ 'um-item--active': account.id === activeAccountId }"
                @click="switchAccount(account.id)"
              >
                <v-avatar size="28" variant="tonal" :color="account.id === activeAccountId ? 'primary' : undefined" class="flex-shrink-0 um-item__avatar">
                  {{ account.name.slice(0, 2).toUpperCase() }}
                </v-avatar>
                <div class="um-item__body"><div class="um-item__title">{{ account.name }}</div></div>
                <v-icon v-if="account.id === activeAccountId" size="16" color="primary" class="ml-auto">check-circle-2</v-icon>
              </div>
            </div>

            <div class="um-divider" />

            <!-- Sign out -->
            <div class="um-section um-section--last">
              <div class="um-item um-item--danger" @click="openStub('Sign out')">
                <v-icon class="um-item__icon" size="20">log-out</v-icon>
                <div class="um-item__body"><div class="um-item__title">Sign Out</div></div>
              </div>
            </div>
          </div>
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
  gap: 6px;
}

.appbar-utilities :deep(.appbar-action-btn) {
  width: 36px;
  height: 36px;
  border-radius: var(--r-pill);
  color: var(--ink);
  opacity: 0.82;
  transition: background 120ms ease, opacity 120ms ease;
}

.appbar-utilities :deep(.appbar-action-btn:hover) {
  background: var(--surface-2);
  opacity: 1;
}

.appbar-utilities :deep(.appbar-action-btn .v-icon) {
  font-size: 20px;
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

.user-avatar-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-on-primary));
  font-weight: 700;
}

.user-avatar-fallback--sm {
  font-size: 11px;
}

.user-avatar-fallback--lg {
  font-size: 20px;
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

/* ── Profile dropdown ───────────────────────────── */
.user-menu-card {
  width: 360px;
  background: rgb(var(--v-theme-surface));
  border: 1px solid var(--hairline);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06);
  overflow: hidden;
  max-height: 90vh;
  overflow-y: auto;
}

.um-header {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 18px;
  background: rgb(var(--v-theme-surface-variant));
}

.um-header__info {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.um-header__name {
  font-size: 16px;
  font-weight: 600;
  line-height: 1.2;
  color: rgb(var(--v-theme-on-surface));
}

.um-header__email {
  font-size: 13px;
  color: rgb(var(--v-theme-on-surface-variant));
}

.um-divider {
  height: 1px;
  background: rgb(var(--v-theme-outline-variant));
}

.um-section {
  padding: 8px;
}

.um-section--last {
  padding-bottom: 12px;
}

.um-subheader {
  padding: 8px 12px 4px;
  font-size: 11px;
  font-weight: 600;
  line-height: 1;
  color: rgb(var(--v-theme-on-surface-variant));
  text-transform: uppercase;
  letter-spacing: 1px;
}

.um-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 100ms ease;
}

.um-item:hover {
  background: rgb(var(--v-theme-surface-variant));
}

.um-item--active {
  background: rgb(var(--v-theme-primary-container));
}

.um-item--active:hover {
  background: rgb(var(--v-theme-primary-container));
}

.um-item--active .um-item__title {
  color: rgb(var(--v-theme-on-primary-container));
  font-weight: 600;
}

.um-item__icon {
  color: rgb(var(--v-theme-on-surface-variant));
  flex-shrink: 0;
}

.um-item__avatar {
  font-size: 11px;
  font-weight: 600;
}

.um-item__body {
  flex: 1;
  min-width: 0;
}

.um-item__title {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.3;
  color: rgb(var(--v-theme-on-surface));
}

.um-item__sub {
  font-size: 12.5px;
  line-height: 1.3;
  color: rgb(var(--v-theme-on-surface-variant));
  margin-top: 2px;
}

.um-item--danger .um-item__title,
.um-item--danger .um-item__icon {
  color: rgb(var(--v-theme-error)) !important;
}

.um-item--danger:hover {
  background: rgba(var(--v-theme-error), 0.06);
}

.theme-segment.v-btn-group {
  flex-shrink: 0;
  align-self: center;
  align-items: center;
  min-height: 36px;
  height: auto !important;
  padding: 3px;
  border: 1px solid var(--hairline);
  border-radius: var(--r-pill);
  background: var(--surface-2);
  overflow-x: auto;
  overflow-y: visible;
}

.theme-segment :deep(.v-btn) {
  width: 32px !important;
  min-width: 32px !important;
  height: 30px !important;
  min-height: 30px !important;
  padding: 0 !important;
  border-radius: 999px !important;
}

.theme-segment :deep(.v-btn .v-btn__content) {
  display: flex;
  align-items: center;
  justify-content: center;
  block-size: 100%;
  inline-size: 100%;
}

.theme-segment :deep(.v-btn .v-icon) {
  font-size: 18px;
  line-height: 1;
  block-size: 1em;
  inline-size: 1em;
}

.theme-segment :deep(.v-btn--active) {
  background: var(--surface-1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
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
