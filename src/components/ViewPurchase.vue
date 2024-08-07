<script setup>
import { onMounted, ref } from 'vue';
import Calendar from 'primevue/calendar';
import Dropdown from "primevue/dropdown";
import PurchasingTable from "@/components/PurchasingTable.vue";
import { useAxios } from "@/composable/useAxios.js";
import FinInput from "@/components/ui/Inputs.vue";
import {useStaticApi} from "@/composable/useStaticApi.js";
import {useToast}  from "primevue/usetoast";
import Sidebar from "primevue/sidebar";
import ShoppingMovement from "@/components/ShoppingMovement.vue";
import HistoryPurchase from "@/components/HistoryPurchase.vue";
import {useVuelidate} from "@vuelidate/core";
import moment from "moment";

const props = defineProps({
  productId:{
    required: true,
  }
});
const toast = useToast();
const visibleMovement = ref(false)
const visibleHistory = ref(false)
const approved = ref(false)
const isOpen = ref(true);
const viewDocument = ref({
  organizationName: '',
  author: '',
  counterpartyName: '',
  counterpartyAgreementName: '',
  storageName: '',
  date: null,
  currencyName: '',
});

const v$ = useVuelidate();

const {
  findCurrency,
  currency,
  findStorage,
  storage,
  findOrganization,
  organization,
  findCounterparty,
  counterparty
} = useStaticApi()
const agreementList = ref([]);
async function getAgreement() {
  try {
    const res = await useAxios(`/cpAgreement/getAgreementByCounterpartyId/1`)
    return agreementList.value = res.result.data.map(el => {
      return {
        name: el.name,
        code: el.id
      }
    })
  } catch (e) {
    console.log(e)
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  };
  return date.toLocaleString('en-GB', options).replace(',', '');
};

const getView = async () => {
  try {
    const res = await useAxios(`/document/show/${props.productId}`)
    const item = res.result;

    viewDocument.value = {
      organizationName: item.organization,
      author: item.author,
      counterpartyName: item.counterparty,
      counterpartyAgreementName: item.counterpartyAgreement,
      storageName: item.storage,
      date: formatDate(item.date),
      currencyName: item.currency,
    };

  } catch (e) {
    console.error('Error fetching data:', e);
  }
};

const updateView = async () =>{
  const result = await v$.value.$validate()
  if (result) {
    try{
      const res = await useAxios(`/document/update/${props.productId}`, {
        method: 'PATCH',
        data: {
          organization_id: viewDocument.value.organizationName.id || viewDocument.value.organizationName.code ,
          counterparty_id: viewDocument.value.counterpartyName.id || viewDocument.value.counterpartyName.code,
          storage_id: viewDocument.value.storageName.id || viewDocument.value.storageName.code,
          date: moment(viewDocument.value.date).format('YYYY-MM-DD HH:mm:ss'),
          currency_id: viewDocument.value.currencyName.id || viewDocument.value.currencyName.code,
          counterparty_agreement_id: viewDocument.value.counterpartyAgreementName.id || viewDocument.value.counterpartyAgreementName.code
        }
      })
    }catch (e) {
      console.error(e)
    }
  }
}

const approve = async () => {
  try {
    const res = await useAxios(`/document/provider/approve`, {
      method: 'POST',
      data:{
        ids:["0e97bb29-d408-4380-8c44-e0431c2db7c8"]
      }
    });
    toast.add({ severity: 'success', summary: 'Проведен!', detail: 'Документ успешно проведен!', life: 1500 });
    approved.value = true

  }catch (e) {
    console.error(e)
    toast.add({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось одобрить документ!', life: 1500 });
  }
}

const unApprove = async () =>{
  try{
    const res = await useAxios(`/document/provider/unApprove`, {
      method: 'POST',
      data:{
        ids:["0e97bb29-d408-4380-8c44-e0431c2db7c8"]
      }
    });
    approved.value = false
    toast.add({ severity: 'success', summary: 'Не проведен', detail: 'Документ не проведен!', life: 1500 });
  }catch (e){
    console.error(e)
    toast.add({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось отменить одобрение документа', life: 1500 });
  }
}

const ddd = () =>{
  console.log('OUR DOCUMENT',viewDocument.value.organizationName.id)
}

onMounted(async () => {
  await getView();
});


</script>
<template>
  <div class="create-purchase">
    <Toast/>
    <div class="header">
      <div class="flex gap-[16px]">
        <div>
          <div class="header-title">Закупка</div>
          <div class="header-text text-[#808BA0] font-semibold text-[16px]">№32151</div>
        </div>
        <fin-button v-if="approved === false" @click="approve()" icon="pi pi-arrow-right" label="Провести" severity="secondary" class="p-button-lg"/>
        <fin-button v-if="approved === true" @click="unApprove()" icon="pi pi-arrow-right" label="Не провести" severity="secondary" class="p-button-lg"/>
        <fin-button icon="pi pi-save" @click="updateView()" label="Сохранить" severity="success" class="p-button-lg"/>
      </div>
      <div class="flex gap-[16px]">
        <fin-button @click="visibleMovement = true"  icon="pi pi-arrow-right-arrow-left" label="Движение" severity="warning" class="p-button-lg"/>
      </div>
    </div>
    <div v-if="isOpen" class="view-doc form grid grid-cols-12 gap-[16px] mt-[30px] border-b border-t pt-[30px] pb-[20px]">
      <Calendar v-model="viewDocument.date" showIcon placeholder="Дата" iconDisplay="input" class="col-span-4"/>
      <Dropdown
          v-model="viewDocument.organizationName"
          placeholder="Организация"
          class="col-span-4"
          :options="organization"
          option-label="name"
          @click="findOrganization"
      >
        <template #value>
          {{ viewDocument.organizationName.name }}
        </template>
      </Dropdown>

      <Dropdown v-model="viewDocument.counterpartyName" placeholder="Поставщик" class="col-span-4"
                :options="counterparty" @click="findCounterparty" option-label="name">
        <template #value>
          {{viewDocument.counterpartyName.name}}
        </template>
      </Dropdown>
      <Dropdown v-model="viewDocument.counterpartyAgreementName" placeholder="Договор" class="col-span-3"
                :options="agreementList" @click="getAgreement" option-label="name">
        <template #value>
          {{viewDocument.counterpartyAgreementName.name}}
        </template>
      </Dropdown>
      <Dropdown v-model="viewDocument.storageName" placeholder="Склад" class="col-span-3" :options="storage" @click="findStorage" option-label="name">
        <template #value>
          {{viewDocument.storageName.name}}
        </template>
      </Dropdown>
      <Dropdown v-model="viewDocument.author" disabled placeholder="Автор" class="col-span-3">
        <template #value>
          {{viewDocument.author.name}}
        </template>
      </Dropdown>
      <Dropdown v-model="viewDocument.currencyName" placeholder="Валюта" class="col-span-3" :options="currency" @click="findCurrency" option-label="name">
        <template #value>
          {{viewDocument.currencyName.name}}
        </template>
      </Dropdown>
      <fin-input placeholder="Комментарий" class="col-span-12 mt-[10px]"/>
      <div  class="col-span-12">
        <button @click="isOpen = false" class="text-[#808BA0] m-auto flex justify-center text-[16px] font-[Manrope] leading-[16px]">Скрыть <i class=" mt-0.5 ml-1 pi pi-angle-up"></i></button>
      </div>
    </div>
    <div v-if="isOpen === false" class="border-y py-5 mt-[30px] col-span-12">
      <button @click="isOpen = true" class="  text-[#808BA0] m-auto flex justify-center text-[16px] font-[Manrope] leading-[16px]">Раскрыть <i class="mt-0.5 ml-1 pi pi-angle-down"></i></button>
    </div>
    <div class="flex items-center mt-[30px] mb-[20px] gap-[21px]">
      <div class="header-title">Товары</div>
      <fin-button icon="pi pi-plus" severity="success" label="Добавить"/>
      <fin-button @click="visibleHistory = true" icon="pi pi-history" label="История" class="p-button-lg"  severity="warning"/>
      <fin-button icon="pi pi-print" label="Печать" class="p-button-lg"  severity="warning"/>
    </div>
  </div>
  <purchasing-table :productId="productId"/>
  <div class="rounded-[10px] flex justify-between items-center p-[18px] mt-[16px] bg-[#F6F6F6]">
    <div class="text-[#141C30] font-semibold text-[20px] leading-[20px]">Итого:</div>
    <div class="flex gap-[49px]">
      <div class="text-[22px] text-[#141C30] leading-[22px] font-semibold">
        <div class="text-[13px] text-[#808BA0] leading-[13px] font-semibold mb-[8px]">Кол-во</div>
        780
      </div>
      <div class="text-[22px] text-[#141C30] leading-[22px] font-semibold">
        <div class="text-[13px] text-[#808BA0] leading-[13px] font-semibold mb-[8px]">Товаров</div>
        4
      </div>
      <div class="text-[22px] text-[#141C30] leading-[22px] font-semibold">
        <div class="text-[13px] text-[#808BA0] leading-[13px] font-semibold mb-[8px]">Сумма</div>
        28 190
      </div>
    </div>
  </div>
    <Sidebar
        v-model:visible="visibleMovement"
        :show-close-icon="false"
        position="right"
        class="drower-movement"
    >
      <shopping-movement/>
    </Sidebar>
  <Sidebar
      v-model:visible="visibleHistory"
      :show-close-icon="false"
      position="right"
      class="drower-movement"
  >
    <history-purchase :productId="productId"/>
  </Sidebar>
</template>

<style lang="scss">
.p-datepicker {
  border-radius: 100px;
  display: flex;
  align-items: center;
}
.view-doc{
  .p-select-option .p-focus{
    background-color: #3935E7 !important;
    color: white !important;
  }
  .p-select-open{
    border-color: #3935E7 !important;
  }
  .p-select-option:hover{
    background-color: #ededed !important;
  }
  .p-inputwrapper-focus{
    border-color: #3935E7 !important;
  }
  .p-datepicker-input{
    border: 0;
  }
  .p-select:hover{
    border-color: #3935E7  !important;
  }
}
.icon-history{
  margin-left: 600px !important;
  background-color: white !important;
  color: #3935E7 !important;
  border: 2px solid #DCDFE3 !important;
  width: 112px !important;
  height: 31px !important;
}
.icon-print{
  background-color: white !important;
  color: #3935E7 !important;
  border: 2px solid #DCDFE3 !important;
  width: 112px !important;
  height: 31px !important;
}


.create-purchase {
  .p-select {
    border-color: #DCDFE3;
    border-radius: 10px !important;
    box-shadow: none !important;
    height: 46px;
    align-items: center;
  }

}
.drower-movement {
  width: 850px !important;
  border-top-left-radius: 30px;
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
  }
  &-text {
    font-family: Manrope, sans-serif;
  }
}
.filter-form {
  border-top: 1px dashed #DCDFE3;
  border-bottom: 1px dashed #DCDFE3;
}
</style>
