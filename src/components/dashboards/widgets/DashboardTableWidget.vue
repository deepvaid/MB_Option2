<script setup lang="ts">
import type { DashboardTableData } from '@/stores/dashboards/types'

defineProps<{
  data: DashboardTableData
}>()
</script>

<template>
  <div class="dashboard-table-widget">
    <v-table density="compact" class="dashboard-table-widget__table">
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
