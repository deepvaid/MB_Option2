<script setup lang="ts">
defineEmits<{
  select: [mode: 'manual' | 'davinci']
}>()
</script>

<template>
  <div class="wizard-mode-chooser">
    <div class="text-subtitle-2 font-weight-bold mb-1">How do you want to build this widget?</div>
    <div class="text-body-2 text-medium-emphasis mb-5">
      Pick the experience that fits the moment — both end up on the active dashboard.
    </div>

    <div class="wizard-mode-chooser__grid">
      <button
        type="button"
        class="wizard-mode-chooser__card"
        @click="$emit('select', 'manual')"
      >
        <v-avatar size="44" variant="tonal" color="primary" class="mb-3">
          <v-icon>mdi-tune-vertical-variant</v-icon>
        </v-avatar>
        <div class="text-subtitle-1 font-weight-bold mb-2">Build manually</div>
        <div class="text-body-2 text-medium-emphasis">
          Pick a source, metric, and visualization step by step. Best when you know exactly what you want.
        </div>
        <div class="wizard-mode-chooser__cta">
          <span class="text-caption font-weight-bold">Start step by step</span>
          <v-icon size="14">mdi-arrow-right</v-icon>
        </div>
      </button>

      <button
        type="button"
        class="wizard-mode-chooser__card wizard-mode-chooser__card--davinci"
        @click="$emit('select', 'davinci')"
      >
        <v-avatar size="44" variant="tonal" color="secondary" class="mb-3">
          <v-icon>mdi-creation</v-icon>
        </v-avatar>
        <div class="d-flex align-center ga-2 mb-2">
          <div class="text-subtitle-1 font-weight-bold">Create with Da Vinci</div>
          <v-chip size="x-small" color="secondary" variant="tonal" class="font-weight-bold">AI</v-chip>
        </div>
        <div class="text-body-2 text-medium-emphasis">
          Describe the widget in plain language and we’ll draft a metric, visualization, and title for you.
        </div>
        <div class="wizard-mode-chooser__cta">
          <span class="text-caption font-weight-bold">Describe it in words</span>
          <v-icon size="14">mdi-arrow-right</v-icon>
        </div>
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.wizard-mode-chooser__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

@media (min-width: 600px) {
  .wizard-mode-chooser__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.wizard-mode-chooser__card {
  appearance: none;
  text-align: left;
  font: inherit;
  background: rgb(var(--v-theme-surface));
  border: 1px solid var(--mp-border-subtle);
  border-radius: 16px;
  padding: 18px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 0;
  transition: border-color 160ms ease, transform 160ms ease, box-shadow 160ms ease;
}

.wizard-mode-chooser__card:hover {
  border-color: rgba(var(--v-theme-primary), 0.36);
  transform: translateY(-1px);
  box-shadow: var(--mp-shadow-md);
}

.wizard-mode-chooser__card:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(var(--v-theme-primary), 0.2);
}

.wizard-mode-chooser__card--davinci {
  background:
    radial-gradient(circle at top right, rgba(var(--v-theme-secondary), 0.08), transparent 30%),
    rgb(var(--v-theme-surface));
}

.wizard-mode-chooser__cta {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 16px;
  color: rgb(var(--v-theme-primary));
}
</style>
