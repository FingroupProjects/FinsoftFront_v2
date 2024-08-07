import { createRouter, createWebHashHistory} from 'vue-router'
import Dashboard from "@/views/Dashboard.vue";
import DocumentPrint from "@/components/DocumentPrint.vue";

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
    {
        path: '/documents/:productId', // Updated to include a route parameter
        name: 'DocumentPrint',
        component: DocumentPrint,
        props: true // Allows passing route params as props to the component
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})
export default router