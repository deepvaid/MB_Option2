<script setup lang="ts">
withDefaults(defineProps<{
  widgetTitle: string
  editable?: boolean
}>(), {
  editable: false,
})

const emit = defineEmits<{
  expand: []
  edit: []
  refresh: []
  remove: []
}>()
</script>

<template>
  <v-menu location="bottom end">
    <template #activator="{ props: menuProps }">
      <v-btn
        v-bind="menuProps"
        icon="more-vertical"
        variant="text"
        size="small"
        :aria-label="`Actions for ${widgetTitle}`"
        @click.stop
      />
    </template>

    <v-list density="compact" min-width="180" class="dashboard-widget-action-menu">
      <v-list-item
        prepend-icon="maximize-2"
        title="Expand"
        @click="emit('expand')"
      />
      <v-list-item
        prepend-icon="pencil"
        title="Edit"
        @click="emit('edit')"
      />
      <v-list-item
        prepend-icon="refresh-cw"
        title="Refresh"
        @click="emit('refresh')"
      />
      <v-list-item
        prepend-icon="trash-2"
        title="Remove"
        base-color="error"
        :disabled="!editable"
        @click="emit('remove')"
      />
    </v-list>
  </v-menu>
</template>

<style scoped lang="scss">
.dashboard-widget-action-menu {
  border-radius: var(--r-card);
}
</style>
