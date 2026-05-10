import { ref } from 'vue'

export interface DaVinciToastInput {
  title: string
  sub?: string
  action?: string
  onAction?: () => void
  durationMs?: number
}

export interface DaVinciToast extends Required<Pick<DaVinciToastInput, 'title' | 'durationMs'>> {
  id: string
  sub?: string
  action?: string
  onAction?: () => void
  leaving: boolean
}

const toasts = ref<DaVinciToast[]>([])
const timers = new Map<string, ReturnType<typeof setTimeout>>()
const DEFAULT_DURATION = 4200
const LEAVE_MS = 180

function makeId() {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
}

function dismissToast(id: string) {
  const idx = toasts.value.findIndex((t) => t.id === id)
  if (idx === -1) return
  const existing = toasts.value[idx]
  if (!existing) return
  // Mark leaving for exit animation, then remove after LEAVE_MS
  const next = [...toasts.value]
  next[idx] = { ...existing, leaving: true }
  toasts.value = next
  const timer = timers.get(id)
  if (timer) clearTimeout(timer)
  timers.delete(id)
  setTimeout(() => {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }, LEAVE_MS)
}

function pushToast(input: DaVinciToastInput): string {
  const id = makeId()
  const toast: DaVinciToast = {
    id,
    title: input.title,
    sub: input.sub,
    action: input.action,
    onAction: input.onAction,
    durationMs: input.durationMs ?? DEFAULT_DURATION,
    leaving: false,
  }
  toasts.value = [...toasts.value, toast]
  const timer = setTimeout(() => dismissToast(id), toast.durationMs)
  timers.set(id, timer)
  return id
}

function triggerAction(id: string) {
  const toast = toasts.value.find((t) => t.id === id)
  if (!toast) return
  toast.onAction?.()
  dismissToast(id)
}

export function useDaVinciToasts() {
  return {
    toasts,
    pushToast,
    dismissToast,
    triggerAction,
  }
}
