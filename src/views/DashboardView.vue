<script setup lang="ts">
import { computed, onErrorCaptured, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DashboardGrid from '@/components/dashboards/DashboardGrid.vue'
import WidgetWizardDrawer from '@/components/dashboards/WidgetWizardDrawer.vue'
import CreateDashboardDialog from '@/components/dashboards/CreateDashboardDialog.vue'
import EditDashboardDialog from '@/components/dashboards/EditDashboardDialog.vue'
import { accentToVuetifyColor } from '@/components/dashboards/dashboardOptions'
import type { WidgetSize } from '@/components/dashboards/widgetSizePresets'
import type {
  Dashboard,
  DashboardComparisonMode,
  DashboardDateGrain,
  DashboardDatePreset,
  DashboardFilterState,
  DashboardWidgetDraft,
} from '@/stores/dashboards/types'
import { useAccountsStore } from '@/stores/useAccounts'
import { useDashboardsStore } from '@/stores/useDashboards'

const route = useRoute()
const router = useRouter()
const accountsStore = useAccountsStore()
const dashboardsStore = useDashboardsStore()

const widgetWizardOpen = ref(false)
const wizardDefaultMode = ref<'choose' | 'manual' | 'davinci'>('choose')
const editMode = ref(false)
const renderError = ref<string | null>(null)
const dateMenuOpen = ref(false)
const advancedFiltersOpen = ref(false)
const dashboardNotice = ref('')
const dashboardNoticeVisible = ref(false)

onErrorCaptured((err) => {
  const message = err instanceof Error ? `${err.message}\n${err.stack ?? ''}` : String(err)
  console.error('[DashboardView Error]', err)
  renderError.value = message
  return false
})
const createDashboardOpen = ref(false)
const editDashboardOpen = ref(false)
const editDashboardTarget = ref<Dashboard | null>(null)
const switcherSearch = ref('')
const confirmAction = ref<{
  title: string
  body: string
  confirmLabel: string
  destructive?: boolean
  perform: () => void
} | null>(null)

const datePresetOptions: Array<{ title: string; value: DashboardDatePreset; group: string }> = [
  { title: 'Today', value: 'today', group: 'Current' },
  { title: 'Yesterday', value: 'yesterday', group: 'Current' },
  { title: 'Last 7 days', value: 'last_7_days', group: 'Last' },
  { title: 'Last 30 days', value: 'last_30_days', group: 'Last' },
  { title: 'Last 90 days', value: 'last_90_days', group: 'Last' },
  { title: 'Month to date', value: 'month_to_date', group: 'Period to date' },
  { title: 'Quarter to date', value: 'quarter_to_date', group: 'Period to date' },
  { title: 'Year to date', value: 'year_to_date', group: 'Period to date' },
  { title: 'Black Friday/Cyber Monday', value: 'black_friday_cyber_monday', group: 'Retail moments' },
  { title: 'Custom range', value: 'custom', group: 'Custom' },
]
const grainOptions: Array<{ title: string; value: DashboardDateGrain }> = [
  { title: 'Daily', value: 'daily' },
  { title: 'Weekly', value: 'weekly' },
  { title: 'Monthly', value: 'monthly' },
]
const comparisonOptions: Array<{ title: string; value: DashboardComparisonMode }> = [
  { title: 'No comparison', value: 'none' },
  { title: 'Previous period', value: 'previous_period' },
  { title: 'Previous year', value: 'previous_year' },
  { title: 'Custom comparison', value: 'custom' },
]

const defaultDashboardFilters: DashboardFilterState = {
  rangePreset: 'last_30_days',
  grain: 'daily',
  comparison: 'previous_period',
}

const dateDraft = ref<DashboardFilterState>({ ...defaultDashboardFilters })

const accountId = computed(() => {
  const routeAccountId = Array.isArray(route.params.accountId)
    ? route.params.accountId[0]
    : route.params.accountId
  return routeAccountId ?? accountsStore.activeId
})

const dashboardIdParam = computed(() => {
  const routeDashboardId = Array.isArray(route.params.dashboardId)
    ? route.params.dashboardId[0]
    : route.params.dashboardId
  return routeDashboardId
})

watch(
  accountId,
  (nextAccountId) => {
    if (nextAccountId !== accountsStore.activeId) {
      accountsStore.switchTo(nextAccountId)
    }
    dashboardsStore.ensureAccountDashboards(nextAccountId)
  },
  { immediate: true },
)

const account = computed(() => accountsStore.accounts.find((entry) => entry.id === accountId.value))
const dashboards = computed(() => dashboardsStore.getDashboardsForAccount(accountId.value))
const activeDashboard = computed(() => dashboardsStore.getDashboardById(accountId.value, dashboardIdParam.value))
const activeDashboardId = computed(() => activeDashboard.value?.id)
const activeWidgetDraft = computed<DashboardWidgetDraft | null>(() => {
  const draft = dashboardsStore.widgetEditorDraft
  if (!draft || draft.dashboardId !== activeDashboardId.value) return null
  return draft
})

const pageTitle = computed(() => activeDashboard.value?.name ?? 'Dashboard')

const filteredDashboards = computed(() => {
  const query = switcherSearch.value.trim().toLowerCase()
  const sorted = [...dashboards.value].sort((a, b) => {
    const left = a.lastViewedAt ?? a.updatedAt
    const right = b.lastViewedAt ?? b.updatedAt
    return new Date(right).getTime() - new Date(left).getTime()
  })
  if (!query) return sorted.slice(0, 8)
  return sorted
    .filter((dashboard) =>
      dashboard.name.toLowerCase().includes(query)
      || (dashboard.description ?? '').toLowerCase().includes(query),
    )
    .slice(0, 12)
})

function dashboardRouteLocation(dashboard: Dashboard) {
  if (dashboard.isDefault) {
    return { name: 'Dashboard' as const, params: { accountId: dashboard.accountId } }
  }
  return { name: 'DashboardDetail' as const, params: { accountId: dashboard.accountId, dashboardId: dashboard.id } }
}

function navigateToDashboard(dashboard: Dashboard | undefined) {
  if (!dashboard) {
    router.push({ name: 'Dashboard', params: { accountId: accountId.value } })
    return
  }
  router.push(dashboardRouteLocation(dashboard))
}

function openListingPage() {
  router.push({ name: 'DashboardsList', params: { accountId: accountId.value } })
}

watch(
  [accountId, dashboardIdParam],
  () => {
    if (!activeDashboard.value) {
      router.replace({ name: 'Dashboard', params: { accountId: accountId.value } })
    }
  },
  { immediate: true },
)

watch(
  activeDashboardId,
  (id) => {
    if (id) {
      dashboardsStore.markVisited(accountId.value, id)
    }
  },
  { immediate: true },
)

watch(
  activeWidgetDraft,
  (draft) => {
    if (!draft) return
    if (draft.aiProvenance && !draft.widgetId) {
      wizardDefaultMode.value = 'davinci'
    } else {
      wizardDefaultMode.value = 'manual'
    }
    widgetWizardOpen.value = true
  },
  { immediate: true },
)

watch(widgetWizardOpen, (isOpen) => {
  if (!isOpen) {
    dashboardsStore.closeWidgetEditor()
    wizardDefaultMode.value = 'choose'
  }
})

watch(activeDashboardId, () => {
  editMode.value = false
})

const activeFilters = computed<DashboardFilterState>(() => activeDashboard.value?.filters ?? defaultDashboardFilters)
const selectedPresetOption = computed(() =>
  datePresetOptions.find((option) => option.value === activeFilters.value.rangePreset) ?? datePresetOptions[3],
)
const dateRangeLabel = computed(() => selectedPresetOption.value?.title ?? 'Last 30 days')
const comparisonSummaryLabel = computed(() => {
  if (activeFilters.value.comparison === 'none') return 'No comparison'
  return comparisonOptions.find((option) => option.value === activeFilters.value.comparison)?.title ?? 'Compared to previous period'
})
const setupActionItems = computed(() => {
  const items = [
    {
      id: 'apps',
      icon: 'mdi-puzzle-outline',
      title: 'Connect your commerce and marketing apps',
      description: 'Make Shopify, Meta, Google, and fulfillment data available in dashboard widgets.',
      action: 'Review apps',
      visible: true,
    },
    {
      id: 'payments',
      icon: 'mdi-credit-card-check-outline',
      title: 'Finish payments setup',
      description: 'Complete payment provider configuration before revenue and conversion tasks go live.',
      action: 'Open payments',
      visible: account.value?.subscriptions.includes('commerce') ?? false,
    },
    {
      id: 'dns',
      icon: 'mdi-dns-outline',
      title: 'Verify sending DNS',
      description: 'Improve deliverability by validating SPF, DKIM, and branded sending domains.',
      action: 'Verify DNS',
      visible: account.value?.subscriptions.includes('marketing') ?? false,
    },
  ]
  return items.filter((item) => item.visible).slice(0, 3)
})

function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

function openDateMenu() {
  dateDraft.value = { ...activeFilters.value }
  if (!dateDraft.value.startDate) dateDraft.value.startDate = todayIso()
  if (!dateDraft.value.endDate) dateDraft.value.endDate = todayIso()
  dateMenuOpen.value = true
}

function updateDateDraftPreset(nextPreset: DashboardDatePreset) {
  dateDraft.value = {
    ...dateDraft.value,
    rangePreset: nextPreset,
  }
}

function applyDateDraft() {
  if (!activeDashboard.value) return
  dashboardsStore.updateDashboardFilters(accountId.value, activeDashboard.value.id, dateDraft.value)
  dateMenuOpen.value = false
}

function showDashboardNotice(message: string) {
  dashboardNotice.value = message
  dashboardNoticeVisible.value = true
}

function openStubAction(label: string) {
  showDashboardNotice(`${label} is represented as a prototype action.`)
}

function openWidgetBuilder(mode: 'choose' | 'manual' | 'davinci' = 'choose') {
  dashboardsStore.closeWidgetEditor()
  wizardDefaultMode.value = mode
  widgetWizardOpen.value = true
}

function handleLayoutUpdate(layout: Array<{ i: string; x: number; y: number; w: number; h: number }>) {
  if (!activeDashboard.value) return
  dashboardsStore.updateLayout(accountId.value, activeDashboard.value.id, layout)
}

function handleRemoveWidget(widgetId: string) {
  if (!activeDashboard.value) return
  dashboardsStore.removeWidget(accountId.value, activeDashboard.value.id, widgetId)
}

function handleResizeWidget(payload: { widgetId: string; size: WidgetSize }) {
  if (!activeDashboard.value) return
  dashboardsStore.resizeWidget(accountId.value, activeDashboard.value.id, payload.widgetId, payload.size)
}

function handleEditWidget(widgetId: string) {
  if (!activeDashboard.value) return
  dashboardsStore.openWidgetEditorForWidget(accountId.value, activeDashboard.value.id, widgetId)
}

function openCreateDashboard() {
  createDashboardOpen.value = true
}

function handleDashboardCreated(dashboardId: string) {
  const dashboard = dashboardsStore.getDashboardById(accountId.value, dashboardId)
  navigateToDashboard(dashboard)
}

function openEditDashboard() {
  if (!activeDashboard.value) return
  editDashboardTarget.value = activeDashboard.value
  editDashboardOpen.value = true
}

function setActiveAsDefault() {
  if (!activeDashboard.value || activeDashboard.value.isDefault) return
  dashboardsStore.setDefaultDashboard(accountId.value, activeDashboard.value.id)
}

function duplicateCurrentDashboard() {
  if (!activeDashboard.value) return
  const duplicate = dashboardsStore.duplicateDashboard(accountId.value, activeDashboard.value.id)
  if (duplicate) navigateToDashboard(duplicate)
}

function refreshDashboard() {
  showDashboardNotice('Dashboard data refreshed for this prototype session.')
}

function openEditDashboardFor(dashboard: Dashboard) {
  editDashboardTarget.value = dashboard
  editDashboardOpen.value = true
}

function resetCurrentDashboard() {
  if (!activeDashboard.value) return
  const dashboard = activeDashboard.value
  confirmAction.value = {
    title: `Reset “${dashboard.name}” to defaults?`,
    body: 'Widget layout and customizations will be reverted to the original system template.',
    confirmLabel: 'Reset dashboard',
    perform: () => dashboardsStore.resetSystemDashboard(accountId.value, dashboard.id),
  }
}

function deleteCurrentDashboard() {
  if (!activeDashboard.value) return
  const dashboard = activeDashboard.value
  confirmAction.value = {
    title: `Delete “${dashboard.name}”?`,
    body: 'This dashboard and all of its widgets will be permanently removed for this account.',
    confirmLabel: 'Delete dashboard',
    destructive: true,
    perform: () => {
      dashboardsStore.deleteDashboard(accountId.value, dashboard.id)
      router.replace({ name: 'Dashboard', params: { accountId: accountId.value } })
    },
  }
}

function performConfirm() {
  if (!confirmAction.value) return
  confirmAction.value.perform()
  confirmAction.value = null
}
</script>

<template>
  <div class="dashboard-hub">
    <v-alert
      v-if="renderError"
      type="error"
      variant="tonal"
      class="mb-4"
      closable
      @click:close="renderError = null"
    >
      <div class="text-subtitle-2 font-weight-bold mb-1">Dashboard failed to load</div>
      <pre class="text-caption" style="white-space: pre-wrap; margin: 0;">{{ renderError }}</pre>
    </v-alert>

    <section class="dashboard-builder-header">
      <div class="dashboard-builder-header__title-row">
        <div class="dashboard-builder-header__title">
          <v-menu location="bottom start" offset="8" :close-on-content-click="false">
            <template #activator="{ props: menuProps }">
              <button
                v-bind="menuProps"
                type="button"
                class="dashboard-title-switcher"
                :aria-label="`Switch dashboard. Current dashboard ${pageTitle}`"
              >
                <h1>{{ pageTitle }}</h1>
                <v-icon size="20">mdi-chevron-down</v-icon>
              </button>
            </template>

            <v-card width="380" rounded="lg" flat border class="dashboard-switcher-card">
              <div class="pa-3 dashboard-switcher-card__search">
                <v-text-field
                  v-model="switcherSearch"
                  prepend-inner-icon="mdi-magnify"
                  placeholder="Search dashboards"
                  density="compact"
                  variant="outlined"
                  hide-details
                  clearable
                />
              </div>
              <v-list class="py-1 bg-transparent" density="comfortable" max-height="320">
                <v-list-item
                  v-for="dashboard in filteredDashboards"
                  :key="dashboard.id"
                  rounded="lg"
                  class="mx-2 mb-1"
                  :active="dashboard.id === activeDashboardId"
                  @click="navigateToDashboard(dashboard)"
                >
                  <template #prepend>
                    <v-avatar size="32" variant="tonal" :color="accentToVuetifyColor(dashboard.accent)">
                      <v-icon size="18">{{ dashboard.icon ?? 'mdi-view-dashboard-outline' }}</v-icon>
                    </v-avatar>
                  </template>
                  <div class="d-flex align-center ga-2 flex-wrap">
                    <span class="text-body-2 font-weight-bold">{{ dashboard.name }}</span>
                    <v-icon v-if="dashboard.favorite" size="14" color="warning">mdi-star</v-icon>
                    <v-chip v-if="dashboard.isDefault" size="x-small" variant="tonal" color="success">Default</v-chip>
                  </div>
                  <template #append>
                    <v-btn
                      icon="mdi-pencil-outline"
                      variant="text"
                      size="x-small"
                      :aria-label="`Edit ${dashboard.name}`"
                      @click.stop="openEditDashboardFor(dashboard)"
                    />
                  </template>
                </v-list-item>
                <div
                  v-if="filteredDashboards.length === 0"
                  class="text-body-2 text-medium-emphasis text-center py-6"
                >
                  No dashboards match your search.
                </div>
              </v-list>
              <v-divider />
              <div class="pa-2">
                <v-btn
                  block
                  variant="text"
                  prepend-icon="mdi-view-list-outline"
                  class="text-none justify-start"
                  @click="openListingPage"
                >
                  View all dashboards
                </v-btn>
              </div>
            </v-card>
          </v-menu>

          <v-menu v-if="setupActionItems.length" location="bottom start" offset="8">
            <template #activator="{ props: menuProps }">
              <button
                v-bind="menuProps"
                type="button"
                class="dashboard-setup-pill"
                :aria-label="`${setupActionItems.length} setup tasks`"
              >
                <span class="dashboard-setup-pill__dot" />
                <span>{{ setupActionItems.length }} setup tasks</span>
                <v-icon size="16">mdi-arrow-right</v-icon>
              </button>
            </template>
            <v-card width="390" rounded="lg" flat border class="dashboard-setup-menu">
              <div class="dashboard-setup-menu__header">
                <div class="text-subtitle-2 font-weight-bold">Setup tasks</div>
                <div class="text-caption text-medium-emphasis">Recommended account work for dashboard accuracy.</div>
              </div>
              <div class="dashboard-setup-menu__list">
                <button
                  v-for="item in setupActionItems"
                  :key="item.id"
                  type="button"
                  class="dashboard-setup-menu__item"
                  @click="openStubAction(item.action)"
                >
                  <v-avatar size="30" variant="tonal" color="primary">
                    <v-icon size="16">{{ item.icon }}</v-icon>
                  </v-avatar>
                  <span>
                    <strong>{{ item.title }}</strong>
                    <small>{{ item.description }}</small>
                  </span>
                  <v-icon size="16">mdi-arrow-right</v-icon>
                </button>
              </div>
            </v-card>
          </v-menu>
        </div>

        <div class="dashboard-builder-header__actions">
          <v-menu location="bottom end">
            <template #activator="{ props: menuProps }">
              <v-btn
                v-bind="menuProps"
                variant="text"
                density="compact"
                prepend-icon="mdi-view-dashboard-outline"
                append-icon="mdi-chevron-down"
                class="text-none dashboard-header-action"
              >
                Dashboards
              </v-btn>
            </template>
            <v-list density="compact" min-width="240">
              <v-list-item prepend-icon="mdi-view-list-outline" title="Manage dashboards" @click="openListingPage" />
              <v-list-item prepend-icon="mdi-plus-box-outline" title="Create dashboard" @click="openCreateDashboard" />
              <v-list-item
                prepend-icon="mdi-cursor-move"
                :title="editMode ? 'Done editing layout' : 'Edit layout'"
                :active="editMode"
                @click="editMode = !editMode"
              />
            </v-list>
          </v-menu>
          <v-menu location="bottom end">
            <template #activator="{ props: menuProps }">
              <v-btn
                v-bind="menuProps"
                variant="text"
                density="compact"
                prepend-icon="mdi-tray-arrow-up"
                class="text-none dashboard-header-action"
              >
                Share
              </v-btn>
            </template>
            <v-list density="compact" min-width="220">
              <v-list-item prepend-icon="mdi-link-variant" title="Copy dashboard link" @click="openStubAction('Copy dashboard link')" />
              <v-list-item prepend-icon="mdi-account-plus-outline" title="Invite editors" @click="openStubAction('Invite editors')" />
            </v-list>
          </v-menu>
          <v-menu location="bottom end">
            <template #activator="{ props: menuProps }">
              <v-btn
                v-bind="menuProps"
                icon="mdi-dots-vertical"
                variant="text"
                density="compact"
                class="dashboard-overflow-button"
                aria-label="Dashboard actions"
              />
            </template>
            <v-list density="compact" min-width="240">
              <v-list-item prepend-icon="mdi-pencil-outline" title="Edit dashboard details" :disabled="!activeDashboard" @click="openEditDashboard" />
              <v-list-item prepend-icon="mdi-content-duplicate" title="Duplicate dashboard" :disabled="!activeDashboard" @click="duplicateCurrentDashboard" />
              <v-list-item
                v-if="activeDashboard && !activeDashboard.isDefault"
                prepend-icon="mdi-bookmark-outline"
                title="Set as default"
                @click="setActiveAsDefault"
              />
              <v-divider class="my-1" />
              <v-list-item
                v-if="activeDashboard?.kind === 'system'"
                prepend-icon="mdi-backup-restore"
                title="Reset to defaults"
                @click="resetCurrentDashboard"
              />
              <v-list-item
                v-if="activeDashboard?.kind === 'custom'"
                prepend-icon="mdi-delete-outline"
                title="Delete dashboard"
                base-color="error"
                @click="deleteCurrentDashboard"
              />
            </v-list>
          </v-menu>
          <v-menu location="bottom end">
            <template #activator="{ props: menuProps }">
              <v-btn
                v-bind="menuProps"
                color="primary"
                variant="flat"
                density="compact"
                prepend-icon="mdi-plus"
                append-icon="mdi-chevron-down"
                class="text-none dashboard-add-content"
                :disabled="!activeDashboard"
              >
                Add content
              </v-btn>
            </template>
            <v-list density="compact" min-width="230">
              <v-list-item prepend-icon="mdi-view-dashboard-plus-outline" title="Add manual widget" @click="openWidgetBuilder('manual')" />
              <v-list-item prepend-icon="mdi-creation" title="Create with Da Vinci" @click="openWidgetBuilder('davinci')" />
              <v-list-item prepend-icon="mdi-chart-box-plus-outline" title="Choose content type" @click="openWidgetBuilder()" />
            </v-list>
          </v-menu>
        </div>
      </div>

      <div class="dashboard-builder-header__control-row">
        <div class="dashboard-control-group">
          <v-menu v-model="dateMenuOpen" location="bottom start" offset="8" :close-on-content-click="false">
            <template #activator="{ props: menuProps }">
              <v-btn
                v-bind="menuProps"
                variant="outlined"
                density="compact"
                prepend-icon="mdi-calendar-range"
                append-icon="mdi-chevron-down"
                class="text-none dashboard-date-trigger"
                @click.stop="openDateMenu"
              >
                {{ dateRangeLabel }}
              </v-btn>
            </template>
            <v-card width="760" rounded="lg" flat border class="dashboard-date-menu">
              <div class="dashboard-date-menu__presets">
                <template v-for="(option, index) in datePresetOptions" :key="option.value">
                  <div
                    v-if="index === 0 || datePresetOptions[index - 1]?.group !== option.group"
                    class="dashboard-date-menu__group"
                  >
                    {{ option.group }}
                  </div>
                  <button
                    type="button"
                    class="dashboard-date-menu__preset"
                    :class="{ 'dashboard-date-menu__preset--active': dateDraft.rangePreset === option.value }"
                    @click="updateDateDraftPreset(option.value)"
                  >
                    {{ option.title }}
                  </button>
                </template>
              </div>
              <div class="dashboard-date-menu__body">
                <div class="dashboard-date-menu__fields">
                  <v-text-field v-model="dateDraft.startDate" label="Start date" type="date" density="comfortable" variant="outlined" hide-details />
                  <v-icon size="18">mdi-arrow-right</v-icon>
                  <v-text-field v-model="dateDraft.endDate" label="End date" type="date" density="comfortable" variant="outlined" hide-details />
                </div>
                <div class="dashboard-date-menu__fields mt-3">
                  <v-select v-model="dateDraft.grain" :items="grainOptions" item-title="title" item-value="value" label="Grain" density="comfortable" variant="outlined" hide-details />
                  <v-select v-model="dateDraft.comparison" :items="comparisonOptions" item-title="title" item-value="value" label="Comparison" density="comfortable" variant="outlined" hide-details />
                </div>
                <v-alert variant="tonal" color="info" class="mt-4" density="compact">
                  Widgets will show {{ datePresetOptions.find((option) => option.value === dateDraft.rangePreset)?.title ?? 'the selected range' }} with {{ grainOptions.find((option) => option.value === dateDraft.grain)?.title.toLowerCase() ?? 'daily' }} grouping.
                </v-alert>
                <div class="d-flex justify-end ga-2 mt-4">
                  <v-btn variant="text" class="text-none" @click="dateMenuOpen = false">Cancel</v-btn>
                  <v-btn color="primary" variant="flat" class="text-none" @click="applyDateDraft">Apply</v-btn>
                </div>
              </div>
            </v-card>
          </v-menu>

          <v-menu v-model="advancedFiltersOpen" location="bottom start" offset="8" :close-on-content-click="false">
            <template #activator="{ props: menuProps }">
              <v-btn
                v-bind="menuProps"
                variant="text"
                density="compact"
                prepend-icon="mdi-filter-variant"
                class="text-none dashboard-filter-button"
              >
                Filters
              </v-btn>
            </template>
            <v-card width="360" rounded="lg" flat border class="pa-3">
              <div class="text-subtitle-2 font-weight-bold mb-2">Filters</div>
              <v-select label="Data source" :items="['All sources', 'Commerce', 'Marketing', 'Contacts', 'Service']" density="compact" variant="outlined" hide-details class="mb-3" />
              <v-select label="Owner" :items="['Everyone', 'Marketing team', 'Commerce team']" density="compact" variant="outlined" hide-details />
              <div class="d-flex flex-wrap ga-2 mt-3">
                <v-chip size="small" variant="tonal" color="primary">Channel</v-chip>
                <v-chip size="small" variant="tonal" color="primary">Campaign type</v-chip>
                <v-chip size="small" variant="tonal" color="primary">Customer segment</v-chip>
              </div>
            </v-card>
          </v-menu>

          <span class="dashboard-filter-summary">{{ comparisonSummaryLabel }}</span>
        </div>

        <div class="dashboard-refresh-status">
          <span>Updated 2 min ago</span>
          <v-btn icon="mdi-refresh" variant="text" size="small" aria-label="Refresh dashboard" @click="refreshDashboard" />
        </div>
      </div>
    </section>

    <v-alert
      v-if="editMode"
      type="info"
      variant="tonal"
      rounded="xl"
      class="mt-4"
      icon="mdi-cursor-move"
    >
      Drag, resize, or pick a size preset (S/M/L/XL). Layout changes save automatically for this account and dashboard.
    </v-alert>

    <DashboardGrid
      v-if="activeDashboard"
      :account-id="accountId"
      :dashboard-id="activeDashboard.id"
      :widgets="activeDashboard.widgets"
      :filters="activeDashboard.filters"
      :edit-mode="editMode"
      class="mt-2"
      @edit-widget="handleEditWidget"
      @remove-widget="handleRemoveWidget"
      @resize-widget="handleResizeWidget"
      @update-layout="handleLayoutUpdate"
      @add-widget="openWidgetBuilder()"
    />

    <WidgetWizardDrawer
      v-model="widgetWizardOpen"
      :account-id="accountId"
      :dashboard-id="activeDashboardId ?? ''"
      :dashboard-filters="activeDashboard?.filters ?? defaultDashboardFilters"
      :initial-draft="activeWidgetDraft"
      :default-mode="wizardDefaultMode"
    />

    <CreateDashboardDialog
      v-model="createDashboardOpen"
      :account-id="accountId"
      @created="handleDashboardCreated"
    />

    <EditDashboardDialog
      v-model="editDashboardOpen"
      :account-id="accountId"
      :dashboard="editDashboardTarget"
    />

    <v-dialog :model-value="!!confirmAction" max-width="440" persistent @update:model-value="confirmAction = null">
      <v-card v-if="confirmAction" rounded="xl">
        <v-card-title class="pa-5 text-h6 font-weight-bold">{{ confirmAction.title }}</v-card-title>
        <v-card-text class="pb-2 text-body-2 text-medium-emphasis">{{ confirmAction.body }}</v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="text" class="text-none" @click="confirmAction = null">Cancel</v-btn>
          <v-btn
            :color="confirmAction.destructive ? 'error' : 'primary'"
            variant="flat"
            class="text-none"
            @click="performConfirm"
          >
            {{ confirmAction.confirmLabel }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="dashboardNoticeVisible" timeout="2600" color="surface" location="bottom right">
      {{ dashboardNotice }}
    </v-snackbar>
  </div>
</template>

<style scoped lang="scss">
.dashboard-hub {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.dashboard-builder-header {
  display: flex;
  flex-direction: column;
  gap: 14px;
  background: transparent;
}

.dashboard-builder-header__title-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 0;
}

.dashboard-builder-header__title {
  display: flex;
  align-items: center;
  gap: 9px;
  min-width: 0;
}

.dashboard-builder-header__title :deep(.v-btn--icon) {
  width: 28px;
  height: 28px;
  color: rgb(var(--v-theme-warning));
}

.dashboard-builder-header__title :deep(.v-btn--icon .v-icon) {
  font-size: 25px;
}

.dashboard-title-switcher {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  padding: 2px 4px;
  border: 1px solid transparent;
  border-radius: 8px;
  background: transparent;
  color: rgb(var(--v-theme-on-surface));
  cursor: pointer;
  font: inherit;
}

.dashboard-title-switcher:hover {
  border-color: var(--mp-border-subtle);
  background: rgba(var(--v-theme-surface-variant), 0.42);
}

.dashboard-title-switcher:focus-visible,
.dashboard-setup-pill:focus-visible,
.dashboard-setup-menu__item:focus-visible,
.dashboard-date-menu__preset:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(var(--v-theme-primary), 0.18);
}

.dashboard-title-switcher h1 {
  margin: 0;
  font-size: clamp(1.45rem, 2vw, 1.85rem);
  line-height: 1.2;
  letter-spacing: 0;
  font-weight: 820;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dashboard-setup-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 32px;
  padding: 0 12px;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.12);
  border-radius: 999px;
  background: rgb(var(--v-theme-surface));
  color: rgba(var(--v-theme-on-surface), 0.76);
  cursor: pointer;
  font: inherit;
  font-size: var(--mp-typography-fontSize-sm);
  font-weight: 650;
  box-shadow: 0 1px 2px rgba(var(--v-theme-on-surface), 0.04);
}

.dashboard-setup-pill:hover {
  border-color: rgba(var(--v-theme-primary), 0.24);
  color: rgb(var(--v-theme-on-surface));
}

.dashboard-setup-pill__dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: rgb(var(--v-theme-warning));
}

.dashboard-builder-header__actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  flex-wrap: nowrap;
  min-width: 0;
}

.dashboard-builder-header__actions :deep(.v-btn) {
  min-height: 34px;
  height: 34px;
  padding-inline: 10px;
  border-radius: 8px;
  color: rgba(var(--v-theme-on-surface), 0.76);
  font-size: var(--mp-typography-fontSize-sm);
  font-weight: 700;
}

.dashboard-builder-header__actions :deep(.v-btn__append) {
  margin-inline-start: 4px;
}

.dashboard-builder-header__actions :deep(.v-icon) {
  font-size: 18px;
}

.dashboard-header-action:hover,
.dashboard-overflow-button:hover {
  background: rgba(var(--v-theme-surface-variant), 0.52);
}

.dashboard-add-content {
  min-height: 40px !important;
  height: 40px !important;
  padding-inline: 16px !important;
  color: rgb(var(--v-theme-on-primary)) !important;
  font-size: var(--mp-typography-fontSize-sm) !important;
}

.dashboard-builder-header__control-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  min-height: 40px;
  padding: 0 0 4px;
  border: 0;
  border-radius: 0;
  background: transparent;
}

.dashboard-control-group {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.dashboard-control-group :deep(.v-btn) {
  min-height: 36px;
  height: 36px;
  padding-inline: 12px;
  border-radius: 8px;
  color: rgba(var(--v-theme-on-surface), 0.72);
  font-size: var(--mp-typography-fontSize-sm);
  font-weight: 700;
}

.dashboard-control-group :deep(.v-icon) {
  font-size: 17px;
}

.dashboard-date-trigger {
  border-radius: 8px;
  min-width: 142px;
  border-color: rgba(var(--v-theme-on-surface), 0.14);
  background: rgb(var(--v-theme-surface));
  color: rgba(var(--v-theme-on-surface), 0.82) !important;
  justify-content: flex-start;
}

.dashboard-filter-button {
  padding-inline: 8px !important;
  color: rgba(var(--v-theme-on-surface), 0.72) !important;
}

.dashboard-filter-summary {
  color: rgba(var(--v-theme-on-surface), 0.54);
  font-size: var(--mp-typography-fontSize-sm);
  font-weight: 600;
  white-space: nowrap;
}

.dashboard-refresh-status {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: rgba(var(--v-theme-on-surface), 0.52);
  font-size: var(--mp-typography-fontSize-sm);
  font-weight: 650;
}

.dashboard-refresh-status :deep(.v-btn) {
  width: 28px;
  height: 28px;
  color: rgba(var(--v-theme-on-surface), 0.54);
}

.dashboard-refresh-status :deep(.v-icon) {
  font-size: 18px;
}

.dashboard-date-menu {
  display: grid;
  grid-template-columns: 210px minmax(0, 1fr);
  overflow: hidden;
}

.dashboard-date-menu__presets {
  padding: 10px;
  border-right: 1px solid var(--mp-border-subtle);
  background: rgba(var(--v-theme-surface-variant), 0.28);
}

.dashboard-date-menu__group {
  padding: 12px 8px 6px;
  color: rgba(var(--v-theme-on-surface), 0.55);
  font-size: var(--mp-typography-fontSize-xs);
  font-weight: 750;
  text-transform: uppercase;
}

.dashboard-date-menu__preset {
  display: block;
  width: 100%;
  min-height: 34px;
  padding: 7px 10px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: rgba(var(--v-theme-on-surface), 0.78);
  cursor: pointer;
  font: inherit;
  text-align: left;
}

.dashboard-date-menu__preset:hover,
.dashboard-date-menu__preset--active {
  background: rgb(var(--v-theme-surface));
  color: rgb(var(--v-theme-primary));
  font-weight: 700;
}

.dashboard-date-menu__body {
  padding: 16px;
}

.dashboard-date-menu__fields {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: 12px;
}

.dashboard-date-menu__fields + .dashboard-date-menu__fields {
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
}

.dashboard-switcher-card {
  border-color: var(--mp-border-subtle);
}

.dashboard-switcher-card__search {
  border-bottom: 1px solid var(--mp-border-subtle);
}

.dashboard-setup-menu {
  overflow: hidden;
}

.dashboard-setup-menu__header {
  padding: 14px 16px 10px;
  border-bottom: 1px solid var(--mp-border-subtle);
}

.dashboard-setup-menu__list {
  display: grid;
  gap: 2px;
  padding: 8px;
}

.dashboard-setup-menu__item {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font: inherit;
  text-align: left;
}

.dashboard-setup-menu__item:hover {
  background: rgba(var(--v-theme-surface-variant), 0.52);
}

.dashboard-setup-menu__item strong,
.dashboard-setup-menu__item small {
  display: block;
}

.dashboard-setup-menu__item strong {
  overflow: hidden;
  font-size: var(--mp-typography-fontSize-sm);
  line-height: 1.25;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dashboard-setup-menu__item small {
  overflow: hidden;
  margin-top: 2px;
  color: rgba(var(--v-theme-on-surface), 0.58);
  font-size: var(--mp-typography-fontSize-xs);
  line-height: 1.3;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 960px) {
  .dashboard-builder-header__title-row {
    grid-template-columns: 1fr;
  }

  .dashboard-builder-header__title,
  .dashboard-control-group,
  .dashboard-refresh-status {
    width: 100%;
  }

  .dashboard-builder-header__actions {
    justify-content: flex-start;
    width: 100%;
    overflow-x: auto;
    padding-bottom: 2px;
  }

  .dashboard-date-menu {
    grid-template-columns: 1fr;
    width: min(92vw, 760px);
  }

  .dashboard-date-menu__presets {
    border-right: 0;
    border-bottom: 1px solid var(--mp-border-subtle);
    max-height: 230px;
    overflow: auto;
  }

  .dashboard-date-menu__fields,
  .dashboard-date-menu__fields + .dashboard-date-menu__fields {
    grid-template-columns: 1fr;
  }
}
</style>
