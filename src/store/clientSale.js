import {defineStore} from 'pinia'
import {ref} from 'vue'

export const useClientSale = defineStore('useClientSale', () => {
    const postGoods = ref([])
    const getId = ref(null)
    return {postGoods, getId}
})


