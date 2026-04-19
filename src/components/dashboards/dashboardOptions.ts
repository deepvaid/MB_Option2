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
  { icon: 'mdi-view-dashboard-outline', label: 'Dashboard' },
  { icon: 'mdi-view-grid-plus-outline', label: 'Grid' },
  { icon: 'mdi-chart-line', label: 'Chart' },
  { icon: 'mdi-chart-bar', label: 'Bar Chart' },
  { icon: 'mdi-chart-box-outline', label: 'Chart Box' },
  { icon: 'mdi-cart-outline', label: 'Commerce' },
  { icon: 'mdi-bullhorn-outline', label: 'Marketing' },
  { icon: 'mdi-account-group-outline', label: 'Audience' },
  { icon: 'mdi-headset', label: 'Service' },
  { icon: 'mdi-creation', label: 'Da Vinci' },
  { icon: 'mdi-rocket-launch-outline', label: 'Launch' },
  { icon: 'mdi-target', label: 'Target' },
  { icon: 'mdi-finance', label: 'Finance' },
  { icon: 'mdi-truck-delivery-outline', label: 'Fulfillment' },
  { icon: 'mdi-email-outline', label: 'Email' },
  { icon: 'mdi-cellphone-message', label: 'Mobile' },
  { icon: 'mdi-store-outline', label: 'Store' },
  { icon: 'mdi-account-star-outline', label: 'VIP' },
  { icon: 'mdi-flash-outline', label: 'Performance' },
  { icon: 'mdi-shield-check-outline', label: 'Health' },
  { icon: 'mdi-tag-outline', label: 'Catalog' },
  { icon: 'mdi-trophy-outline', label: 'Winners' },
  { icon: 'mdi-clipboard-text-outline', label: 'Reports' },
  { icon: 'mdi-eye-outline', label: 'Insights' },
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
