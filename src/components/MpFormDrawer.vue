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
      <div class="mp-form-drawer__header d-flex align-center justify-space-between">
        <div class="mp-form-drawer__title-wrap">
          <div :id="titleId" class="mp-form-drawer__title">{{ title }}</div>
          <div v-if="subtitle" class="mp-form-drawer__subtitle">{{ subtitle }}</div>
        </div>
        <v-btn icon="x" variant="tonal" color="surface-variant" size="small" rounded="pill" aria-label="Close form drawer" @click="model = false" />
      </div>

      <div class="mp-form-drawer__content flex-grow-1 overflow-y-auto">
        <slot />
      </div>

      <div v-if="$slots.footer" class="mp-form-drawer__footer d-flex align-center justify-end">
        <slot name="footer" />
      </div>
    </div>
  </v-navigation-drawer>
</template>

<style scoped lang="scss">
.mp-form-drawer {
  border-left-color: var(--mp-border-subtle);
  background: rgb(var(--v-theme-surface));
  border-radius: 16px 0 0 16px !important;
  overflow: hidden !important;
}

.mp-form-drawer__header {
  border-bottom: 1px solid var(--mp-border-subtle);
  padding: 32px 24px 20px;

  :deep(.v-btn--icon) {
    background: rgb(var(--v-theme-surface-variant)) !important;
    height: 28px;
    min-height: 28px;
    width: 28px;
  }

  :deep(.v-btn--icon .v-icon) {
    color: rgba(var(--v-theme-on-surface), 0.55);
    font-size: 16px;
  }
}

.mp-form-drawer__title {
  color: rgb(var(--v-theme-on-surface));
  font-size: 24px;
  font-weight: 500;
  letter-spacing: 0;
  line-height: 32px;
  margin: 0;
}

.mp-form-drawer__subtitle {
  color: rgba(var(--v-theme-on-surface), 0.55);
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  margin: 4px 0 0;
}

.mp-form-drawer__title-wrap {
  min-width: 0;
}

.mp-form-drawer__content {
  padding: 16px 24px 20px;
}

.mp-form-drawer__footer {
  border-top: 1px solid var(--mp-border-subtle);
  padding: 24px;
  gap: 8px;
}
</style>
