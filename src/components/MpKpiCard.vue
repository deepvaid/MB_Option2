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
  <v-card variant="flat" border rounded="lg" class="mp-kpi-card h-100">
    <div class="mp-kpi-card__header">
      <div v-if="icon" class="mp-kpi-card__icon-chip">
        <v-icon size="14">{{ icon }}</v-icon>
      </div>
      <div class="mp-kpi-card__label">{{ label }}</div>
    </div>
    <div class="mp-kpi-card__value num">{{ value }}</div>
    <div v-if="trend || subStat" class="mp-kpi-card__footer">
      <span
        v-if="trend"
        class="mp-kpi-card__trend"
        :class="trendPositive ? 'mp-kpi-card__trend--positive' : 'mp-kpi-card__trend--negative'"
      >
        <v-icon size="12">{{ trendPositive ? 'chevron-up' : 'chevron-down' }}</v-icon>
        {{ trend }}
      </span>
      <span v-if="subStat" class="mp-kpi-card__sub">{{ subStat }}</span>
    </div>
    <slot />
  </v-card>
</template>

<style scoped lang="scss">
.mp-kpi-card {
  position: relative;
  overflow: hidden;
  padding: 16px 18px;
  background: var(--surface-1);
  border-color: var(--hairline) !important;
  border-radius: var(--r-card) !important;
}

.mp-kpi-card__header {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 10px;
}

.mp-kpi-card__icon-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: var(--r-chip);
  background: var(--accent-soft);
  color: var(--accent-ink);
  flex-shrink: 0;
}

.mp-kpi-card__label {
  font-size: 13px;
  font-weight: 500;
  color: var(--ink);
}

.mp-kpi-card__value {
  font-size: 28px;
  font-weight: 600;
  letter-spacing: -0.5px;
  line-height: 1.1;
  color: var(--ink);
  font-variant-numeric: tabular-nums;
  margin-bottom: 8px;
}

.mp-kpi-card__footer {
  display: flex;
  align-items: center;
  gap: 6px;
}

.mp-kpi-card__trend {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  font-size: 12px;
  font-weight: 600;
}

.mp-kpi-card__trend--positive {
  color: var(--pos);
}

.mp-kpi-card__trend--negative {
  color: var(--neg);
}

.mp-kpi-card__sub {
  font-size: 12px;
  font-weight: 500;
  color: var(--muted);
}
</style>
