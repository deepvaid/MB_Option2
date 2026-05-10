<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  DASHBOARD_ACCENT_OPTIONS,
  DASHBOARD_ICON_OPTIONS,
  accentToVuetifyColor,
} from './dashboardOptions'
import type { DashboardAccent } from '@/stores/dashboards/types'
import { useDashboardsStore } from '@/stores/useDashboards'

const model = defineModel<boolean>({ default: false })

const props = defineProps<{
  accountId: string
}>()

const emit = defineEmits<{
  created: [dashboardId: string]
}>()

const dashboardsStore = useDashboardsStore()

const name = ref('')
const description = ref('')
const icon = ref<string>('grid-2x2-plus')
const accent = ref<DashboardAccent>('primary')

watch(model, (isOpen) => {
  if (!isOpen) return
  name.value = ''
  description.value = ''
  icon.value = 'grid-2x2-plus'
  accent.value = 'primary'
})

const trimmedName = computed(() => name.value.trim())
const nameError = computed(() => {
  if (!trimmedName.value) return ''
  if (trimmedName.value.length > 60) return 'Name must be 60 characters or fewer'
  return ''
})
const canCreate = computed(() => Boolean(trimmedName.value) && !nameError.value && description.value.length <= 240)
const previewColor = computed(() => accentToVuetifyColor(accent.value))

function close() {
  model.value = false
}

function create() {
  if (!canCreate.value) return
  const dashboard = dashboardsStore.createDashboard(props.accountId, trimmedName.value, {
    description: description.value.trim(),
    icon: icon.value,
    accent: accent.value,
  })
  if (!dashboard) return
  emit('created', dashboard.id)
  close()
}
</script>

<template>
  <v-dialog v-model="model" max-width="560" persistent scrollable>
    <v-card flat rounded="xl" color="surface" class="create-dashboard-dialog">
      <v-card-title class="d-flex align-center ga-3 pa-5">
        <v-avatar size="44" variant="tonal" :color="previewColor">
          <v-icon>{{ icon }}</v-icon>
        </v-avatar>
        <div class="flex-grow-1 min-width-0">
          <div class="text-overline text-medium-emphasis">New dashboard</div>
          <div class="text-h6 font-weight-bold">{{ trimmedName || 'Untitled dashboard' }}</div>
        </div>
        <v-btn icon="x" variant="text" size="small" aria-label="Close" @click="close" />
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-5 d-flex flex-column ga-5">
        <v-text-field
          v-model="name"
          label="Dashboard name"
          placeholder="e.g. Lifecycle Health"
          :error-messages="nameError ? [nameError] : []"
          counter="60"
          autofocus
          density="comfortable"
          @keydown.enter="create"
        />

        <v-textarea
          v-model="description"
          label="Description"
          placeholder="Optional. What does this dashboard answer?"
          counter="240"
          rows="2"
          auto-grow
          density="comfortable"
        />

        <div>
          <div class="text-subtitle-2 font-weight-bold mb-2">Accent color</div>
          <div class="create-dashboard-dialog__swatches">
            <button
              v-for="option in DASHBOARD_ACCENT_OPTIONS"
              :key="option.value"
              type="button"
              class="create-dashboard-dialog__swatch"
              :class="{ 'create-dashboard-dialog__swatch--active': accent === option.value }"
              :aria-label="`Use ${option.label} accent`"
              :aria-pressed="accent === option.value"
              @click="accent = option.value"
            >
              <v-avatar size="32" variant="tonal" :color="option.vuetifyColor">
                <v-icon size="18">palette</v-icon>
              </v-avatar>
              <span class="text-caption">{{ option.label }}</span>
            </button>
          </div>
        </div>

        <div>
          <div class="text-subtitle-2 font-weight-bold mb-2">Icon</div>
          <div class="create-dashboard-dialog__icons">
            <button
              v-for="option in DASHBOARD_ICON_OPTIONS"
              :key="option.icon"
              type="button"
              class="create-dashboard-dialog__icon"
              :class="{ 'create-dashboard-dialog__icon--active': icon === option.icon }"
              :aria-label="`Use ${option.label} icon`"
              :aria-pressed="icon === option.icon"
              @click="icon = option.icon"
            >
              <v-icon size="22">{{ option.icon }}</v-icon>
            </button>
          </div>
        </div>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn variant="text" class="text-none" @click="close">Cancel</v-btn>
        <v-btn color="primary" variant="flat" class="text-none" :disabled="!canCreate" @click="create">
          Create dashboard
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss">
.create-dashboard-dialog__swatches {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.create-dashboard-dialog__swatch {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 12px;
  cursor: pointer;
  font: inherit;
  color: inherit;
  transition: border-color 120ms ease, background 120ms ease;
}

.create-dashboard-dialog__swatch:hover {
  background: rgba(var(--v-theme-on-surface), 0.04);
}

.create-dashboard-dialog__swatch--active {
  border-color: rgba(var(--v-theme-primary), 0.4);
  background: rgba(var(--v-theme-primary), 0.06);
}

.create-dashboard-dialog__icons {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(48px, 1fr));
  gap: 8px;
}

.create-dashboard-dialog__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  background: rgba(var(--v-theme-on-surface), 0.02);
  border: 1px solid var(--mp-border-subtle);
  border-radius: 12px;
  cursor: pointer;
  color: rgba(var(--v-theme-on-surface), 0.78);
  transition: border-color 120ms ease, background 120ms ease, color 120ms ease;
}

.create-dashboard-dialog__icon:hover {
  border-color: rgba(var(--v-theme-primary), 0.32);
  color: rgb(var(--v-theme-primary));
}

.create-dashboard-dialog__icon--active {
  border-color: rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-primary), 0.1);
  color: rgb(var(--v-theme-primary));
}
</style>
