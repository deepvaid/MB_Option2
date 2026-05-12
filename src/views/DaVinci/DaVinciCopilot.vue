<script setup lang="ts">
import { ref } from 'vue'
import MpDaVinciBot from '@/components/MpDaVinciBot.vue'
import DvHistoryDrawer from '@/components/copilot/DvHistoryDrawer.vue'

const STORAGE_KEY = 'davinci-active-conversation-v1'
const STALE_MS = 60_000

interface Snapshot {
  conversationId: string
  messages: unknown[]
  accountId: string
  dashboardId: string | null
  snapshotAt: number
}

function readSnapshot(): { messages: unknown[]; conversationId: string | null; title: string } {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return { messages: [], conversationId: null, title: 'New conversation' }
    const snap: Snapshot = JSON.parse(raw)
    window.localStorage.removeItem(STORAGE_KEY)
    if (Date.now() - snap.snapshotAt > STALE_MS) {
      return { messages: [], conversationId: null, title: 'New conversation' }
    }
    const msgs = Array.isArray(snap.messages) ? snap.messages : []
    const firstUser = (msgs as any[]).find((m) => m?.role === 'user' || m?.from === 'user')
    let title = 'New conversation'
    const txt = firstUser?.text ?? firstUser?.content
    if (typeof txt === 'string' && txt.length > 0) {
      title = txt.length > 60 ? txt.slice(0, 57) + '…' : txt
    }
    return { messages: msgs, conversationId: snap.conversationId, title }
  } catch {
    return { messages: [], conversationId: null, title: 'New conversation' }
  }
}

const hydrated = readSnapshot()
const initialMessages = ref<unknown[]>(hydrated.messages)
const conversationTitle = ref(hydrated.title)
const hydratedConversationId = ref<string | null>(hydrated.conversationId)

import { useRouter } from 'vue-router'
const router = useRouter()

function handleBack() {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push({ name: 'DashboardView', params: { accountId: '2000290' } })
  }
}
</script>

<template>
  <div class="davinci-copilot">
    <!-- Slim breadcrumb header -->
    <header class="davinci-copilot__topbar">
      <button class="davinci-copilot__crumbs" type="button" @click="handleBack">
        <v-icon size="14" class="davinci-copilot__crumb-back">arrow-left</v-icon>
        <span class="davinci-copilot__crumb-root">Active Dashboard</span>
        <v-icon size="14" class="davinci-copilot__crumb-sep">chevron-right</v-icon>
        <span class="davinci-copilot__crumb-current">{{ conversationTitle }}</span>
      </button>
    </header>

    <!-- Two-column body -->
    <div class="davinci-copilot__body">
      <aside class="davinci-copilot__rail">
        <DvHistoryDrawer
          :open="true"
          mode="rail"
          :active-id="hydratedConversationId ?? undefined"
        />
      </aside>

      <main class="davinci-copilot__main">
        <MpDaVinciBot
          :headerless="true"
          :initial-messages="(initialMessages as any)"
        />
      </main>
    </div>
  </div>
</template>

<style scoped>
.davinci-copilot {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: calc(100vh - var(--v-layout-top, 64px));
  background: rgb(var(--v-theme-background));
}

.davinci-copilot__topbar {
  display: flex;
  align-items: center;
  gap: 16px;
  height: 48px;
  padding: 0 20px;
  background: rgb(var(--v-theme-surface));
  border-bottom: 1px solid rgb(var(--v-theme-outline-variant));
  flex: 0 0 auto;
}

.davinci-copilot__crumbs {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 500;
  color: rgba(var(--v-theme-on-surface), 0.7);
  min-width: 0;
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
}

.davinci-copilot__crumbs:hover .davinci-copilot__crumb-root,
.davinci-copilot__crumbs:hover .davinci-copilot__crumb-back {
  color: rgb(var(--v-theme-primary));
}

.davinci-copilot__crumb-back {
  color: rgba(var(--v-theme-on-surface), 0.6);
}

.davinci-copilot__crumb-current {
  color: rgb(var(--v-theme-on-surface));
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.davinci-copilot__crumb-sep {
  color: rgba(var(--v-theme-on-surface), 0.4);
}

.davinci-copilot__body {
  display: flex;
  flex: 1 1 auto;
  min-height: 0;
}

.davinci-copilot__rail {
  width: 260px;
  flex: 0 0 260px;
  background: rgb(var(--v-theme-surface-variant));
  border-right: 1px solid rgb(var(--v-theme-outline-variant));
  overflow-y: auto;
}

.davinci-copilot__main {
  flex: 1 1 auto;
  min-width: 0;
  background: rgb(var(--v-theme-background));
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
</style>
