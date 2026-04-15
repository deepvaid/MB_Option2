# Figma Tokens to App + Storybook Demo

This runbook is for stakeholder demos where a design token is changed in Figma and reflected in both:

- Marobase app route: `/design-system`
- Root Storybook story: `Foundation/Design System Demo`

## Demo Objective

Show that Marobase has one token-driven system where design updates from Figma flow into engineering surfaces quickly and safely.

## Prerequisites

1. Tokens Studio (Figma plugin) is connected to this repository.
2. Figma token sync path is configured to push updates that are consumed by:
   - `design-kit/figma-export/tokens-studio.json`
3. Local repo is clean enough to pull latest token updates.
4. You can run both the app and the root Storybook locally.

## Live Demo Script

### Step 1: Designer updates a token in Figma

In Tokens Studio, change a visually obvious value, for example:

- `color-light.primary`

Push the change to GitHub.

### Step 2: Engineer syncs tokens into code

Run:

```bash
git pull
npm run tokens:sync-figma
```

What this does:

1. Reads `design-kit/figma-export/tokens-studio.json`
2. Syncs values into `src/design-tokens/tokens.json`
3. Rebuilds generated outputs in `src/design-tokens/generated/`

### Step 3: Show app + root Storybook reflect the same update

Run (or keep running):

```bash
npm run dev
npm run storybook
```

Open:

- App: `http://localhost:5173/design-system` (or your active Vite port)
- Storybook: `http://localhost:6006/?path=/story/foundation-design-system-demo--default`

Narrate:

- Both surfaces use the same token source and component system.
- App and the root Storybook now match without manual style overrides.
- This lowers design-engineering drift and speeds release confidence.

## Recommended On-Screen Highlights

In app (`/design-system`):

- Live token color swatches
- Spacing scale bars
- Mp* component section (`MpStatusChip`, `MpDataTableToolbar`, `MpFloatingBulkBar`, `MpFormDrawer`)

In the root Storybook:

- `Foundation/Design System Demo`
- `Foundation/Colors`

## Troubleshooting

### Sync shows “no changes detected”

- Verify Figma push actually updated `tokens-studio.json` in remote.
- Confirm token group names match sync script expectations (`color-light`, `color-dark`, `spacing`, `borderRadius`, etc.).

### Storybook/app still shows old values

- Restart Storybook and Vite dev server.
- Re-run `npm run tokens:sync-figma`.
- Confirm generated files changed under `src/design-tokens/generated/`.

### Wrong file path configured in Tokens Studio

- Ensure plugin sync target matches this repo demo flow and branch.

## Demo Talk Track (30 seconds)

"We update a token once in Figma, sync it into our token source, and the same token instantly drives both the app and Storybook. This keeps visual language consistent across product surfaces and reduces handoff friction between design and engineering."
