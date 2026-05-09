import type { Meta, StoryObj } from '@storybook/vue3'
import { VContainer, VRow, VCol, VIcon } from 'vuetify/components'

const meta = {
  title: 'Foundations/Icons',
  component: VContainer,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
# Icons

MaroBase uses [Lucide](https://lucide.dev) icons via \`lucide-vue-next\`, wired into Vuetify through a custom icon set (\`src/plugins/lucideIcons.ts\`).

Use kebab-case names with any Vuetify icon prop:
\`\`\`html
<v-icon>settings</v-icon>
<v-btn prepend-icon="plus">Create</v-btn>
<v-text-field prepend-inner-icon="search" />
\`\`\`

Browse the full catalog at [lucide.dev/icons](https://lucide.dev/icons).
        `,
      },
    },
  },
} satisfies Meta<typeof VContainer>

export default meta
type Story = StoryObj<typeof meta>

const commonIcons = [
  'home', 'settings', 'search', 'plus', 'minus', 'check', 'x',
  'chevron-down', 'chevron-up', 'chevron-left', 'chevron-right',
  'arrow-up', 'arrow-down', 'arrow-right', 'arrow-left',
  'user', 'users', 'mail', 'phone', 'calendar', 'clock',
  'edit', 'trash-2', 'copy', 'download', 'upload', 'link',
  'eye', 'eye-off', 'lock', 'unlock', 'star', 'heart',
  'bell', 'message-circle', 'send', 'filter', 'sliders',
  'bar-chart', 'pie-chart', 'trending-up', 'trending-down',
  'shopping-cart', 'package', 'tag', 'gift', 'credit-card',
  'info', 'alert-triangle', 'alert-circle', 'check-circle',
  'menu', 'more-horizontal', 'more-vertical', 'grid', 'list',
]

export const Catalog: Story = {
  render: () => ({
    components: { VContainer, VRow, VCol, VIcon },
    setup() {
      return { commonIcons }
    },
    template: `
      <v-container class="pa-8" style="background: rgb(var(--v-theme-background));">
        <v-row>
          <v-col v-for="name in commonIcons" :key="name" cols="6" sm="4" md="3" lg="2">
            <div
              :style="{
                background: 'rgb(var(--v-theme-surface))',
                border: '1px solid rgb(var(--v-theme-outline-variant))',
                borderRadius: '12px',
                padding: '16px 12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
              }"
            >
              <v-icon :icon="name" size="24" color="primary" />
              <span style="font-family: 'JetBrains Mono', monospace; font-size: 11px; color: rgb(var(--v-theme-on-surface-variant)); word-break: break-all; text-align: center;">{{ name }}</span>
            </div>
          </v-col>
        </v-row>
      </v-container>
    `,
  }),
}
