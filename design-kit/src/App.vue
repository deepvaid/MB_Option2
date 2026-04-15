<script setup lang="ts">
import { computed, defineAsyncComponent, ref } from 'vue'

const sections = [
  { key: 'colors', label: 'Colors', icon: 'mdi-palette', description: 'Semantic palette, neutrals, and state colors.' },
  { key: 'typography', label: 'Typography', icon: 'mdi-format-text', description: 'Type scale, weights, and reading rhythm.' },
  { key: 'spacing', label: 'Spacing', icon: 'mdi-ruler', description: 'Rhythm, radii, shadows, and layout constraints.' },
  { key: 'components', label: 'Components', icon: 'mdi-widgets', description: 'Reusable Mp* patterns shown in context.' },
]

const active = ref('colors')

const activeSection = computed(() => sections.find(section => section.key === active.value) ?? sections[0])

const sectionComponents: Record<string, ReturnType<typeof defineAsyncComponent>> = {
  colors:     defineAsyncComponent(() => import('./sections/Colors.vue')),
  typography: defineAsyncComponent(() => import('./sections/Typography.vue')),
  spacing:    defineAsyncComponent(() => import('./sections/Spacing.vue')),
  components: defineAsyncComponent(() => import('./sections/Components.vue')),
}
</script>

<template>
  <v-app>
    <!-- Top bar -->
    <v-app-bar color="surface" border="b" height="56" class="design-kit-appbar">
      <v-app-bar-title class="design-kit-title">
        <div class="d-flex align-center gap-2">
          <span class="design-kit-brand">Maropost Design Kit</span>
          <v-chip size="x-small" variant="tonal" color="primary" label>Foundation</v-chip>
        </div>
      </v-app-bar-title>
      <template #append>
        <v-btn
          href="https://github.com"
          target="_blank"
          variant="text"
          size="small"
          prepend-icon="mdi-github"
          class="text-none"
        >
          GitHub
        </v-btn>
      </template>
    </v-app-bar>

    <!-- Left rail nav -->
    <v-navigation-drawer width="232" border="r" permanent class="design-kit-drawer">
      <div class="pa-4 pb-2">
        <div class="text-overline design-kit-eyebrow">Design System</div>
        <div class="text-body-2 text-medium-emphasis mt-1">
          Token-driven exploration for app and primitive layers.
        </div>
      </div>
      <v-list nav density="compact" class="px-2 py-1">
        <v-list-subheader class="design-kit-subheader">Design Tokens</v-list-subheader>
        <v-list-item
          v-for="s in sections.slice(0, 3)"
          :key="s.key"
          :prepend-icon="s.icon"
          :title="s.label"
          :value="s.key"
          :active="active === s.key"
          active-color="primary"
          rounded="lg"
          @click="active = s.key"
        />
        <v-divider class="my-2" />
        <v-list-subheader class="design-kit-subheader">Component Gallery</v-list-subheader>
        <v-list-item
          v-for="s in sections.slice(3)"
          :key="s.key"
          :prepend-icon="s.icon"
          :title="s.label"
          :value="s.key"
          :active="active === s.key"
          active-color="primary"
          rounded="lg"
          @click="active = s.key"
        />
      </v-list>

      <template #append>
        <v-divider />
        <div class="pa-4 text-caption text-medium-emphasis design-kit-footer">
          <div class="font-weight-medium">Maropost Design System</div>
          <div>Tokens synced from `tokens.json` and shared across the app.</div>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- Main content -->
    <v-main class="design-kit-main">
      <div class="design-kit-shell">
        <div class="design-kit-page-header mb-6">
          <div class="d-flex align-center flex-wrap gap-3 mb-2">
            <h1 class="design-kit-page-title mb-0">{{ activeSection.label }}</h1>
            <v-chip size="small" variant="tonal" color="primary" label>{{ activeSection.key }}</v-chip>
          </div>
          <p class="design-kit-page-subtitle mb-0">
            {{ activeSection.description }}
          </p>
        </div>
        <component :is="sectionComponents[active]" />
      </div>
    </v-main>
  </v-app>
</template>

<style scoped>
.design-kit-appbar {
  backdrop-filter: blur(12px);
}

.design-kit-title {
  min-width: 0;
}

.design-kit-brand {
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: rgb(var(--v-theme-on-surface));
}

.design-kit-drawer {
  background:
    linear-gradient(180deg, rgba(var(--v-theme-primary), 0.04), transparent 34%),
    rgb(var(--v-theme-surface));
}

.design-kit-eyebrow,
.design-kit-subheader {
  color: rgb(var(--v-theme-on-surface-variant));
  letter-spacing: 0.08em;
}

.design-kit-main {
  background:
    radial-gradient(circle at top left, rgba(var(--v-theme-primary), 0.07), transparent 32%),
    radial-gradient(circle at top right, rgba(var(--v-theme-secondary), 0.05), transparent 28%),
    rgb(var(--v-theme-background));
}

.design-kit-shell {
  max-width: 1280px;
  margin: 0 auto;
  padding: 32px;
}

.design-kit-page-header {
  padding: 20px 24px;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 16px;
  background: rgba(var(--v-theme-surface), 0.8);
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
}

.design-kit-page-title {
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: rgb(var(--v-theme-on-surface));
}

.design-kit-page-subtitle {
  max-width: 720px;
  color: rgb(var(--v-theme-on-surface-variant));
}

.design-kit-footer {
  line-height: 1.4;
}
</style>
