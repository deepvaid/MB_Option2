<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { MbPageHeader } from '@marobase/ui'
import DashboardGrid from '@/components/dashboards/DashboardGrid.vue'
import WidgetWizardDrawer from '@/components/dashboards/WidgetWizardDrawer.vue'
import CreateDashboardDialog from '@/components/dashboards/CreateDashboardDialog.vue'
import EditDashboardDialog from '@/components/dashboards/EditDashboardDialog.vue'
import { accentToVuetifyColor } from '@/components/dashboards/dashboardOptions'
import type { WidgetSize } from '@/components/dashboards/widgetSizePresets'
import type {
  Dashboard,
  DashboardComparisonMode,
  DashboardDatePreset,
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

const datePresets: DashboardDatePreset[] = ['7D', '30D', '90D', 'YTD']
const comparisonOptions: Array<{ title: string; value: DashboardComparisonMode }> = [
  { title: 'No comparison', value: 'none' },
  { title: 'Previous period', value: 'previous_period' },
  { title: 'Previous year', value: 'previous_year' },
]

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
const pageSubtitle = computed(() => activeDashboard.value?.description || undefined)
const accentColor = computed(() => accentToVuetifyColor(activeDashboard.value?.accent))

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

const selectedPreset = computed<DashboardDatePreset>({
  get() {
    return activeDashboard.value?.filters.preset ?? '30D'
  },
  set(nextPreset) {
    if (!activeDashboard.value) return
    dashboardsStore.updateDashboardFilters(
      accountId.value,
      activeDashboard.value.id,
      nextPreset,
      activeDashboard.value.filters.comparison,
    )
  },
})

const selectedComparison = computed<DashboardComparisonMode>({
  get() {
    return activeDashboard.value?.filters.comparison ?? 'previous_period'
  },
  set(nextComparison) {
    if (!activeDashboard.value) return
    dashboardsStore.updateDashboardFilters(
      accountId.value,
      activeDashboard.value.id,
      activeDashboard.value.filters.preset,
      nextComparison,
    )
  },
})

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
    <MbPageHeader
      :title="pageTitle"
      :subtitle="pageSubtitle"
      size="md"
      :breadcrumbs="[
        { label: account?.name ?? 'Workspace' },
        { label: 'Dashboards', href: `/accounts/${accountId}/dashboards` },
        { label: pageTitle },
      ]"
    >
      <template #actions>
        <v-chip
          v-if="activeDashboard?.isDefault"
          size="small"
          color="success"
          variant="tonal"
          prepend-icon="mdi-bookmark-check"
          class="text-none mr-1"
        >
          Default
        </v-chip>
        <v-btn
          v-else-if="activeDashboard"
          variant="outlined"
          prepend-icon="mdi-bookmark-outline"
          class="text-none"
          @click="setActiveAsDefault"
        >
          Set as default
        </v-btn>
        <v-btn
          :variant="editMode ? 'flat' : 'outlined'"
          :color="editMode ? 'primary' : undefined"
          prepend-icon="mdi-cursor-move"
          class="text-none"
          @click="editMode = !editMode"
        >
          {{ editMode ? 'Done Editing' : 'Edit Layout' }}
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          prepend-icon="mdi-plus"
          class="text-none"
          :disabled="!activeDashboard"
          @click="openWidgetBuilder()"
        >
          Add Widget
        </v-btn>

        <v-menu location="bottom end">
          <template #activator="{ props: menuProps }">
            <v-btn
              v-bind="menuProps"
              icon="mdi-dots-horizontal"
              variant="text"
              size="small"
              aria-label="More dashboard actions"
            />
          </template>
          <v-list density="compact" min-width="220">
            <v-list-item prepend-icon="mdi-view-list-outline" title="All dashboards" @click="openListingPage" />
            <v-list-item prepend-icon="mdi-plus-box-outline" title="New dashboard" @click="openCreateDashboard" />
            <v-list-item prepend-icon="mdi-pencil-outline" title="Edit current dashboard" :disabled="!activeDashboard" @click="openEditDashboard" />
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
      </template>
    </MbPageHeader>

    <div class="dashboard-hub__toolbar">
      <v-menu location="bottom start" offset="8" :close-on-content-click="false">
        <template #activator="{ props: menuProps }">
          <button
            v-bind="menuProps"
            type="button"
            class="dashboard-switcher"
            :aria-label="`Switch dashboard. Current dashboard ${pageTitle}`"
          >
            <v-avatar v-if="activeDashboard" size="28" variant="tonal" :color="accentColor">
              <v-icon size="18">{{ activeDashboard.icon ?? 'mdi-view-dashboard-outline' }}</v-icon>
            </v-avatar>
            <span class="dashboard-switcher__name">{{ pageTitle }}</span>
            <v-icon size="18">mdi-chevron-down</v-icon>
            <span class="dashboard-switcher__meta">
              · {{ dashboards.length }} dashboard{{ dashboards.length === 1 ? '' : 's' }}
            </span>
          </button>
        </template>

        <v-card width="380" rounded="xl" flat border class="dashboard-switcher-card">
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

      <div class="dashboard-hub__filters">
        <v-btn-toggle
          v-model="selectedPreset"
          mandatory
          divided
          density="comfortable"
          class="dashboard-hub__preset-toggle"
        >
          <v-btn
            v-for="preset in datePresets"
            :key="preset"
            :value="preset"
            size="small"
            class="text-none px-3"
          >
            {{ preset }}
          </v-btn>
        </v-btn-toggle>

        <v-select
          v-model="selectedComparison"
          :items="comparisonOptions"
          item-title="title"
          item-value="value"
          label="Comparison"
          density="comfortable"
          variant="outlined"
          hide-details
          class="dashboard-hub__comparison"
        />
      </div>
    </div>

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
      class="mt-4"
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
      :dashboard-filters="activeDashboard?.filters ?? { preset: '30D', comparison: 'previous_period' }"
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
  </div>
</template>

<style scoped lang="scss">
.dashboard-hub {
  display: flex;
  flex-direction: column;
}

.dashboard-hub__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  padding: 12px 16px;
  border: 1px solid var(--mp-border-subtle);
  border-radius: 12px;
  background: rgb(var(--v-theme-surface));
  margin-top: 8px;
}

.dashboard-switcher {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 6px 10px;
  border: 1px solid transparent;
  background: transparent;
  border-radius: 10px;
  cursor: pointer;
  font: inherit;
  color: inherit;
}

.dashboard-switcher:hover {
  border-color: var(--mp-border-subtle);
  background: rgba(var(--v-theme-on-surface), 0.03);
}

.dashboard-switcher:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(var(--v-theme-primary), 0.18);
}

.dashboard-switcher__name {
  font-size: var(--mp-typography-fontSize-body);
  font-weight: 700;
  letter-spacing: -0.01em;
}

.dashboard-switcher__meta {
  font-size: var(--mp-typography-fontSize-sm);
  color: rgba(var(--v-theme-on-surface), 0.6);
  font-weight: 500;
}

.dashboard-switcher-card {
  border-color: var(--mp-border-subtle);
}

.dashboard-switcher-card__search {
  border-bottom: 1px solid var(--mp-border-subtle);
}

.dashboard-hub__filters {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.dashboard-hub__preset-toggle {
  border: 1px solid var(--mp-border-subtle);
  border-radius: 999px;
  background: rgb(var(--v-theme-surface));
}

.dashboard-hub__comparison {
  width: 220px;
}

@media (max-width: 960px) {
  .dashboard-switcher {
    width: 100%;
  }

  .dashboard-hub__filters {
    width: 100%;
  }

  .dashboard-hub__comparison {
    width: 100%;
  }
}
</style>
