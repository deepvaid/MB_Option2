// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

import { maropostDark, maropostDefaults, maropostLight } from './maropostTheme'

// ─── Vuetify Instance ─────────────────────────────────────────────────────────
export default createVuetify({
  theme: {
    defaultTheme: 'maropostLight',
    themes: { maropostLight, maropostDark },
  },
  defaults: maropostDefaults,
})
