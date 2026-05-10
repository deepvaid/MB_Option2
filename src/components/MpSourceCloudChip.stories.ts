import type { Meta, StoryObj } from '@storybook/vue3'
import MpSourceCloudChip from './MpSourceCloudChip.vue'

const meta = {
  title: 'Data Display/MpSourceCloudChip',
  component: MpSourceCloudChip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
### Overview
The \`MpSourceCloudChip\` component is a small pill that identifies which source cloud a dashboard widget pulls from — Marketing, Commerce, Service, Neto, Contacts, or Analytics.

It reads label and icon from the canonical \`DASHBOARD_SOURCE_META\` map in the dashboards store, so the chip and the rest of the app stay aligned.

### 🟢 Do's
- **Do** place this chip in widget footers or eyebrows so users can immediately see where the data is coming from.
- **Do** use \`size="sm"\` or \`iconOnly\` in tight layouts (KPI cards).

### 🔴 Don'ts
- **Don't** wrap the chip in another colored background — it's intentionally neutral.
- **Don't** use it as a status indicator. Use \`MpStatusChip\` for status semantics.
        `,
      },
    },
  },
  argTypes: {
    dataSource: {
      control: 'select',
      options: ['commerce', 'marketing', 'service', 'neto', 'contacts', 'analytics'],
    },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    iconOnly: { control: 'boolean' },
  },
} satisfies Meta<typeof MpSourceCloudChip>

export default meta
type Story = StoryObj<typeof meta>

export const Marketing: Story = {
  args: { dataSource: 'marketing', size: 'md' },
}

export const Commerce: Story = {
  args: { dataSource: 'commerce', size: 'md' },
}

export const Service: Story = {
  args: { dataSource: 'service', size: 'md' },
}

export const Neto: Story = {
  args: { dataSource: 'neto', size: 'md' },
}

export const SmallSize: Story = {
  args: { dataSource: 'marketing', size: 'sm' },
}

export const IconOnly: Story = {
  args: { dataSource: 'commerce', size: 'sm', iconOnly: true },
}
