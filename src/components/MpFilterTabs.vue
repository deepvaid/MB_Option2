<script setup lang="ts">
import { computed } from 'vue'
import { MbTabs } from '@marobase/ui'
import type { MbTabItem } from '@marobase/ui'

const model = defineModel<string>({ required: true })

const props = withDefaults(defineProps<{
  tabs: Array<{ label: string; key: string; count?: number }>
  ariaLabel?: string
}>(), {
  ariaLabel: 'Filter results',
})

const items = computed<MbTabItem[]>(() =>
  props.tabs.map((tab) => ({
    id: tab.key,
    label: tab.label,
    badge: tab.count != null && tab.count > 0 ? tab.count : undefined,
  })),
)
</script>

<template>
  <MbTabs
    v-model="model"
    class="mp-filter-tabs mb-4"
    variant="pill"
    :items="items"
    :aria-label="ariaLabel"
  />
</template>
