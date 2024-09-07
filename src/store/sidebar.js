import {defineStore} from 'pinia'
import {ref} from 'vue'

export const useSidebar = defineStore('useSidebar', () => {
    const routeItem = ref([]);
    return {routeItem}
})
