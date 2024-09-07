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
  const statusList = ref([]);
  const providerOrderStatusList = ref([]);
  const loadingCounterparty = ref(false);
  const loadStatus = ref(false);
  const providerOrderLoadStatus = ref(false);
  const cashRegisterList = ref([]);
  const loadingCash = ref(false);
  const loadingBill = ref(false);
  const billList = ref([]);
  const employeeList = ref([]);
  const loadingEmployee = ref(false);
  const balanceList = ref([]);
  const loadingBalance = ref(false);
  const userList = ref([]);
  const loadingUser = ref(false);
  const operationPkoList = ref([]);
  const priceTypes = ref([]);
  const positions = ref([]);
  const departments = ref([]);
  const schedules = ref([]);

  const months = ref([]);
  const loadingMonth = ref(false)
  const loadingOperationPko = ref(false)
  const loadPriceType = ref(false)
  const loadSchedule = ref(false)
  const loadDepartment = ref(false)
  const loadPositions = ref(false)
  const loadProviderStatus = ref(false)

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
      const res = await useAxios(`/document/client/order/statuses/1`);

      return (statusList.value = res.result.map((el) => {
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
  const findOrderProviderStatus = async () => {
    try {
      providerOrderLoadStatus.value = true;
      const res = await useAxios(`/document/client/order/statuses/2`);

      return (providerOrderStatusList.value = res.result.map((el) => {
        return {
          name: el.name,
          code: el.id
        };
      }));
    } catch (e) {
      console.log(e);
    } finally {
      loadProviderStatus.value = false;
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
  const findCashRegister = async () => {
    try {
      loadingCash.value = true;
      const res = await useAxios(`/cashRegister`);
      return (cashRegisterList.value = res.result.data.map((el) => {
        return {
          name: el.name,
          code: el.id,
        };
      }));
    } catch (e) {
      console.log(e);
    } finally {
      loadingCash.value = false;
    }
  };

  const findOrganizationBill = async () => {
    try {
      loadingBill.value = true;
      const res = await useAxios(`/organizationBill`);
      return (billList.value = res.result.data.map((el) => {
        return {
          name: el.name,
          code: el.id,
        };
      }));
    } catch (e) {
      console.log(e);
    } finally {
      loadingBill.value = false;
    }
  };

  const findEmployee = async () => {
    try {
      loadingEmployee.value = true;
      const res = await useAxios(`/employee?itemsPerPage=10`);
      return (employeeList.value = res.result.data.map((el) => {
        return {
          name: el.name,
          code: el.id,
        };
      }));
    } catch (e) {
      console.log(e);
    } finally {
      loadingEmployee.value = false;
    }
  };

  const findBalance = async () => {
    try {
      loadingBalance.value = true;
      const res = await useAxios(`/cash-store/balance-article`);
      return (balanceList.value = res.result.data.map((el) => {
        return {
          name: el.name,
          code: el.id,
        };
      }));
    } catch (e) {
      console.log(e);
    } finally {
      loadingBalance.value = false;
    }
  };

  const findUsers = async () => {
    try {
      loadingUser.value = true;
      const res = await useAxios(`/user`);
      return (userList.value = res.result.data.map((el) => {
        return {
          name: el.name,
          code: el.id,
        };
      }));
    } catch (e) {
      console.log(e);
    } finally {
      loadingUser.value = false;
    }
  };

  const findOperationPko = async () => {
    try {
      loadingOperationPko.value = true;
      const res = await useAxios(`/operationTypes?type=PKO`);
      return (operationPkoList.value = res.result.map((el) => {
        return {
          name: el.title_ru,
          code: el.id,
        };
      }));
    } catch (e) {
      console.log(e);
    } finally {
      loadingOperationPko.value = false;
    }
  };
  const findPriceType = async () => {
    try {
      loadPriceType.value = true;
      const res = await useAxios(`/priceType`);
      return (priceTypes.value = res.result.data.map((el) => {
        return {
          name: el.name,
          code: el.id,
        };
      }));
    } catch (e) {
      console.log(e);
    } finally {
      loadPriceType.value = false;
    }
  };

  const findPosition = async () => {
    try {
      loadPositions.value = true;
      const res = await useAxios(`/position`);
      return (positions.value = res.result.data.map((el) => {
        return {
          name: el.name,
          code: el.id,
        };
      }));
    } catch (e) {
      console.log(e);
    } finally {
      loadPositions.value = false;
    }
  };
  const findDepartment = async () => {
    try {
      loadDepartment.value = true;
      const res = await useAxios(`/department`);
      return (departments.value = res.result.data.map((el) => {
        return {
          name: el.name,
          code: el.id,
        };
      }));
    } catch (e) {
      console.log(e);
    } finally {
      loadDepartment.value = false;
    }
  };

  const findSchedule = async () => {
    try {
      loadSchedule.value = true;
      const res = await useAxios(`/schedule`);
      return (schedules.value = res.result.data.map((el) => {
        return {
          name: el.name,
          code: el.id,
        };
      }));
    } catch (e) {
      console.log(e);
    } finally {
      loadSchedule.value = false;
    }
  };
  const findMonth = async () => {
    try {
      loadingMonth.value = true;
      const res = await useAxios(`/months`);
      return (months.value = res.result.data.map((el) => {
        return {
          name: el.name,
          code: el.id,
        };
      }));
    } catch (e) {
      console.log(e);
    } finally {
      loadingMonth.value = false;
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
    statusList,
    findCashRegister,
    cashRegisterList,
    loadingCash,
    findOrganizationBill,
    billList,
    loadingBill,
    findEmployee,
    employeeList,
    loadingEmployee,
    findBalance,
    balanceList,
    loadingBalance,
    findUsers,
    userList,
    loadingUser,
    findOperationPko,
    operationPkoList,
    loadingOperationPko,
    loadStatus,
    findPriceType,
    loadPriceType,
    priceTypes,
    providerOrderStatusList,
    findOrderProviderStatus,
    loadProviderStatus,
    findPosition,
    positions,
    loadPositions,
    departments,
    loadDepartment,
    findDepartment,
    findSchedule,
    loadSchedule,
    schedules,
    months,
    loadingMonth,
    findMonth
  };
};
