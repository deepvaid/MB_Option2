<script setup lang="ts">
import { computed, defineAsyncComponent, onBeforeUnmount, onMounted, ref } from 'vue'
import type { ApexOptions } from 'apexcharts'
import type { DashboardSeriesData, DashboardWidgetType } from '@/stores/dashboards/types'
import { applyChartTheme, chartPalette } from '@/plugins/chartPalette'

const props = withDefaults(defineProps<{
  data: DashboardSeriesData
  widgetType: Extract<DashboardWidgetType, 'timeseries' | 'bar'>
  height?: number
}>(), {
  height: 0,
})

const ApexChart = defineAsyncComponent({
  loader: async () => (await import('vue3-apexcharts')).default,
  suspensible: false,
})

const chartReady = ref(false)
let deferredRenderHandle: number | undefined

onMounted(() => {
  if (typeof window === 'undefined') {
    chartReady.value = true
    return
  }

  const revealChart = () => {
    chartReady.value = true
  }

  if ('requestIdleCallback' in window) {
    deferredRenderHandle = window.requestIdleCallback(revealChart, { timeout: 500 }) as unknown as number
    return
  }

  deferredRenderHandle = globalThis.setTimeout(revealChart, 0)
})

onBeforeUnmount(() => {
  if (typeof window === 'undefined' || deferredRenderHandle == null) return

  if ('cancelIdleCallback' in window) {
    window.cancelIdleCallback(deferredRenderHandle)
    return
  }

  globalThis.clearTimeout(deferredRenderHandle)
})

function formatAxisValue(value: number, unit: DashboardSeriesData['unit']): string {
  if (unit === 'currency') {
    return value >= 1000 ? `$${Math.round(value / 1000)}k` : `$${Math.round(value)}`
  }
  if (unit === 'percent') {
    return `${value.toFixed(0)}%`
  }
  return value >= 1000 ? `${Math.round(value / 1000)}k` : `${Math.round(value)}`
}

const chartHeight = computed(() => {
  if (!props.height || props.height < 60) return 220
  return Math.max(120, props.height - 4)
})

const base = applyChartTheme()

// For single-series bar charts (e.g. "Revenue by Channel"), distribute palette
// colors across categories so each bar reads as a distinct color instead of
// every bar using `colors[0]`.
const isDistributedBar = computed(
  () => props.widgetType === 'bar' && props.data.series.length <= 1,
)

const chartOptions = computed<ApexOptions>(() => ({
  ...base,
  colors: chartPalette,
  chart: {
    ...base.chart,
    sparkline: { enabled: false },
    zoom: { enabled: false },
    redrawOnParentResize: true,
  },
  stroke: {
    curve: 'smooth',
    width: props.widgetType === 'timeseries' ? 3 : 0,
  },
  plotOptions: {
    bar: {
      borderRadius: 8,
      columnWidth: '46%',
      distributed: isDistributedBar.value,
    },
  },
  fill: {
    type: props.widgetType === 'timeseries' ? 'gradient' : 'solid',
    gradient: {
      shadeIntensity: 0.18,
      opacityFrom: 0.36,
      opacityTo: 0.02,
      stops: [0, 96, 100],
    },
  },
  dataLabels: { enabled: false },
  legend: { show: false },
  xaxis: {
    ...base.xaxis,
    categories: props.data.labels,
    labels: {
      ...base.xaxis?.labels,
      offsetY: 2,
    },
  },
  yaxis: {
    labels: {
      formatter: (value: number) => formatAxisValue(value, props.data.unit),
      style: {
        colors: 'rgba(var(--v-theme-on-surface), 0.55)',
        fontSize: '12px',
        fontWeight: 500,
      },
    },
  },
  tooltip: {
    ...base.tooltip,
    y: {
      formatter: (value: number) => formatAxisValue(value, props.data.unit),
    },
  },
}))
</script>

<template>
  <div class="dashboard-chart-widget">
    <ApexChart
      v-if="chartReady"
      :height="chartHeight"
      width="100%"
      :type="widgetType === 'timeseries' ? 'area' : 'bar'"
      :options="chartOptions"
      :series="data.series"
    />
    <div v-else class="dashboard-chart-widget__placeholder">
      <v-skeleton-loader type="image" height="100%" width="100%" />
    </div>
  </div>
</template>

<style scoped>
.dashboard-chart-widget {
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.dashboard-chart-widget__placeholder {
  width: 100%;
  height: 100%;
  min-height: 120px;
}
</style>
