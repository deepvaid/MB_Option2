<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import MpFormDrawer from '@/components/MpFormDrawer.vue'
import { getMetricDescriptor } from '@/stores/dashboards/metricCatalog'
import type {
  DashboardFilterState,
  DashboardWidgetDraft,
  DashboardWidgetLibraryEntry,
} from '@/stores/dashboards/types'
import { useDashboardsStore } from '@/stores/useDashboards'
import WidgetLibraryStep from './wizard/WidgetLibraryStep.vue'
import WidgetEditStep from './wizard/WidgetEditStep.vue'
import WidgetWizardDaVinciStep from './wizard/WidgetWizardDaVinciStep.vue'

type WizardEntryMode = 'library' | 'davinci'
type WizardStage = 'pick' | 'edit'

const model = defineModel<boolean>({ default: false })

const props = defineProps<{
  accountId: string
  dashboardId: string
  dashboardFilters: DashboardFilterState
  initialDraft?: DashboardWidgetDraft | null
  defaultMode?: WizardEntryMode
}>()

const dashboardsStore = useDashboardsStore()

const entryMode = ref<WizardEntryMode>('library')
const stage = ref<WizardStage>('pick')
const draft = ref<DashboardWidgetDraft | null>(null)

const isEditing = computed(() => Boolean(props.initialDraft?.widgetId))

const drawerTitle = computed(() => {
  if (isEditing.value) return 'Edit widget'
  if (stage.value === 'edit') return 'Edit widget'
  if (entryMode.value === 'davinci') return 'Shape Home with Da Vinci'
  return 'Add widget'
})

const drawerSubtitle = computed(() => {
  if (isEditing.value) return 'Update your widget and save the changes.'
  if (stage.value === 'edit') return 'Refine the title, subtitle, and visualization before adding.'
  if (entryMode.value === 'davinci') {
    return 'Ask for a KPI, trend, comparison, or table widget and I will draft it for the active dashboard.'
  }
  return 'Choose what to monitor or generate a widget with Da Vinci.'
})

function libraryEntryToDraft(entry: DashboardWidgetLibraryEntry): DashboardWidgetDraft {
  return {
    dashboardId: props.dashboardId,
    type: entry.type,
    title: entry.title,
    subtitle: entry.description,
    dataSource: entry.dataSource,
    metricId: entry.metricId,
    drilldown: entry.drilldown,
    chartVariant: entry.chartVariant,
  }
}

function reset() {
  entryMode.value = props.defaultMode ?? 'library'
  stage.value = 'pick'
  draft.value = null
}

function initializeFromProps() {
  reset()
  const incoming = props.initialDraft
  if (!incoming) return

  // Editing existing widget — go straight to edit stage
  if (incoming.widgetId) {
    draft.value = { ...incoming }
    stage.value = 'edit'
    return
  }

  // Da Vinci-generated draft — start in davinci entry, draft already shown by step component
  if (incoming.aiProvenance) {
    entryMode.value = 'davinci'
    return
  }
}

watch(
  [model, () => props.initialDraft, () => props.defaultMode],
  ([isOpen]) => {
    if (isOpen) initializeFromProps()
  },
  { immediate: true, deep: true },
)

watch(model, (isOpen) => {
  if (!isOpen) {
    dashboardsStore.closeWidgetEditor()
  }
})

const stageItems = computed(() => {
  if (entryMode.value === 'davinci' && stage.value === 'pick') {
    return [{ label: 'Describe', state: 'active' as const }]
  }
  return [
    { label: entryMode.value === 'davinci' ? 'Describe' : 'Pick', state: stage.value === 'pick' ? 'active' as const : 'complete' as const },
    { label: 'Edit', state: stage.value === 'edit' ? 'active' as const : 'pending' as const },
  ]
})

function handleLibrarySelect(entry: DashboardWidgetLibraryEntry) {
  draft.value = libraryEntryToDraft(entry)
  stage.value = 'edit'
}

function handleDavinciAdd(value: DashboardWidgetDraft) {
  draft.value = { ...value }
  persist()
}

function handleDavinciEdit(value: DashboardWidgetDraft) {
  draft.value = { ...value, subtitle: value.subtitle ?? value.aiProvenance?.summary }
  stage.value = 'edit'
}

function handleDraftUpdate(next: DashboardWidgetDraft) {
  draft.value = next
}

function persist(): boolean {
  const current = draft.value
  if (!current) return false
  const descriptor = getMetricDescriptor(current.metricId)
  if (!descriptor) return false

  const payload: DashboardWidgetDraft = {
    ...current,
    title: current.title?.trim() || descriptor.defaultTitle,
    drilldown: current.drilldown ?? descriptor.drilldown,
    aiProvenance: current.aiProvenance ?? props.initialDraft?.aiProvenance,
    widgetId: props.initialDraft?.widgetId,
  }

  if (payload.widgetId) {
    dashboardsStore.updateWidget(props.accountId, payload)
  } else {
    dashboardsStore.addWidget(props.accountId, payload)
  }
  return true
}

function close() {
  model.value = false
}

function goBack() {
  if (stage.value === 'edit' && !isEditing.value) {
    stage.value = 'pick'
    return
  }
  close()
}

function handleSave() {
  if (persist()) close()
}

const editPrimaryLabel = computed(() => (isEditing.value ? 'Save changes' : 'Add to dashboard'))

const showFooterPrimary = computed(() => stage.value === 'edit')
</script>

<template>
  <MpFormDrawer
    v-model="model"
    :title="drawerTitle"
    :subtitle="drawerSubtitle"
    :width="600"
  >
    <div class="widget-wizard">
      <div v-if="!isEditing" class="widget-wizard__stages" role="status" aria-live="polite">
        <div
          v-for="(item, index) in stageItems"
          :key="`${item.label}-${index}`"
          class="widget-wizard__stage"
          :data-state="item.state"
        >
          <span class="widget-wizard__stage-index">{{ index + 1 }}</span>
          <span class="widget-wizard__stage-label">{{ item.label }}</span>
        </div>
      </div>

      <template v-if="stage === 'pick'">
        <WidgetLibraryStep
          v-if="entryMode === 'library'"
          @select="handleLibrarySelect"
        />
        <WidgetWizardDaVinciStep
          v-else
          :account-id="accountId"
          :dashboard-id="dashboardId"
          :filters="dashboardFilters"
          :initial-draft="initialDraft && initialDraft.aiProvenance ? initialDraft : null"
          @add="handleDavinciAdd"
          @edit="handleDavinciEdit"
        />
      </template>

      <WidgetEditStep
        v-else-if="stage === 'edit' && draft"
        :account-id="accountId"
        :draft="draft"
        :filters="dashboardFilters"
        @update:draft="handleDraftUpdate"
      />
    </div>

    <template #footer>
      <div class="d-flex align-center ga-2 w-100">
        <v-btn
          v-if="stage === 'edit' && !isEditing"
          variant="text"
          class="text-none"
          prepend-icon="arrow-left"
          @click="goBack"
        >
          Back
        </v-btn>
        <v-spacer />
        <v-btn variant="text" class="text-none" @click="close">Cancel</v-btn>
        <v-btn
          v-if="showFooterPrimary"
          color="primary"
          variant="flat"
          class="text-none"
          @click="handleSave"
        >
          {{ editPrimaryLabel }}
        </v-btn>
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

.widget-wizard__stages {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.widget-wizard__stage {
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

.widget-wizard__stage-index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  border-radius: 999px;
  background: rgba(var(--v-theme-on-surface), 0.08);
  font-size: 11px;
}

.widget-wizard__stage[data-state='active'] {
  border-color: rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-primary), 0.08);
  color: rgb(var(--v-theme-primary));
}

.widget-wizard__stage[data-state='active'] .widget-wizard__stage-index {
  background: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-on-primary));
}

.widget-wizard__stage[data-state='complete'] {
  border-color: rgba(var(--v-theme-success), 0.4);
  background: rgba(var(--v-theme-success), 0.08);
  color: rgb(var(--v-theme-success));
}

.widget-wizard__stage[data-state='complete'] .widget-wizard__stage-index {
  background: rgb(var(--v-theme-success));
  color: rgb(var(--v-theme-on-success));
}
</style>
