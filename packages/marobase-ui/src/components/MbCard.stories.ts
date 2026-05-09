import type { Meta, StoryObj } from '@storybook/vue3';
import MbCard from './MbCard.vue';
import type { MbCardProps } from './MbCard.types';

const meta: Meta<MbCardProps> = {
  title: 'Components/MbCard',
  component: MbCard,
  tags: ['autodocs'],
  args: {
    tone: 'default',
    radius: 'lg',
    padding: 'md',
    interactive: false,
    as: 'article',
  },
  argTypes: {
    tone: { control: 'inline-radio', options: ['default', 'soft', 'warm', 'inverse'] },
    radius: { control: 'inline-radio', options: ['sm', 'md', 'lg', 'xl'] },
    padding: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    interactive: { control: 'boolean' },
    as: { control: 'text' },
  },
  render: (args) => ({
    components: { MbCard },
    setup: () => ({ args }),
    template: `
      <div style="padding:24px;max-width:720px;">
        <MbCard v-bind="args">
          <template #header>
            <strong>Revenue Overview</strong>
            <span style="opacity:.7;font-size:12px;">Last 30 days</span>
          </template>
          <p style="margin:0;">A flexible foundational card with optional media, header, and footer slots.</p>
          <template #footer>
            <span style="opacity:.78;font-size:12px;">Updated 5 min ago</span>
            <span style="font-weight:600;">$248,912</span>
          </template>
        </MbCard>
      </div>
    `,
  }),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Tones: Story = {
  render: () => ({
    components: { MbCard },
    template: `
      <div style="display:grid;grid-template-columns:repeat(2,minmax(240px,1fr));gap:20px;padding:24px;">
        <MbCard tone="default"><strong>Default</strong><p style="margin:0;">Standard surface treatment.</p></MbCard>
        <MbCard tone="soft"><strong>Soft</strong><p style="margin:0;">Blue-tinted card for secondary emphasis.</p></MbCard>
        <MbCard tone="warm"><strong>Warm</strong><p style="margin:0;">Warm neutral treatment for content blocks.</p></MbCard>
        <MbCard tone="inverse"><strong>Inverse</strong><p style="margin:0;">High-contrast hero card style.</p></MbCard>
      </div>
    `,
  }),
};

export const Interactive: Story = {
  args: {
    interactive: true,
    tone: 'soft',
    radius: 'xl',
    padding: 'lg',
  },
};
