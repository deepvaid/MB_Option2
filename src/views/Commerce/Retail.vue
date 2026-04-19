<script setup lang="ts">
import MpPageHeader from '@/components/MpPageHeader.vue'
</script>

<template>
  <div>
    <MpPageHeader
      title="Retail"
      subtitle="Manage your retail operations and point-of-sale"
      :breadcrumbs="[
        { title: 'Commerce' },
        { title: 'Retail' }
      ]"
    />
    <v-card flat border rounded="lg" class="pa-6 mt-4">
      <div class="d-flex flex-column align-center justify-center" style="min-height: 300px;">
        <v-icon size="64" color="warning" class="mb-4">mdi-storefront-outline</v-icon>
        <h3 class="text-h6 text-medium-emphasis mb-2">Retail</h3>
        <p class="text-body-2 text-medium-emphasis">Premium feature — retail and POS management will appear here.</p>
      </div>
    </v-card>
  </div>
</template>
