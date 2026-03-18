# Supernova Integration Plan — Maropost Design System

**Date:** March 18, 2026
**Status:** Demo-ready plan
**Owner:** Deep (UX)

---

## Current State (What We Have)

```
┌─────────────┐    Git sync     ┌──────────────────────┐    build.mjs    ┌──────────────┐
│   Figma      │ ◄────────────► │  tokens.json (W3C)   │ ──────────────► │  Generated   │
│   + Tokens   │   (Token        │  src/design-tokens/  │                 │  SCSS/CSS/TS │
│   Studio     │    Studio)      └──────────────────────┘                 └──────┬───────┘
└─────────────┘                                                                  │
                                                                                 ▼
                                                                  ┌──────────────────────────┐
                                                                  │  Vue 3 / Vuetify 3 App   │
                                                                  │  + Storybook 9            │
                                                                  │  (11 Mp* components)      │
                                                                  └──────────────────────────┘
```

**What's working today:**
- `tokens.json` is W3C-compatible (already works with Token Studio)
- `build.mjs` generates SCSS, CSS custom props, TS constants, and a `tokens-studio.json`
- `design-kit/scripts/` has export/sync/push scripts for Figma Variables API
- Storybook 9 running with all 11 Mp* components documented
- Figma Code Connect config exists (`figma.config.ts`, needs node URLs filled in)

---

## Target State (With Supernova)

```
┌─────────────┐                  ┌───────────────┐                ┌──────────────────┐
│   Figma      │  Token Studio   │  GitHub Repo   │   webhook/     │    Supernova     │
│   Design     │ ──── push ────► │                │ ── sync ─────► │   (DS Hub)       │
│   File       │                 │  branches:     │                │                  │
└──────┬───────┘                 │  ┌───────────┐ │                │  • Token docs    │
       │                         │  │ main      │ │                │  • Component docs│
       │  Figma Variables API    │  │ tokens/*  │ │                │  • Guidelines    │
       │◄────── push-variables ──│  │ release/* │ │                │  • Changelog     │
       │                         │  └───────────┘ │                │  • Code snippets │
       │                         └───────┬────────┘                └────────┬─────────┘
       │                                 │                                  │
       │                                 ▼                                  │
       │                     ┌───────────────────────┐            Published DS site
       │                     │  CI Pipeline           │            (stakeholder review)
       │                     │  • tokens:build        │
       │                     │  • build-storybook     │
       │                     │  • Vercel preview      │
       │                     └───────────────────────┘
```

---

## Branch Strategy

We use **3 branch tiers** so token changes, component work, and releases don't collide.

### Branch 1: `tokens/studio-sync`
**Purpose:** Dedicated landing zone for Token Studio pushes from Figma.
**Who writes here:** Designers (via Token Studio plugin).
**What Supernova reads:** This branch feeds Supernova's token documentation.

- Token Studio in Figma is configured to push to `tokens/studio-sync` (not `main`)
- Only `src/design-tokens/tokens.json` changes on this branch
- CI auto-runs `npm run tokens:build` and commits generated files
- PR auto-created against `main` for developer review

**Supernova config:** Connect Supernova source → GitHub → branch `tokens/studio-sync`, path `src/design-tokens/tokens.json`

### Branch 2: `main`
**Purpose:** Stable integration branch. Components + tokens always in sync.
**Who writes here:** Developers (merging from `tokens/studio-sync` and feature branches).
**What Supernova reads:** Component documentation, code snippets, Storybook link.

- Merges from `tokens/studio-sync` (token updates) and `feature/*` branches (component work)
- Vercel auto-deploys the app playground on every push
- Storybook builds and deploys to Chromatic or Vercel sub-path
- Supernova pulls component docs from this branch

**Supernova config:** Connect code-connect mappings + component docs from `main`

### Branch 3: `release/v*`
**Purpose:** Tagged, versioned snapshots for stakeholder sign-off.
**Who writes here:** UX lead (cut from `main` when milestone is ready).
**What Supernova reads:** Published/versioned design system documentation.

- Created when a design system version is ready (e.g., `release/v1.2`)
- Supernova publishes from release branches only
- Gives stakeholders a stable URL that won't change mid-review

**Supernova config:** Publish documentation site from `release/*` branches

---

## Supernova Setup Steps (Do Today for Demo)

### Step 1 — Create Supernova Workspace (10 min)

1. Go to [supernova.io](https://supernova.io) → Create workspace "Maropost Design System"
2. Create a Design System → name it "Maropost DS"
3. Under Settings → Integrations → connect **Figma** (paste your Figma file URL)
4. Under Settings → Integrations → connect **GitHub** (repo: `your-org/new-maropost`)

### Step 2 — Import Tokens into Supernova (15 min)

1. In Supernova → Tokens section
2. Choose "Import from Figma" — this pulls your Token Studio variables
3. Alternatively, import from file: upload `design-kit/figma-export/tokens-studio.json`
4. Verify token groups appear: Colors (light/dark), Spacing, Border Radius, Typography, Layout, Shadows
5. Map token groups to Supernova categories (color, dimension, font, shadow)

### Step 3 — Configure Branch Sync (10 min)

1. In Supernova → Settings → Source Control
2. Set primary source branch: `tokens/studio-sync`
3. Enable auto-sync on push (webhook)
4. Set documentation publish branch: `main` (or `release/v*` for prod)

### Step 4 — Set Up Component Documentation (20 min)

1. In Supernova → Components section
2. Link Figma components to code — use existing `figma.config.ts` mappings:

| Component | Figma Link | Code Path |
|-----------|-----------|-----------|
| MpPageHeader | *(paste from Figma)* | `src/components/MpPageHeader.vue` |
| MpKpiCard | *(paste from Figma)* | `src/components/MpKpiCard.vue` |
| MpStatusChip | *(paste from Figma)* | `src/components/MpStatusChip.vue` |
| MpDataTableToolbar | *(paste from Figma)* | `src/components/MpDataTableToolbar.vue` |
| MpEmptyState | *(paste from Figma)* | `src/components/MpEmptyState.vue` |
| MpFilterTabs | *(paste from Figma)* | `src/components/MpFilterTabs.vue` |
| MpFloatingBulkBar | *(paste from Figma)* | `src/components/MpFloatingBulkBar.vue` |
| MpFormDrawer | *(paste from Figma)* | `src/components/MpFormDrawer.vue` |
| MpSectionHeader | *(paste from Figma)* | `src/components/MpSectionHeader.vue` |

3. For each component, add: Props table, usage guidelines, do/don't examples
4. Link Storybook URL for live previews (embed or external link)

### Step 5 — Create the `tokens/studio-sync` Branch (5 min)

```bash
git checkout main
git checkout -b tokens/studio-sync
git push -u origin tokens/studio-sync
```

Then in Figma → Token Studio plugin → Sync settings:
- Change branch from `main` to `tokens/studio-sync`
- File path stays: `src/design-tokens/tokens.json`

### Step 6 — Add GitHub Action for Auto-Build (5 min)

Create `.github/workflows/tokens-sync.yml`:

```yaml
name: Token Sync Pipeline
on:
  push:
    branches: ['tokens/studio-sync']
    paths: ['src/design-tokens/tokens.json']

jobs:
  build-tokens:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npm run tokens:build
      - uses: stefanzweifel/git-auto-commit-action@v5
        with:
          commit_message: "[chore]: auto-regenerate design tokens"
          file_pattern: "src/design-tokens/generated/*"
      - name: Create PR to main
        uses: peter-evans/create-pull-request@v6
        with:
          branch: tokens/studio-sync
          base: main
          title: "[tokens]: design token update from Figma"
          body: "Auto-generated from Token Studio push. Review token changes."
```

### Step 7 — Publish Documentation Site (10 min)

1. In Supernova → Documentation → Create new documentation
2. Choose a template (or start blank)
3. Add pages: Token Reference, Component Library, Patterns, Changelog
4. Configure custom domain or use Supernova subdomain
5. Set publish source to `release/v1.0` branch
6. Hit Publish — share URL with stakeholders

---

## Demo Script (15 min walkthrough)

### Act 1 — "Designer changes a token" (3 min)
1. Open Figma → Token Studio → change `primary` color from `#0091FF` to something visible like `#6366F1`
2. Push to `tokens/studio-sync` branch from Token Studio
3. Show: GitHub PR auto-created, Supernova token docs auto-updated

### Act 2 — "Developer reviews and merges" (3 min)
1. Open the auto-created PR on GitHub
2. Show the diff in `tokens.json` — one clean color change
3. Show generated SCSS/CSS/TS files updated by CI
4. Merge to `main`

### Act 3 — "Everything updates" (5 min)
1. **Supernova:** Show the published DS site with new color reflected in token docs
2. **Storybook:** Open Storybook — components now render with new primary color
3. **App Playground:** Open Vercel preview — full app shows new brand color
4. **Figma:** Confirm Variables are in sync (via `push-variables` script or manual check)

### Act 4 — "Release and publish" (4 min)
1. Cut a `release/v1.0` branch from `main`
2. Supernova publishes the versioned documentation
3. Share the stable URL — "This is what stakeholders see, it doesn't change until we cut v1.1"

---

## What This Unlocks

**For Designers:** Push token changes from Figma without touching code. See documentation auto-update.

**For Developers:** Token PRs are clean, reviewable diffs. No manual copy-paste from Figma.

**For Stakeholders:** One stable Supernova URL per release. Component docs, tokens, and guidelines in one place.

**For UX Team:** Single source of truth across Figma ↔ Code ↔ Documentation. Version history on every change.

---

## Risks and Mitigations

| Risk | Mitigation |
|------|-----------|
| Token Studio format drift from W3C spec | Our `build.mjs` already handles alias resolution and format normalization |
| Supernova free tier limits | Start with Pro trial (30 days); enough for demo + stakeholder buy-in |
| Figma Code Connect requires node URLs | Fill in `figma.config.ts` — 15 min task, one-time setup |
| Merge conflicts on `tokens.json` | Only Token Studio writes to `tokens/studio-sync`; devs never edit that branch directly |

---

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `.github/workflows/tokens-sync.yml` | **Create** | Auto-build + PR on token push |
| `figma.config.ts` | **Update** | Fill in Figma node URLs for Code Connect |
| Token Studio (Figma) | **Update** | Change sync branch to `tokens/studio-sync` |
| Supernova workspace | **Create** | New workspace + integrations |
