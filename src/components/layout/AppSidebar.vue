<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
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
  dividerAfter?: boolean
  items: (NavItem | NavSubGroup)[]
}

function buildNavGroups(accountId: string): NavGroup[] {
  return [
    {
      title: 'Dashboards',
      icon: 'layout-dashboard',
      items: [
        { title: 'Active Dashboard', route: `/accounts/${accountId}/dashboard` },
        { title: 'All Dashboards', route: `/accounts/${accountId}/dashboards` },
        { title: 'Live View', route: `/accounts/${accountId}/analytics/live_view` },
      ],
    },
    {
      title: 'Analytics',
      icon: 'line-chart',
      dividerAfter: true,
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
      icon: 'users',
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
      title: 'Marketing',
      icon: 'megaphone',
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
      title: 'Products',
      icon: 'package',
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
      title: 'Commerce',
      icon: 'shopping-cart',
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
      title: 'Merchandising',
      icon: 'tag',
      requires: 'commerce',
      singleRoute: `/commerce/${accountId}/merchandising`,
      items: [],
    },
    {
      title: 'Retail',
      icon: 'store',
      dividerAfter: true,
      requires: 'commerce',
      singleRoute: `/commerce/${accountId}/retail`,
      items: [],
    },
    {
      title: 'Service',
      icon: 'headset',
      dividerAfter: true,
      requires: 'service',
      items: [
        { title: 'Tickets', route: `/accounts/${accountId}/service` },
      ],
    },
    {
      title: 'Da Vinci AI',
      icon: 'bot',
      badge: 'NEW',
      requires: 'davinci',
      singleRoute: `/accounts/${accountId}/da-vinci/dashboard`,
      dividerAfter: true,
      items: [],
    },
    {
      title: 'Apps',
      icon: 'puzzle',
      singleRoute: `/accounts/${accountId}/app_store`,
      items: [],
    },
  ]
}

const localDrawer = ref(props.modelValue)
const localRail = ref(props.rail)
const openedGroups = ref<string[]>([])
const railHoveredSubGroup = ref<string | null>(null)
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

function hasSubGroups(group: NavGroup) {
  return group.items.some((item) => 'isSubGroup' in item && item.isSubGroup)
}

function railSubGroups(group: NavGroup) {
  return group.items.filter((item): item is NavSubGroup => 'isSubGroup' in item && item.isSubGroup)
}

function railFlatItems(group: NavGroup) {
  return group.items.filter((item): item is NavItem => !('isSubGroup' in item))
}

function activeRailSubGroupItems(group: NavGroup) {
  if (!railHoveredSubGroup.value) return []
  const sub = railSubGroups(group).find((s) => s.title === railHoveredSubGroup.value)
  return sub?.items ?? []
}
</script>

<template>
  <v-navigation-drawer
    v-model="localDrawer"
    :rail="localRail"
    permanent
    :mobile-breakpoint="0"
    width="248"
    class="mp-sidebar"
  >
    <!-- Brand + collapse toggle -->
    <div class="sidebar-header">
      <button
        v-if="!localRail"
        type="button"
        class="sidebar-brand"
        aria-label="Go to dashboard"
        @click="$router.push(`/accounts/${resolvedAccountId}/dashboard`)"
      >
        <span class="sidebar-brand__mark">M</span>
        <span class="sidebar-brand__wordmark">Maropost</span>
      </button>
      <button
        v-else
        type="button"
        class="sidebar-brand sidebar-brand--rail"
        aria-label="Expand sidebar"
        @click.stop="localRail = false"
      >
        <span class="sidebar-brand__mark">M</span>
      </button>
      <v-btn
        v-if="!localRail"
        icon="panel-left-close"
        variant="text"
        size="x-small"
        class="sidebar-collapse-btn"
        :aria-label="'Collapse sidebar'"
        @click.stop="localRail = !localRail"
      />
    </div>

    <!-- Navigation List -->
    <v-list v-model:opened="openedGroups" density="compact" nav class="px-2 py-1 sidebar-scroll">
      <template v-for="group in navGroups" :key="group.title">
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
            <v-chip
              v-if="!localRail && group.badge"
              size="x-small"
              variant="tonal"
              color="secondary"
              class="font-weight-bold ml-2 sidebar-badge"
            >{{ group.badge }}</v-chip>
            <v-tooltip v-if="isLocked(group) && !group.badge" location="end" text="Upgrade to unlock">
              <template v-slot:activator="{ props: tipProps }">
                <v-icon v-bind="tipProps" size="14" class="ml-2 sidebar-lock">lock</v-icon>
              </template>
            </v-tooltip>
          </template>
        </v-list-item>

        <v-list-group
          v-else-if="!localRail"
          :value="group.title"
          class="sidebar-expanded-group"
        >
          <template #activator="{ props: groupProps }">
            <v-list-item
              v-bind="groupProps"
              :prepend-icon="group.icon"
              :title="group.title"
              rounded="lg"
              class="sidebar-text mb-1"
            >
              <template #append v-if="isLocked(group)">
                <v-tooltip location="end" text="Upgrade to unlock">
                  <template #activator="{ props: tipProps }">
                    <v-icon v-bind="tipProps" size="14" class="ml-2 sidebar-lock">lock</v-icon>
                  </template>
                </v-tooltip>
              </template>
            </v-list-item>
          </template>

          <template v-for="item in group.items" :key="item.title">
            <v-list-group
              v-if="'isSubGroup' in item && item.isSubGroup"
              :value="`${group.title}-${item.title}`"
              class="sidebar-expanded-subgroup"
            >
              <template #activator="{ props: subgroupProps }">
                <v-list-item
                  v-bind="subgroupProps"
                  :title="item.title"
                  class="sidebar-text sidebar-subgroup-item"
                  rounded="lg"
                  slim
                />
              </template>

              <v-list-item
                v-for="subItem in item.items"
                :key="subItem.title"
                :title="subItem.title"
                :to="subItem.route"
                @click="goTo(subItem.route)"
                class="sidebar-text sidebar-child-item"
                rounded="lg"
                slim
                exact
              />
            </v-list-group>

            <v-list-item
              v-else-if="!('isSubGroup' in item)"
              :title="item.title"
              :to="item.route"
              @click="goTo(item.route)"
              class="sidebar-text sidebar-child-item"
              rounded="lg"
              slim
              exact
            />
          </template>
        </v-list-group>

        <v-menu v-else location="end" open-on-hover offset="8" :close-on-content-click="false" @update:model-value="(v: boolean) => { if (!v) railHoveredSubGroup = null }">
          <template #activator="{ props: menuProps }">
            <v-list-item
              v-bind="menuProps"
              :prepend-icon="group.icon"
              :title="''"
              :value="group.title"
              rounded="lg"
              class="sidebar-text mb-1"
            />
          </template>

          <!-- Single-column layout for groups without sub-groups -->
          <v-card v-if="!hasSubGroups(group)" min-width="200" flat rounded="lg" class="sidebar-surface rail-popover">
            <v-list density="compact" class="bg-transparent py-1">
              <v-list-subheader class="sidebar-subheader font-weight-bold px-4 pt-2 pb-2">{{ group.title }}</v-list-subheader>
              <v-list-item
                v-for="item in group.items"
                :key="item.title"
                :title="('route' in item) ? item.title : ''"
                :to="('route' in item) ? item.route : undefined"
                @click="('route' in item) && goTo(item.route)"
                class="sidebar-text rail-popover-item"
                rounded="lg"
                slim
                exact
              />
            </v-list>
          </v-card>

          <!-- Two-column cascade layout for groups with sub-groups -->
          <v-card v-else flat rounded="lg" class="sidebar-surface rail-popover rail-popover--cascade">
            <div class="rail-popover__col">
              <v-list density="compact" class="bg-transparent py-1">
                <v-list-subheader class="sidebar-subheader font-weight-bold px-4 pt-2 pb-2">{{ group.title }}</v-list-subheader>

                <v-list-item
                  v-for="flat in railFlatItems(group)"
                  :key="flat.title"
                  :title="flat.title"
                  :to="flat.route"
                  @click="goTo(flat.route)"
                  class="sidebar-text rail-popover-item"
                  rounded="lg"
                  slim
                  exact
                />

                <v-list-item
                  v-for="sub in railSubGroups(group)"
                  :key="sub.title"
                  :title="sub.title"
                  :active="railHoveredSubGroup === sub.title"
                  class="sidebar-text rail-popover-item"
                  rounded="lg"
                  slim
                  @mouseenter="railHoveredSubGroup = sub.title"
                >
                  <template v-slot:append>
                    <v-icon size="small" class="sidebar-muted">chevron-right</v-icon>
                  </template>
                </v-list-item>
              </v-list>
            </div>

            <div v-if="railHoveredSubGroup && activeRailSubGroupItems(group).length" class="rail-popover__col">
              <v-list density="compact" class="bg-transparent py-1">
                <v-list-subheader class="sidebar-subheader font-weight-bold px-4 pt-2 pb-2">{{ railHoveredSubGroup }}</v-list-subheader>
                <v-list-item
                  v-for="child in activeRailSubGroupItems(group)"
                  :key="child.title"
                  :title="child.title"
                  :to="child.route"
                  @click="goTo(child.route)"
                  class="sidebar-text rail-popover-item"
                  rounded="lg"
                  slim
                  exact
                />
              </v-list>
            </div>
          </v-card>
        </v-menu>

        <v-divider v-if="group.dividerAfter" class="sidebar-divider my-1 mx-2" />
      </template>
    </v-list>

    <!-- Bottom: User block -->
    <template v-slot:append>
      <div class="sidebar-user-block" v-if="!localRail">
        <v-avatar color="primary" size="32" class="sidebar-user-block__avatar">DV</v-avatar>
        <div class="sidebar-user-block__info">
          <div class="sidebar-user-block__name">Deepak Vaidya</div>
          <div class="sidebar-user-block__tenant">Acme Studios</div>
        </div>
      </div>
      <div class="d-flex justify-center pa-2" v-else>
        <v-avatar color="primary" size="28" class="sidebar-user-block__avatar">DV</v-avatar>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<style scoped lang="scss">
.mp-sidebar {
  background: var(--surface-1) !important;
  border-right: 1px solid var(--hairline) !important;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 14px;
}

.sidebar-brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  appearance: none;
  border: 0;
  background: transparent;
  cursor: pointer;
  font: inherit;
  padding: 0;
}

.sidebar-brand:focus-visible {
  outline: none;
  border-radius: 8px;
  box-shadow: 0 0 0 3px color-mix(in oklch, var(--accent) 18%, transparent);
}

.sidebar-brand__mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 6px;
  background: var(--accent);
  color: var(--accent-fg);
  font-size: 11px;
  font-weight: 700;
  flex-shrink: 0;
}

.sidebar-brand__wordmark {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 1.4px;
  text-transform: uppercase;
  color: var(--ink);
}

.sidebar-brand--rail {
  justify-content: center;
  width: 100%;
}

.sidebar-collapse-btn {
  width: 24px !important;
  height: 24px !important;
  color: var(--muted) !important;
  opacity: 0;
  transition: opacity 120ms ease;
}

.sidebar-header:hover .sidebar-collapse-btn {
  opacity: 1;
}

.sidebar-scroll {
  overflow-y: auto;
  padding: 4px 14px 12px;
}

.sidebar-user-block {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px;
  border-top: 1px solid var(--hairline);
}

.sidebar-user-block__avatar {
  font-size: 12px;
  font-weight: 700;
  color: var(--accent-fg) !important;
  flex-shrink: 0;
}

.sidebar-user-block__info {
  min-width: 0;
}

.sidebar-user-block__name {
  font-size: 13px;
  font-weight: 600;
  color: var(--ink);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sidebar-user-block__tenant {
  font-size: 11.5px;
  color: var(--muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sidebar-divider {
  border-color: var(--hairline) !important;
  opacity: 1;
  margin: 4px 0 !important;
}

.sidebar-badge {
  height: 18px !important;
  padding-inline: 6px;
  font-size: 10px !important;
  letter-spacing: 0.04em;
}

:deep(.active-nav-item) {
  position: relative;
  background: var(--accent-soft) !important;
  box-shadow: none;
  color: var(--accent-ink) !important;
  font-weight: 600;
}

:deep(.active-nav-item::before) {
  display: none;
}

:deep(.active-nav-item > .v-list-item__overlay) {
  opacity: 0 !important;
}

:deep(.active-nav-item .v-list-item__prepend > .v-icon),
:deep(.active-nav-item .v-list-item-title) {
  color: var(--accent-ink) !important;
}

:deep(.v-list-item__prepend .v-icon),
:deep(.v-list-item-title) {
  color: var(--ink);
}

:deep(.v-list-item-subtitle) {
  color: var(--muted);
}

:deep(.v-list-item) {
  min-height: 36px;
  margin-bottom: 1px;
  padding: 9px 10px;
  border-radius: 10px !important;
}

:deep(.v-list-item-title) {
  font-size: 13.5px;
  font-weight: 500;
  line-height: 1.2;
}

:deep(.v-list-item__prepend > .v-icon) {
  font-size: 18px;
  margin-inline-end: 10px;
}

:deep(.v-list-item:hover > .v-list-item__overlay) {
  opacity: 0.03;
}

.sidebar-child-item {
  padding-left: 28px !important;
  position: relative;
}

.sidebar-child-item::before {
  content: '';
  position: absolute;
  left: 18px;
  top: 4px;
  bottom: 4px;
  width: 1px;
  background: var(--hairline);
}

:deep(.sidebar-child-item) {
  min-height: 32px;
  padding: 7px 10px 7px 28px !important;
  border-radius: 8px !important;
}

:deep(.sidebar-child-item .v-list-item-title) {
  font-size: 13px;
}

.sidebar-subgroup-item {
  padding-left: 20px !important;
  color: var(--muted);
}

.sidebar-surface {
  background: var(--surface-1);
  box-shadow: none;
}

.rail-popover {
  border: 1px solid var(--hairline) !important;
  box-shadow:
    0 8px 24px rgba(15, 23, 42, 0.08),
    0 2px 6px rgba(15, 23, 42, 0.04) !important;
  overflow: hidden;
}

.rail-popover--cascade {
  display: grid;
  grid-template-columns: 200px 200px;
  min-width: 400px;
}

.rail-popover__col {
  padding: 8px;
  min-height: 100px;
}

.rail-popover__col + .rail-popover__col {
  border-left: 1px solid rgb(var(--v-theme-outline-variant));
}

.rail-popover-item {
  font-size: 13px;
  min-height: 32px;
}

.sidebar-subheader {
  color: var(--muted);
  font-size: 11px;
}

.sidebar-expanded-group :deep(.v-list-group__items) {
  position: relative;
}

.sidebar-expanded-group :deep(.v-list-group__items::before) {
  content: '';
  position: absolute;
  left: 24px;
  top: 0;
  bottom: 8px;
  width: 1px;
  background: var(--hairline);
}
</style>
