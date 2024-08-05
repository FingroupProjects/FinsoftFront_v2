import {createApp} from 'vue'
import './assets/style/main.scss'
import '@/assets/style/colors.scss'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import router from "@/router/index.js";
import 'primeicons/primeicons.css'
import Ripple from 'primevue/ripple';
import Inputs from '@/components/ui/Inputs.vue'
import Button from "primevue/button";
import Selects from "@/components/ui/Selects.vue"
import ToastService from 'primevue/toastservice';
import { createPinia } from 'pinia'
const pinia = createPinia()
const app = createApp(App);

app.use(PrimeVue, {
        theme: {
            preset: Aura
        },
    ripple: true
});

app.use(router)
app.use(pinia)
app.component('fin-input', Inputs);
app.component('fin-button',Button);
app.use(ToastService);
app.component('fin-select', Selects);
app.directive('ripple', Ripple);
app.mount('#app');
