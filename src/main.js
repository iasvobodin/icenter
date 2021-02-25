import { createApp } from "vue";
import App from "./App.vue";
import PrimeVue from 'primevue/config';
// import ElementPlus from 'element-plus';
// import 'element-plus/lib/theme-chalk/index.css';
import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import router from "./router";
import store from "./store";

// import InputText from 'primevue/inputtext';



const app = createApp(App)
  app.use(store)
  app.use(router)
  // app.use(ElementPlus)
  app.use(PrimeVue)
  
  // app.component('InputText', InputText);
  app.mount("#app");