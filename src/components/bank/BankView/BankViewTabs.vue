<script setup>
import Dropdown from "primevue/dropdown";
import InputText from "primevue/inputtext";
import FloatLabel from "primevue/floatlabel";
import DatePicker from "primevue/datepicker";
import Textarea from "primevue/textarea";
import {ref, watch, watchEffect, onMounted} from "vue";
import {useStaticApi} from "@/composable/useStaticApi.js";
import {useAxios} from "@/composable/useAxios.js";
import {useToast} from "primevue/usetoast";
import moment from "moment/moment.js";
import formatInputAmount from "@/constants/formatInput.js";
import Dialog from "primevue/dialog";
import Select from "primevue/dropdown";
import Sidebar from "primevue/sidebar";
import FinanceHistory from "@/components/HistoryPurchase.vue";

const emit = defineEmits(["closeDialog", 'close-sidebar']);
const props = defineProps({
  operationTypeId: '',
  type: '',
  allDate: Object,
  operationList: {
    type: Array
  }
})

const toast = useToast();

const {
  findCashRegister,
  cashRegisterList,
  loadingCash,
  findOrganization,
  organization,
  findCounterparty,
  counterparty,
  loadingCounterparty,
  loadingOrganization,
  findOrganizationBill,
  billList,
  loadingBill,
  employeeList,
  loadingEmployee,
  findEmployee,
  balanceList,
  loadingBalance,
  findBalance,
} = useStaticApi();
const visibleHistory = ref(false);
const agreementList = ref([]);
const loadingAgreement = ref(false);
const initialValue = ref(null);
const approved = ref(false);
const status = ref('Не проведен');
const visibleMovement = ref(false);
const changeValue = ref(false);
const openInfoModal = ref(false);
const activeTabIndex = ref(0);
const urlsView = ref('/checking-account/client-payment/');
const selectAgreement = ref('')
const item = ref([]);
const financeDate = ref({
  datetime24h: null,
  cashRegisterId: "",
  selectedAgreement: "",
  comments: "",
  selectedOrganization: "",
  selectedCounterparty: "",
  sum: '',
  base: '',
  getUser: '',
  docNumber: '',
  operationType: '',
  organizationBillId: '',
  senderCashRegisterId: '',
  employeeId: '',
  balanceArticleId: '',
  organizationBill: ''
});

const organizationJson = localStorage.getItem('organization');
const organizationHas = JSON.parse(organizationJson);
const hasOrganization = JSON.parse(localStorage.getItem('hasOneOrganization'));

async function getAgreement() {
  if (financeDate.value.operationType?.id === 1 ||
      financeDate.value.operationType?.id === 4 ||
      financeDate.value.operationType?.id === 5 ||
      financeDate.value.operationType?.id === 6) {
    try {
      loadingAgreement.value = true;
      const res = await useAxios(
          `/cpAgreement/getAgreementByCounterpartyId/${financeDate.value.selectedCounterparty?.code || financeDate.value.selectedCounterparty?.id}`
      );
      agreementList.value = res.result.data.map((el) => {
        return {
          name: el.name,
          code: el.id,
        };
      })
      selectAgreement.value = agreementList.value[0]

    } catch (e) {
      console.log(e);
    } finally {
      loadingAgreement.value = false;
      openInfoModal.value = false
      changeValue.value = false
    }
  }

}

async function saveFn() {
  if (financeDate.value.operationType?.id === 2) urlsView.value = '/checking-account/withdrawal/'
  if (financeDate.value.operationType?.id === 3) urlsView.value = '/checking-account/another-cash-register/'
  if (financeDate.value.operationType?.id === 4) urlsView.value = '/checking-account/investment/'
  if (financeDate.value.operationType?.id === 5) urlsView.value = '/checking-account/credit-receive/'
  if (financeDate.value.operationType?.id === 6) urlsView.value = '/checking-account/provider-refund/'
  if (financeDate.value.operationType?.id === 7) urlsView.value = '/checking-account/other-expenses/'
  if (financeDate.value.operationType?.id === 8) urlsView.value = '/checking-account/other-incomes/'
  openInfoModal.value = false
  changeValue.value = false

  try {
    const res = await useAxios(`${urlsView.value}${props.operationTypeId}`, {
      method: "PATCH",
      data: {
        date: moment(financeDate.value.datetime24h).format("YYYY-MM-DD HH:mm:ss"),
        organization_id: financeDate.value.selectedOrganization?.code || financeDate.value.selectedOrganization?.id,
        counterparty_id: financeDate.value.selectedCounterparty?.code || financeDate.value.selectedCounterparty?.id,
        counterparty_agreement_id: selectAgreement.value?.code,
        cash_register_id: financeDate.value.cashRegisterId?.code || financeDate.value.cashRegisterId?.id,
        operation_type_id: financeDate.value.operationType?.id,
        sum: financeDate.value.sum,
        basis: financeDate.value.base,
        type: financeDate.value.operationType?.type || 'PKO',
        sender: financeDate.value.getUser,
        organization_bill_id: financeDate.value.organizationBillId?.code || financeDate.value.organizationBillId?.id,
        senderCashRegister: financeDate.value.senderCashRegisterId?.code || financeDate.value.senderCashRegisterId?.id,
        employee: financeDate.value.employeeId?.code || financeDate.value.employeeId?.id,
        balance_article: financeDate.value.balanceArticleId?.code || financeDate.value.balanceArticleId,
      },
    });

    toast.add({
      severity: "success",
      summary: "Success Message",
      detail: "Message Content",
      life: 3000,
    });
  } catch (e) {
    console.log(e);
    toast.add({
      severity: "error",
      summary: "Error Message",
      detail: e.response.data.message,
      life: 3000,
    });
  }
}


const approve = async () => {
  try {
    //await saveFn()
    const res = await useAxios(`/checking-account/approve`, {
      method: 'POST',
      data: {
        ids: [`${props.operationTypeId}`]
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
    //await saveFn()
    const res = await useAxios(`/checking-account/unApprove`, {
      method: 'POST',
      data: {
        ids: [`${props.operationTypeId}`]
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
const getView = async () => {

  const item = props.allDate;

  financeDate.value = {
    datetime24h: new Date(item.date),
    selectedOrganization: item.organization,
    getUser: item.sender_text,
    selectedCounterparty: item.counterparty,

    sum: item.sum,
    cashRegisterId: item.cashRegister,
    base: item.basis,
    comments: item.comment,
    docNumber: item.doc_number,
    operationType: item.operationType,
    organizationBillId: item?.organizationBill,
    employeeId: item.employee,
    balanceArticleId: item.balance_article
  };
  await getAgreement()
};

getView()

const openTab = (index) => {
  activeTabIndex.value = index;
};

const openDocumentPrint = (productId) => {
  const url = `/finance/${productId}`;
  window.open(url, '_blank');
};

function infoModalClose() {
  if (changeValue.value) openInfoModal.value = true
  else emit('close-sidebar')
}

watchEffect(() => {
  if (
      financeDate.value.selectedCounterparty &&
      financeDate.value.selectedCounterparty.agreement &&
      financeDate.value.selectedCounterparty.agreement.length > 0
  ) {
    selectAgreement.value = {
      name: financeDate.value.selectedCounterparty.agreement[0].name,
      code: financeDate.value.selectedCounterparty.agreement[0].id,
    };
  } else {
    selectAgreement.value = null;
  }
  if (hasOrganization === true) financeDate.value.selectedOrganization = {
    name: organizationHas.name,
    code: organizationHas.id
  }
});

watch(financeDate, (newVal) => {
  if (initialValue.value !== null) {
    changeValue.value = true;
  }
  initialValue.value = newVal;
}, {deep: true});
</script>

<template>
  <button class="w-[24px] h-[30px] bg-[#fff] rounded-close-btn" @click="infoModalClose"><i
      class="pi pi-times text-[#808BA0]"></i></button>
  <div class="header">
    <div class="flex gap-[16px] pt-2">
      <div>
        <div class="header-title">{{ financeDate.operationType?.name }}</div>
        <div class="header-text text-[#808BA0] font-semibold mt-1.5 text-[12px]">№{{ financeDate.docNumber }}</div>
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

    </div>
    <div class="flex gap-[16px] pt-2">
      <fin-button @click="visibleHistory = true" class="icon-histories" severity="success">
        <i class="pi pi-history mb-[1px] "></i>
        <span class="mt-0.5" style="font-weight: bold; margin-bottom: 3px; font-size: 15px;">История</span>
      </fin-button>

      <fin-button class="icon-print" severity="success" @click="openDocumentPrint(operationTypeId)">
        <i class="pi pi-print mb-[1px ]"></i>
        <span class="mt-0.5" style="font-weight: bold; margin-bottom: 3px;font-size: 15px;">Печать</span>
      </fin-button>

      <fin-button @click="visibleMovement = true" severity="warning"
                  class="p-button-lg flex gap-2">
        <img src="@/assets/img/img.png" alt="" class="w-[20px] mr-2"/>
        Движение
      </fin-button>
    </div>
  </div>
  <div class="form grid grid-cols-12 gap-[16px] mt-[20px]">
    <div class="sidebar-finance col-span-4 border-r">
      <div
          class="font-semibold text-[16px] text-[#808BA0] leading-[16px] p-[13px] cursor-pointer"
          v-for="(items, index) in props.operationList"
          :key="index"
          :class="{ 'active-tab': financeDate.operationType?.id === items.code }"
          @click="openTab(index)"
      >
        {{ items.name }}
      </div>
    </div>
    <div class="grid grid-cols-12 gap-[16px] col-span-8">
      <FloatLabel class="col-span-6 datePicker">
        <DatePicker
            showIcon
            v-model="financeDate.datetime24h"
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
      <FloatLabel class="col-span-6" >
        <Dropdown
            v-model="financeDate.organizationBillId"
            :options="billList"
            :loading="loadingBill"
            optionLabel="name"
            class="w-full"
        >
          <template #value>
            {{ financeDate.organizationBillId?.name }}
          </template>
        </Dropdown>
        <label for="dd-city">Рас.Счет</label>
      </FloatLabel>
      <FloatLabel class="col-span-6" v-if="!hasOrganization">
        <Dropdown
            v-model="financeDate.selectedOrganization"
            :options="organization"
            @click="findOrganization"
            :loading="loadingOrganization"
            optionLabel="name"
            class="w-full"
        >
          <template #value>
            {{ financeDate.selectedOrganization?.name }}
          </template>
        </Dropdown>
        <label for="dd-city">Организация</label>
      </FloatLabel>

      <FloatLabel class="col-span-6" v-if="financeDate.operationType?.id === 1 ||
                                           financeDate.operationType?.id === 4 ||
                                           financeDate.operationType?.id === 5 ||
                                           financeDate.operationType?.id === 6">
        <Dropdown
            v-model="financeDate.selectedCounterparty"
            @click="findCounterparty"
            :loading="loadingCounterparty"
            :options="counterparty"
            optionLabel="name"
            class="w-full"
        >
          <template #value>
            {{ financeDate.selectedCounterparty?.name }}
          </template>
        </Dropdown>
        <label for="dd-city">Контрагент</label>
      </FloatLabel>

      <FloatLabel class="col-span-12" v-if="financeDate.operationType?.id === 1 ||
                                           financeDate.operationType?.id === 4 ||
                                           financeDate.operationType?.id === 5 ||
                                           financeDate.operationType?.id === 6">
        <Dropdown
            v-model="selectAgreement"

            :loading="loadingAgreement"
            :options="agreementList"
            optionLabel="name"
            class="w-full"
        >
          <template #value>
            {{ selectAgreement?.name }}
          </template>
        </Dropdown>
        <label for="dd-city">Договор</label>
      </FloatLabel>
      <FloatLabel class="col-span-6" v-if="financeDate.operationType?.id === 2">
        <Dropdown
            v-model="financeDate.organizationBillId"
            @click="findOrganizationBill"
            :loading="loadingBill"
            :options="billList"
            optionLabel="name"
            class="w-full"
        >
          <template #value>
            {{ financeDate.organizationBillId?.name }}
          </template>
        </Dropdown>
        <label for="dd-city">Банковский счет</label>
      </FloatLabel>
      <FloatLabel class="col-span-6" v-if="financeDate.operationType?.id === 3">
        <Dropdown
            v-model="financeDate.senderCashRegisterId"
            @click="findCashRegister"
            :loading="loadingCash"
            :options="cashRegisterList"
            optionLabel="name"
            class="w-full"
        >
          <template #value>
            {{ financeDate.senderCashRegisterId?.name }}
          </template>
        </Dropdown>
        <label for="dd-city">Касса отправителя</label>
      </FloatLabel>
      <FloatLabel class="col-span-6" v-if="financeDate.operationType?.id === 7">
        <Dropdown
            v-model="financeDate.employeeId"
            @click="findEmployee"
            :loading="loadingEmployee"
            :options="employeeList"
            optionLabel="name"
            class="w-full"
        >
          <template #value>
            {{ financeDate.employeeId?.name }}
          </template>
        </Dropdown>
        <label for="dd-city">Сотрудник</label>
      </FloatLabel>
      <FloatLabel class="col-span-6" v-if="financeDate.operationType?.id === 8">
        <Dropdown
            v-model="financeDate.balanceArticleId"
            @click="findBalance"
            :loading="loadingBalance"
            :options="balanceList"
            optionLabel="name"
            class="w-full"
        >
          <template #value>
            {{ financeDate.balanceArticleId?.name }}
          </template>
        </Dropdown>
        <label for="dd-city">Статья дохода</label>
      </FloatLabel>

      <FloatLabel class="col-span-6" v-if="financeDate.operationType?.id === 9">
        <Dropdown
            v-model="financeDate.balanceArticleId"
            @click="findBalance"
            :loading="loadingBalance"
            :options="balanceList"
            optionLabel="name"
            class="w-full"
        >
          <template #value>
            {{ financeDate.balanceArticleId?.name }}
          </template>
        </Dropdown>
        <label for="dd-city">Статья баланса</label>
      </FloatLabel>
      <div class="col-span-12 grid grid-cols-12 gap-[16px] border border-dashed p-[10px] rounded-[10px]">
        <fin-input v-model="financeDate.base" class="col-span-12" placeholder="Основание"/>

        <FloatLabel class="col-span-12 mt-[10px]">
          <Textarea v-model="financeDate.comments" class="w-full" style="min-height: 20px" rows="2" cols="20"/>
          <label for="dd-city">Комментарий</label>
        </FloatLabel>
        <div class="col-span-12 p-[26px] bg-[#ECF1FB] mt-[26px] rounded-[10px]">
          <div class="w-full input-finance-sum">
            <InputText v-model="financeDate.sum" :model-value="formatInputAmount(financeDate.sum)" type="text"
                       size="large" class="w-full" placeholder="Сумма"/>
          </div>

          <fin-button @click="saveFn" class="mt-[26px] w-full" icon-pos="left"
                      severity="success"
                      label="Сохранить"/>
        </div>
      </div>
    </div>

  </div>

  <Sidebar
      v-model:visible="visibleHistory"
      :show-close-icon="false"
      position="right"
      class="drower-movement"
  >
    <finance-history :productId="props.operationTypeId"/>
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
      <fin-button label="Подтвердить" class="w-full" severity="success" icon="pi pi-check" @click="saveFn"/>
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
<style scoped lang="scss">
.active-tab {
  background: #ECF1FB;
  color: #3935E7 !important;
  border-right: 2px solid #3935E7;
  border-bottom-left-radius: 10px;
  border-top-left-radius: 10px;
}
</style>
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

.p-select.p-disabled {
  background: white !important;
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

.icon-histories {
  background-color: white !important;
  color: #3935E7 !important;
  border: 1px solid #DCDFE3 !important;
  width: 100px !important;
  height: 46px !important;
}

.icon-print {
  background-color: white !important;
  color: #3935E7 !important;
  border: 1px solid #DCDFE3 !important;
  width: 100px !important;
  height: 46px !important;
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