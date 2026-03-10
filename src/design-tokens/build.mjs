/**
 * Zero-dependency design token generator for Maropost.
 *
 * Reads tokens.json and generates:
 *   generated/_variables.scss   — SCSS variables
 *   generated/variables.css     — CSS custom properties
 *   generated/tokens.ts         — TypeScript constants
 *
 * Usage:
 *   node src/design-tokens/build.mjs          # one-shot
 *   node src/design-tokens/build.mjs --watch  # watch mode
 */

import { readFileSync, writeFileSync, mkdirSync, watch } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const TOKENS_PATH = resolve(__dirname, 'tokens.json')
const OUT_DIR = resolve(__dirname, 'generated')

// ── Flatten nested token object into path→value pairs ──────────────────────
function flatten(obj, prefix = []) {
  const result = []
  for (const [key, val] of Object.entries(obj)) {
    if (key.startsWith('$')) continue // skip meta keys
    if (val && typeof val === 'object' && '$value' in val) {
      result.push({ path: [...prefix, key], value: val.$value, type: val.$type || 'unknown' })
    } else if (val && typeof val === 'object') {
      result.push(...flatten(val, [...prefix, key]))
    }
  }
  return result
}

// ── Generators ─────────────────────────────────────────────────────────────
function toScssName(path) {
  return '$mp-' + path.join('-')
}

function toCssName(path) {
  return '--mp-' + path.join('-')
}

function toTsName(path) {
  return 'mp_' + path.map(p => p.replace(/-/g, '_')).join('_')
}

function generateScss(tokens) {
  const header = '// Auto-generated from tokens.json — do not edit\n\n'
  const lines = tokens.map(t => `${toScssName(t.path)}: ${t.value};`)
  return header + lines.join('\n') + '\n'
}

function generateCss(tokens) {
  const header = '/* Auto-generated from tokens.json — do not edit */\n\n:root {\n'
  const lines = tokens.map(t => `  ${toCssName(t.path)}: ${t.value};`)
  return header + lines.join('\n') + '\n}\n'
}

function generateTs(tokens) {
  const header = '// Auto-generated from tokens.json — do not edit\n\n'
  const lines = tokens.map(t => {
    if (typeof t.value === 'number') {
      return `export const ${toTsName(t.path)} = ${t.value}`
    }
    // Escape single quotes inside values, or use backticks for safety
    const escaped = String(t.value).replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$')
    return `export const ${toTsName(t.path)} = \`${escaped}\``
  })
  return header + lines.join('\n') + '\n'
}

// ── Tokens Studio JSON (for Figma sync) ───────────────────────────────────
function generateTokensStudio(raw) {
  const out = { global: {} }

  // Spacing
  if (raw.spacing) {
    out.global.spacing = {}
    for (const [key, val] of Object.entries(raw.spacing)) {
      if (key.startsWith('$')) continue
      out.global.spacing[key] = { value: val.$value, type: 'spacing', description: `spacing.${key}` }
    }
  }

  // Border radius
  if (raw.borderRadius) {
    out.global.borderRadius = {}
    for (const [key, val] of Object.entries(raw.borderRadius)) {
      if (key.startsWith('$')) continue
      out.global.borderRadius[key] = { value: val.$value, type: 'borderRadius', description: `borderRadius.${key}` }
    }
  }

  // Shadows
  if (raw.shadow) {
    out.global.boxShadow = {}
    for (const [key, val] of Object.entries(raw.shadow)) {
      if (key.startsWith('$')) continue
      out.global.boxShadow[key] = { value: val.$value, type: 'boxShadow', description: `shadow.${key}` }
    }
  }

  // Colors — Light, Dark, Sidebar
  for (const theme of ['light', 'dark', 'sidebar']) {
    if (!raw.color?.[theme]) continue
    const groupKey = `color-${theme}`
    out.global[groupKey] = {}
    for (const [key, val] of Object.entries(raw.color[theme])) {
      if (key.startsWith('$')) continue
      out.global[groupKey][key] = { value: val.$value, type: 'color', description: `color.${theme}.${key}` }
    }
  }

  // Typography — font sizes, weights, line heights
  if (raw.typography?.fontSize) {
    out.global.fontSize = {}
    for (const [key, val] of Object.entries(raw.typography.fontSize)) {
      if (key.startsWith('$')) continue
      out.global.fontSize[key] = { value: val.$value, type: 'fontSizes', description: `typography.fontSize.${key}` }
    }
  }
  if (raw.typography?.fontWeight) {
    out.global.fontWeight = {}
    for (const [key, val] of Object.entries(raw.typography.fontWeight)) {
      if (key.startsWith('$')) continue
      out.global.fontWeight[key] = { value: val.$value, type: 'fontWeights', description: `typography.fontWeight.${key}` }
    }
  }
  if (raw.typography?.lineHeight) {
    out.global.lineHeight = {}
    for (const [key, val] of Object.entries(raw.typography.lineHeight)) {
      if (key.startsWith('$')) continue
      out.global.lineHeight[key] = { value: val.$value, type: 'lineHeights', description: `typography.lineHeight.${key}` }
    }
  }

  // Layout
  if (raw.layout) {
    out.global.layout = {}
    for (const [key, val] of Object.entries(raw.layout)) {
      if (key.startsWith('$')) continue
      out.global.layout[key] = { value: val.$value, type: 'sizing', description: `layout.${key}` }
    }
  }

  // Tokens Studio metadata
  out.$themes = []
  out.$metadata = { tokenSetOrder: ['global'] }

  return out
}

// ── Build ──────────────────────────────────────────────────────────────────
function build() {
  const raw = JSON.parse(readFileSync(TOKENS_PATH, 'utf-8'))
  const tokens = flatten(raw)

  mkdirSync(OUT_DIR, { recursive: true })
  writeFileSync(resolve(OUT_DIR, '_variables.scss'), generateScss(tokens))
  writeFileSync(resolve(OUT_DIR, 'variables.css'), generateCss(tokens))
  writeFileSync(resolve(OUT_DIR, 'tokens.ts'), generateTs(tokens))

  // Also regenerate Tokens Studio JSON to keep Figma in sync
  const FIGMA_EXPORT_DIR = resolve(__dirname, '../../design-kit/figma-export')
  mkdirSync(FIGMA_EXPORT_DIR, { recursive: true })
  const tokensStudio = generateTokensStudio(raw)
  writeFileSync(resolve(FIGMA_EXPORT_DIR, 'tokens-studio.json'), JSON.stringify(tokensStudio, null, 2))

  console.log(`✓ Generated ${tokens.length} tokens → ${OUT_DIR}/`)
  console.log(`✓ Synced tokens-studio.json → ${FIGMA_EXPORT_DIR}/`)
}

// ── Entry ──────────────────────────────────────────────────────────────────
build()

if (process.argv.includes('--watch')) {
  console.log('Watching tokens.json for changes…')
  let debounce = null
  watch(TOKENS_PATH, { persistent: true }, () => {
    clearTimeout(debounce)
    debounce = setTimeout(() => {
      console.log('tokens.json changed — rebuilding…')
      try { build() } catch (e) { console.error(e) }
    }, 200)
  })
}
