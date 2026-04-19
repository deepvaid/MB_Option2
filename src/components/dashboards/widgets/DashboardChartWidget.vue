<script setup lang="ts">
import { computed } from 'vue'
import type { ApexOptions } from 'apexcharts'
import type { DashboardSeriesData, DashboardWidgetType } from '@/stores/dashboards/types'

const props = withDefaults(defineProps<{
  data: DashboardSeriesData
  widgetType: Extract<DashboardWidgetType, 'timeseries' | 'bar'>
  height?: number
}>(), {
  height: 0,
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

const chartOptions = computed<ApexOptions>(() => ({
  chart: {
    toolbar: { show: false },
    sparkline: { enabled: false },
    zoom: { enabled: false },
    fontFamily: 'Inter, system-ui, sans-serif',
    redrawOnParentResize: true,
  },
  colors: ['rgb(var(--v-theme-primary))'],
  grid: {
    borderColor: 'rgba(var(--v-theme-on-surface), 0.08)',
    strokeDashArray: 4,
    padding: { top: 4, right: 8, bottom: 0, left: 8 },
  },
  stroke: {
    curve: 'smooth',
    width: props.widgetType === 'timeseries' ? 3 : 0,
  },
  plotOptions: {
    bar: {
      borderRadius: 8,
      columnWidth: '46%',
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
    categories: props.data.labels,
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: {
      style: {
        colors: 'rgba(var(--v-theme-on-surface), 0.54)',
        fontSize: '11px',
      },
    },
  },
  yaxis: {
    labels: {
      formatter: (value: number) => formatAxisValue(value, props.data.unit),
      style: {
        colors: 'rgba(var(--v-theme-on-surface), 0.54)',
        fontSize: '11px',
      },
    },
  },
  tooltip: {
    theme: 'light',
    y: {
      formatter: (value: number) => formatAxisValue(value, props.data.unit),
    },
  },
}))
</script>

<template>
  <div class="dashboard-chart-widget">
    <apexchart
      :height="chartHeight"
      width="100%"
      :type="widgetType === 'timeseries' ? 'area' : 'bar'"
      :options="chartOptions"
      :series="data.series"
    />
  </div>
</template>

<style scoped>
.dashboard-chart-widget {
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}
</style>
