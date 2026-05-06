<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { useRoute } from 'vue-router'

// Import rich components
import DvChartCard from './copilot/DvChartCard.vue'
import DvKpiRow from './copilot/DvKpiRow.vue'
import DvDataTable from './copilot/DvDataTable.vue'
import DvCampaignCard from './copilot/DvCampaignCard.vue'
import DvJourneyCard from './copilot/DvJourneyCard.vue'
import DvContentCard from './copilot/DvContentCard.vue'
import DvSegmentCard from './copilot/DvSegmentCard.vue'
import DvActionCard from './copilot/DvActionCard.vue'
import DvInsightCard from './copilot/DvInsightCard.vue'
import DvWidgetDraftCard from './copilot/DvWidgetDraftCard.vue'
import { useAccountsStore } from '@/stores/useAccounts'
import { useDashboardsStore } from '@/stores/useDashboards'
import type { DashboardWidgetDraft } from '@/stores/dashboards/types'

const emit = defineEmits<{
  close: []
  expand: []
}>()

const route = useRoute()
const accountsStore = useAccountsStore()
const dashboardsStore = useDashboardsStore()
const isExpanded = ref(false)

function onExpand() {
  isExpanded.value = !isExpanded.value
  emit('expand')
}

/* ── State ─────────────────────────────────────────────────────── */
const inputText = ref('')
const chatMode = ref(false)
const isTyping = ref(false)

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  text?: string
  time?: string
  componentData?: {
    type: 'chart' | 'kpi' | 'table' | 'campaign' | 'journey' | 'content' | 'segment' | 'action' | 'insight' | 'widgetDraft'
    props: any
  }[]
}

const messages = ref<ChatMessage[]>([])
const chatContainer = ref<HTMLElement | null>(null)

const routeAccountId = computed(() => {
  const accountId = Array.isArray(route.params.accountId)
    ? route.params.accountId[0]
    : route.params.accountId

  return accountId
})

const routeDashboardId = computed(() => {
  const dashboardId = Array.isArray(route.params.dashboardId)
    ? route.params.dashboardId[0]
    : route.params.dashboardId

  return dashboardId
})

const isDashboardRoute = computed(() => route.name === 'Dashboard' || route.name === 'DashboardDetail')
const activeAccount = computed(() => {
  if (!routeAccountId.value) return accountsStore.activeAccount
  return accountsStore.accounts.find((account) => account.id === routeAccountId.value) ?? accountsStore.activeAccount
})
const activeDashboard = computed(() => {
  if (!isDashboardRoute.value || !routeAccountId.value) return null
  return dashboardsStore.getDashboardById(routeAccountId.value, routeDashboardId.value) ?? null
})

const emptyStateGreeting = computed(() => (
  isDashboardRoute.value && activeDashboard.value
    ? `Shape ${activeDashboard.value.name} with Da Vinci`
    : 'Hi, Admin'
))

const emptyStateDescription = computed(() => (
  isDashboardRoute.value && activeDashboard.value
    ? 'Ask for a KPI, trend, comparison, or table widget and I will draft it for the active dashboard.'
    : 'Ask me anything about your store, or try a suggestion below.'
))

const heroInsight = computed(() => (
  isDashboardRoute.value && activeDashboard.value
    ? {
        headline: 'Turn prompts into widgets',
        description: `Da Vinci can draft widgets for ${activeDashboard.value.name} using the workspace data sources already available on this account.`,
        severity: 'info' as const,
        actionLabel: 'Try a dashboard prompt',
      }
    : {
        headline: 'Revenue dropped 15% this week',
        description: 'Your abandoned cart rate increased to 72%. I suggest enabling the Abandoned Cart Recovery journey.',
        severity: 'warning' as const,
        actionLabel: 'View Report',
      }
))

const dashboardSuggestions = computed(() => {
  const suggestions = ['Show open rate trend for last 30 days']

  if (activeAccount.value.subscriptions.includes('commerce')) {
    suggestions.push('Create a revenue by channel widget', 'Add a recent orders table')
  } else {
    suggestions.push('Add a top campaigns table', 'Show contact growth trend')
  }

  if (activeAccount.value.subscriptions.includes('service')) {
    suggestions.push('Show ticket volume over time')
  }

  return suggestions.slice(0, 4)
})

/* ── Pre-configured Use Cases (Simulated AI) ──────────────────── */
const useCaseSimulations: Record<string, ChatMessage['componentData']> = {
  'Top 10 products by revenue': [
    { type: 'kpi', props: { kpis: [{ label: 'Total Revenue (Top 10)', value: '$842K', trend: '12%', trendUp: true }] } },
    { type: 'chart', props: { title: 'Revenue Share (Top 10)', subtitle: 'Last 30 Days', bars: [[400],[350],[300],[250],[200],[150],[100],[80],[60],[40]], labels: ['Prod A','Prod B','Prod C','Prod D','Prod E','Prod F','Prod G','Prod H','Prod I','Prod J'] } },
    { type: 'table', props: { headers: ['Product', 'Revenue', 'Orders'], rows: [['Prod A', '$120K', '842'], ['Prod B', '$95K', '412']] } }
  ],
  'Create a flash sale campaign': [
    { type: 'campaign', props: { name: 'Spring Flash Sale', subject: '⚡ 40% Off Everything - Today Only!', audience: 'VIP Customers', audienceSize: 12500, sendTime: 'Send Now', channel: 'Email' } }
  ],
  'Set up abandoned cart recovery': [
    { type: 'journey', props: { name: 'Abandoned Cart (High Value)', steps: [{type:'trigger', label:'Cart Abandoned'}, {type:'condition', label:'Value > $100'}, {type:'wait', label:'1 Hour'}, {type:'email', label:'Reminder 1'}] } }
  ],
  'Write an email for our spring sale': [
    { type: 'content', props: { type: 'email', title: 'Spring Sale Announcement', content: "Hi {{first_name}},\n\nSpring is finally here, and so is our biggest sale of the year!\n\nGet up to 30% off our new collection." } }
  ],
  'Find high-value customers who haven\'t ordered in 90 days': [
    { type: 'segment', props: { name: 'Lapsed High Value', rules: ['Lifetime Value > $500', 'Last Order Date > 90 days ago'], estimatedSize: 4200 } }
  ],
  'Compare this month vs last month': [
    { type: 'chart', props: { title: 'Revenue Comparison', subtitle: 'This Month vs Last Month', seriesNames: ['This Month', 'Last Month'], bars: [[500, 450],[520, 480],[480, 500],[600, 550]], labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'] } }
  ]
}

/* ── Actions ───────────────────────────────────────────────────── */
function scrollToBottom() {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTo({ top: chatContainer.value.scrollHeight, behavior: 'smooth' })
    }
  })
}

function processQuery(text: string) {
  if (!text) return

  const now = new Date()
  const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`

  messages.value.push({ id: Date.now().toString(), role: 'user', text, time })
  chatMode.value = true
  inputText.value = ''
  isTyping.value = true
  scrollToBottom()

  // Find simulated response or fallback
  let responseData = useCaseSimulations[text]
  let responseText = ''

  if (!responseData && routeAccountId.value && activeDashboard.value) {
    const widgetDraft: DashboardWidgetDraft | null = dashboardsStore.buildAiWidgetDraft(
      routeAccountId.value,
      activeDashboard.value.id,
      text,
    )

    if (widgetDraft) {
      responseText = `I drafted a ${widgetDraft.type} widget for ${activeDashboard.value.name}. You can add it directly or refine it first.`
      responseData = [
        {
          type: 'widgetDraft',
          props: {
            accountId: routeAccountId.value,
            dashboardId: activeDashboard.value.id,
            draft: widgetDraft,
            filters: activeDashboard.value.filters,
          },
        },
      ]
    }
  }

  if (!responseData) {
    // Check for partial matches
    const match = Object.keys(useCaseSimulations).find(k => k.toLowerCase().includes(text.toLowerCase()) || text.toLowerCase().includes(k.toLowerCase()))
    if (match) {
      responseData = useCaseSimulations[match]
    } else {
      responseText = isDashboardRoute.value
        ? "I couldn't map that to a supported widget yet. Try asking for revenue, orders, open rate, campaigns, contact growth, or ticket volume."
        : "I've analyzed your request. Here is what I found based on your store's recent activity."
      responseData = isDashboardRoute.value
        ? [
            {
              type: 'insight',
              props: {
                headline: 'Try a widget-ready prompt',
                description: 'Use prompts like “Create a revenue by channel widget”, “Show open rate trend for last 30 days”, or “Add a recent orders table”.',
                severity: 'info',
              },
            },
          ]
        : [
            {
              type: 'insight',
              props: {
                headline: 'Custom Query Processed',
                description: 'This is a simulated response. Try asking about "Top 10 products" or "Create a flash sale".',
                severity: 'info',
              },
            },
          ]
    }
  }

  // Simulate AI delay
  setTimeout(() => {
    isTyping.value = false
    messages.value.push({
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      text: responseText || 'Here are the results you requested:',
      componentData: responseData
    })
    scrollToBottom()
  }, 1200)
}

function sendQuery() {
  processQuery(inputText.value.trim())
}

function sendSuggestion(text: string) {
  processQuery(text)
}

function onSuggestionKeydown(event: KeyboardEvent, text: string) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    sendSuggestion(text)
  }
}

function newChat() {
  chatMode.value = false
  messages.value = []
  inputText.value = ''
}
</script>

<template>
  <div class="davinci-panel">
    <!-- ═══ HEADER ═══ -->
    <div class="davinci-header">
      <div class="davinci-header__top">
        <div class="davinci-avatar">
          <v-icon color="white" size="20">sparkles</v-icon>
        </div>
        <div style="flex: 1" />
        <v-btn icon size="28" variant="text" aria-label="Start a new chat" @click="newChat">
          <v-icon size="16">plus</v-icon>
          <v-tooltip activator="parent" location="bottom">New chat</v-tooltip>
        </v-btn>
        <v-btn icon size="28" variant="text" :aria-label="isExpanded ? 'Collapse Da Vinci drawer' : 'Expand Da Vinci drawer'" @click="onExpand">
          <v-icon size="16">{{ isExpanded ? 'minimize-2' : 'maximize-2' }}</v-icon>
          <v-tooltip activator="parent" location="bottom">{{ isExpanded ? 'Collapse' : 'Expand' }}</v-tooltip>
        </v-btn>
        <v-btn icon size="28" variant="text" aria-label="Close Da Vinci drawer" @click="emit('close')">
          <v-icon size="16">x</v-icon>
          <v-tooltip activator="parent" location="bottom">Close</v-tooltip>
        </v-btn>
      </div>

      <template v-if="!chatMode">
        <div class="davinci-hero">{{ emptyStateGreeting }}</div>
        <div class="davinci-subhero">{{ emptyStateDescription }}</div>
        <div class="davinci-callout">
          <strong>{{ heroInsight.headline }}</strong> — {{ heroInsight.description }}
        </div>
      </template>
      <template v-else>
        <div class="davinci-hero" style="font-size: 18px;">Da Vinci Bot</div>
      </template>
    </div>

    <!-- ═══ BODY ═══ -->
    <div ref="chatContainer" class="davinci-body">
      <!-- ─── EMPTY STATE (suggestions) ─── -->
      <template v-if="!chatMode">
        <div v-if="isDashboardRoute" class="davinci-suggestions">
          <button
            v-for="suggestion in dashboardSuggestions"
            :key="suggestion"
            class="davinci-pill"
            :aria-label="`Run suggestion: ${suggestion}`"
            @click="sendSuggestion(suggestion)"
            @keydown="onSuggestionKeydown($event, suggestion)"
          >
            {{ suggestion }}
          </button>
        </div>

        <div class="davinci-suggestions">
          <button
            class="davinci-pill"
            aria-label="Run suggestion: Top 10 products by revenue"
            @click="sendSuggestion('Top 10 products by revenue')"
            @keydown="onSuggestionKeydown($event, 'Top 10 products by revenue')"
          >
            Top 10 products by revenue
          </button>
          <button
            class="davinci-pill"
            aria-label="Run suggestion: Compare this month vs last month"
            @click="sendSuggestion('Compare this month vs last month')"
            @keydown="onSuggestionKeydown($event, 'Compare this month vs last month')"
          >
            Compare this month vs last month
          </button>
          <button
            class="davinci-pill"
            aria-label="Run suggestion: Create a flash sale campaign"
            @click="sendSuggestion('Create a flash sale campaign')"
            @keydown="onSuggestionKeydown($event, 'Create a flash sale campaign')"
          >
            Create a flash sale campaign
          </button>
          <button
            class="davinci-pill"
            aria-label="Run suggestion: Write an email for our spring sale"
            @click="sendSuggestion('Write an email for our spring sale')"
            @keydown="onSuggestionKeydown($event, 'Write an email for our spring sale')"
          >
            Write an email for our spring sale
          </button>
          <button
            class="davinci-pill"
            aria-label="Run suggestion: Set up abandoned cart recovery"
            @click="sendSuggestion('Set up abandoned cart recovery')"
            @keydown="onSuggestionKeydown($event, 'Set up abandoned cart recovery')"
          >
            Set up abandoned cart recovery
          </button>
          <button
            class="davinci-pill"
            aria-label="Run suggestion: Find high-value customers who have not ordered in 90 days"
            @click="sendSuggestion('Find high-value customers who haven\'t ordered in 90 days')"
            @keydown="onSuggestionKeydown($event, 'Find high-value customers who haven\'t ordered in 90 days')"
          >
            Find lapsed high-value customers
          </button>
        </div>
      </template>

      <!-- ─── CHAT STATE ─── -->
      <div v-else class="davinci-messages">
        <template v-for="msg in messages" :key="msg.id">
          <div v-if="msg.role === 'user'" class="davinci-msg--user">
            {{ msg.text }}
          </div>

          <div v-else class="davinci-msg--bot-wrapper">
            <div class="davinci-msg--bot">{{ msg.text }}</div>

            <div v-if="msg.componentData" class="davinci-widgets">
              <template v-for="(comp, ci) in msg.componentData" :key="ci">
                <DvChartCard v-if="comp.type === 'chart'" v-bind="comp.props" />
                <DvKpiRow v-else-if="comp.type === 'kpi'" v-bind="comp.props" />
                <DvDataTable v-else-if="comp.type === 'table'" v-bind="comp.props" />
                <DvCampaignCard v-else-if="comp.type === 'campaign'" v-bind="comp.props" />
                <DvJourneyCard v-else-if="comp.type === 'journey'" v-bind="comp.props" />
                <DvContentCard v-else-if="comp.type === 'content'" v-bind="comp.props" />
                <DvSegmentCard v-else-if="comp.type === 'segment'" v-bind="comp.props" />
                <DvActionCard v-else-if="comp.type === 'action'" v-bind="comp.props" />
                <DvInsightCard v-else-if="comp.type === 'insight'" v-bind="comp.props" />
                <DvWidgetDraftCard v-else-if="comp.type === 'widgetDraft'" v-bind="comp.props" />
              </template>
            </div>
          </div>
        </template>

        <!-- Typing Indicator -->
        <div v-if="isTyping" class="davinci-msg--bot">
          <span class="typing-indicator">
            <span class="dot"></span><span class="dot"></span><span class="dot"></span>
          </span>
        </div>
      </div>
    </div>

    <!-- ═══ COMPOSER ═══ -->
    <div class="davinci-composer">
      <input
        v-model="inputText"
        class="davinci-composer__input"
        placeholder="Ask Da Vinci..."
        aria-label="Ask Da Vinci"
        @keydown.enter.exact.prevent="sendQuery"
      />
      <button
        class="davinci-composer__send"
        :aria-label="inputText.trim() ? 'Send message' : 'Type a message to enable send'"
        @click="sendQuery"
      >
        <v-icon size="16">arrow-up</v-icon>
      </button>
    </div>
  </div>
</template>

<style scoped>
.davinci-panel {
  position: fixed;
  right: 24px;
  bottom: 24px;
  width: 440px;
  max-height: calc(100vh - 120px);
  display: flex;
  flex-direction: column;
  border: 1px solid rgb(var(--v-theme-outline-variant));
  border-radius: 16px;
  background: rgb(var(--v-theme-surface));
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  z-index: 2000;
}

.davinci-header {
  background: linear-gradient(120deg, #eef0ff 0%, #f3eafc 60%, #fde8ef 100%);
  padding: 20px 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.davinci-header__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.davinci-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #5b8def 0%, #2dd4bf 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.davinci-hero {
  font-size: 26px;
  font-weight: 700;
  line-height: 1.15;
  color: rgb(var(--v-theme-on-surface));
}

.davinci-subhero {
  font-size: 14px;
  color: rgb(var(--v-theme-on-surface-variant));
  margin-top: -8px;
}

.davinci-callout {
  background: rgb(var(--v-theme-primary-container));
  color: rgb(var(--v-theme-on-primary-container));
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 13px;
  line-height: 1.5;
}

.davinci-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.davinci-suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.davinci-pill {
  border: 1px solid rgb(var(--v-theme-outline-variant));
  border-radius: 999px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  background: rgb(var(--v-theme-surface-bright, var(--v-theme-surface)));
  color: rgb(var(--v-theme-on-surface));
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}

.davinci-pill:hover {
  background: rgb(var(--v-theme-surface-variant));
  border-color: rgb(var(--v-theme-outline));
}

.davinci-pill:focus-visible {
  outline: 2px solid rgb(var(--v-theme-primary));
  outline-offset: 2px;
}

.davinci-composer {
  border-top: 1px solid rgb(var(--v-theme-outline-variant));
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgb(var(--v-theme-surface));
}

.davinci-composer__input {
  flex: 1;
  border: 1px solid rgb(var(--v-theme-outline-variant));
  border-radius: 999px;
  padding: 8px 16px;
  font-size: 14px;
  background: rgb(var(--v-theme-surface));
  color: rgb(var(--v-theme-on-surface));
  outline: none;
}

.davinci-composer__input:focus {
  border-color: rgb(var(--v-theme-primary));
}

.davinci-composer__send {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(var(--v-theme-surface-variant));
  color: rgb(var(--v-theme-on-surface));
  border: none;
  cursor: pointer;
  transition: background 0.15s;
}

.davinci-composer__send:hover {
  background: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-on-primary));
}

.davinci-messages {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.davinci-msg--user {
  align-self: flex-end;
  background: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-on-primary));
  border-radius: 16px 16px 4px 16px;
  padding: 10px 16px;
  font-size: 14px;
  max-width: 85%;
  white-space: pre-wrap;
}

.davinci-msg--bot-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-self: flex-start;
  max-width: 100%;
}

.davinci-msg--bot {
  align-self: flex-start;
  background: rgb(var(--v-theme-surface-variant));
  color: rgb(var(--v-theme-on-surface));
  border-radius: 16px 16px 16px 4px;
  padding: 10px 16px;
  font-size: 14px;
  max-width: 85%;
}

.davinci-widgets {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-left: 8px;
}

/* Typing indicator */
.typing-indicator {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.typing-indicator .dot {
  width: 6px;
  height: 6px;
  background: rgba(var(--v-theme-on-surface), 0.4);
  border-radius: 50%;
  animation: typing 1.4s infinite ease-in-out both;
}

.typing-indicator .dot:nth-child(1) { animation-delay: -0.32s; }
.typing-indicator .dot:nth-child(2) { animation-delay: -0.16s; }

@keyframes typing {
  0%, 80%, 100% { transform: scale(0); opacity: 0.4; }
  40% { transform: scale(1); opacity: 1; }
}
</style>
