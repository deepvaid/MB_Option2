<script setup lang="ts">
defineProps<{
  label: string
  value: string | number
  icon?: string
  color?: string
  trend?: string
  trendPositive?: boolean
  subStat?: string
}>()
</script>

<template>
  <v-card variant="flat" border rounded="xl" class="mp-kpi-card pa-6 h-100">
    <div class="d-flex justify-space-between align-start mb-4">
      <div class="mp-kpi-card__label">{{ label }}</div>
      <div v-if="icon" class="mp-kpi-card__icon">
        <v-icon :color="color || 'primary'" size="20">{{ icon }}</v-icon>
      </div>
    </div>
    <div class="mp-kpi-card__value font-weight-bold mb-2">{{ value }}</div>
    <div v-if="trend || subStat" class="d-flex align-center gap-2">
      <v-chip
        v-if="trend"
        :color="trendPositive ? 'success' : 'error'"
        size="x-small"
        variant="tonal"
        rounded="lg"
        class="font-weight-bold"
        :prepend-icon="trendPositive ? 'trending-up' : 'trending-down'"
      >{{ trend }}</v-chip>
      <span v-if="subStat" class="text-caption text-medium-emphasis">{{ subStat }}</span>
    </div>
    <slot />
  </v-card>
</template>

<style scoped lang="scss">
.mp-kpi-card {
  position: relative;
  overflow: hidden;
  background: rgb(var(--v-theme-surface));
  transition: border-color $mp-transition-fast, background-color $mp-transition-fast;
}

.mp-kpi-card__label {
  font-size: var(--mp-typography-fontSize-sm);
  font-weight: var(--mp-typography-fontWeight-semibold);
  letter-spacing: -0.01em;
  color: rgba(var(--v-theme-on-surface), 0.72);
}

.mp-kpi-card__icon {
  width: 42px;
  height: 42px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(var(--v-theme-surface-variant), 0.88);
  border: 1px solid rgba(var(--v-theme-border), 0.92);
}

.mp-kpi-card__value {
  font-size: clamp(2rem, 2.4vw, 2.6rem);
  line-height: 1.02;
  letter-spacing: -0.05em;
}
</style>
