import {createApp} from 'vue'
import './assets/style/main.scss'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import router from "@/router/index.js";
import 'primeicons/primeicons.css'
import Ripple from 'primevue/ripple';
import inputs from '@/components/ui/Inputs.vue'
import Button from "primevue/button";

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
app.directive('ripple', Ripple);
app.mount('#app')
