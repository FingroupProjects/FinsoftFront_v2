import {ref} from 'vue'
import {useAxios} from "@/composable/useAxios.js";


export const useStaticApi = () => {
    const storage = ref([]);
    const currency = ref([]);
    const organization = ref([]);
    const loading = ref(false);
    const loadingStorage = ref(false);
    const loadingOrganization = ref(false);
    const counterparty = ref([]);
    const loadingCounterparty = ref(false);

    const findStorage = async () => {
        try {
            loadingStorage.value = true
            const res = await useAxios(`/storage?itemsPerPage=10`)
            return storage.value = res.result.data.map(el => {
                return {
                    name: el.name,
                    code: el.id
                }
            })
        } catch (e) {
            console.log(e)
        } finally {
            loadingStorage.value = false
        }
    };

    const findCurrency = async () => {
        try {
            loading.value = true
            const res = await useAxios(`/currency?itemsPerPage=10`)
            return currency.value = res.result.data.map(el => {
                return {
                    name: el.name,
                    code: el.id
                }
            })
        } catch (e) {
            console.log(e)
        } finally {
            loading.value = false
        }
    };

    const findOrganization = async () => {
        try {
            loadingOrganization.value = true
            const res = await useAxios(`/organization`)
            return organization.value = res.result.data.map(el => {
                return {
                    name: el.name,
                    code: el.id
                }
            })
        } catch (e) {
            console.log(e)
        } finally {
            loadingOrganization.value = false
        }
    };

    const findCounterparty = async () => {
        try {
            loadingCounterparty.value = true
            const res = await useAxios(`/counterparty?itemsPerPage=10`)
            return counterparty.value = res.result.data.map(el => {
                return {
                    name: el.name,
                    code: el.id
                }
            })
        } catch (e) {
            console.log(e)
        } finally {
            loadingCounterparty.value = false
        }
    };

    return {
        storage,
        findCurrency,
        findStorage,
        currency,
        loading,
        loadingStorage,
        findOrganization,
        organization,
        findCounterparty,
        counterparty
    }
}