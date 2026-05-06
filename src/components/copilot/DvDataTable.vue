<script setup lang="ts">
defineProps<{
  title?: string
  headers: string[]
  rows: string[][]
}>()
</script>

<template>
  <v-card variant="outlined" rounded="lg">
    <v-card-text class="pa-0">
      <div v-if="title" class="d-flex align-center justify-space-between px-4 pt-3 pb-2">
        <span class="text-subtitle-2 font-weight-bold">{{ title }}</span>
        <div class="d-flex ga-1">
          <v-btn icon size="28" variant="text"><v-icon size="16">download</v-icon></v-btn>
          <v-btn icon size="28" variant="text"><v-icon size="16">maximize-2</v-icon></v-btn>
        </div>
      </div>
      <v-table density="compact" class="text-caption">
        <thead>
          <tr>
            <th v-for="h in headers" :key="h" class="text-caption font-weight-bold text-uppercase" style="font-size: 10px !important; letter-spacing: 0.5px;">{{ h }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, ri) in rows" :key="ri">
            <td v-for="(cell, ci) in row" :key="ci" class="text-body-2">{{ cell }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-card-text>
  </v-card>
</template>
