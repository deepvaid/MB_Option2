<script setup lang="ts">
defineProps<{
  kpis: Array<{
    label: string
    value: string
    trend?: string
    trendUp?: boolean
    icon?: string
  }>
}>()
</script>

<template>
  <div class="d-flex ga-2 flex-wrap">
    <v-card
      v-for="(kpi, i) in kpis"
      :key="i"
      variant="outlined"
      rounded="lg"
      class="flex-grow-1"
      style="min-width: 120px;"
    >
      <v-card-text class="pa-3">
        <div class="d-flex align-center justify-space-between mb-1">
          <span class="text-caption text-medium-emphasis text-uppercase" style="font-size: 10px; letter-spacing: 0.5px;">{{ kpi.label }}</span>
          <v-icon v-if="kpi.icon" size="16" color="primary" style="opacity: 0.5;">{{ kpi.icon }}</v-icon>
        </div>
        <div class="text-h6 font-weight-bold" style="line-height: 1.2;">{{ kpi.value }}</div>
        <v-chip
          v-if="kpi.trend"
          size="x-small"
          :color="kpi.trendUp ? 'success' : 'error'"
          variant="tonal"
          class="mt-1"
          :prepend-icon="kpi.trendUp ? 'trending-up' : 'trending-down'"
          style="font-size: 10px;"
        >
          {{ kpi.trend }}
        </v-chip>
      </v-card-text>
    </v-card>
  </div>
</template>
