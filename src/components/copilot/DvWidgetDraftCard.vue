<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import DashboardWidgetCard from '@/components/dashboards/DashboardWidgetCard.vue'
import WidgetEditStep from '@/components/dashboards/wizard/WidgetEditStep.vue'
import type { DashboardFilterState, DashboardWidgetDraft } from '@/stores/dashboards/types'
import { getMetricDescriptor } from '@/stores/dashboards/metricCatalog'
import { useDashboardsStore } from '@/stores/useDashboards'

const props = withDefaults(defineProps<{
  accountId: string
  dashboardId: string
  draft: DashboardWidgetDraft
  filters?: DashboardFilterState
}>(), {
  filters: () => ({
    rangePreset: 'last_30_days',
    grain: 'daily',
    comparison: 'previous_period',
  }),
})

const emit = defineEmits<{
  saved: [payload: { title: string; dashboardName: string }]
  'try-new-prompt': []
}>()

const route = useRoute()
const dashboardsStore = useDashboardsStore()
const isAdded = ref(false)
const localDraft = ref<DashboardWidgetDraft>({ ...props.draft })
const expandOpen = ref(false)
const editDialogOpen = ref(false)

const metric = computed(() => getMetricDescriptor(localDraft.value.metricId))
const currentAccountId = computed(() => {
  const routeAccountId = Array.isArray(route.params.accountId)
    ? route.params.accountId[0]
    : route.params.accountId

  return routeAccountId ?? props.accountId
})

const currentDashboard = computed(() => {
  const routeDashboardId = Array.isArray(route.params.dashboardId)
    ? route.params.dashboardId[0]
    : route.params.dashboardId

  return dashboardsStore.getDashboardById(currentAccountId.value, routeDashboardId)
    ?? dashboardsStore.getDashboardById(props.accountId, props.dashboardId)
})

const effectiveAccountId = computed(() => currentDashboard.value?.accountId ?? currentAccountId.value)
const effectiveDashboardId = computed(() => currentDashboard.value?.id ?? props.dashboardId)
const effectiveFilters = computed(() => currentDashboard.value?.filters ?? props.filters)

const previewWidget = computed(() => ({
  id: localDraft.value.widgetId ?? 'dv-widget-preview',
  type: localDraft.value.type,
  title: localDraft.value.title || metric.value?.defaultTitle || 'Widget Draft',
  subtitle: localDraft.value.subtitle,
  dataSource: localDraft.value.dataSource,
  metricId: localDraft.value.metricId,
  dimension: localDraft.value.dimension,
  chartVariant: localDraft.value.chartVariant,
  layout: {
    x: 0,
    y: 0,
    w: localDraft.value.type === 'kpi' ? 4 : 6,
    h: localDraft.value.type === 'kpi' ? 2 : 5,
  },
  filters: localDraft.value.filters,
  drilldown: localDraft.value.drilldown,
  aiProvenance: localDraft.value.aiProvenance,
}))

watch(
  () => props.draft,
  (next) => {
    localDraft.value = { ...next }
    isAdded.value = false
    editDialogOpen.value = false
  },
  { deep: true },
)

function openEditDialog() {
  if (isAdded.value) return
  editDialogOpen.value = true
}

function saveToDashboard() {
  if (isAdded.value) return
  if (!currentDashboard.value) return

  const widget = dashboardsStore.addWidget(effectiveAccountId.value, {
    ...localDraft.value,
    dashboardId: effectiveDashboardId.value,
  })
  if (widget) {
    isAdded.value = true
    editDialogOpen.value = false
    emit('saved', {
      title: widget.title || localDraft.value.title || 'Widget',
      dashboardName: currentDashboard.value.name,
    })
  }
}

function tryNewPrompt() {
  emit('try-new-prompt')
}
</script>

<template>
  <v-card flat border rounded="xl" class="dv-widget-draft-card">
    <v-card-text class="pa-4 pa-sm-5">
      <div class="dv-widget-draft-card__preview" :class="`dv-widget-draft-card__preview--${localDraft.type}`">
        <DashboardWidgetCard
          :account-id="effectiveAccountId"
          :widget="previewWidget"
          :filters="effectiveFilters"
          preview
        />

        <v-btn
          icon="maximize-2"
          size="x-small"
          variant="flat"
          class="dv-widget-draft-card__expand"
          aria-label="Enlarge preview"
          @click="expandOpen = true"
        >
          <v-icon size="14">maximize-2</v-icon>
          <v-tooltip activator="parent" location="left">Enlarge preview</v-tooltip>
        </v-btn>
      </div>

      <div class="d-flex align-center justify-space-between flex-wrap ga-3 mt-4">
        <v-btn
          variant="text"
          class="text-none"
          prepend-icon="plus"
          :disabled="isAdded"
          @click="tryNewPrompt"
        >
          Try new prompt
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          class="text-none"
          :disabled="isAdded"
          @click="openEditDialog"
        >
          {{ isAdded ? 'Saved to Dashboard' : 'Save to dashboard' }}
        </v-btn>
      </div>
    </v-card-text>

    <v-dialog v-model="expandOpen" max-width="1120" width="calc(100vw - 32px)">
      <v-card flat rounded="xl" border class="dv-widget-draft-card__dialog">
        <div class="dv-widget-draft-card__dialog-header">
          <div>
            <div class="dv-widget-draft-card__eyebrow">Expanded preview</div>
            <div class="text-subtitle-1 font-weight-bold">{{ previewWidget.title }}</div>
          </div>
          <v-btn icon="x" variant="text" size="small" aria-label="Close enlarged preview" @click="expandOpen = false" />
        </div>
        <div class="dv-widget-draft-card__dialog-body">
          <DashboardWidgetCard
            :account-id="effectiveAccountId"
            :widget="previewWidget"
            :filters="effectiveFilters"
            :show-actions="false"
            :editable="false"
            preview
          />
        </div>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="editDialogOpen"
      max-width="880"
      width="calc(100vw - 32px)"
      scrollable
    >
      <v-card flat rounded="xl" border class="dv-widget-draft-card__edit-dialog">
        <div class="dv-widget-draft-card__dialog-header">
          <div>
            <div class="dv-widget-draft-card__eyebrow">Edit widget</div>
            <div class="text-subtitle-1 font-weight-bold">Tweak the title or chart type</div>
          </div>
          <v-btn icon="x" variant="text" size="small" aria-label="Close edit dialog" @click="editDialogOpen = false" />
        </div>
        <v-card-text class="dv-widget-draft-card__edit-dialog-body pa-5">
          <WidgetEditStep
            :draft="localDraft"
            :account-id="effectiveAccountId"
            :filters="effectiveFilters"
            @update:draft="localDraft = $event"
          />
        </v-card-text>
        <v-divider />
        <v-card-actions class="d-flex align-center justify-end ga-2 px-5 py-3">
          <v-btn variant="text" class="text-none" @click="editDialogOpen = false">Cancel</v-btn>
          <v-btn
            color="primary"
            variant="flat"
            class="text-none"
            :disabled="isAdded"
            @click="saveToDashboard"
          >
            {{ isAdded ? 'Saved to Dashboard' : 'Save to dashboard' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<style scoped lang="scss">
.dv-widget-draft-card {
  border-color: rgba(var(--v-theme-primary), 0.14);
  background:
    radial-gradient(circle at top right, rgba(var(--v-theme-primary), 0.08), transparent 28%),
    rgb(var(--v-theme-surface));
}

.dv-widget-draft-card__preview {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  margin: 0 -4px;
}

.dv-widget-draft-card__preview--kpi {
  height: 120px;
}

.dv-widget-draft-card__preview--timeseries,
.dv-widget-draft-card__preview--bar,
.dv-widget-draft-card__preview--pie {
  height: 240px;
}

.dv-widget-draft-card__preview--table,
.dv-widget-draft-card__preview--activity {
  height: 220px;
}

.dv-widget-draft-card__expand {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(var(--v-theme-surface), 0.92) !important;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.12);
  backdrop-filter: blur(2px);
}

.dv-widget-draft-card__expand:hover {
  background: rgb(var(--v-theme-surface)) !important;
}

.dv-widget-draft-card__edit-dialog-body {
  max-height: calc(100vh - 220px);
  overflow-y: auto;
}

.dv-widget-draft-card__eyebrow {
  margin-bottom: 6px;
  font-size: var(--mp-typography-fontSize-xs);
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(var(--v-theme-on-surface), 0.54);
}

.dv-widget-draft-card__dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 24px;
  border-bottom: 1px solid rgb(var(--v-theme-outline-variant));
}

.dv-widget-draft-card__dialog-body {
  padding: 24px;
  height: 480px;
  overflow: hidden;
}

.dv-widget-draft-card__dialog-body :deep(.dashboard-widget-card) {
  height: 100%;
  max-height: 432px;
}
</style>
