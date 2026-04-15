<script setup lang="ts">
const model = defineModel<string>({ required: true })

withDefaults(defineProps<{
  tabs: Array<{ label: string; key: string; count?: number }>
  ariaLabel?: string
}>(), {
  ariaLabel: 'Filter results',
})
</script>

<template>
  <v-tabs
    v-model="model"
    :aria-label="ariaLabel"
    density="compact"
    class="mp-filter-tabs mb-4"
    height="46"
    show-arrows
  >
    <v-tab
      v-for="tab in tabs"
      :key="tab.key"
      :value="tab.key"
      :ripple="false"
      class="text-none font-weight-medium px-4 mp-filter-tab"
    >
      {{ tab.label }}
      <v-chip
        v-if="tab.count != null && tab.count > 0"
        size="x-small"
        :color="model === tab.key ? 'primary' : 'surface-variant'"
        :variant="model === tab.key ? 'flat' : 'tonal'"
        class="ml-2 font-weight-bold"
      >{{ tab.count }}</v-chip>
    </v-tab>
  </v-tabs>
</template>

<style scoped lang="scss">
.mp-filter-tabs {
  position: relative;
  padding-bottom: 2px;
}

:deep(.mp-filter-tabs .v-tabs-bar) {
  min-height: 46px;
}

:deep(.mp-filter-tabs .v-tab__slider) {
  display: none;
}

:deep(.mp-filter-tab.v-tab) {
  min-width: 0;
  margin-right: 10px;
  border: 1px solid var(--mp-border-subtle);
  border-radius: 999px;
  background: rgb(var(--v-theme-surface));
  color: rgba(var(--v-theme-on-surface), 0.76);
  letter-spacing: 0;
  opacity: 1;
  transition: background $mp-transition-fast, border-color $mp-transition-fast, color $mp-transition-fast, box-shadow $mp-transition-fast;
}

:deep(.mp-filter-tab .v-btn__content) {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: inherit;
  font-weight: 600;
  opacity: 1;
}

:deep(.mp-filter-tab.v-tab:hover:not(.v-tab--selected)) {
  background: rgba(var(--v-theme-surface-variant), 0.88);
  border-color: rgba(var(--v-theme-primary), 0.18);
  color: rgb(var(--v-theme-secondary));
}

:deep(.mp-filter-tab.v-tab--selected),
:deep(.mp-filter-tab.v-btn--active),
:deep(.mp-filter-tab.v-slide-group-item--active) {
  background: rgb(var(--v-theme-primary));
  border-color: rgba(var(--v-theme-primary-darken-1), 0.2);
  color: rgb(var(--v-theme-on-primary));
}

:deep(.mp-filter-tab.v-tab--selected:hover),
:deep(.mp-filter-tab.v-btn--active:hover),
:deep(.mp-filter-tab.v-slide-group-item--active:hover) {
  background: rgb(var(--v-theme-primary-darken-1));
  color: rgb(var(--v-theme-on-primary));
}

:deep(.mp-filter-tab.v-tab:focus-visible) {
  outline: none;
  box-shadow: 0 0 0 3px rgba(var(--v-theme-primary), 0.2);
}

:deep(.mp-filter-tab.v-tab--selected .v-btn__content),
:deep(.mp-filter-tab.v-btn--active .v-btn__content),
:deep(.mp-filter-tab.v-slide-group-item--active .v-btn__content) {
  color: rgb(var(--v-theme-on-primary)) !important;
}

:deep(.mp-filter-tab.v-tab--selected .v-chip),
:deep(.mp-filter-tab.v-btn--active .v-chip),
:deep(.mp-filter-tab.v-slide-group-item--active .v-chip) {
  background: rgba(var(--v-theme-on-primary), 0.14) !important;
  color: rgb(var(--v-theme-on-primary)) !important;
}

:deep(.mp-filter-tab .v-chip) {
  box-shadow: none;
}
</style>
