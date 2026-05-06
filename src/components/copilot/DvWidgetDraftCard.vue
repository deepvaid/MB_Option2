<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import DashboardWidgetCard from '@/components/dashboards/DashboardWidgetCard.vue'
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

const route = useRoute()
const dashboardsStore = useDashboardsStore()
const isAdded = ref(false)
const metric = computed(() => getMetricDescriptor(props.draft.metricId))
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
  id: props.draft.widgetId ?? 'dv-widget-preview',
  type: props.draft.type,
  title: props.draft.title || metric.value?.defaultTitle || 'Widget Draft',
  dataSource: props.draft.dataSource,
  metricId: props.draft.metricId,
  dimension: props.draft.dimension,
  layout: {
    x: 0,
    y: 0,
    w: props.draft.type === 'kpi' ? 4 : 6,
    h: props.draft.type === 'kpi' ? 2 : 5,
  },
  filters: props.draft.filters,
  drilldown: props.draft.drilldown,
  aiProvenance: props.draft.aiProvenance,
}))

watch(
  [() => props.draft, effectiveAccountId, effectiveDashboardId],
  () => {
    isAdded.value = false
  },
  { deep: true },
)

function addToDashboard() {
  if (isAdded.value) return
  if (!currentDashboard.value) return

  const widget = dashboardsStore.addWidget(effectiveAccountId.value, {
    ...props.draft,
    dashboardId: effectiveDashboardId.value,
  })
  if (widget) {
    isAdded.value = true
  }
}

function editBeforeAdding() {
  if (!currentDashboard.value) return

  dashboardsStore.openWidgetEditor({
    ...props.draft,
    dashboardId: effectiveDashboardId.value,
  })
}
</script>

<template>
  <v-card flat border rounded="xl" class="dv-widget-draft-card">
    <v-card-text class="pa-4 pa-sm-5">
      <div class="d-flex align-start justify-space-between ga-3 mb-4">
        <div>
          <div class="dv-widget-draft-card__eyebrow">Dashboard Widget Draft</div>
          <div class="text-subtitle-1 font-weight-bold">Ready to place on your active dashboard</div>
          <div class="text-body-2 text-medium-emphasis mt-2">
            {{ draft.aiProvenance?.summary ?? 'Da Vinci mapped your prompt into a widget configuration that fits the current workspace.' }}
          </div>
        </div>

        <v-chip
          size="small"
          color="secondary"
          variant="tonal"
          prepend-icon="sparkles"
          class="font-weight-medium"
        >
          {{ draft.type }}
        </v-chip>
      </div>

      <DashboardWidgetCard
        :account-id="effectiveAccountId"
        :widget="previewWidget"
        :filters="effectiveFilters"
        preview
      />

      <div class="d-flex align-center justify-space-between flex-wrap ga-3 mt-4">
        <div class="text-caption text-medium-emphasis">
          Drill-down: {{ draft.drilldown.label }}
        </div>

        <div class="d-flex align-center ga-2">
          <v-btn variant="text" class="text-none" @click="editBeforeAdding">
            Edit Before Adding
          </v-btn>
          <v-btn
            color="primary"
            variant="flat"
            class="text-none"
            :disabled="isAdded"
            @click="addToDashboard"
          >
            {{ isAdded ? 'Added to Dashboard' : 'Add to Dashboard' }}
          </v-btn>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped lang="scss">
.dv-widget-draft-card {
  border-color: rgba(var(--v-theme-primary), 0.14);
  background:
    radial-gradient(circle at top right, rgba(var(--v-theme-primary), 0.08), transparent 28%),
    rgb(var(--v-theme-surface));
}

.dv-widget-draft-card__eyebrow {
  margin-bottom: 6px;
  font-size: var(--mp-typography-fontSize-xs);
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(var(--v-theme-on-surface), 0.54);
}
</style>
