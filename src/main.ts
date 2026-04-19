import { createApp } from 'vue'
import ApexCharts from 'apexcharts'
import VueApexCharts from 'vue3-apexcharts'
import App from './App.vue'
import { registerPlugins } from './plugins'
import './design-tokens/generated/variables.css'
import './styles/mp-theme-aliases.css'
import '../packages/marobase-ui/src/tokens/mb-foundation.tokens.css'
import './styles/global.scss'

const app = createApp(App)

registerPlugins(app)
app.use(VueApexCharts)
app.config.globalProperties.$apexcharts = ApexCharts

app.mount('#app')
