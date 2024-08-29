import {defineStore} from 'pinia'
import {ref} from 'vue'

export const useProviderOrder = defineStore('useProviderOrder', () => {
    const postGoods = ref([])
    return {postGoods}
})
