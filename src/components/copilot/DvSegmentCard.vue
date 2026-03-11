<script setup lang="ts">
defineProps<{
  name: string
  rules: string[]
  estimatedSize: number
}>()

const emit = defineEmits<{
  save: []
  preview: []
}>()
</script>

<template>
  <v-card variant="outlined" rounded="lg">
    <v-card-text class="pa-4">
      <div class="d-flex align-center ga-2 mb-3">
        <v-avatar size="32" color="teal" variant="tonal">
          <v-icon size="18">mdi-account-filter-outline</v-icon>
        </v-avatar>
        <div>
          <div class="text-subtitle-2 font-weight-bold">{{ name }}</div>
          <div class="text-caption text-medium-emphasis">Customer Segment</div>
        </div>
        <v-spacer />
        <v-chip size="x-small" color="teal" variant="tonal" prepend-icon="mdi-account-group">
          ~{{ estimatedSize.toLocaleString() }}
        </v-chip>
      </div>

      <v-divider class="mb-3" style="opacity: 0.4;" />

      <div class="text-caption font-weight-bold text-uppercase mb-2" style="letter-spacing: 0.5px; font-size: 10px;">Filter Rules</div>
      <div class="d-flex flex-column ga-1 mb-3">
        <div v-for="(rule, i) in rules" :key="i" class="d-flex align-center ga-2 pa-2 rounded" style="background: #F5F7FA;">
          <v-icon size="14" color="teal">mdi-filter-outline</v-icon>
          <span class="text-body-2">{{ rule }}</span>
        </div>
      </div>

      <div class="d-flex ga-2">
        <v-btn color="teal" variant="flat" size="small" class="text-none flex-grow-1" prepend-icon="mdi-content-save-outline" @click="emit('save')">
          Save Segment
        </v-btn>
        <v-btn variant="outlined" size="small" class="text-none" @click="emit('preview')">
          Preview
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>
