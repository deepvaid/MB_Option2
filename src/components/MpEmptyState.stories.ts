import type { Meta, StoryObj } from '@storybook/vue3'
import MpEmptyState from './MpEmptyState.vue'

const meta = {
  title: 'Feedback/MpEmptyState',
  component: MpEmptyState,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
### Overview
The \`MpEmptyState\` component is used when a container (like a table, list, or dashboard widget) has no data to display.

### 🟢 Do's
- **Do** provide a helpful, action-oriented description explaining *why* it's empty and *what* to do next.
- **Do** include a primary action button (\`action-label\` and \`@action\`) if the user has permission to create the missing item.
- **Do** select an appropriate Material Design icon (\`icon\` prop) that semantically relates to the missing content (e.g., \`mdi-account-group-outline\` for missing contacts).

### 🔴 Don'ts
- **Don't** leave users dead-ended. Always provide a path forward, even if it's just "Clear filters" or a link to documentation.
- **Don't** blame the user. Say "No orders found for this search" rather than "You searched wrong."
- **Don't** use overly large or complex custom illustrations if the standard icon + text format suffices, to maintain consistency.

### 💡 Best Practices
- **Context:** If the empty state is caused by active search/filters yielding zero results, the action button should clear those filters.
- **First Use:** For "first use" scenarios (zero data ever created), the action button should be the primary "Create New" workflow.
        `,
      },
    },
  },
  argTypes: {
    icon: { control: 'text' },
    title: { control: 'text' },
    description: { control: 'text' },
    actionLabel: { control: 'text' },
    actionIcon: { control: 'text' },
  },
} satisfies Meta<typeof MpEmptyState>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    icon: 'mdi-package-variant-closed',
    title: 'No orders yet',
    description: 'Once customers start placing orders, they will appear here.',
    actionLabel: 'Create Draft Order',
    actionIcon: 'mdi-plus',
  },
}

export const Campaigns: Story = {
  args: {
    icon: 'mdi-email-outline',
    title: 'No campaigns yet',
    description: 'Create your first email campaign to engage your audience.',
    actionLabel: 'New Campaign',
    actionIcon: 'mdi-plus',
  },
}

export const SearchNoResults: Story = {
  args: {
    icon: 'mdi-magnify',
    title: 'No results found',
    description: 'Try adjusting your search or filter criteria.',
  },
}

export const Contacts: Story = {
  args: {
    icon: 'mdi-account-group-outline',
    title: 'No contacts yet',
    description: 'Import contacts or add them manually to start building your audience.',
    actionLabel: 'Import Contacts',
    actionIcon: 'mdi-upload',
  },
}
