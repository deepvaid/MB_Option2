<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { DashboardChartVariant, DashboardWidgetDraft, DashboardWidgetType } from '@/stores/dashboards/types'

const props = defineProps<{
  modelValue: boolean
  draft: DashboardWidgetDraft
  sourceLabel: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  apply: [payload: { title: string; type: DashboardWidgetType; chartVariant?: DashboardChartVariant }]
}>()

type TileType = 'kpi' | 'bar' | 'line' | 'area' | 'pie' | 'table' | 'scatter' | 'funnel'

interface Tile {
  type: TileType
  label: string
  icon: string
}

const TILES: Tile[] = [
  { type: 'kpi', label: 'KPI', icon: 'layout-grid' },
  { type: 'bar', label: 'Bar', icon: 'bar-chart-3' },
  { type: 'line', label: 'Line', icon: 'line-chart' },
  { type: 'area', label: 'Area', icon: 'area-chart' },
  { type: 'pie', label: 'Donut', icon: 'pie-chart' },
  { type: 'table', label: 'Table', icon: 'table' },
  { type: 'scatter', label: 'Scatter', icon: 'scatter-chart' },
  { type: 'funnel', label: 'Funnel', icon: 'filter' },
]

function inferTile(draft: DashboardWidgetDraft): TileType {
  switch (draft.type) {
    case 'kpi':
      return 'kpi'
    case 'bar':
      return 'bar'
    case 'pie':
      return 'pie'
    case 'table':
      return 'table'
    case 'activity':
      return 'table'
    case 'timeseries':
      return draft.chartVariant === 'area' ? 'area' : 'line'
    default:
      return 'kpi'
  }
}

function tileToWidgetType(tile: TileType): { type: DashboardWidgetType; chartVariant?: DashboardChartVariant } {
  switch (tile) {
    case 'kpi':
      return { type: 'kpi' }
    case 'bar':
      return { type: 'bar' }
    case 'line':
      return { type: 'timeseries', chartVariant: 'line' }
    case 'area':
      return { type: 'timeseries', chartVariant: 'area' }
    case 'pie':
      return { type: 'pie' }
    case 'table':
      return { type: 'table' }
    case 'scatter':
      return { type: 'timeseries', chartVariant: 'line' }
    case 'funnel':
      return { type: 'bar' }
  }
}

const localOpen = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

const name = ref(props.draft.title ?? '')
const selectedTile = ref<TileType>(inferTile(props.draft))

watch(
  () => [props.modelValue, props.draft] as const,
  ([open]) => {
    if (open) {
      name.value = props.draft.title ?? ''
      selectedTile.value = inferTile(props.draft)
    }
  },
  { immediate: true },
)

function handleApply() {
  const mapped = tileToWidgetType(selectedTile.value)
  emit('apply', {
    title: name.value.trim() || props.draft.title || 'Widget draft',
    type: mapped.type,
    chartVariant: mapped.chartVariant,
  })
}

function close() {
  emit('update:modelValue', false)
}
</script>

<template>
  <v-dialog v-model="localOpen" max-width="480" scrollable>
    <v-card flat border rounded="lg" class="dv-refine">
      <header class="dv-refine__head">
        <v-icon color="primary" size="18">sparkles</v-icon>
        <div class="dv-refine__head-text">
          <div class="dv-refine__title">Refine draft</div>
          <div class="dv-refine__sub">Adjust the metric, name, or how it&rsquo;s visualised</div>
        </div>
        <v-btn icon size="32" variant="text" aria-label="Close" @click="close">
          <v-icon size="16">x</v-icon>
        </v-btn>
      </header>

      <div class="dv-refine__body">
        <div class="dv-refine__row">
          <label class="dv-eyebrow" for="dv-refine-name">Widget name</label>
          <v-text-field
            id="dv-refine-name"
            v-model="name"
            variant="outlined"
            density="comfortable"
            hide-details
            single-line
          />
        </div>

        <div class="dv-refine__row">
          <span class="dv-eyebrow">Visualisation</span>
          <div class="dv-refine__tiles">
            <button
              v-for="tile in TILES"
              :key="tile.type"
              type="button"
              class="dv-refine__tile"
              :class="{ 'is-selected': selectedTile === tile.type }"
              @click="selectedTile = tile.type"
            >
              <v-icon size="22">{{ tile.icon }}</v-icon>
              <span class="dv-refine__tile-label">{{ tile.label }}</span>
            </button>
          </div>
        </div>

        <div class="dv-refine__row">
          <span class="dv-eyebrow">Source</span>
          <div class="dv-refine__source">
            <v-icon color="primary" size="16">database</v-icon>
            <span>{{ sourceLabel }}</span>
          </div>
        </div>
      </div>

      <v-divider />

      <footer class="dv-refine__foot">
        <v-btn variant="outlined" class="text-none" @click="close">Cancel</v-btn>
        <v-btn color="primary" variant="flat" class="text-none" @click="handleApply">
          <v-icon size="16" start>check</v-icon>
          Apply changes
        </v-btn>
      </footer>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss">
.dv-eyebrow {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: rgb(var(--v-theme-on-surface-variant));
  display: block;
  margin-bottom: 8px;
}

.dv-refine {
  background: rgb(var(--v-theme-surface));
  border-radius: 14px !important;
  overflow: hidden;
}

.dv-refine__head {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid rgb(var(--v-theme-outline-variant));
}

.dv-refine__head-text {
  flex: 1;
}

.dv-refine__title {
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.1px;
  color: rgb(var(--v-theme-on-surface));
  line-height: 1.2;
}

.dv-refine__sub {
  font-size: 12.5px;
  font-weight: 400;
  color: rgb(var(--v-theme-on-surface-variant));
  margin-top: 2px;
  line-height: 1.3;
}

.dv-refine__body {
  padding: 20px;
  overflow-y: auto;
}

.dv-refine__row {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 18px;
}

.dv-refine__row:last-child {
  margin-bottom: 0;
}

.dv-refine__tiles {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.dv-refine__tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px 8px;
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgb(var(--v-theme-outline-variant));
  border-radius: 10px;
  cursor: pointer;
  color: rgb(var(--v-theme-on-surface));
  transition: border-color 120ms ease, background 120ms ease, color 120ms ease;
}

.dv-refine__tile :deep(.v-icon) {
  color: rgb(var(--v-theme-on-surface-variant));
  transition: color 120ms ease;
}

.dv-refine__tile:hover {
  background: rgb(var(--v-theme-surface-variant));
  border-color: rgb(var(--v-theme-outline));
}

.dv-refine__tile.is-selected {
  border-color: rgb(var(--v-theme-primary));
  background: rgb(var(--v-theme-primary-container, var(--v-theme-primary)));
}

.dv-refine__tile.is-selected,
.dv-refine__tile.is-selected :deep(.v-icon) {
  color: rgb(var(--v-theme-on-primary-container, var(--v-theme-on-primary)));
}

.dv-refine__tile-label {
  font-size: 12px;
  font-weight: 500;
}

.dv-refine__source {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: rgb(var(--v-theme-surface-variant));
  border-radius: 8px;
  font-size: 12.5px;
  font-weight: 500;
  line-height: 1.3;
  color: rgb(var(--v-theme-on-surface));
}

.dv-refine__foot {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 16px;
  background: rgb(var(--v-theme-surface-light, var(--v-theme-surface)));
}
</style>
