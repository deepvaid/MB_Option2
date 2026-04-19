<script setup lang="ts">
import type { DashboardKpiData } from '@/stores/dashboards/types'

withDefaults(defineProps<{
  data: DashboardKpiData
  compact?: boolean
}>(), {
  compact: false,
})
</script>

<template>
  <div class="dashboard-kpi-widget d-flex flex-column h-100" :class="{ 'dashboard-kpi-widget--compact': compact }">
    <div class="dashboard-kpi-widget__value">{{ data.formattedValue }}</div>
    <div class="d-flex align-center ga-2 mt-1 flex-wrap">
      <v-chip
        size="x-small"
        :color="data.delta != null && data.delta >= 0 ? 'success' : 'error'"
        :variant="data.delta == null ? 'outlined' : 'tonal'"
        rounded="pill"
        class="font-weight-bold"
      >
        {{ data.deltaLabel }}
      </v-chip>
      <span v-if="!compact" class="text-caption text-medium-emphasis">vs comparison period</span>
    </div>

    <div v-if="!compact" class="text-caption text-medium-emphasis mt-auto pt-2 dashboard-kpi-widget__helper">
      {{ data.helperText }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.dashboard-kpi-widget__value {
  font-size: clamp(1.5rem, 3.5vw, 2.4rem);
  line-height: 1.1;
  letter-spacing: -0.04em;
  font-weight: 800;
  color: rgb(var(--v-theme-on-surface));
}

.dashboard-kpi-widget--compact .dashboard-kpi-widget__value {
  font-size: clamp(1.2rem, 2.5vw, 1.8rem);
}

.dashboard-kpi-widget__helper {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
