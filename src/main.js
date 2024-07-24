import {createApp} from 'vue'
import './assets/style/main.scss'
import '@/assets/style/colors.scss'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import router from "@/router/index.js";
import 'primeicons/primeicons.css'
import Ripple from 'primevue/ripple';
import inputs from '@/components/ui/Inputs.vue'
import Button from "primevue/button";
import selects from "@/components/ui/Selects.vue"

const app = createApp(App)

app.use(PrimeVue, {
        theme: {
            preset: Aura
        }
    },
    {ripple: true});
app.use(router)
app.component('fin-input', inputs)
app.component('fin-button',Button)
app.component('fin-select', selects)
app.directive('ripple', Ripple);
app.mount('#app')
