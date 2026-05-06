# Sidebar & Header Skill

Conventions for `AppBar.vue`, `AppSidebar.vue`, and the surrounding
shell. Keep these in mind whenever you touch chrome.

## App bar (top header)

- Height: 56px (Vuetify default). Bottom border via component (`mp-appbar`),
  not a global `.v-app-bar` rule.
- Left cluster: logo + title.
- Center: omni-search.
- Right cluster: utilities (Da Vinci copilot, notifications, help, settings,
  shortcuts, theme), then user menu.

### Search

- Pill shape (`999px`), low-emphasis fill `rgba(on-surface, 0.03)`.
- On focus: surface fills, primary outline at `0.42`, soft `box-shadow` glow
  at `0.10` for clarity. Avoid heavy borders or accent backgrounds.
- Input min-height `36px`, font-size `0.9rem`.

### Utility icon buttons

- 34×34, radius `8px`. Hover background `rgba(on-surface, 0.06)`,
  hover color `on-surface`. No `!important`.
- All icon-only buttons must have an `aria-label` or wrap a `v-tooltip`
  with descriptive text.

### Da Vinci AI trigger

- Tonal: subtle primary tint (`rgba(primary, 0.06)` fill, `0.16` border,
  primary text). Active state: solid primary background.
- Same 34×34 footprint as other utility buttons but with `radius: 8px`.

### User menu

- Width 296. Header pad `12px 16px`. Avatar + name + email + role chip
  in a tight 1.2 line-height stack.
- All menu rows use compact density and weight `560` titles.
- Sign out is destructive (`base-color="error"`).
- Theme row is a single readonly switch in the row’s `append`.

## Sidebar

- Width 230 (rail-only when collapsed). Sidebar background uses dark
  alias tokens (`--mp-color-sidebar-*`).
- Items: 8px vertical padding, 10px horizontal. Icon size 20px, stroke
  via MDI font.
- Hover: token-driven `--mp-color-sidebar-hover` overlay, no harsh blue.
- Active item:
  - Background `rgba(primary, 0.08)`.
  - 3px primary bar inside `::before`.
  - Icon and title inherit primary.
- Section dividers use `var(--mp-color-sidebar-border)` at opacity `0.7`.
  Never use raw `rgba(0,0,0,...)`.

### Badges (e.g., NEW)

- Use `<v-chip variant="tonal" color="secondary" size="x-small">`.
- Class `sidebar-badge` keeps height `18px`, font 10px, letter-spacing 0.04em.
- Do not introduce one-off Vuetify named colors (`purple-lighten-4` etc.).

### Da Vinci AI in sidebar

- Restrained tonal indicator that still reads as a sidebar item.
- Keep iconography consistent with siblings; do not switch icon styles.

## Bottom anchors

- Help & Documentation stays anchored at the bottom of the sidebar.
- Profile / settings always reachable from the user menu.

## Don'ts

- Don't double up borders between component CSS and global rules.
- Don't apply `box-shadow` to header chrome — keep it flat with a
  hairline border.
- Don't use raw rgb/rgba in the shell — go through CSS variables or
  `rgb(var(--v-theme-...))`.
