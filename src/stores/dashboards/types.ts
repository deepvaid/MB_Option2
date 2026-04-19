export type DashboardKind = 'system' | 'custom'
export type DashboardWidgetType = 'kpi' | 'timeseries' | 'bar' | 'table'
export type DashboardDataSource = 'commerce' | 'marketing' | 'analytics' | 'contacts' | 'service'
export type DashboardDatePreset = '7D' | '30D' | '90D' | 'YTD'
export type DashboardComparisonMode = 'none' | 'previous_period' | 'previous_year'
export type DashboardMetricUnit = 'currency' | 'count' | 'percent'

export type DashboardMetricId =
  | 'commerce_revenue'
  | 'commerce_orders'
  | 'commerce_aov'
  | 'commerce_revenue_over_time'
  | 'commerce_revenue_by_channel'
  | 'commerce_recent_orders'
  | 'marketing_open_rate'
  | 'marketing_click_rate'
  | 'marketing_sends'
  | 'marketing_open_rate_over_time'
  | 'marketing_campaign_revenue'
  | 'marketing_top_campaigns'
  | 'analytics_total_revenue'
  | 'analytics_total_orders'
  | 'analytics_active_subscribers'
  | 'analytics_sends_over_time'
  | 'contacts_total'
  | 'contacts_subscribed'
  | 'contacts_growth'
  | 'contacts_top_segments'
  | 'service_open_tickets'
  | 'service_resolution_rate'
  | 'service_ticket_volume'
  | 'service_recent_tickets'
  | 'service_new_tickets'
  | 'service_pending_tickets'
  | 'service_unresolved_tickets'
  | 'service_tickets_by_channel'
  | 'service_tickets_by_type'
  | 'marketing_email_volume'
  | 'marketing_recent_campaigns'
  | 'marketing_total_campaign_revenue'
  | 'marketing_deliverability_score'
  | 'contacts_by_domain'
  | 'contacts_subscriber_summary'

export interface DashboardLayout {
  x: number
  y: number
  w: number
  h: number
  minW?: number
  minH?: number
}

export interface DashboardWidgetFilter {
  field: string
  operator: 'eq' | 'in' | 'between'
  value: unknown
}

export interface DashboardWidgetDrilldown {
  routeName: string
  label: string
}

export interface DashboardAiProvenance {
  prompt: string
  summary: string
}

export interface DashboardWidget {
  id: string
  type: DashboardWidgetType
  title: string
  dataSource: DashboardDataSource
  metricId: DashboardMetricId
  dimension?: string
  layout: DashboardLayout
  filters?: DashboardWidgetFilter[]
  drilldown: DashboardWidgetDrilldown
  aiProvenance?: DashboardAiProvenance
}

export interface DashboardFilterState {
  preset: DashboardDatePreset
  comparison: DashboardComparisonMode
}

export type DashboardAccent =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'info'
  | 'neutral'

export interface Dashboard {
  id: string
  accountId: string
  kind: DashboardKind
  name: string
  description?: string
  icon?: string
  accent?: DashboardAccent
  isDefault: boolean
  favorite?: boolean
  lastViewedAt?: string
  widgets: DashboardWidget[]
  filters: DashboardFilterState
  createdAt: string
  updatedAt: string
}

export interface DashboardWidgetDraft {
  dashboardId: string
  widgetId?: string
  type: DashboardWidgetType
  title: string
  dataSource: DashboardDataSource
  metricId: DashboardMetricId
  dimension?: string
  filters?: DashboardWidgetFilter[]
  drilldown: DashboardWidgetDrilldown
  layout?: Partial<DashboardLayout>
  aiProvenance?: DashboardAiProvenance
}

export interface DashboardTableColumn {
  key: string
  label: string
  align?: 'start' | 'center' | 'end'
}

export interface DashboardKpiData {
  kind: 'kpi'
  unit: DashboardMetricUnit
  value: number
  formattedValue: string
  delta: number | null
  deltaLabel: string
  helperText: string
}

export interface DashboardSeriesData {
  kind: 'series'
  unit: DashboardMetricUnit
  labels: string[]
  series: Array<{ name: string; data: number[] }>
}

export interface DashboardTableData {
  kind: 'table'
  columns: DashboardTableColumn[]
  rows: Array<Record<string, string | number>>
}

export type DashboardWidgetData = DashboardKpiData | DashboardSeriesData | DashboardTableData
