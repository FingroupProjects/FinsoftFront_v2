import {defineStore} from 'pinia'
import {ref} from 'vue'

export const useClientOrder = defineStore('clientOrder', () => {
    const postGoods = ref([])
    return {postGoods}
})
