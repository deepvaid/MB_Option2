<script setup lang="ts">
import { computed } from 'vue'
import type { DashboardKpiData } from '@/stores/dashboards/types'

const props = withDefaults(defineProps<{
  data: DashboardKpiData
  compact?: boolean
  title?: string
  subtitle?: string
  comparisonLabel?: string
  icon?: string
  aiGenerated?: boolean
}>(), {
  compact: false,
  title: '',
  subtitle: '',
  comparisonLabel: '',
  icon: '',
  aiGenerated: false,
})

const trendPositive = computed(() => props.data.delta == null || props.data.delta >= 0)
const trendIcon = computed(() => (trendPositive.value ? 'chevron-up' : 'chevron-down'))

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

</script>

<template>
  <div class="dashboard-kpi-widget d-flex flex-column h-100" :class="{ 'dashboard-kpi-widget--compact': compact }">
    <div class="dashboard-kpi-widget__top-row">
      <div class="dashboard-kpi-widget__text-stack">
        <!-- Icon chip + label + period caption -->
        <div class="dashboard-kpi-widget__header-row">
          <div v-if="icon" class="dashboard-kpi-widget__icon-chip">
            <v-icon :size="compact ? 13 : 14">{{ icon }}</v-icon>
          </div>
          <div class="dashboard-kpi-widget__header-text">
            <div v-if="title" class="dashboard-kpi-widget__title-row">
              <v-tooltip v-if="aiGenerated" location="top" text="Made by Da Vinci">
                <template #activator="{ props: tipProps }">
                  <span v-bind="tipProps" class="dashboard-kpi-widget__davinci-icon">
                    <v-icon size="12" color="secondary">sparkles</v-icon>
                  </span>
                </template>
              </v-tooltip>
              <div class="dashboard-kpi-widget__title" :title="title">{{ title }}</div>
            </div>
            <div class="dashboard-kpi-widget__period" v-if="subtitle">{{ subtitle }}</div>
          </div>
        </div>

        <!-- Big value -->
        <div class="dashboard-kpi-widget__value num">{{ data.formattedValue }}</div>

        <!-- Trend inline with comparison label -->
        <div class="dashboard-kpi-widget__trend">
          <span
            class="dashboard-kpi-widget__trend-pill"
            :class="trendPositive ? 'dashboard-kpi-widget__trend-pill--positive' : 'dashboard-kpi-widget__trend-pill--negative'"
          >
            <v-icon size="12">{{ trendIcon }}</v-icon>
            {{ displayDeltaLabel }}
          </span>
          <span v-if="comparisonLabel" class="dashboard-kpi-widget__comparison">{{ comparisonLabel }}</span>
        </div>
      </div>

      <!-- Side sparkline -->
      <div class="dashboard-kpi-widget__sparkline-col" aria-hidden="true">
        <svg class="dashboard-kpi-widget__sparkline" viewBox="0 0 100 52" preserveAspectRatio="none">
          <defs>
            <linearGradient :id="`sparkFill-${data.id ?? data.label}`" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="currentColor" stop-opacity="0.18" />
              <stop offset="100%" stop-color="currentColor" stop-opacity="0" />
            </linearGradient>
          </defs>
          <polygon
            :points="`0,52 ${sparklinePoints} 100,52`"
            class="dashboard-kpi-widget__sparkline-fill"
            :fill="`url(#sparkFill-${data.id ?? data.label})`"
          />
          <polyline :points="sparklinePoints" class="dashboard-kpi-widget__sparkline-line" />
        </svg>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.dashboard-kpi-widget {
  justify-content: flex-start;
  padding: 16px 18px;
  container-type: inline-size;
}

@container (max-width: 240px) {
  .dashboard-kpi-widget__icon-chip {
    display: none;
  }
  .dashboard-kpi-widget__sparkline-col {
    flex: 0 1 32%;
    max-width: 35%;
    min-width: 60px;
  }
}

.dashboard-kpi-widget__top-row {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  gap: 12px;
  width: 100%;
  flex: 1 1 auto;
  min-height: 0;
}

.dashboard-kpi-widget__text-stack {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1 1 0;
  min-width: 0;
}

.dashboard-kpi-widget__header-row {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.dashboard-kpi-widget__header-text {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
  flex: 1 1 auto;
}

.dashboard-kpi-widget__icon-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: var(--r-chip);
  background: var(--accent-soft);
  color: var(--accent-ink);
}

.dashboard-kpi-widget__title-row {
  display: flex;
  align-items: center;
  gap: 4px;
  min-width: 0;
}

.dashboard-kpi-widget__davinci-icon {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
}

.dashboard-kpi-widget__title {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1 1 auto;
  min-width: 0;
  color: var(--ink);
  font-size: 13px;
  font-weight: 600;
  line-height: 1.25;
  overflow-wrap: break-word;
}

.dashboard-kpi-widget__period {
  color: var(--muted);
  font-size: 11px;
  font-weight: 500;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dashboard-kpi-widget__value {
  overflow: visible;
  margin-top: 6px;
  font-size: 28px;
  line-height: 1.1;
  letter-spacing: -0.5px;
  font-weight: 600;
  color: var(--ink);
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}

.dashboard-kpi-widget--compact .dashboard-kpi-widget__value {
  margin-top: 4px;
  font-size: 22px;
}

.dashboard-kpi-widget__trend {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
  min-width: 0;
  flex-wrap: nowrap;
}

.dashboard-kpi-widget__trend-pill {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0;
}

.dashboard-kpi-widget__trend-pill--positive {
  color: var(--pos);
}

.dashboard-kpi-widget__trend-pill--negative {
  color: var(--neg);
}

.dashboard-kpi-widget__comparison {
  font-size: 12px;
  font-weight: 500;
  color: var(--muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dashboard-kpi-widget__sparkline-col {
  display: flex;
  align-items: flex-end;
  flex: 0 1 38%;
  max-width: 40%;
  min-width: 70px;
  align-self: stretch;
  padding-top: 8px;
  color: var(--accent);
}

.dashboard-kpi-widget__sparkline {
  width: 100%;
  height: 88px;
  overflow: visible;
}

.dashboard-kpi-widget__sparkline-line {
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2;
  vector-effect: non-scaling-stroke;
}

.dashboard-kpi-widget__sparkline-fill {
  stroke: none;
}

/* Compact variant */
.dashboard-kpi-widget--compact {
  padding: 14px 16px;
}

.dashboard-kpi-widget--compact .dashboard-kpi-widget__sparkline-col {
  flex: 0 0 32%;
  max-width: 36%;
  min-width: 80px;
  padding-top: 6px;
}

.dashboard-kpi-widget--compact .dashboard-kpi-widget__sparkline {
  height: 64px;
}

.dashboard-kpi-widget--compact .dashboard-kpi-widget__icon-chip {
  width: 22px;
  height: 22px;
  border-radius: 6px;
}

.dashboard-kpi-widget--compact .dashboard-kpi-widget__header-row {
  gap: 8px;
}

.dashboard-kpi-widget--compact .dashboard-kpi-widget__title {
  font-size: 12px;
  line-height: 1.2;
}

.dashboard-kpi-widget--compact .dashboard-kpi-widget__period {
  font-size: 10.5px;
}
</style>
