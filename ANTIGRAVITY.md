# Maropost Design System — Anti Gravity Agent Context

> Read this first. This file gives Anti Gravity full context on the project and what was last built.

## What This Project Is

A **Vue 3 + Vuetify 3 playground** mirroring the real Maropost SaaS platform (commerce + marketing for merchants). Used for rapid UX prototyping, design system development (Storybook), and stakeholder review via Vercel.

**Not a production app** — mock data, no backend API.

---

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Vue 3.5 (Composition API, `<script setup>`) |
| UI Library | Vuetify 3.12 (Material Design 3) |
| Build | Vite 7 |
| Language | TypeScript 5.9 (strict) |
| State | Pinia 3 |
| Routing | Vue Router 5 |
| Icons | Lucide (`lucide-vue-next`) via custom Vuetify icon set |
| Docs | Storybook 9 |

---

## Key Files

| File | Purpose |
|------|---------|
| `CLAUDE.md` / `AGENTS.md` | Full architecture, component APIs, coding conventions |
| `CLAUDE_CODE_PROMPT.md` | Product spec from live app observation |
| `src/design-tokens/tokens.json` | Source of truth for all design values |
| `src/plugins/lucideIcons.ts` | Custom Vuetify icon set (Lucide SVGs + MDI mapping) |
| `src/plugins/vuetify.ts` | Vuetify theme (light + dark) + global defaults |
| `src/components/layout/AppBar.vue` | Top navigation bar |
| `src/components/layout/AppSidebar.vue` | Left nav (260px expanded, collapsible rail) |
| `src/stores/useContacts.ts` | Contacts mock data store (50 seeded contacts) |
| `src/views/Contacts/AllContacts.vue` | All Contacts data table |
| `src/views/Contacts/ContactDetail.vue` | Single contact detail page |

---

## Coding Rules

- **Icons**: Lucide only, kebab-case names (`settings`, `plus`, `chevron-down`). Never `mdi-*` strings in new code.
- **Cards**: always `flat border rounded="lg"` — no elevation/shadows.
- **Forms**: use `MpFormDrawer` (right-side drawer). Never `v-dialog`.
- **Styles**: scoped only. Never hardcode colors/spacing — use Vuetify utilities or design tokens.
- **Avatars**: use `v-avatar > v-img` with an initial-letter fallback `<div>` for error/placeholder slots.

---

## NPM Scripts

```bash
npm run dev          # Vite dev server
npm run build        # TypeScript check + production build
npm run storybook    # Storybook on :6006
npm run tokens:build # Regenerate SCSS/CSS/TS from tokens.json
npm run type-check   # vue-tsc type checking
```

---

## Recent Changes (last session — for continuity)

### Icons — `src/plugins/lucideIcons.ts`
Vuetify internally uses `mdi-*` string aliases for expand chevrons, checkboxes, etc.
A `MDI_TO_LUCIDE` map was added to route these to Lucide SVGs (avoids the MDI CSS class-doubling bug).
**Do not** remove the map or revert to the old MDI CSS fallback — chevrons in `v-list-group` will break.

### Sidebar — `src/components/layout/AppSidebar.vue`
Rail (collapsed) brand mark: a `<div class="rail-brand-box">M</div>` — white "M" on dark box (32×32px, border-radius 8px).
Do **not** replace with an SVG or img tag.

### AppBar — `src/components/layout/AppBar.vue`
- LINE messenger icon button added after the Settings icon (inline SVG, links to https://line.me in new tab)
- User avatar uses `https://i.pravatar.cc/128?img=12` (deterministic male portrait) — pill size 26px, dropdown card size 56px

### Contact avatars — `src/stores/useContacts.ts`
Each seeded Contact has `avatarUrl: \`https://i.pravatar.cc/96?u=contact-${id}\``
`AllContacts.vue` table rows and `ContactDetail.vue` header both render via `v-avatar > v-img` with initial-letter fallback div.

---

## Git

- **Main branch**: `master`
- **Remote**: `origin` (GitHub)
- **Branch naming**: `feature/`, `fix/`, `docs/`, `refactor/`
- **Commit format**: `[type]: description` (feat, fix, docs, refactor, perf, chore)
