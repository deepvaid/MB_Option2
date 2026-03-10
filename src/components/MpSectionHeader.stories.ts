import type { Meta, StoryObj } from '@storybook/vue3'
import MpSectionHeader from './MpSectionHeader.vue'

const meta = {
  title: 'Layout/MpSectionHeader',
  component: MpSectionHeader,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
### Overview
The \`MpSectionHeader\` is used to divide content within a single page into logical blocks or sections, often placed above a grid of cards or a specific list.

### 🟢 Do's
- **Do** use this component to break up long scrolling pages with distinct visual anchors.
- **Do** use the \`#actions\` slot for simple, section-level controls like "View All" links or simple sorting dropdowns.
- **Do** keep titles brief and descriptive.

### 🔴 Don'ts
- **Don't** use this component inside a \`v-card\`. Cards have their own title patterns. This is strictly for dividing raw page real-estate.
- **Don't** place primary page actions (like "Save" or "Submit") in a section header. 

### 💡 Best Practices
- **Spacing:** The component comes with intrinsic bottom margins (\`mb-4\`). Ensure it has enough top spacing from preceding sections so it clearly anchors to the content below it.
        `,
      },
    },
  },
  argTypes: {
    title: { control: 'text' },
  },
} satisfies Meta<typeof MpSectionHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { title: 'Recent Orders' },
}

export const WithActions: Story = {
  render: (args) => ({
    components: { MpSectionHeader },
    setup: () => ({ args }),
    template: `
      <MpSectionHeader v-bind="args">
        <template #actions>
          <v-btn size="small" variant="text">Last 7 days</v-btn>
          <v-btn size="small" variant="text" color="primary">View All</v-btn>
        </template>
      </MpSectionHeader>
    `,
  }),
  args: { title: 'Top Campaigns' },
}
