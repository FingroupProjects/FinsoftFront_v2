import {defineStore} from 'pinia'
import {ref} from 'vue'

export const useProviderReturn = defineStore('useProviderReturn', () => {
    const postGoods = ref([])
    return {postGoods}
})
