import { ref, watch } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import MbTabs from './MbTabs.vue';
import type {
  MbTabItem,
  MbTabsOrientation,
  MbTabsProps,
  MbTabsState,
  MbTabsVariant
} from './MbTabs.types';

const stateOptions: MbTabsState[] = ['default', 'hover', 'focus', 'disabled'];
const variantOptions: MbTabsVariant[] = ['pill', 'line'];
const orientationOptions: MbTabsOrientation[] = ['horizontal', 'vertical'];

const workspaceItems: MbTabItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'campaigns', label: 'Campaigns', badge: 12 },
  { id: 'audience', label: 'Audience' },
  { id: 'content', label: 'Content' },
  { id: 'settings', label: 'Settings' }
];

const verticalItems: MbTabItem[] = [
  { id: 'all', label: 'All campaigns' },
  { id: 'email', label: 'Email Campaigns', badge: 8 },
  { id: 'transactional', label: 'Transactional Email' },
  { id: 'tags', label: 'Campaign Tags' },
  { id: 'templates', label: 'Templates', disabled: true }
];

const filterItems: MbTabItem[] = [
  { id: 'all', label: 'All', badge: 1471 },
  { id: 'completed', label: 'Completed', badge: 892 },
  { id: 'processing', label: 'Processing', badge: 234 },
  { id: 'unfulfilled', label: 'Not Fulfilled', badge: 345 }
];

const meta: Meta<MbTabsProps> = {
  title: 'Components/MbTabs',
  component: MbTabs,
  tags: ['autodocs'],
  args: {
    items: workspaceItems,
    modelValue: 'overview',
    state: 'default',
    disabled: false,
    ariaLabel: 'Workspace tabs',
    variant: 'line',
    orientation: 'horizontal'
  },
  argTypes: {
    state: {
      control: 'inline-radio',
      options: stateOptions
    },
    variant: {
      control: 'inline-radio',
      options: variantOptions
    },
    orientation: {
      control: 'inline-radio',
      options: orientationOptions
    }
  },
  render: (args) => ({
    components: { MbTabs },
    setup() {
      const active = ref(args.modelValue ?? 'overview');

      watch(
        () => args.modelValue,
        (next) => {
          active.value = next ?? 'overview';
        }
      );

      return { args, active };
    },
    template: `
      <div style="display:grid;gap:16px;align-items:start;justify-items:start;padding:24px;background:#f7f7f8;min-height:220px;">
        <MbTabs v-bind="args" :model-value="active" @update:modelValue="active = $event" />
        <p style="margin:0;color:#737373;font:500 12.5px/1.4 Inter, sans-serif;">Active tab: {{ active }}</p>
      </div>
    `
  })
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const HorizontalTabs: Story = {
  args: {
    items: workspaceItems,
    modelValue: 'overview',
    variant: 'line',
    orientation: 'horizontal',
    ariaLabel: 'Marketing workspace sections'
  }
};

export const PageHeaderTabs: Story = {
  render: () => ({
    components: { MbTabs },
    setup() {
      const active = ref('marketing');
      const items: MbTabItem[] = [
        { id: 'marketing', label: 'Marketing' },
        { id: 'commerce', label: 'Commerce' },
        { id: 'audience', label: 'Audience' },
        { id: 'ops', label: 'Operations' }
      ];

      return { active, items };
    },
    template: `
      <section style="display:grid;gap:16px;padding:24px;background:#f7f7f8;min-height:260px;">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:16px;">
          <div>
            <div style="font:500 12px/1.2 Inter, sans-serif;color:#737373;margin-bottom:4px;">Workspace</div>
            <div style="font:600 22px/1.2 Inter, sans-serif;color:#1a1814;">Marketing Performance</div>
          </div>
          <div style="display:flex;gap:8px;">
            <button style="height:36px;border-radius:999px;border:1px solid #e5e5e5;background:#ffffff;color:#1a1814;padding:0 14px;font:600 13px/1 Inter, sans-serif;">Filters</button>
            <button style="height:36px;border-radius:999px;border:1px solid #e5e5e5;background:#ffffff;color:#1a1814;padding:0 14px;font:600 13px/1 Inter, sans-serif;">Last 30 days</button>
            <button style="height:36px;border-radius:999px;border:1px solid #1ab7ea;background:#1ab7ea;color:#fff;padding:0 14px;font:600 13px/1 Inter, sans-serif;">Add widget</button>
          </div>
        </div>
        <MbTabs
          v-model="active"
          :items="items"
          variant="line"
          aria-label="Dashboard sections"
        />
      </section>
    `
  })
};

export const VerticalSection: Story = {
  args: {
    items: verticalItems,
    modelValue: 'email',
    variant: 'line',
    orientation: 'vertical',
    ariaLabel: 'Campaign navigation'
  }
};

export const DisabledAndCounts: Story = {
  args: {
    items: filterItems,
    modelValue: 'all',
    variant: 'pill',
    orientation: 'horizontal',
    ariaLabel: 'Order status filters'
  }
};
