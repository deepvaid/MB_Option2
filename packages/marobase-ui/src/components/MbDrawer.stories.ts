import { ref, watch } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import MbDrawer from './MbDrawer.vue';
import type { MbDrawerProps } from './MbDrawer.types';

const meta: Meta<MbDrawerProps> = {
  title: 'Overlays/MbDrawer',
  component: MbDrawer,
  tags: ['autodocs'],
  args: {
    modelValue: true,
    title: 'Edit widget',
    subtitle: 'Revenue Share (Top 10)',
    primaryLabel: 'Save changes',
    secondaryLabel: 'Cancel',
    width: 440,
    showBackdrop: false,
    closeOnBackdrop: true,
    dismissible: true
  },
  render: (args) => ({
    components: { MbDrawer },
    setup() {
      const open = ref(Boolean(args.modelValue));

      watch(
        () => args.modelValue,
        (next) => {
          open.value = Boolean(next);
        }
      );

      return { args, open };
    },
    template: `
      <div style="display:grid;align-items:stretch;justify-items:stretch;padding:0;width:100%;min-height:720px;background:#f7f7f8;">
        <MbDrawer v-bind="args" :model-value="open" @update:modelValue="open = $event">
          <form class="mb-drawer__form" @submit.prevent>
            <label class="mb-drawer__field">
              <span class="mb-drawer__field-label">Title</span>
              <input class="mb-drawer__input" type="text" value="Revenue Share (Top 10)" />
            </label>
            <label class="mb-drawer__field">
              <span class="mb-drawer__field-label">Chart type</span>
              <span class="mb-drawer__input-wrap mb-drawer__input-wrap--select">
                <span class="mb-drawer__select-value">Bar</span>
                <span class="mb-drawer__chevron" aria-hidden="true">v</span>
              </span>
            </label>
            <label class="mb-drawer__field">
              <span class="mb-drawer__field-label">Data source</span>
              <span class="mb-drawer__input-wrap mb-drawer__input-wrap--select">
                <span class="mb-drawer__select-value">Commerce Cloud</span>
                <span class="mb-drawer__chevron" aria-hidden="true">v</span>
              </span>
            </label>
            <label class="mb-drawer__field">
              <span class="mb-drawer__field-label">Metric</span>
              <span class="mb-drawer__input-wrap mb-drawer__input-wrap--select">
                <span class="mb-drawer__select-value">Revenue</span>
                <span class="mb-drawer__chevron" aria-hidden="true">v</span>
              </span>
            </label>
            <div class="mb-drawer__row mb-drawer__row--2">
              <label class="mb-drawer__field">
                <span class="mb-drawer__field-label">Group by</span>
                <span class="mb-drawer__input-wrap mb-drawer__input-wrap--select">
                  <span class="mb-drawer__select-value">Product</span>
                  <span class="mb-drawer__chevron" aria-hidden="true">v</span>
                </span>
              </label>
              <label class="mb-drawer__field">
                <span class="mb-drawer__field-label">Date range</span>
                <span class="mb-drawer__input-wrap mb-drawer__input-wrap--select">
                  <span class="mb-drawer__select-value">Last 30 days</span>
                  <span class="mb-drawer__chevron" aria-hidden="true">v</span>
                </span>
              </label>
            </div>
            <label class="mb-drawer__check">
              <input type="checkbox" checked />
              <span>Compare with previous period</span>
            </label>
          </form>
          <template #footer>
            <button type="button" class="mb-drawer__footer-btn mb-drawer__footer-btn--secondary" @click="open = false">Cancel</button>
            <button type="button" class="mb-drawer__footer-btn mb-drawer__footer-btn--primary" @click="open = false">Save changes</button>
          </template>
        </MbDrawer>
      </div>
    `
  })
};

export default meta;

type Story = StoryObj<typeof meta>;

export const WidgetEditFlyout: Story = {};

export const DataSourceFlyout: Story = {
  render: () => ({
    components: { MbDrawer },
    setup() {
      const open = ref(true);
      return { open };
    },
    template: `
      <div style="display:grid;align-items:stretch;justify-items:stretch;padding:0;width:100%;min-height:720px;background:#f7f7f8;">
        <MbDrawer
          v-model="open"
          title="New data source"
          subtitle="Connect a workspace data source"
          primary-label="Connect"
          secondary-label="Cancel"
          :width="460"
        >
          <form class="mb-drawer__form" @submit.prevent>
            <label class="mb-drawer__field">
              <span class="mb-drawer__field-label">Name</span>
              <input class="mb-drawer__input" type="text" placeholder="Marketing Cloud - production" />
            </label>
            <label class="mb-drawer__field">
              <span class="mb-drawer__field-label">Type</span>
              <span class="mb-drawer__input-wrap mb-drawer__input-wrap--select">
                <span class="mb-drawer__select-value">Marketing Cloud</span>
                <span class="mb-drawer__chevron" aria-hidden="true">v</span>
              </span>
            </label>
            <label class="mb-drawer__field">
              <span class="mb-drawer__field-label">Endpoint</span>
              <input class="mb-drawer__input" type="text" placeholder="https://..." />
            </label>
            <label class="mb-drawer__field">
              <span class="mb-drawer__field-label">API key</span>
              <input class="mb-drawer__input" type="password" placeholder="sk-..." />
            </label>
            <section class="mb-drawer__note" aria-label="Connection note">
              <div class="mb-drawer__note-body">
                <strong>Credentials stay encrypted</strong>
                <p>Da Vinci can only read metadata until the connection is approved.</p>
              </div>
            </section>
          </form>
          <template #footer>
            <button type="button" class="mb-drawer__footer-btn mb-drawer__footer-btn--secondary" @click="open = false">Cancel</button>
            <button type="button" class="mb-drawer__footer-btn mb-drawer__footer-btn--primary" @click="open = false">Connect</button>
          </template>
        </MbDrawer>
      </div>
    `
  })
};
