# Design System Rules

Cross-cutting rules that govern every UI change in this playground.
Read this first when touching any shared component or shell surface.

## Foundations

- **Source of truth**: `src/design-tokens/tokens.json`. Generated outputs
  live in `src/design-tokens/generated/` — never edit those by hand.
- **Theme bridge**: `src/styles/mp-theme-aliases.css` and
  `src/plugins/maropostTheme.ts` connect tokens to Vuetify variables and
  defaults.
- **Stack**: Vue 3.5, Vuetify 3.12, TypeScript 5.9, Vite 7. Stay inside
  this stack — do not introduce new UI libraries.

## Color

- Brand primary: `#1A56DB` (light) / Vuetify variable `--v-theme-primary`.
- Brand secondary: `#7E3AF2`. Use for AI / NEW indicators.
- Neutrals: opacity blends of `--v-theme-on-surface` for borders and
  muted text. Avoid raw `#888` style hex.
- Semantic: success / warning / error / info — always Vuetify variables.

## Typography ramp

| Role | Size | Weight | Notes |
|------|------|--------|-------|
| Page title | clamp(1.45rem, 2vw, 1.85rem) | 700 | Set on `MpPageHeader` and `DashboardView`. |
| Card title | clamp(0.95rem, 1.3vw, 1.12rem) | 700 | `dashboard-widget-card__title`. |
| Section title | 1rem | 600 | `MpSectionHeader`. |
| Metric value | clamp(1.6rem, 2.2vw, 2.05rem) | 750 | KPI cards only. |
| Body | 0.875rem | 500 | Everywhere else. |
| Metadata / labels | 0.75rem | 500 | Subdued at opacity 0.56. |
| Caption / helper | 0.75rem | 500 | Opacity 0.52–0.62. |

Keep weight values on the canonical `400/500/600/700/800/900` scale.
Specials like `820` or `780` were normalized during the polish pass; do
not reintroduce them.

## Spacing

- Use 4px steps: 4 / 8 / 12 / 16 / 20 / 24 / 32.
- Card body padding: 20.
- Card header padding: 18 / 20 / 12.
- Header row gap: 12.
- Toolbars: 6/8 vertical, 12 horizontal.

## Radii

- `sm` 4px (chips, fine controls)
- `md` 8px (buttons, icon buttons, search)
- `lg` 12px (cards, widget cards)
- `999px` (capsule control rows, pill chips)

## Shadows

- Default: hairline border, no elevation.
- Subtle hover lift: only border shift, never `0 12px 24px` shadows.
- Drop shadow tokens: `var(--mp-shadow-sm)` / `md` / `lg` for popovers,
  menus, drawers (already applied via global rules in `global.scss`).

## States (must be defined for every interactive element)

- `:hover` — soft tonal background.
- `:focus-visible` — visible 2–3px primary halo. Do not remove outlines
  without providing a custom focus ring.
- `:active` — slightly deeper background; no transform.
- `:disabled` — `opacity: 0.5`, `cursor: not-allowed`. Never gray text
  alone.
- Selected — token-backed primary tint, paired with semantic icon color.

## Buttons

- Primary CTA: solid primary background, white text, `lg` radius (12px),
  height 36px.
- Secondary: `text` or `tonal` Vuetify variants. Same height. Never
  silently override `min-height`/`height`.
- Icon-only: 34×34, radius `md`. Always `aria-label`.
- Stop using `!important` to fight Vuetify defaults; raise specificity
  with classes instead.

## Cards

- Always `flat border rounded="lg"`. No elevation.
- Hairline border via `var(--mp-border-subtle)`.
- Header / body / footer treated as discrete sections with explicit
  padding rather than mixed inline gaps.

## Don'ts (project-wide)

- Don't hardcode hex/rgb in styles.
- Don't use `v-dialog` for forms — use `MpFormDrawer`.
- Don't introduce new Mp components without a Storybook story alongside.
- Don't bypass `MpStatusChip` for status visuals.
- Don't ship icon-only buttons without `aria-label`.
- Don't add new global selectors that compete with component scope —
  keep new rules scoped or component-specific.

## When you change tokens

Run `npm run tokens:build`. Never edit files in
`src/design-tokens/generated/`.

## When you change shell

Run `npm run audit:ui` and add the report findings to your PR description.
