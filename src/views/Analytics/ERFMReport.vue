<script setup lang="ts">
import MpPageHeader from '@/components/MpPageHeader.vue'
</script>

<template>
  <div>
    <MpPageHeader
      title="eRFM Report"
      subtitle="Enhanced Recency, Frequency & Monetary analysis"
      :breadcrumbs="[
        { title: 'Analytics', to: '/accounts/2000290/analytics/monthly_totals' },
        { title: 'eRFM Report' }
      ]"
    />
    <v-card flat border rounded="lg" class="pa-6 mt-4">
      <div class="d-flex flex-column align-center justify-center" style="min-height: 300px;">
        <v-icon size="64" color="medium-emphasis" class="mb-4">mdi-chart-scatter-plot</v-icon>
        <h3 class="text-h6 text-medium-emphasis mb-2">eRFM Report</h3>
        <p class="text-body-2 text-medium-emphasis">Coming soon — RFM segmentation analysis will appear here.</p>
      </div>
    </v-card>
  </div>
</template>
