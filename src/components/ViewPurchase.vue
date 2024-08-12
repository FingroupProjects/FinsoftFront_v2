<script setup>
import {onMounted, ref, watch, watchEffect} from 'vue';
import Select from "primevue/dropdown";
import PurchasingTable from "@/components/PurchasingTable.vue";
import {useAxios} from "@/composable/useAxios.js";
import {useStaticApi} from "@/composable/useStaticApi.js";
import {useToast} from "primevue/usetoast";
import Sidebar from "primevue/sidebar";
import ShoppingMovement from "@/components/ShoppingMovement.vue";
import HistoryPurchase from "@/components/HistoryPurchase.vue";
import {useVuelidate} from "@vuelidate/core";
import moment from "moment";
import FloatLabel from "primevue/floatlabel";
import Textarea from "primevue/textarea";
import DatePicker from "primevue/datepicker";

const props = defineProps({
  productId:{
    required: true,
  }
});

const status = ref('Не проведен')
const productsInfo = ref()
const toast = useToast();
const visibleMovement = ref(false)
const visibleHistory = ref(false)
const approved = ref(false)
const isOpen = ref(false);
const isCurrencyFetched = ref(false);
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
const userName = {
  name: localStorage.getItem("user_name"),
};
const organizationJson = localStorage.getItem('organization');
const organizationHas = JSON.parse(organizationJson);
const hasOrganization = JSON.parse(localStorage.getItem('hasOneOrganization'));

async function getAgreement() {
  try {
    const res = await useAxios(`/cpAgreement/getAgreementByCounterpartyId/${viewDocument.counterpartyName?.code}`)
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
      doc_number: item.doc_number,
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
    status.value = 'Проведен'
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
    status.value = 'Не проведен'
    toast.add({ severity: 'success', summary: 'Проведение отменено!', detail: 'Документ не проведен!', life: 1500 });
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

findStorage();
watchEffect(() => {
    if (viewDocument.value.counterpartyName &&
        viewDocument.value.counterpartyName.agreement &&
        viewDocument.value.counterpartyName.agreement.length > 0) {
     viewDocument.value.counterpartyAgreementName = {
      name: viewDocument.value.counterpartyName.agreement[0].name,
      code: viewDocument.value.counterpartyName.agreement[0].id,
    };
  } else {
    viewDocument.counterpartyAgreementName = null;
  }
  if (hasOrganization === true) viewDocument.organizationName = {
    name:organizationHas.name,
    code:organizationHas.id
  }
  if (storage.value.length === 1) viewDocument.storageName = storage.value[0]
});
watch(viewDocument.value, (newValue) => {
  console.log(newValue)
  if (newValue.counterpartyAgreementName && !isCurrencyFetched.value) {

    findCurrency(newValue.counterpartyAgreementName).then(() => {
      viewDocument.value.currencyName = currency.value[0];
    });
    isCurrencyFetched.value = true;
  }
},{deep:true});
</script>
<template>
  <div class="edit-purchase">
    <Toast/>
    <div class="header">

      <div class="flex gap-[16px] pt-2">
        <div>
          <div class="header-title">Закупка</div>
          <div class="header-text text-[#808BA0] font-semibold mt-1.5 text-[12px]">№{{viewDocument.doc_number}}</div>
        </div>

        <FloatLabel class="col-span-4">
          <Select
              v-model="status"
              placeholder="Организация"
              class="w-full p-focus active-approve"
              disabled
          >
            <template #value >
              <span :style="{ color: '#17A825', fontWeight: '600' }">{{ status }}</span>
            </template>

          </Select>
          <label for="dd-city">Статус</label>
        </FloatLabel>

        <fin-button v-if="approved === false" @click="approve()"
          icon="pi pi-arrow-right bold" label="Провести"
          severity="secondary" class="p-button-lg btn-approve"
          :style="{ color: '#17A825', borderColor: '#17A825', backgroundColor: '#fff', }"
        />

        <fin-button v-if="approved === true"
          @click="unApprove()" icon="pi pi-arrow-right"
          label="Отменить проведение" severity="secondary"
          class="p-button-lg btn-un-approve" :style="{ color: '#C1790C', borderColor: '#C1790C' }"
        />

        <fin-button icon="pi pi-save" @click="updateView()" label="Сохранить" severity="success" class="p-button-lg"/>
      </div>
      <div class="flex gap-[16px] pt-2">
        <fin-button @click="visibleMovement = true"  icon="pi pi-arrow-right-arrow-left" severity="warning" class="p-button-lg btn-movement w-[158px]">
          <img src="../assets/img/img.png" alt="" class="w-[20px]"/>
          Движение
        </fin-button>
      </div>
    </div>
    <div v-if="isOpen" class="view-doc form grid grid-cols-12 gap-[16px] mt-[30px] border-b border-t pt-[30px] pb-[20px]">
      <FloatLabel class="col-span-4">
        <DatePicker
            showIcon
            v-model="viewDocument.date"
            showTime
            hourFormat="24"
            dateFormat="dd.mm.yy,"
            fluid
            hideOnDateTimeSelect
            iconDisplay="input"
            class="w-full"
        />
        <label for="dd-city">Дата</label>
      </FloatLabel>

      <FloatLabel class="col-span-4" v-if="!hasOrganization">
        <Select
            v-model="viewDocument.organizationName"
            class="w-full"
            :options="organization"
            option-label="name"
            @click="findOrganization"
        >
          <template #value>
            {{ viewDocument.organizationName?.name }}
            </template>
        </Select>
        <label for="dd-city">Организация</label>
      </FloatLabel>

      <FloatLabel class="col-span-4">
        <Select v-model="viewDocument.counterpartyName" class="w-full"
                :options="counterparty" @click="findCounterparty" option-label="name">
        <template #value>
          {{ viewDocument.counterpartyName?.name }}
        </template>
      </Select>
        <label for="dd-city">Поставщик</label>
      </FloatLabel>
      <FloatLabel class="col-span-4">
        <Select v-model="viewDocument.counterpartyAgreementName" class="w-full"
                :options="agreementList" @click="getAgreement" option-label="name">
        <template #value>
          {{ viewDocument.counterpartyAgreementName?.name }}
        </template>
      </Select>
        <label for="dd-city">Договор</label>
      </FloatLabel>
      <FloatLabel class="col-span-4">
        <Select v-model="viewDocument.storageName" :options="storage" class="w-full" option-label="name"
                @click="findStorage">
        <template #value>
          {{ viewDocument.storageName?.name }}
        </template>
      </Select>
        <label for="dd-city">Склад</label>
      </FloatLabel>
      <FloatLabel class="col-span-4">
        <Select v-model="viewDocument.currencyName" :options="currency" class="w-full" option-label="name"
                @click="findCurrency">
        <template #value>
          {{ viewDocument.currencyName?.name }}
        </template>
      </Select>
        <label for="dd-city">Валюта</label>
      </FloatLabel>
      <FloatLabel class="col-span-12 mt-[10px]">
        <Textarea class="w-full" style="min-height: 20px" rows="2" cols="20" />
        <label for="dd-city">Комментарий</label>
      </FloatLabel>
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
        <i class="pi pi-history mb-[1px] "></i>
        <span class="mt-0.5" style="font-weight: bold; margin-bottom: 3px; font-size: 15px;">История</span>
      </fin-button>
      <fin-button class="icon-print" severity="success" @click="openDocumentPrint(productId)">
        <i class="pi pi-print mb-[1px ]"></i>
        <span class="mt-0.5" style="font-weight: bold; margin-bottom: 3px;font-size: 15px;">Печать</span>
      </fin-button>
    </div>
  </div>
    <purchasing-table :productId="productId" @post-goods="getProducts"/>

  <div class="text-[20px] font-[600] absolute bottom-[40px]">
    Автор: {{ userName.name }}
  </div>

    <Sidebar
        v-model:visible="visibleMovement"
        :show-close-icon="false"
        position="right"
        class="drower-movement"
    >
      <shopping-movement :productId="productId" :number-agreement="viewDocument.doc_number"/>
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
  margin-left: 780px !important;
  background-color: white !important;
  color: #3935E7 !important;
  border: 1px solid #DCDFE3 !important;
  width: 160px !important;
  height: 31px !important;
}
.icon-print{

  background-color: white !important;
  color: #3935E7 !important;
  border: 1px solid #DCDFE3 !important;
  width: 150px !important;
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

  .btn-movement {
    font-weight: bold !important;
    font-size: 16px !important;
    width: 138px !important;
    height: 46px !important;
    gap: 10px !important;
  }

  .btn-movement:hover{
    color: #3935E7 !important;
  }
  .btn-approve:hover{
    color: #17A825 !important;
    border-color: #17A825 !important;
    font-weight: bold !important;
    background-color: #fff !important;
  }
  .btn-approve .p-button-label {
    font-weight: 600;
  }
  .btn-un-approve .p-button-label{
    font-weight: 600;
  }

  .btn-un-approve{
    color: #C1790C !important;
    border-color: #C1790C !important;
    font-weight: bold !important;
    background-color: #fff !important;
  }
  .active-approve{
    background-color: #fff !important;
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
