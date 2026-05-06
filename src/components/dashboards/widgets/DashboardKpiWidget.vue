<script setup lang="ts">
import { computed } from 'vue'
import type { DashboardKpiData } from '@/stores/dashboards/types'

const props = withDefaults(defineProps<{
  data: DashboardKpiData
  compact?: boolean
  title?: string
  subtitle?: string
  comparisonLabel?: string
}>(), {
  compact: false,
  title: '',
  subtitle: '',
  comparisonLabel: '',
})

const trendPositive = computed(() => props.data.delta == null || props.data.delta >= 0)
const trendIcon = computed(() => (trendPositive.value ? 'mdi-menu-up' : 'mdi-menu-down'))
const displayDeltaLabel = computed(() => {
  if (props.data.delta == null) return props.data.deltaLabel
  if (props.data.unit === 'percent') {
    return `${props.data.delta >= 0 ? '+' : ''}${props.data.delta.toFixed(1)} pp`
  }
  return props.data.deltaLabel
})

const sparklineValues = computed(() => {
  const delta = props.data.delta ?? 12
  const slope = Math.max(-0.2, Math.min(0.24, delta / 900))
  const base = [0.2, 0.23, 0.31, 0.28, 0.36, 0.34, 0.43, 0.40, 0.51, 0.47, 0.56]
  return base.map((value, index) => Math.min(0.9, Math.max(0.08, value + slope * index)))
})

const sparklinePoints = computed(() => {
  const values = sparklineValues.value
  const maxIndex = Math.max(values.length - 1, 1)
  return values
    .map((value, index) => {
      const x = (index / maxIndex) * 100
      const y = 48 - value * 38
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
})

const sparklineAreaPoints = computed(() => `0,52 ${sparklinePoints.value} 100,52`)
</script>

<template>
  <div class="dashboard-kpi-widget d-flex flex-column h-100" :class="{ 'dashboard-kpi-widget--compact': compact }">
    <div class="dashboard-kpi-widget__header">
      <div v-if="title" class="dashboard-kpi-widget__title">{{ title }}</div>
      <div v-if="subtitle" class="dashboard-kpi-widget__subtitle">{{ subtitle }}</div>
    </div>

    <div class="dashboard-kpi-widget__value">{{ data.formattedValue }}</div>

    <div class="dashboard-kpi-widget__trend">
      <span
        class="dashboard-kpi-widget__trend-pill"
        :class="trendPositive ? 'dashboard-kpi-widget__trend-pill--positive' : 'dashboard-kpi-widget__trend-pill--negative'"
      >
        <v-icon size="14">{{ trendIcon }}</v-icon>
        {{ displayDeltaLabel }}
      </span>
      <span v-if="comparisonLabel && !compact" class="dashboard-kpi-widget__comparison">{{ comparisonLabel }}</span>
    </div>

    <svg class="dashboard-kpi-widget__sparkline" viewBox="0 0 100 52" preserveAspectRatio="none" aria-hidden="true">
      <polygon :points="sparklineAreaPoints" class="dashboard-kpi-widget__sparkline-area" />
      <polyline :points="sparklinePoints" class="dashboard-kpi-widget__sparkline-line" />
    </svg>
  </div>
</template>

<style scoped lang="scss">
.dashboard-kpi-widget {
  justify-content: flex-start;
  gap: 8px;
  padding: 22px 24px 14px;
}

.dashboard-kpi-widget__header {
  min-width: 0;
  max-width: calc(100% - 38px);
}

.dashboard-kpi-widget__title {
  overflow: hidden;
  color: rgb(var(--v-theme-on-surface));
  font-size: clamp(0.95rem, 1.3vw, 1.05rem);
  font-weight: 700;
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dashboard-kpi-widget__subtitle {
  overflow: hidden;
  margin-top: 4px;
  color: rgba(var(--v-theme-on-surface), 0.56);
  font-size: var(--mp-typography-fontSize-sm);
  font-weight: 500;
  line-height: 1.3;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dashboard-kpi-widget__value {
  overflow: visible;
  margin-top: 10px;
  padding-bottom: 3px;
  font-size: clamp(1.6rem, 2.2vw, 2.05rem);
  line-height: 1.2;
  letter-spacing: -0.01em;
  font-weight: 750;
  color: rgb(var(--v-theme-on-surface));
  white-space: nowrap;
}

.dashboard-kpi-widget--compact .dashboard-kpi-widget__value {
  margin-top: 6px;
  font-size: clamp(1.45rem, 2.1vw, 1.9rem);
}

.dashboard-kpi-widget__trend {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  flex-wrap: nowrap;
}

.dashboard-kpi-widget__trend-pill {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  height: 22px;
  padding: 0 10px 0 7px;
  border-radius: 999px;
  font-size: var(--mp-typography-fontSize-xs);
  font-weight: 700;
  white-space: nowrap;
}

.dashboard-kpi-widget__trend-pill--positive {
  background: rgba(var(--v-theme-success), 0.12);
  color: rgb(var(--v-theme-success));
}

.dashboard-kpi-widget__trend-pill--negative {
  background: rgba(var(--v-theme-error), 0.12);
  color: rgb(var(--v-theme-error));
}

.dashboard-kpi-widget__comparison {
  overflow: hidden;
  color: rgba(var(--v-theme-on-surface), 0.54);
  font-size: var(--mp-typography-fontSize-sm);
  font-weight: 500;
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dashboard-kpi-widget__sparkline {
  width: 100%;
  min-height: 34px;
  margin-top: auto;
  overflow: visible;
}

.dashboard-kpi-widget__sparkline-area {
  fill: rgba(var(--v-theme-primary), 0.09);
}

.dashboard-kpi-widget__sparkline-line {
  fill: none;
  stroke: rgb(var(--v-theme-primary));
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2.4;
}

.dashboard-kpi-widget--compact {
  gap: 5px;
  padding: 18px 20px 12px;
}

.dashboard-kpi-widget--compact .dashboard-kpi-widget__subtitle {
  font-size: var(--mp-typography-fontSize-xs);
}

.dashboard-kpi-widget--compact .dashboard-kpi-widget__trend-pill {
  height: 22px;
  padding-inline: 7px;
}

.dashboard-kpi-widget--compact .dashboard-kpi-widget__sparkline {
  min-height: 24px;
}
</style>
