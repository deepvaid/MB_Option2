<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
  breadcrumbs?: Array<{ title: string; to?: string; disabled?: boolean }>
}>()
</script>

<template>
  <div class="mp-page-header mb-6">
    <div class="mp-page-header__body d-flex align-center justify-space-between">
      <div class="mp-page-header__copy">
        <h1 class="mp-page-title mb-0">{{ title }}</h1>
        <p v-if="subtitle" class="mp-page-subtitle text-medium-emphasis text-body-2 mb-0 mt-1">{{ subtitle }}</p>
      </div>
      <div v-if="$slots.actions" class="mp-page-header__actions d-flex gap-2 align-center flex-shrink-0">
        <slot name="actions" />
      </div>
    </div>
  </div>

  <slot name="tabs" />
</template>

<style scoped lang="scss">
.mp-page-title {
  font-size: clamp(1.45rem, 2vw, 1.85rem);
  line-height: 1.2;
  letter-spacing: 0;
  font-weight: 700;
}

.mp-page-subtitle {
  max-width: 760px;
  line-height: 1.5;
}

.mp-page-header__copy {
  min-width: 0;
  max-width: 780px;
}
</style>
