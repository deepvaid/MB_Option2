<script setup lang="ts">
import type { MbEmptyStateProps } from './MbEmptyState.types';
import MbButton from './MbButton.vue';
import '../styles/mb-empty-state.css';

defineProps<MbEmptyStateProps>();

const emit = defineEmits<{
  (event: 'action', payload: MouseEvent): void;
}>();

function onAction(event: MouseEvent) {
  emit('action', event);
}
</script>

<template>
  <div class="mb-empty-state" role="status">
    <div v-if="$slots.icon" class="mb-empty-state__icon">
      <slot name="icon" />
    </div>

    <h2 class="mb-empty-state__title">{{ title }}</h2>
    <p v-if="description" class="mb-empty-state__desc">{{ description }}</p>

    <div v-if="actionLabel || $slots.actions" class="mb-empty-state__action">
      <slot name="actions">
        <MbButton
          v-if="actionLabel"
          style-type="filled"
          size="md"
          :label="actionLabel"
          icon-mode="with-label"
          :aria-label="actionLabel"
          @click="onAction"
        />
      </slot>
    </div>
  </div>
</template>
