# Widget Library — Figma Workflow

> This doc explains how to take [`widget-library.html`](../widget-library.html) (the static Phase 1 widget reference at the project root) and turn it into a publishable **Figma component library** using the existing token-sync infrastructure plus the `html.to.design` plugin.
>
> Companion to [`figma-integration.md`](./figma-integration.md), which covers token sync in detail.

---

## What you're building

A Figma library containing **29 widget components** that mirrors the unified dashboard:

| Section | Count | Examples |
|---------|------:|----------|
| KPI cards | 11 | Net Revenue, Total Orders, AOV, Conversion Rate, Avg Contact Lifecycle (big-number), Total Campaign Revenue (currency + area sparkline) |
| Chart cards | 12 | Sales Trend (area), Orders by Status (donut), Sales Breakdown (stacked bar), Performance Summary (KPI strip + grouped bar), ISP Report (multi-series line), RFM heatmap |
| List / table cards | 6 | Top Products (ranked), Recent Sent Campaigns (full table), Subscriber Summary (highlighted column), Contact Search |
| States | 4 | Empty (cloud-aware), Loading (skeleton), per archetype |

The widget library file is the visual source of truth — everything below is about getting it into Figma cleanly.

---

## Prerequisites

| Item | How to get it |
|------|---------------|
| Figma account on a paid team | Required to publish a library |
| Tokens Studio plugin | Install in Figma → Plugins → Browse → "Tokens Studio" |
| html.to.design plugin | Install in Figma → Plugins → Browse → "html.to.design" |
| Figma Personal Access Token | github.com/settings → Profile → Settings → Security → Personal access tokens |
| Figma file key | Open or create a Figma file → copy the segment after `/design/` in the URL |

---

## Phase A — Sync tokens to Figma Variables (one-time)

Goal: every color / spacing / radius / typography value used by the widget library lives as a **Figma Variable**, so components reference it instead of raw hex.

Two paths — pick one:

### A.1 — Tokens Studio (recommended for designers)
Follow the existing setup in [`figma-integration.md`](./figma-integration.md) under **"Connect to GitHub"**. Once connected:
1. In Figma, open Tokens Studio → click "Pull from GitHub"
2. Click "Apply selected sets" → choose all sets
3. The plugin creates a Figma Variables collection per token group (`color/light/*`, `color/chart/light/*`, `spacing/*`, etc.)

### A.2 — One-shot REST push (recommended for engineers)
From the project root:
```bash
export FIGMA_TOKEN=<your_pat>
export FIGMA_FILE_KEY=<file_key_from_url>
node design-kit/scripts/push-variables.mjs
```
This publishes everything in [`tokens.json`](../src/design-tokens/tokens.json) to the target Figma file as local Variables. Run again whenever tokens change.

### Verifying Phase A
In the Figma file's right panel → **Local variables**, you should see (at minimum):
- `color/light/surface` = `#fdfbf7`
- `color/light/primary` = `#1ab7ea`
- `color/light/hairline` = `#e6dfd1`
- `color/chart/light/series1` through `series9`
- `color/light/daVinci/iconFrom`, `iconTo`, `text`
- `spacing/2` through `spacing/16`

---

## Phase B — Import widget shapes via html.to.design

1. Run the dev server:
   ```bash
   npm run dev
   ```
2. Confirm `http://localhost:5174/widget-library.html` loads with all 29 widgets visible.
3. In Figma, open the target library file → Plugins → html.to.design → **Import by URL**.
4. Import each section onto its own page:

   | Figma page | Source URL fragment |
   |---|---|
   | `01 – KPI` | `http://localhost:5174/widget-library.html#kpi` |
   | `02 – Chart` | `http://localhost:5174/widget-library.html#chart` |
   | `03 – List` | `http://localhost:5174/widget-library.html#list` |
   | `04 – States` | `http://localhost:5174/widget-library.html#states` |

5. Wait for each import to finish, then delete any plugin-added padding frames you don't want.

> **Tip — when charts flatten poorly**: html.to.design sometimes rasterizes complex inline SVG (donuts especially). Workaround: open `widget-library.html` in the browser → right-click the chart → **Inspect** → copy the `<svg>...</svg>` element → in Figma, paste (Cmd-V). Figma's native SVG parser handles paths and gradients better.

---

## Phase C — Componentize the 29 widgets

### C.1 Extract shared sub-components first

Build these once, then nest them inside every widget. Variants in parentheses.

1. **Cloud Chip** — variants: `Commerce`, `Marketing`, `Service`, `MHC`, `Contacts`, `Analytics`. Mirrors [`MpSourceCloudChip.vue`](../src/components/MpSourceCloudChip.vue). 22 px tall, 1 px hairline border, neutral `surface-2` background, 13 px Lucide icon tinted per cloud.
2. **Trend Pill** — variants: `Positive` (green, up-arrow), `Negative` (red, down-arrow), `Neutral` (muted, flat). Inline-flex, 12 px font weight 600.
3. **Da Vinci Pill** — single component. Uses the new `color/light/daVinci/*` variables for gradient stops and text.
4. **Widget Header** — title + subtitle slot + optional Da Vinci pill slot + overflow `more-vertical` icon button.
5. **Widget Footer** — cloud-chip slot + "Updated Xm ago" with clock icon.
6. **Donut Slice** — a 1-arc component using a `Circle` with stroke-dasharray bound to a number prop (0–100). Nest five for Orders by Status, two for Email Usage, etc.
7. **Status Chip** (table use) — variants for `Sent`, `Draft`, `Failed`, etc., matching [`MpStatusChip.vue`](../src/components/MpStatusChip.vue).

### C.2 Build the four base widgets

Each is a Figma component with variant props.

| Base component | Variant axes | Notes |
|---|---|---|
| `Widget/KPI` | `cloud` × `trend` × `variant` (`default` \| `big-number` \| `area-spark`) | K10 uses `big-number`; K11 uses `area-spark` |
| `Widget/Chart` | `chartType` (`area` \| `bar-stacked` \| `bar-grouped` \| `donut` \| `line` \| `heatmap`) × `cloud` | C9 (RFM heatmap) and C10 (Performance Summary) span 2 columns in the live grid |
| `Widget/List` | `listType` (`ranked` \| `mini-table` \| `full-table` \| `summary` \| `search`) × `cloud` | L4 (Subscriber Summary) has a highlighted "Lifetime Total" column |
| `Widget/State` | `state` (`empty` \| `loading`) × `cloud` | Empty state shows cloud icon, title, sub, refresh CTA |

For each of the 29 concrete widgets (K1–K11, C1–C12, L1–L6, S1–S4), create an instance of the matching base with variant props set, and rename it (e.g. `Net Revenue / Commerce`).

### C.3 Sizing

Match the production grid: the live `DashboardGrid.vue` uses a 12-column layout with 44 px row height and 14 px gaps. Set the widget frames to:

| Widget archetype | Default size (w × h) |
|---|---|
| KPI | 4 cols × 4 rows ≈ 280 × 200 px |
| Chart | 6 cols × 7 rows ≈ 430 × 320 px |
| List (mini) | 6 cols × 7 rows ≈ 430 × 320 px |
| List (full table) | 12 cols × 8 rows ≈ 880 × 364 px |
| C9 heatmap / C10 perf summary | 12 cols × 8 rows ≈ 880 × 364 px |

Use Figma auto-layout on every component so resizing reflows content.

---

## Phase D — Wire Figma Variables into imported layers

After html.to.design imports, fills will be raw hex. Bind each to a variable:

| Imported fill | Figma Variable |
|---|---|
| `#fdfbf7` (card bg) | `color/light/surface` |
| `#f1ece2` (chip bg) | `color/light/surfaceVariant` |
| `#f7f3ec` (page bg) | `color/light/background` |
| `#e6dfd1` (border) | `color/light/hairline` |
| `#1a1814` (text) | `color/light/secondary` |
| `#7a7466` (muted) | `color/light/onSurfaceVariant` |
| `#1ab7ea` (accent / chart series1) | `color/light/primary` or `color/chart/light/series1` |
| `#0d8cb8` | `color/light/primaryDarken` or `color/chart/light/series2` |
| `#0F766E`, `#16A34A`, `#B45309`, `#475569` | `color/chart/light/series3`–`series6` |
| `#7c3aed`, `#ec4899`, `#f59e0b` (Performance Summary, ISP Report) | `color/chart/light/series7`–`series9` |
| `#1f8a5b` (positive trend) | `color/light/success` |
| `#c0392b` (negative trend) | `color/light/error` |

Use Figma's **"Apply variable" → search by hex** to speed this up. If a hex isn't found, double-check Phase A ran successfully.

Typography: set the imported text styles to the published Inter scale (11 / 12 / 13 / 14.5 / 26 px). Tokens Studio also publishes these as text styles.

---

## Phase E — Publish

1. Mark each `Widget/*` and shared sub-component as a **Main Component** (single-icon, top of the layers panel).
2. Move all variants behind the same name with `/` separator so they show up grouped in the Assets panel (`Widget/KPI/Commerce/Positive`, etc.).
3. Open the **Assets** panel → click the cloud icon → **Publish styles & variables**.
4. Other Figma files in the team can now drag instances in from the library.

---

## Phase F — Optional: Code Connect

To enable "right-click → go to source code" on Figma components, use Code Connect:

```bash
npm run design-kit:push-connect
```

Mapping table lives in [`figma-integration.md`](./figma-integration.md) under **Code Connect**. Extend it for the new widgets as needed.

---

## Maintenance

- **When `tokens.json` changes** — re-run Phase A (`npm run tokens:build` then push). Figma Variables update; components inherit automatically.
- **When `widget-library.html` changes** — designers should re-import just the affected widget via html.to.design, then re-componentize the changed parts. The grid layout and palette are stable; usually only mock data and minor chrome change.
- **Drift check** — periodically open the live `widget-library.html` and the Figma library side-by-side. If the typography scale, surface colors, or chip dimensions diverge, the HTML is canonical — update Figma.

---

## Pre-flight checklist (before opening Figma)

```bash
npm run tokens:build                # ensures generated/* is fresh
npm run dev                          # serves widget-library.html
# open http://localhost:5174/widget-library.html and confirm:
#   ✓ K11 shows $48,210 + sparkline (not $0)
#   ✓ Performance Summary (C10) has 7 days of bars + realistic KPI strip
#   ✓ ISP Report (C11) has 6 distinct series on a 0–100% axis
#   ✓ RFM heatmap (C9) is readable at 13 px cell font
#   ✓ Donut centers (C2, C8, C12) all fit cleanly inside the hole
```

---

## Out of scope

- Phase 2 cross-cloud widgets (Marketing→Sales, Product→Service) — flagged in the PRD as later.
- SMS / RCS / MMS messaging widgets — listed in PRD's "Downloadable Analytics", not in Phase 1.
- Building the `.fig` file itself — Claude / CLI tools cannot create Figma files; Phases B–E are manual.
