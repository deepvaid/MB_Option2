<script setup lang="ts">
defineProps<{
  name: string
  steps: Array<{
    type: 'trigger' | 'wait' | 'email' | 'sms' | 'condition' | 'action'
    label: string
  }>
}>()

const emit = defineEmits<{
  activate: []
  edit: []
}>()

const stepIcons: Record<string, string> = {
  trigger: 'mdi-lightning-bolt',
  wait: 'mdi-timer-sand',
  email: 'mdi-email-outline',
  sms: 'mdi-message-text-outline',
  condition: 'mdi-source-branch',
  action: 'mdi-cog-outline',
}

const stepColors: Record<string, string> = {
  trigger: '#FF9800',
  wait: '#78909C',
  email: '#1976D2',
  sms: '#43A047',
  condition: '#AB47BC',
  action: '#5C6BC0',
}
</script>

<template>
  <v-card variant="outlined" rounded="lg">
    <v-card-text class="pa-4">
      <div class="d-flex align-center ga-2 mb-3">
        <v-avatar size="32" color="deep-purple" variant="tonal">
          <v-icon size="18">mdi-relation-many-to-many</v-icon>
        </v-avatar>
        <div>
          <div class="text-subtitle-2 font-weight-bold">{{ name }}</div>
          <div class="text-caption text-medium-emphasis">Journey Automation</div>
        </div>
      </div>

      <!-- Mini flow -->
      <div class="journey-flow d-flex align-center ga-1 pa-3 rounded-lg" style="background: #FAFBFC; overflow-x: auto;">
        <template v-for="(step, i) in steps" :key="i">
          <div class="journey-step d-flex flex-column align-center" style="min-width: 56px;">
            <v-avatar :color="stepColors[step.type]" size="32" class="mb-1">
              <v-icon size="16" color="white">{{ stepIcons[step.type] }}</v-icon>
            </v-avatar>
            <span class="text-caption text-center" style="font-size: 9px; line-height: 1.2; max-width: 60px;">{{ step.label }}</span>
          </div>
          <v-icon v-if="i < steps.length - 1" size="16" color="medium-emphasis" class="mx-0">mdi-chevron-right</v-icon>
        </template>
      </div>

      <div class="d-flex ga-2 mt-3">
        <v-btn color="deep-purple" variant="flat" size="small" class="text-none flex-grow-1" prepend-icon="mdi-play" @click="emit('activate')">
          Activate Journey
        </v-btn>
        <v-btn variant="outlined" size="small" class="text-none" @click="emit('edit')">
          Customize
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>
