// Styles
import '@mdi/font/css/materialdesignicons.css' // fallback for any residual mdi-* strings
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

import { lucideIconSet } from './lucideIcons'
import { maropostDark, maropostDefaults, maropostLight } from './maropostTheme'

// ─── Vuetify Instance ─────────────────────────────────────────────────────────
export default createVuetify({
  icons: {
    defaultSet: 'lucide',
    sets: {
      lucide: lucideIconSet,
    },
  },
  theme: {
    defaultTheme: 'maropostLight',
    themes: { maropostLight, maropostDark },
  },
  defaults: maropostDefaults,
})
