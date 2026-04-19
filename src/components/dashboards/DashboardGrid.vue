<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { GridItem, GridLayout } from 'grid-layout-plus'
import MpEmptyState from '@/components/MpEmptyState.vue'
import type { DashboardFilterState, DashboardWidget } from '@/stores/dashboards/types'
import { getDefaultPreset, type WidgetSize } from './widgetSizePresets'
import DashboardWidgetCard from './DashboardWidgetCard.vue'

const props = defineProps<{
  accountId: string
  dashboardId: string
  widgets: DashboardWidget[]
  filters: DashboardFilterState
  editMode: boolean
}>()

const emit = defineEmits<{
  editWidget: [widgetId: string]
  removeWidget: [widgetId: string]
  resizeWidget: [payload: { widgetId: string; size: WidgetSize }]
  updateLayout: [layout: Array<{ i: string; x: number; y: number; w: number; h: number }>]
  addWidget: []
}>()

interface LayoutItem {
  i: string
  x: number
  y: number
  w: number
  h: number
  minW?: number
  minH?: number
}

const layout = ref<LayoutItem[]>([])

function normalizeLayout(items: Array<{ i: string; x: number; y: number; w: number; h: number }>): LayoutItem[] {
  return [...items]
    .map((item) => ({
      i: item.i,
      x: item.x,
      y: item.y,
      w: item.w,
      h: item.h,
    }))
    .sort((left, right) => left.i.localeCompare(right.i))
}

function layoutsMatch(
  left: Array<{ i: string; x: number; y: number; w: number; h: number }>,
  right: Array<{ i: string; x: number; y: number; w: number; h: number }>,
): boolean {
  if (left.length !== right.length) return false

  const normalizedLeft = normalizeLayout(left)
  const normalizedRight = normalizeLayout(right)

  return normalizedLeft.every((item, index) => {
    const comparison = normalizedRight[index]
    return comparison
      && item.i === comparison.i
      && item.x === comparison.x
      && item.y === comparison.y
      && item.w === comparison.w
      && item.h === comparison.h
  })
}

const layoutFromWidgets = computed<LayoutItem[]>(() =>
  props.widgets.map((widget) => {
    const fallback = getDefaultPreset(widget.type)
    return {
      i: widget.id,
      x: widget.layout.x,
      y: widget.layout.y,
      w: widget.layout.w,
      h: widget.layout.h,
      minW: widget.layout.minW ?? fallback.minW,
      minH: widget.layout.minH ?? fallback.minH,
    }
  }),
)

const widgetsById = computed(() => new Map(props.widgets.map((widget) => [widget.id, widget])))

watch(
  layoutFromWidgets,
  (nextLayout) => {
    if (layoutsMatch(layout.value, nextLayout)) return
    layout.value = nextLayout
  },
  { immediate: true, deep: true },
)

function handleLayoutUpdate(nextLayout: Array<{ i: string; x: number; y: number; w: number; h: number }>) {
  if (!props.editMode) return
  if (layoutsMatch(nextLayout, layoutFromWidgets.value)) return
  emit('updateLayout', nextLayout)
}
</script>

<template>
  <div class="dashboard-grid">
    <MpEmptyState
      v-if="widgets.length === 0"
      icon="mdi-view-grid-plus-outline"
      title="This dashboard is empty"
      description="Add a manual widget or ask Da Vinci to create one from your account data."
      action-label="Add widget"
      action-icon="mdi-plus"
      @action="emit('addWidget')"
    />

    <GridLayout
      v-else
      v-model:layout="layout"
      :col-num="12"
      :row-height="40"
      :margin="[12, 12]"
      :is-draggable="editMode"
      :is-resizable="editMode"
      :vertical-compact="true"
      :use-css-transforms="true"
      class="dashboard-grid__layout"
      :class="{ 'dashboard-grid__layout--editing': editMode }"
      @layout-updated="handleLayoutUpdate"
    >
      <GridItem
        v-for="item in layout"
        :key="item.i"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
        :min-w="item.minW"
        :min-h="item.minH"
      >
        <DashboardWidgetCard
          v-if="widgetsById.get(item.i)"
          :account-id="accountId"
          :widget="widgetsById.get(item.i)!"
          :filters="filters"
          :editable="editMode"
          @edit="emit('editWidget', $event)"
          @remove="emit('removeWidget', $event)"
          @resize="emit('resizeWidget', $event)"
        />
      </GridItem>
    </GridLayout>
  </div>
</template>

<style scoped lang="scss">
.dashboard-grid {
  min-height: 280px;
}

.dashboard-grid__layout {
  min-height: 320px;
  position: relative;
  transition: background 160ms ease;
}

.dashboard-grid__layout--editing {
  background-image:
    repeating-linear-gradient(
      to right,
      rgba(var(--v-theme-primary), 0.08) 0,
      rgba(var(--v-theme-primary), 0.08) 1px,
      transparent 1px,
      transparent calc(100% / 12)
    );
  border-radius: 12px;
}

.dashboard-grid :deep(.vgl-item) {
  display: flex;
}

.dashboard-grid :deep(.vgl-item > *:not(.vgl-item__resizer)) {
  width: 100%;
  height: 100%;
}

.dashboard-grid :deep(.vgl-item--placeholder) {
  background: rgba(var(--v-theme-primary), 0.1) !important;
  border: 2px dashed rgba(var(--v-theme-primary), 0.55) !important;
  border-radius: 12px !important;
  opacity: 1 !important;
  transition: transform 120ms ease, width 120ms ease, height 120ms ease;
}

.dashboard-grid :deep(.vgl-item.vgl-item--dragging),
.dashboard-grid :deep(.vgl-item.vgl-item--resizing) {
  z-index: 3;
  cursor: grabbing;
}

.dashboard-grid :deep(.vgl-item.vgl-item--dragging) .dashboard-widget-card,
.dashboard-grid :deep(.vgl-item.vgl-item--resizing) .dashboard-widget-card {
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.18);
  border-color: rgb(var(--v-theme-primary));
  border-style: solid;
}

.dashboard-grid :deep(.vgl-item__resizer) {
  display: none;
}

.dashboard-grid__layout--editing :deep(.vgl-item__resizer) {
  display: block;
  position: absolute;
  right: 0;
  bottom: 0;
  width: 24px;
  height: 24px;
  cursor: nwse-resize;
  z-index: 4;
  background-color: transparent;
  background-repeat: no-repeat;
  background-position: bottom 5px right 5px;
  background-size: 12px 12px;
  background-image: linear-gradient(
    135deg,
    transparent 0,
    transparent 33%,
    rgba(var(--v-theme-on-surface), 0.45) 33%,
    rgba(var(--v-theme-on-surface), 0.45) 38%,
    transparent 38%,
    transparent 66%,
    rgba(var(--v-theme-on-surface), 0.45) 66%,
    rgba(var(--v-theme-on-surface), 0.45) 71%,
    transparent 71%
  );
  transition: background-color 120ms ease;
}

.dashboard-grid__layout--editing :deep(.vgl-item__resizer:hover) {
  background-color: rgba(var(--v-theme-primary), 0.12);
  background-image: linear-gradient(
    135deg,
    transparent 0,
    transparent 33%,
    rgb(var(--v-theme-primary)) 33%,
    rgb(var(--v-theme-primary)) 38%,
    transparent 38%,
    transparent 66%,
    rgb(var(--v-theme-primary)) 66%,
    rgb(var(--v-theme-primary)) 71%,
    transparent 71%
  );
}
</style>
