<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useWidgetData } from '@/composables/useWidgetData'
import { useElementSize } from '@/composables/useElementSize'
import { DASHBOARD_SOURCE_META, getMetricDescriptor } from '@/stores/dashboards/metricCatalog'
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
const metric = computed(() => getMetricDescriptor(props.widget.metricId))
const sourceMeta = computed(() => DASHBOARD_SOURCE_META[props.widget.dataSource])
const { data } = useWidgetData(computed(() => props.widget), computed(() => props.filters))
const { size: bodySize } = useElementSize(bodyEl)

const currentSize = computed<WidgetSize | null>(() => detectSize(props.widget.type, props.widget.layout.w, props.widget.layout.h))
const isCompactHeight = computed(() => bodySize.value.height > 0 && bodySize.value.height < 140)

function openDrilldown() {
  router.push({
    name: props.widget.drilldown.routeName,
    params: { accountId: props.accountId },
  })
}

function chooseSize(size: WidgetSize) {
  emit('resize', { widgetId: props.widget.id, size })
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
    }"
  >
    <div class="dashboard-widget-card__header d-flex align-start justify-space-between ga-2 px-4 pt-3 pb-2">
      <div class="dashboard-widget-card__header-copy">
        <div class="d-flex align-center ga-2 mb-1">
          <v-chip size="x-small" variant="tonal" :prepend-icon="sourceMeta.icon" class="font-weight-medium">
            {{ sourceMeta.label }}
          </v-chip>
          <v-chip
            v-if="widget.aiProvenance"
            size="x-small"
            color="secondary"
            variant="tonal"
            prepend-icon="mdi-creation"
            class="font-weight-medium"
          >
            Da Vinci
          </v-chip>
        </div>
        <div class="text-body-1 font-weight-bold">{{ widget.title }}</div>
        <div v-if="!isCompactHeight && widget.type !== 'kpi'" class="text-caption text-medium-emphasis mt-1">
          {{ metric?.description }}
        </div>
      </div>

      <div class="d-flex align-center ga-1 flex-shrink-0">
        <v-menu v-if="editable" location="bottom end">
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
              prepend-icon="mdi-pencil-outline"
              title="Edit"
              @click="emit('edit', widget.id)"
            />
            <v-list-item
              prepend-icon="mdi-arrow-top-right"
              title="View report"
              @click="openDrilldown"
            />
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
          </v-list>
        </v-menu>
        <v-btn
          v-if="!editable && !preview"
          icon="mdi-arrow-top-right"
          variant="text"
          size="small"
          aria-label="Open drill-down report"
          @click="openDrilldown"
        />
      </div>
    </div>

    <div
      ref="bodyEl"
      class="dashboard-widget-card__body px-4 pb-3 flex-grow-1"
    >
      <DashboardKpiWidget
        v-if="data.kind === 'kpi'"
        :data="data"
        :compact="isCompactHeight"
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
  border-color: var(--mp-border-subtle);
  background: rgb(var(--v-theme-surface));
  overflow: hidden;
  min-height: 0;
}

.dashboard-widget-card__header-copy {
  min-width: 0;
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
  min-height: 0;
  overflow: hidden;
}
</style>
