import { createRouter, createWebHistory} from 'vue-router'
import Dashboard from "@/views/Dashboard.vue";
import DocumentPrint from "@/components/DocumentPrint.vue";
import { useCookies } from 'vue3-cookies';

const routes = [
    {
        path: '/',
        name:'Auth',
        meta: {
            layout: 'auth',
            requiresAuth: false
        },
        component: () => import('@/views/Auth.vue'),
    },
    {
        path: '/dashboard',
        name:'Dashboard',
        component: Dashboard,
        meta: {
            requiresAuth: true,
            layout: 'main'
        },
        children:[
            {
                path: '/purchase',
                name: 'purchase',
                component: () => import('@/views/Purchase.vue'),
            },
            {
                path: '/providerOrder',
                name: 'providerOrder',
                component: () => import('@/views/ProviderOrder.vue'),
            },
            {
                path: '/providerReturn',
                name: 'providerReturn',
                component: () => import('@/views/ProviderReturn.vue'),
            },
            {
                path: '/warehouses',
                name: 'warehouses',
                component: () => import('@/views/Goods.vue'),
            },
        ]
    },
    {
        path: '/documents/:productId', // Updated to include a route parameter
        name: 'DocumentPrint',
        component: DocumentPrint,
        meta: {
            requiresAuth: true,
            layout: 'main'
        },
        props: true // Allows passing route params as props to the component
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})
router.beforeEach((to, from, next) => {

    const { cookies } = useCookies()
    const isAuthenticated = cookies.isKey('token')

    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/')
        // next()
    } else {
        next()
    }

})

export default router