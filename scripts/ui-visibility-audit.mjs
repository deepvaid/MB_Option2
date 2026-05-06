#!/usr/bin/env node
/**
 * UI Visibility & Accessibility Static Audit
 * ------------------------------------------
 * Zero-dependency Node script that scans Vue and SCSS source under
 * `src/` for likely visibility, contrast, focus, label, and overflow
 * issues. Designed to be fast (single pass, regex based), advisory,
 * and easy to extend.
 *
 * Categories:
 *   typography:tiny-font     font-size below 12px in templates/styles
 *   typography:weight-noise  non-standard font-weight values (50/55/65/78/82)
 *   contrast:low-opacity     text rendered with opacity < 0.50
 *   contrast:hardcoded-color hex / rgb / rgba values used in styles
 *   a11y:missing-aria-label  icon-only v-btn/button without aria-label
 *   a11y:missing-focus       components with hover but no focus-visible
 *   layout:overflow-risk     fixed widths or large min-widths inline
 *   chart:label-too-small    apex chart labels under 12px
 *
 * Output:
 *   Prints a markdown-style table with: severity, file:line, rule, fix.
 *
 * Usage:
 *   node scripts/ui-visibility-audit.mjs
 *   node scripts/ui-visibility-audit.mjs --json
 *   node scripts/ui-visibility-audit.mjs --paths src/components,src/views
 */

import fs from 'node:fs'
import path from 'node:path'

const argv = process.argv.slice(2)
const wantJson = argv.includes('--json')
const pathsFlagIndex = argv.indexOf('--paths')
const customPaths = pathsFlagIndex !== -1 && argv[pathsFlagIndex + 1]
  ? argv[pathsFlagIndex + 1].split(',').map((p) => p.trim()).filter(Boolean)
  : null

const ROOT = process.cwd()
const DEFAULT_TARGETS = ['src/components', 'src/views', 'src/styles', 'src/App.vue']
const TARGETS = (customPaths ?? DEFAULT_TARGETS).map((p) => path.resolve(ROOT, p))
const FILE_EXTS = new Set(['.vue', '.scss', '.css', '.ts'])
const findings = []

const severityWeight = { high: 3, medium: 2, low: 1 }

function pushFinding({ severity, rule, file, line, snippet, fix }) {
  findings.push({
    severity,
    rule,
    file: path.relative(ROOT, file),
    line,
    snippet: snippet.trim().slice(0, 160),
    fix,
  })
}

function walk(target) {
  if (!fs.existsSync(target)) return
  const stat = fs.statSync(target)
  if (stat.isFile()) return scanFile(target)
  for (const entry of fs.readdirSync(target)) {
    if (entry.startsWith('.')) continue
    if (entry === 'node_modules' || entry === 'dist' || entry === 'dist-storybook') continue
    walk(path.join(target, entry))
  }
}

function scanFile(file) {
  const ext = path.extname(file)
  if (!FILE_EXTS.has(ext)) return
  const content = fs.readFileSync(file, 'utf8')
  const lines = content.split(/\r?\n/)

  lines.forEach((rawLine, index) => {
    const lineNumber = index + 1
    const line = rawLine

    // typography:tiny-font (font-size in px below 12)
    const fontSizeMatches = line.matchAll(/font-size:\s*(\d+(?:\.\d+)?)px/g)
    for (const match of fontSizeMatches) {
      const value = Number(match[1])
      if (value < 12) {
        pushFinding({
          severity: value <= 9 ? 'high' : 'medium',
          rule: 'typography:tiny-font',
          file,
          line: lineNumber,
          snippet: line,
          fix: 'Use >= 12px (var(--mp-typography-fontSize-xs) is 12px) for sustained-read text.',
        })
      }
    }

    // typography:weight-noise (uncommon weights like 50/55/65/780/850)
    const weightMatches = line.matchAll(/font-weight:\s*(\d{3})/g)
    for (const match of weightMatches) {
      const value = Number(match[1])
      const expected = [400, 500, 600, 700, 800, 900]
      if (!expected.includes(value)) {
        pushFinding({
          severity: 'low',
          rule: 'typography:weight-noise',
          file,
          line: lineNumber,
          snippet: line,
          fix: `Round to canonical weight (${expected.join(', ')}) to keep type ramp consistent.`,
        })
      }
    }

    // contrast:low-opacity (opacity values < 0.5 in colored text)
    const opacityMatches = line.matchAll(/rgba\(\s*var\(--v-theme-on-(?:surface|background)\),\s*(0?\.\d{1,3})\s*\)/g)
    for (const match of opacityMatches) {
      const value = Number(match[1])
      if (value < 0.5) {
        pushFinding({
          severity: value < 0.4 ? 'medium' : 'low',
          rule: 'contrast:low-opacity',
          file,
          line: lineNumber,
          snippet: line,
          fix: 'Use opacity >= 0.54 for body and >= 0.62 for sustained reading.',
        })
      }
    }

    // contrast:hardcoded-color (raw hex or rgb in style blocks; ignore tokens.json)
    if (file.endsWith('.vue') || file.endsWith('.scss') || file.endsWith('.css')) {
      const colorMatches = line.match(/#(?:[0-9a-fA-F]{3,8})\b/g)
      if (colorMatches) {
        for (const c of colorMatches) {
          // ignore short SVG color refs like #ffffff in icon paths is rare
          pushFinding({
            severity: 'low',
            rule: 'contrast:hardcoded-color',
            file,
            line: lineNumber,
            snippet: line,
            fix: `Replace ${c} with a theme/token value (rgb(var(--v-theme-...)) or var(--mp-color-...)).`,
          })
        }
      }

      const rawRgbMatches = line.match(/rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+/g)
      if (rawRgbMatches) {
        for (const c of rawRgbMatches) {
          pushFinding({
            severity: 'low',
            rule: 'contrast:hardcoded-color',
            file,
            line: lineNumber,
            snippet: line,
            fix: `Replace ${c} with rgb/rgba(var(--v-theme-on-surface), x) or token-backed color.`,
          })
        }
      }
    }

    // chart:label-too-small (apex options with fontSize 11px or less)
    if (line.includes('fontSize:') && /['\"](\d+)px['\"]/.test(line)) {
      const value = Number(line.match(/['\"](\d+)px['\"]/)[1])
      if (value < 12) {
        pushFinding({
          severity: 'medium',
          rule: 'chart:label-too-small',
          file,
          line: lineNumber,
          snippet: line,
          fix: 'Use 12px or larger for chart axis labels for readability.',
        })
      }
    }

    // layout:overflow-risk (max-width: 100vw, white-space: nowrap without truncate, fixed pixel widths > 1200)
    const fixedWideWidth = line.match(/(?:max-)?width:\s*(\d{4,})px/)
    if (fixedWideWidth && Number(fixedWideWidth[1]) > 1280) {
      pushFinding({
        severity: 'low',
        rule: 'layout:overflow-risk',
        file,
        line: lineNumber,
        snippet: line,
        fix: 'Avoid fixed widths > 1280px; prefer fluid layouts that wrap on small screens.',
      })
    }
  })

  // a11y:missing-aria-label — icon-only v-btn (uses standalone `icon` prop) without label
  if (file.endsWith('.vue')) {
    // match <v-btn ... icon ... > or <v-btn ... icon="..." ... > but NOT prepend-icon / append-icon
    const iconBtnRegex = /<v-btn\b[^>]*?(?:^|[\s])(?:icon)(?:=(?:"[^"]*"|'[^']*'|\{[^}]*\}|[^\s>]+))?(?=\s|>)[^>]*>/gm
    let match
    while ((match = iconBtnRegex.exec(content)) !== null) {
      const tag = match[0]
      // strip prepend-/append- variants, then check for raw `icon` token
      const stripped = tag
        .replace(/\bprepend-icon\b(?:=(?:"[^"]*"|'[^']*'|\{[^}]*\}|[^\s>]+))?/g, '')
        .replace(/\bappend-icon\b(?:=(?:"[^"]*"|'[^']*'|\{[^}]*\}|[^\s>]+))?/g, '')
      if (!/\bicon\b(?:=|\s|>)/.test(stripped)) continue
      if (/\baria-label\b/.test(tag) || /:aria-label/.test(tag)) continue
      // surrounding v-tooltip with descriptive text counts as accessible name
      const before = content.slice(Math.max(0, match.index - 200), match.index)
      const after = content.slice(match.index + tag.length, match.index + tag.length + 200)
      const wrappedInTooltip =
        /<v-tooltip\b[^>]*\btext=/.test(before) ||
        /<v-tooltip\b[^>]*>/.test(before) ||
        /<\/v-tooltip>/.test(after)
      if (wrappedInTooltip) continue
      const lineNumber = content.slice(0, match.index).split(/\r?\n/).length
      pushFinding({
        severity: 'medium',
        rule: 'a11y:missing-aria-label',
        file,
        line: lineNumber,
        snippet: tag,
        fix: 'Add aria-label="..." (or wrap in v-tooltip with text=) to icon-only v-btn.',
      })
    }

    // raw <button> with no aria-label and no inner text
    const rawBtnRegex = /<button\b(?![^>]*\baria-label\b)[^>]*>\s*<v-icon[^>]*>[^<]*<\/v-icon>\s*<\/button>/g
    while ((match = rawBtnRegex.exec(content)) !== null) {
      const lineNumber = content.slice(0, match.index).split(/\r?\n/).length
      pushFinding({
        severity: 'medium',
        rule: 'a11y:missing-aria-label',
        file,
        line: lineNumber,
        snippet: match[0].slice(0, 120),
        fix: 'Add aria-label to icon-only <button> elements.',
      })
    }
  }

  // a11y:missing-focus — class/selector defines :hover but never :focus-visible
  if (file.endsWith('.vue') || file.endsWith('.scss') || file.endsWith('.css')) {
    const selectorBlocks = content.matchAll(/(\.[\w-]+)\s*:hover\s*\{/g)
    for (const block of selectorBlocks) {
      const sel = block[1]
      const lineNumber = content.slice(0, block.index).split(/\r?\n/).length
      const focusVariants = [`${sel}:focus-visible`, `${sel}:focus`]
      const hasFocus = focusVariants.some((variant) => content.includes(variant))
      if (!hasFocus) {
        pushFinding({
          severity: 'low',
          rule: 'a11y:missing-focus',
          file,
          line: lineNumber,
          snippet: `${sel}:hover -> no matching :focus-visible`,
          fix: `Add ${sel}:focus-visible with the same hover treatment for keyboard users.`,
        })
      }
    }
  }
}

for (const target of TARGETS) {
  walk(target)
}

findings.sort((a, b) => severityWeight[b.severity] - severityWeight[a.severity])

if (wantJson) {
  console.log(JSON.stringify(findings, null, 2))
  process.exit(findings.some((f) => f.severity === 'high') ? 1 : 0)
}

const counts = findings.reduce((acc, f) => {
  acc[f.severity] = (acc[f.severity] ?? 0) + 1
  return acc
}, {})

console.log('UI Visibility & Accessibility Audit')
console.log('====================================')
console.log(`Scanned roots: ${TARGETS.map((p) => path.relative(ROOT, p)).join(', ')}`)
console.log(`Total findings: ${findings.length} (high: ${counts.high ?? 0}, medium: ${counts.medium ?? 0}, low: ${counts.low ?? 0})`)
console.log('')

if (findings.length === 0) {
  console.log('No findings. UI looks clean.')
  process.exit(0)
}

const groups = findings.reduce((acc, f) => {
  acc[f.rule] = acc[f.rule] ?? []
  acc[f.rule].push(f)
  return acc
}, {})

for (const [rule, items] of Object.entries(groups)) {
  console.log(`### ${rule}  (${items.length})`)
  console.log('')
  for (const item of items.slice(0, 25)) {
    console.log(`- [${item.severity}] ${item.file}:${item.line}`)
    console.log(`    ${item.snippet}`)
    console.log(`    fix: ${item.fix}`)
  }
  if (items.length > 25) {
    console.log(`  ... (+${items.length - 25} more)`)
  }
  console.log('')
}

process.exit(findings.some((f) => f.severity === 'high') ? 1 : 0)
