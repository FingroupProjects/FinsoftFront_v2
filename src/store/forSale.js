import {defineStore} from 'pinia'
import {computed, ref} from 'vue'

export const useForSale = defineStore('useForSale', () => {
    const numberCertification = ref('');
    const bonusCard = ref('')
    const activeInput = ref(false);
    return {bonusCard,activeInput, numberCertification}
})