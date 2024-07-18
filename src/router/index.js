import {createMemoryHistory, createRouter} from 'vue-router'
import Dashboard from "@/views/Dashboard.vue";

const routes = [
    {
        path: '/',
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
    history: createMemoryHistory(),
    routes,
})
export default router