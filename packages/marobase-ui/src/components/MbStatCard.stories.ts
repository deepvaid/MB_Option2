import type { Meta, StoryObj } from '@storybook/vue3';
import MbStatCard from './MbStatCard.vue';
import type { MbStatCardProps } from './MbStatCard.types';

const meta: Meta<MbStatCardProps> = {
  title: 'Components/MbStatCard',
  component: MbStatCard,
  tags: ['autodocs'],
  args: {
    label: 'Total revenue',
    value: '$48,920',
    caption: 'vs last 30 days',
    tone: 'default',
    trend: 'up',
    trendValue: '12.4%',
  },
  argTypes: {
    tone: { control: 'inline-radio', options: ['default', 'soft', 'warm', 'inverse'] },
    trend: { control: 'inline-radio', options: [undefined, 'up', 'down', 'flat'] },
    size: { control: 'inline-radio', options: ['md', 'lg'] },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Grid: Story = {
  render: (args) => ({
    components: { MbStatCard },
    setup: () => ({ args }),
    template: `
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:20px;padding:24px;max-width:1200px;">
        <MbStatCard label="Revenue" value="$48,920" unit="" caption="vs last 30 days" trend="up" trend-value="12.4%" />
        <MbStatCard label="Orders" value="1,284" caption="this week" trend="up" trend-value="3.1%" tone="soft" />
        <MbStatCard label="Avg. order" value="$38.10" caption="down from $40.20" trend="down" trend-value="5.2%" tone="warm" />
        <MbStatCard label="Active campaigns" value="12" caption="2 pending review" tone="inverse" />
      </div>
    `,
  }),
};

export const Hero: Story = {
  render: () => ({
    components: { MbStatCard },
    template: `
      <div style="padding:24px;max-width:520px;">
        <MbStatCard
          label="Monthly recurring"
          value="$248,912"
          caption="tracking ahead of forecast"
          trend="up"
          trend-value="18.7%"
          size="lg"
        />
      </div>
    `,
  }),
};

export const TrendStates: Story = {
  render: () => ({
    components: { MbStatCard },
    template: `
      <div style="display:grid;grid-template-columns:repeat(3,minmax(220px,1fr));gap:20px;padding:24px;">
        <MbStatCard label="Conversion" value="4.8%" trend="up" trend-value="0.7%" caption="week over week" />
        <MbStatCard label="Churn" value="2.1%" trend="down" trend-value="0.3%" caption="month over month" tone="warm" />
        <MbStatCard label="Pipeline health" value="Stable" trend="flat" trend-value="0.0%" caption="no major movement" tone="soft" />
      </div>
    `,
  }),
};

export const ToneAndSizeMatrix: Story = {
  render: () => ({
    components: { MbStatCard },
    template: `
      <div style="display:grid;grid-template-columns:repeat(2,minmax(260px,1fr));gap:20px;padding:24px;max-width:760px;">
        <MbStatCard label="Default / md" value="$62,180" caption="baseline surface" tone="default" size="md" />
        <MbStatCard label="Soft / md" value="$62,180" caption="tinted blue surface" tone="soft" size="md" />
        <MbStatCard label="Warm / lg" value="$145,902" caption="warm neutral emphasis" tone="warm" size="lg" />
        <MbStatCard label="Inverse / lg" value="$145,902" caption="high contrast hero tile" tone="inverse" size="lg" />
      </div>
    `,
  }),
};
