<script setup lang="ts">
import { computed } from 'vue'
import type { DashboardTableData } from '@/stores/dashboards/types'

const props = defineProps<{
  data: DashboardTableData
}>()

function parseCurrency(value: string | number | undefined): number {
  if (typeof value === 'number') return value
  if (!value) return 0
  return Number(value.replace(/[^0-9.-]/g, '')) || 0
}

const isCampaignRevenueTable = computed(() =>
  props.data.columns.some((column) => column.key === 'campaign')
  && props.data.columns.some((column) => column.key === 'revenue'),
)

const campaignRows = computed(() => {
  const rows = props.data.rows.map((row) => ({
    campaign: String(row.campaign ?? ''),
    revenue: String(row.revenue ?? ''),
    openRate: String(row.openRate ?? ''),
    value: parseCurrency(row.revenue),
  }))
  const maxValue = Math.max(...rows.map((row) => row.value), 1)
  return rows.slice(0, 5).map((row) => ({
    ...row,
    percent: Math.max(8, Math.round((row.value / maxValue) * 100)),
  }))
})
</script>

<template>
  <div class="dashboard-table-widget">
    <div v-if="isCampaignRevenueTable" class="dashboard-campaign-list">
      <div v-for="row in campaignRows" :key="row.campaign" class="dashboard-campaign-list__row">
        <div class="dashboard-campaign-list__topline">
          <span class="dashboard-campaign-list__name">{{ row.campaign }}</span>
          <strong>{{ row.revenue }}</strong>
        </div>
        <div class="dashboard-campaign-list__meter">
          <span :style="{ width: `${row.percent}%` }" />
        </div>
        <div class="dashboard-campaign-list__meta">{{ row.openRate }}</div>
      </div>
      <button type="button" class="dashboard-campaign-list__link">
        View all campaigns
        <v-icon size="16">mdi-arrow-right</v-icon>
      </button>
    </div>

    <v-table v-else density="compact" class="dashboard-table-widget__table">
      <thead>
        <tr>
          <th
            v-for="column in data.columns"
            :key="column.key"
            :class="column.align === 'end' ? 'text-right' : column.align === 'center' ? 'text-center' : 'text-left'"
          >
            {{ column.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in data.rows" :key="index">
          <td
            v-for="column in data.columns"
            :key="column.key"
            :class="column.align === 'end' ? 'text-right' : column.align === 'center' ? 'text-center' : 'text-left'"
          >
            <span class="text-body-2">{{ row[column.key] }}</span>
          </td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>

<style scoped lang="scss">
.dashboard-table-widget {
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: auto;
  border-radius: var(--mp-radius-md, 8px);
}

.dashboard-campaign-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
  height: 100%;
  min-height: 0;
  padding-top: 6px;
}

.dashboard-campaign-list__row {
  display: grid;
  gap: 7px;
  min-width: 0;
}

.dashboard-campaign-list__topline {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: baseline;
  gap: 12px;
  color: rgb(var(--v-theme-on-surface));
  font-size: var(--mp-typography-fontSize-sm);
}

.dashboard-campaign-list__name {
  overflow: hidden;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dashboard-campaign-list__topline strong {
  font-weight: 800;
  white-space: nowrap;
}

.dashboard-campaign-list__meter {
  height: 7px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(var(--v-theme-surface-variant), 0.65);
}

.dashboard-campaign-list__meter span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: rgb(var(--v-theme-primary));
}

.dashboard-campaign-list__meta {
  justify-self: end;
  margin-top: -4px;
  color: rgba(var(--v-theme-on-surface), 0.54);
  font-size: var(--mp-typography-fontSize-xs);
  font-weight: 650;
}

.dashboard-campaign-list__link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  align-self: flex-start;
  margin-top: auto;
  padding: 4px 0;
  border: 0;
  background: transparent;
  color: rgb(var(--v-theme-primary));
  cursor: pointer;
  font: inherit;
  font-size: var(--mp-typography-fontSize-sm);
  font-weight: 800;
}

.dashboard-campaign-list__link:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(var(--v-theme-primary), 0.18);
}

.dashboard-table-widget__table {
  background: transparent !important;
}

.dashboard-table-widget :deep(th) {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(var(--v-theme-on-surface), 0.56);
  border-bottom: 1px solid var(--mp-border-subtle);
  position: sticky;
  top: 0;
  background: rgb(var(--v-theme-surface));
  z-index: 1;
  white-space: nowrap;
}

.dashboard-table-widget :deep(td) {
  border-bottom: 1px solid var(--mp-border-subtle);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 260px;
}
</style>
