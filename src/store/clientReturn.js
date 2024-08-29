import {defineStore} from 'pinia'
import {ref} from 'vue'

export const useClientReturn = defineStore('useClientReturn', () => {
    const postGoods = ref([])
    return {postGoods}
})
