import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

export type SubscriptionKey =
  | 'commerce'
  | 'marketing'
  | 'analytics'
  | 'service'
  | 'davinci'

export interface Account {
  id: string
  name: string
  initials: string
  color: 'primary' | 'secondary' | 'success'
  subscriptions: SubscriptionKey[]
}

const STORAGE_KEY = 'mp.activeAccountId'

const DEFAULT_ACCOUNTS: Account[] = [
  {
    id: '2000290',
    name: 'MMC-MSC-MCC Scooter Village',
    initials: 'MP',
    color: 'primary',
    subscriptions: ['commerce', 'marketing', 'analytics', 'service', 'davinci'],
  },
  {
    id: '2000291',
    name: 'Maropost Demo Store',
    initials: 'MD',
    color: 'secondary',
    subscriptions: ['commerce', 'marketing', 'analytics', 'service', 'davinci'],
  },
  {
    id: '2000292',
    name: 'Growth Starter',
    initials: 'GS',
    color: 'success',
    subscriptions: ['marketing', 'analytics'],
  },
]

function readStoredId(fallback: string): string {
  if (typeof window === 'undefined') return fallback
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) return fallback
    return DEFAULT_ACCOUNTS.some(a => a.id === stored) ? stored : fallback
  } catch {
    return fallback
  }
}

export const useAccountsStore = defineStore('accounts', () => {
  const accounts = ref<Account[]>(DEFAULT_ACCOUNTS)
  const activeId = ref<string>(readStoredId(DEFAULT_ACCOUNTS[0]!.id))

  const activeAccount = computed(
    () => accounts.value.find(a => a.id === activeId.value) ?? accounts.value[0] ?? DEFAULT_ACCOUNTS[0]!,
  )

  function hasSubscription(key: SubscriptionKey): boolean {
    return activeAccount.value?.subscriptions.includes(key) ?? false
  }

  function switchTo(id: string) {
    if (!accounts.value.some(a => a.id === id)) return
    activeId.value = id
  }

  watch(activeId, (next) => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // ignore storage quota / disabled errors
    }
  })

  return { accounts, activeId, activeAccount, hasSubscription, switchTo }
})
