<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import type { RouteLocationRaw } from 'vue-router'
import { MbBreadcrumbs, MbPageHeader } from '@marobase/ui'
import type { MbBreadcrumbItem } from '@marobase/ui'

const props = defineProps<{
  title: string
  subtitle?: string
  breadcrumbs?: Array<{ title: string; to?: string | Record<string, unknown>; disabled?: boolean }>
  backTo?: string | Record<string, unknown>
}>()

const router = useRouter()

const crumbItems = computed<MbBreadcrumbItem[]>(() =>
  (props.breadcrumbs ?? []).map((c, index) => ({
    id: `mp-crumb-${index}`,
    label: c.title,
    disabled: c.disabled,
  })),
)

const activeCrumbId = computed(() => {
  const items = crumbItems.value
  if (!items.length) {
    return ''
  }
  return items[items.length - 1]?.id ?? ''
})

function onCrumbNavigate(payload: { item: MbBreadcrumbItem; index: number }) {
  const raw = props.breadcrumbs?.[payload.index]
  if (!raw || raw.disabled || raw.to == null) {
    return
  }
  router.push(raw.to as RouteLocationRaw)
}
</script>

<template>
  <div class="mp-page-header mb-4">
    <div class="mp-page-header__top d-flex align-start ga-3">
      <RouterLink
        v-if="backTo"
        v-slot="{ href, navigate }"
        :to="backTo"
        custom
      >
        <a
          class="mp-page-header__back text-medium-emphasis"
          :href="href"
          aria-label="Back"
          @click.prevent="navigate"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M15 6L9 12L15 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </a>
      </RouterLink>

      <div class="mp-page-header__main min-width-0 flex-grow-1">
        <MbBreadcrumbs
          v-if="crumbItems.length"
          class="mp-page-header__crumbs mb-2"
          :items="crumbItems"
          :model-value="activeCrumbId"
          aria-label="Breadcrumb"
          @navigate="onCrumbNavigate"
        />
        <MbPageHeader :title="title" :subtitle="subtitle" size="sm">
          <template v-if="$slots.actions" #actions>
            <slot name="actions" />
          </template>
        </MbPageHeader>
      </div>
    </div>
  </div>

  <slot name="tabs" />
</template>

<style scoped>
.mp-page-header__back {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 6px;
  flex-shrink: 0;
  border-radius: 999px;
  padding: 6px;
  text-decoration: none;
  color: var(--mb-color-text-muted, rgba(0, 0, 0, 0.55));
}

.mp-page-header__back:hover {
  background: var(--mb-color-surface-subtle, rgba(0, 0, 0, 0.06));
  color: var(--mb-color-text, inherit);
}

.mp-page-header__crumbs :deep(.mb-bc) {
  font-size: var(--mb-font-size-sm, 0.875rem);
}
</style>
