<script setup lang="ts">
import { MbButton, MbEmptyState } from '@marobase/ui'

defineProps<{
  icon?: string
  title: string
  description?: string
  actionLabel?: string
  actionIcon?: string
}>()

defineEmits<{
  action: []
}>()
</script>

<template>
  <MbEmptyState :title="title" :description="description">
    <template v-if="icon" #icon>
      <v-icon size="56" color="medium-emphasis">{{ icon }}</v-icon>
    </template>
    <template v-if="actionLabel" #actions>
      <MbButton
        style-type="filled"
        size="md"
        :label="actionLabel"
        icon-mode="with-label"
        :aria-label="actionLabel"
        @click="$emit('action')"
      >
        <template v-if="actionIcon" #leading>
          <v-icon size="18">{{ actionIcon }}</v-icon>
        </template>
        {{ actionLabel }}
      </MbButton>
    </template>
  </MbEmptyState>
</template>
