import {defineStore} from 'pinia'
import {ref} from 'vue'

export const useSidebar = defineStore('useSidebar', () => {
    const routeItem = ref([]);
    const activeSidebar = ref(true)
    return {routeItem,activeSidebar}
})
