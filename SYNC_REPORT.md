# App–Storybook MaroBase sync report

## Token alignment

- **Shared:** [`src/main.ts`](src/main.ts) now loads [`packages/marobase-ui/src/tokens/index.css`](packages/marobase-ui/src/tokens/index.css) (full MaroBase token bundle), then [`src/design-tokens/generated/variables.css`](src/design-tokens/generated/variables.css), [`src/styles/mp-theme-aliases.css`](src/styles/mp-theme-aliases.css), [`src/styles/marobase-tokens.css`](src/styles/marobase-tokens.css), and [`src/styles/global.scss`](src/styles/global.scss)—matching [`.storybook/preview.ts`](.storybook/preview.ts) order (replacing the previous `mb-foundation`‑only import).
- **Legacy bridge:** [`src/styles/tokens.scss`](src/styles/tokens.scss) (`$mp-*`) unchanged for sidebar and existing SCSS; scoped pieces still use `--mp-*` / Vuetify where not migrated.

## Already aligned (minimal change)

- **Views** already using `@marobase/ui` directly: e.g. [`DashboardsList.vue`](src/views/Dashboards/DashboardsList.vue) (`MbPageHeader`), [`CommerceCloudLanding.vue`](src/views/Commerce/CommerceCloudLanding.vue) (`MbCard`).
- **Domain composites** left as-is per plan: dashboards/copilot cards, charts, `ModuleLandingPage`, `MpDaVinciBot`, `MpSectionHeader`, `MpFloatingBulkBar`, `MpOverviewChart`, wizard flows, etc.

## Replaced / wrapped with MaroBase (`Mp*` → `Mb*` internally)

| App surface | Change |
|-------------|--------|
| [`MpPageHeader.vue`](src/components/MpPageHeader.vue) | Wraps `MbBreadcrumbs` + `MbPageHeader`; back link via `RouterLink`; breadcrumb navigation via `@navigate` + `router.push`. |
| [`MpFormDrawer.vue`](src/components/MpFormDrawer.vue) | Uses `MbDrawer` with backdrop, optional footer via `showFooter`, fixed overlay z-index. |
| [`MpFilterTabs.vue`](src/components/MpFilterTabs.vue) | Uses `MbTabs` (pill) with `badge` for counts. |
| [`MpStatusChip.vue`](src/components/MpStatusChip.vue) | Uses `MbChip` + optional `v-icon`; Vuetify color map → `MbChip` tones. |
| [`MpKpiCard.vue`](src/components/MpKpiCard.vue) | Wraps `MbStatCard` + `#icon` slot (`v-icon` / Lucide); maps `color` → `tone`, `trend`/`trendPositive` → `trend`/`trendValue`, `subStat` → `caption`. |
| [`MpDataTableToolbar.vue`](src/components/MpDataTableToolbar.vue) | Filter/column/clear/bulk actions use `MbButton`; search uses `MbInputField`; filter chips use `MbChip` (`@dismiss`); column menu still `v-menu`/`v-checkbox` (Vuetify) for table integration; `@use` for design token SCSS. |
| [`MpEmptyState.vue`](src/components/MpEmptyState.vue) | Thin app wrapper: `MbEmptyState` + `MbButton` + `v-icon` for Lucide/Vuetify icons. |

## New in MaroBase package

- [`MbEmptyState.vue`](packages/marobase-ui/src/components/MbEmptyState.vue), [`MbEmptyState.types.ts`](packages/marobase-ui/src/components/MbEmptyState.types.ts), [`mb-empty-state.tokens.css`](packages/marobase-ui/src/tokens/mb-empty-state.tokens.css), [`mb-empty-state.css`](packages/marobase-ui/src/styles/mb-empty-state.css), export in [`index.ts`](packages/marobase-ui/src/index.ts), import in [`tokens/index.css`](packages/marobase-ui/src/tokens/index.css), package export in [`packages/marobase-ui/package.json`](packages/marobase-ui/package.json).
- Story: [`MbEmptyState.stories.ts`](packages/marobase-ui/src/components/MbEmptyState.stories.ts).

## `MbDrawer` API

- New prop **`showFooter`** (default `true`): hides footer slot and default primary/secondary actions when `false` (used by drawers without footer).
- Subtitle line only renders when `subtitle` is set.

## `MbPageHeader`

- Renders **`MbBreadcrumbs`** when `breadcrumbs` prop has items; [`MbPageHeaderBreadcrumb`](packages/marobase-ui/src/components/MbPageHeader.types.ts) supports optional `disabled`.

## `MbInputField`

- Default **`hint`** / **`leftAddon`** no longer forced; hint paragraph only when `hint` is set; `aria-describedby` only when a message exists.

## Duplicates removed

- None deleted: **`Mp*`** files kept as **stable app facades** so imports across `src/views` did not need a mass rename. Empty state legacy file remains the wrapper above.

## Storybook

- [`Introduction/MaroBase`](src/stories/Introduction.stories.ts) doc story added.
- [`storySort`](.storybook/preview.ts): **`Archive` moved after `*`** so legacy Vuetify demos sort after MaroBase/app stories; `Feedback` group listed.

## Typecheck / build

- **`npm run type-check`:** clean after fixes (see commits in `tsconfig.app.json` exclude for `**/*.stories.ts` under `src` and `packages/marobase-ui` generated/visual stories to avoid Storybook meta noise in app typecheck).
- **`npm run build`:** passes.
- **`npm run build-storybook`:** passes.
- **Lint:** no `lint` script in [`package.json`](package.json).

## Not synced / deferred

- **`AppSidebar.vue`:** not modified (per instruction).
- **Raw Vuetify** across many views (tables, menus, page-level buttons) unchanged except where listed.
- **`MpPageHeader` title block** vs standalone `MbPageHeader` only: app still uses `MpPageHeader` everywhere for one API.

## Review notes (risk)

1. **`MpKpiCard` → `MbStatCard`:** denser MaroBase card (`min-height`, typography). Visual QA on Live View + Contact detail + Email campaigns KPIs.
2. **`MpFormDrawer` → `MbDrawer`:** overlay is custom, not `v-navigation-drawer`; verify z-index vs dialogs on real flows.
3. **`MpDataTableToolbar`:** column menu still Vuetify; Mb filter chips use dismiss, not `v-chip` closable—behavior should match.
4. **Breadcrumbs:** Previously many `breadcrumbs` props on `MpPageHeader` were unused in the old template; they now **render**. Confirm IA still matches expectations.
5. **`MbPageHeader` in package** now shows breadcrumbs when passed—`DashboardsList`’s `MbPageHeader` will show crumbs if props provided.
