/**
 * One-shot migration: replaces all mdi-* icon strings in src/ with
 * their Lucide equivalents. Run once, then delete this script.
 *
 *   node scripts/migrate-icons.mjs
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import { join, extname, dirname } from 'path'
import { fileURLToPath } from 'url'

// ── Mapping: mdi-* → lucide kebab-case name ────────────────────────────────
// Ordered longest/most-specific first to prevent partial-match replacement.
const mapping = [
  // account variants (most specific first)
  ['mdi-account-circle-outline', 'circle-user'],
  ['mdi-account-cog-outline', 'user-cog'],
  ['mdi-account-filter-outline', 'user-search'],
  ['mdi-account-group-outline', 'users'],
  ['mdi-account-heart', 'heart'],
  ['mdi-account-multiple-check', 'user-check'],
  ['mdi-account-multiple-outline', 'users'],
  ['mdi-account-multiple', 'users'],
  ['mdi-account-outline', 'user'],
  ['mdi-account-plus-outline', 'user-plus'],
  ['mdi-account-plus', 'user-plus'],
  ['mdi-account-remove-outline', 'user-minus'],
  ['mdi-account-star-outline', 'user'],
  ['mdi-account-arrow-right', 'log-in'],
  ['mdi-account-group', 'users'],
  ['mdi-account', 'user'],
  // alert variants
  ['mdi-alert-circle-outline', 'alert-circle'],
  ['mdi-alert-circle', 'alert-circle'],
  ['mdi-alert-outline', 'triangle-alert'],
  ['mdi-alert', 'triangle-alert'],
  // arrow variants
  ['mdi-arrow-collapse', 'minimize-2'],
  ['mdi-arrow-expand', 'maximize-2'],
  ['mdi-arrow-top-right', 'arrow-up-right'],
  ['mdi-arrow-up-circle', 'circle-arrow-up'],
  ['mdi-arrow-left', 'arrow-left'],
  ['mdi-arrow-right', 'arrow-right'],
  ['mdi-arrow-up', 'arrow-up'],
  // bell variants
  ['mdi-bell-cog-outline', 'bell-ring'],
  ['mdi-bell-outline', 'bell'],
  // bookmark variants
  ['mdi-bookmark-check-outline', 'bookmark-check'],
  ['mdi-bookmark-check', 'bookmark-check'],
  ['mdi-bookmark-outline', 'bookmark'],
  // bullhorn
  ['mdi-bullhorn-outline', 'megaphone'],
  ['mdi-bullhorn', 'megaphone'],
  // calendar
  ['mdi-calendar-clock', 'calendar-clock'],
  ['mdi-calendar-range', 'calendar-range'],
  // cart variants
  ['mdi-cart-check', 'shopping-cart'],
  ['mdi-cart-off', 'shopping-cart'],
  ['mdi-cart-outline', 'shopping-cart'],
  ['mdi-cart-plus', 'shopping-cart'],
  ['mdi-cart-remove', 'shopping-cart'],
  ['mdi-cart-variant', 'shopping-cart'],
  // cash variants
  ['mdi-cash-multiple', 'banknote'],
  ['mdi-cash-refund', 'banknote'],
  ['mdi-cash-register', 'receipt'],
  // cellphone
  ['mdi-cellphone-message', 'message-circle'],
  ['mdi-cellphone-text', 'smartphone'],
  ['mdi-cellphone', 'smartphone'],
  // chart variants (most specific first)
  ['mdi-chart-box-outline', 'bar-chart-2'],
  ['mdi-chart-box', 'bar-chart-2'],
  ['mdi-chart-scatter-plot', 'scatter-chart'],
  ['mdi-chart-timeline-variant', 'gantt-chart'],
  ['mdi-chart-bar', 'bar-chart-2'],
  ['mdi-chart-line', 'line-chart'],
  // check variants
  ['mdi-check-circle-outline', 'circle-check'],
  ['mdi-check-circle', 'circle-check'],
  ['mdi-check', 'check'],
  // chevron
  ['mdi-chevron-down', 'chevron-down'],
  ['mdi-chevron-right', 'chevron-right'],
  // circle variants
  ['mdi-circle-medium', 'circle'],
  ['mdi-circle', 'circle'],
  // clipboard
  ['mdi-clipboard-text-outline', 'clipboard-list'],
  // clock
  ['mdi-clock-outline', 'clock'],
  // close variants
  ['mdi-close-circle-outline', 'circle-x'],
  ['mdi-close-circle', 'circle-x'],
  ['mdi-close', 'x'],
  // cloud variants
  ['mdi-cloud-outline', 'cloud'],
  ['mdi-cloud-upload-outline', 'cloud-upload'],
  ['mdi-cloud', 'cloud'],
  // code
  ['mdi-code-tags', 'code-2'],
  // cog
  ['mdi-cog-outline', 'settings'],
  ['mdi-cog', 'settings'],
  // content variants
  ['mdi-content-duplicate', 'copy-plus'],
  ['mdi-content-save-outline', 'save'],
  ['mdi-content-save', 'save'],
  ['mdi-content-copy', 'copy'],
  // credit card
  ['mdi-credit-card-check', 'credit-card'],
  ['mdi-credit-card-outline', 'credit-card'],
  ['mdi-credit-card', 'credit-card'],
  // misc one-liners
  ['mdi-api', 'code-2'],
  ['mdi-archive', 'archive'],
  ['mdi-auto-fix', 'wand-2'],
  ['mdi-backup-restore', 'rotate-ccw'],
  ['mdi-ban', 'ban'],
  ['mdi-book-open-page-variant-outline', 'book-open'],
  ['mdi-bookshelf', 'library'],
  ['mdi-broadcast', 'radio'],
  ['mdi-call-split', 'split'],
  ['mdi-camera', 'camera'],
  ['mdi-cancel', 'ban'],
  ['mdi-connection', 'plug'],
  ['mdi-creation', 'sparkles'],
  ['mdi-crown', 'crown'],
  ['mdi-currency-usd', 'dollar-sign'],
  ['mdi-cursor-default-click-outline', 'mouse-pointer-click'],
  ['mdi-cursor-default-click', 'mouse-pointer-click'],
  ['mdi-cursor-move', 'move'],
  // database
  ['mdi-database-export', 'database'],
  ['mdi-database-outline', 'database'],
  // delete
  ['mdi-delete-outline', 'trash-2'],
  ['mdi-delete', 'trash-2'],
  // dns
  ['mdi-dns-outline', 'server'],
  ['mdi-dns', 'server'],
  // dock
  ['mdi-dock-window', 'panel-right'],
  // dots
  ['mdi-dots-horizontal', 'more-horizontal'],
  ['mdi-dots-vertical', 'more-vertical'],
  // download
  ['mdi-download-outline', 'download'],
  ['mdi-download', 'download'],
  // drag
  ['mdi-drag-vertical', 'grip-vertical'],
  // earth
  ['mdi-earth', 'globe'],
  // email variants (most specific first)
  ['mdi-email-alert-outline', 'mail-warning'],
  ['mdi-email-check-outline', 'mail-check'],
  ['mdi-email-check', 'mail-check'],
  ['mdi-email-cog-outline', 'mail'],
  ['mdi-email-edit-outline', 'mail'],
  ['mdi-email-fast-outline', 'send'],
  ['mdi-email-newsletter', 'newspaper'],
  ['mdi-email-off-outline', 'mail-x'],
  ['mdi-email-open-outline', 'mail-open'],
  ['mdi-email-open', 'mail-open'],
  ['mdi-email-outline', 'mail'],
  ['mdi-email-remove-outline', 'mail-x'],
  ['mdi-email-send-outline', 'send'],
  ['mdi-email-send', 'send'],
  ['mdi-email', 'mail'],
  // emoticon
  ['mdi-emoticon-outline', 'smile'],
  // exit
  ['mdi-exit-to-app', 'log-out'],
  // export
  ['mdi-export-variant', 'share'],
  ['mdi-export', 'share'],
  // eye
  ['mdi-eye-off', 'eye-off'],
  ['mdi-eye-outline', 'eye'],
  ['mdi-eye', 'eye'],
  // facebook (no brand in Lucide)
  ['mdi-facebook', 'share-2'],
  // file variants
  ['mdi-file-document-outline', 'file-text'],
  ['mdi-file-plus-outline', 'file-plus'],
  // filter variants
  ['mdi-filter-off-outline', 'filter-x'],
  ['mdi-filter-outline', 'filter'],
  ['mdi-filter-variant-remove', 'list-x'],
  ['mdi-filter-variant', 'list-filter'],
  ['mdi-filter', 'filter'],
  // finance
  ['mdi-finance', 'bar-chart-2'],
  // flag
  ['mdi-flag-checkered', 'flag'],
  // flash
  ['mdi-flash-outline', 'zap'],
  // folder variants
  ['mdi-folder-multiple-outline', 'folder'],
  ['mdi-folder-open', 'folder-open'],
  ['mdi-folder-outline', 'folder'],
  // form variants
  ['mdi-form-dropdown', 'chevron-down'],
  ['mdi-form-select', 'list-checks'],
  // format
  ['mdi-format-color-fill', 'paint-bucket'],
  ['mdi-format-list-bulleted', 'list'],
  // fullscreen
  ['mdi-fullscreen', 'maximize'],
  // globe
  ['mdi-globe', 'globe'],
  // google (no brand in Lucide)
  ['mdi-google', 'globe'],
  // headset
  ['mdi-headset', 'headset'],
  // heart
  ['mdi-heart', 'heart'],
  // help
  ['mdi-help-circle-outline', 'help-circle'],
  ['mdi-help', 'help-circle'],
  // home
  ['mdi-home', 'home'],
  // hub (no exact equivalent)
  ['mdi-hub', 'git-merge'],
  // image
  ['mdi-image-outline', 'image'],
  // information
  ['mdi-information', 'info'],
  // key
  ['mdi-key-variant', 'key-round'],
  // keyboard
  ['mdi-keyboard-return', 'corner-down-left'],
  // lightbulb
  ['mdi-lightbulb-outline', 'lightbulb'],
  ['mdi-lightbulb', 'lightbulb'],
  // lightning
  ['mdi-lightning-bolt', 'zap'],
  // link
  ['mdi-link-variant', 'link'],
  // lock
  ['mdi-lock-outline', 'lock'],
  ['mdi-lock', 'lock'],
  // logout
  ['mdi-logout', 'log-out'],
  // magnify variants
  ['mdi-magnify-remove-outline', 'search-x'],
  ['mdi-magnify-scan', 'scan-search'],
  ['mdi-magnify', 'search'],
  // map
  ['mdi-map-clock-outline', 'map-pin'],
  // menu variants
  ['mdi-menu-down', 'chevron-down'],
  ['mdi-menu-up', 'chevron-up'],
  ['mdi-menu', 'menu'],
  // merge
  ['mdi-merge', 'merge'],
  // message
  ['mdi-message-reply-text', 'reply'],
  ['mdi-message-text-outline', 'message-circle'],
  // microphone
  ['mdi-microphone-outline', 'mic'],
  // minus variants
  ['mdi-minus-circle-outline', 'circle-minus'],
  ['mdi-minus-circle', 'circle-minus'],
  ['mdi-minus', 'minus'],
  // monitor
  ['mdi-monitor-cellphone', 'laptop'],
  ['mdi-monitor', 'monitor'],
  // new-box
  ['mdi-new-box', 'badge'],
  // newspaper
  ['mdi-newspaper-variant', 'newspaper'],
  // note
  ['mdi-note-text', 'file-text'],
  // numeric
  ['mdi-numeric-2-circle', 'circle'],
  // office building
  ['mdi-office-building-outline', 'building-2'],
  // open in new
  ['mdi-open-in-new', 'external-link'],
  // package variants
  ['mdi-package-check', 'package-check'],
  ['mdi-package-variant-closed', 'package'],
  ['mdi-package-variant', 'package'],
  ['mdi-package', 'package'],
  // page layout
  ['mdi-page-layout-footer', 'panel-bottom'],
  // palette variants
  ['mdi-palette-swatch-outline', 'palette'],
  ['mdi-palette-outline', 'palette'],
  ['mdi-palette', 'palette'],
  // paperclip
  ['mdi-paperclip', 'paperclip'],
  // pause variants
  ['mdi-pause-circle-outline', 'circle-pause'],
  ['mdi-pause-circle', 'circle-pause'],
  ['mdi-pause', 'pause'],
  // pencil variants
  ['mdi-pencil-circle', 'pencil'],
  ['mdi-pencil-outline', 'pencil'],
  ['mdi-pencil-ruler', 'ruler'],
  ['mdi-pencil', 'pencil'],
  // percent
  ['mdi-percent', 'percent'],
  // phone
  ['mdi-phone-outline', 'phone'],
  ['mdi-phone', 'phone'],
  // play
  ['mdi-play-circle-outline', 'circle-play'],
  ['mdi-play', 'play'],
  // playlist
  ['mdi-playlist-check', 'list-checks'],
  ['mdi-playlist-plus', 'list-plus'],
  // plus
  ['mdi-plus-circle-outline', 'circle-plus'],
  ['mdi-plus', 'plus'],
  // post
  ['mdi-post-outline', 'file-text'],
  // printer
  ['mdi-printer', 'printer'],
  // progress
  ['mdi-progress-clock', 'clock'],
  // puzzle
  ['mdi-puzzle-outline', 'puzzle'],
  // refresh
  ['mdi-refresh', 'refresh-cw'],
  // relation
  ['mdi-relation-many-to-many', 'network'],
  // robot
  ['mdi-robot-outline', 'bot'],
  // rocket
  ['mdi-rocket-launch-outline', 'rocket'],
  ['mdi-rocket-launch', 'rocket'],
  // routes
  ['mdi-routes', 'route'],
  // send
  ['mdi-send-outline', 'send'],
  ['mdi-send', 'send'],
  // shape
  ['mdi-shape-outline', 'shapes'],
  // share
  ['mdi-share', 'share-2'],
  // shield
  ['mdi-shield-check-outline', 'shield-check'],
  ['mdi-shield-key', 'shield'],
  // shopping
  ['mdi-shopping-cart', 'shopping-cart'],
  ['mdi-shopping-outline', 'shopping-cart'],
  ['mdi-shopping', 'shopping-bag'],
  // snowflake
  ['mdi-snowflake', 'snowflake'],
  // sort
  ['mdi-sort', 'arrow-up-down'],
  // source
  ['mdi-source-branch', 'git-branch'],
  // star
  ['mdi-star-off', 'star-off'],
  ['mdi-star-outline', 'star'],
  ['mdi-star', 'star'],
  // store variants
  ['mdi-storefront-outline', 'store'],
  ['mdi-storefront', 'store'],
  ['mdi-store-outline', 'store'],
  ['mdi-store', 'store'],
  // sync
  ['mdi-sync', 'refresh-cw'],
  // table
  ['mdi-table', 'table-2'],
  // tag variants (most specific first)
  ['mdi-tag-heart-outline', 'tag'],
  ['mdi-tag-heart', 'heart-handshake'],
  ['mdi-tag-minus', 'tag'],
  ['mdi-tag-outline', 'tag'],
  ['mdi-tag-plus', 'tags'],
  ['mdi-tag', 'tag'],
  // target
  ['mdi-target', 'target'],
  // text
  ['mdi-text-box-multiple-outline', 'files'],
  ['mdi-text-short', 'text'],
  // ticket variants
  ['mdi-ticket-confirmation-outline', 'ticket-check'],
  ['mdi-ticket-outline', 'ticket'],
  ['mdi-ticket-percent', 'percent'],
  // timer
  ['mdi-timer-outline', 'timer'],
  ['mdi-timer-sand', 'hourglass'],
  // toggle
  ['mdi-toggle-switch-off', 'toggle-left'],
  // transfer
  ['mdi-transfer', 'arrow-left-right'],
  // trash
  ['mdi-trash-can-outline', 'trash-2'],
  ['mdi-trash-can', 'trash-2'],
  // trending
  ['mdi-trending-down', 'trending-down'],
  ['mdi-trending-up', 'trending-up'],
  // trophy
  ['mdi-trophy-outline', 'trophy'],
  // truck variants
  ['mdi-truck-delivery-outline', 'truck'],
  ['mdi-truck-delivery', 'truck'],
  ['mdi-truck-fast-outline', 'truck'],
  ['mdi-truck-fast', 'truck'],
  ['mdi-truck-outline', 'truck'],
  // tune
  ['mdi-tune-variant', 'sliders'],
  ['mdi-tune-vertical-variant', 'sliders-vertical'],
  // upload
  ['mdi-upload', 'upload'],
  // vector
  ['mdi-vector-square', 'square-dashed'],
  // view variants (most specific first)
  ['mdi-view-column-outline', 'columns-3'],
  ['mdi-view-column', 'columns-3'],
  ['mdi-view-dashboard-edit-outline', 'layout-dashboard'],
  ['mdi-view-dashboard-outline', 'layout-dashboard'],
  ['mdi-view-grid-outline', 'grid-2x2'],
  ['mdi-view-grid-plus-outline', 'grid-2x2-plus'],
  ['mdi-view-grid', 'grid-2x2'],
  ['mdi-view-list-outline', 'layout-list'],
  ['mdi-view-split-vertical', 'columns-2'],
  // weather
  ['mdi-weather-night', 'moon'],
  ['mdi-weather-sunny', 'sun'],
  // web
  ['mdi-web', 'globe'],
  // webhook
  ['mdi-webhook', 'webhook'],
  // wordpress (no brand in Lucide)
  ['mdi-wordpress', 'code-2'],
]

// ── File walker ──────────────────────────────────────────────────────────────
const EXTENSIONS = new Set(['.vue', '.ts', '.tsx', '.js'])
const SRC_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'src')

function walk(dir) {
  const results = []
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry)
    const stat = statSync(fullPath)
    if (stat.isDirectory()) {
      results.push(...walk(fullPath))
    } else if (EXTENSIONS.has(extname(entry))) {
      results.push(fullPath)
    }
  }
  return results
}

// ── Apply substitutions ──────────────────────────────────────────────────────
let totalFiles = 0
let totalReplacements = 0

for (const filePath of walk(SRC_DIR)) {
  let src = readFileSync(filePath, 'utf8')
  let modified = false

  for (const [from, to] of mapping) {
    // Replace all occurrences; the regex ensures we match the exact token
    // (surrounded by non-alphanumeric / end-of-string to avoid partial matches)
    const regex = new RegExp(from.replace(/-/g, '\\-'), 'g')
    const count = (src.match(regex) || []).length
    if (count > 0) {
      src = src.replaceAll(from, to)
      totalReplacements += count
      modified = true
    }
  }

  if (modified) {
    writeFileSync(filePath, src, 'utf8')
    totalFiles++
  }
}

console.log(`✓ Icon migration complete: ${totalReplacements} replacements across ${totalFiles} files.`)
