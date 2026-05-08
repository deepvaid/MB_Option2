import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCopilotStore = defineStore('copilot', () => {
  const isOpen = ref(false)
  const isExpanded = ref(false)

  function open() {
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
  }

  function toggle() {
    isOpen.value = !isOpen.value
  }

  function toggleExpanded() {
    isExpanded.value = !isExpanded.value
  }

  return {
    isOpen,
    isExpanded,
    open,
    close,
    toggle,
    toggleExpanded,
  }
})
