<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import maropostLogo from '@/assets/logo-svg.svg'
import { useAccountsStore, type SubscriptionKey } from '@/stores/useAccounts'

const props = defineProps<{
  modelValue: boolean
  rail: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [val: boolean]
  'update:rail': [val: boolean]
}>()

const accountsStore = useAccountsStore()

// ─── Navigation Structure ────────────────────────────────────
interface NavItem { title: string; route: string; }
interface NavSubGroup { title: string; isSubGroup: true; items: NavItem[] }
interface NavGroup {
  title: string
  icon: string
  singleRoute?: string
  badge?: string
  requires?: SubscriptionKey
  items: (NavItem | NavSubGroup)[]
}

function buildNavGroups(accountId: string): NavGroup[] {
  return [
    {
      title: 'Dashboards',
      icon: 'mdi-view-dashboard-outline',
      items: [
        { title: 'Active Dashboard', route: `/accounts/${accountId}/dashboard` },
        { title: 'All Dashboards', route: `/accounts/${accountId}/dashboards` },
        { title: 'Live View', route: `/accounts/${accountId}/analytics/live_view` },
      ],
    },
    {
      title: 'Analytics',
      icon: 'mdi-chart-line',
      items: [
        { title: 'Monthly Totals', route: `/accounts/${accountId}/analytics/monthly_totals` },
        { title: 'Sales by Order', route: `/accounts/${accountId}/analytics/orders` },
        { title: 'Dispatched Orders', route: `/accounts/${accountId}/analytics/dispatched_orders` },
        { title: 'Sales Summary', route: `/accounts/${accountId}/analytics/sales_summary` },
        { title: 'eRFM Report', route: `/accounts/${accountId}/analytics/erfm_report` },
        { title: 'Campaign Reports', route: `/accounts/${accountId}/reports` },
        { title: 'Recurring Campaign Reports', route: `/accounts/${accountId}/analytics/recurring_campaign_reports` },
        { title: 'A/B Campaign Reports', route: `/accounts/${accountId}/analytics/ab_campaign_reports` },
        { title: 'Test Campaign Reports', route: `/accounts/${accountId}/analytics/test_campaign_reports` },
        { title: 'Website Reports', route: `/accounts/${accountId}/analytics/website_reports` },
        { title: 'Journey Reports', route: `/accounts/${accountId}/analytics/journey_reports` },
        { title: 'Custom Reports', route: `/accounts/${accountId}/analytics/custom_reports` },
        { title: 'Transactional Email Reports', route: `/accounts/${accountId}/analytics/transactional_reports` },
        { title: 'Log Inspector', route: `/accounts/${accountId}/analytics/log_inspector` },
      ],
    },
    {
      title: 'CDP',
      icon: 'mdi-account-group-outline',
      items: [
        { title: 'All Contacts', route: `/accounts/${accountId}/contacts` },
        { title: 'Contact Lists', route: `/accounts/${accountId}/lists` },
        { title: 'Segments', route: `/accounts/${accountId}/segments` },
        { title: 'Contact Fields', route: `/accounts/${accountId}/contact_fields` },
        { title: 'Contact Tags', route: `/accounts/${accountId}/tags` },
        { title: 'Relational Tables', route: `/accounts/${accountId}/relational_tables` },
        { title: 'SQL Queries', route: `/accounts/${accountId}/sql_queries` },
        { title: 'Secure Lists', route: `/accounts/${accountId}/secure_lists` },
        { title: 'Web Tracking', route: `/accounts/${accountId}/web_tracking` },
      ],
    },
    {
      title: 'Products',
      icon: 'mdi-package-variant',
      requires: 'commerce',
      items: [
        { title: 'Product Recommendations', route: `/commerce/${accountId}/product_recommendations` },
        { title: 'Products', route: `/commerce/${accountId}/products` },
        { title: 'Product Tax Category', route: `/commerce/${accountId}/product_tax_category` },
        { title: 'Collections', route: `/commerce/${accountId}/products/collections` },
        { title: 'Inventory', route: `/commerce/${accountId}/inventory` },
        { title: 'Reservations', route: `/commerce/${accountId}/products/reservations` },
      ],
    },
    {
      title: 'Marketing',
      icon: 'mdi-bullhorn-outline',
      items: [
        {
          title: 'Campaigns',
          isSubGroup: true,
          items: [
            { title: 'Email Campaigns', route: `/accounts/${accountId}/campaigns` },
            { title: 'Transactional Email', route: `/accounts/${accountId}/transactional_campaigns` },
            { title: 'Campaign Tags', route: `/accounts/${accountId}/campaign_tags` },
          ],
        },
        {
          title: 'Acquisition',
          isSubGroup: true,
          items: [
            { title: 'Acquisition Forms', route: `/accounts/${accountId}/acquisition` },
            { title: 'Signup Forms', route: `/accounts/${accountId}/signup_forms` },
            { title: 'Landing Pages', route: `/accounts/${accountId}/landing_pages` },
            { title: 'Surveys', route: `/accounts/${accountId}/surveys` },
          ],
        },
        {
          title: 'Automation',
          isSubGroup: true,
          items: [
            { title: 'Journeys', route: `/accounts/${accountId}/journeys` },
            { title: 'Data Journeys', route: `/accounts/${accountId}/data_journeys` },
          ],
        },
        {
          title: 'Content',
          isSubGroup: true,
          items: [
            { title: 'Email Content', route: `/accounts/${accountId}/contents` },
            { title: 'Dynamic Content', route: `/accounts/${accountId}/dynamic_contents` },
            { title: 'Image Library', route: `/accounts/${accountId}/images` },
            { title: 'Footer Management', route: `/accounts/${accountId}/footers` },
            { title: 'Optimise on Open', route: `/accounts/${accountId}/image_groups` },
            { title: 'Content Feeds', route: `/accounts/${accountId}/content_feeds` },
            { title: 'Coupon Banks', route: `/accounts/${accountId}/coupon_banks` },
            { title: 'Preference Management', route: `/accounts/${accountId}/preference_pages` },
            { title: 'Countdown Timer', route: `/accounts/${accountId}/live_content_images` },
          ],
        },
      ],
    },
    {
      title: 'Commerce',
      icon: 'mdi-shopping-outline',
      requires: 'commerce',
      items: [
        {
          title: 'Orders',
          isSubGroup: true,
          items: [
            { title: 'Sales Orders', route: `/commerce/${accountId}/orders` },
            { title: 'Draft Orders', route: `/commerce/${accountId}/orders/drafts` },
            { title: 'Fulfillment', route: `/commerce/${accountId}/fulfillments` },
          ],
        },
        { title: 'Promos & Coupons', route: `/commerce/${accountId}/coupons` },
        { title: 'Sales Channels', route: `/commerce/${accountId}/sales_channels` },
      ],
    },
    {
      title: 'Retail',
      icon: 'mdi-storefront-outline',
      requires: 'commerce',
      singleRoute: `/commerce/${accountId}/retail`,
      items: [],
    },
    {
      title: 'Service',
      icon: 'mdi-headset',
      requires: 'service',
      items: [
        { title: 'Tickets', route: `/accounts/${accountId}/service` },
      ],
    },
    {
      title: 'Da Vinci AI',
      icon: 'mdi-robot-outline',
      badge: 'NEW',
      requires: 'davinci',
      singleRoute: `/accounts/${accountId}/da-vinci/dashboard`,
      items: [],
    },
    {
      title: 'App Store',
      icon: 'mdi-puzzle-outline',
      singleRoute: `/accounts/${accountId}/app_store`,
      items: [],
    },
    {
      title: 'Settings',
      icon: 'mdi-cog-outline',
      singleRoute: `/accounts/${accountId}/settings`,
      items: [],
    },
  ]
}

const localDrawer = ref(props.modelValue)
const localRail = ref(props.rail)
const router = useRouter()
const route = useRoute()
const resolvedAccountId = computed(() => {
  const routeAccountId = Array.isArray(route.params.accountId)
    ? route.params.accountId[0]
    : route.params.accountId

  return routeAccountId ?? accountsStore.activeId
})
const navGroups = computed(() => buildNavGroups(resolvedAccountId.value))

watch(() => props.modelValue, (nextValue) => {
  localDrawer.value = nextValue
})

watch(() => props.rail, (nextValue) => {
  localRail.value = nextValue
})

watch(localDrawer, (nextValue) => {
  emit('update:modelValue', nextValue)
})

watch(localRail, (nextValue) => {
  emit('update:rail', nextValue)
})

function goTo(route: string) {
  if (router.currentRoute.value.fullPath === route) return
  router.push(route)
}

function isLocked(group: NavGroup) {
  return !!group.requires && !accountsStore.hasSubscription(group.requires)
}
</script>

<template>
  <v-navigation-drawer
    v-model="localDrawer"
    :rail="localRail"
    permanent
    :mobile-breakpoint="0"
    width="230"
    class="mp-sidebar"
  >
    <!-- Logo + collapse toggle -->
    <div class="sidebar-header px-3 py-3">
      <v-btn
        icon="mdi-menu"
        variant="text"
        size="small"
        :aria-label="localRail ? 'Expand navigation sidebar' : 'Collapse navigation sidebar'"
        @click.stop="localRail = !localRail"
        class="mr-2 flex-shrink-0 sidebar-muted"
      />
      <button
        type="button"
        class="d-flex align-center gap-3 cursor-pointer sidebar-brand sidebar-brand-button"
        aria-label="Go to dashboard"
        @click="$router.push(`/accounts/${resolvedAccountId}/dashboard`)"
      >
        <img :src="maropostLogo" alt="Maropost" class="sidebar-brand-logo" />
      </button>
    </div>

    <div class="my-1" />

    <!-- Navigation List (Unified Flyout Pattern for both Expanded and Rail) -->
    <v-list density="compact" nav class="px-2 py-1 sidebar-scroll">
      <template v-for="group in navGroups" :key="group.title">
        
        <!-- Group with NO Sub-Items (Direct Link) -->
        <v-list-item
          v-if="group.items.length === 0"
          :to="group.singleRoute"
          @click="group.singleRoute && goTo(group.singleRoute)"
          :prepend-icon="group.icon"
          :title="!localRail ? group.title : ''"
          :value="group.title"
          rounded="lg"
          active-class="active-nav-item"
          class="mb-1 sidebar-text"
        >
          <template v-slot:append v-if="(!localRail && group.badge) || (isLocked(group) && !group.badge)">
            <v-chip v-if="!localRail && group.badge" size="x-small" color="purple-lighten-4" class="text-purple-darken-3 font-weight-bold ml-2">{{ group.badge }}</v-chip>
            <v-tooltip v-if="isLocked(group) && !group.badge" location="end" text="Upgrade to unlock">
              <template v-slot:activator="{ props: tipProps }">
                <v-icon v-bind="tipProps" size="14" class="ml-2 sidebar-lock">mdi-lock-outline</v-icon>
              </template>
            </v-tooltip>
          </template>
        </v-list-item>

        <!-- Group WITH Sub-Items (Flyout Menu) -->
        <v-menu v-else location="end" open-on-hover offset="8" :close-on-content-click="false">
          <template v-slot:activator="{ props: menuProps }">
            <v-list-item
              v-bind="menuProps"
              :prepend-icon="group.icon"
              :title="!localRail ? group.title : ''"
              :value="group.title"
              rounded="lg"
              class="sidebar-text mb-1"
            >
              <template v-slot:append v-if="!localRail">
                <v-tooltip v-if="isLocked(group)" location="end" text="Upgrade to unlock">
                  <template v-slot:activator="{ props: tipProps }">
                    <v-icon v-bind="tipProps" size="14" class="ml-2 sidebar-lock">mdi-lock-outline</v-icon>
                  </template>
                </v-tooltip>
                <v-icon v-else size="small" class="sidebar-muted">mdi-chevron-right</v-icon>
              </template>
            </v-list-item>
          </template>
          
          <!-- First Level Flyout Content -->
          <v-card min-width="200" flat rounded="lg" class="sidebar-surface rail-popover">
            <v-list density="compact" class="bg-transparent py-1">
              <v-list-subheader class="sidebar-subheader font-weight-bold px-4 pt-2 pb-2">{{ group.title }}</v-list-subheader>
              
              <template v-for="item in group.items" :key="item.title">
                
                <!-- Nested Subgroup (Second Level Flyout) -->
                <v-menu v-if="'isSubGroup' in item && item.isSubGroup" location="end" open-on-hover offset="0">
                  <template v-slot:activator="{ props: subMenuProps }">
                    <v-list-item
                      v-bind="subMenuProps"
                      :title="item.title"
                      class="sidebar-text rail-popover-item"
                      rounded="lg"
                      slim
                    >
                      <template v-slot:append>
                        <v-icon size="small" class="sidebar-muted">mdi-chevron-right</v-icon>
                      </template>
                    </v-list-item>
                  </template>
                  
                  <!-- Second Level Flyout Content -->
                  <v-card min-width="200" flat rounded="lg" class="sidebar-surface rail-popover">
                    <v-list density="compact" class="bg-transparent py-1">
                      <v-list-subheader class="sidebar-subheader font-weight-bold px-4 pt-2 pb-2">{{ item.title }}</v-list-subheader>
                      <v-list-item
                        v-for="subItem in item.items"
                        :key="subItem.title"
                        :title="subItem.title"
                        :to="subItem.route"
                        @click="goTo(subItem.route)"
                        class="sidebar-text rail-popover-item"
                        rounded="lg"
                        slim
                        exact
                      />
                    </v-list>
                  </v-card>
                </v-menu>

                <!-- Normal Flyout Item -->
                <v-list-item
                  v-else-if="!('isSubGroup' in item)"
                  :title="item.title"
                  :to="item.route"
                  @click="goTo(item.route)"
                  class="sidebar-text rail-popover-item"
                  rounded="lg"
                  slim
                  exact
                />
              </template>
            </v-list>
          </v-card>
        </v-menu>

      </template>
    </v-list>

    <!-- Bottom: Help -->
    <template v-slot:append>
      <div class="my-1" />
      <div class="pa-2" v-if="!localRail">
        <v-btn block variant="text" prepend-icon="mdi-help-circle-outline" class="text-none justify-start sidebar-help" aria-label="Open help and documentation">
          Help & Documentation
        </v-btn>
      </div>
      <div class="d-flex justify-center pa-2" v-else>
        <v-btn icon="mdi-help-circle-outline" variant="text" size="small" class="sidebar-muted" aria-label="Open help and documentation" />
      </div>
    </template>
  </v-navigation-drawer>
</template>

<style scoped lang="scss">
.mp-sidebar {
  background: var(--mp-color-sidebar-bg);
  border-right: 1px solid var(--mp-color-sidebar-border);
  overflow: visible; /* Required for flyouts to overflow if needed, though v-menu manages z-index */
}
.sidebar-header {
  height: var(--mp-layout-appbarHeight);
  display: flex;
  align-items: center;
  padding-inline: 16px;
}
.sidebar-brand {
  min-width: 0;
}
.sidebar-brand-button {
  appearance: none;
  width: 100%;
  padding: 0;
  border: 0;
  background: transparent;
  text-align: left;
  font: inherit;
}
.sidebar-brand-button:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(var(--v-theme-primary), 0.18);
  border-radius: 16px;
}
.sidebar-scroll {
  overflow-y: auto;
  padding-top: 8px;
  padding-bottom: 12px;
}
.sidebar-muted {
  color: var(--mp-color-sidebar-textMuted);
}
.sidebar-text {
  color: var(--mp-color-sidebar-text);
}
.sidebar-lock {
  color: var(--mp-color-sidebar-textFaint);
  opacity: 0.55;
  transition: color 120ms ease, opacity 120ms ease;
}
:deep(.v-list-item:hover) .sidebar-lock {
  color: var(--mp-color-sidebar-textMuted);
  opacity: 1;
}
.sidebar-brand-logo {
  height: 28px;
  width: auto;
  display: block;
}
.sidebar-chip {
  font-size: 9px;
  height: 16px;
  padding: 0 5px;
  border-radius: 999px;
}
.sidebar-subgroup {
  font-size: var(--mp-typography-fontSize-xs);
  color: var(--mp-color-sidebar-textFaint);
  letter-spacing: 0.08em;
}
.sidebar-child-item {
  padding-left: var(--mp-spacing-7);
}
.sidebar-surface {
  background: var(--mp-color-sidebar-surface);
  box-shadow: none;
}
.rail-popover {
  border: 1px solid var(--mp-color-sidebar-border) !important;
  box-shadow:
    0 8px 24px rgba(15, 23, 42, 0.08),
    0 2px 6px rgba(15, 23, 42, 0.04) !important;
  overflow: hidden;
}
.rail-icon-btn {
  color: var(--mp-color-sidebar-text) !important;
}
.rail-popover-item {
  font-size: var(--mp-typography-fontSize-sm);
  min-height: 32px;
}
.sidebar-subheader {
  color: var(--mp-color-sidebar-textMuted);
  font-size: var(--mp-typography-fontSize-xs);
}
.sidebar-help {
  color: var(--mp-color-sidebar-textFaint);
  font-size: var(--mp-typography-fontSize-body);
}

:deep(.active-nav-item) {
  background: rgba(var(--v-theme-primary), 0.28);
  box-shadow: inset 0 0 0 1px rgba(var(--v-theme-secondary), 0.08);
  color: rgb(var(--v-theme-secondary));
  font-weight: 600;
}
:deep(.v-list-item__prepend .v-icon),
:deep(.v-list-item-title) {
  color: var(--mp-color-sidebar-text);
}
:deep(.v-list-item-subtitle) {
  color: var(--mp-color-sidebar-textMuted);
}

:deep(.v-list-item) {
  min-height: 42px;
  margin-bottom: 2px;
}

:deep(.v-list-item:hover > .v-list-item__overlay) {
  opacity: 0.04;
}

:deep(.v-list-item--nav) {
  border-radius: 16px !important;
}
</style>
