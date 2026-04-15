import type { Meta, StoryObj } from '@storybook/vue3'
import MpOverviewChart from './MpOverviewChart.vue'

const samplePoints = [
  { label: 'Week 1', revenue: 154000, engagement: 21.8, orders: 482 },
  { label: 'Week 2', revenue: 176200, engagement: 23.4, orders: 530 },
  { label: 'Week 3', revenue: 163800, engagement: 22.7, orders: 501 },
  { label: 'Week 4', revenue: 198500, engagement: 25.6, orders: 604 },
  { label: 'Week 5', revenue: 214900, engagement: 27.2, orders: 662 },
  { label: 'Today', revenue: 228400, engagement: 28.1, orders: 708 },
]

const meta = {
  title: 'Data Display/MpOverviewChart',
  component: MpOverviewChart,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A compact overview chart for dashboard surfaces, combining a revenue trend line with engagement bars and keyboard-focusable hotspots.',
      },
    },
  },
  args: {
    points: samplePoints,
  },
} satisfies Meta<typeof MpOverviewChart>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WeeklySnapshot: Story = {
  args: {
    points: [
      { label: 'Mon', revenue: 28400, engagement: 22.1, orders: 96 },
      { label: 'Tue', revenue: 30200, engagement: 23.2, orders: 112 },
      { label: 'Wed', revenue: 29750, engagement: 22.8, orders: 108 },
      { label: 'Thu', revenue: 32100, engagement: 24.4, orders: 121 },
      { label: 'Fri', revenue: 34680, engagement: 25.2, orders: 136 },
      { label: 'Sat', revenue: 33540, engagement: 24.1, orders: 130 },
      { label: 'Sun', revenue: 35980, engagement: 26.5, orders: 144 },
    ],
  },
}
