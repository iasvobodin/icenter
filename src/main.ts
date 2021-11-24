import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import { store } from './store'
import VueClickAway from 'vue3-click-away'

const app = createApp(App)
app.use(store)
app.use(router)
app.use(VueClickAway)
app.mount('#app')
