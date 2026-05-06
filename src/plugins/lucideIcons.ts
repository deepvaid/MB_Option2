import type { IconProps, IconSet } from 'vuetify'
import { h, type Component } from 'vue'
import * as LucideIcons from 'lucide-vue-next'

/**
 * Convert kebab-case or camelCase icon name to PascalCase.
 * 'chevron-down' → 'ChevronDown', 'settings' → 'Settings'
 */
function toPascalCase(name: string): string {
  return name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')
}

/**
 * Resolve a Lucide icon component by kebab-case name string.
 * Returns null if no matching export is found.
 */
function resolveLucideIcon(name: string): Component | null {
  const pascal = toPascalCase(name)
  const icon = (LucideIcons as Record<string, Component>)[pascal]
  return icon ?? null
}

/**
 * Vuetify 3 icon set that renders Lucide SVG icons as the primary source.
 *
 * Fallback behaviour for strings that start with `mdi-`:
 *   Renders an <i> with MDI CSS classes so existing `@mdi/font` glyphs still
 *   show while the migration is in progress. Once all mdi-* strings have been
 *   replaced, the MDI CSS import can be removed.
 *
 * Usage in templates (after registration as defaultSet):
 *   icon="settings"         → Lucide Settings
 *   icon="chevron-down"     → Lucide ChevronDown
 *   prepend-icon="plus"     → Lucide Plus
 *   <v-icon>trash-2</v-icon> → Lucide Trash2
 */
export const lucideIconSet: IconSet = {
  component: (props: IconProps) => {
    const { tag, icon, class: cls, style } = props

    // Vue component passed directly (e.g. via $aliases)
    if (icon && typeof icon === 'object' && !Array.isArray(icon)) {
      return h(tag as string, { class: cls, style }, [
        h(icon as Component, { size: '0.875em', strokeWidth: 1.75 }),
      ])
    }

    if (typeof icon === 'string') {
      // MDI fallback: still works while @mdi/font CSS is loaded
      if (icon.startsWith('mdi-')) {
        return h(tag as string, {
          class: ['mdi', icon, cls],
          style,
        })
      }

      // Lucide lookup by kebab-case name
      const lucideIcon = resolveLucideIcon(icon)
      if (lucideIcon) {
        return h(tag as string, { class: cls, style }, [
          h(lucideIcon, { size: '0.875em', strokeWidth: 1.75 }),
        ])
      }
    }

    return h(tag as string, { class: cls, style })
  },
}
