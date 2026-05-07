<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAccountsStore, type SubscriptionKey } from '@/stores/useAccounts'
import { useAppTheme, type AccentKey } from '@/composables/useAppTheme'

const props = defineProps<{
  modelValue: boolean
  rail: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [val: boolean]
  'update:rail': [val: boolean]
}>()

const accountsStore = useAccountsStore()
const { accent, darkSidebar, setAccent, setDarkSidebar } = useAppTheme()

// ─── Accent Swatches ─────────────────────────────────────────
interface AccentSwatch {
  key: AccentKey
  label: string
  color: string
}

const accentSwatches: AccentSwatch[] = [
  { key: 'cyan',   label: 'Cyan',   color: '#0EA5E9' },
  { key: 'blue',   label: 'Blue',   color: '#2D63E8' },
  { key: 'amber',  label: 'Amber',  color: '#B45309' },
  { key: 'gray',   label: 'Gray',   color: '#4B5563' },
  { key: 'purple', label: 'Purple', color: '#8B5CF6' },
]

const showAccentPicker = ref(false)

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

interface InstalledAppItem {
  title: string
  icon: string
  status: 'Active' | 'Available'
  route: string
}

function buildNavGroups(accountId: string): NavGroup[] {
  return [
    {
      title: 'Dashboards',
      icon: 'layout-dashboard',
      singleRoute: `/accounts/${accountId}/dashboard`,
      items: [
        { title: 'Home', route: `/accounts/${accountId}/dashboard` },
        { title: 'Manage', route: `/accounts/${accountId}/dashboards` },
        { title: 'Live', route: `/accounts/${accountId}/analytics/live_view` },
      ],
    },
    {
      title: 'CDP',
      icon: 'users',
      singleRoute: `/accounts/${accountId}/contacts`,
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
      title: 'Analytics',
      icon: 'line-chart',
      dividerAfter: true,
      singleRoute: `/accounts/${accountId}/analytics/monthly_totals`,
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
      title: 'Products',
      icon: 'package',
      requires: 'commerce',
      singleRoute: `/commerce/${accountId}/products`,
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
      icon: 'megaphone',
      singleRoute: `/accounts/${accountId}/marketing`,
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
      icon: 'shopping-cart',
      requires: 'commerce',
      singleRoute: `/commerce/${accountId}/orders`,
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
      icon: 'store',
      requires: 'commerce',
      singleRoute: `/commerce/${accountId}/retail`,
      items: [],
    },
    {
      title: 'Merchandise',
      icon: 'tag',
      requires: 'commerce',
      singleRoute: `/commerce/${accountId}/merchandising`,
      items: [],
    },
    {
      title: 'Service',
      icon: 'headset',
      dividerAfter: true,
      requires: 'service',
      singleRoute: `/accounts/${accountId}/service`,
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
const expandedHoveredGroup = ref<string | null>(null)
const appsExpanded = ref(false)

// Enforce single-expand invariant: only one level-2 sub-group open per parent.
// We watch the opened-array Vuetify maintains and prune siblings whenever a new
// sub-group joins.
watch(openedGroups, (next, prev) => {
  const subKeys = next.filter((k) => k.includes('-'))
  const byParent: Record<string, string[]> = {}
  for (const k of subKeys) {
    const parent = k.split('-')[0]
    if (!parent) continue
    ;(byParent[parent] = byParent[parent] || []).push(k)
  }
  let pruned = next
  let changed = false
  for (const [, subs] of Object.entries(byParent)) {
    if (subs.length <= 1) continue
    const justOpened = subs.find((s) => !prev.includes(s)) ?? subs[subs.length - 1]
    pruned = pruned.filter((v) => !subs.includes(v) || v === justOpened)
    changed = true
  }
  if (changed) openedGroups.value = pruned
})
const router = useRouter()
const route = useRoute()
const resolvedAccountId = computed(() => {
  const routeAccountId = Array.isArray(route.params.accountId)
    ? route.params.accountId[0]
    : route.params.accountId

  return routeAccountId ?? accountsStore.activeId
})
const navGroups = computed(() => buildNavGroups(resolvedAccountId.value))
const installedApps = computed<InstalledAppItem[]>(() => [
  {
    title: 'Shopify',
    icon: 'shopping-bag',
    status: 'Active',
    route: `/accounts/${resolvedAccountId.value}/app_store?app=shopify`,
  },
  {
    title: 'Salesforce',
    icon: 'cloud',
    status: 'Active',
    route: `/accounts/${resolvedAccountId.value}/app_store?app=salesforce`,
  },
  {
    title: 'Facebook Ads',
    icon: 'megaphone',
    status: 'Active',
    route: `/accounts/${resolvedAccountId.value}/app_store?app=facebook-ads`,
  },
  {
    title: 'Twilio',
    icon: 'message-square',
    status: 'Active',
    route: `/accounts/${resolvedAccountId.value}/app_store?app=twilio`,
  },
])

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

function isAppsGroup(group: NavGroup) {
  return group.title === 'Apps'
}

// ─── Module-active prefix matching ─────────────────────────
function collectGroupRoutes(group: NavGroup): string[] {
  const routes: string[] = []
  if (group.singleRoute) routes.push(group.singleRoute)
  for (const item of group.items) {
    if ('isSubGroup' in item && item.isSubGroup) {
      for (const sub of item.items) routes.push(sub.route)
    } else if ('route' in item) {
      routes.push(item.route)
    }
  }
  return routes
}

function isModuleActive(group: NavGroup): boolean {
  const path = route.path
  return collectGroupRoutes(group).some((r) => path === r || path.startsWith(r + '/'))
}

// ─── Manual expand/collapse tracking (split label/chevron) ──
const expandedKeys = ref<Set<string>>(new Set())

function isExpanded(group: NavGroup) {
  return expandedKeys.value.has(group.title)
}

function toggleExpanded(group: NavGroup) {
  const next = new Set(expandedKeys.value)
  if (next.has(group.title)) next.delete(group.title)
  else next.add(group.title)
  expandedKeys.value = next
}

// Auto-expand the group whose route is currently active
watch(
  () => route.path,
  () => {
    for (const g of navGroups.value) {
      if (g.items.length && isModuleActive(g)) {
        if (!expandedKeys.value.has(g.title)) {
          const next = new Set(expandedKeys.value)
          next.add(g.title)
          expandedKeys.value = next
        }
      }
    }
  },
  { immediate: true },
)
</script>

<template>
  <v-navigation-drawer
    v-model="localDrawer"
    :rail="localRail"
    :rail-width="64"
    permanent
    :mobile-breakpoint="0"
    width="248"
    class="mp-sidebar"
  >
    <!-- Brand + collapse toggle -->
    <div class="sidebar-header" :class="{ 'sidebar-header--rail': localRail }">
      <template v-if="!localRail">
        <button
          type="button"
          class="sidebar-menu-btn"
          aria-label="Collapse sidebar"
          @click.stop="localRail = true"
        >
          <v-icon size="18">menu</v-icon>
        </button>
        <button
          type="button"
          class="sidebar-brand"
          aria-label="Go to dashboard"
          @click="$router.push(`/accounts/${resolvedAccountId}/dashboard`)"
        >
          <span class="sidebar-brand__wordmark">Maropost</span>
        </button>
      </template>

      <template v-else>
        <button
          type="button"
          class="sidebar-brand sidebar-brand--rail"
          aria-label="Expand sidebar"
          @click.stop="localRail = false"
        >
          <div class="rail-brand-box">M</div>
        </button>
      </template>
    </div>

    <!-- Navigation List -->
    <v-list v-model:opened="openedGroups" density="compact" nav class="px-2 py-1 sidebar-scroll">
      <template v-for="group in navGroups" :key="group.title">
        <template v-if="isAppsGroup(group) && !localRail">
          <v-list-item
            :to="group.singleRoute"
            @click="group.singleRoute && goTo(group.singleRoute)"
            :prepend-icon="group.icon"
            :title="group.title"
            :value="group.title"
            rounded="lg"
            active-class="active-nav-item"
            class="mb-1 sidebar-text"
          >
            <template #append>
              <v-tooltip :text="appsExpanded ? 'Hide installed apps' : 'Show installed apps'" location="end">
                <template #activator="{ props: tipProps }">
                  <v-btn
                    v-bind="tipProps"
                    :icon="appsExpanded ? 'minus' : 'plus'"
                    variant="text"
                    size="x-small"
                    density="comfortable"
                    class="sidebar-apps-toggle"
                    :aria-label="appsExpanded ? 'Hide installed apps' : 'Show installed apps'"
                    @click.stop.prevent="appsExpanded = !appsExpanded"
                  />
                </template>
              </v-tooltip>
            </template>
          </v-list-item>

          <div v-if="appsExpanded" class="sidebar-installed-apps">
            <v-list-item
              v-for="app in installedApps"
              :key="app.title"
              :to="app.route"
              @click="goTo(app.route)"
              rounded="lg"
              class="sidebar-text sidebar-child-item sidebar-app-item"
              exact
            >
              <template #prepend>
                <v-icon size="15">{{ app.icon }}</v-icon>
              </template>
              <v-list-item-title>{{ app.title }}</v-list-item-title>
              <template #append>
                <span class="sidebar-app-item__status">{{ app.status }}</span>
              </template>
            </v-list-item>
          </div>
        </template>

        <v-list-item
          v-else-if="group.items.length === 0"
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

        <div
          v-else-if="!localRail"
          class="sidebar-parent"
          :class="{ 'sidebar-parent--active': isModuleActive(group) }"
        >
          <div class="sidebar-parent-row">
            <v-list-item
              :to="group.singleRoute"
              :prepend-icon="group.icon"
              :title="group.title"
              rounded="lg"
              class="sidebar-text sidebar-parent-row__label"
              :class="{ 'expanded-icon-hovered': expandedHoveredGroup === group.title }"
            >
              <template #append>
                <v-tooltip v-if="isLocked(group)" location="end" text="Upgrade to unlock">
                  <template #activator="{ props: tipProps }">
                    <v-icon v-bind="tipProps" size="14" class="ml-2 sidebar-lock">lock</v-icon>
                  </template>
                </v-tooltip>
              </template>

              <v-menu
                activator="parent"
                location="end"
                open-on-hover
                :open-delay="0"
                :close-delay="120"
                offset="8"
                :close-on-content-click="false"
                @update:model-value="(v: boolean) => {
                  if (v) expandedHoveredGroup = group.title;
                  else { expandedHoveredGroup = null; railHoveredSubGroup = null; }
                }"
              >
                <!-- Single-column flyout card (groups without sub-groups) -->
                <div v-if="!hasSubGroups(group)" class="rail-flyout-card">
                  <div class="rail-flyout-card__header">{{ group.title }}</div>
                  <div
                    v-for="item in group.items"
                    :key="item.title"
                    class="rail-flyout-item"
                    :class="{ 'rail-flyout-item--active': ('route' in item) && $route.path.startsWith(item.route) }"
                    @click="('route' in item) && goTo(item.route)"
                  >{{ ('route' in item) ? item.title : '' }}</div>
                </div>

                <!-- Two separate flyout cards (cascade — groups with sub-groups) -->
                <div v-else class="rail-cascade-wrap">
                  <div class="rail-flyout-card">
                    <div class="rail-flyout-card__header">{{ group.title }}</div>
                    <div
                      v-for="flat in railFlatItems(group)"
                      :key="flat.title"
                      class="rail-flyout-item"
                      :class="{ 'rail-flyout-item--active': $route.path.startsWith(flat.route) }"
                      @click="goTo(flat.route)"
                    >{{ flat.title }}</div>
                    <div
                      v-for="sub in railSubGroups(group)"
                      :key="sub.title"
                      class="rail-flyout-item rail-flyout-item--has-sub"
                      :class="{ 'rail-flyout-item--active': railHoveredSubGroup === sub.title }"
                      @mouseenter="railHoveredSubGroup = sub.title"
                    >
                      <span>{{ sub.title }}</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>
                    </div>
                  </div>
                  <div v-if="railHoveredSubGroup && activeRailSubGroupItems(group).length" class="rail-flyout-card">
                    <div class="rail-flyout-card__header">{{ railHoveredSubGroup }}</div>
                    <div
                      v-for="child in activeRailSubGroupItems(group)"
                      :key="child.title"
                      class="rail-flyout-item"
                      :class="{ 'rail-flyout-item--active': $route.path.startsWith(child.route) }"
                      @click="goTo(child.route)"
                    >{{ child.title }}</div>
                  </div>
                </div>
              </v-menu>
            </v-list-item>

            <button
              type="button"
              class="sidebar-parent-row__chevron"
              :aria-expanded="isExpanded(group)"
              :aria-label="`${isExpanded(group) ? 'Collapse' : 'Expand'} ${group.title}`"
              @click.stop.prevent="toggleExpanded(group)"
              @keydown.enter.stop.prevent="toggleExpanded(group)"
              @keydown.space.stop.prevent="toggleExpanded(group)"
            >
              <v-icon size="14">{{ isExpanded(group) ? 'chevron-up' : 'chevron-down' }}</v-icon>
            </button>
          </div>

          <v-expand-transition>
            <div v-show="isExpanded(group)" class="sidebar-parent__children">
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
                    />
                  </template>

                  <v-list-item
                    v-for="subItem in item.items"
                    :key="subItem.title"
                    :title="subItem.title"
                    :to="subItem.route"
                    @click="goTo(subItem.route)"
                    class="sidebar-text sidebar-grandchild-item"
                    rounded="lg"
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
                  exact
                />
              </template>
            </div>
          </v-expand-transition>
        </div>

        <v-menu v-else location="end" open-on-hover :open-delay="0" :close-delay="120" offset="8" :close-on-content-click="false" @update:model-value="(v: boolean) => { if (!v) railHoveredSubGroup = null }">
          <template #activator="{ props: menuProps, isActive: menuOpen }">
            <v-list-item
              v-bind="menuProps"
              :prepend-icon="group.icon"
              :title="''"
              :value="group.title"
              rounded="lg"
              class="sidebar-text mb-1"
              :class="{ 'rail-icon-hovered': menuOpen }"
            />
          </template>

          <!-- Single-column flyout card (groups without sub-groups) -->
          <div v-if="!hasSubGroups(group)" class="rail-flyout-card">
            <div class="rail-flyout-card__header">{{ group.title }}</div>
            <div
              v-for="item in group.items"
              :key="item.title"
              class="rail-flyout-item"
              :class="{ 'rail-flyout-item--active': ('route' in item) && $route.path.startsWith(item.route) }"
              @click="('route' in item) && goTo(item.route)"
            >{{ ('route' in item) ? item.title : '' }}</div>
          </div>

          <!-- Two separate flyout cards (cascade — groups with sub-groups) -->
          <div v-else class="rail-cascade-wrap">
            <!-- Card 1: group children & subgroup headers -->
            <div class="rail-flyout-card">
              <div class="rail-flyout-card__header">{{ group.title }}</div>
              <div
                v-for="flat in railFlatItems(group)"
                :key="flat.title"
                class="rail-flyout-item"
                :class="{ 'rail-flyout-item--active': $route.path.startsWith(flat.route) }"
                @click="goTo(flat.route)"
              >{{ flat.title }}</div>
              <div
                v-for="sub in railSubGroups(group)"
                :key="sub.title"
                class="rail-flyout-item rail-flyout-item--has-sub"
                :class="{ 'rail-flyout-item--active': railHoveredSubGroup === sub.title }"
                @mouseenter="railHoveredSubGroup = sub.title"
              >
                <span>{{ sub.title }}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>
              </div>
            </div>
            <!-- Card 2: grandchildren of the hovered subgroup -->
            <div v-if="railHoveredSubGroup && activeRailSubGroupItems(group).length" class="rail-flyout-card">
              <div class="rail-flyout-card__header">{{ railHoveredSubGroup }}</div>
              <div
                v-for="child in activeRailSubGroupItems(group)"
                :key="child.title"
                class="rail-flyout-item"
                :class="{ 'rail-flyout-item--active': $route.path.startsWith(child.route) }"
                @click="goTo(child.route)"
              >{{ child.title }}</div>
            </div>
          </div>
        </v-menu>

        <v-divider v-if="group.dividerAfter" class="sidebar-divider my-1 mx-2" />
      </template>
    </v-list>

    <!-- Bottom: Controls -->
    <template v-slot:append>
      <!-- Expanded mode -->
      <div v-if="!localRail" class="sidebar-controls">
        <!-- Dark sidebar toggle -->
        <div class="sidebar-controls__row">
          <v-icon size="16" class="sidebar-controls__icon">moon</v-icon>
          <span class="sidebar-controls__label">Dark sidebar</span>
          <v-switch
            :model-value="darkSidebar"
            @update:model-value="setDarkSidebar($event as boolean)"
            density="compact"
            hide-details
            color="primary"
            class="sidebar-controls__switch"
          />
        </div>

        <!-- Accent picker -->
        <div class="sidebar-controls__row sidebar-controls__accents">
          <v-icon size="16" class="sidebar-controls__icon">palette</v-icon>
          <div class="accent-picker">
            <button
              v-for="swatch in accentSwatches"
              :key="swatch.key"
              type="button"
              class="accent-swatch"
              :class="{ 'accent-swatch--active': accent === swatch.key }"
              :style="{ '--swatch-color': swatch.color, background: swatch.color, color: swatch.color }"
              :aria-label="`Set accent to ${swatch.label}`"
              :title="swatch.label"
              @click="setAccent(swatch.key)"
            />
          </div>
        </div>
      </div>

      <!-- Rail mode -->
      <div v-else class="sidebar-controls sidebar-controls--rail">
        <v-tooltip location="end" :text="darkSidebar ? 'Light sidebar' : 'Dark sidebar'">
          <template #activator="{ props: tipProps }">
            <button
              v-bind="tipProps"
              type="button"
              class="sidebar-rail-btn"
              @click="setDarkSidebar(!darkSidebar)"
            >
              <v-icon size="18">{{ darkSidebar ? 'sun' : 'moon' }}</v-icon>
            </button>
          </template>
        </v-tooltip>

        <v-menu location="end" offset="8" v-model="showAccentPicker">
          <template #activator="{ props: menuProps }">
            <button
              v-bind="menuProps"
              type="button"
              class="sidebar-rail-btn"
            >
              <v-icon size="18">palette</v-icon>
            </button>
          </template>
          <v-card flat rounded="lg" class="sidebar-surface rail-popover accent-popover">
            <div class="accent-popover__inner">
              <div class="accent-popover__title">Accent Color</div>
              <div class="accent-picker">
                <button
                  v-for="swatch in accentSwatches"
                  :key="swatch.key"
                  type="button"
                  class="accent-swatch accent-swatch--lg"
                  :class="{ 'accent-swatch--active': accent === swatch.key }"
                  :style="{ '--swatch-color': swatch.color, background: swatch.color, color: swatch.color }"
                  :aria-label="`Set accent to ${swatch.label}`"
                  :title="swatch.label"
                  @click="setAccent(swatch.key); showAccentPicker = false"
                />
              </div>
            </div>
          </v-card>
        </v-menu>
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
  gap: 10px;
  padding: 14px 14px 14px 14px;
  margin-bottom: 6px;
  border-bottom: 1px solid var(--hairline);
}

.sidebar-header--rail {
  justify-content: center;
  padding: 14px 8px;
}

.sidebar-menu-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--ink);
  cursor: pointer;
  flex-shrink: 0;
  transition: background 120ms ease;
}

.sidebar-menu-btn:hover {
  background: var(--surface-2);
}

.sidebar-menu-btn:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px color-mix(in oklch, var(--accent) 18%, transparent);
}

.sidebar-brand {
  display: inline-flex;
  align-items: center;
  gap: 8px;
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

.sidebar-brand__mark-simple {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  color: var(--ink);
  font-size: 18px;
  font-weight: 800;
  transition: opacity 120ms ease;
}

.sidebar-brand--rail {
  width: 100%;
  justify-content: center;
}

.rail-brand-box {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: var(--ink);
  color: var(--surface-1);
  font-size: 15px;
  font-weight: 700;
  letter-spacing: -0.5px;
  transition: opacity 120ms ease;
}

.sidebar-brand--rail:hover .rail-brand-box {
  opacity: 0.82;
}

.sidebar-brand__wordmark {
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 1.1px;
  text-transform: uppercase;
  color: var(--ink);
}

.sidebar-apps-toggle {
  width: 24px !important;
  height: 24px !important;
  color: var(--muted) !important;
}

.sidebar-apps-toggle:hover {
  color: var(--accent-ink) !important;
}

.sidebar-installed-apps {
  margin: 0 0 6px;
}

.sidebar-app-item {
  --indent-padding: 20px;
}

.sidebar-app-item :deep(.v-list-item__prepend > .v-icon) {
  margin-inline-end: 8px;
  color: var(--muted);
}

.sidebar-app-item__status {
  color: var(--muted);
  font-size: 10.5px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.sidebar-scroll {
  overflow-y: auto;
  padding: 4px 14px 12px;
}

.sidebar-controls {
  padding: 10px 14px;
  border-top: 1px solid var(--hairline);
}

.sidebar-controls--rail {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 0 10px;
}

.sidebar-controls__row {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 32px;
}

.sidebar-controls__icon {
  flex-shrink: 0;
}

.sidebar-controls__label {
  font-size: 12.5px;
  font-weight: 500;
  color: var(--muted);
  flex: 1;
  white-space: nowrap;
}

.sidebar-controls__switch {
  flex: none;
}

:deep(.sidebar-controls__switch .v-switch__track) {
  height: 16px;
  min-width: 28px;
  width: 28px;
}

:deep(.sidebar-controls__switch .v-switch__thumb) {
  width: 12px;
  height: 12px;
}

:deep(.sidebar-controls__switch .v-selection-control) {
  min-height: 24px;
}

.sidebar-controls__accents {
  margin-top: 2px;
}

.accent-picker {
  display: flex;
  align-items: center;
  gap: 7px;
}

.accent-swatch {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  padding: 0;
  appearance: none;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  position: relative;
}

.accent-swatch:hover {
  transform: scale(1.18);
}

.accent-swatch--active {
  box-shadow: 0 0 0 2px var(--surface-1), 0 0 0 3.5px currentColor;
}

.accent-swatch--lg {
  width: 22px;
  height: 22px;
}

.sidebar-rail-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  border: none;
  background: transparent;
  cursor: pointer;
  appearance: none;
  padding: 0;
  transition: background-color 0.15s ease;
}

.sidebar-rail-btn:hover {
  background: color-mix(in oklch, var(--ink) 8%, transparent);
}

.accent-popover {
  padding: 0 !important;
}

.accent-popover__inner {
  padding: 12px 16px;
}

.accent-popover__title {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--muted);
  margin-bottom: 10px;
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
  background: color-mix(in oklch, var(--accent) 10%, transparent) !important;
  box-shadow: none;
  color: var(--accent-ink) !important;
  font-weight: 600;
}

/* ─── Split parent row: clickable label + chevron toggle ─── */
.sidebar-parent {
  margin-bottom: 1px;
}

.sidebar-parent-row {
  position: relative;
  display: flex;
  align-items: center;
}

.sidebar-parent-row__label {
  flex: 1;
  min-width: 0;
}

.sidebar-parent-row__chevron {
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: var(--muted);
  cursor: pointer;
  z-index: 2;
  padding: 0;
  transition: background 120ms ease, color 120ms ease;
}

.sidebar-parent-row__chevron:hover {
  background: color-mix(in oklch, var(--accent) 14%, transparent);
  color: var(--accent-ink);
}

.sidebar-parent-row__chevron:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px color-mix(in oklch, var(--accent) 35%, transparent);
}

.sidebar-parent--active .sidebar-parent-row__label {
  background: color-mix(in oklch, var(--accent) 10%, transparent) !important;
  color: var(--accent-ink) !important;
  font-weight: 600;
}

.sidebar-parent--active .sidebar-parent-row__label :deep(.v-list-item__overlay) {
  opacity: 0 !important;
}

.sidebar-parent--active .sidebar-parent-row__label :deep(.v-list-item__prepend > .v-icon),
.sidebar-parent--active .sidebar-parent-row__label :deep(.v-list-item-title) {
  color: var(--accent-ink) !important;
}

.sidebar-parent--active .sidebar-parent-row__chevron {
  color: var(--accent-ink);
}

.sidebar-parent__children {
  padding-left: 0;
}

:deep(.sidebar-child-item.v-list-item--active) {
  background: rgb(var(--v-theme-primary-container)) !important;
  color: rgb(var(--v-theme-on-primary-container)) !important;
  font-weight: 600;
}

:deep(.sidebar-child-item.v-list-item--active .v-list-item-title) {
  color: rgb(var(--v-theme-on-primary-container)) !important;
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

/* Rail icon & Expanded icon hover state when flyout menu is open */
:deep(.rail-icon-hovered),
:deep(.expanded-icon-hovered) {
  background: color-mix(in oklch, var(--accent) 10%, transparent) !important;
}

:deep(.rail-icon-hovered > .v-list-item__overlay),
:deep(.expanded-icon-hovered > .v-list-item__overlay) {
  opacity: 0 !important;
}

:deep(.rail-icon-hovered .v-list-item__prepend > .v-icon),
:deep(.expanded-icon-hovered .v-list-item__prepend > .v-icon),
:deep(.expanded-icon-hovered .v-list-item-title) {
  color: var(--accent-ink) !important;
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

/* Expanded sidebar group activator — accent-tinted hover */
:deep(.sidebar-expanded-group > .v-list-group__header:hover) {
  background: color-mix(in oklch, var(--accent) 8%, transparent) !important;
}

:deep(.sidebar-expanded-group > .v-list-group__header:hover .v-list-item__prepend > .v-icon) {
  color: var(--accent-ink) !important;
}

:deep(.sidebar-expanded-group > .v-list-group__header:hover .v-list-item-title) {
  color: var(--accent-ink) !important;
}

:deep(.sidebar-expanded-group > .v-list-group__header:hover > .v-list-item__overlay) {
  opacity: 0 !important;
}

/* Level-2 flat child items — override Vuetify's logical indent (was 64px → now 28px) */
:deep(.sidebar-child-item) {
  --indent-padding: 20px;
  min-height: 32px !important;
  border-radius: 8px !important;
}

:deep(.sidebar-child-item .v-list-item-title) {
  font-size: 13.5px;
  font-weight: 500;
}

.sidebar-subgroup-item {
  color: var(--muted);
}

/* Level-2 subgroup headers — reduce Vuetify's stacked indent via CSS variable */
:deep(.sidebar-subgroup-item) {
  --indent-padding: 20px;
}

/* Level-3 grandchild items — override --indent-padding so calc(16px + var(--indent-padding)) gives ~44px */
:deep(.sidebar-grandchild-item) {
  --indent-padding: 28px;
  min-height: 32px !important;
  border-radius: 8px !important;
}

:deep(.sidebar-grandchild-item .v-list-item-title) {
  font-size: 13px;
  color: rgb(var(--v-theme-on-surface-variant));
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

:deep(.sidebar-grandchild-item.v-list-item--active) {
  background: rgb(var(--v-theme-primary-container)) !important;
}

:deep(.sidebar-grandchild-item.v-list-item--active .v-list-item-title) {
  color: rgb(var(--v-theme-on-primary-container)) !important;
  font-weight: 600;
}

/* Rail flyout — single card */
.rail-flyout-card {
  background: var(--surface-1);
  border: 1px solid var(--hairline);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.10), 0 1px 4px rgba(0, 0, 0, 0.06);
  padding: 8px;
  min-width: 220px;
}

.rail-flyout-card__header {
  padding: 8px 12px 6px;
  font-size: 11px;
  font-weight: 600;
  line-height: 1;
  color: rgb(var(--v-theme-on-surface-variant));
  text-transform: uppercase;
  letter-spacing: 1px;
}

.rail-flyout-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 9px 12px;
  border-radius: 8px;
  font-size: 13.5px;
  font-weight: 500;
  color: rgb(var(--v-theme-on-surface));
  cursor: pointer;
  transition: background 100ms ease;
  user-select: none;
}

.rail-flyout-item:hover {
  background: rgb(var(--v-theme-surface-variant));
}

.rail-flyout-item--active {
  background: rgb(var(--v-theme-primary-container));
  color: rgb(var(--v-theme-on-primary-container));
  font-weight: 600;
}

.rail-flyout-item svg {
  flex-shrink: 0;
  opacity: 0.45;
}

/* Rail cascade — two cards side by side */
.rail-cascade-wrap {
  display: flex;
  gap: 8px;
  align-items: flex-start;
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
