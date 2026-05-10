import type { Meta, StoryObj } from '@storybook/vue3'
import MbEmptyState from './MbEmptyState.vue'
import MbButton from './MbButton.vue'

const meta = {
  title: 'Components/MbEmptyState',
  component: MbEmptyState,
  tags: ['autodocs'],
} satisfies Meta<typeof MbEmptyState>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'No results yet',
    description: 'Try adjusting your filters or search to find what you are looking for.',
  },
}

export const WithAction: Story = {
  render: (args) => ({
    components: { MbEmptyState, MbButton },
    setup() {
      return { args }
    },
    template: `
      <MbEmptyState v-bind="args">
        <template #actions>
          <MbButton style-type="filled" size="md" label="Create item" @click="() => {}" />
        </template>
      </MbEmptyState>
    `,
  }),
  args: {
    title: 'Nothing here',
    description: 'Get started by creating your first record.',
  },
}
