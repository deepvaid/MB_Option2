import type { Account, SubscriptionKey } from '@/stores/useAccounts'
import type {
  DashboardDataSource,
  DashboardMetricId,
  DashboardMetricUnit,
  DashboardWidgetType,
} from './types'

export interface DashboardSourceMeta {
  id: DashboardDataSource
  label: string
  description: string
  icon: string
  requires?: SubscriptionKey
}

export interface DashboardMetricDescriptor {
  id: DashboardMetricId
  dataSource: DashboardDataSource
  label: string
  description: string
  defaultTitle: string
  defaultWidgetType: DashboardWidgetType
  supportedWidgetTypes: DashboardWidgetType[]
  unit: DashboardMetricUnit
  drilldown: {
    routeName: string
    label: string
  }
  aiKeywords: string[]
}

export const DASHBOARD_SOURCE_META: Record<DashboardDataSource, DashboardSourceMeta> = {
  commerce: {
    id: 'commerce',
    label: 'Commerce',
    description: 'Orders, revenue, conversion, and storefront performance.',
    icon: 'shopping-cart',
    requires: 'commerce',
  },
  marketing: {
    id: 'marketing',
    label: 'Marketing',
    description: 'Campaign performance, deliverability, and engagement.',
    icon: 'megaphone',
    requires: 'marketing',
  },
  analytics: {
    id: 'analytics',
    label: 'Analytics',
    description: 'Cross-channel overview metrics and business trends.',
    icon: 'line-chart',
    requires: 'analytics',
  },
  contacts: {
    id: 'contacts',
    label: 'Contacts',
    description: 'Audience growth, segmentation, and contact quality.',
    icon: 'users',
  },
  service: {
    id: 'service',
    label: 'Service',
    description: 'Ticket backlog, response load, and support health.',
    icon: 'headset',
    requires: 'service',
  },
}

const metricCatalog: Record<DashboardDataSource, DashboardMetricDescriptor[]> = {
  commerce: [
    {
      id: 'commerce_revenue',
      dataSource: 'commerce',
      label: 'Revenue',
      description: 'Gross revenue from placed orders.',
      defaultTitle: 'Revenue',
      defaultWidgetType: 'kpi',
      supportedWidgetTypes: ['kpi'],
      unit: 'currency',
      drilldown: { routeName: 'SalesOrders', label: 'Open sales orders' },
      aiKeywords: ['revenue', 'sales', 'gmv'],
    },
    {
      id: 'commerce_orders',
      dataSource: 'commerce',
      label: 'Orders',
      description: 'Count of orders placed in the selected period.',
      defaultTitle: 'Orders',
      defaultWidgetType: 'kpi',
      supportedWidgetTypes: ['kpi'],
      unit: 'count',
      drilldown: { routeName: 'SalesOrders', label: 'Open sales orders' },
      aiKeywords: ['orders', 'order count', 'purchases'],
    },
    {
      id: 'commerce_aov',
      dataSource: 'commerce',
      label: 'Average Order Value',
      description: 'Average order value in the selected period.',
      defaultTitle: 'Average Order Value',
      defaultWidgetType: 'kpi',
      supportedWidgetTypes: ['kpi'],
      unit: 'currency',
      drilldown: { routeName: 'SalesOrders', label: 'Open sales orders' },
      aiKeywords: ['aov', 'average order value'],
    },
    {
      id: 'commerce_revenue_over_time',
      dataSource: 'commerce',
      label: 'Revenue Over Time',
      description: 'Revenue trend for the selected period.',
      defaultTitle: 'Revenue Over Time',
      defaultWidgetType: 'timeseries',
      supportedWidgetTypes: ['timeseries'],
      unit: 'currency',
      drilldown: { routeName: 'OrdersReport', label: 'Open orders report' },
      aiKeywords: ['revenue trend', 'revenue over time', 'sales trend'],
    },
    {
      id: 'commerce_revenue_by_channel',
      dataSource: 'commerce',
      label: 'Revenue by Channel',
      description: 'Compare revenue across mock sales channels.',
      defaultTitle: 'Revenue by Channel',
      defaultWidgetType: 'bar',
      supportedWidgetTypes: ['bar'],
      unit: 'currency',
      drilldown: { routeName: 'SalesSummary', label: 'Open sales summary' },
      aiKeywords: ['revenue by channel', 'sales channel', 'channel mix'],
    },
    {
      id: 'commerce_recent_orders',
      dataSource: 'commerce',
      label: 'Recent Orders',
      description: 'Latest order activity.',
      defaultTitle: 'Recent Orders',
      defaultWidgetType: 'table',
      supportedWidgetTypes: ['table'],
      unit: 'count',
      drilldown: { routeName: 'SalesOrders', label: 'Open sales orders' },
      aiKeywords: ['recent orders', 'order table', 'latest orders'],
    },
  ],
  marketing: [
    {
      id: 'marketing_open_rate',
      dataSource: 'marketing',
      label: 'Open Rate',
      description: 'Average campaign open rate.',
      defaultTitle: 'Open Rate',
      defaultWidgetType: 'kpi',
      supportedWidgetTypes: ['kpi'],
      unit: 'percent',
      drilldown: { routeName: 'CampaignReports', label: 'Open campaign reports' },
      aiKeywords: ['open rate', 'email opens'],
    },
    {
      id: 'marketing_click_rate',
      dataSource: 'marketing',
      label: 'Click Rate',
      description: 'Average click-through rate for sent campaigns.',
      defaultTitle: 'Click Rate',
      defaultWidgetType: 'kpi',
      supportedWidgetTypes: ['kpi'],
      unit: 'percent',
      drilldown: { routeName: 'CampaignReports', label: 'Open campaign reports' },
      aiKeywords: ['click rate', 'ctr', 'click-through rate'],
    },
    {
      id: 'marketing_sends',
      dataSource: 'marketing',
      label: 'Campaign Sends',
      description: 'Total sends for completed campaigns.',
      defaultTitle: 'Campaign Sends',
      defaultWidgetType: 'kpi',
      supportedWidgetTypes: ['kpi'],
      unit: 'count',
      drilldown: { routeName: 'CampaignReports', label: 'Open campaign reports' },
      aiKeywords: ['sends', 'campaign sends', 'email volume'],
    },
    {
      id: 'marketing_open_rate_over_time',
      dataSource: 'marketing',
      label: 'Open Rate Trend',
      description: 'Open rate across recent campaigns.',
      defaultTitle: 'Open Rate Trend',
      defaultWidgetType: 'timeseries',
      supportedWidgetTypes: ['timeseries'],
      unit: 'percent',
      drilldown: { routeName: 'CampaignReports', label: 'Open campaign reports' },
      aiKeywords: ['open rate trend', 'opens over time', 'show open rate trend'],
    },
    {
      id: 'marketing_campaign_revenue',
      dataSource: 'marketing',
      label: 'Campaign Revenue by Folder',
      description: 'Attributed revenue across campaign folders.',
      defaultTitle: 'Campaign Revenue',
      defaultWidgetType: 'bar',
      supportedWidgetTypes: ['bar'],
      unit: 'currency',
      drilldown: { routeName: 'EmailCampaigns', label: 'Open email campaigns' },
      aiKeywords: ['campaign revenue', 'revenue by campaign', 'campaign performance'],
    },
    {
      id: 'marketing_top_campaigns',
      dataSource: 'marketing',
      label: 'Top Campaigns',
      description: 'Top performing campaigns by revenue.',
      defaultTitle: 'Top Campaigns',
      defaultWidgetType: 'table',
      supportedWidgetTypes: ['table'],
      unit: 'count',
      drilldown: { routeName: 'CampaignReports', label: 'Open campaign reports' },
      aiKeywords: ['top campaigns', 'best campaigns', 'campaign table'],
    },
    {
      id: 'marketing_email_volume',
      dataSource: 'marketing',
      label: 'Email Volume',
      description: 'Sent and delivered email volume over time.',
      defaultTitle: 'Email Volume',
      defaultWidgetType: 'timeseries',
      supportedWidgetTypes: ['timeseries'],
      unit: 'count',
      drilldown: { routeName: 'CampaignReports', label: 'Open campaign reports' },
      aiKeywords: ['email volume', 'sent delivered', 'email trend'],
    },
    {
      id: 'marketing_recent_campaigns',
      dataSource: 'marketing',
      label: 'Recent Sent Campaigns',
      description: 'Latest campaigns with delivery stats.',
      defaultTitle: 'Recent Sent Campaigns',
      defaultWidgetType: 'table',
      supportedWidgetTypes: ['table'],
      unit: 'count',
      drilldown: { routeName: 'EmailCampaigns', label: 'Open email campaigns' },
      aiKeywords: ['recent campaigns', 'sent campaigns', 'campaign list'],
    },
    {
      id: 'marketing_total_campaign_revenue',
      dataSource: 'marketing',
      label: 'Total Campaign Revenue',
      description: 'Revenue attributed to email campaigns over time.',
      defaultTitle: 'Total Campaign Revenue',
      defaultWidgetType: 'timeseries',
      supportedWidgetTypes: ['timeseries', 'bar'],
      unit: 'currency',
      drilldown: { routeName: 'CampaignReports', label: 'Open campaign reports' },
      aiKeywords: ['campaign revenue', 'total campaign revenue', 'email revenue'],
    },
    {
      id: 'marketing_deliverability_score',
      dataSource: 'marketing',
      label: 'Deliverability Score',
      description: 'Overall email deliverability health score.',
      defaultTitle: 'Deliverability Score',
      defaultWidgetType: 'kpi',
      supportedWidgetTypes: ['kpi'],
      unit: 'count',
      drilldown: { routeName: 'CampaignReports', label: 'Open campaign reports' },
      aiKeywords: ['deliverability', 'deliverability score', 'inbox placement'],
    },
  ],
  analytics: [
    {
      id: 'analytics_total_revenue',
      dataSource: 'analytics',
      label: 'Total Revenue',
      description: 'Total attributed revenue across the business.',
      defaultTitle: 'Total Revenue',
      defaultWidgetType: 'kpi',
      supportedWidgetTypes: ['kpi'],
      unit: 'currency',
      drilldown: { routeName: 'MonthlyTotals', label: 'Open monthly totals' },
      aiKeywords: ['total revenue', 'overall revenue'],
    },
    {
      id: 'analytics_total_orders',
      dataSource: 'analytics',
      label: 'Total Orders',
      description: 'Order volume across the selected period.',
      defaultTitle: 'Total Orders',
      defaultWidgetType: 'kpi',
      supportedWidgetTypes: ['kpi'],
      unit: 'count',
      drilldown: { routeName: 'OrdersReport', label: 'Open orders report' },
      aiKeywords: ['total orders', 'order volume'],
    },
    {
      id: 'analytics_active_subscribers',
      dataSource: 'analytics',
      label: 'Active Subscribers',
      description: 'Subscriber count from analytics summary.',
      defaultTitle: 'Active Subscribers',
      defaultWidgetType: 'kpi',
      supportedWidgetTypes: ['kpi'],
      unit: 'count',
      drilldown: { routeName: 'MonthlyTotals', label: 'Open monthly totals' },
      aiKeywords: ['subscribers', 'active subscribers', 'audience size'],
    },
    {
      id: 'analytics_sends_over_time',
      dataSource: 'analytics',
      label: 'Sends Over Time',
      description: 'Sends trend for the analytics period.',
      defaultTitle: 'Sends Over Time',
      defaultWidgetType: 'timeseries',
      supportedWidgetTypes: ['timeseries'],
      unit: 'count',
      drilldown: { routeName: 'MonthlyTotals', label: 'Open monthly totals' },
      aiKeywords: ['sends over time', 'send trend', 'email volume trend'],
    },
  ],
  contacts: [
    {
      id: 'contacts_total',
      dataSource: 'contacts',
      label: 'Total Contacts',
      description: 'All audience records in the workspace.',
      defaultTitle: 'Total Contacts',
      defaultWidgetType: 'kpi',
      supportedWidgetTypes: ['kpi'],
      unit: 'count',
      drilldown: { routeName: 'AllContacts', label: 'Open all contacts' },
      aiKeywords: ['contacts', 'total contacts', 'audience'],
    },
    {
      id: 'contacts_subscribed',
      dataSource: 'contacts',
      label: 'Subscribed Contacts',
      description: 'Contacts currently subscribed to messaging.',
      defaultTitle: 'Subscribed Contacts',
      defaultWidgetType: 'kpi',
      supportedWidgetTypes: ['kpi'],
      unit: 'count',
      drilldown: { routeName: 'AllContacts', label: 'Open all contacts' },
      aiKeywords: ['subscribed contacts', 'subscribers'],
    },
    {
      id: 'contacts_growth',
      dataSource: 'contacts',
      label: 'Contact Growth',
      description: 'Contact creation trend over time.',
      defaultTitle: 'Contact Growth',
      defaultWidgetType: 'timeseries',
      supportedWidgetTypes: ['timeseries'],
      unit: 'count',
      drilldown: { routeName: 'AllContacts', label: 'Open all contacts' },
      aiKeywords: ['contact growth', 'audience growth'],
    },
    {
      id: 'contacts_top_segments',
      dataSource: 'contacts',
      label: 'Top Segments',
      description: 'Largest segments by count.',
      defaultTitle: 'Top Segments',
      defaultWidgetType: 'table',
      supportedWidgetTypes: ['table'],
      unit: 'count',
      drilldown: { routeName: 'Segments', label: 'Open segments' },
      aiKeywords: ['segments', 'top segments', 'audience segments'],
    },
    {
      id: 'contacts_by_domain',
      dataSource: 'contacts',
      label: 'Email Address by Domain',
      description: 'Contact distribution across email domains.',
      defaultTitle: 'Email Address by Domain',
      defaultWidgetType: 'bar',
      supportedWidgetTypes: ['bar'],
      unit: 'count',
      drilldown: { routeName: 'AllContacts', label: 'Open all contacts' },
      aiKeywords: ['email domain', 'domain breakdown', 'contacts by domain'],
    },
    {
      id: 'contacts_subscriber_summary',
      dataSource: 'contacts',
      label: 'Subscriber Summary',
      description: 'Subscriber and unsubscriber counts with net growth.',
      defaultTitle: 'Subscriber Summary',
      defaultWidgetType: 'table',
      supportedWidgetTypes: ['table'],
      unit: 'count',
      drilldown: { routeName: 'AllContacts', label: 'Open all contacts' },
      aiKeywords: ['subscriber summary', 'subscribers', 'unsubscribers', 'net growth'],
    },
  ],
  service: [
    {
      id: 'service_open_tickets',
      dataSource: 'service',
      label: 'Open Tickets',
      description: 'Current unresolved support tickets.',
      defaultTitle: 'Open Tickets',
      defaultWidgetType: 'kpi',
      supportedWidgetTypes: ['kpi'],
      unit: 'count',
      drilldown: { routeName: 'Tickets', label: 'Open ticket queue' },
      aiKeywords: ['open tickets', 'support backlog'],
    },
    {
      id: 'service_resolution_rate',
      dataSource: 'service',
      label: 'Resolution Rate',
      description: 'Resolved tickets as a share of total tickets.',
      defaultTitle: 'Resolution Rate',
      defaultWidgetType: 'kpi',
      supportedWidgetTypes: ['kpi'],
      unit: 'percent',
      drilldown: { routeName: 'Tickets', label: 'Open ticket queue' },
      aiKeywords: ['resolution rate', 'ticket resolution'],
    },
    {
      id: 'service_ticket_volume',
      dataSource: 'service',
      label: 'Ticket Volume',
      description: 'Support tickets created over time.',
      defaultTitle: 'Ticket Volume',
      defaultWidgetType: 'timeseries',
      supportedWidgetTypes: ['timeseries'],
      unit: 'count',
      drilldown: { routeName: 'Tickets', label: 'Open ticket queue' },
      aiKeywords: ['ticket volume', 'support tickets over time'],
    },
    {
      id: 'service_recent_tickets',
      dataSource: 'service',
      label: 'Recent Tickets',
      description: 'Latest ticket activity with status and assignee.',
      defaultTitle: 'Recent Tickets',
      defaultWidgetType: 'table',
      supportedWidgetTypes: ['table'],
      unit: 'count',
      drilldown: { routeName: 'Tickets', label: 'Open ticket queue' },
      aiKeywords: ['recent tickets', 'ticket table', 'support queue'],
    },
    {
      id: 'service_new_tickets',
      dataSource: 'service',
      label: 'New Tickets',
      description: 'Tickets created in the selected period.',
      defaultTitle: 'New Tickets',
      defaultWidgetType: 'kpi',
      supportedWidgetTypes: ['kpi'],
      unit: 'count',
      drilldown: { routeName: 'Tickets', label: 'Open ticket queue' },
      aiKeywords: ['new tickets', 'incoming tickets'],
    },
    {
      id: 'service_pending_tickets',
      dataSource: 'service',
      label: 'Pending & On-Hold',
      description: 'Tickets waiting for a response or on hold.',
      defaultTitle: 'Pending & On-Hold',
      defaultWidgetType: 'kpi',
      supportedWidgetTypes: ['kpi'],
      unit: 'count',
      drilldown: { routeName: 'Tickets', label: 'Open ticket queue' },
      aiKeywords: ['pending tickets', 'on hold tickets'],
    },
    {
      id: 'service_unresolved_tickets',
      dataSource: 'service',
      label: 'Unresolved Tickets',
      description: 'All tickets not yet marked as resolved.',
      defaultTitle: 'Unresolved Tickets',
      defaultWidgetType: 'kpi',
      supportedWidgetTypes: ['kpi'],
      unit: 'count',
      drilldown: { routeName: 'Tickets', label: 'Open ticket queue' },
      aiKeywords: ['unresolved tickets', 'backlog'],
    },
    {
      id: 'service_tickets_by_channel',
      dataSource: 'service',
      label: 'Tickets by Channel',
      description: 'Ticket distribution across support channels.',
      defaultTitle: 'Tickets by Channel',
      defaultWidgetType: 'bar',
      supportedWidgetTypes: ['bar'],
      unit: 'count',
      drilldown: { routeName: 'Tickets', label: 'Open ticket queue' },
      aiKeywords: ['tickets by channel', 'channel breakdown'],
    },
    {
      id: 'service_tickets_by_type',
      dataSource: 'service',
      label: 'Tickets by Type',
      description: 'Ticket count grouped by issue type.',
      defaultTitle: 'Tickets by Type',
      defaultWidgetType: 'bar',
      supportedWidgetTypes: ['bar'],
      unit: 'count',
      drilldown: { routeName: 'Tickets', label: 'Open ticket queue' },
      aiKeywords: ['tickets by type', 'ticket types', 'issue type'],
    },
  ],
}

export function getMetricDescriptor(metricId: DashboardMetricId): DashboardMetricDescriptor | undefined {
  return Object.values(metricCatalog)
    .flat()
    .find((metric) => metric.id === metricId)
}

export function isDashboardSourceAvailable(source: DashboardDataSource, account: Account | undefined): boolean {
  if (!account) return false
  const requirement = DASHBOARD_SOURCE_META[source].requires
  return !requirement || account.subscriptions.includes(requirement)
}

export function getAvailableDashboardSources(account: Account | undefined): DashboardSourceMeta[] {
  if (!account) return []
  return Object.values(DASHBOARD_SOURCE_META).filter((source) => isDashboardSourceAvailable(source.id, account))
}

export function getMetricsForSource(source: DashboardDataSource, account: Account | undefined): DashboardMetricDescriptor[] {
  if (!isDashboardSourceAvailable(source, account)) return []
  return metricCatalog[source]
}

export function getAvailableMetrics(account: Account | undefined): DashboardMetricDescriptor[] {
  if (!account) return []
  return getAvailableDashboardSources(account).flatMap((source) => metricCatalog[source.id])
}
