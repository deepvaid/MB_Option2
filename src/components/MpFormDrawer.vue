<script setup lang="ts">
import { useId } from 'vue'

const model = defineModel<boolean>({ default: false })

withDefaults(defineProps<{
  title: string
  subtitle?: string
  width?: number
}>(), {
  width: 480,
})

const titleId = useId()
</script>

<template>
  <v-navigation-drawer
    v-model="model"
    location="right"
    temporary
    :width="width"
    :aria-labelledby="titleId"
    elevation="0"
    border
    rounded="xl"
    floating
    class="mp-form-drawer"
  >
    <div class="d-flex flex-column h-100">
      <div class="mp-form-drawer__header pa-5 d-flex align-center justify-space-between">
        <div class="mp-form-drawer__title-wrap">
          <div class="mp-form-drawer__eyebrow mb-1">Form workspace</div>
          <div :id="titleId" class="text-h6 font-weight-bold">{{ title }}</div>
          <div v-if="subtitle" class="text-caption text-medium-emphasis mt-1">{{ subtitle }}</div>
        </div>
        <v-btn icon="x" variant="tonal" color="surface-variant" size="small" aria-label="Close form drawer" @click="model = false" />
      </div>

      <div class="pa-5 flex-grow-1 overflow-y-auto">
        <slot />
      </div>

      <div v-if="$slots.footer" class="mp-form-drawer__footer pa-5 d-flex justify-space-between">
        <slot name="footer" />
      </div>
    </div>
  </v-navigation-drawer>
</template>

<style scoped lang="scss">
.mp-form-drawer {
  border-left-color: var(--mp-border-subtle);
  background: rgb(var(--v-theme-surface));
}

.mp-form-drawer__header {
  border-bottom: 1px solid var(--mp-border-subtle);
  background: linear-gradient(180deg, rgba(var(--v-theme-primary), 0.04), rgba(var(--v-theme-surface), 1));
}

.mp-form-drawer__eyebrow {
  font-size: var(--mp-typography-fontSize-xs);
  font-weight: var(--mp-typography-fontWeight-bold);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(var(--v-theme-on-surface), 0.55);
}

.mp-form-drawer__title-wrap {
  min-width: 0;
}

.mp-form-drawer__footer {
  border-top: 1px solid var(--mp-border-subtle);
  background: rgba(var(--v-theme-surface-variant), 0.28);
}
</style>
