<script setup>
import {reactive, ref, watch, watchEffect} from "vue";
import DatePicker from "primevue/datePicker";
import {useStaticApi} from "@/composable/useStaticApi.js";
import {useAxios} from "@/composable/useAxios.js";
import CreateProduct from "@/components/CreateProduct.vue";
import Dropdown from "primevue/dropdown";
import moment from "moment";
import {useVuelidate} from "@vuelidate/core";
import {required} from "@vuelidate/validators";
import {useToast} from "primevue/usetoast";
import Toast from "primevue/toast";
import FloatLabel from "primevue/floatlabel";
import Textarea from 'primevue/textarea';

const emit = defineEmits(["closeDialog","closeSidebar"]);

const toast = useToast();

const {
  findCurrency,
  currency,
  loading,
  findStorage,
  storage,
  loadingStorage,
  findOrganization,
  organization,
  findCounterparty,
  counterparty,
  loadingCounterparty,
  loadingOrganization,
} = useStaticApi();

const agreementList = ref([]);
const loadingAgreement = ref(false);
const productsInfo = ref();
const isCurrencyFetched = ref(false);
const hasOrganization = JSON.parse(localStorage.getItem('hasOneOrganization'));

const organizationJson = localStorage.getItem('organization');
const organizationHas = JSON.parse(organizationJson);

const createValues = reactive({
  datetime24h: new Date,
  selectCurrency: "",
  selectedStorage: "",
  selectedAgreement: "",
  comments: "",
  selectedOrganization: "",
  selectedCounterparty: "",
});
const rules = reactive({
  datetime24h: { required },
  selectCurrency: { required },
  selectedStorage: { required },
  selectedOrganization: { required },
  selectedCounterparty: { required },
  selectedAgreement: { required },
});
const userName = {
  name: localStorage.getItem("user_name"),
};
const v$ = useVuelidate(rules, createValues);

async function getAgreement() {
  try {
    loadingAgreement.value = true;
    const res = await useAxios(
      `/cpAgreement/getAgreementByCounterpartyId/${createValues.selectedCounterparty?.code || ''}`
    );
    return (agreementList.value = res.result.data.map((el) => {
      return {
        name: el.name,
        code: el.id,
      };
    }));
  } catch (e) {
    console.log(e);
  } finally {
    loadingAgreement.value = false;
  }
}

async function saveFn() {
  const result = await v$.value.$validate();

  if (result) {
    try {
      const res = await useAxios(`/document/provider/purchase`, {
        method: "POST",
        data: {
          date: moment(createValues.datetime24h).format("YYYY-MM-DD HH:mm:ss"),
          organization_id: createValues.selectedOrganization.code,
          counterparty_id: createValues.selectedCounterparty.code,
          counterparty_agreement_id: createValues.selectedAgreement.code,
          storage_id: createValues.selectedStorage.code,
          currency_id: createValues.selectCurrency.code,
          goods: productsInfo.value,
        },
      });
      toast.add({
        severity: "success",
        summary: "Success Message",
        detail: "Message Content",
        life: 3000,
      });
      emit("closeDialog",res.result.id);
    } catch (e) {
      console.log(e);
      toast.add({
        severity: "error",
        summary: "Error Message",
        detail: e,
        life: 3000,
      });
    }
  }
}

function getProducts(products) {
  productsInfo.value = products;
}
findStorage()

watchEffect(() => {
  if (
    createValues.selectedCounterparty &&
    createValues.selectedCounterparty.agreement &&
    createValues.selectedCounterparty.agreement.length > 0
  ) {
    createValues.selectedAgreement = {
      name: createValues.selectedCounterparty.agreement[0].name,
      code: createValues.selectedCounterparty.agreement[0].id,
    };
  } else {
    createValues.selectedAgreement = null;
  }
    if (hasOrganization === true) createValues.selectedOrganization = {
      name:organizationHas.name,
      code:organizationHas.id
    }
    if (storage.value.length === 1) createValues.selectedStorage = storage.value[0]

});
watch(createValues, (newValue) => {
  if (newValue.selectedAgreement && !isCurrencyFetched.value) {
    findCurrency(newValue.selectedAgreement).then(() => {
      createValues.selectCurrency = currency.value[0];
      console.log(currency.value);
    });
    isCurrencyFetched.value = true;
  }
});
</script>

<template>
  <div class="create-purchases">
    <div class="header">
      <div>
        <div class="header-title">Создание закупки</div>
        <div class="header-text text-[#808BA0] font-semibold text-[16px]">
          №32151
        </div>
      </div>
      <div class="flex gap-[16px]">
        <fin-button
          icon="pi pi-save"
          @click="saveFn"
          label="Сохранить"
          severity="success"
          class="p-button-lg"
        />
        <fin-button
          icon="pi pi-times"
          @click="emit('closeSidebar')"
          label="Отменить"
          severity="warning"
          class="p-button-lg"
        />
      </div>
    </div>
    <div class="form grid grid-cols-12 gap-[16px] mt-[30px]">
      <FloatLabel class="col-span-4">
      <DatePicker
        showIcon
        v-model="createValues.datetime24h"
        :class="{ 'p-invalid': v$.datetime24h.$error }"
        showTime
        hourFormat="24"
        showButtonBar
        dateFormat="dd.mm.yy,"
        fluid
        hideOnDateTimeSelect
        iconDisplay="input"
        class="w-full"
      />
        <label for="dd-city">Дата</label>
      </FloatLabel>
      <FloatLabel class="col-span-4" v-if="!hasOrganization">
        <Dropdown
          v-model="createValues.selectedOrganization"
          :options="organization"
          :class="{ 'p-invalid': v$.selectedOrganization.$error }"
          @click="findOrganization"

          :loading="loadingOrganization"
          optionLabel="name"
          class="w-full"
        />
        <label for="dd-city">Организация</label>
      </FloatLabel>
      <FloatLabel class="col-span-4">
        <Dropdown
          v-model="createValues.selectedCounterparty"
          :class="{ 'p-invalid': v$.selectedCounterparty.$error }"
          @click="findCounterparty"
          :options="counterparty"
          :loading="loadingCounterparty"
          optionLabel="name"
          class="w-full"
        />
        <label for="dd-city">Поставщик</label>
      </FloatLabel>
      <FloatLabel class="col-span-4">
        <Dropdown
          v-model="createValues.selectedAgreement"
          :class="{ 'p-invalid': v$.selectedAgreement.$error }"
          @click="getAgreement"
          :loading="loadingAgreement"
          :options="agreementList"
          optionLabel="name"
          class="w-full"
        >
          <template #value>{{ createValues.selectedAgreement?.name }}</template>
        </Dropdown>
        <label for="dd-city">Договор</label>
      </FloatLabel>
      <FloatLabel class="col-span-4">
        <Dropdown
          v-model="createValues.selectedStorage"
          :class="{ 'p-invalid': v$.selectedStorage.$error }"
          @click="findStorage"
          :loading="loadingStorage"
          :options="storage"
          optionLabel="name"
          class="w-full"
        />
        <label for="dd-city">Склад</label>
      </FloatLabel>

      <FloatLabel class="col-span-4">
        <Dropdown
          v-model="createValues.selectCurrency"
          :class="{ 'p-invalid': v$.selectCurrency.$error }"
          @click="findCurrency(createValues.selectedAgreement)"
          :loading="loading"
          :options="currency"
          optionLabel="name"
          class="w-full"
        >
          <template #value>
            {{ createValues.selectCurrency?.name }}
          </template>
        </Dropdown>
        <label for="dd-city">Валюта</label>
      </FloatLabel>
      <FloatLabel class="col-span-12 mt-[10px]">
      <Textarea v-model="createValues.comments" class="w-full" rows="5" cols="30" />
        <label for="dd-city">Комментарий</label>
      </FloatLabel>
    </div>
  </div>
  <CreateProduct @postGoods="getProducts" />
  <div class="text-[20px] font-[600] absolute bottom-[40px]">
    Автор: {{ userName.name }}
  </div>
  <Toast />
</template>

<style lang="scss">
@import "@/assets/style/colors";
.create-purchases {
  .p-select {
    border-color: #dcdfe3;
    border-radius: 10px !important;
    box-shadow: none !important;
    height: 46px;
    align-items: center;
  }
  .p-button-secondary{
    color: transparent !important;
    border-color: transparent !important;
  }
  .p-invalid {
    border: 1px solid #f2376f !important;
  }

  .p-select-option {
    width: 90% !important;
    margin: 0 15px !important;
    border-radius: 10px !important;
    font-weight: bold !important;
  }

  .p-focus {
    color: #fff !important;
  }

  .p-select-label {
    font-weight: bold !important;
  }

  .p-select-list-container {
    width: 100% !important;
  }

  .p-datepicker {
    border: transparent;
    border-radius: 10px;
    display: flex;
    align-items: center;

    &-input-icon-container {
      top: 15px !important;
    }
  }
  .p-button-secondary{
    color: $primary-color !important;
    border-color: $primary-color !important;
  }
  .p-inputtext {
    //border-color: white;
    border-radius: 10px;
  }
  .p-inputtext:enabled:focus {
    border-color: $primary-color;
    border-radius: 10px;
  }
}
.p-textarea:enabled:focus{
  border-color: $primary-color !important;
}
.p-inputtext:enabled:focus{
  border-color: #DCDFE3 !important;
}
.header {
  display: flex;
  justify-content: space-between;

  &-title {
    font-family: Manrope, sans-serif;
    font-weight: 600;
    font-size: 20px;
    line-height: 20px;
    color: var(--fin-text-header);

    &-text {
      font-family: Manrope, sans-serif;
    }
  }
}
</style>
