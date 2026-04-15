<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAnalyticsStore } from '@/stores/useAnalytics'
import { useCommerceStore } from '@/stores/useCommerce'
import { useCampaignsStore } from '@/stores/useCampaigns'
import MpPageHeader from '@/components/MpPageHeader.vue'
import MpKpiCard from '@/components/MpKpiCard.vue'
import MpOverviewChart from '@/components/MpOverviewChart.vue'
import MpSectionHeader from '@/components/MpSectionHeader.vue'
import MpStatusChip from '@/components/MpStatusChip.vue'

const analytics = useAnalyticsStore()
const commerce = useCommerceStore()
const campaigns = useCampaignsStore()

const kpiCards = [
  {
    label: 'Total Revenue',
    value: `$${analytics.accountMetrics.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 0 })}`,
    trend: '+12.5%', trendPositive: true, subStat: 'vs. last month',
    icon: 'mdi-currency-usd', color: 'success',
  },
  {
    label: 'Active Subscribers',
    value: analytics.accountMetrics.activeSubscribers.toLocaleString(),
    trend: '+4.2%', trendPositive: true, subStat: '18,432 on newsletter',
    icon: 'mdi-account-group', color: 'primary',
  },
  {
    label: 'Avg. Email Open Rate',
    value: `${analytics.accountMetrics.avgOpenRate}%`,
    trend: '-1.1%', trendPositive: false, subStat: 'Industry avg: 21.3%',
    icon: 'mdi-email-open-outline', color: 'warning',
  },
  {
    label: 'Email Sends (MTD)',
    value: analytics.accountMetrics.monthlySends.toLocaleString(),
    trend: '+8.4%', trendPositive: true,
    subStat: `${Math.round((analytics.accountMetrics.monthlySends / analytics.accountMetrics.monthlyLimit) * 100)}% of monthly plan`,
    icon: 'mdi-send', color: 'secondary',
  },
]

const recentOrders = commerce.orders.slice(0, 6)
const topSendingCampaigns = campaigns.campaigns.filter(c => c.status === 'Sent').slice(0, 5)

type OverviewRange = '7D' | '30D' | '3M' | 'YTD'

const chartRange = ref<OverviewRange>('30D')
const chartRanges: OverviewRange[] = ['7D', '30D', '3M', 'YTD']
const overviewDatasets: Record<OverviewRange, Array<{ label: string; revenue: number; engagement: number; orders: number }>> = {
  '7D': [
    { label: 'Mon', revenue: 28400, engagement: 22.1, orders: 96 },
    { label: 'Tue', revenue: 30200, engagement: 23.2, orders: 112 },
    { label: 'Wed', revenue: 29750, engagement: 22.8, orders: 108 },
    { label: 'Thu', revenue: 32100, engagement: 24.4, orders: 121 },
    { label: 'Fri', revenue: 34680, engagement: 25.2, orders: 136 },
    { label: 'Sat', revenue: 33540, engagement: 24.1, orders: 130 },
    { label: 'Sun', revenue: 35980, engagement: 26.5, orders: 144 },
  ],
  '30D': [
    { label: 'Week 1', revenue: 154000, engagement: 21.8, orders: 482 },
    { label: 'Week 2', revenue: 176200, engagement: 23.4, orders: 530 },
    { label: 'Week 3', revenue: 163800, engagement: 22.7, orders: 501 },
    { label: 'Week 4', revenue: 198500, engagement: 25.6, orders: 604 },
    { label: 'Week 5', revenue: 214900, engagement: 27.2, orders: 662 },
    { label: 'Today', revenue: 228400, engagement: 28.1, orders: 708 },
  ],
  '3M': [
    { label: 'Jan', revenue: 382000, engagement: 20.2, orders: 1290 },
    { label: 'Feb', revenue: 418000, engagement: 22.6, orders: 1442 },
    { label: 'Mar', revenue: 453000, engagement: 23.8, orders: 1578 },
    { label: 'Apr', revenue: 498000, engagement: 25.1, orders: 1710 },
    { label: 'May', revenue: 542000, engagement: 26.3, orders: 1884 },
    { label: 'Jun', revenue: 586000, engagement: 27.6, orders: 2012 },
  ],
  'YTD': [
    { label: 'Jan', revenue: 382000, engagement: 20.2, orders: 1290 },
    { label: 'Feb', revenue: 418000, engagement: 22.6, orders: 1442 },
    { label: 'Mar', revenue: 453000, engagement: 23.8, orders: 1578 },
  ],
}

const overviewChartPoints = computed(() => overviewDatasets[chartRange.value])

const activityFeed = [
  { icon: 'mdi-email-check', color: 'success', text: 'Campaign "Flash Sale — 40% Off Sitewide" completed with 12,891 clicks.', time: '10 mins ago' },
  { icon: 'mdi-account-check', color: 'primary', text: 'Segment "Lapsed 90 Days" recalculated: 4,201 contacts.', time: '1 hour ago' },
  { icon: 'mdi-connection', color: 'secondary', text: 'New Shopify store connection authenticated successfully.', time: '3 hours ago' },
  { icon: 'mdi-robot', color: 'info', text: 'Journey "Abandoned Cart — 3-Email Recovery" triggered 234 new enrollments.', time: '5 hours ago' },
  { icon: 'mdi-cart-check', color: 'success', text: '47 orders received today — $8,234 in revenue.', time: 'Today' },
]
</script>

<template>
  <div>
    <MpPageHeader
      title="Good afternoon, Admin 👋"
      subtitle="Here is what's happening across your accounts today — March 7, 2026."
      :breadcrumbs="[{ title: 'Home', disabled: true }]"
    >
      <template #actions>
        <v-btn variant="outlined" prepend-icon="mdi-calendar-range" class="text-none">Last 30 Days</v-btn>
        <v-btn color="primary" variant="flat" prepend-icon="mdi-plus" class="text-none">Create Campaign</v-btn>
      </template>
    </MpPageHeader>

    <!-- KPI Metric Cards -->
    <v-row class="dashboard-kpi-row mb-8">
      <v-col v-for="card in kpiCards" :key="card.label" cols="12" sm="6" lg="3">
        <MpKpiCard v-bind="card" />
      </v-col>
    </v-row>

    <!-- Main Body: Chart Area + Activity Feed -->
    <v-row class="dashboard-main-row mb-8">
      <v-col cols="12" lg="8">
        <v-card variant="flat" border rounded="xl" class="dashboard-surface-card dashboard-overview-card pa-6 d-flex flex-column">
          <MpSectionHeader title="Revenue & Engagement Overview">
            <template #actions>
              <v-btn-toggle
                v-model="chartRange"
                mandatory
                divided
                density="comfortable"
                class="mp-toggle-group mp-toggle-group--segmented"
                aria-label="Select overview date range"
              >
                <v-btn
                  v-for="range in chartRanges"
                  :key="range"
                  :value="range"
                  size="small"
                  class="text-none px-3"
                >
                  {{ range }}
                </v-btn>
              </v-btn-toggle>
            </template>
          </MpSectionHeader>
          <MpOverviewChart :points="overviewChartPoints" class="dashboard-overview-chart flex-grow-1" />
        </v-card>
      </v-col>
      <v-col cols="12" lg="4">
        <v-card variant="flat" border rounded="xl" class="dashboard-surface-card dashboard-activity-card pa-6 d-flex flex-column">
          <MpSectionHeader title="Recent Activity" />
          <v-list lines="two" density="compact" :border="false" class="dashboard-activity-list pa-0 flex-grow-1">
            <v-list-item
              v-for="(item, idx) in activityFeed"
              :key="idx"
              class="px-5 py-3 border-b"
            >
              <template v-slot:prepend>
                <v-avatar :color="item.color" variant="tonal" size="36" class="mr-3">
                  <v-icon :color="item.color" size="18">{{ item.icon }}</v-icon>
                </v-avatar>
              </template>
              <v-list-item-title class="text-body-2 font-weight-medium" style="white-space: normal; line-height: 1.3;">{{ item.text }}</v-list-item-title>
              <v-list-item-subtitle class="text-caption">{{ item.time }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
          <v-btn block variant="text" color="primary" class="text-none mt-4" append-icon="mdi-arrow-right">View Full Audit Log</v-btn>
        </v-card>
      </v-col>
    </v-row>

    <!-- Bottom Split: Top Campaigns + Recent Orders -->
    <v-row class="dashboard-bottom-row">
      <v-col cols="12" lg="6">
        <v-card variant="flat" border rounded="xl" class="dashboard-surface-card">
          <div class="dashboard-section-card__header d-flex justify-space-between align-center border-b">
            <div class="text-h6 font-weight-medium">Top Campaigns by Revenue</div>
            <v-btn variant="text" size="small" color="primary" class="text-none" to="/campaigns">View All</v-btn>
          </div>
          <v-list lines="two" density="compact" :border="false" class="dashboard-section-card__list pa-0">
            <v-list-item v-for="camp in topSendingCampaigns" :key="camp.id" class="px-5 py-3 border-b">
              <template v-slot:prepend>
                <v-avatar color="success" variant="tonal" size="36" class="mr-3">
                  <v-icon color="success" size="18">mdi-email-check</v-icon>
                </v-avatar>
              </template>
              <v-list-item-title class="text-body-2 font-weight-medium">{{ camp.name.substring(0, 45) }}...</v-list-item-title>
              <v-list-item-subtitle>
                <v-chip size="x-small" variant="tonal" color="success" class="mr-2">{{ Math.floor((camp.metrics.opens / camp.metrics.sent) * 100) }}% open</v-chip>
                <span class="text-caption">${{ camp.metrics.revenue.toLocaleString() }} revenue</span>
              </v-list-item-subtitle>
              <template v-slot:append>
                <span class="text-caption text-medium-emphasis">{{ camp.sentDate }}</span>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <v-col cols="12" lg="6">
        <v-card variant="flat" border rounded="xl" class="dashboard-surface-card">
          <div class="dashboard-section-card__header d-flex justify-space-between align-center border-b">
            <div class="text-h6 font-weight-medium">Recent Orders</div>
            <v-btn variant="text" size="small" color="primary" class="text-none" to="/commerce/orders">View All</v-btn>
          </div>
          <v-list lines="two" density="compact" :border="false" class="dashboard-section-card__list pa-0">
            <v-list-item v-for="order in recentOrders" :key="order.id" class="px-5 py-3 border-b">
              <template v-slot:prepend>
                <v-avatar color="primary" variant="tonal" size="36" class="mr-3 font-weight-bold text-caption">{{ order.customer.avatar }}</v-avatar>
              </template>
              <v-list-item-title class="text-body-2 font-weight-medium">{{ order.customer.name }}</v-list-item-title>
              <v-list-item-subtitle class="text-caption">{{ order.orderNumber }} · {{ order.itemCount }} items · {{ order.date }}</v-list-item-subtitle>
              <template v-slot:append>
                <div class="text-right">
                  <div class="font-weight-bold text-body-2">${{ order.total }}</div>
                  <MpStatusChip :status="order.status || ''" type="order" size="x-small" variant="flat" />
                </div>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped lang="scss">
.dashboard-kpi-row,
.dashboard-main-row,
.dashboard-bottom-row {
  row-gap: 24px;
}

.dashboard-surface-card {
  height: 100%;
}

.dashboard-overview-card,
.dashboard-activity-card {
  padding: 28px !important;
}

.dashboard-overview-chart {
  margin-top: 8px;
}

.dashboard-activity-list :deep(.v-list-item),
.dashboard-section-card__list :deep(.v-list-item) {
  padding-inline: 28px !important;
  padding-block: 18px !important;
}

.dashboard-activity-list :deep(.v-list-item__prepend),
.dashboard-section-card__list :deep(.v-list-item__prepend) {
  margin-inline-end: 16px !important;
}

.dashboard-activity-list :deep(.v-list-item__append),
.dashboard-section-card__list :deep(.v-list-item__append) {
  margin-inline-start: 18px !important;
}

.dashboard-activity-list :deep(.v-list-item-title),
.dashboard-section-card__list :deep(.v-list-item-title) {
  line-height: 1.28;
}

.dashboard-section-card__header {
  padding: 24px 28px 20px;
}

.dashboard-section-card__list {
  padding-bottom: 8px !important;
}

.dashboard-section-card__list :deep(.v-list-item-subtitle) {
  margin-top: 4px;
}

@media (max-width: 1279px) {
  .dashboard-kpi-row,
  .dashboard-main-row,
  .dashboard-bottom-row {
    row-gap: 20px;
  }

  .dashboard-overview-card,
  .dashboard-activity-card {
    padding: 24px !important;
  }

  .dashboard-activity-list :deep(.v-list-item),
  .dashboard-section-card__list :deep(.v-list-item) {
    padding-inline: 24px !important;
  }

  .dashboard-section-card__header {
    padding: 22px 24px 18px;
  }
}
</style>
