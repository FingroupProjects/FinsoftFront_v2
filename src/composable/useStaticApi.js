import { ref } from "vue";
import { useAxios } from "@/composable/useAxios.js";

export const useStaticApi = () => {
  const storage = ref([]);
  const currency = ref([]);
  const organization = ref([]);
  const loading = ref(false);
  const loadingStorage = ref(false);
  const loadingOrganization = ref(false);
  const counterparty = ref([]);
  const status = ref([]);
  const loadingCounterparty = ref(false);
  const loadStatus = ref(false);

  const findStorage = async () => {
    try {
      loadingStorage.value = true;
      const res = await useAxios(`/storage?itemsPerPage=10`);
      return (storage.value = res.result.data.map((el) => {
        return {
          name: el.name,
          code: el.id,
        };
      }));
    } catch (e) {
      console.log(e);
    } finally {
      loadingStorage.value = false;
    }
  };

  const findCurrency = async (agreementId) => {
    try {
      loading.value = true;
      const res = await useAxios(`/currency/${agreementId?.code|| ''}?itemsPerPage=10`);
      if (res.result.data) {
        return currency.value = res.result.data.map((el) => {
            return {
                name: el.name,
                code: el.id,
            };
         });
      } else {
      return  currency.value = [{
            name: res.result.name,
            code: res.result.id,
        }];
     }
    } catch (e) {
      console.log(e);
    } finally {
      loading.value = false;
    }
  };

  const findOrganization = async () => {
    try {
      loadingOrganization.value = true;
      const res = await useAxios(`/organization`);
      return (organization.value = res.result.data.map((el) => {
        return {
          name: el.name,
          code: el.id,
        };
      }));
    } catch (e) {
      console.log(e);
    } finally {
      loadingOrganization.value = false;
    }
  };
  const findStatus = async () => {
    try {
      loadStatus.value = true;
      const res = await useAxios(`/document/client/order/statuses`);

      return (status.value = res.result.map((el) => {
        return {
          name: el.name,
          code: el.id
        };
      }));
    } catch (e) {
      console.log(e);
    } finally {

      loadStatus.value = false;
    }
  };
  const findCounterparty = async () => {
    try {
      loadingCounterparty.value = true;
      const res = await useAxios(`/counterparty?itemsPerPage=10`);
      return (counterparty.value = res.result.data.map((el) => {
        return {
          name: el.name,
          code: el.id,
          agreement: el.counterpartyAgreement,
        };
      }));
    } catch (e) {
      console.log(e);
    } finally {
      loadingCounterparty.value = false;
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
    counterparty,
    findStatus,
    loadingCounterparty,
    loadingOrganization,
    status,
  };
};
