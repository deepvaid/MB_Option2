import { computed, ref, type ComputedRef, type Ref } from 'vue'

export function formatAgo(input: number | string | undefined | null): string {
  if (!input) return ''
  const ts = typeof input === 'string' ? Date.parse(input) : input
  if (Number.isNaN(ts)) return ''
  const diff = Date.now() - ts
  if (diff < 60_000) return 'just now'
  const minutes = Math.round(diff / 60_000)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.round(diff / 3_600_000)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(diff / 86_400_000)
  return `${days}d ago`
}

const tick = ref(0)
let interval: ReturnType<typeof setInterval> | null = null
function ensureTick() {
  if (interval || typeof window === 'undefined') return
  interval = setInterval(() => {
    tick.value++
  }, 60_000)
}

export function useLiveAgo(
  input: Ref<number | string | undefined | null>,
): ComputedRef<string> {
  ensureTick()
  return computed(() => {
    void tick.value
    return formatAgo(input.value)
  })
}
