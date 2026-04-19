<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { MbPageHeader } from '@marobase/ui'
import MpEmptyState from '@/components/MpEmptyState.vue'
import CreateDashboardDialog from '@/components/dashboards/CreateDashboardDialog.vue'
import EditDashboardDialog from '@/components/dashboards/EditDashboardDialog.vue'
import DashboardListCard from '@/components/dashboards/DashboardListCard.vue'
import DashboardListTable from '@/components/dashboards/DashboardListTable.vue'
import type { Dashboard } from '@/stores/dashboards/types'
import { useAccountsStore } from '@/stores/useAccounts'
import { useDashboardsStore } from '@/stores/useDashboards'

type FilterChip = 'all' | 'system' | 'custom' | 'favorites' | 'default'
type SortKey = 'recent' | 'name' | 'widgets' | 'updated'
type ViewMode = 'cards' | 'table'

const FILTER_CHIPS: Array<{ value: FilterChip; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'system', label: 'System' },
  { value: 'custom', label: 'Custom' },
  { value: 'favorites', label: 'Favorites' },
  { value: 'default', label: 'Default' },
]

const SORT_OPTIONS: Array<{ value: SortKey; label: string }> = [
  { value: 'recent', label: 'Recently viewed' },
  { value: 'name', label: 'Name' },
  { value: 'widgets', label: 'Most widgets' },
  { value: 'updated', label: 'Last updated' },
]

const PAGE_SIZE_OPTIONS = [12, 24, 48, 96]

const route = useRoute()
const router = useRouter()
const accountsStore = useAccountsStore()
const dashboardsStore = useDashboardsStore()

const accountId = computed(() => {
  const value = Array.isArray(route.params.accountId)
    ? route.params.accountId[0]
    : route.params.accountId
  return value ?? accountsStore.activeId
})

watch(
  accountId,
  (next) => {
    if (next !== accountsStore.activeId) {
      accountsStore.switchTo(next)
    }
    dashboardsStore.ensureAccountDashboards(next)
  },
  { immediate: true },
)

const account = computed(() => accountsStore.accounts.find((entry) => entry.id === accountId.value))
const dashboards = computed(() => dashboardsStore.getDashboardsForAccount(accountId.value))

const search = ref('')
const filterChip = ref<FilterChip>('all')
const sortKey = ref<SortKey>('recent')
const viewMode = ref<ViewMode>('table')
const pageSize = ref<number>(24)
const currentPage = ref(1)
const selectedIds = ref<string[]>([])

const createDialogOpen = ref(false)
const editingDashboard = ref<Dashboard | null>(null)
const editDialogOpen = ref(false)
const confirmAction = ref<{
  title: string
  body: string
  confirmLabel: string
  destructive?: boolean
  perform: () => void
} | null>(null)

const stats = computed(() => {
  const total = dashboards.value.length
  const system = dashboards.value.filter((dashboard) => dashboard.kind === 'system').length
  const custom = dashboards.value.filter((dashboard) => dashboard.kind === 'custom').length
  const favorites = dashboards.value.filter((dashboard) => dashboard.favorite).length
  return { total, system, custom, favorites }
})

const summaryTiles = computed<Array<{ key: string; label: string; value: number; icon: string; chip: FilterChip }>>(() => [
  { key: 'total', label: 'Total', value: stats.value.total, icon: 'mdi-view-dashboard-outline', chip: 'all' },
  { key: 'system', label: 'System', value: stats.value.system, icon: 'mdi-shield-check-outline', chip: 'system' },
  { key: 'custom', label: 'Custom', value: stats.value.custom, icon: 'mdi-view-grid-plus-outline', chip: 'custom' },
  { key: 'favorites', label: 'Favorites', value: stats.value.favorites, icon: 'mdi-star-outline', chip: 'favorites' },
])

const filteredDashboards = computed(() => {
  const query = search.value.trim().toLowerCase()
  const matchesQuery = (dashboard: Dashboard) => {
    if (!query) return true
    return (
      dashboard.name.toLowerCase().includes(query)
      || (dashboard.description ?? '').toLowerCase().includes(query)
    )
  }

  const matchesChip = (dashboard: Dashboard) => {
    switch (filterChip.value) {
      case 'system':
        return dashboard.kind === 'system'
      case 'custom':
        return dashboard.kind === 'custom'
      case 'favorites':
        return Boolean(dashboard.favorite)
      case 'default':
        return dashboard.isDefault
      default:
        return true
    }
  }

  return dashboards.value.filter((dashboard) => matchesQuery(dashboard) && matchesChip(dashboard))
})

const sortedDashboards = computed(() => {
  const list = [...filteredDashboards.value]
  switch (sortKey.value) {
    case 'name':
      list.sort((a, b) => a.name.localeCompare(b.name))
      break
    case 'widgets':
      list.sort((a, b) => b.widgets.length - a.widgets.length)
      break
    case 'updated':
      list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      break
    case 'recent':
    default:
      list.sort((a, b) => {
        const left = a.lastViewedAt ?? a.updatedAt
        const right = b.lastViewedAt ?? b.updatedAt
        return new Date(right).getTime() - new Date(left).getTime()
      })
      break
  }
  return list
})

const totalCount = computed(() => sortedDashboards.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(totalCount.value / pageSize.value)))

watch(totalPages, (next) => {
  if (currentPage.value > next) currentPage.value = next
})

watch([search, filterChip, sortKey, pageSize], () => {
  currentPage.value = 1
})

const pagedDashboards = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return sortedDashboards.value.slice(start, start + pageSize.value)
})

const rangeStart = computed(() => (totalCount.value === 0 ? 0 : (currentPage.value - 1) * pageSize.value + 1))
const rangeEnd = computed(() => Math.min(totalCount.value, currentPage.value * pageSize.value))

const selectedSet = computed(() => new Set(selectedIds.value))
const selectedDashboards = computed(() =>
  dashboards.value.filter((dashboard) => selectedSet.value.has(dashboard.id)),
)
const hasSelection = computed(() => selectedIds.value.length > 0)
const selectedHasCustom = computed(() => selectedDashboards.value.some((dashboard) => dashboard.kind === 'custom'))
const selectedAllFavorited = computed(() => selectedDashboards.value.length > 0 && selectedDashboards.value.every((dashboard) => dashboard.favorite))

watch(filteredDashboards, (next) => {
  const visibleIds = new Set(next.map((dashboard) => dashboard.id))
  selectedIds.value = selectedIds.value.filter((id) => visibleIds.has(id))
})

function dashboardRoute(dashboard: Dashboard) {
  if (dashboard.isDefault) {
    return { name: 'Dashboard' as const, params: { accountId: dashboard.accountId } }
  }
  return { name: 'DashboardDetail' as const, params: { accountId: dashboard.accountId, dashboardId: dashboard.id } }
}

function openDashboard(dashboardId: string) {
  const dashboard = dashboards.value.find((entry) => entry.id === dashboardId)
  if (!dashboard) return
  router.push(dashboardRoute(dashboard))
}

function toggleSelect(dashboardId: string) {
  const set = new Set(selectedIds.value)
  if (set.has(dashboardId)) set.delete(dashboardId)
  else set.add(dashboardId)
  selectedIds.value = [...set]
}

function toggleSelectAll(select: boolean) {
  if (!select) {
    const visibleIds = new Set(pagedDashboards.value.map((dashboard) => dashboard.id))
    selectedIds.value = selectedIds.value.filter((id) => !visibleIds.has(id))
    return
  }
  const set = new Set(selectedIds.value)
  pagedDashboards.value.forEach((dashboard) => set.add(dashboard.id))
  selectedIds.value = [...set]
}

function clearSelection() {
  selectedIds.value = []
}

function clearFilters() {
  search.value = ''
  filterChip.value = 'all'
}

function openEdit(dashboardId: string) {
  const dashboard = dashboards.value.find((entry) => entry.id === dashboardId)
  if (!dashboard) return
  editingDashboard.value = dashboard
  editDialogOpen.value = true
}

function handleDuplicate(dashboardId: string) {
  dashboardsStore.duplicateDashboard(accountId.value, dashboardId)
}

function handleSetDefault(dashboardId: string) {
  dashboardsStore.setDefaultDashboard(accountId.value, dashboardId)
}

function handleToggleFavorite(dashboardId: string) {
  dashboardsStore.toggleFavorite(accountId.value, dashboardId)
}

function handleDelete(dashboardId: string) {
  const dashboard = dashboards.value.find((entry) => entry.id === dashboardId)
  if (!dashboard) return
  confirmAction.value = {
    title: `Delete “${dashboard.name}”?`,
    body: 'This dashboard and all of its widgets will be permanently removed for this account.',
    confirmLabel: 'Delete dashboard',
    destructive: true,
    perform: () => {
      dashboardsStore.deleteDashboard(accountId.value, dashboardId)
      selectedIds.value = selectedIds.value.filter((id) => id !== dashboardId)
    },
  }
}

function handleReset(dashboardId: string) {
  const dashboard = dashboards.value.find((entry) => entry.id === dashboardId)
  if (!dashboard) return
  confirmAction.value = {
    title: `Reset “${dashboard.name}” to defaults?`,
    body: 'Widget layout and any customizations will be reverted to the original system template.',
    confirmLabel: 'Reset dashboard',
    perform: () => dashboardsStore.resetSystemDashboard(accountId.value, dashboardId),
  }
}

function bulkDuplicate() {
  if (!hasSelection.value) return
  dashboardsStore.bulkDuplicate(accountId.value, selectedIds.value)
  clearSelection()
}

function bulkFavorite() {
  if (!hasSelection.value) return
  const target = !selectedAllFavorited.value
  selectedIds.value.forEach((id) => {
    const dashboard = dashboards.value.find((entry) => entry.id === id)
    if (!dashboard) return
    if (Boolean(dashboard.favorite) !== target) {
      dashboardsStore.toggleFavorite(accountId.value, id)
    }
  })
}

function bulkDelete() {
  if (!hasSelection.value) return
  const customSelection = selectedDashboards.value.filter((dashboard) => dashboard.kind === 'custom')
  if (!customSelection.length) return
  confirmAction.value = {
    title: `Delete ${customSelection.length} dashboard${customSelection.length === 1 ? '' : 's'}?`,
    body: 'Only custom dashboards in your selection will be deleted. System dashboards stay intact.',
    confirmLabel: 'Delete dashboards',
    destructive: true,
    perform: () => {
      dashboardsStore.bulkDelete(accountId.value, customSelection.map((dashboard) => dashboard.id))
      clearSelection()
    },
  }
}

function backToActiveDashboard() {
  const target = dashboardsStore.getDefaultDashboard(accountId.value)
  if (!target) {
    router.push({ name: 'Dashboard', params: { accountId: accountId.value } })
    return
  }
  router.push(dashboardRoute(target))
}

function performConfirm() {
  if (!confirmAction.value) return
  confirmAction.value.perform()
  confirmAction.value = null
}

function handleDashboardCreated(dashboardId: string) {
  selectedIds.value = []
  search.value = ''
  filterChip.value = 'all'
  sortKey.value = 'recent'
  currentPage.value = 1
  const dashboard = dashboards.value.find((entry) => entry.id === dashboardId)
  if (dashboard) router.push(dashboardRoute(dashboard))
}
</script>

<template>
  <div class="dashboards-list">
    <div class="dashboards-list__back-row">
      <v-btn
        variant="text"
        size="small"
        prepend-icon="mdi-arrow-left"
        class="text-none px-2"
        @click="backToActiveDashboard"
      >
        Back to active dashboard
      </v-btn>
    </div>

    <MbPageHeader
      :title="`Dashboards`"
      :subtitle="`Browse, organize, and personalize every dashboard for ${account?.name ?? 'this workspace'}.`"
      size="md"
      :breadcrumbs="[
        { label: account?.name ?? 'Workspace' },
        { label: 'Dashboards' },
      ]"
    >
      <template #actions>
        <v-btn
          color="primary"
          variant="flat"
          prepend-icon="mdi-plus"
          class="text-none"
          @click="createDialogOpen = true"
        >
          New Dashboard
        </v-btn>
      </template>
    </MbPageHeader>

    <div class="dashboards-list__summary mb-4">
      <button
        v-for="tile in summaryTiles"
        :key="tile.key"
        type="button"
        class="summary-tile"
        :class="{ 'summary-tile--active': filterChip === tile.chip }"
        :aria-pressed="filterChip === tile.chip"
        @click="filterChip = tile.chip"
      >
        <span class="summary-tile__icon">
          <v-icon size="16">{{ tile.icon }}</v-icon>
        </span>
        <span class="summary-tile__text">
          <span class="summary-tile__label">{{ tile.label }}</span>
          <span class="summary-tile__value">{{ tile.value }}</span>
        </span>
      </button>
    </div>

    <div class="dashboards-list__toolbar">
      <v-text-field
        v-model="search"
        prepend-inner-icon="mdi-magnify"
        placeholder="Search dashboards"
        density="comfortable"
        variant="outlined"
        hide-details
        clearable
        class="dashboards-list__search"
      />

      <div class="dashboards-list__chips">
        <v-chip
          v-for="chip in FILTER_CHIPS"
          :key="chip.value"
          size="small"
          :variant="filterChip === chip.value ? 'flat' : 'tonal'"
          :color="filterChip === chip.value ? 'primary' : undefined"
          class="text-none"
          @click="filterChip = chip.value"
        >
          {{ chip.label }}
        </v-chip>
      </div>

      <div class="d-flex align-center ga-2 ml-auto">
        <v-menu location="bottom end">
          <template #activator="{ props: menuProps }">
            <v-btn
              v-bind="menuProps"
              variant="outlined"
              prepend-icon="mdi-sort"
              append-icon="mdi-chevron-down"
              class="text-none"
            >
              {{ SORT_OPTIONS.find((option) => option.value === sortKey)?.label ?? 'Sort' }}
            </v-btn>
          </template>
          <v-list density="compact" min-width="200">
            <v-list-item
              v-for="option in SORT_OPTIONS"
              :key="option.value"
              :title="option.label"
              :active="sortKey === option.value"
              @click="sortKey = option.value"
            />
          </v-list>
        </v-menu>

        <v-btn-toggle
          v-model="viewMode"
          mandatory
          divided
          density="comfortable"
          class="dashboards-list__view-toggle"
        >
          <v-btn value="cards" size="small" icon="mdi-view-grid-outline" aria-label="Card view" />
          <v-btn value="table" size="small" icon="mdi-table" aria-label="Table view" />
        </v-btn-toggle>
      </div>
    </div>

    <div v-if="hasSelection" class="dashboards-list__bulk-bar">
      <div class="d-flex align-center ga-3">
        <v-btn icon="mdi-close" variant="text" size="small" aria-label="Clear selection" @click="clearSelection" />
        <span class="text-body-2 font-weight-medium">{{ selectedIds.length }} selected</span>
      </div>
      <div class="d-flex align-center ga-2 flex-wrap">
        <v-btn
          variant="outlined"
          size="small"
          class="text-none"
          :prepend-icon="selectedAllFavorited ? 'mdi-star-off' : 'mdi-star-outline'"
          @click="bulkFavorite"
        >
          {{ selectedAllFavorited ? 'Unfavorite' : 'Favorite' }}
        </v-btn>
        <v-btn
          variant="outlined"
          size="small"
          class="text-none"
          prepend-icon="mdi-content-copy"
          @click="bulkDuplicate"
        >
          Duplicate
        </v-btn>
        <v-btn
          variant="outlined"
          size="small"
          color="error"
          class="text-none"
          prepend-icon="mdi-delete-outline"
          :disabled="!selectedHasCustom"
          @click="bulkDelete"
        >
          Delete
        </v-btn>
      </div>
    </div>

    <MpEmptyState
      v-if="totalCount === 0"
      :icon="search || filterChip !== 'all' ? 'mdi-filter-variant-remove' : 'mdi-view-grid-plus-outline'"
      :title="search || filterChip !== 'all' ? 'No dashboards match your filters' : 'No dashboards yet'"
      :description="search || filterChip !== 'all' ? 'Try a different search term or clear the active filters.' : 'Create the first custom dashboard for this workspace to get started.'"
      :action-label="search || filterChip !== 'all' ? 'Clear filters' : 'Create dashboard'"
      action-icon="mdi-plus"
      @action="search || filterChip !== 'all' ? clearFilters() : (createDialogOpen = true)"
    />

    <template v-else>
      <div v-if="viewMode === 'cards'" class="dashboards-list__grid">
        <DashboardListCard
          v-for="dashboard in pagedDashboards"
          :key="dashboard.id"
          :dashboard="dashboard"
          :selected="selectedSet.has(dashboard.id)"
          @open="openDashboard"
          @edit="openEdit"
          @duplicate="handleDuplicate"
          @delete="handleDelete"
          @reset="handleReset"
          @set-default="handleSetDefault"
          @toggle-favorite="handleToggleFavorite"
          @toggle-select="toggleSelect"
        />
      </div>
      <DashboardListTable
        v-else
        :dashboards="pagedDashboards"
        :selected-ids="selectedIds"
        @open="openDashboard"
        @edit="openEdit"
        @duplicate="handleDuplicate"
        @delete="handleDelete"
        @reset="handleReset"
        @set-default="handleSetDefault"
        @toggle-favorite="handleToggleFavorite"
        @toggle-select="toggleSelect"
        @toggle-select-all="toggleSelectAll"
      />

      <div class="dashboards-list__footer">
        <div class="text-body-2 text-medium-emphasis">
          Showing {{ rangeStart }}–{{ rangeEnd }} of {{ totalCount }}
        </div>
        <div class="d-flex align-center ga-3">
          <div class="d-flex align-center ga-2">
            <span class="text-body-2 text-medium-emphasis">Per page</span>
            <v-select
              v-model="pageSize"
              :items="PAGE_SIZE_OPTIONS"
              density="compact"
              variant="outlined"
              hide-details
              style="max-width: 96px"
            />
          </div>
          <v-pagination
            v-if="totalPages > 1"
            v-model="currentPage"
            :length="totalPages"
            :total-visible="5"
            density="comfortable"
            rounded="lg"
          />
        </div>
      </div>
    </template>

    <CreateDashboardDialog
      v-model="createDialogOpen"
      :account-id="accountId"
      @created="handleDashboardCreated"
    />

    <EditDashboardDialog
      v-model="editDialogOpen"
      :account-id="accountId"
      :dashboard="editingDashboard"
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
.dashboards-list {
  display: flex;
  flex-direction: column;
}

.dashboards-list__back-row {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.dashboards-list__summary {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.summary-tile {
  appearance: none;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  min-height: 56px;
  background: rgb(var(--v-theme-surface));
  border: 1px solid var(--mp-border-subtle);
  border-radius: 12px;
  cursor: pointer;
  text-align: left;
  font: inherit;
  color: inherit;
  transition: border-color 160ms ease, background 160ms ease, box-shadow 160ms ease;
}

.summary-tile:hover {
  border-color: rgba(var(--v-theme-primary), 0.32);
  background: rgba(var(--v-theme-primary), 0.03);
}

.summary-tile:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(var(--v-theme-primary), 0.2);
}

.summary-tile--active {
  border-color: rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-primary), 0.06);
}

.summary-tile__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 999px;
  background: rgba(var(--v-theme-primary), 0.1);
  color: rgb(var(--v-theme-primary));
  flex-shrink: 0;
}

.summary-tile__text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.summary-tile__label {
  font-size: var(--mp-typography-fontSize-xs);
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: rgba(var(--v-theme-on-surface), 0.6);
  line-height: 1.2;
}

.summary-tile__value {
  font-size: var(--mp-typography-fontSize-lg);
  font-weight: 700;
  color: rgb(var(--v-theme-on-surface));
  line-height: 1.2;
}

@media (max-width: 720px) {
  .dashboards-list__summary {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 420px) {
  .dashboards-list__summary {
    grid-template-columns: 1fr;
  }
}

.dashboards-list__toolbar {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  padding: 16px;
  border: 1px solid var(--mp-border-subtle);
  border-radius: 16px;
  background: rgb(var(--v-theme-surface));
  margin-bottom: 16px;
}

.dashboards-list__search {
  flex: 1 1 280px;
  max-width: 360px;
}

.dashboards-list__chips {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.dashboards-list__view-toggle {
  border: 1px solid var(--mp-border-subtle);
  border-radius: 999px;
  background: rgb(var(--v-theme-surface));
}

.dashboards-list__bulk-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;
  margin-bottom: 16px;
  border: 1px solid rgba(var(--v-theme-primary), 0.32);
  border-radius: 12px;
  background: rgba(var(--v-theme-primary), 0.06);
}

.dashboards-list__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

@media (max-width: 1280px) {
  .dashboards-list__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .dashboards-list__grid {
    grid-template-columns: 1fr;
  }
}

.dashboards-list__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 24px;
}
</style>
