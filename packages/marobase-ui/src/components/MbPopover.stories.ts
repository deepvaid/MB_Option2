import { ref, watch } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import MbPopover from './MbPopover.vue';
import type { MbPopoverProps } from './MbPopover.types';

const meta: Meta<MbPopoverProps> = {
  title: 'Overlays/MbPopover',
  component: MbPopover,
  tags: ['autodocs'],
  args: {
    modelValue: true,
    title: 'Filters',
    description: 'Refine the current dashboard view.',
    primaryLabel: 'Apply',
    secondaryLabel: 'Cancel',
    dismissible: true,
    closeOnAction: false,
    showArrow: true,
    width: 420
  },
  render: (args) => ({
    components: { MbPopover },
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
      <div style="display:grid;gap:16px;align-items:start;justify-items:start;padding:24px;background:#f7f7f8;min-height:520px;">
        <button style="height:36px;border-radius:999px;border:1px solid #e5e5e5;background:#ffffff;color:#1a1814;padding:0 14px;font:600 13px/1 Inter, sans-serif;" @click="open = true">Open popover</button>
        <MbPopover v-bind="args" :model-value="open" @update:modelValue="open = $event" />
      </div>
    `
  })
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const FiltersPopover: Story = {
  render: () => ({
    components: { MbPopover },
    setup() {
      const open = ref(true);
      return { open };
    },
    template: `
      <div style="display:grid;gap:16px;align-items:start;justify-items:start;padding:24px;background:#f7f7f8;min-height:640px;">
        <button style="height:36px;border-radius:999px;border:1px solid #e5e5e5;background:#ffffff;color:#1a1814;padding:0 14px;font:600 13px/1 Inter, sans-serif;" @click="open = true">Filters</button>
        <MbPopover v-model="open" title="Filters" :width="420" aria-label="Dashboard filters popover">
          <div style="display:grid;gap:14px;">
            <v-select label="Data source" :items="['Marketing Cloud', 'Commerce Cloud', 'Service Cloud']" model-value="Marketing Cloud" />
            <v-select label="Owner" :items="['Anyone', 'Me', 'My team']" model-value="Anyone" />

            <section>
              <div style="font:600 11.5px/1 Inter, sans-serif;letter-spacing:1px;text-transform:uppercase;color:#737373;margin-bottom:8px;">Channel</div>
              <div style="display:flex;flex-wrap:wrap;gap:6px;">
                <v-chip variant="tonal" color="primary">Email</v-chip>
                <v-chip>SMS</v-chip>
                <v-chip>Push</v-chip>
                <v-chip>Web</v-chip>
                <v-chip>In-app</v-chip>
              </div>
            </section>

            <section>
              <div style="font:600 11.5px/1 Inter, sans-serif;letter-spacing:1px;text-transform:uppercase;color:#737373;margin-bottom:8px;">Campaign type</div>
              <div style="display:flex;flex-wrap:wrap;gap:6px;">
                <v-chip>Promotion</v-chip>
                <v-chip variant="tonal" color="primary">Newsletter</v-chip>
                <v-chip>Transactional</v-chip>
                <v-chip>Drip</v-chip>
              </div>
            </section>

            <section>
              <div style="font:600 11.5px/1 Inter, sans-serif;letter-spacing:1px;text-transform:uppercase;color:#737373;margin-bottom:8px;">Customer segment</div>
              <div style="display:flex;flex-wrap:wrap;gap:6px;">
                <v-chip variant="tonal" color="primary">High value</v-chip>
                <v-chip>New</v-chip>
                <v-chip>VIP</v-chip>
                <v-chip>Lapsed</v-chip>
              </div>
            </section>
          </div>
          <template #footer>
            <button style="height:34px;border:0;background:transparent;color:#737373;margin-right:auto;padding:0 12px;font:600 13px/1 Inter, sans-serif;">Reset</button>
            <button style="height:34px;border:0;background:transparent;color:#737373;padding:0 12px;font:600 13px/1 Inter, sans-serif;" @click="open = false">Cancel</button>
            <button style="height:34px;border-radius:999px;border:1px solid #1ab7ea;background:#1ab7ea;color:#fff;padding:0 14px;font:600 13px/1 Inter, sans-serif;" @click="open = false">Apply</button>
          </template>
        </MbPopover>
      </div>
    `
  })
};

export const AnchoredDetail: Story = {
  render: () => ({
    components: { MbPopover },
    setup() {
      const open = ref(true);
      return { open };
    },
    template: `
      <div style="display:grid;gap:16px;align-items:start;justify-items:start;padding:24px;background:#f7f7f8;min-height:520px;">
        <button style="height:36px;border-radius:999px;border:1px solid #e5e5e5;background:#ffffff;color:#1a1814;padding:0 14px;font:600 13px/1 Inter, sans-serif;" @click="open = true">Widget details</button>
        <MbPopover v-model="open" title="Revenue Share (Top 10)" :width="340" aria-label="Widget details popover">
          <p style="font:400 12.5px/1.45 Inter, sans-serif;color:#737373;margin:0 0 12px;">Top 10 products by revenue, last 30 days, vs previous period.</p>
          <div style="display:grid;border-top:1px solid #e5e5e5;">
            <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #e5e5e5;font:500 13px/1.3 Inter, sans-serif;"><span style="color:#737373;">Source</span><span>Commerce Cloud</span></div>
            <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #e5e5e5;font:500 13px/1.3 Inter, sans-serif;"><span style="color:#737373;">Owner</span><span>Dana Vega</span></div>
            <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #e5e5e5;font:500 13px/1.3 Inter, sans-serif;"><span style="color:#737373;">Updated</span><span>2 minutes ago</span></div>
            <div style="display:flex;justify-content:space-between;padding:10px 0 0;font:500 13px/1.3 Inter, sans-serif;"><span style="color:#737373;">Visibility</span><span>Workspace</span></div>
          </div>
          <template #footer>
            <button style="height:32px;border:0;background:transparent;color:#737373;padding:0 12px;font:600 12.5px/1 Inter, sans-serif;">Share</button>
            <button style="height:32px;border-radius:999px;border:1px solid #1ab7ea;background:#1ab7ea;color:#fff;padding:0 13px;font:600 12.5px/1 Inter, sans-serif;">Edit</button>
          </template>
        </MbPopover>
      </div>
    `
  })
};
