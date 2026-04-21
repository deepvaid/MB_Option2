<script setup lang="ts">
import type { MbPageHeaderProps } from './MbPageHeader.types';

withDefaults(defineProps<MbPageHeaderProps>(), {
  size: 'sm',
  align: 'start',
  eyebrow: undefined,
  subtitle: undefined,
  breadcrumbs: () => [],
});
</script>

<template>
  <header class="mb-page-header" :data-size="size" :data-align="align">
    <div class="mb-page-header__row">
      <div class="mb-page-header__text">
        <span v-if="eyebrow" class="mb-page-header__eyebrow">{{ eyebrow }}</span>
        <h1 class="mb-page-header__title">{{ title }}</h1>
        <p v-if="subtitle" class="mb-page-header__subtitle">{{ subtitle }}</p>
        <slot name="meta" />
      </div>

      <div v-if="$slots.actions" class="mb-page-header__actions">
        <slot name="actions" />
      </div>
    </div>

    <div v-if="$slots.default" class="mb-page-header__aside">
      <slot />
    </div>
  </header>
</template>

<style scoped>
.mb-page-header {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-block: 24px 28px;
}

.mb-page-header[data-align='center'] {
  text-align: center;
  align-items: center;
}

.mb-page-header__crumbs {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  font-size: var(--mb-font-size-sm);
  color: var(--mb-color-text-muted);
}

.mb-page-header__crumb {
  color: var(--mb-color-text-muted);
  text-decoration: none;
  transition: color 0.15s ease;
}

.mb-page-header__crumb:hover {
  color: var(--mb-color-primary);
}

.mb-page-header__crumb--last {
  color: var(--mb-color-text);
  font-weight: var(--mb-font-weight-medium);
}

.mb-page-header__crumb-sep {
  color: var(--mb-color-text-soft);
  opacity: 0.64;
}

.mb-page-header__row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
}

.mb-page-header[data-align='center'] .mb-page-header__row {
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.mb-page-header__text {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  flex: 1 1 auto;
}

.mb-page-header__eyebrow {
  font-size: var(--mb-font-size-xs);
  font-weight: var(--mb-font-weight-semibold);
  letter-spacing: var(--mb-letter-spacing-eyebrow);
  text-transform: uppercase;
  color: var(--mb-color-primary);
}

.mb-page-header__title {
  font-family: var(--mb-font-family-base);
  font-size: var(--mb-font-size-display-md);
  line-height: var(--mb-line-height-display);
  letter-spacing: var(--mb-letter-spacing-tighter);
  font-weight: var(--mb-font-weight-bold);
  color: var(--mb-color-text);
  margin: 0;
}

.mb-page-header[data-size='sm'] .mb-page-header__title {
  font-size: var(--mb-font-size-display-sm);
  letter-spacing: var(--mb-letter-spacing-snug);
}

.mb-page-header[data-size='lg'] .mb-page-header__title {
  font-size: var(--mb-font-size-display-lg);
  letter-spacing: var(--mb-letter-spacing-hero);
  font-weight: var(--mb-font-weight-heavy);
}

.mb-page-header__subtitle {
  font-size: var(--mb-font-size-md);
  line-height: 1.5;
  color: var(--mb-color-text-muted);
  max-width: 68ch;
  margin: 0;
}

.mb-page-header__actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
}

.mb-page-header__aside {
  margin-top: 8px;
}
</style>
