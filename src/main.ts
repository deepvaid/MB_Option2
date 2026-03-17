import { createApp } from 'vue'
import App from './App.vue'
import { registerPlugins } from './plugins'
import './design-tokens/generated/variables.css'
import './styles/mp-theme-aliases.css'
import './styles/global.scss'

const app = createApp(App)

registerPlugins(app)

app.mount('#app')
