import type { Meta, StoryObj } from '@storybook/vue3'
import MpKpiCard from './MpKpiCard.vue'

const meta = {
  title: 'Data Display/MpKpiCard',
  component: MpKpiCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
### Overview
\`MpKpiCard\` (Key Performance Indicator) is used primarily on dashboards to show high-level metrics, numbers, and their recent trends at a glance.

### 🟢 Do's
- **Do** arrange KPI cards in responsive \`v-row\` grids (usually 3 or 4 across on desktop).
- **Do** use semantic colors for the \`color\` prop based on the metric type (e.g., \`success\` for Revenue, \`primary\` for neutral stats like Total Users).
- **Do** provide a \`trend\` (e.g., "+12%") and an accompanying \`subStat\` context (e.g., "vs last week") to make the number actionable.

### 🔴 Don'ts
- **Don't** use complex charts inside a KPI Card. It should strictly contain the single top-level metric.
- **Don't** stretch KPI cards too wide. If you have only 2 metrics, don't make them 50% width on a huge screen; constrain their max-width.
- **Don't** forget to set \`trendPositive="true/false"\`. A dropping number isn't always bad (e.g., Bounce Rate dropping is good, Revenue dropping is bad). Control the color explicitly.

### 💡 Best Practices
- **Icons:** Pick an \`icon\` that cleanly represents the metric, and it will be rendered as a subtle watermarked background.
- **Typography:** The main value handles very large numbers automatically, but it's best practice to format your inputs cleanly (e.g., "1.2M" instead of "1,200,000" if space is tight).
        `,
      },
    },
  },
  argTypes: {
    label: { control: 'text' },
    value: { control: 'text' },
    icon: { control: 'text' },
    color: { control: 'select', options: ['primary', 'success', 'warning', 'error', 'secondary'] },
    trend: { control: 'text' },
    trendPositive: { control: 'boolean' },
    subStat: { control: 'text' },
  },
} satisfies Meta<typeof MpKpiCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Total Revenue',
    value: '$12,430',
    icon: 'mdi-currency-usd',
    color: 'success',
    trend: '+12.5%',
    trendPositive: true,
    subStat: 'vs last month',
  },
}

export const NegativeTrend: Story = {
  args: {
    label: 'Bounce Rate',
    value: '4.2%',
    icon: 'mdi-email-alert-outline',
    color: 'error',
    trend: '-2.1%',
    trendPositive: false,
    subStat: 'vs last week',
  },
}

export const NoTrend: Story = {
  args: {
    label: 'Active Campaigns',
    value: '8',
    icon: 'mdi-bullhorn-outline',
    color: 'primary',
  },
}

export const DashboardRow: Story = {
  render: () => ({
    components: { MpKpiCard },
    template: `
      <v-row>
        <v-col cols="12" sm="6" md="3">
          <MpKpiCard label="Total Revenue" value="$12,430" icon="mdi-currency-usd" color="success" trend="+12.5%" :trendPositive="true" subStat="vs last month" />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <MpKpiCard label="Orders Today" value="47" icon="mdi-package-variant-closed" color="primary" trend="+8" :trendPositive="true" subStat="vs yesterday" />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <MpKpiCard label="Active Campaigns" value="8" icon="mdi-bullhorn-outline" color="secondary" />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <MpKpiCard label="Open Rate" value="24.3%" icon="mdi-email-open-outline" color="warning" trend="-1.2%" :trendPositive="false" subStat="vs avg" />
        </v-col>
      </v-row>
    `,
  }),
  args: {} as any, // Fixes TS strict mode error
}
