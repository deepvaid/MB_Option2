<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
  breadcrumbs?: Array<{ title: string; to?: string; disabled?: boolean }>
}>()
</script>

<template>
  <div class="mp-page-header mb-8">
    <!-- Breadcrumbs -->
    <nav v-if="breadcrumbs?.length" class="mp-breadcrumbs d-flex align-center gap-1 mb-3">
      <template v-for="(crumb, i) in breadcrumbs" :key="i">
        <router-link
          v-if="crumb.to && !crumb.disabled"
          :to="crumb.to"
          class="mp-breadcrumb-link text-caption font-weight-medium text-decoration-none"
        >{{ crumb.title }}</router-link>
        <span
          v-else
          class="text-caption font-weight-medium text-disabled"
        >{{ crumb.title }}</span>
        <v-icon v-if="i < breadcrumbs.length - 1" size="12" color="medium-emphasis" class="mx-1">mdi-chevron-right</v-icon>
      </template>
    </nav>

    <!-- Header row -->
    <div class="mp-page-header__body d-flex align-start justify-space-between pb-5">
      <div class="mp-page-header__copy">
        <h1 class="mp-page-title font-weight-bold mb-0">{{ title }}</h1>
        <p v-if="subtitle" class="mp-page-subtitle text-medium-emphasis text-body-2 mb-0 mt-2">{{ subtitle }}</p>
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
  font-size: clamp(2.1rem, 3vw, 2.7rem);
  letter-spacing: -0.045em;
  line-height: $mp-typography-lineHeight-tight;
}

.mp-page-subtitle {
  max-width: 760px;
  line-height: 1.6;
}

.mp-page-header__body {
  border-bottom: 1px solid var(--mp-border-subtle);
  padding-bottom: 28px;
}

.mp-page-header__copy {
  min-width: 0;
  max-width: 780px;
}

.mp-page-header__actions {
  padding-top: 6px;
}

.mp-breadcrumb-link {
  color: rgba(var(--v-theme-on-surface), 0.56);
  transition: color $mp-transition-fast;
}
.mp-breadcrumb-link:hover {
  color: rgb(var(--v-theme-secondary));
  text-decoration: underline !important;
}

.border-b {
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
</style>
