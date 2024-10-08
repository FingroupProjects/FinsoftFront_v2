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
                path: '/financeRKO',
                name: 'financeRKO',
                component: () => import('@/views/FinanceRKO.vue'),
            },
            {
                path: '/bank',
                name: 'bank',
                component: () => import('@/views/Bank.vue'),
            },

            {
                path: '/bankRKO',
                name: 'bankRKO',
                component: () => import('@/views/BankRKO.vue'),
            },
            {
                path: '/for-sale',
                name: 'for-sale',
                component: () => import('@/views/ForSale.vue'),
            },
            {
                path: '/schedule',
                name: 'schedule',
                component: () => import('@/views/Schedule.vue')
            },
            {
                path: '/salaryDocument',
                name: 'salaryDocument',
                component: () => import('@/views/staff/SalaryDocument.vue')
            },
            {
                path: '/planningGoods',
                name: 'planningGoods',
                component: () => import('@/views/planning/PlanningGoods.vue')
            },
            {
                path: '/planningShops',
                name: 'planningShops',
                component: () => import('@/views/planning/PlanningShops.vue')
            },
            {
                path: '/planningEmployees',
                name: 'planningEmployees',
                component: () => import('@/views/planning/PlanningEmployees.vue')
            },
            {
                path: '/planningOperationTypes',
                name: 'planningOperationTypes',
                component: () => import('@/views/planning/PlanningOperationTypes.vue')
            },
            {
                path: '/discountContract',
                name: 'discountContract',
                component: () => import('@/views/DiscountContract.vue')
            },
            {
                path: '/discountGoods',
                name: 'discountGoods',
                component: () => import('@/views/DiscountGoods.vue')
            },
            {
                path: '/profile',
                name: 'profile',
                component: () => import('@/views/Profile.vue')
            },
            {
                path: '/setting',
                name: 'setting',
                component: () => import('@/views/Setting.vue')
            },
            {
                path: '/price-settings',
                name: 'priceSettings',
                component: () => import('@/views/PriceSettings.vue')
            },
            {
                path: '/price-list',
                name: 'price-list',
                component: () => import('@/components/priceSetting/ListPrice.vue')
            },
        ]
    },
    {
        path: '/documents/:productId',
        name: 'DocumentPrint',
        component: DocumentPrint,
        meta: {
            requiresAuth: true,
            layout: 'main'
        },
        props: true
    },
    {
        path: '/return/:productId',
        name: 'ReturnPrint',
        component: ReturnPrint,
        meta: {
            requiresAuth: true,
            layout: 'main'
        },
        props: true
    },
    {
        path: '/order/:productId',
        name: 'OrderPrint',
        component: OrderPrint,
        meta: {
            requiresAuth: true,
            layout: 'main'
        },
        props: true
    },
    {
        path: '/finance/:productId',
        name: 'FinancePrint',
        component: FinancePrint,
        meta: {
            requiresAuth: true,
            layout: 'main'
        },
        props: true
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
    } else {
        next()
    }
})

export default router