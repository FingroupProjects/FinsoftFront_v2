import {defineStore} from 'pinia'
import {ref} from 'vue'

export const useClientSale = defineStore('useClientSale', () => {
    const postGoods = ref([])
    return {postGoods}
})
