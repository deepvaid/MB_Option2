import type { Meta, StoryObj } from '@storybook/vue3'

const meta = {
  title: 'Introduction/MaroBase',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Prototype UI is built from `@marobase/ui` (Vue components in `packages/marobase-ui`) plus Vuetify for layout and data tables. Design tokens: import `packages/marobase-ui/src/tokens/index.css` in the app (see `src/main.ts`) and run `npm run tokens:build` when JSON tokens change.',
      },
    },
  },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Readme: Story = {
  render: () => ({
    template: '<p class="text-body-1">Use the sidebar: <strong>Foundations</strong> for tokens, <strong>Components</strong> for MaroBase (Mb*) stories. Legacy Vuetify demos live under <strong>Archive</strong>.</p>',
  }),
}
