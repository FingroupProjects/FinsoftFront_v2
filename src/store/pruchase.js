import {defineStore} from 'pinia'
import {ref} from 'vue'

export const usePurchaseStore = defineStore('usePurchaseStore', () => {
    const postGoods = ref([])
    return {postGoods}
})
