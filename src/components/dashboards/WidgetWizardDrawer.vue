<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import MpFormDrawer from '@/components/MpFormDrawer.vue'
import { getMetricDescriptor } from '@/stores/dashboards/metricCatalog'
import type {
  DashboardComparisonMode,
  DashboardDataSource,
  DashboardDatePreset,
  DashboardMetricId,
  DashboardWidgetDraft,
  DashboardWidgetType,
} from '@/stores/dashboards/types'
import { useDashboardsStore } from '@/stores/useDashboards'
import WidgetWizardModeChooser from './wizard/WidgetWizardModeChooser.vue'
import WidgetWizardManualSteps, { type ManualStep } from './wizard/WidgetWizardManualSteps.vue'
import WidgetWizardDaVinciStep from './wizard/WidgetWizardDaVinciStep.vue'

type WizardMode = 'choose' | 'manual' | 'davinci'

const MANUAL_STEP_ORDER: ManualStep[] = ['source', 'metric', 'visualization', 'name']

const model = defineModel<boolean>({ default: false })

const props = defineProps<{
  accountId: string
  dashboardId: string
  dashboardFilters: { preset: DashboardDatePreset; comparison: DashboardComparisonMode }
  initialDraft?: DashboardWidgetDraft | null
  defaultMode?: WizardMode
}>()

const dashboardsStore = useDashboardsStore()

const mode = ref<WizardMode>('choose')
const manualStep = ref<ManualStep>('source')
const source = ref<DashboardDataSource | null>(null)
const metricId = ref<DashboardMetricId | null>(null)
const widgetType = ref<DashboardWidgetType | null>(null)
const widgetTitle = ref('')
const davinciDraft = ref<DashboardWidgetDraft | null>(null)

const isEditing = computed(() => Boolean(props.initialDraft?.widgetId))
const drawerTitle = computed(() => {
  if (isEditing.value) return 'Edit Widget'
  if (mode.value === 'davinci') return 'New Widget · Da Vinci'
  if (mode.value === 'manual') return 'New Widget · Manual'
  return 'Add Widget'
})
const drawerSubtitle = computed(() => {
  if (mode.value === 'davinci') return 'Describe what you need and review the draft before placing it.'
  if (mode.value === 'manual') return 'Pick a source, metric, and visualization step by step.'
  return 'Build a widget your way and place it on the active dashboard.'
})

const descriptor = computed(() => (metricId.value ? getMetricDescriptor(metricId.value) : undefined))

function resetState() {
  mode.value = props.defaultMode ?? 'choose'
  manualStep.value = 'source'
  source.value = null
  metricId.value = null
  widgetType.value = null
  widgetTitle.value = ''
  davinciDraft.value = null
}

function applyDraft(draft: DashboardWidgetDraft) {
  source.value = draft.dataSource
  metricId.value = draft.metricId
  widgetType.value = draft.type
  widgetTitle.value = draft.title
}

function initializeFromProps() {
  resetState()
  const draft = props.initialDraft
  if (!draft) return

  if (draft.widgetId) {
    mode.value = 'manual'
    manualStep.value = 'name'
    applyDraft(draft)
    return
  }

  if (draft.aiProvenance) {
    mode.value = 'davinci'
    davinciDraft.value = draft
    applyDraft(draft)
    return
  }

  mode.value = 'manual'
  manualStep.value = 'name'
  applyDraft(draft)
}

watch(
  [model, () => props.initialDraft, () => props.dashboardId, () => props.defaultMode],
  ([isOpen]) => {
    if (isOpen) initializeFromProps()
  },
  { immediate: true, deep: true },
)

const stepperItems = computed(() => {
  if (mode.value === 'choose') {
    return [
      { label: 'Pick how to build', state: 'active' },
    ]
  }
  if (mode.value === 'davinci') {
    return [
      { label: 'Describe', state: davinciDraft.value ? 'complete' : 'active' },
      { label: 'Review draft', state: davinciDraft.value ? 'active' : 'pending' },
    ]
  }
  return MANUAL_STEP_ORDER.map((step) => {
    const labels: Record<ManualStep, string> = {
      source: 'Source',
      metric: 'Metric',
      visualization: 'Visualization',
      name: 'Name & preview',
    }
    let state: 'pending' | 'active' | 'complete' = 'pending'
    const currentIndex = MANUAL_STEP_ORDER.indexOf(manualStep.value)
    const stepIndex = MANUAL_STEP_ORDER.indexOf(step)
    if (stepIndex < currentIndex) state = 'complete'
    else if (stepIndex === currentIndex) state = 'active'
    return { label: labels[step], state }
  })
})

function chooseMode(next: 'manual' | 'davinci') {
  mode.value = next
  if (next === 'manual') manualStep.value = 'source'
}

function goBack() {
  if (mode.value === 'choose') return
  if (mode.value === 'davinci') {
    if (davinciDraft.value) {
      davinciDraft.value = null
      return
    }
    if (!isEditing.value) {
      mode.value = 'choose'
    }
    return
  }
  // manual
  const currentIndex = MANUAL_STEP_ORDER.indexOf(manualStep.value)
  if (currentIndex <= 0) {
    if (!isEditing.value) mode.value = 'choose'
    return
  }
  let prevStep = MANUAL_STEP_ORDER[currentIndex - 1] ?? 'source'
  if (prevStep === 'visualization' && (descriptor.value?.supportedWidgetTypes.length ?? 0) <= 1) {
    prevStep = 'metric'
  }
  manualStep.value = prevStep
}

function close() {
  model.value = false
}

watch(model, (isOpen) => {
  if (!isOpen) {
    dashboardsStore.closeWidgetEditor()
  }
})

function persistDraft(): boolean {
  if (!source.value || !metricId.value || !widgetType.value || !descriptor.value) return false
  const draft: DashboardWidgetDraft = {
    dashboardId: props.dashboardId,
    widgetId: props.initialDraft?.widgetId,
    type: widgetType.value,
    title: widgetTitle.value.trim() || descriptor.value.defaultTitle,
    dataSource: source.value,
    metricId: metricId.value,
    drilldown: descriptor.value.drilldown,
    aiProvenance: davinciDraft.value?.aiProvenance ?? props.initialDraft?.aiProvenance,
  }

  if (props.initialDraft?.widgetId) {
    dashboardsStore.updateWidget(props.accountId, draft)
  } else {
    dashboardsStore.addWidget(props.accountId, draft)
  }
  return true
}

function manualPrimaryAction() {
  if (manualStep.value !== 'name') {
    const currentIndex = MANUAL_STEP_ORDER.indexOf(manualStep.value)
    let next = MANUAL_STEP_ORDER[currentIndex + 1] ?? 'name'
    if (next === 'visualization' && (descriptor.value?.supportedWidgetTypes.length ?? 0) <= 1) {
      next = 'name'
    }
    manualStep.value = next
    return
  }
  if (persistDraft()) close()
}

const manualPrimaryDisabled = computed(() => {
  if (manualStep.value === 'source') return !source.value
  if (manualStep.value === 'metric') return !metricId.value
  if (manualStep.value === 'visualization') return !widgetType.value
  if (manualStep.value === 'name') return !widgetTitle.value.trim() && !descriptor.value
  return false
})

function handleDavinciAdd(draft: DashboardWidgetDraft) {
  applyDraft(draft)
  davinciDraft.value = draft
  if (persistDraft()) close()
}

function handleDavinciEdit(draft: DashboardWidgetDraft) {
  applyDraft(draft)
  davinciDraft.value = draft
  mode.value = 'manual'
  manualStep.value = 'name'
}
</script>

<template>
  <MpFormDrawer
    v-model="model"
    :title="drawerTitle"
    :subtitle="drawerSubtitle"
    :width="600"
  >
    <div class="widget-wizard">
      <div class="widget-wizard__stepper" role="status" aria-live="polite">
        <div
          v-for="(item, index) in stepperItems"
          :key="`${item.label}-${index}`"
          class="widget-wizard__step"
          :data-state="item.state"
        >
          <span class="widget-wizard__step-index">{{ index + 1 }}</span>
          <span class="widget-wizard__step-label">{{ item.label }}</span>
        </div>
      </div>

      <WidgetWizardModeChooser
        v-if="mode === 'choose'"
        @select="chooseMode"
      />

      <WidgetWizardManualSteps
        v-else-if="mode === 'manual'"
        :account-id="accountId"
        :step="manualStep"
        :source="source"
        :metric-id="metricId"
        :widget-type="widgetType"
        :widget-title="widgetTitle"
        :filters="dashboardFilters"
        @update:source="source = $event"
        @update:metricId="metricId = $event"
        @update:widgetType="widgetType = $event"
        @update:widgetTitle="widgetTitle = $event"
        @update:step="manualStep = $event"
      />

      <WidgetWizardDaVinciStep
        v-else
        :account-id="accountId"
        :dashboard-id="dashboardId"
        :filters="dashboardFilters"
        :initial-draft="initialDraft && initialDraft.aiProvenance ? initialDraft : null"
        @update:draft="(value) => { davinciDraft = value; if (value) applyDraft(value) }"
        @add="handleDavinciAdd"
        @edit="handleDavinciEdit"
      />
    </div>

    <template #footer>
      <div class="d-flex align-center ga-2 w-100">
        <v-btn
          v-if="mode !== 'choose'"
          variant="text"
          class="text-none"
          prepend-icon="mdi-arrow-left"
          @click="goBack"
        >
          Back
        </v-btn>
        <v-spacer />
        <v-btn variant="text" class="text-none" @click="close">Cancel</v-btn>
        <template v-if="mode === 'manual'">
          <v-btn
            color="primary"
            variant="flat"
            class="text-none"
            :disabled="manualPrimaryDisabled"
            @click="manualPrimaryAction"
          >
            {{
              manualStep === 'name'
                ? (isEditing ? 'Save changes' : 'Add Widget')
                : 'Next'
            }}
          </v-btn>
        </template>
      </div>
    </template>
  </MpFormDrawer>
</template>

<style scoped lang="scss">
.widget-wizard {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.widget-wizard__stepper {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.widget-wizard__step {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid var(--mp-border-subtle);
  background: rgb(var(--v-theme-surface));
  font-size: var(--mp-typography-fontSize-xs);
  color: rgba(var(--v-theme-on-surface), 0.7);
  font-weight: 600;
}

.widget-wizard__step-index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  border-radius: 999px;
  background: rgba(var(--v-theme-on-surface), 0.08);
  font-size: 11px;
}

.widget-wizard__step[data-state='active'] {
  border-color: rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-primary), 0.08);
  color: rgb(var(--v-theme-primary));
}

.widget-wizard__step[data-state='active'] .widget-wizard__step-index {
  background: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-on-primary));
}

.widget-wizard__step[data-state='complete'] {
  border-color: rgba(var(--v-theme-success), 0.4);
  background: rgba(var(--v-theme-success), 0.08);
  color: rgb(var(--v-theme-success));
}

.widget-wizard__step[data-state='complete'] .widget-wizard__step-index {
  background: rgb(var(--v-theme-success));
  color: rgb(var(--v-theme-on-success));
}
</style>
