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
  'Create KPI for sales revenue for last 30 days',
  'Top selling products of last month',
  'Revenue by channel last 30 days',
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
  <div class="wizard-davinci d-flex flex-column ga-4">
    <div class="wizard-davinci__callout">
      <div class="wizard-davinci__callout-text">
        <strong>Turn prompts into widgets</strong> — Da Vinci can draft widgets for Home using the workspace data sources already available on this account.
      </div>
    </div>

    <div v-if="status === 'idle'">
      <div class="text-subtitle-2 font-weight-bold mb-2">Create widgets</div>
      <div class="d-flex flex-column ga-2">
        <button
          v-for="suggestion in SUGGESTIONS"
          :key="suggestion"
          type="button"
          class="wizard-davinci__suggestion"
          @click="applySuggestion(suggestion)"
        >
          {{ suggestion }}
        </button>
      </div>
      <div class="text-body-2 text-medium-emphasis text-center mt-3">
        or write your own prompt in the text box below
      </div>
    </div>

    <div class="wizard-davinci__prompt">
      <v-textarea
        v-model="prompt"
        rows="2"
        auto-grow
        placeholder="Ask Da Vinci..."
        density="comfortable"
        variant="outlined"
        prepend-inner-icon="sparkles"
        hide-details
      />
      <v-btn
        color="primary"
        variant="flat"
        prepend-icon="sparkles"
        class="text-none mt-3"
        :disabled="!prompt.trim() || status === 'loading'"
        :loading="status === 'loading'"
        @click="generate"
      >
        Generate widget
      </v-btn>
    </div>

    <v-divider />

    <div v-if="status === 'loading'" class="d-flex flex-column ga-3">
      <v-skeleton-loader type="article" />
      <v-skeleton-loader type="image" />
    </div>

    <div v-else-if="status === 'no-match'" class="d-flex flex-column align-center text-center pa-6">
      <v-icon size="36" color="warning" class="mb-2">search-x</v-icon>
      <div class="text-subtitle-2 font-weight-bold mb-1">Da Vinci couldn’t map that prompt</div>
      <div class="text-body-2 text-medium-emphasis mb-3">
        Try one of the suggestions or describe a metric available for this account.
      </div>
      <div class="d-flex flex-wrap justify-center ga-2">
        <button
          v-for="suggestion in SUGGESTIONS"
          :key="suggestion"
          type="button"
          class="wizard-davinci__suggestion"
          @click="applySuggestion(suggestion)"
        >
          {{ suggestion }}
        </button>
      </div>
    </div>

    <div v-else-if="status === 'ready' && draft && previewWidget" class="d-flex flex-column ga-3">
      <div class="wizard-davinci__draft-eyebrow">Dashboard widget draft</div>
      <div class="text-h6 font-weight-bold">Ready to place on your active dashboard</div>
      <div class="text-body-2 text-medium-emphasis">
        {{ draft.aiProvenance?.summary }}
      </div>

      <DashboardWidgetCard
        :account-id="accountId"
        :widget="previewWidget"
        :filters="filters"
        preview
      />

      <div class="d-flex align-center justify-space-between flex-wrap ga-2 mt-2">
        <v-btn variant="text" prepend-icon="refresh-cw" class="text-none" @click="tryAnother">
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
.wizard-davinci__callout {
  padding: 14px 16px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(var(--v-theme-info), 0.10), rgba(var(--v-theme-secondary), 0.10));
}

.wizard-davinci__callout-text {
  font-size: 13px;
  line-height: 1.45;
  color: var(--ink);
}

.wizard-davinci__suggestion {
  display: block;
  width: 100%;
  padding: 10px 14px;
  border: 1px solid var(--hairline);
  border-radius: 999px;
  background: var(--surface-1);
  color: var(--ink);
  cursor: pointer;
  font: inherit;
  font-size: 13px;
  text-align: center;
  transition: background 120ms ease, border-color 120ms ease;
}

.wizard-davinci__suggestion:hover {
  background: var(--surface-2);
  border-color: color-mix(in oklch, var(--accent) 28%, var(--hairline));
}

.wizard-davinci__draft-eyebrow {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--muted);
  text-transform: uppercase;
}
</style>
