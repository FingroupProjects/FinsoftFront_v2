import {defineStore} from 'pinia'
import {ref} from 'vue'

export const useFinanceStore = defineStore('useFinanceStore', () => {
    const isModal = ref(false);
    const  openInfoModal= ref(false)
    return {isModal,openInfoModal}
})