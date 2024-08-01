import { createRouter, createWebHashHistory} from 'vue-router'
import Dashboard from "@/views/Dashboard.vue";

const routes = [
    {
        path: '/',
        name:'Auth',
        component: () => import('@/views/Auth.vue'),
    },
    {
        path: '/dashboard',
        name:'Dashboard',
        component: Dashboard,
        children:[
            {
                path: '/purchase',
                name: 'purchase',
                component: () => import('@/views/Purchase.vue'),
            }
        ]
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})
export default router