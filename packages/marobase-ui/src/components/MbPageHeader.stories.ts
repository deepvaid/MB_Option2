import type { Meta, StoryObj } from '@storybook/vue3';
import MbPageHeader from './MbPageHeader.vue';
import MbButton from './MbButton.vue';
import type { MbPageHeaderProps } from './MbPageHeader.types';

const meta: Meta<MbPageHeaderProps> = {
  title: 'Marobase/MbPageHeader',
  component: MbPageHeader,
  tags: ['autodocs'],
  args: {
    title: 'Email campaigns',
    eyebrow: 'Marketing',
    subtitle: 'Plan, send, and measure every message your brand sends out into the world.',
    size: 'sm',
    align: 'start',
    breadcrumbs: [
      { label: 'Home', href: '#' },
      { label: 'Marketing', href: '#' },
      { label: 'Campaigns' },
    ],
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    align: { control: 'inline-radio', options: ['start', 'center'] },
  },
  render: (args) => ({
    components: { MbPageHeader, MbButton },
    setup: () => ({ args }),
    template: `
      <div style="padding:32px;max-width:1200px;">
        <MbPageHeader v-bind="args">
          <template #actions>
            <MbButton label="Invite" style-type="outline" />
            <MbButton label="New campaign" />
          </template>
        </MbPageHeader>
      </div>
    `,
  }),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const DashboardTitle: Story = {
  args: {
    size: 'md',
    eyebrow: 'Dashboard',
    title: 'Good morning, Deepak',
    subtitle: "Here's how your store is performing today.",
    breadcrumbs: [],
  },
};

export const Hero: Story = {
  args: {
    size: 'lg',
    eyebrow: 'Q2 Launch',
    title: 'Campaign performance highlights',
    subtitle: 'A large-display variant for hero moments and executive summaries.',
    breadcrumbs: [],
  },
};
