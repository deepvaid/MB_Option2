import type { Meta, StoryObj } from '@storybook/vue3'
import { VContainer, VRow, VCol } from 'vuetify/components'
import {
  mp_borderRadius_sm,
  mp_borderRadius_md,
  mp_borderRadius_lg,
  mp_borderRadius_xl,
  mp_borderRadius_2xl,
  mp_borderRadius_full,
  mp_borderRadius_chip,
} from '@/design-tokens/generated/tokens'

const meta = {
  title: 'Foundations/Radius',
  component: VContainer,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
# Border Radius

MaroBase uses a compact dashboard radius system. Inputs are slightly rounded (16px), cards are pillowy (14–28px), buttons are pill (9999px).

Choose by element type, not aesthetic preference:
- \`sm\` (4px) — tight chips, dense controls
- \`md / lg\` (12–14px) — list items, secondary cards
- \`xl / 2xl\` (28–36px) — primary cards, dialogs
- \`full / pill\` (9999px) — chips, buttons, avatars
        `,
      },
    },
  },
} satisfies Meta<typeof VContainer>

export default meta
type Story = StoryObj<typeof meta>

const samples = [
  { name: 'sm', value: mp_borderRadius_sm },
  { name: 'chip', value: mp_borderRadius_chip },
  { name: 'md', value: mp_borderRadius_md },
  { name: 'lg', value: mp_borderRadius_lg },
  { name: 'xl', value: mp_borderRadius_xl },
  { name: '2xl', value: mp_borderRadius_2xl },
  { name: 'full / pill', value: mp_borderRadius_full },
]

export const Scale: Story = {
  render: () => ({
    components: { VContainer, VRow, VCol },
    setup() {
      return { samples }
    },
    template: `
      <v-container class="pa-8" style="background: rgb(var(--v-theme-background));">
        <v-row>
          <v-col v-for="s in samples" :key="s.name" cols="6" sm="4" md="3">
            <div
              :style="{
                background: 'rgb(var(--v-theme-primary-container))',
                border: '1px solid rgb(var(--v-theme-outline-variant))',
                borderRadius: s.value,
                height: '96px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgb(var(--v-theme-on-primary-container))',
                fontWeight: 600,
                fontSize: '13px',
                textAlign: 'center',
              }"
            >
              {{ s.name }}<br>
              <span style="font-family: 'JetBrains Mono', monospace; font-size: 11px; opacity: 0.75;">{{ s.value }}</span>
            </div>
          </v-col>
        </v-row>
      </v-container>
    `,
  }),
}
