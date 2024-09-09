import { createRouter, createWebHistory} from 'vue-router'
import Dashboard from "@/views/Dashboard.vue";
import DocumentPrint from "@/components/DocumentPrint.vue";
import ReturnPrint from "@/components/providerReturn/ReturnPrint.vue";
import OrderPrint from "@/components/providerOrder/OrderPrint.vue";
import FinancePrint from "@/components/finance/FinanceView/FinancePrint.vue"
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
                path: '/counterparty',
                name: 'counterparty',
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
                path: '/organization',
                name: 'organization',
                component: () => import('@/views/Organization.vue'),
            },
            {
                path: '/counterparty',
                name: 'counterparty',
                component: () => import('@/views/Counterparty.vue'),
            },
            {
                path: '/unit',
                name: 'unit',
                component: () => import('@/views/Unit.vue'),
            },
            {
                path: '/user',
                name: 'user',
                component: () => import('@/views/User.vue'),
            },
            {
                path: '/organizationBill',
                name: 'organizationBill',
                component: () => import('@/views/OrganizationBill.vue'),
            },
            {
                path: '/register',
                name: 'register',
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
                path: '/employee',
                name: 'employee',
                component: () => import('@/views/Employee.vue'),
            },
            {
                path: '/hiring',
                name: 'hiring',
                component: () => import('@/views/staff/Hiring.vue'),
            },
            {
                path: '/position',
                name: 'position',
                component: () => import('@/views/Position.vue'),
            },
            {
                path: '/staffMovement',
                name: 'staffMovement',
                component: () => import('@/views/staff/StaffMovement.vue'),
            },
            {
                path: '/firing',
                name: 'firing',
                component: () => import('@/views/staff/Firing.vue'),
            },
            {
                path: '/storage',
                name: 'storage',
                component: () => import('@/views/Storage.vue'),
            },
            {
                path: '/reportCard',
                name: 'reportCard',
                component: () => import('@/views/staff/ReportCard.vue'),
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
            {
                path: '/for-sale',
                name: 'for-sale',
                component: () => import('@/views/ForSale.vue'),
            },
            {
                path: '/schedule',
                name: 'schedule',
                component: () => import('@/views/WorkSchedule.vue')
            }
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
    },
    {
        path: '/return/:productId', // Updated to include a route parameter
        name: 'ReturnPrint',
        component: ReturnPrint,
        meta: {
            requiresAuth: true,
            layout: 'main'
        },
        props: true // Allows passing route params as props to the component
    },
    {
        path: '/order/:productId', // Updated to include a route parameter
        name: 'OrderPrint',
        component: OrderPrint,
        meta: {
            requiresAuth: true,
            layout: 'main'
        },
        props: true // Allows passing route params as props to the component
    },
    {
        path: '/finance/:productId', // Updated to include a route parameter
        name: 'FinancePrint',
        component: FinancePrint,
        meta: {
            requiresAuth: true,
            layout: 'main'
        },
        props: true // Allows passing route params as props to the component
    },

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