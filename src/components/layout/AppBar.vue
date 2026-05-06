<script setup lang="ts">
import { computed, ref } from 'vue'
import { useTheme } from 'vuetify'
import { useRoute, useRouter } from 'vue-router'
import { useAccountsStore, type Account } from '@/stores/useAccounts'

const copilotOpen = defineModel<boolean>('copilotOpen', { default: false })

const theme = useTheme()
const router = useRouter()
const route = useRoute()
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

const accounts = computed(() => accountsStore.accounts)
const fallbackAccount: Account = {
  id: '2000290',
  name: 'MMC-MSC-MCC Scooter Village',
  initials: 'MP',
  color: 'primary',
  subscriptions: ['commerce', 'marketing', 'analytics', 'service', 'davinci'],
}
const activeAccount = computed<Account>(() => accountsStore.activeAccount ?? accounts.value[0] ?? fallbackAccount)
const accountName = computed(() => activeAccount.value.name)
const accountInitials = computed(() => activeAccount.value.initials)
const currentAccountId = computed(() => accountsStore.activeId)
const settingsRoute = computed(() => ({ name: 'Settings' as const, params: { accountId: currentAccountId.value } }))
const appsRoute = computed(() => ({ name: 'AppStore' as const, params: { accountId: currentAccountId.value } }))

const searchSources = computed(() => [
  { group: 'Dashboards', icon: 'mdi-view-dashboard-outline', title: 'Marketing Dashboard', subtitle: 'Performance, revenue, and audience widgets', route: { name: 'Dashboard' as const, params: { accountId: currentAccountId.value } } },
  { group: 'Dashboards', icon: 'mdi-view-list-outline', title: 'Manage dashboards', subtitle: 'Create, edit, and assign dashboards', route: { name: 'DashboardsList' as const, params: { accountId: currentAccountId.value } } },
  { group: 'Commerce', icon: 'mdi-shopping-outline', title: 'Sales orders', subtitle: 'Find orders, payments, and fulfillment status', route: { name: 'SalesOrders' as const, params: { accountId: currentAccountId.value } } },
  { group: 'Marketing', icon: 'mdi-email-outline', title: 'Email campaigns', subtitle: 'Search campaigns, tags, folders, and sends', route: { name: 'EmailCampaigns' as const, params: { accountId: currentAccountId.value } } },
  { group: 'Contacts', icon: 'mdi-account-group-outline', title: 'Contacts', subtitle: 'Profiles, lists, segments, and fields', route: { name: 'AllContacts' as const, params: { accountId: currentAccountId.value } } },
  { group: 'AI', icon: 'mdi-creation', title: 'Da Vinci insights', subtitle: 'Ask for automations, insights, and widget ideas', route: { name: 'DaVinciDashboard' as const, params: { accountId: currentAccountId.value } } },
  { group: 'Apps', icon: 'mdi-puzzle-outline', title: 'Installed apps', subtitle: 'Connectors available for this customer', route: appsRoute.value },
  { group: 'Admin', icon: 'mdi-cog-outline', title: 'Settings', subtitle: 'Company, billing, users, and permissions', route: settingsRoute.value },
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

function selectAccount(account: Account) {
  if (account.id === accountsStore.activeId) return
  const previousId = accountsStore.activeId
  accountsStore.switchTo(account.id)

  const currentAccountIdParam = Array.isArray(route.params.accountId)
    ? route.params.accountId[0]
    : route.params.accountId
  if (currentAccountIdParam && currentAccountIdParam === previousId) {
    router.push({
      name: route.name ?? undefined,
      params: { ...route.params, accountId: account.id },
      query: route.query,
      hash: route.hash,
    })
  }
}
</script>

<template>
  <v-app-bar height="52" color="surface" flat class="mp-appbar">
    <div class="mp-appbar-shell w-100 d-flex align-center px-4 gap-2">
      <v-menu v-model="searchOpen" location="bottom start" offset="8" :close-on-content-click="false">
        <template #activator="{ props }">
          <v-text-field
            v-bind="props"
            v-model="searchQuery"
            density="compact"
            variant="outlined"
            hide-details
            prepend-inner-icon="mdi-magnify"
            placeholder="Search or ask Da Vinci anything..."
            aria-label="Universal AI search"
            rounded="lg"
            class="appbar-search"
            bg-color="surface"
            clearable
            @focus="searchOpen = true"
            @keydown.enter.prevent="askDaVinciFromSearch"
          />
        </template>
        <v-card width="620" rounded="lg" flat border class="appbar-search-menu">
          <div class="appbar-search-menu__hero">
            <v-icon size="20" color="secondary">mdi-creation</v-icon>
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
                <v-icon size="16">mdi-arrow-right</v-icon>
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
        <v-tooltip text="Da Vinci" location="bottom">
          <template #activator="{ props }">
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
              <v-icon>mdi-bell-outline</v-icon>
              <v-badge v-if="notificationCount > 0" :content="notificationCount" color="error" floating class="notification-badge" />
            </v-btn>
          </template>
        </v-tooltip>

        <v-tooltip text="Galaxy" location="bottom">
          <template #activator="{ props }">
            <v-btn v-bind="props" icon="mdi-orbit" variant="text" size="small" aria-label="Galaxy" @click="openStub('Galaxy')" />
          </template>
        </v-tooltip>

        <v-tooltip text="Apps" location="bottom">
          <template #activator="{ props }">
            <v-btn v-bind="props" icon="mdi-puzzle-outline" variant="text" size="small" aria-label="Apps" :to="appsRoute" />
          </template>
        </v-tooltip>

        <v-tooltip text="Settings" location="bottom">
          <template #activator="{ props }">
            <v-btn v-bind="props" icon="mdi-cog-outline" variant="text" size="small" aria-label="Settings" :to="settingsRoute" />
          </template>
        </v-tooltip>

        <v-tooltip text="LINE" location="bottom">
          <template #activator="{ props }">
            <v-btn v-bind="props" icon="mdi-message-text-outline" variant="text" size="small" aria-label="LINE" @click="openStub('LINE')" />
          </template>
        </v-tooltip>
      </div>

      <v-menu location="bottom end" offset="8">
        <template #activator="{ props }">
          <button
            v-bind="props"
            type="button"
            aria-label="Open user menu"
            class="d-flex align-center gap-2 cursor-pointer py-1 px-2 rounded-lg user-menu-trigger"
          >
            <v-avatar color="primary" size="30" class="user-avatar-ring appbar-avatar-sm">{{ userInitials }}</v-avatar>
            <span class="appbar-user-name d-none d-md-block">{{ userName }}</span>
            <v-icon size="16" color="medium-emphasis">mdi-chevron-down</v-icon>
          </button>
        </template>
        <v-card width="340" rounded="lg" elevation="0" class="user-menu-card">
          <div class="user-menu-header d-flex align-center gap-3">
            <v-avatar color="primary" size="44" class="appbar-avatar-lg">{{ userInitials }}</v-avatar>
            <div>
              <div class="font-weight-bold text-body-2">{{ userName }}</div>
              <div class="text-caption text-medium-emphasis">{{ userEmail }}</div>
              <v-chip size="x-small" variant="tonal" color="primary" class="mt-1">{{ userRole }}</v-chip>
            </div>
          </div>

          <v-divider class="mx-4" />

          <v-list density="compact" :border="false" class="px-3 pt-3 pb-1">
            <v-list-subheader class="text-uppercase font-weight-bold appbar-subheader">Personal</v-list-subheader>
            <v-list-item prepend-icon="mdi-account-outline" title="My Profile" subtitle="View and edit your info" :to="settingsRoute" rounded="lg" class="mb-1" />
            <v-list-item prepend-icon="mdi-theme-light-dark" title="Theme" subtitle="Toggle light or dark mode" rounded="lg" class="mb-1" @click="toggleTheme" />
          </v-list>

          <v-divider class="mx-4" />

          <v-list density="compact" :border="false" class="px-3 pt-3 pb-1">
            <v-list-subheader class="text-uppercase font-weight-bold appbar-subheader">Account</v-list-subheader>
            <v-list-item prepend-icon="mdi-cog-outline" title="Account Settings" subtitle="Company, users, permissions" :to="settingsRoute" rounded="lg" class="mb-1" />
            <v-list-item prepend-icon="mdi-credit-card-outline" title="Billing" subtitle="Plan, usage, invoices" :to="settingsRoute" rounded="lg" class="mb-1" />
            <v-list-item prepend-icon="mdi-orbit" title="Galaxy" subtitle="Cross-product workspace" rounded="lg" class="mb-1" @click="openStub('Galaxy')" />
            <v-list-item prepend-icon="mdi-map-clock-outline" title="Roadmap" subtitle="Planned product work" rounded="lg" class="mb-1" @click="openStub('Roadmap')" />
            <v-list-item prepend-icon="mdi-shield-check-outline" title="System Status" subtitle="Trust and availability" rounded="lg" class="mb-1" @click="openStub('System Status')" />
          </v-list>

          <template v-if="accounts.length > 1">
            <v-divider class="mx-4" />
            <v-list density="compact" :border="false" class="px-3 pt-3 pb-1">
              <v-list-subheader class="text-uppercase font-weight-bold appbar-subheader">Switch Account</v-list-subheader>
              <v-list-item
                v-for="account in accounts"
                :key="account.id"
                rounded="lg"
                class="mb-1 account-list-item"
                :active="account.id === accountsStore.activeId"
                active-color="primary"
                @click="selectAccount(account)"
              >
                <template #prepend>
                  <v-avatar size="28" :color="account.color" variant="tonal" class="mr-3 appbar-avatar-initials">{{ account.initials }}</v-avatar>
                </template>
                <div
                  class="text-body-2 account-item-text"
                  :class="{ 'font-weight-medium': account.id === accountsStore.activeId }"
                >{{ account.name }}</div>
                <template #append>
                  <v-icon
                    v-if="account.id === accountsStore.activeId"
                    size="16"
                    color="primary"
                  >mdi-check-circle</v-icon>
                </template>
              </v-list-item>
            </v-list>
          </template>

          <v-divider class="mx-4" />

          <v-list density="compact" :border="false" class="px-3 pt-3 pb-1">
            <v-list-subheader class="text-uppercase font-weight-bold appbar-subheader">Current Workspace</v-list-subheader>
            <v-list-item rounded="lg" class="mb-1">
              <template #prepend>
                <v-avatar size="28" :color="activeAccount.color" variant="tonal" class="mr-3 appbar-avatar-initials">{{ accountInitials }}</v-avatar>
              </template>
              <div class="text-body-2 font-weight-medium account-item-text">{{ accountName }}</div>
            </v-list-item>
          </v-list>

          <v-divider class="mx-4" />

          <v-list density="compact" :border="false" class="px-3 py-2">
            <v-list-item prepend-icon="mdi-logout" title="Sign Out" rounded="lg" class="sign-out-item" color="error" />
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
  border-bottom: 1px solid var(--mp-border-subtle);
  background: rgb(var(--v-theme-surface));
}

.mp-appbar-shell {
  min-width: 0;
  padding-block: 5px;
}

.min-width-0 {
  min-width: 0;
}

.appbar-utilities {
  display: flex;
  align-items: center;
  gap: 1px;
  padding-inline: 4px;
}

.appbar-utilities :deep(.v-btn) {
  width: 34px;
  height: 34px;
  color: rgba(var(--v-theme-on-surface), 0.72);
}

.appbar-utilities :deep(.v-icon) {
  font-size: 20px;
}

.user-menu-trigger {
  transition: background $mp-transition-fast, border-color $mp-transition-fast;
  appearance: none;
  border: 1px solid transparent;
  background: transparent;
  font: inherit;
  text-align: left;
  min-height: 36px;
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
  border: 1px solid rgba(var(--v-theme-primary), 0.18);
  border-radius: 8px !important;
  background: rgba(var(--v-theme-primary), 0.06);
  color: rgb(var(--v-theme-primary));
  box-shadow: none;
  width: 34px !important;
  height: 34px !important;
}
.copilot-trigger:hover {
  color: rgb(var(--v-theme-primary));
  border-color: rgba(var(--v-theme-primary), 0.34);
  box-shadow: none;
}

.copilot-trigger--active {
  background: rgb(var(--v-theme-primary)) !important;
  color: rgb(var(--v-theme-on-primary)) !important;
  border-color: transparent;
  box-shadow: none;
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
  flex: 1 1 460px;
  max-width: 520px;
  min-width: 260px;
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
  font-size: 0.9rem;
  min-height: 34px;
  padding-top: 6px;
  padding-bottom: 6px;
}

.appbar-search-menu {
  border-color: var(--mp-border-subtle);
  overflow: hidden;
}

.appbar-search-menu__hero {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
  padding: 14px;
  background: rgba(var(--v-theme-surface-variant), 0.3);
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
  color: rgba(var(--v-theme-on-surface), 0.55);
  font-size: var(--mp-typography-fontSize-xs);
  font-weight: 750;
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
  border-radius: 8px;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font: inherit;
  text-align: left;
}

.appbar-search-result:hover,
.appbar-search-result:focus-visible {
  background: rgba(var(--v-theme-primary), 0.06);
}

.appbar-search-result:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(var(--v-theme-primary), 0.18);
}

.appbar-search-result strong,
.appbar-search-result small {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.appbar-search-result strong {
  font-size: var(--mp-typography-fontSize-sm);
  line-height: 1.3;
}

.appbar-search-result small {
  margin-top: 2px;
  color: rgba(var(--v-theme-on-surface), 0.6);
  font-size: var(--mp-typography-fontSize-xs);
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

.notification-badge :deep(.v-badge__badge) {
  height: 18px;
  min-width: 18px;
  padding-inline: 5px;
  font-size: 11px;
  line-height: 18px;
}

.appbar-user-name {
  max-width: 96px;
  overflow: hidden;
  color: rgba(var(--v-theme-on-surface), 0.86);
  font-size: var(--mp-typography-fontSize-sm);
  font-weight: 650;
  line-height: 1.15;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 1180px) {
  .appbar-utilities :deep(.v-btn) {
    width: 32px;
  }

  .appbar-search {
    max-width: 420px;
  }
}
</style>
