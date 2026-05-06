# Cursor Prompt — Implement Design Kit (Vuetify-style)

Implement the design kit defined in `design-kit-tokens.css` and the patterns shown in `Design Kit.html`. The kit follows Vuetify token conventions so it maps cleanly onto a Vuetify 3 theme + component classes.

## Files to reference
- `design-kit-tokens.css` — full token system (drop-in)
- `Design Kit.html` — visual reference for every component + 4 scenario recreations
- `handoff/reference.png` — pixel reference (Variation B)

## Token system

All tokens use Vuetify naming so you can paste them straight into your `vuetify.ts` theme:

```ts
// vuetify.ts
export default createVuetify({
  theme: {
    defaultTheme: 'maropostWarm',
    themes: {
      maropostWarm: {
        dark: false,
        colors: {
          background: '#f7f3ec',
          surface: '#fdfbf7',
          'surface-variant': '#f1ece2',
          'surface-bright': '#ffffff',
          'on-background': '#1a1814',
          'on-surface': '#1a1814',
          'on-surface-variant': '#7a7466',
          primary: '#1ab7ea',
          'on-primary': '#ffffff',
          'primary-container': '#d6eefb',
          'on-primary-container': '#0a4f6c',
          success: '#1f8a5b',
          warning: '#c97a16',
          error: '#c0392b',
          info: '#1ab7ea',
          outline: '#d8d0bf',
          'outline-variant': '#e6dfd1',
        },
        variables: {
          'border-color': '#e6dfd1',
          'border-opacity': 1,
          'high-emphasis-opacity': 1,
          'medium-emphasis-opacity': 0.7,
        },
      },
    },
  },
  defaults: {
    VBtn: { rounded: 'pill', variant: 'flat', height: 40 },
    VTextField: { variant: 'outlined', density: 'comfortable', color: 'primary' },
    VSelect: { variant: 'outlined', density: 'comfortable', color: 'primary' },
    VChip: { rounded: 'pill', size: 'small' },
    VCard: { rounded: 'lg', variant: 'outlined' },
    VAlert: { variant: 'tonal', rounded: 'md' },
  },
});
```

## Dark mode

The kit ships with a dark theme. Activate by setting `data-theme="dark"` on `<html>` (or any ancestor of the app shell). It also auto-flips when the OS prefers dark, unless `data-theme="light"` is explicitly set.

```ts
// vuetify.ts — add a second theme alongside maropostWarm
themes: {
  maropostWarm: { /* …light config above… */ },
  maropostDark: {
    dark: true,
    colors: {
      background: '#14110d',
      surface: '#1c1814',
      'surface-variant': '#2a2520',
      'surface-bright': '#2f2a24',
      'on-background': '#f1ece2',
      'on-surface': '#f1ece2',
      'on-surface-variant': '#b3aa97',
      primary: '#4ec8f2',
      'on-primary': '#06212c',
      'primary-container': '#0e3a4f',
      'on-primary-container': '#bfe5f7',
      success: '#4cc28a',
      warning: '#e1a04a',
      error: '#e57266',
      info: '#4ec8f2',
      outline: '#4a443a',
      'outline-variant': '#332e28',
    },
    variables: {
      'border-color': '#332e28',
      'border-opacity': 1,
      'high-emphasis-opacity': 1,
      'medium-emphasis-opacity': 0.7,
    },
  },
},
```

Toggle at runtime:

```ts
import { useTheme } from 'vuetify';
const theme = useTheme();
theme.global.name.value = theme.global.current.value.dark ? 'maropostWarm' : 'maropostDark';
// persist:
localStorage.setItem('app-theme', theme.global.name.value);
// also mirror to <html data-theme="..."> so plain CSS using the kit tokens follows
document.documentElement.dataset.theme = theme.global.current.value.dark ? 'dark' : 'light';
```

Dark-mode rules:
- All component classes in the kit are token-driven — they automatically re-color when `data-theme="dark"` is set. Do not hard-code hex values in components.
- For images / illustrations that don't read on dark, wrap in `<div class="v-card v-card--outlined">` so they sit on a `surface` background.
- Brand `primary` is lifted (`#4ec8f2`) on dark for AA contrast — never use the light-mode `#1ab7ea` on dark backgrounds.
- Tonal containers swap to deep tints (e.g. `primary-container: #0e3a4f`); keep using `--v-theme-primary-container` and `--v-theme-on-primary-container` — never reach for the raw hex.

## Migration plan (one PR per step)

1. **PR 1 — Tokens.** Drop `design-kit-tokens.css` into `src/assets/styles/` and import in `main.ts`. Wire Vuetify theme above. No visual change yet.
2. **PR 2 — Buttons.** Replace existing `<v-btn>` defaults; ensure all CTAs use `variant="flat"` for primary, `variant="tonal"` for secondary, `variant="outlined"` for tertiary, `variant="text"` for ghost.
3. **PR 3 — Forms.** Switch all `<v-text-field>` / `<v-select>` to `variant="outlined"` with floating labels. Standardize density to `comfortable`. Match the styling in Design Kit § 04.
4. **PR 4 — Header / sidebar shell.** Match the warm-cream chrome from `handoff/reference.png`.
5. **PR 5 — Menus & popovers.** Replace any custom dropdowns with `<v-menu>` rendering the list patterns from Design Kit § 05 (filters popover, profile menu, "Add content" menu, date range picker).
6. **PR 6 — Tables, chips, alerts.** Sweep call sites.
7. **PR 7 — Remove dead legacy CSS.**

## Component mapping (Vuetify ↔ design kit)

| Design kit class | Vuetify component | Notes |
|---|---|---|
| `.v-btn--flat` | `<v-btn variant="flat" color="primary">` | primary CTA |
| `.v-btn--tonal` | `<v-btn variant="tonal" color="primary">` | secondary |
| `.v-btn--outlined` | `<v-btn variant="outlined">` | tertiary |
| `.v-btn--text` | `<v-btn variant="text">` | ghost / cancel |
| `.v-btn--icon` | `<v-btn icon variant="text">` | toolbar icons |
| `.v-field` | `<v-text-field variant="outlined">` | floating label |
| `.v-chip--tonal-*` | `<v-chip variant="tonal" color="...">` | filter chips |
| `.v-list-item` | `<v-list-item>` | menu rows |
| `.v-card` | `<v-card variant="outlined">` | section containers |
| `.v-card--elevated` | `<v-card elevation="2">` | floating UI only |
| `.v-alert--info/...` | `<v-alert variant="tonal" type="...">` | banner messages |

## Don'ts

- ❌ No drop shadows on cards or inputs (only on floating menus / popovers / dialogs).
- ❌ No gradients.
- ❌ No emoji icons. Use lucide-vue-next or @mdi/js, stroke 1.6, currentColor.
- ❌ Don't introduce new fonts. Inter only.
- ❌ Don't deviate from `--v-rounded-*` for radius — buttons + chips are pill, cards are `lg`, inputs are `md`.

## Acceptance criteria

For each PR, attach before/after screenshots covering:
- Buttons in all variants and sizes
- Outlined text field (idle / focused / filled / error)
- Filters popover, date range picker, profile menu (match `Design Kit.html` § 10)
- One real page (Home dashboard) showing the new chrome end-to-end
