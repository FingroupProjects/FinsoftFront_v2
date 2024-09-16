<script setup>
import {onMounted, ref, watch, watchEffect} from 'vue';
import Select from "primevue/dropdown";
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
import Dialog from "primevue/dialog";
import ProviderOrderTable from "@/components/providerOrder/ProviderOrderTable.vue";
import {useProviderOrder} from "@/store/providerOrder.js";
import {usePurchaseStore} from "@/store/pruchase.js";
import Dropdown from "primevue/dropdown";
import formatNumber from "@/constants/formatNumber.js";

const emit = defineEmits(['close-sidebar', 'editSave']);
const props = defineProps({
  productId: {
    required: true,
  },
  openModalClose: {
    type: Boolean,
    default: false
  },
  data: Object
});

const status = ref('');
const productsInfo = ref();
const toast = useToast();
const visibleMovement = ref(false);
const visibleHistory = ref(false);
const approved = ref(false);
const isOpen = ref(false);
const isCurrencyFetched = ref(false);
const openInfoModal = ref(false);
const agreementList = ref([]);
const changeValue = ref(false);
const initialValue = ref(null);
const loaderSave = ref(false);

const viewDocument = ref({
  statusName: '',
  organizationName: '',
  author: '',
  counterpartyName: '',
  counterpartyAgreementName: '',
  storageName: '',
  date: null,
  currencyName: '',
  comment: '',
  orderStatus:''
});
const store = useProviderOrder()
const infoGoods = ref({
  editModalOpen: false,
  getAllSum: 0,
  getAllProduct: [],
  goods: []
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
  counterparty,
  findOrderProviderStatus,
  providerOrderStatusList,
  loadProviderStatus
} = useStaticApi()

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

const getView = async () => {
  const item = props.data
  console.log('info', infoGoods.value)

  if (item.active) {
    approved.value = true;
    status.value = 'Проведен';
  } else {
    approved.value = false;
    status.value = 'Не проведен';
  }
  viewDocument.value = {
    organizationName: item.organization,
    author: item.author,
    counterpartyName: item.counterparty.name,
    counterpartyAgreementName: item.counterpartyAgreement,
    storageName: item.storage,
    date: new Date(item.date),
    postDate: item.date,
    currencyName: item.currency,
    doc_number: item.doc_number,
    comment: item.comment,
    statusName: item.orderStatus
  };

  console.log('counterparty', viewDocument.value);
};

const updateView = async () => {
  console.log(123)
  const result = await v$.value.$validate();
  openInfoModal.value = false
  changeValue.value = false
  if (result) {
    loaderSave.value = true
    try {

      const data = {
        organization_id: viewDocument.value.organizationName?.id || viewDocument.value.organizationName?.code,
        counterparty_id: viewDocument.value.counterpartyName?.id || viewDocument.value.counterpartyName?.code,
        storage_id: viewDocument.value.storageName?.id || viewDocument.value.storageName?.code,
        date: moment(viewDocument.value.date).format('YYYY-MM-DD HH:mm:ss'),
        currency_id: viewDocument.value.currencyName?.id || viewDocument.value.currencyName?.code,
        counterparty_agreement_id: viewDocument.value.counterpartyAgreementName?.id || viewDocument.value.counterpartyAgreementName?.code,
        comment: viewDocument.value.comment,
        goods: store.postGoods,
        order_status_id: viewDocument.value.statusName?.id || viewDocument.value.statusName?.code
      };
      const res = await useAxios(`/document/provider/update-order/${props.productId}`, {
        method: 'PATCH',
        data: data
      });
      if (approved.value === true)
        toast.add({severity: 'success', summary: 'Обновлено!', detail: 'Документ успешно обновлен!', life: 1500});

    } catch (e) {
      console.error(e);
      toast.add({severity: 'error', summary: 'Ошибка!', detail: 'Не удалось обновить документ!', life: 1500});
    } finally {
      loaderSave.value = false
      store.postGoods = []
    }
  }
};

const approve = async () => {
  try {
    //await updateView()
    const res = await useAxios(`/document/provider/order/approve`, {
      method: 'POST',
      data: {
        ids: [`${props.productId}`]
      }
    });
    toast.add({severity: 'success', summary: 'Проведен!', detail: 'Документ успешно проведен!', life: 1500});
    approved.value = true
    status.value = 'Проведен'
  } catch (e) {
    console.error(e)
    toast.add({severity: 'error', summary: 'Ошибка', detail: 'Не удалось одобрить документ!', life: 1500});
  }
}

const unApprove = async () => {
  try {
    //await updateView()
    const res = await useAxios(`/document/provider/order/unApprove`, {
      method: 'POST',
      data: {
        ids: [`${props.productId}`]
      }
    });
    approved.value = false
    status.value = 'Не проведен'
    toast.add({severity: 'success', summary: 'Проведение отменено!', detail: 'Документ не проведен!', life: 1500});
  } catch (e) {
    console.error(e)
    toast.add({severity: 'error', summary: 'Ошибка', detail: 'Не удалось отменить одобрение документа', life: 1500});
  }
}
const openDocumentPrint = (productId) => {
  const url = `/order/${productId}`;
  window.open(url, '_blank');
};

const searchCounterparty = async (inputValue) => {
  const res = await useAxios(`counterparty?search=${inputValue?.srcElement.value}`);
  counterparty.value = res.result.data.map((el) => ({
    name: el.name,
    code: el.id,
  }));
};

function getProducts(products) {
  productsInfo.value = products;
}

async function saveFnDialog() {
  //await updateView()
  emit('close-sidebar')
}


function infoModalClose() {
  if (changeValue.value) openInfoModal.value = true
  else emit('close-sidebar')
}

function changeModal(data) {
  infoGoods.value = data
  console.log('info goods',infoGoods.value)
}

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
    name: organizationHas.name,
    code: organizationHas.id
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
}, {deep: true});

watch(viewDocument, (newVal) => {
  if (initialValue.value !== null) {
    changeValue.value = true;
  }
  initialValue.value = newVal;
}, {deep: true});

watch(productsInfo, (newVal) => {
  if (initialValue.value !== null) {
    changeValue.value = true;
  }
  initialValue.value = newVal;
}, {deep: true});

onMounted(async () => {
  try {
    await Promise.all([
      getView(),
      findOrganization(),
      findCounterparty(),
      findStorage()
    ]);
  } catch (error) {
    console.error('Error:', error);
  }
});


</script>
<template>
  <button class="w-[24px] h-[30px] bg-[#fff] rounded-close-btn" @click="infoModalClose"><i
      class="pi pi-times text-[#808BA0]"></i></button>
  <div>
    <div class="edit-purchase">
      <Toast/>
      <div class="header">
        <div class="flex gap-[16px] pt-2">
          <div>
            <div class="header-title">Заказ поставщику</div>
            <div class="header-text text-[#808BA0] font-semibold mt-1.5 text-[12px]">№{{
                viewDocument.doc_number
              }}
            </div>
          </div>

          <FloatLabel class="col-span-4">
            <Select
                v-model="status"
                placeholder="Организация"
                class="w-full p-focus active-approve"
                disabled
            >
              <template #value>
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

          <fin-button icon="pi pi-save" @click="updateView()" label="Сохранить" :loading="loaderSave" severity="success"
                      class="p-button-lg"/>
        </div>
        <div class="flex gap-[16px] pt-2">
          <fin-button @click="visibleMovement = true" icon="pi pi-arrow-right-arrow-left" severity="warning"
                      class="p-button-lg btn-movement w-[158px]">
            <img src="@/assets/img/img.png" alt="" class="w-[20px]"/>
            Движение
          </fin-button>
        </div>
      </div>
      <div v-if="isOpen"
           class="view-doc form grid grid-cols-12 gap-[16px] mt-[30px] border-b border-t pt-[30px] pb-[20px]">

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
          >

          </DatePicker>
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
          <Select v-model="viewDocument.counterpartyName"
                  class="w-full"
                  :options="counterparty"
                  option-label="name"
                  editable
                  @keyup="searchCounterparty"
          >
            <template #value>
              {{ viewDocument.counterpartyName ? viewDocument.counterpartyName.name : '' }}
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
                  @click="findCurrency" disabled style="background-color: #fff !important;">
            <template #value>
              {{ viewDocument.currencyName?.name }}
            </template>
          </Select>
          <label for="dd-city">Валюта</label>
        </FloatLabel>
        <FloatLabel class="col-span-4">
          <Dropdown
              v-model="viewDocument.statusName"
              @click="findOrderProviderStatus"
              :loading="loadProviderStatus"
              :options="providerOrderStatusList"
              optionLabel="name"
              class="w-full"
          >
            <template #value>
              {{ viewDocument.statusName?.name }}
            </template>
          </Dropdown>
          <label for="dd-city">Статус</label>
        </FloatLabel>
        <FloatLabel class="col-span-12 mt-[10px]">
          <Textarea class="w-full" v-model="viewDocument.comment" style="min-height: 20px" rows="2" cols="20"/>
          <label for="dd-city">Комментарий</label>
        </FloatLabel>
        <div class="col-span-12">
          <button @click="isOpen = false"
                  class="text-[#808BA0] m-auto flex justify-center text-[16px] font-[Manrope] leading-[16px]">Скрыть <i
              class=" mt-0.5 ml-1 pi pi-angle-up"></i></button>
        </div>
      </div>
      <div v-if="isOpen === false" class="border-y py-5 mt-[30px] col-span-12">
        <button @click="isOpen = true"
                class="  text-[#808BA0] m-auto flex justify-center text-[16px] font-[Manrope] leading-[16px]">Раскрыть
          <i
              class="mt-0.5 ml-1 pi pi-angle-down"></i></button>
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
    <provider-order-table :info-goods="props.data"  @editModal="changeModal"/>

    <div class="summary-container fixed bottom-0 left-0 w-full bg-white shadow-lg">
      <div class="rounded-[10px] p-drawer-footer flex justify-between items-center p-[18px] bg-[#F6F6F6]">
        <div class="text-[#141C30] font-semibold text-[19px] leading-[20px]">
          Автор: {{ userName.name }}
        </div>
        <div class="flex gap-[49px]" style="border-left: 1px dashed gray; padding-left: 20px">
          <div class="text-[22px] text-[#141C30] leading-[22px] font-semibold">
            <div class="text-[13px] text-[#808BA0] leading-[13px] font-semibold mb-[8px]">

            </div>
            Итого:
          </div>
          <div class="text-[22px] text-[#141C30] leading-[22px] font-semibold">
            <div class="text-[13px] text-[#808BA0] leading-[13px] font-semibold mb-[8px]">
              Кол-во
            </div>
            {{ formatNumber(infoGoods.getAllProduct) }}
          </div>
          <div class="text-[22px] text-[#141C30] leading-[22px] font-semibold">
            <div class="text-[13px] text-[#808BA0] leading-[13px] font-semibold mb-[8px]">
              Товаров
            </div>
            {{ infoGoods.goods?.length }}
          </div>
          <div class="text-[22px] text-[#141C30] leading-[22px] font-semibold">
            <div class="text-[13px] text-[#808BA0] leading-[13px] font-semibold mb-[8px]">
              Сумма
            </div>
            {{ formatNumber(infoGoods.getAllSum) }}
          </div>
        </div>
      </div>
    </div>
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
  <Dialog
      v-model:visible="openInfoModal"
      :style="{ width: '424px' }"
      :modal="true"
  >
    <div class="font-semibold text-[20px] leading-6 text-center w-[80%] m-auto text-[#141C30]">
      Хотите сохранить измения?
    </div>
    <template #footer>
      <fin-button label="Подтвердить" class="w-full" :loading="loaderSave" severity="success" icon="pi pi-check"
                  @click="saveFnDialog"/>
      <fin-button
          label="Отменить"
          icon="pi pi-times"
          class="w-full"
          severity="warning"
          @click="emit('close-sidebar')"
      />
    </template>
  </Dialog>
</template>

<style lang="scss">
.p-dialog-close-button {
  position: absolute !important;
  right: 0;
}

.rounded-close-btn {
  border-radius: 8px 0 0 8px;
  position: absolute;
  left: -15px;
  z-index: 3333;
}

.view-doc {
  .p-select-option .p-focus {
    background-color: #3935E7 !important;
    color: white !important;
  }

  .p-select-open {
    border-color: #3935E7 !important;
  }

  .p-select-option:hover {
    background-color: #ededed !important;
  }

  .p-inputwrapper-focus {
    border-color: #3935E7 !important;
  }

  .p-datepicker-input {
    border: 0;
  }

  .p-select:hover {
    border-color: #3935E7 !important;
  }
}

.icon-history {
  margin-left: 780px !important;
  background-color: white !important;
  color: #3935E7 !important;
  border: 1px solid #DCDFE3 !important;
  width: 160px !important;
  height: 31px !important;
}

.icon-print {
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

  .btn-movement:hover {
    color: #3935E7 !important;
  }

  .btn-approve:hover {
    color: #17A825 !important;
    border-color: #17A825 !important;
    font-weight: bold !important;
    background-color: #fff !important;
  }

  .btn-approve .p-button-label {
    font-weight: 600;
  }

  .btn-un-approve .p-button-label {
    font-weight: 600;
  }

  .btn-un-approve {
    color: #C1790C !important;
    border-color: #C1790C !important;
    font-weight: bold !important;
    background-color: #fff !important;
  }

  .active-approve {
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
