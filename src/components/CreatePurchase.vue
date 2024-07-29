<script setup>
import {reactive, ref} from 'vue';
import Calendar from 'primevue/calendar';
import {useStaticApi} from "@/composable/useStaticApi.js";
import {useAxios} from "@/composable/useAxios.js";
import CreateProduct from "@/components/CreateProduct.vue";
import Dropdown from "primevue/dropdown";
import moment from "moment";
import {useVuelidate} from '@vuelidate/core';
import {required} from '@vuelidate/validators';

const emit = defineEmits(['closeDialog'])

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
  counterparty
} = useStaticApi()

const agreementList = ref([]);
const loadingAgreement = ref(false);
const createValues = reactive({
  datetime24h: '',
  selectCurrency: '',
  selectedStorage: '',
  selectedAgreement: '',
  comments: '',
  selectedOrganization: '',
  selectedCounterparty: ''
});
const rules = reactive({
  datetime24h: {required},
  selectCurrency: {required},
  selectedStorage: {required},
  comments: {required},
  selectedOrganization: {required},
  selectedCounterparty: {required},
  selectedAgreement: {required},
})
const v$ = useVuelidate(rules, createValues)

async function getAgreement() {
  try {
    loadingAgreement.value = true
    const res = await useAxios(`/cpAgreement/getAgreementByCounterpartyId/1`)
    return agreementList.value = res.result.data.map(el => {
      return {
        name: el.name,
        code: el.id
      }
    })

  } catch (e) {
    console.log(e)
  } finally {
    loadingAgreement.value = false
  }
}

async function saveFn() {
  const result = await v$.value.$validate()
  if (result) {
    try {
      const res = await useAxios(`/document/provider/purchase`, {
        method: 'POST',
        data: {
          "date": moment(createValues.datetime24h).format('YYYY-MM-DD HH:mm:ss'),
          "organization_id": createValues.selectedOrganization.code,
          "counterparty_id": createValues.selectedCounterparty.code,
          "counterparty_agreement_id": createValues.selectedAgreement.code,
          "storage_id": createValues.selectedStorage.code,
          "currency_id": createValues.selectCurrency.code,
          "goods": [
            {
              "good_id": 4,
              "amount": 1,
              "price": 123
            }
          ]
        }
      })
      console.log(res)
    } catch (e) {
      console.log(e)
    }
  }
}
</script>

<template>
  <div class="create-purchase">
    <div class="header">
      <div>
        <div class="header-title">
          Создание закупки

        </div>
        <div class="header-text text-[#808BA0] font-semibold text-[16px]">
          №32151
        </div>
      </div>
      <div class="flex gap-[16px]">
        <fin-button icon="pi pi-save" @click="saveFn" label="Сохранить" severity="success" class="p-button-lg"/>
        <fin-button icon="pi pi-times" @click="emit('closeDialog')" label="Отменить" severity="warning"
                    class="p-button-lg"/>
      </div>
    </div>
    <div class="form grid grid-cols-12 gap-[16px] mt-[30px]">
      <Calendar showIcon placeholder="Дата" v-model="createValues.datetime24h"
                :class="{'p-invalid':v$.datetime24h.$error}" showTime hourFormat="24" fluid
                iconDisplay="input" class="col-span-4"/>
      <Dropdown v-model="createValues.selectedOrganization" :options="organization"
                :class="{'p-invalid':v$.selectedOrganization.$error}"
                @click="findOrganization"
                optionLabel="name" placeholder="Организация" class="col-span-4"/>
      <Dropdown v-model="createValues.selectedCounterparty" :class="{'p-invalid':v$.selectedCounterparty.$error}"
                @click="findCounterparty" :options="counterparty"
                optionLabel="name" placeholder="Поставщик" class="col-span-4"/>
      <Dropdown v-model="createValues.selectedAgreement" :class="{'p-invalid':v$.selectedAgreement.$error}"
                @click="getAgreement" :loading="loadingAgreement"
                :options="agreementList" optionLabel="name" placeholder="Договор" class="col-span-3"/>
      <Dropdown v-model="createValues.selectedStorage" :class="{'p-invalid':v$.selectedStorage.$error}"
                @click="findStorage" :loading="loadingStorage" :options="storage"
                optionLabel="name" placeholder="Склад" class="col-span-3"/>
      <Dropdown optionLabel="name" disabled placeholder="Автор" class="col-span-3"/>
      <Dropdown v-model="createValues.selectCurrency" :class="{'p-invalid':v$.selectCurrency.$error}"
                @click="findCurrency" :loading="loading" :options="currency"
                optionLabel="name" placeholder="Валюта" class="col-span-3"/>
      <fin-input v-model="createValues.comments" :error="v$.comments.$error" placeholder="Комментарий"
                 class="col-span-12 mt-[10px]"/>
    </div>

  </div>
  <CreateProduct/>
</template>

<style lang="scss">
.create-purchase {
  .p-select {
    border-color: #DCDFE3;
    border-radius: 10px !important;
    box-shadow: none !important;
    height: 46px;
    align-items: center;
  }

  .p-invalid {
    border: 1px solid #F2376F !important;
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
    border: 1px solid #DCDFE3 ;
    border-radius: 10px;
    display: flex;
    align-items: center;

    &-input-icon-container {
      top: 15px !important;
    }
  }
  .p-inputtext {
    border-color: white;
    border-radius: 10px;
  }
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