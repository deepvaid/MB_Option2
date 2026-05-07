<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
  breadcrumbs?: Array<{ title: string; to?: string; disabled?: boolean }>
  backTo?: any
}>()
</script>

<template>
  <div class="mp-page-header mb-4">
    <div class="mp-page-header__body d-flex align-center justify-space-between">
      <div class="mp-page-header__copy d-flex align-center gap-2">
        <v-btn
          v-if="backTo"
          icon="arrow-left"
          variant="text"
          size="small"
          density="comfortable"
          color="medium-emphasis"
          :to="backTo"
        />
        <div>
          <h1 class="mp-page-title mb-0">{{ title }}</h1>
          <p v-if="subtitle" class="mp-page-subtitle text-medium-emphasis text-body-2 mb-0 mt-0">{{ subtitle }}</p>
        </div>
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
  font-size: clamp(1rem, 1.3vw, 1.125rem);
  line-height: 1.3;
  letter-spacing: 0;
  font-weight: 600;
}

.mp-page-subtitle {
  max-width: 760px;
  line-height: 1.5;
  font-size: 12px;
}

.mp-page-header__copy {
  min-width: 0;
  max-width: 780px;
}
</style>
