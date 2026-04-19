import { onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue'

export interface ElementSize {
  width: number
  height: number
}

export function useElementSize(target: Ref<HTMLElement | null | undefined>) {
  const size = ref<ElementSize>({ width: 0, height: 0 })

  let observer: ResizeObserver | null = null

  function attach(el: HTMLElement | null | undefined) {
    detach()
    if (!el || typeof ResizeObserver === 'undefined') return
    observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) return
      const rect = entry.contentRect
      size.value = { width: Math.round(rect.width), height: Math.round(rect.height) }
    })
    observer.observe(el)
    const rect = el.getBoundingClientRect()
    size.value = { width: Math.round(rect.width), height: Math.round(rect.height) }
  }

  function detach() {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  }

  onMounted(() => attach(target.value))
  watch(target, (next) => attach(next))
  onBeforeUnmount(() => detach())

  return { size }
}
