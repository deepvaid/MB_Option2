import { ref, watch } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import MpFormDrawer from './MpFormDrawer.vue'

const meta = {
  title: 'Overlays/MpFormDrawer',
  component: MpFormDrawer,
  tags: ['autodocs'],
  args: {
    title: 'Edit widget',
    subtitle: 'Revenue Share (Top 10)',
    width: 440,
  },
  argTypes: {
    title: { control: 'text' },
    subtitle: { control: 'text' },
    width: { control: { type: 'number', min: 320, max: 800, step: 40 } },
  },
  render: (args) => ({
    components: { MpFormDrawer },
    setup() {
      const open = ref(true)

      watch(
        () => args.title,
        () => {
          open.value = true
        },
      )

      return { args, open }
    },
    template: `
      <section style="min-height:720px;background:rgb(var(--v-theme-background));padding:24px;">
        <v-btn variant="outlined" prepend-icon="panel-right" @click="open = true">Open flyout</v-btn>
        <MpFormDrawer v-bind="args" v-model="open">
          <div style="display:grid;gap:14px;">
            <v-text-field label="Title" model-value="Revenue Share (Top 10)" />
            <v-select label="Chart type" :items="['Bar', 'Line', 'Pie', 'Table', 'KPI']" model-value="Bar" />
            <v-select label="Data source" :items="['Marketing Cloud', 'Commerce Cloud']" model-value="Commerce Cloud" />
            <v-select label="Metric" :items="['Revenue', 'Orders', 'Customers']" model-value="Revenue" />
            <v-select label="Group by" :items="['Product', 'Channel', 'Segment']" model-value="Product" />
            <v-select label="Date range" :items="['Last 7 days', 'Last 30 days', 'Last 90 days']" model-value="Last 30 days" />
            <v-switch label="Compare with previous period" color="primary" inset density="compact" hide-details :model-value="true" />
          </div>
          <template #footer>
            <v-spacer />
            <v-btn variant="text" @click="open = false">Cancel</v-btn>
            <v-btn color="primary" @click="open = false">Save changes</v-btn>
          </template>
        </MpFormDrawer>
      </section>
    `,
  }),
} satisfies Meta<typeof MpFormDrawer>

export default meta
type Story = StoryObj<typeof meta>

export const WidgetEditFlyout: Story = {}

export const DataSourceForm: Story = {
  args: {
    title: 'New data source',
    subtitle: 'Connect a workspace data source',
    width: 460,
  },
  render: (args) => ({
    components: { MpFormDrawer },
    setup() {
      const open = ref(true)
      return { args, open }
    },
    template: `
      <section style="min-height:720px;background:rgb(var(--v-theme-background));padding:24px;">
        <v-btn color="primary" prepend-icon="database" @click="open = true">Add data source</v-btn>
        <MpFormDrawer v-bind="args" v-model="open">
          <div style="display:grid;gap:14px;">
            <v-text-field label="Name" placeholder="Marketing Cloud - production" />
            <v-select label="Type" :items="['Marketing Cloud', 'Commerce Cloud', 'Service Cloud', 'Snowflake', 'BigQuery']" model-value="Marketing Cloud" />
            <v-text-field label="Endpoint" placeholder="https://..." />
            <v-text-field label="API key" type="password" placeholder="sk-..." />
            <v-alert type="info" variant="tonal" density="compact">
              Da Vinci can only read metadata until the connection is approved.
            </v-alert>
          </div>
          <template #footer>
            <v-spacer />
            <v-btn variant="text" @click="open = false">Cancel</v-btn>
            <v-btn color="primary" @click="open = false">Connect</v-btn>
          </template>
        </MpFormDrawer>
      </section>
    `,
  }),
}
