# Dashboard UI Skill

How dashboard surfaces are built and maintained in the Maropost playground.
This is the source of truth for `DashboardView`, `DashboardGrid`,
`DashboardWidgetCard`, and the KPI/chart/table widget set.

## Goals
- Feel modern, premium, and product-grade — not flashy.
- Keep Maropost brand identity (logo, blue primary, sidebar tone).
- Stay scannable on dense screens; never sacrifice clarity for decoration.

## Header anatomy

The dashboard header has two rows:

1. **Title row** — name switcher, refresh status (timestamp + reload),
   and collection-level actions on the right (Manage / Create).
2. **Control row** — bordered, capsule (`9999px`) container that holds
   active-dashboard actions: date range, filter triggers, the `Actions ▾`
   menu, and the primary `+ Add Widget` button.

Rules:
- Title weight `700`. Heavy display weights (≥ 800) feel dated.
- Refresh status sits inline with the title at `0.52` opacity, weight `500`.
- Use Vuetify's design-system primary button for `+ Add Widget`. Do not
  override its color, padding, or radius locally.
- Buttons inside the control row share the capsule's roundness; do not
  add per-button radius overrides.
- Avoid `!important` on button geometry. If you need to tighten a button,
  use a class with adequate specificity instead.

## Card and grid

`DashboardWidgetCard`:
- `border-radius: 12px`, hairline border via `var(--mp-border-subtle)`,
  no elevation by default.
- Header padding `18px 20px 12px`, body padding `0 20px 20px`.
- Title weight `700`, subtitle weight `500` at opacity `0.56`.
- Hover bumps the border opacity slightly; never add a heavy shadow.

`DashboardGrid`:
- Negative inline margin (`-14px`) compensates for `vue-grid-layout`
  internal margins so widgets align with the page header on the left.

## Widgets

KPI widget:
- Title `clamp(0.95rem, 1.3vw, 1.05rem)`, weight `700`.
- Metric `clamp(1.6rem, 2.2vw, 2.05rem)`, weight `750`,
  `letter-spacing: -0.01em`, `font-variant-numeric: tabular-nums`.
- Trend pill height `22px`, weight `700`. Use semantic palette
  (success / error / neutral) — never raw hex.

Chart widget:
- Apex labels at `12px` weight `500`, opacity `0.62`.
- Grid lines at `0.10` opacity. Padding `top: 8, right: 12, bottom: 4, left: 12`.
- Tooltip uses theme inheritance; never hardcode colors.

Table / Top Campaigns:
- Sticky footer (`View all campaigns`) with hairline `border-top` so the
  last row never gets clipped.
- Progress meters: 6px tall, `999px` radius, `0.06` track. Bar uses
  `rgb(var(--v-theme-primary))`.
- Numeric cells get `font-variant-numeric: tabular-nums`.

## Spacing scale

Prefer multiples of 4 from the design tokens:
- 4 / 8 / 12 / 16 / 20 / 24 / 32.
- Card body bottom padding 20.
- Title row gap 12. Control row gap 12.

## Don'ts

- Don't import a new chart, grid, or animation library.
- Don't introduce loud shadows or glassy gradients on cards.
- Don't hardcode hex colors in dashboard files; route through tokens.
- Don't combine `rounded="xl"` and a scoped `border-radius: 12px !important`.
  Pick one source of truth.
