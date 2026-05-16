<script setup lang="ts">
import { computed } from 'vue'
import { MbChip } from '@marobase/ui'
import type { MbChipTone } from '@marobase/ui'

const props = withDefaults(defineProps<{
  status: string
  type?: 'order' | 'fulfillment' | 'payment' | 'campaign' | 'contact' | 'ticket' | 'coupon' | 'general'
  size?: 'x-small' | 'small' | 'default'
  variant?: 'flat' | 'tonal' | 'outlined'
  showIcon?: boolean
}>(), {
  type: 'general',
  size: 'small',
  variant: 'tonal',
  showIcon: false,
})

const colorMap: Record<string, Record<string, string>> = {
  order: {
    Processing: 'info', Completed: 'success', Cancelled: 'grey-darken-1',
    Refunded: 'error', 'On Hold': 'warning',
  },
  fulfillment: {
    Unapproved: 'warning', 'Not Ready': 'grey', 'Ready For Fulfillment': 'info',
    Shipped: 'success', 'Return Requested': 'error', Cancelled: 'grey-darken-1',
    Fulfilled: 'success', Unfulfilled: 'warning', Partial: 'info',
  },
  payment: {
    Paid: 'success', Refunded: 'error', Voided: 'grey', Pending: 'warning',
  },
  campaign: {
    Sent: 'success', Scheduled: 'info', Draft: 'grey-darken-1', Sending: 'warning',
    Active: 'success', Paused: 'warning', Completed: 'success', Failed: 'error',
  },
  contact: {
    Active: 'success', Unsubscribed: 'grey', Bounced: 'error', Pending: 'warning',
  },
  ticket: {
    Open: 'info', 'In Progress': 'warning', 'Awaiting Reply': 'secondary',
    Resolved: 'success', Closed: 'grey',
  },
  coupon: {
    Active: 'success', Expired: 'grey', Scheduled: 'info', Used: 'secondary',
  },
  general: {
    Active: 'success', Inactive: 'grey', Pending: 'warning', Error: 'error',
    Published: 'success', Draft: 'grey-darken-1', Archived: 'grey',
  },
}

const iconMap: Record<string, Record<string, string>> = {
  campaign: {
    Sent: 'check', Scheduled: 'calendar-clock',
    Draft: 'pencil', Sending: 'truck',
  },
  fulfillment: {
    Unapproved: 'alert-circle', 'Not Ready': 'package',
    'Ready For Fulfillment': 'package-check', Shipped: 'truck',
    'Return Requested': 'corner-down-left', Cancelled: 'circle-x',
  },
  ticket: {
    Open: 'alert-circle', 'In Progress': 'clock',
    'Awaiting Reply': 'reply', Resolved: 'circle-check',
  },
}

const chipColor = computed(() => {
  const fallbackColors = colorMap.general ?? {}
  return colorMap[props.type]?.[props.status] ?? fallbackColors[props.status] ?? 'default'
})

const chipIcon = computed(() => {
  if (!props.showIcon) return undefined
  return iconMap[props.type]?.[props.status]
})

const tone = computed<MbChipTone>(() => {
  const c = chipColor.value
  if (c === 'error' || c === 'grey-darken-1') {
    return 'danger'
  }
  if (c === 'grey' || c === 'default') {
    return 'neutral'
  }
  return 'brand'
})

const iconPx = computed(() => (props.size === 'x-small' ? 11 : props.size === 'small' ? 12 : 13))
</script>

<template>
  <MbChip
    :label="status"
    :tone="tone"
    :dismissible="false"
    :class="['mp-status-chip', `mp-status-chip--size-${size}`]"
  >
    <template v-if="chipIcon" #prepend>
      <v-icon :size="iconPx" class="mp-status-chip__icon">{{ chipIcon }}</v-icon>
    </template>
  </MbChip>
</template>

<style scoped>
.mp-status-chip__icon {
  color: currentColor;
  flex-shrink: 0;
}

.mp-status-chip--size-x-small {
  --mb-chip-padding-x: 8px;
  --mb-chip-padding-y: 2px;
  --mb-chip-font-size: 11px;
  --mb-chip-line-height: 14px;
  --mb-chip-letter-spacing: 0.02em;
}

.mp-status-chip--size-small {
  --mb-chip-padding-x: 10px;
  --mb-chip-padding-y: 4px;
  --mb-chip-font-size: 12px;
  --mb-chip-line-height: 16px;
}
</style>
