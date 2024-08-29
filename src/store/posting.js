import {defineStore} from 'pinia'
import {ref} from 'vue'

export const usePostingStore = defineStore('usePostingStore', () => {
    const postGoods = ref([])
    return {postGoods}
})
