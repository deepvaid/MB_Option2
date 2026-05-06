# Cursor Prompt — Apply Dashboard Style System

Use the screenshot + the design tokens below to refactor our dashboard's header, sidebar, KPI cards, buttons, and tables. **Do not change app logic, routes, data fetching, or component APIs** — only restyle. Keep all existing component names, props, and tests passing.

---

## 1) Reference

Attach screenshot: `handoff/reference.png` (the warm-cream "Compact" variation from our design exploration). Match this look pixel-for-pixel where possible.

---

## 2) Design tokens (drop into `tokens.css` or your theme file)

```css
:root {
  /* Surfaces — warm off-white */
  --surface-0: #f7f3ec;     /* page background */
  --surface-1: #fdfbf7;     /* cards, header, sidebar */
  --surface-2: #f1ece2;     /* input wells, hover */

  /* Text */
  --ink:   #1a1814;          /* primary text */
  --muted: #7a7466;          /* secondary, captions, metadata */

  /* Lines */
  --hairline: #e6dfd1;       /* 1px borders, dividers */

  /* Accent (signal blue) */
  --accent:     #2D63E8;
  --accent-fg:  #ffffff;
  --accent-ink: color-mix(in oklch, #2D63E8 75%, #000 25%);
  --accent-soft: color-mix(in oklch, #2D63E8 12%, transparent);

  /* Semantic */
  --pos: oklch(0.5 0.15 155);     /* positive deltas */
  --pos-soft: color-mix(in oklch, oklch(0.7 0.15 155) 14%, transparent);
  --neg: oklch(0.55 0.2 25);
  --neg-soft: color-mix(in oklch, oklch(0.65 0.2 25) 14%, transparent);

  /* Radius */
  --r-pill: 999px;            /* buttons, search, chips */
  --r-card: 12px;             /* KPI cards, table containers */
  --r-section: 14px;          /* large sections */
  --r-chip: 8px;              /* icon chips, tags */

  /* Type */
  --font-ui: "Inter", system-ui, sans-serif;
  --font-mono: ui-monospace, "SF Mono", monospace;
}

html, body { background: var(--surface-0); color: var(--ink); font-family: var(--font-ui); }
* { box-sizing: border-box; }

/* Tabular nums for ALL numeric values (revenue, counts, percentages, dates) */
.num { font-variant-numeric: tabular-nums; }
```

Type scale:
- Page title (`Home`): 22px / weight 600 / letter-spacing -0.3px
- Section title: 14.5px / 600
- KPI value: 28px / 600 / letter-spacing -0.5px / `tabular-nums`
- Body: 13.5px / 500
- Caption / muted: 12px / 500, `--muted`
- Eyebrow / uppercase label: 11px / 500 / letter-spacing 1px / uppercase

---

## 3) Buttons (replace ALL existing button styles)

All buttons are pill-shaped (`--r-pill`). Three variants only:

```css
/* Base */
.btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 8px 14px; border-radius: var(--r-pill);
  font: 500 13px/1 var(--font-ui);
  border: 1px solid transparent; cursor: pointer;
  transition: background 120ms ease, border-color 120ms ease;
}

/* Primary — filled accent */
.btn--primary {
  background: var(--accent); color: var(--accent-fg);
  font-weight: 600; padding: 8px 16px;
  box-shadow: 0 1px 0 rgba(255,255,255,0.2) inset,
              0 1px 2px color-mix(in oklch, var(--accent) 30%, transparent);
}
.btn--primary:hover { background: color-mix(in oklch, var(--accent) 90%, #000 10%); }

/* Secondary — bordered */
.btn--secondary {
  background: var(--surface-1); color: var(--ink);
  border-color: var(--hairline);
}
.btn--secondary:hover { background: var(--surface-2); }

/* Ghost — no border, transparent */
.btn--ghost {
  background: transparent; color: var(--ink);
}
.btn--ghost:hover { background: var(--surface-2); }

/* Icon-only (round) */
.btn--icon { width: 32px; height: 32px; padding: 0; justify-content: center; border-radius: var(--r-pill); }
```

Replace existing rectangular/heavy buttons with these. Keep semantics: "Add widget" → primary, "Filters"/"Last 30 days" → secondary, kebab/refresh icons → ghost icon.

Filter count badge inside a button: small pill `padding: 1px 6px; border-radius: 999px; background: var(--accent-soft); color: var(--accent-ink); font-weight: 600; font-size: 11px;`

---

## 4) Header (60px, single row)

- Background: `--surface-1`, bottom border `1px solid var(--hairline)`, height 60px, padding `12px 22px`.
- **Search**: pill input, max-width 560px. Background `--surface-2`, border `--hairline`, radius `--r-pill`, padding `8px 14px`. Leading icon = sparkle (AI), tinted `--accent`. Trailing `⌘K` chip (mono 11px in a 1px-bordered pill).
- Right cluster: bell (with `oklch(0.65 0.2 25)` dot when unread, ringed by `--surface-1` so it floats), book, gear — all 32×32 ghost icon buttons.
- Vertical divider 1×22px in `--hairline`.
- User pill: bordered pill containing 26px round avatar (filled `--accent`, white initials, weight 700) + name + chevron-down. **No black square button** — that goes.

Remove the top-of-page "Manage Dashboards | + Create Dashboard" plain text links. Either fold "Create dashboard" into a `Dashboards` dropdown in the sidebar or move to a new `…` menu in the page bar.

---

## 5) Sidebar (248px)

- Background `--surface-1`, right border `--hairline`, padding `18px 14px`.
- Brand: 22px square logo mark in `--accent` (white initial, weight 700, 11px) + brand wordmark 13px / weight 700 / letter-spacing 1.4px / uppercase.
- Nav items: 9×10px padding, radius 10px, gap 10px between icon and label, 13.5px / 500.
- Active item: background `var(--accent-soft)`, color `--accent-ink`, weight 600.
- Sub-items: 28px left indent with a 1px hairline guide on the left, 7×10px padding, 13px, radius 8px.
- User block at bottom: 32px round avatar + name (13px / 600) + tenant (11.5px / `--muted`), separated by a top hairline.

---

## 6) Page bar (under header)

- Padding `20px 28px 16px`, bottom border `--hairline`.
- Left: H1 `Home` + small chevron-down (24×24 ghost icon) for switching dashboards. Below it: 6×6 dot in `--pos` + caption "Live · synced 2 min ago" in `--muted`.
- Right: pill cluster — `[📅 Last 30 days ▾] [🔽 Filters (2)] [⋯ ghost icon] [+ Add widget primary]` with 12px gap.

---

## 7) KPI cards (compact variant)

Layout: 4-column grid, gap 14px.

Each card (`--surface-1`, `1px solid var(--hairline)`, `--r-card`, padding `16px 18px`):
1. **Top row**: 28×28 icon chip (radius `--r-chip`, background `--accent-soft`, color `--accent-ink`) + label (13px / 500) + spacer + "30d" caption (11.5px / `--muted`).
2. **Middle row**: huge value (28px / 600 / `tabular-nums`) on the left, sparkline filling the remaining width on the right (32px tall, stroke `--accent`, no fill, 1.6px line, `vector-effect: non-scaling-stroke`).
3. **Bottom row**: delta chip (no background, just colored arrow + percent in `--pos` or `--neg`) + secondary text "vs prev 30d" in `--muted`.

Sparkline component spec:
```jsx
<svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{width:"100%", height:32}}>
  <path d={pathD} fill="none" stroke="var(--accent)" strokeWidth="1.6"
        strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
</svg>
```

---

## 8) Section cards (charts, activity, tables)

`--surface-1` + `1px solid var(--hairline)` + `--r-section` + padding `18px 20px`. Header row: title (14.5px / 600) + subtitle (12px / `--muted`) on the left; controls/links on the right.

Period switcher (e.g. `7d / 30d / 90d`): three pills, 5×12px, 12px / 500, radius `--r-pill`, 1px `--hairline` border. Selected = filled `--ink` background, `--surface-1` text. Unselected = transparent background, `--muted` text.

---

## 9) Tables

- Header row: 11px / 500 / uppercase / letter-spacing 1px / `--muted`, bottom border `--hairline`.
- Body rows: 13.5px / `--ink`, padding `12px 4px`, bottom border `--hairline` (none on last row).
- All numeric cells: `tabular-nums`. Right-align money/totals; left-align everything else.
- Row hover: background `--surface-2`.
- "View all" link: 12.5px / 600 / `--accent-ink` with a top-right arrow icon.

---

## 10) Activity feed

Each row: 28×28 icon chip + 2-line text (eyebrow with timestamp in mono 11px / value 13.5px / metadata 12px muted). Separate rows with `--hairline` bottom borders, none on last.

Tag → chip color map:
- email → `--accent-soft` / `--accent-ink`
- order → `oklch(0.7 0.15 155, 14%)` / `oklch(0.45 0.15 155)`
- audience → `oklch(0.75 0.12 90, 18%)` / `oklch(0.45 0.12 90)`
- automation → `oklch(0.7 0.13 300, 14%)` / `oklch(0.45 0.13 300)`

---

## 11) Icons

Use `lucide-react` (or your existing stroke set). All icons are `1.6px` stroke, `round` linecap/linejoin, `currentColor`. Sizes: 13–14px inline in chips/captions, 17px in sidebar/header buttons, 14–15px in pill buttons.

---

## 12) Don'ts

- ❌ No drop shadows on cards or buttons (except the subtle inner highlight on primary buttons).
- ❌ No gradients (except sparkline area fills, which we removed in compact).
- ❌ No emoji as icons. No decorative icons that don't carry meaning.
- ❌ No multi-color brand gradients.
- ❌ Don't introduce new fonts. Inter only.
- ❌ Don't change existing component prop names or routes.

---

## 13) Migration order (suggest one PR per step)

1. Tokens file (`tokens.css`) — no visual change yet, just variables.
2. Buttons (`Button.tsx` + global `.btn` classes) — sweep call sites.
3. Header + sidebar shells.
4. KPI card component.
5. Section card + table + activity feed.
6. Remove now-dead legacy CSS.

For each PR, screenshot before/after and post in the PR description so we can review visually.
