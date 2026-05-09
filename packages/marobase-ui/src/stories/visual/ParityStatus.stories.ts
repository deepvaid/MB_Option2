import type { Meta, StoryObj } from '@storybook/vue3';
import manifest from '../../visual-manifest.json';

const meta = {
  title: 'Archive/Visual Parity/Status',
  tags: ['autodocs'],
  render: () => ({
    setup() {
      return { manifest };
    },
    template: `
      <section
        class="mp-visual-parity-status"
        style="display:grid;gap:24px;padding:32px;max-width:960px;margin:0 auto;font-family:Inter,sans-serif;color:#1f2937;"
        aria-labelledby="mp-visual-parity-status-title"
        data-visual-target
      >
        <header style="display:grid;gap:8px;">
          <p style="margin:0;font-size:12px;line-height:16px;letter-spacing:.08em;text-transform:uppercase;color:#6b7280;">
            Visual parity
          </p>
          <h1 id="mp-visual-parity-status-title" style="margin:0;font-size:32px;line-height:40px;font-weight:700;">
            Capture contract and manifest
          </h1>
          <p style="margin:0;max-width:70ch;font-size:16px;line-height:24px;color:#4b5563;">
            Stories that participate in visual parity should provide the contract below and expose
            a stable capture target.
          </p>
        </header>

        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;">
          <article style="padding:20px;border:1px solid #d1d5db;border-radius:16px;background:#fff;">
            <h2 style="margin:0 0 12px;font-size:18px;line-height:24px;">Required story parameters</h2>
            <ul style="margin:0;padding-left:20px;display:grid;gap:8px;">
              <li><code>parameters.visual.figmaNodeId</code></li>
              <li><code>parameters.visual.viewport</code></li>
              <li><code>parameters.visual.theme</code></li>
              <li><code>parameters.visual.state</code></li>
              <li><code>parameters.visual.variant</code></li>
            </ul>
          </article>

          <article style="padding:20px;border:1px solid #d1d5db;border-radius:16px;background:#fff;">
            <h2 style="margin:0 0 12px;font-size:18px;line-height:24px;">Capture hook</h2>
            <p style="margin:0;font-size:15px;line-height:22px;color:#4b5563;">
              The capture pipeline first snapshots <code>data-visual-target</code>, then falls
              back to <code>data-visual-root</code>.
            </p>
          </article>

          <article style="grid-column:1 / -1;padding:20px;border:1px solid #d1d5db;border-radius:16px;background:#fff;">
            <h2 style="margin:0 0 16px;font-size:18px;line-height:24px;">Manifest</h2>
            <dl style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:16px;margin:0;">
              <div>
                <dt style="margin:0 0 4px;font-size:12px;line-height:16px;color:#6b7280;text-transform:uppercase;letter-spacing:.06em;">Version</dt>
                <dd style="margin:0;font-size:16px;line-height:24px;font-weight:600;">{{ manifest.version }}</dd>
              </div>
              <div>
                <dt style="margin:0 0 4px;font-size:12px;line-height:16px;color:#6b7280;text-transform:uppercase;letter-spacing:.06em;">Threshold</dt>
                <dd style="margin:0;font-size:16px;line-height:24px;font-weight:600;">{{ manifest.tolerancePercent }}%</dd>
              </div>
              <div>
                <dt style="margin:0 0 4px;font-size:12px;line-height:16px;color:#6b7280;text-transform:uppercase;letter-spacing:.06em;">Story base URL</dt>
                <dd style="margin:0;font-size:16px;line-height:24px;font-weight:600;"><code>{{ manifest.storyBaseUrl }}</code></dd>
              </div>
              <div>
                <dt style="margin:0 0 4px;font-size:12px;line-height:16px;color:#6b7280;text-transform:uppercase;letter-spacing:.06em;">Rules</dt>
                <dd style="margin:0;">
                  <ul style="margin:0;padding-left:20px;display:grid;gap:6px;">
                    <li v-for="(enabled, key) in manifest.rules" :key="key">
                      {{ key }}: {{ enabled }}
                    </li>
                  </ul>
                </dd>
              </div>
            </dl>
          </article>
        </div>
      </section>
    `
  })
} satisfies Meta<Record<string, never>>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Overview: Story = {};
