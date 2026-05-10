import { ref, watch } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import MbModal from './MbModal.vue';
import type { MbModalProps } from './MbModal.types';

const meta: Meta<MbModalProps> = {
  title: 'Overlays/MbModal',
  component: MbModal,
  tags: ['autodocs'],
  args: {
    modelValue: true,
    title: 'Delete dashboard?',
    description: 'This will permanently remove Marketing Performance and its 14 widgets. This action cannot be undone.',
    primaryLabel: 'Delete',
    secondaryLabel: 'Cancel',
    dismissible: true,
    closeOnOverlay: true,
    closeOnAction: false,
    width: 440,
    tone: 'danger'
  },
  argTypes: {
    tone: {
      control: 'inline-radio',
      options: ['default', 'danger']
    }
  },
  render: (args) => ({
    components: { MbModal },
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
      <div style="display:grid;gap:16px;align-items:start;justify-items:start;padding:24px;width:100%;min-height:520px;background:#f7f3ec;">
        <button style="height:36px;border-radius:999px;border:1px solid #e6dfd1;background:#fdfbf7;color:#1a1814;padding:0 14px;font:600 13px/1 Inter, sans-serif;" @click="open = true">Open modal</button>
        <MbModal v-bind="args" :model-value="open" @update:modelValue="open = $event" />
      </div>
    `
  })
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const DeleteDashboardConfirm: Story = {
  args: {
    modelValue: true,
    title: 'Delete dashboard?',
    description: 'This will permanently remove Marketing Performance and its 14 widgets. This action cannot be undone.',
    primaryLabel: 'Delete',
    secondaryLabel: 'Cancel',
    width: 440,
    tone: 'danger'
  }
};

export const AddDataSourceForm: Story = {
  render: () => ({
    components: { MbModal },
    setup() {
      const open = ref(true);
      return { open };
    },
    template: `
      <div style="display:grid;gap:16px;align-items:start;justify-items:start;padding:24px;width:100%;min-height:620px;background:#f7f3ec;">
        <button style="height:36px;border-radius:999px;border:1px solid #1ab7ea;background:#1ab7ea;color:#fff;padding:0 14px;font:600 13px/1 Inter, sans-serif;" @click="open = true">Add data source</button>
        <MbModal
          v-model="open"
          title="New data source"
          primary-label="Connect"
          secondary-label="Cancel"
          :width="520"
          aria-label="New data source dialog"
        >
          <div style="display:grid;gap:14px;">
            <v-text-field label="Name" placeholder="Marketing Cloud - production" />
            <v-select label="Type" :items="['Marketing Cloud', 'Commerce Cloud', 'Service Cloud', 'Snowflake', 'BigQuery']" model-value="Marketing Cloud" />
            <v-text-field label="Endpoint" placeholder="https://..." />
            <v-text-field label="API key" type="password" placeholder="sk-..." />
          </div>
          <template #footer>
            <button style="height:36px;border:0;background:transparent;color:#7a7466;padding:0 14px;font:600 13px/1 Inter, sans-serif;" @click="open = false">Cancel</button>
            <button style="height:36px;border-radius:999px;border:1px solid #1ab7ea;background:#1ab7ea;color:#fff;padding:0 16px;font:600 13px/1 Inter, sans-serif;" @click="open = false">Connect</button>
          </template>
        </MbModal>
      </div>
    `
  })
};
