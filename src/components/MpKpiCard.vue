<script setup lang="ts">
import { computed } from 'vue'
import { MbStatCard } from '@marobase/ui'
import type { MbStatCardTone, MbStatCardTrend } from '@marobase/ui'

const props = defineProps<{
  label: string
  value: string | number
  icon?: string
  color?: string
  trend?: string
  trendPositive?: boolean
  subStat?: string
}>()

const tone = computed<MbStatCardTone>(() => {
  switch (props.color) {
    case 'success':
    case 'primary':
    case 'info':
      return 'soft'
    case 'warning':
    case 'secondary':
      return 'warm'
    case 'error':
      return 'inverse'
    default:
      return 'default'
  }
})

const trendDir = computed<MbStatCardTrend | undefined>(() => {
  if (!props.trend) {
    return undefined
  }
  if (props.trendPositive === false) {
    return 'down'
  }
  return 'up'
})
</script>

<template>
  <MbStatCard
    class="mp-kpi-card"
    :label="label"
    :value="value"
    :tone="tone"
    :trend="trendDir"
    :trend-value="trend"
    :caption="subStat"
    size="md"
  >
    <template v-if="icon" #icon>
      <v-icon size="18">{{ icon }}</v-icon>
    </template>
    <template v-if="$slots.default" #footer>
      <slot />
    </template>
  </MbStatCard>
</template>

<style scoped>
.mp-kpi-card {
  height: 100%;
}
</style>
