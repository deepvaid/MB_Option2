<script setup lang="ts">
defineProps<{
  icon?: string
  headline: string
  description: string
  actionLabel?: string
  severity?: 'info' | 'warning' | 'success' | 'error'
}>()

const emit = defineEmits<{
  action: []
}>()

const severityConfig: Record<string, { color: string; bg: string }> = {
  info: { color: '#1976D2', bg: '#E3F2FD' },
  warning: { color: '#FF9800', bg: '#FFF3E0' },
  success: { color: '#43A047', bg: '#E8F5E9' },
  error: { color: '#E53935', bg: '#FFEBEE' },
}
</script>

<template>
  <v-card
    variant="flat"
    rounded="lg"
    :style="{ background: severityConfig[severity || 'info'].bg, border: `1px solid ${severityConfig[severity || 'info'].color}22` }"
  >
    <v-card-text class="pa-4">
      <div class="d-flex align-start ga-3">
        <v-icon :color="severityConfig[severity || 'info'].color" size="22">{{ icon || 'mdi-lightbulb-outline' }}</v-icon>
        <div class="flex-grow-1">
          <div class="text-subtitle-2 font-weight-bold mb-1">{{ headline }}</div>
          <div class="text-body-2 text-medium-emphasis mb-2" style="line-height: 1.5;">{{ description }}</div>
          <v-btn
            v-if="actionLabel"
            :color="severityConfig[severity || 'info'].color"
            variant="tonal"
            size="small"
            class="text-none"
            @click="emit('action')"
          >
            {{ actionLabel }}
          </v-btn>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>
