<script setup lang="ts">
import { computed } from 'vue'

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
    'Processing': 'info', 'Completed': 'success', 'Cancelled': 'grey-darken-1',
    'Refunded': 'error', 'On Hold': 'warning',
  },
  fulfillment: {
    'Unapproved': 'warning', 'Not Ready': 'grey', 'Ready For Fulfillment': 'info',
    'Shipped': 'success', 'Return Requested': 'error', 'Cancelled': 'grey-darken-1',
    'Fulfilled': 'success', 'Unfulfilled': 'warning', 'Partial': 'info',
  },
  payment: {
    'Paid': 'success', 'Refunded': 'error', 'Voided': 'grey', 'Pending': 'warning',
  },
  campaign: {
    'Sent': 'success', 'Scheduled': 'info', 'Draft': 'grey-darken-1', 'Sending': 'warning',
    'Active': 'success', 'Paused': 'warning', 'Completed': 'success', 'Failed': 'error',
  },
  contact: {
    'Active': 'success', 'Unsubscribed': 'grey', 'Bounced': 'error', 'Pending': 'warning',
  },
  ticket: {
    'Open': 'info', 'In Progress': 'warning', 'Awaiting Reply': 'secondary',
    'Resolved': 'success', 'Closed': 'grey',
  },
  coupon: {
    'Active': 'success', 'Expired': 'grey', 'Scheduled': 'info', 'Used': 'secondary',
  },
  general: {
    'Active': 'success', 'Inactive': 'grey', 'Pending': 'warning', 'Error': 'error',
    'Published': 'success', 'Draft': 'grey-darken-1', 'Archived': 'grey',
  },
}

const iconMap: Record<string, Record<string, string>> = {
  campaign: {
    'Sent': 'check', 'Scheduled': 'calendar-clock',
    'Draft': 'pencil', 'Sending': 'truck',
  },
  fulfillment: {
    'Unapproved': 'alert-circle', 'Not Ready': 'package',
    'Ready For Fulfillment': 'package-check', 'Shipped': 'truck',
    'Return Requested': 'corner-down-left', 'Cancelled': 'circle-x',
  },
  ticket: {
    'Open': 'alert-circle', 'In Progress': 'clock',
    'Awaiting Reply': 'reply', 'Resolved': 'circle-check',
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
</script>

<template>
  <v-chip
    :color="chipColor"
    :size="size"
    :variant="variant"
    class="font-weight-medium"
  >
    <v-icon v-if="chipIcon" start size="12">{{ chipIcon }}</v-icon>
    {{ status }}
  </v-chip>
</template>
