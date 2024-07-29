import { createRouter, createWebHashHistory} from 'vue-router'
import Dashboard from "@/views/Dashboard.vue";

const routes = [
    {
        path: '/',
        component: () => import('@/views/Auth.vue'),
    },
    {
        path: '/dashboard',
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