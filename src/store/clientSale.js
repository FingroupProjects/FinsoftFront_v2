import {defineStore} from 'pinia'
import {ref} from 'vue'

export const useClientSale = defineStore('useClientSale', () => {
    const postGoods = ref([])
    const getId = ref(null)
    const installment = ref([])
    return {postGoods, getId, installment}
})


