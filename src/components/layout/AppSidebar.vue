<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import maropostLogo from '@/assets/logo-svg.svg'

const props = defineProps<{
  modelValue: boolean
  rail: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [val: boolean]
  'update:rail': [val: boolean]
}>()

// ─── Navigation Structure ────────────────────────────────────
interface NavItem { title: string; route: string; group?: string }
interface NavGroup { title: string; icon: string; singleRoute?: string; badge?: string; items: NavItem[] }

const navGroups: NavGroup[] = [
  {
    title: 'Dashboard',
    icon: 'mdi-view-dashboard-outline',
    singleRoute: '/dashboard',
    items: []
  },
  {
    title: 'Analytics',
    icon: 'mdi-chart-line',
    items: [
      { title: 'Monthly Totals',              route: '/analytics/reports/monthly_totals' },
      { title: 'Sales by Order',              route: '/analytics/reports/orders' },
      { title: 'Dispatched Orders',           route: '/analytics/reports/dispatched_orders' },
      { title: 'Sales Summary',               route: '/analytics/reports/sales_summary' },
      { title: 'Campaign Reports',            route: '/analytics/reports/campaign_reports' },
      { title: 'Recurring Reports',           route: '/analytics/reports/recurring_campaign_reports' },
      { title: 'A/B Campaign Reports',        route: '/analytics/reports/ab_campaign_reports' },
      { title: 'Test Campaign Reports',       route: '/analytics/reports/test_campaign_reports' },
      { title: 'Website Reports',             route: '/analytics/reports/website_reports' },
      { title: 'Journey Reports',             route: '/analytics/reports/journey_reports' },
      { title: 'Custom Reports',              route: '/analytics/custom_reports' },
      { title: 'Transactional Reports',       route: '/analytics/reports/transactional_campaign_reports' },
      { title: 'Log Inspector',               route: '/analytics/log_inspector' },
    ]
  },
  {
    title: 'Contacts',
    icon: 'mdi-account-group-outline',
    items: [
      { title: 'All Contacts',      route: '/contacts' },
      { title: 'Contact Lists',     route: '/lists' },
      { title: 'Segments',          route: '/segmentations' },
      { title: 'Contact Fields',    route: '/contacts/fields' },
      { title: 'Contact Tags',      route: '/tags' },
      { title: 'Relational Tables', route: '/relational_tables' },
      { title: 'SQL Queries',       route: '/sql_queries' },
      { title: 'Secure Lists',      route: '/secure_lists' },
      { title: 'Web Tracking',      route: '/marketing/tracking_domains' },
    ]
  },
  {
    title: 'Products',
    icon: 'mdi-package-variant',
    items: [
      { title: 'Products List',          route: '/commerce/products' },
      { title: 'Inventory',              route: '/commerce/inventory' },
      { title: 'Reservations',           route: '/commerce/products/reservations' },
      { title: 'Product Recommendations',route: '/product_recommendations' },
    ]
  },
  {
    title: 'Commerce',
    icon: 'mdi-cart-outline',
    items: [
      { title: 'Sales Orders',   route: '/commerce/orders' },
      { title: 'Draft Orders',   route: '/commerce/orders/drafts' },
      { title: 'Fulfillment',    route: '/commerce/fulfillments' },
      { title: 'Promos & Coupons', route: '/commerce/coupons' },
      { title: 'Sales Channels', route: '/commerce/store-setup' },
    ]
  },
  {
    title: 'Marketing',
    icon: 'mdi-bullhorn-outline',
    items: [
      { title: 'Email Campaigns',    route: '/campaigns',                 group: 'Campaigns' },
      { title: 'Transactional Email',route: '/transactional_campaigns',   group: 'Campaigns' },
      { title: 'Campaign Tags',      route: '/campaign_tags',             group: 'Campaigns' },
      { title: 'Acquisition Forms',  route: '/marketing/acquisition_forms', group: 'Acquisition' },
      { title: 'Signup Forms',       route: '/signup_forms',              group: 'Acquisition' },
      { title: 'Landing Pages',      route: '/marketing/landing_pages',   group: 'Acquisition' },
      { title: 'Surveys',            route: '/content/surveys',           group: 'Acquisition' },
      { title: 'Journeys',           route: '/workflows',                 group: 'Automation' },
      { title: 'Data Journeys',      route: '/data_workflows',            group: 'Automation' },
      { title: 'Email Content',      route: '/contents',                  group: 'Content' },
      { title: 'Dynamic Content',    route: '/dynamic_contents',          group: 'Content' },
      { title: 'Image Library',      route: '/images',                    group: 'Content' },
      { title: 'Footer Management',  route: '/footers',                   group: 'Content' },
      { title: 'Optimise on Open',   route: '/image_groups',              group: 'Content' },
      { title: 'Content Feeds',      route: '/content_feeds',             group: 'Content' },
      { title: 'Coupon Banks',       route: '/coupon_banks',              group: 'Content' },
      { title: 'Preference Pages',   route: '/content/preference_pages',  group: 'Content' },
      { title: 'Countdown Timer',    route: '/live_content_images',       group: 'Content' },
    ]
  },
  {
    title: 'Service',
    icon: 'mdi-headset',
    items: [
      { title: 'Tickets', route: '/service/tickets' },
    ]
  },
  {
    title: 'Da Vinci',
    icon: 'mdi-robot-outline',
    badge: 'NEW',
    items: [
      { title: 'AI Dashboard', route: '/da-vinci/dashboard' },
      { title: 'AI Studio',    route: '/da-vinci' },
    ]
  },
  {
    title: 'Integrations',
    icon: 'mdi-puzzle-outline',
    singleRoute: '/integrations',
    items: []
  },
  {
    title: 'Settings',
    icon: 'mdi-cog-outline',
    items: [
      { title: 'Workspace Settings', route: '/settings' },
      { title: 'Design System', route: '/design-system' },
    ]
  },
]

const marketingGroups = ['Campaigns', 'Acquisition', 'Automation', 'Content']

const localDrawer = ref(props.modelValue)
const localRail = ref(props.rail)
const router = useRouter()

function goTo(route: string) {
  router.push(route)
}
</script>

<template>
  <v-navigation-drawer
    v-model="localDrawer"
    :rail="localRail"
    permanent
    :mobile-breakpoint="0"
    width="260"
    class="mp-sidebar"
  >
    <!-- Logo + collapse toggle -->
    <div class="sidebar-header px-3 py-3">
      <v-btn
        icon="mdi-menu"
        variant="text"
        size="small"
        :aria-label="localRail ? 'Expand navigation sidebar' : 'Collapse navigation sidebar'"
        @click.stop="localRail = !localRail; emit('update:rail', localRail)"
        class="mr-2 flex-shrink-0 sidebar-muted"
      />
      <button
        type="button"
        class="d-flex align-center gap-3 cursor-pointer sidebar-brand sidebar-brand-button"
        aria-label="Go to dashboard"
        @click="$router.push('/dashboard')"
      >
        <img :src="maropostLogo" alt="Maropost" class="sidebar-brand-logo" />
      </button>
    </div>

    <div class="my-1" />

    <!-- Full Navigation (expanded mode) -->
    <v-list density="compact" nav class="px-2 py-1 sidebar-scroll" v-if="!localRail">
      <template v-for="group in navGroups" :key="group.title">
        <v-list-item
          v-if="group.singleRoute"
          :to="group.singleRoute"
          @click="goTo(group.singleRoute)"
          :prepend-icon="group.icon"
          :title="group.title"
          rounded="lg"
          active-class="active-nav-item"
          class="mb-1 sidebar-text"
        >
          <template v-slot:append v-if="group.badge">
            <v-chip size="x-small" color="success" variant="flat" class="sidebar-chip">{{ group.badge }}</v-chip>
          </template>
        </v-list-item>

        <v-list-group v-else :value="group.title" class="mb-1">
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              :prepend-icon="group.icon"
              :title="group.title"
              rounded="lg"
              class="sidebar-text"
            >
              <template v-slot:append="{ isActive }" v-if="group.badge">
                <v-chip size="x-small" color="success" variant="flat" class="mr-1 sidebar-chip">{{ group.badge }}</v-chip>
                <v-icon>{{ isActive ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
              </template>
            </v-list-item>
          </template>

          <!-- Marketing gets grouped sub-sections -->
          <template v-if="group.title === 'Marketing'">
            <div v-for="subGroup in marketingGroups" :key="subGroup">
              <div class="px-4 pt-2 pb-1">
                <span class="text-uppercase font-weight-bold sidebar-subgroup">{{ subGroup }}</span>
              </div>
              <v-list-item
                v-for="item in group.items.filter(i => i.group === subGroup)"
                :key="item.title"
                :title="item.title"
                :to="item.route"
                @click="goTo(item.route)"
                rounded="lg"
                exact
                class="mb-0.5 sidebar-child-item sidebar-text"
              />
            </div>
          </template>

          <!-- All other groups — flat list -->
          <template v-else>
            <v-list-item
              v-for="item in group.items"
              :key="item.title"
              :title="item.title"
              :to="item.route"
              @click="goTo(item.route)"
              rounded="lg"
              exact
              class="mb-0.5 sidebar-child-item sidebar-text"
            />
          </template>
        </v-list-group>
      </template>
    </v-list>

    <!-- Rail Mode Icons Only -->
    <div class="d-flex flex-column align-center px-1 py-1 rail-icon-list" v-else>
      <v-menu v-for="group in navGroups" :key="group.title" location="end" open-on-hover offset="8">
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            :icon="group.icon"
            variant="text"
            size="40"
            :aria-label="group.title"
            :to="group.singleRoute"
            @click="group.singleRoute && goTo(group.singleRoute)"
            rounded="lg"
            class="mb-1 sidebar-text rail-icon-btn"
          />
        </template>
        <v-card width="220" flat border rounded="xl" class="sidebar-surface rail-popover">
          <v-list density="compact" class="bg-transparent py-1">
            <v-list-subheader class="sidebar-subheader">{{ group.title }}</v-list-subheader>
            <template v-if="group.singleRoute">
              <v-list-item :to="group.singleRoute" :title="group.title" @click="goTo(group.singleRoute)" class="sidebar-text rail-popover-item" rounded="lg" slim />
            </template>
            <template v-else>
              <v-list-item
                v-for="item in group.items"
                :key="item.title"
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
    </div>

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
.sidebar-logo {
  min-height: 24px;
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
  background: rgba(var(--v-theme-primary), 0.74) !important;
  color: rgb(var(--v-theme-on-primary)) !important;
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
.rail-icon-list {
  overflow-y: auto;
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
:deep(.v-list-group__items .v-list-item--active) {
  background: rgba(var(--v-theme-primary), 0.22);
  box-shadow: inset 0 0 0 1px rgba(var(--v-theme-secondary), 0.08);
  color: rgb(var(--v-theme-secondary));
  font-weight: 600;
}
:deep(.v-list-group__items .v-list-item--active .v-list-item-title) {
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

:deep(.v-list-group__items) {
  padding-top: 2px;
  padding-bottom: 4px;
}

:deep(.v-list-group__items .v-list-item) {
  margin-left: 6px;
}

:deep(.v-list-item--nav) {
  border-radius: 16px !important;
}
</style>
