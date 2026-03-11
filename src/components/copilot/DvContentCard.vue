<script setup lang="ts">
defineProps<{
  type: 'email' | 'product' | 'blog' | 'sms'
  title: string
  content: string
}>()

const emit = defineEmits<{
  copy: []
  edit: []
  use: []
}>()

const typeConfig: Record<string, { icon: string; color: string; label: string }> = {
  email: { icon: 'mdi-email-edit-outline', color: '#1976D2', label: 'Email Copy' },
  product: { icon: 'mdi-package-variant', color: '#43A047', label: 'Product Description' },
  blog: { icon: 'mdi-post-outline', color: '#FF9800', label: 'Blog Post' },
  sms: { icon: 'mdi-message-text-outline', color: '#AB47BC', label: 'SMS Message' },
}
</script>

<template>
  <v-card variant="outlined" rounded="lg">
    <v-card-text class="pa-4">
      <div class="d-flex align-center ga-2 mb-3">
        <v-avatar size="28" :color="typeConfig[type]?.color" variant="tonal">
          <v-icon size="16">{{ typeConfig[type]?.icon }}</v-icon>
        </v-avatar>
        <span class="text-caption font-weight-bold text-uppercase" style="letter-spacing: 0.5px;">{{ typeConfig[type]?.label }}</span>
      </div>

      <div class="text-subtitle-2 font-weight-bold mb-2">{{ title }}</div>

      <div class="content-preview pa-3 rounded-lg text-body-2" style="background: #FAFBFC; border: 1px solid rgba(0,0,0,0.06); white-space: pre-line; line-height: 1.6; max-height: 160px; overflow-y: auto;">
        {{ content }}
      </div>

      <div class="d-flex ga-2 mt-3">
        <v-btn variant="outlined" size="small" class="text-none" prepend-icon="mdi-content-copy" @click="emit('copy')">Copy</v-btn>
        <v-btn variant="outlined" size="small" class="text-none" prepend-icon="mdi-pencil-outline" @click="emit('edit')">Edit</v-btn>
        <v-btn color="primary" variant="flat" size="small" class="text-none" prepend-icon="mdi-check" @click="emit('use')">Use in Campaign</v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>
