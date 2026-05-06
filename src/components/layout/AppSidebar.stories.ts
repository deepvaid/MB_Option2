import type { Meta, StoryObj } from '@storybook/vue3'
import AppSidebar from './AppSidebar.vue'
import { ref } from 'vue'

const meta = {
  title: 'Layout/AppSidebar',
  component: AppSidebar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
### Overview
\`AppSidebar\` is the primary left-hand navigation for the Maropost platform. It supports two modes: expanded (230px, showing labels) and rail/collapsed (showing icons only).

### Navigation Structure
Module groups with expandable sub-items (Analytics, Commerce, Marketing, etc.) plus single-route items such as Da Vinci AI and Apps. Settings now lives in the app bar/user menu rather than the sidebar.

### 🟢 Do's
- **Do** use the rail mode on smaller viewports for a compact sidebar.
- **Do** wrap it in a \`v-layout\` alongside \`AppBar\` and \`v-main\` for proper page structure.
- **Do** keep administrative surfaces in the app bar/user menu when they are utilities rather than primary navigation.

### 🔴 Don'ts
- **Don't** add Settings back into the sidebar; use the app bar/user menu entry instead.
- **Don't** put page-specific actions in the sidebar. Navigation only.
- **Don't** render more than one sidebar per page.

### 💡 Best Practices
- The sidebar width follows the current shell sizing: 230px expanded, 72px rail.
- Navigation items are grouped by module: Commerce, Marketing, Contacts, Products, etc.
        `,
      },
    },
  },
  argTypes: {
    modelValue: { control: 'boolean', description: 'Controls sidebar visibility (v-model)' },
    rail: { control: 'boolean', description: 'Collapse to icon-only rail mode (v-model:rail)' },
  },
} satisfies Meta<typeof AppSidebar>

export default meta
type Story = StoryObj<typeof meta>

export const Expanded: Story = {
  args: {
    modelValue: true,
    rail: false,
  },
  render: () => ({
    components: { AppSidebar },
    setup() {
      const open = ref(true)
      const rail = ref(false)
      return { open, rail }
    },
    template: `
      <v-layout style="height: 600px;" class="bg-surface">
        <AppSidebar v-model="open" v-model:rail="rail" />
        <v-main class="pa-6">
          <p class="text-body-1">Sidebar is <strong>expanded</strong> (230px). Toggle the rail prop to collapse it.</p>
        </v-main>
      </v-layout>
    `,
  }),
}

export const CollapsedRail: Story = {
  args: {
    modelValue: true,
    rail: true,
  },
  render: () => ({
    components: { AppSidebar },
    setup() {
      const open = ref(true)
      const rail = ref(true)
      return { open, rail }
    },
    template: `
      <v-layout style="height: 600px;" class="bg-surface">
        <AppSidebar v-model="open" v-model:rail="rail" />
        <v-main class="pa-6">
          <p class="text-body-1">Sidebar is in <strong>rail mode</strong> (icon-only, 72px).</p>
        </v-main>
      </v-layout>
    `,
  }),
}
