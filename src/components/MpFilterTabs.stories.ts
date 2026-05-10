import { ref, watch } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import MpFilterTabs from './MpFilterTabs.vue'

const orderTabs = [
  { label: 'All', key: 'all', count: 1471 },
  { label: 'Completed', key: 'completed', count: 892 },
  { label: 'Processing', key: 'processing', count: 234 },
  { label: 'Not Fulfilled', key: 'unfulfilled', count: 345 },
]

const campaignTabs = [
  { label: 'All', key: 'all', count: 8 },
  { label: 'Drafts', key: 'drafts', count: 2 },
  { label: 'Scheduled', key: 'scheduled', count: 1 },
  { label: 'Sent', key: 'sent', count: 5 },
]

const noCountTabs = [
  { label: 'Overview', key: 'overview' },
  { label: 'Email', key: 'email' },
  { label: 'Commerce', key: 'commerce' },
  { label: 'Audience', key: 'audience' },
]

const manyTabs = [
  { label: 'All', key: 'all', count: 1471 },
  { label: 'Open', key: 'open', count: 234 },
  { label: 'Paid', key: 'paid', count: 892 },
  { label: 'Fulfilled', key: 'fulfilled', count: 736 },
  { label: 'Unfulfilled', key: 'unfulfilled', count: 345 },
  { label: 'Returned', key: 'returned', count: 42 },
  { label: 'Refunded', key: 'refunded', count: 19 },
  { label: 'Archived', key: 'archived', count: 88 },
]

const meta = {
  title: 'Navigation/MpFilterTabs',
  component: MpFilterTabs,
  tags: ['autodocs'],
  args: {
    modelValue: 'all',
    tabs: orderTabs,
    ariaLabel: 'Filter orders',
  },
  argTypes: {
    modelValue: { control: 'text', description: 'Active tab key (v-model)' },
    tabs: { control: 'object', description: 'Array of tab objects with label, key, and optional count' },
  },
  render: (args) => ({
    components: { MpFilterTabs },
    setup() {
      const active = ref(args.modelValue)

      watch(
        () => args.modelValue,
        (next) => {
          active.value = next
        },
      )

      return { args, active }
    },
    template: `
      <section style="padding:24px;background:rgb(var(--v-theme-background));min-height:180px;">
        <MpFilterTabs
          v-model="active"
          :tabs="args.tabs"
          :aria-label="args.ariaLabel"
        />
        <p class="text-body-2 text-medium-emphasis mt-4">Active tab: {{ active }}</p>
      </section>
    `,
  }),
} satisfies Meta<typeof MpFilterTabs>

export default meta
type Story = StoryObj<typeof meta>

export const OrderTabs: Story = {
  args: {
    modelValue: 'all',
    tabs: orderTabs,
    ariaLabel: 'Filter orders',
  },
}

export const CampaignTabs: Story = {
  args: {
    modelValue: 'all',
    tabs: campaignTabs,
    ariaLabel: 'Filter campaigns',
  },
}

export const NoCounts: Story = {
  args: {
    modelValue: 'overview',
    tabs: noCountTabs,
    ariaLabel: 'Filter workspace sections',
  },
}

export const ManyTabs: Story = {
  args: {
    modelValue: 'all',
    tabs: manyTabs,
    ariaLabel: 'Filter many order states',
  },
}
