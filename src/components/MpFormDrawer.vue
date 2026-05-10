<script setup lang="ts">
import { MbDrawer } from '@marobase/ui'

const model = defineModel<boolean>({ default: false })

withDefaults(defineProps<{
  title: string
  subtitle?: string
  width?: number
}>(), {
  width: 480,
})
</script>

<template>
  <div class="mp-form-drawer-host">
    <MbDrawer
      v-model="model"
      :title="title"
      :subtitle="subtitle"
      :width="width"
      :show-backdrop="true"
      :close-on-backdrop="true"
      :dismissible="true"
      :show-footer="Boolean($slots.footer)"
      aria-label="Side panel"
    >
      <slot />
      <template v-if="$slots.footer" #footer>
        <div class="mp-form-drawer__footer-inner d-flex align-center justify-end ga-2">
          <slot name="footer" />
        </div>
      </template>
    </MbDrawer>
  </div>
</template>

<style scoped>
.mp-form-drawer-host :deep(.mb-drawer) {
  position: fixed;
  inset: 0;
  z-index: 2005;
  align-items: stretch;
}

.mp-form-drawer-host :deep(.mb-drawer__panel) {
  height: 100vh;
  max-height: 100vh;
}

.mp-form-drawer__footer-inner {
  width: 100%;
}
</style>
