import { ref, watch } from 'vue'
import { useTheme } from 'vuetify'

export type AccentKey = 'cyan' | 'blue' | 'teal' | 'amber' | 'violet' | 'black'
export type ThemeMode = 'light' | 'dark' | 'auto'

const LS_ACCENT = 'app-accent'
const LS_MODE = 'app-theme-mode'

const accent = ref<AccentKey>((localStorage.getItem(LS_ACCENT) as AccentKey) || 'cyan')
const mode = ref<ThemeMode>((localStorage.getItem(LS_MODE) as ThemeMode) || 'light')

function applyAccent(key: AccentKey) {
  if (key === 'cyan') {
    delete document.documentElement.dataset.accent
  } else {
    document.documentElement.dataset.accent = key
  }
  localStorage.setItem(LS_ACCENT, key)
}

function applyMode(m: ThemeMode) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const isDark = m === 'dark' || (m === 'auto' && prefersDark)

  document.documentElement.dataset.theme = isDark ? 'dark' : 'light'
  localStorage.setItem(LS_MODE, m)
}

export function useAppTheme() {
  const vuetifyTheme = useTheme()

  function setAccent(key: AccentKey) {
    accent.value = key
    applyAccent(key)
  }

  function setMode(m: ThemeMode) {
    mode.value = m
    applyMode(m)
    vuetifyTheme.global.name.value = m === 'dark' || (m === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)
      ? 'maropostDark'
      : 'maropostLight'
  }

  return { accent, mode, setAccent, setMode }
}

/**
 * Call once from main.ts before app.mount() to apply stored preferences
 * before the first paint. Does NOT require Vuetify context.
 */
export function initAppTheme() {
  const storedAccent = (localStorage.getItem(LS_ACCENT) as AccentKey) || 'cyan'
  const storedMode = (localStorage.getItem(LS_MODE) as ThemeMode) || 'light'
  applyAccent(storedAccent)
  applyMode(storedMode)
}
