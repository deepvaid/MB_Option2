import type { Meta, StoryObj } from '@storybook/vue3'
import { VContainer, VRow, VCol } from 'vuetify/components'
import {
  mp_shadow_sm,
  mp_shadow_md,
  mp_shadow_lg,
} from '@/design-tokens/generated/tokens'

const meta = {
  title: 'Foundations/Elevation',
  component: VContainer,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
# Elevation

MaroBase uses three softly-tinted elevation levels. Depth comes from hairline borders + warm tint, not heavy drop shadows.

| Token | Use |
|-------|-----|
| \`mp_shadow_sm\` | Resting cards, list items |
| \`mp_shadow_md\` | Hover states, popovers |
| \`mp_shadow_lg\` | Modals, drawers |

Avoid stacking elevation; combine with \`outline-variant\` borders for separation.
        `,
      },
    },
  },
} satisfies Meta<typeof VContainer>

export default meta
type Story = StoryObj<typeof meta>

const samples = [
  { name: 'Shadow / sm', value: mp_shadow_sm },
  { name: 'Shadow / md', value: mp_shadow_md },
  { name: 'Shadow / lg', value: mp_shadow_lg },
]

export const Stack: Story = {
  render: () => ({
    components: { VContainer, VRow, VCol },
    setup() {
      return { samples }
    },
    template: `
      <v-container class="pa-8" style="background: rgb(var(--v-theme-background));">
        <v-row>
          <v-col v-for="s in samples" :key="s.name" cols="12" sm="4">
            <div
              :style="{
                background: 'rgb(var(--v-theme-surface))',
                border: '1px solid rgb(var(--v-theme-outline-variant))',
                borderRadius: '14px',
                padding: '32px 24px',
                boxShadow: s.value,
                textAlign: 'center',
              }"
            >
              <div style="font-weight: 600; font-size: 14px; color: rgb(var(--v-theme-on-surface));">{{ s.name }}</div>
              <div style="margin-top: 8px; font-size: 11px; color: rgb(var(--v-theme-on-surface-variant)); font-family: 'JetBrains Mono', monospace; word-break: break-all;">
                {{ s.value }}
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    `,
  }),
}
