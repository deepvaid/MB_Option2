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

function setDashboardAsDefault(dashboard: Dashboard) {
  if (dashboard.isDefault) return
  dashboardsStore.setDefaultDashboard(accountId.value, dashboard.id)
  showDashboardNotice(`“${dashboard.name}” is now the default dashboard.`)
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

    <section class="dashboard-page-bar">
      <div class="dashboard-page-bar__left">
        <div class="dashboard-page-bar__title-area">
          <v-menu location="bottom start" offset="8" :close-on-content-click="false">
            <template #activator="{ props: menuProps }">
              <button
                v-bind="menuProps"
                type="button"
                class="dashboard-title-switcher"
                :aria-label="`Switch dashboard. Current: ${pageTitle}`"
              >
                <h1 class="dashboard-page-bar__h1">{{ pageTitle }}</h1>
                <v-icon size="20" class="dashboard-title-switcher__chevron">chevron-down</v-icon>
              </button>
            </template>

            <v-card width="380" rounded="lg" flat border class="dashboard-switcher-card">
              <div class="pa-3 dashboard-switcher-card__search">
                <v-text-field
                  v-model="switcherSearch"
                  prepend-inner-icon="search"
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
                      <v-icon size="18">{{ dashboard.icon ?? 'layout-dashboard' }}</v-icon>
                    </v-avatar>
                  </template>
                  <div class="d-flex align-center ga-2 flex-wrap">
                    <span class="text-body-2 font-weight-bold">{{ dashboard.name }}</span>
                    <v-icon v-if="dashboard.favorite" size="14" color="warning">star</v-icon>
                    <v-chip v-if="dashboard.isDefault" size="x-small" variant="tonal" color="success">Default</v-chip>
                  </div>
                  <template #append>
                    <div class="d-flex align-center ga-1">
                      <v-tooltip
                        :text="dashboard.isDefault ? 'Currently default' : 'Set as default'"
                        location="top"
                      >
                        <template #activator="{ props: tipProps }">
                          <v-btn
                            v-bind="tipProps"
                            :icon="dashboard.isDefault ? 'bookmark-check' : 'bookmark'"
                            :color="dashboard.isDefault ? 'success' : undefined"
                            variant="text"
                            size="x-small"
                            :disabled="dashboard.isDefault"
                            :aria-label="dashboard.isDefault ? `${dashboard.name} is the default dashboard` : `Set ${dashboard.name} as default`"
                            @click.stop="setDashboardAsDefault(dashboard)"
                          />
                        </template>
                      </v-tooltip>
                      <v-btn
                        icon="pencil"
                        variant="text"
                        size="x-small"
                        :aria-label="`Edit ${dashboard.name}`"
                        @click.stop="openEditDashboardFor(dashboard)"
                      />
                    </div>
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
                  prepend-icon="layout-list"
                  class="text-none justify-start"
                  @click="openListingPage"
                >
                  View all dashboards
                </v-btn>
              </div>
            </v-card>
          </v-menu>
        </div>

        <div class="dashboard-page-bar__status">
          <span class="dashboard-page-bar__dot" />
          <span class="dashboard-page-bar__status-label">Live &middot; synced 2 min ago</span>
          <v-btn
            icon="refresh-cw"
            variant="text"
            size="x-small"
            class="dashboard-page-bar__refresh"
            aria-label="Refresh dashboard"
            @click="refreshDashboard"
          />
        </div>
      </div>

      <div class="dashboard-page-bar__right">
        <v-menu v-model="dateMenuOpen" location="bottom start" offset="8" :close-on-content-click="false">
          <template #activator="{ props: menuProps }">
            <v-btn
              v-bind="menuProps"
              variant="outlined"
              size="small"
              prepend-icon="calendar-range"
              class="text-none"
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
                <v-icon size="18">arrow-right</v-icon>
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
              variant="outlined"
              size="small"
              prepend-icon="list-filter"
              class="text-none"
            >
              Filters
              <span class="mp-btn-count">2</span>
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

        <v-menu location="bottom end">
          <template #activator="{ props: menuProps }">
            <v-btn
              v-bind="menuProps"
              icon="more-horizontal"
              variant="text"
              size="small"
              :disabled="!activeDashboard"
              aria-label="Dashboard actions"
            />
          </template>
          <v-list density="compact" min-width="240">
            <v-list-item
              prepend-icon="layout-list"
              title="Manage dashboards"
              @click="openListingPage"
            />
            <v-list-item
              prepend-icon="plus"
              title="Create dashboard"
              @click="openCreateDashboard"
            />
            <v-divider class="my-1" />
            <v-list-item
              prepend-icon="pencil"
              title="Edit dashboard details"
              :disabled="!activeDashboard"
              @click="openEditDashboard"
            />
            <v-list-item
              prepend-icon="copy-plus"
              title="Duplicate dashboard"
              :disabled="!activeDashboard"
              @click="duplicateCurrentDashboard"
            />
            <v-list-item
              v-if="activeDashboard && !activeDashboard.isDefault"
              prepend-icon="bookmark"
              title="Set as default"
              @click="setActiveAsDefault"
            />
            <v-divider class="my-1" />
            <v-list-item
              prepend-icon="move"
              :title="editMode ? 'Done editing layout' : 'Edit layout'"
              :active="editMode"
              @click="editMode = !editMode"
            />
            <v-divider class="my-1" />
            <v-list-item prepend-icon="link" title="Copy dashboard link" @click="openStubAction('Copy dashboard link')" />
            <v-list-item prepend-icon="user-plus" title="Invite editors" @click="openStubAction('Invite editors')" />
            <v-divider v-if="activeDashboard?.kind === 'system' || activeDashboard?.kind === 'custom'" class="my-1" />
            <v-list-item
              v-if="activeDashboard?.kind === 'system'"
              prepend-icon="rotate-ccw"
              title="Reset to defaults"
              @click="resetCurrentDashboard"
            />
            <v-list-item
              v-if="activeDashboard?.kind === 'custom'"
              prepend-icon="trash-2"
              title="Delete dashboard"
              base-color="error"
              @click="deleteCurrentDashboard"
            />
          </v-list>
        </v-menu>

        <v-menu location="bottom end" offset="8">
          <template #activator="{ props: menuProps }">
            <v-btn
              v-bind="menuProps"
              color="primary"
              variant="flat"
              size="small"
              prepend-icon="plus"
              append-icon="chevron-down"
              class="text-none"
              :disabled="!activeDashboard"
            >
              Add content
            </v-btn>
          </template>
          <v-list density="compact" min-width="280">
            <v-list-item
              prepend-icon="plus"
              title="Add manual widget"
              @click="openWidgetBuilder('manual')"
            />
            <v-list-item
              prepend-icon="sparkles"
              @click="openWidgetBuilder('davinci')"
            >
              <v-list-item-title>Create with Da Vinci</v-list-item-title>
              <v-list-item-subtitle>Generate a widget from a prompt</v-list-item-subtitle>
            </v-list-item>
            <v-list-item
              prepend-icon="layout-grid"
              @click="openWidgetBuilder('choose')"
            >
              <v-list-item-title>Choose content type</v-list-item-title>
              <v-list-item-subtitle>KPI, chart, table, or activity</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </section>

    <v-alert
      v-if="editMode"
      type="info"
      variant="tonal"
      rounded="xl"
      class="mt-4"
      icon="move"
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
  gap: 24px;
}

.dashboard-page-bar {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  padding: 20px 0 16px;
  border-bottom: 1px solid var(--hairline);
}

.dashboard-page-bar__left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.dashboard-page-bar__title-area {
  display: flex;
  align-items: center;
  gap: 6px;
}

.dashboard-title-switcher {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 2px 6px;
  border: 1px solid transparent;
  border-radius: 8px;
  background: transparent;
  color: var(--ink);
  cursor: pointer;
  font: inherit;
  appearance: none;
}

.dashboard-title-switcher:hover {
  background: var(--surface-2);
  border-color: var(--hairline);
}

.dashboard-title-switcher:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px color-mix(in oklch, var(--accent) 18%, transparent);
}

.dashboard-page-bar__h1 {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.3px;
  line-height: 1.2;
  white-space: nowrap;
}

.dashboard-title-switcher__chevron {
  color: var(--muted);
}

.dashboard-page-bar__status {
  display: flex;
  align-items: center;
  gap: 5px;
  padding-left: 4px;
}

.dashboard-page-bar__dot {
  width: 6px;
  height: 6px;
  flex-shrink: 0;
  border-radius: 999px;
  background: var(--pos);
}

.dashboard-page-bar__status-label {
  white-space: nowrap;
  font-size: 12px;
  font-weight: 500;
  color: var(--muted);
}

.dashboard-page-bar__refresh {
  width: 22px !important;
  height: 22px !important;
  color: var(--muted) !important;
}

.dashboard-page-bar__refresh :deep(.v-icon) {
  font-size: 13px;
}

.dashboard-page-bar__right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.dashboard-page-bar__right :deep(.v-btn--variant-outlined) {
  border-color: var(--hairline);
  background: var(--surface-1);
  color: var(--ink);
  font-weight: 500;
}

.dashboard-page-bar__right :deep(.v-btn--variant-outlined:hover) {
  background: var(--surface-2);
}

.mp-btn-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 1px 6px;
  margin-left: 4px;
  border-radius: var(--r-pill);
  background: var(--accent-soft);
  color: var(--accent-ink);
  font-size: 11px;
  font-weight: 600;
  line-height: 1;
}

.dashboard-date-menu {
  display: grid;
  grid-template-columns: 220px 1fr;
  overflow: hidden;
}

.dashboard-date-menu__presets {
  padding: 10px;
  border-right: 1px solid rgb(var(--v-theme-outline-variant));
  background: rgb(var(--v-theme-surface-variant));
}

.dashboard-date-menu__group {
  padding: 12px 8px 6px;
  color: var(--muted);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 1px;
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
  color: var(--ink);
  cursor: pointer;
  font: inherit;
  font-size: 13px;
  text-align: left;
}

.dashboard-date-menu__preset:hover,
.dashboard-date-menu__preset--active {
  background: var(--surface-1);
  color: var(--accent-ink);
  font-weight: 600;
}

.dashboard-date-menu__preset:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px color-mix(in oklch, var(--accent) 18%, transparent);
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
  border-color: var(--hairline);
}

.dashboard-switcher-card__search {
  border-bottom: 1px solid var(--hairline);
}

@media (max-width: 960px) {
  .dashboard-page-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .dashboard-page-bar__right {
    width: 100%;
    overflow-x: auto;
  }

  .dashboard-date-menu {
    grid-template-columns: 1fr;
    width: min(92vw, 760px);
  }

  .dashboard-date-menu__presets {
    border-right: 0;
    border-bottom: 1px solid var(--hairline);
    max-height: 230px;
    overflow: auto;
  }

  .dashboard-date-menu__fields,
  .dashboard-date-menu__fields + .dashboard-date-menu__fields {
    grid-template-columns: 1fr;
  }
}
</style>
