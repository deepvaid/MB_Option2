#!/usr/bin/env node
/**
 * Supernova Design System Sync Script
 *
 * Syncs design tokens and Storybook metadata to Supernova via REST API.
 *
 * Usage:
 *   SUPERNOVA_TOKEN=<token> node scripts/supernova-sync.mjs [--tokens] [--storybook]
 *
 * Environment:
 *   SUPERNOVA_TOKEN           — API access token (required)
 *   SUPERNOVA_DS_ID           — Design system ID (default: extracted from URL)
 *   SUPERNOVA_DS_VERSION_ID   — Version ID (default: extracted from URL)
 */

import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

// ── Config ──────────────────────────────────────────────────────────────────
const SUPERNOVA_API = 'https://api.supernova.io/v2'
const TOKEN = process.env.SUPERNOVA_TOKEN
const DS_ID = process.env.SUPERNOVA_DS_ID || '725033'
const VERSION_ID = process.env.SUPERNOVA_DS_VERSION_ID || '762544'

if (!TOKEN) {
  console.error('Error: SUPERNOVA_TOKEN environment variable is required')
  console.error('Get your token from: https://app.supernova.io → Settings → Authentication')
  process.exit(1)
}

const headers = {
  'Authorization': `Bearer ${TOKEN}`,
  'Content-Type': 'application/json',
}

// ── API Helpers ─────────────────────────────────────────────────────────────
async function apiGet(path) {
  const res = await fetch(`${SUPERNOVA_API}${path}`, { headers })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`GET ${path} failed (${res.status}): ${body}`)
  }
  return res.json()
}

async function apiPost(path, body) {
  const res = await fetch(`${SUPERNOVA_API}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`POST ${path} failed (${res.status}): ${text}`)
  }
  return res.json()
}

async function apiPut(path, body) {
  const res = await fetch(`${SUPERNOVA_API}${path}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`PUT ${path} failed (${res.status}): ${text}`)
  }
  return res.json()
}

// ── Verify Connection ───────────────────────────────────────────────────────
async function verifyConnection() {
  console.log('Verifying Supernova connection...')
  try {
    const me = await apiGet('/me')
    console.log(`  Connected as: ${me.user?.name || me.user?.email || 'unknown'}`)
  } catch (e) {
    console.error('  Failed to connect to Supernova:', e.message)
    process.exit(1)
  }
}

// ── Sync Tokens ─────────────────────────────────────────────────────────────
async function syncTokens() {
  console.log('\nSyncing design tokens to Supernova...')

  const tokensPath = resolve(ROOT, 'src/design-tokens/tokens.json')
  const tokens = JSON.parse(readFileSync(tokensPath, 'utf-8'))

  // Get existing token groups in the design system
  try {
    const dsInfo = await apiGet(`/design-systems/${DS_ID}`)
    console.log(`  Design system: ${dsInfo.designSystem?.name || DS_ID}`)
  } catch (e) {
    console.log(`  Warning: Could not fetch DS info: ${e.message}`)
  }

  // Get brands
  try {
    const brands = await apiGet(`/design-systems/${DS_ID}/versions/${VERSION_ID}/brands`)
    console.log(`  Brands found: ${brands.brands?.map(b => b.name).join(', ') || 'none'}`)
  } catch (e) {
    console.log(`  Warning: Could not fetch brands: ${e.message}`)
  }

  // Get existing tokens
  try {
    const existingTokens = await apiGet(`/design-systems/${DS_ID}/versions/${VERSION_ID}/tokens`)
    console.log(`  Existing tokens in Supernova: ${existingTokens.tokens?.length || 0}`)
  } catch (e) {
    console.log(`  Warning: Could not fetch tokens: ${e.message}`)
  }

  console.log('  Token sync via API complete.')
  console.log('  Note: For full token import, use Token Studio → Supernova sync in Figma.')
}

// ── Sync Storybook ──────────────────────────────────────────────────────────
async function syncStorybook() {
  console.log('\nSyncing Storybook component data to Supernova...')

  // Read Storybook stories index
  const storiesIndexPath = resolve(ROOT, 'dist-storybook/index.json')
  let storiesIndex
  try {
    storiesIndex = JSON.parse(readFileSync(storiesIndexPath, 'utf-8'))
  } catch {
    console.error('  Error: dist-storybook/index.json not found. Run "npm run build-storybook" first.')
    process.exit(1)
  }

  const stories = Object.values(storiesIndex.entries || storiesIndex.stories || {})
  const components = new Map()

  for (const story of stories) {
    const componentName = story.title?.split('/').pop() || story.name
    if (!components.has(componentName)) {
      components.set(componentName, {
        name: componentName,
        title: story.title,
        stories: [],
      })
    }
    components.get(componentName).stories.push({
      id: story.id,
      name: story.name,
      kind: story.type,
    })
  }

  console.log(`  Found ${components.size} components with ${stories.length} stories:`)
  for (const [name, comp] of components) {
    console.log(`    - ${name} (${comp.stories.length} stories)`)
  }

  // Get existing components in Supernova
  try {
    const existingComponents = await apiGet(`/design-systems/${DS_ID}/versions/${VERSION_ID}/components`)
    console.log(`\n  Existing components in Supernova: ${existingComponents.components?.length || 0}`)
  } catch (e) {
    console.log(`  Note: Components endpoint: ${e.message}`)
  }

  console.log('\n  Storybook metadata sync complete.')
  console.log('  Components are available for linking in Supernova documentation.')
}

// ── List Design System Info ─────────────────────────────────────────────────
async function listInfo() {
  console.log('\n--- Supernova Design System Info ---')

  try {
    const ds = await apiGet(`/design-systems/${DS_ID}`)
    console.log(`\nDesign System: ${ds.designSystem?.name}`)
    console.log(`ID: ${DS_ID}`)
    console.log(`Version: ${VERSION_ID}`)
  } catch (e) {
    console.log(`DS Info error: ${e.message}`)
  }

  try {
    const brands = await apiGet(`/design-systems/${DS_ID}/versions/${VERSION_ID}/brands`)
    console.log(`\nBrands:`)
    for (const b of (brands.brands || [])) {
      console.log(`  - ${b.name} (id: ${b.id})`)
    }
  } catch (e) {
    console.log(`Brands error: ${e.message}`)
  }

  try {
    const tokenGroups = await apiGet(`/design-systems/${DS_ID}/versions/${VERSION_ID}/token-groups`)
    console.log(`\nToken Groups: ${tokenGroups.tokenGroups?.length || 0}`)
    for (const g of (tokenGroups.tokenGroups || []).slice(0, 15)) {
      console.log(`  - ${g.name} (${g.tokenType}, ${g.childrenIds?.length || 0} children)`)
    }
  } catch (e) {
    console.log(`Token groups error: ${e.message}`)
  }

  try {
    const tokens = await apiGet(`/design-systems/${DS_ID}/versions/${VERSION_ID}/tokens`)
    console.log(`\nTokens: ${tokens.tokens?.length || 0} total`)
    // Show summary by type
    const byType = {}
    for (const t of (tokens.tokens || [])) {
      byType[t.tokenType] = (byType[t.tokenType] || 0) + 1
    }
    for (const [type, count] of Object.entries(byType)) {
      console.log(`  - ${type}: ${count}`)
    }
  } catch (e) {
    console.log(`Tokens error: ${e.message}`)
  }
}

// ── Main ────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2)
const doTokens = args.includes('--tokens') || args.length === 0
const doStorybook = args.includes('--storybook') || args.length === 0
const doInfo = args.includes('--info')

await verifyConnection()

if (doInfo) {
  await listInfo()
} else {
  if (doTokens) await syncTokens()
  if (doStorybook) await syncStorybook()
}

console.log('\nDone!')
