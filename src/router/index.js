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
                path: '/clientSale',
                name: 'clientSale',
                component: () => import('@/views/ClientSale.vue'),
            },
            {
                path: '/clientReturn',
                name: 'clientReturn',
                component: () => import('@/views/ClientReturn.vue'),
            },
            {
                path: '/clientOrder',
                name: 'clientOrder',
                component: () => import('@/views/ClientOrder.vue'),
            },
            {
                path: '/writeOff',
                name: 'writeOff',
                component: () => import('@/views/WriteOff.vue'),
            },
            {
                path: '/posting',
                name: 'posting',
                component: () => import('@/views/Posting.vue'),
            },
            {
                path: '/counterparty',
                name: 'counterparty',
                component: () => import('@/views/Counterparty.vue'),
            },
            {
                path: '/organizationBill',
                name: 'organizationBill',
                component: () => import('@/views/OrganizationBill.vue'),
            },
            {
                path: '/cashRegister',
                name: 'cashRegister',
                component: () => import('@/views/CashRegister.vue'),
            },
            {
                path: '/priceType',
                name: 'cashRegister',
                component: () => import('@/views/PriceType.vue'),
            },
            {
                path: '/currency',
                name: 'currency',
                component: () => import('@/views/Currency.vue'),
            },
            {
                path: '/warehouses',
                name: 'warehouses',
                component: () => import('@/views/Goods.vue'),
            },
            {
                path: '/inventarization',
                name: 'inventarization',
                component: () => import('@/views/Inventarization.vue'),
            },
            {
                path: '/movement',
                name: 'movement',
                component: () => import('@/views/Movement.vue'),
            },
            {
                path: '/finance',
                name: 'finance',
                component: () => import('@/views/Finance.vue'),
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