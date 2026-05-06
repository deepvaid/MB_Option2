<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useWidgetData } from '@/composables/useWidgetData'
import { useElementSize } from '@/composables/useElementSize'
import type { DashboardFilterState, DashboardWidget } from '@/stores/dashboards/types'
import {
  WIDGET_SIZES,
  detectSize,
  type WidgetSize,
} from './widgetSizePresets'
import DashboardChartWidget from './widgets/DashboardChartWidget.vue'
import DashboardKpiWidget from './widgets/DashboardKpiWidget.vue'
import DashboardTableWidget from './widgets/DashboardTableWidget.vue'

const props = withDefaults(defineProps<{
  accountId: string
  widget: DashboardWidget
  filters: DashboardFilterState
  editable?: boolean
  preview?: boolean
}>(), {
  editable: false,
  preview: false,
})

const emit = defineEmits<{
  edit: [widgetId: string]
  remove: [widgetId: string]
  resize: [payload: { widgetId: string; size: WidgetSize }]
}>()

const router = useRouter()
const bodyEl = ref<HTMLElement | null>(null)
const { data } = useWidgetData(computed(() => props.widget), computed(() => props.filters))
const { size: bodySize } = useElementSize(bodyEl)

const currentSize = computed<WidgetSize | null>(() => detectSize(props.widget.type, props.widget.layout.w, props.widget.layout.h))
const isCompactHeight = computed(() => bodySize.value.height > 0 && bodySize.value.height < 128)
const isKpiWidget = computed(() => data.value.kind === 'kpi')
const rangeLabels: Record<DashboardFilterState['rangePreset'], string> = {
  today: 'Today',
  yesterday: 'Yesterday',
  last_7_days: 'Last 7 days',
  last_30_days: 'Last 30 days',
  last_90_days: 'Last 90 days',
  month_to_date: 'This month so far',
  quarter_to_date: 'This quarter so far',
  year_to_date: 'This year so far',
  black_friday_cyber_monday: 'Black Friday Cyber Monday',
  custom: 'Custom range',
}
const grainLabels: Record<DashboardFilterState['grain'], string> = {
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
}
const comparisonLabels: Record<DashboardFilterState['comparison'], string> = {
  none: 'No comparison',
  previous_period: 'Compared to previous period',
  previous_year: 'Compared to previous year',
  custom: 'Compared to custom range',
}
const comparisonContextLabel = computed(() => comparisonLabels[props.filters.comparison])
const kpiComparisonLabel = computed(() => {
  if (props.filters.comparison === 'none') return ''
  if (props.filters.comparison === 'previous_year') return 'vs previous year'
  if (props.filters.comparison === 'custom') return 'vs custom range'

  const range = props.filters.rangePreset
  if (range === 'last_7_days') return 'vs prev 7d'
  if (range === 'last_30_days') return 'vs prev 30d'
  if (range === 'last_90_days') return 'vs prev 90d'
  if (range === 'today') return 'vs yesterday'
  if (range === 'year_to_date') return 'vs prev YTD'
  return 'vs previous period'
})
const widgetSubtitle = computed(() => {
  if (isKpiWidget.value) {
    if (props.widget.metricId === 'contacts_total') return 'All time'
    return rangeLabels[props.filters.rangePreset]
  }

  if (props.widget.metricId === 'marketing_top_campaigns') {
    return `${rangeLabels[props.filters.rangePreset]} - by revenue`
  }

  if (props.filters.comparison === 'none') {
    return grainLabels[props.filters.grain]
  }

  return `${grainLabels[props.filters.grain]} - ${comparisonContextLabel.value.toLowerCase()}`
})
const isDataEmpty = computed(() => {
  if (data.value.kind === 'table') return data.value.rows.length === 0
  if (data.value.kind === 'series') return data.value.labels.length === 0 || data.value.series.every((series) => series.data.length === 0)
  return false
})

function openDrilldown() {
  router.push({
    name: props.widget.drilldown.routeName,
    params: { accountId: props.accountId },
  })
}

function chooseSize(size: WidgetSize) {
  emit('resize', { widgetId: props.widget.id, size })
}

function openSettings() {
  if (props.preview) return
  emit('edit', props.widget.id)
}
</script>

<template>
  <v-card
    flat
    border
    rounded="xl"
    class="dashboard-widget-card h-100 d-flex flex-column"
    :class="{
      'dashboard-widget-card--preview': preview,
      'dashboard-widget-card--editable': editable,
      'dashboard-widget-card--kpi': isKpiWidget,
    }"
  >
    <div v-if="isKpiWidget && !preview" class="dashboard-widget-card__kpi-actions">
      <v-icon v-if="editable" size="18" class="dashboard-widget-card__drag-handle">mdi-drag-vertical</v-icon>
      <v-menu location="bottom end">
        <template #activator="{ props: menuProps }">
          <v-btn
            v-bind="menuProps"
            icon="mdi-dots-vertical"
            variant="text"
            size="small"
            :aria-label="`Actions for ${widget.title}`"
          />
        </template>
        <v-list density="compact" min-width="180">
          <v-list-item
            v-if="editable"
            prepend-icon="mdi-pencil-outline"
            title="Edit"
            @click="emit('edit', widget.id)"
          />
          <v-list-item
            prepend-icon="mdi-arrow-top-right"
            title="View report"
            @click="openDrilldown"
          />
          <template v-if="editable">
            <v-divider class="my-1" />
            <v-list-item
              v-for="size in WIDGET_SIZES"
              :key="size"
              :prepend-icon="currentSize === size ? 'mdi-check' : undefined"
              :title="`Size ${size}`"
              :active="currentSize === size"
              @click="chooseSize(size)"
            />
            <v-divider class="my-1" />
            <v-list-item
              prepend-icon="mdi-delete-outline"
              title="Remove"
              base-color="error"
              @click="emit('remove', widget.id)"
            />
          </template>
        </v-list>
      </v-menu>
    </div>

    <div v-if="!isKpiWidget" class="dashboard-widget-card__header">
      <div class="dashboard-widget-card__header-copy">
        <div class="dashboard-widget-card__title-row">
          <v-icon v-if="editable" size="18" class="dashboard-widget-card__drag-handle">mdi-drag-vertical</v-icon>
          <div class="dashboard-widget-card__title">{{ widget.title }}</div>
        </div>
        <div class="dashboard-widget-card__subtitle">{{ widgetSubtitle }}</div>
      </div>

      <div class="dashboard-widget-card__actions">
        <v-menu v-if="!preview" location="bottom end">
          <template #activator="{ props: menuProps }">
            <v-btn
              v-bind="menuProps"
              icon="mdi-dots-vertical"
              variant="text"
              size="small"
              :aria-label="`Actions for ${widget.title}`"
            />
          </template>
          <v-list density="compact" min-width="180">
            <v-list-item
              v-if="editable"
              prepend-icon="mdi-pencil-outline"
              title="Edit"
              @click="emit('edit', widget.id)"
            />
            <v-list-item
              prepend-icon="mdi-tune-variant"
              title="Widget settings"
              @click="openSettings"
            />
            <v-list-item
              prepend-icon="mdi-refresh"
              title="Refresh widget"
            />
            <v-list-item
              prepend-icon="mdi-arrow-top-right"
              title="View report"
              @click="openDrilldown"
            />
            <template v-if="editable">
              <v-divider class="my-1" />
              <v-list-item
                v-for="size in WIDGET_SIZES"
                :key="size"
                :prepend-icon="currentSize === size ? 'mdi-check' : undefined"
                :title="`Size ${size}`"
                :active="currentSize === size"
                @click="chooseSize(size)"
              />
              <v-divider class="my-1" />
              <v-list-item
                prepend-icon="mdi-delete-outline"
                title="Remove"
                base-color="error"
                @click="emit('remove', widget.id)"
              />
            </template>
          </v-list>
        </v-menu>
      </div>
    </div>

    <div
      ref="bodyEl"
      class="dashboard-widget-card__body"
    >
      <div v-if="isDataEmpty" class="dashboard-widget-card__empty">
        <v-icon size="42" color="medium-emphasis">mdi-magnify-scan</v-icon>
        <div class="text-body-2 text-medium-emphasis mt-3">
          There is no data to show in this time frame. Try changing the date range.
        </div>
      </div>
      <DashboardKpiWidget
        v-else-if="data.kind === 'kpi'"
        :data="data"
        :compact="isCompactHeight"
        :title="widget.title"
        :subtitle="widgetSubtitle"
        :comparison-label="kpiComparisonLabel"
      />
      <DashboardChartWidget
        v-else-if="data.kind === 'series'"
        :data="data"
        :widget-type="widget.type as 'timeseries' | 'bar'"
        :height="bodySize.height"
      />
      <DashboardTableWidget
        v-else
        :data="data"
      />
    </div>
  </v-card>
</template>

<style scoped lang="scss">
.dashboard-widget-card {
  position: relative;
  border-color: var(--mp-border-subtle);
  border-radius: 12px !important;
  background: rgb(var(--v-theme-surface));
  overflow: hidden;
  min-height: 0;
  box-shadow: 0 1px 2px rgba(var(--v-theme-on-surface), 0.025);
  transition: border-color $mp-transition-fast, box-shadow $mp-transition-fast;
}

.dashboard-widget-card:hover {
  border-color: rgba(var(--v-theme-on-surface), 0.14);
}

.dashboard-widget-card__header {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: start;
  gap: 12px;
  min-height: 60px;
  padding: 18px 20px 12px;
}

.dashboard-widget-card__header-copy {
  min-width: 0;
}

.dashboard-widget-card__title-row {
  display: flex;
  align-items: center;
  gap: 7px;
  min-width: 0;
}

.dashboard-widget-card__title {
  min-width: 0;
  overflow: hidden;
  color: rgb(var(--v-theme-on-surface));
  font-size: clamp(1rem, 1.35vw, 1.12rem);
  font-weight: 700;
  line-height: 1.25;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dashboard-widget-card__subtitle {
  overflow: hidden;
  margin-top: 4px;
  color: rgba(var(--v-theme-on-surface), 0.56);
  font-size: var(--mp-typography-fontSize-sm);
  font-weight: 500;
  line-height: 1.3;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dashboard-widget-card__actions {
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: 2px;
  margin-top: -4px;
}

.dashboard-widget-card__actions :deep(.v-btn),
.dashboard-widget-card__kpi-actions :deep(.v-btn) {
  min-width: 28px;
  width: 28px !important;
  height: 28px !important;
  padding: 0;
  color: rgba(var(--v-theme-on-surface), 0.54);
}

.dashboard-widget-card__actions :deep(.v-icon),
.dashboard-widget-card__kpi-actions :deep(.v-icon) {
  font-size: 18px;
}

.dashboard-widget-card__kpi-actions {
  position: absolute;
  top: 14px;
  right: 14px;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 2px;
}

.dashboard-widget-card__drag-handle {
  color: rgba(var(--v-theme-on-surface), 0.48);
  cursor: grab;
}

.dashboard-widget-card--preview {
  border-style: dashed;
}

.dashboard-widget-card--editable {
  border-color: rgba(var(--v-theme-primary), 0.40);
  box-shadow: 0 0 0 1px rgba(var(--v-theme-primary), 0.12);
  cursor: grab;
}

.dashboard-widget-card__body {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-height: 0;
  overflow: hidden;
  padding: 0 20px 20px;
}

.dashboard-widget-card--kpi .dashboard-widget-card__body {
  padding: 0;
}

.dashboard-widget-card__empty {
  display: flex;
  flex: 1 1 auto;
  min-height: 180px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  padding: 24px;
}
</style>
