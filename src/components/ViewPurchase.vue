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
import CreateProduct from "@/components/CreateProduct.vue";

const props = defineProps({
  productId:{
    required: true,
  }
});

const productsInfo = ref()
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

const receivedGoods = ref([]);

const handlePostGoods = (data) => {
  receivedGoods.value = data.goods;

  console.log('goods', receivedGoods.value)
};

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


const updateView = async () => {
  const result = await v$.value.$validate();
  if (result) {
    try {
      console.log('viewDocument:', viewDocument.value);

      // Ensure productsInfo is always an array and handle potential undefined values
      const goodsArray = (productsInfo.value && Array.isArray(productsInfo.value.goods)) ? productsInfo.value.goods : [];

      // Fetch existing goods from the server
      const existingGoods = await fetchExistingGoods(); // Call here
      const existingGoodsMap = new Map(existingGoods.map(good => [good.good_id, good]));

      // Determine new or updated goods
      const newOrUpdatedGoods = goodsArray.filter(product => {
        const existingGood = existingGoodsMap.get(product.good_id);
        return !existingGood || (existingGood.price !== product.price || existingGood.amount !== product.amount);
      });

      // Prepare the data to be sent
      const data = {
        organization_id: viewDocument.value.organizationName.id || viewDocument.value.organizationName.code,
        counterparty_id: viewDocument.value.counterpartyName.id || viewDocument.value.counterpartyName.code,
        storage_id: viewDocument.value.storageName.id || viewDocument.value.storageName.code,
        date: moment(viewDocument.value.date).format('YYYY-MM-DD HH:mm:ss'),
        currency_id: viewDocument.value.currencyName.id || viewDocument.value.currencyName.code,
        counterparty_agreement_id: viewDocument.value.counterpartyAgreementName.id || viewDocument.value.counterpartyAgreementName.code,
        goods: newOrUpdatedGoods.map(product => ({
          good_id: product.good_id,
          price: parseFloat(product.price),
          amount: parseInt(product.amount, 10),
          created: product.created || false,
          updated: product.updated || false,
          deleted: product.deleted || false
        }))
      };

      console.log('Data to be sent:', data);

      // Send the update request
      const res = await useAxios(`/document/update/${props.productId}`, {
        method: 'PATCH',
        data: data
      });

      toast.add({ severity: 'success', summary: 'Обновлено!', detail: 'Документ успешно обновлен!', life: 1500 });
      console.log('Response:', res);
    } catch (e) {
      console.error(e);
      toast.add({ severity: 'error', summary: 'Ошибка!', detail: 'Не удалось обновить документ!', life: 1500 });
    }
  }
};

// Fetch existing goods
const fetchExistingGoods = async () => {
  try {
    const response = await useAxios(`/document/${props.productId}`);
    return response.data.goods || [];
  } catch (error) {
    console.error('Error fetching existing goods:', error);
    return [];
  }
};





const approve = async () => {
  try {
    const res = await useAxios(`/document/provider/approve`, {
      method: 'POST',
      data:{
        ids:[`${props.productId}`]
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
        ids:[`${props.productId}`]
      }
    });
    approved.value = false
    toast.add({ severity: 'success', summary: 'Не проведен', detail: 'Документ не проведен!', life: 1500 });
  }catch (e){
    console.error(e)
    toast.add({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось отменить одобрение документа', life: 1500 });
  }
}

const openDocumentPrint = (productId) => {
  const url = `#/documents/${productId}`;
  window.open(url, '_blank');
};

function getProducts(products) {
  productsInfo.value = products;
}

onMounted(async () => {
  await getView();
});


</script>
<template>
  <div class="edit-purchase">
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
      <fin-button @click="visibleHistory = true" class="icon-history" severity="success">
        <i class="pi pi-history"></i>
        <span style="font-weight: bold; margin-bottom: 3px;">История</span>
      </fin-button>
      <fin-button class="icon-print" severity="success" @click="openDocumentPrint(productId)">
        <i class="pi pi-print"></i>
        <span style="font-weight: bold; margin-bottom: 3px;">Печать</span>
      </fin-button>
    </div>
  </div>

  <purchasing-table :productId="productId" @post-goods="getProducts"/>

    <Sidebar
        v-model:visible="visibleMovement"
        :show-close-icon="false"
        position="right"
        class="drower-movement"
    >
      <shopping-movement :productId="productId"/>
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
  margin-left: 800px !important;
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


.edit-purchase {
  .p-select {
    border-color: #DCDFE3;
    border-radius: 10px !important;
    box-shadow: none !important;
    height: 46px;
    align-items: center;
  }
  .p-inputtext {
    border: 1px solid #DCDFE3;
    border-radius: 10px !important;
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
