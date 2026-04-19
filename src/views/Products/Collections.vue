<script setup lang="ts">
import MpPageHeader from '@/components/MpPageHeader.vue'
</script>

<template>
  <div>
    <MpPageHeader
      title="Collections"
      subtitle="Manage product collections and groupings"
      :breadcrumbs="[
        { title: 'Products', to: '/commerce/2000290/products' },
        { title: 'Collections' }
      ]"
    />
    <v-card flat border rounded="lg" class="pa-6 mt-4">
      <div class="d-flex flex-column align-center justify-center" style="min-height: 300px;">
        <v-icon size="64" color="medium-emphasis" class="mb-4">mdi-folder-multiple-outline</v-icon>
        <h3 class="text-h6 text-medium-emphasis mb-2">Collections</h3>
        <p class="text-body-2 text-medium-emphasis">Coming soon — product collections management will appear here.</p>
      </div>
    </v-card>
  </div>
</template>
