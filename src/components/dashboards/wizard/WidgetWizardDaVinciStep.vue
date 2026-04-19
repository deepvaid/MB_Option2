<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import DashboardWidgetCard from '@/components/dashboards/DashboardWidgetCard.vue'
import { getMetricDescriptor } from '@/stores/dashboards/metricCatalog'
import type {
  DashboardFilterState,
  DashboardWidgetDraft,
} from '@/stores/dashboards/types'
import { useDashboardsStore } from '@/stores/useDashboards'
import { buildPreviewWidget } from './buildPreviewWidget'

const props = defineProps<{
  accountId: string
  dashboardId: string
  filters: DashboardFilterState
  initialDraft?: DashboardWidgetDraft | null
}>()

const emit = defineEmits<{
  'update:draft': [draft: DashboardWidgetDraft | null]
  add: [draft: DashboardWidgetDraft]
  edit: [draft: DashboardWidgetDraft]
}>()

const dashboardsStore = useDashboardsStore()

const SUGGESTIONS = [
  'Revenue by channel last 30 days',
  'Top campaigns by revenue',
  'Recent orders table',
  'Open rate trend over 90 days',
]

const prompt = ref('')
const draft = ref<DashboardWidgetDraft | null>(null)
const status = ref<'idle' | 'loading' | 'no-match' | 'ready'>('idle')

watch(
  () => props.initialDraft,
  (next) => {
    if (next?.aiProvenance) {
      prompt.value = next.aiProvenance.prompt ?? ''
      draft.value = next
      status.value = 'ready'
      emit('update:draft', next)
    }
  },
  { immediate: true },
)

const previewWidget = computed(() => {
  if (!draft.value) return null
  const descriptor = getMetricDescriptor(draft.value.metricId)
  if (!descriptor) return null
  return buildPreviewWidget({
    draft: draft.value,
    type: draft.value.type,
    title: draft.value.title,
    dataSource: draft.value.dataSource,
    metricId: draft.value.metricId,
    descriptor,
  })
})

function generate() {
  const trimmed = prompt.value.trim()
  if (!trimmed) return

  status.value = 'loading'
  draft.value = null
  emit('update:draft', null)

  setTimeout(() => {
    const next = dashboardsStore.buildAiWidgetDraft(props.accountId, props.dashboardId, trimmed)
    if (!next) {
      status.value = 'no-match'
      return
    }
    draft.value = next
    status.value = 'ready'
    emit('update:draft', next)
  }, 350)
}

function applySuggestion(suggestion: string) {
  prompt.value = suggestion
  generate()
}

function tryAnother() {
  draft.value = null
  status.value = 'idle'
  emit('update:draft', null)
}

function handleAdd() {
  if (draft.value) emit('add', draft.value)
}

function handleEdit() {
  if (draft.value) emit('edit', draft.value)
}
</script>

<template>
  <div class="wizard-davinci d-flex flex-column ga-5">
    <div>
      <div class="d-flex align-center ga-2 mb-2">
        <v-icon size="20" color="secondary">mdi-creation</v-icon>
        <div class="text-subtitle-2 font-weight-bold">Describe the widget you want</div>
      </div>
      <div class="text-body-2 text-medium-emphasis mb-3">
        Da Vinci will pick the metric, visualization, and title that fit your account.
      </div>
      <v-textarea
        v-model="prompt"
        rows="2"
        auto-grow
        placeholder="e.g. Show revenue by channel for the last 30 days"
        density="comfortable"
        variant="outlined"
        prepend-inner-icon="mdi-creation"
        hide-details
      />

      <div class="d-flex flex-wrap ga-2 mt-3">
        <v-chip
          v-for="suggestion in SUGGESTIONS"
          :key="suggestion"
          size="small"
          variant="tonal"
          color="secondary"
          class="text-none"
          @click="applySuggestion(suggestion)"
        >
          {{ suggestion }}
        </v-chip>
      </div>

      <v-btn
        color="secondary"
        variant="flat"
        prepend-icon="mdi-creation"
        class="text-none mt-4"
        :disabled="!prompt.trim() || status === 'loading'"
        :loading="status === 'loading'"
        @click="generate"
      >
        Generate widget
      </v-btn>
    </div>

    <v-divider />

    <div v-if="status === 'idle'" class="wizard-davinci__placeholder">
      <v-icon size="36" color="medium-emphasis" class="mb-2">mdi-creation</v-icon>
      <div class="text-body-2 text-medium-emphasis">
        Your generated widget preview will appear here.
      </div>
    </div>

    <div v-else-if="status === 'loading'" class="d-flex flex-column ga-3">
      <v-skeleton-loader type="article" />
      <v-skeleton-loader type="image" />
    </div>

    <div v-else-if="status === 'no-match'" class="d-flex flex-column align-center text-center pa-6">
      <v-icon size="36" color="warning" class="mb-2">mdi-magnify-remove-outline</v-icon>
      <div class="text-subtitle-2 font-weight-bold mb-1">Da Vinci couldn’t map that prompt</div>
      <div class="text-body-2 text-medium-emphasis mb-3">
        Try one of the suggestions or describe a metric available for this account.
      </div>
      <div class="d-flex flex-wrap justify-center ga-2">
        <v-chip
          v-for="suggestion in SUGGESTIONS"
          :key="suggestion"
          size="small"
          variant="tonal"
          color="secondary"
          class="text-none"
          @click="applySuggestion(suggestion)"
        >
          {{ suggestion }}
        </v-chip>
      </div>
    </div>

    <div v-else-if="status === 'ready' && draft && previewWidget" class="d-flex flex-column ga-3">
      <div class="d-flex align-center ga-2">
        <v-chip size="small" color="secondary" variant="tonal" prepend-icon="mdi-creation">Da Vinci draft</v-chip>
        <span class="text-body-2 text-medium-emphasis">
          {{ draft.aiProvenance?.summary }}
        </span>
      </div>

      <DashboardWidgetCard
        :account-id="accountId"
        :widget="previewWidget"
        :filters="filters"
        preview
      />

      <div class="d-flex align-center justify-space-between flex-wrap ga-2 mt-2">
        <v-btn variant="text" prepend-icon="mdi-refresh" class="text-none" @click="tryAnother">
          Try another prompt
        </v-btn>
        <div class="d-flex align-center ga-2">
          <v-btn variant="text" class="text-none" @click="handleEdit">
            Edit before adding
          </v-btn>
          <v-btn color="primary" variant="flat" class="text-none" @click="handleAdd">
            Add to Dashboard
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.wizard-davinci__placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 32px 16px;
  border: 1px dashed var(--mp-border-subtle);
  border-radius: 16px;
  background: rgba(var(--v-theme-on-surface), 0.02);
}
</style>
