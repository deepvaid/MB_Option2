import type { Meta, StoryObj } from '@storybook/vue3'
import DesignSystemDemo from '@/views/Settings/DesignSystemDemo.vue'

const meta = {
  title: 'Archive/Legacy Foundation/Design System Demo',
  component: DesignSystemDemo,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Stakeholder-facing live demo screen showing token-driven UI parity between app runtime and Storybook.',
      },
    },
  },
} satisfies Meta<typeof DesignSystemDemo>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
