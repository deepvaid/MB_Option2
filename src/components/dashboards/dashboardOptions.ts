import type { DashboardAccent } from '@/stores/dashboards/types'

export interface DashboardAccentOption {
  value: DashboardAccent
  label: string
  vuetifyColor: string
}

export const DASHBOARD_ACCENT_OPTIONS: DashboardAccentOption[] = [
  { value: 'primary', label: 'Primary', vuetifyColor: 'primary' },
  { value: 'secondary', label: 'Secondary', vuetifyColor: 'secondary' },
  { value: 'success', label: 'Success', vuetifyColor: 'success' },
  { value: 'warning', label: 'Warning', vuetifyColor: 'warning' },
  { value: 'info', label: 'Info', vuetifyColor: 'info' },
  { value: 'neutral', label: 'Neutral', vuetifyColor: 'surface-variant' },
]

export function accentToVuetifyColor(accent: DashboardAccent | undefined): string {
  if (!accent) return 'primary'
  return DASHBOARD_ACCENT_OPTIONS.find((option) => option.value === accent)?.vuetifyColor ?? 'primary'
}

export interface DashboardIconOption {
  icon: string
  label: string
}

export const DASHBOARD_ICON_OPTIONS: DashboardIconOption[] = [
  { icon: 'layout-dashboard', label: 'Dashboard' },
  { icon: 'grid-2x2-plus', label: 'Grid' },
  { icon: 'line-chart', label: 'Chart' },
  { icon: 'bar-chart-2', label: 'Bar Chart' },
  { icon: 'bar-chart-2', label: 'Chart Box' },
  { icon: 'shopping-cart', label: 'Commerce' },
  { icon: 'megaphone', label: 'Marketing' },
  { icon: 'users', label: 'Audience' },
  { icon: 'headset', label: 'Service' },
  { icon: 'sparkles', label: 'Da Vinci' },
  { icon: 'rocket', label: 'Launch' },
  { icon: 'target', label: 'Target' },
  { icon: 'bar-chart-2', label: 'Finance' },
  { icon: 'truck', label: 'Fulfillment' },
  { icon: 'mail', label: 'Email' },
  { icon: 'message-circle', label: 'Mobile' },
  { icon: 'store', label: 'Store' },
  { icon: 'user', label: 'VIP' },
  { icon: 'zap', label: 'Performance' },
  { icon: 'shield-check', label: 'Health' },
  { icon: 'tag', label: 'Catalog' },
  { icon: 'trophy', label: 'Winners' },
  { icon: 'clipboard-list', label: 'Reports' },
  { icon: 'eye', label: 'Insights' },
]

export function relativeTime(iso: string | undefined): string {
  if (!iso) return 'Never'
  const target = new Date(iso).getTime()
  if (Number.isNaN(target)) return 'Never'
  const diffMs = Date.now() - target
  if (diffMs < 0) return 'Just now'
  const seconds = Math.floor(diffMs / 1000)
  if (seconds < 45) return 'Just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  const weeks = Math.floor(days / 7)
  if (weeks < 5) return `${weeks}w ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months}mo ago`
  const years = Math.floor(days / 365)
  return `${years}y ago`
}
