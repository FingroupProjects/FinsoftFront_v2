import { createRouter, createWebHistory} from 'vue-router'
import Dashboard from "@/views/Dashboard.vue";
import DocumentPrint from "@/components/DocumentPrint.vue";
import { useCookies } from 'vue3-cookies'
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
        meta: {
            layout: 'auth',
            requiresAuth: false
        },
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
    history: createWebHistory(),
    routes,
})
router.beforeEach((to, from, next) => {

    const { cookies } = useCookies()
    const isAuthenticated = cookies.isKey('auth-token')

    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/sign-in')
        // next()
    } else {
        next()
    }

})

export default router