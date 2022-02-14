import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import { createPinia } from 'pinia'
import { store } from './store'
import VueClickAway from 'vue3-click-away'
// import { msalPlugin } from './plugins/msalPlugin'
// import { msalInstance } from './authConfig'
const app = createApp(App)
app.use(createPinia())
app.use(store)
app.use(router)
app.use(VueClickAway)
// app.use(msalPlugin, msalInstance)
app.mount('#app')
