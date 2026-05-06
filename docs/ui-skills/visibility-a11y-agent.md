# Visibility & Accessibility Agent

A small, zero-dependency static audit that scans the Vue/SCSS source
under `src/` for common visibility and a11y issues. It is advisory:
findings are intentionally lossy and need a human to confirm.

## Run it

```bash
npm run audit:ui          # human-readable markdown to stdout
npm run audit:ui:json     # machine-readable JSON

node scripts/ui-visibility-audit.mjs --paths src/components,src/views
```

The script exits `1` if any **high** severity finding is reported.

## Rules

| Rule | Severity | What it flags |
|------|----------|---------------|
| `typography:tiny-font` | medium / high | `font-size < 12px` (tiny text is hard to read sustained). |
| `typography:weight-noise` | low | non-canonical `font-weight` values such as `780`, `850`. Round to the 400/500/600/700/800/900 ramp. |
| `contrast:low-opacity` | low / medium | `rgba(var(--v-theme-on-*), x)` with `x < 0.5`. |
| `contrast:hardcoded-color` | low | `#hex` or raw `rgba(R,G,B,…)` literals in styles. |
| `chart:label-too-small` | medium | `fontSize: '<12px'` in chart configs. |
| `layout:overflow-risk` | low | fixed widths > 1280px. |
| `a11y:missing-aria-label` | medium | icon-only `v-btn` / `<button>` without `aria-label`. |
| `a11y:missing-focus` | low | a `:hover` rule without a paired `:focus-visible`. |

## How to interpret

- Treat **high** findings as must-fix before shipping.
- Treat **medium** findings as polish items for the current iteration.
- Treat **low** findings as backlog grooming. Some are intentional
  (icons inside a button group with a tooltip) — record exceptions in
  PR descriptions when needed.

## Extending

The audit lives in [scripts/ui-visibility-audit.mjs](../../scripts/ui-visibility-audit.mjs).
Add a new rule by appending another regex pass inside `scanFile`. Keep
each rule cheap and idempotent so the script stays fast.

## What the audit does **not** cover

- Live DOM contrast measurement (use Lighthouse or axe for that).
- Color blindness simulation.
- Keyboard tab-order regressions.
- Screen reader semantic correctness.

Pair this audit with a manual pass and Vuetify's built-in a11y guidance
when shipping changes that touch shared chrome.
