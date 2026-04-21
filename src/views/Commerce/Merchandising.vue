<script setup lang="ts">
import MpPageHeader from '@/components/MpPageHeader.vue'
</script>

<template>
  <div class="pa-6">
    <MpPageHeader title="Merchandising" subtitle="Curate storefront experiences, product placements, and promotional merchandising." />

    <v-card flat border rounded="lg" class="coming-soon-card pa-12 d-flex flex-column align-center text-center">
      <v-icon size="64" color="secondary" class="mb-4">mdi-tag-heart-outline</v-icon>
      <h2 class="text-h5 font-weight-bold mb-2">Coming Soon</h2>
      <p class="text-body-2 text-medium-emphasis" style="max-width: 480px;">
        We're building powerful merchandising tools to help you showcase products, run promotions,
        and optimize the shopping experience. Check back soon.
      </p>
    </v-card>
  </div>
</template>

<style scoped lang="scss">
.coming-soon-card {
  background: var(--mp-color-surface-subtle, #fafbfc);
}
</style>
