<script setup>
import Dropdown from "primevue/dropdown";
import InputText from "primevue/inputtext";
import FloatLabel from "primevue/floatlabel";
import DatePicker from "primevue/datepicker";
import Textarea from "primevue/textarea";
import { ref, watch, watchEffect} from "vue";
import {useStaticApi} from "@/composable/useStaticApi.js";
import {useAxios} from "@/composable/useAxios.js";

import {useToast} from "primevue/usetoast";
import moment from "moment/moment.js";
import formatInputAmount from "@/constants/formatInput.js";
import Dialog from "primevue/dialog";
import {useFinanceStore} from "@/store/finance.js";
import Select from "primevue/dropdown";

const store = useFinanceStore()
const emit = defineEmits(["closeDialog", 'close-sidebar']);
const props = defineProps({
  operationTypeId: '',
  type: ''
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

const agreementList = ref([]);
const loadingAgreement = ref(false);
const initialValue = ref(null);
const approved = ref(false);
const status = ref('Не проведен');
const visibleMovement = ref(false);
const urlsView = ref('/cash-store/client-payment/')

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
  organizationBillId:'',
  senderCashRegisterId:'',
  employeeId:'',
  balanceArticleId:''
});

const organizationJson = localStorage.getItem('organization');
const organizationHas = JSON.parse(organizationJson);
const hasOrganization = JSON.parse(localStorage.getItem('hasOneOrganization'));

async function getAgreement() {
  try {
    loadingAgreement.value = true;
    const res = await useAxios(
        `/cpAgreement/getAgreementByCounterpartyId/${financeDate.value.selectedCounterparty.code}`
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
  if (financeDate.value.operationType?.id === 2) urlsView.value ='/cash-store/withdrawal/'
  if (financeDate.value.operationType?.id === 3) urlsView.value ='/cash-store/another-cash-register/'
  if (financeDate.value.operationType?.id === 4) urlsView.value ='/cash-store/investment/'
  if (financeDate.value.operationType?.id === 5) urlsView.value ='/cash-store/credit-receive/'
  if (financeDate.value.operationType?.id === 6) urlsView.value ='/cash-store/provider-refund/'
  if (financeDate.value.operationType?.id === 7) urlsView.value ='/cash-store/other-expenses/'
  if (financeDate.value.operationType?.id === 8) urlsView.value ='/cash-store/other-incomes/'

  try {
    const res = await useAxios(`${urlsView}${props.operationTypeId}`, {
      method: "PATCH",
      data: {
        date: moment(financeDate.value.datetime24h).format("YYYY-MM-DD HH:mm:ss"),
        organization_id: financeDate.value.selectedOrganization.code ||financeDate.value.selectedOrganization.id,
        counterparty_id: financeDate.value.selectedCounterparty.code || financeDate.value.selectedCounterparty.id,
        counterparty_agreement_id: financeDate.value.selectedAgreement.code,
        cash_register_id: financeDate.value.cashRegisterId.code ||financeDate.value.cashRegisterId.id,
        operation_type_id: financeDate.value.operationType?.id,
        sum: financeDate.value.sum,
        basis: financeDate.value.base,
        type: financeDate.value.operationType?.type || 'PKO',
        sender: financeDate.value.getUser,

        organizationBill:financeDate.value.organizationBillId.code || financeDate.value.organizationBillId.id,
        senderCashRegister:financeDate.value.senderCashRegisterId.code ||financeDate.value.senderCashRegisterId.id,
        employee:financeDate.value.employeeId.code || financeDate.value.employeeId.id,
        balance_article:financeDate.value.balanceArticleId.code || financeDate.value.balanceArticleId,
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
    const res = await useAxios(`/cash-store/approve`, {
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
    const res = await useAxios(`/cash-store/unApprove`, {
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
const getView = async () => {
  try {
    const res = await useAxios(`/cash-store/show/${props.operationTypeId}`)
    const item = res.result;

    financeDate.value = {
      datetime24h: new Date(item.date),
      selectedOrganization: item.organization,
      getUser: item.sender,
      selectedCounterparty: item.counterparty,
      selectedAgreement: item.counterpartyAgreement,
      sum: item.sum,
      cashRegisterId: item.cashRegister,
      base: item.basis,
      comments: item.comment,
      docNumber: item.doc_number,
      operationType: item.operationType,
      organizationBillId:item?.organizationBill,
      employeeId:item.employee,
      balanceArticleId:item.balance_article
    };

  } catch (e) {
    console.error('Error fetching data:', e);
  }
};
getView()
watch(financeDate, (newVal) => {
  if (initialValue.value !== null) {
    store.isModal = true;
  }
  initialValue.value = newVal;
}, {deep: true});

watchEffect(() => {
  if (
      financeDate.value.selectedCounterparty &&
      financeDate.value.selectedCounterparty.agreement &&
      financeDate.value.selectedCounterparty.agreement.length > 0
  ) {
    financeDate.value.selectedAgreement = {
      name: financeDate.value.selectedCounterparty.agreement[0].name,
      code: financeDate.value.selectedCounterparty.agreement[0].id,
    };
  } else {
    financeDate.value.selectedAgreement = null;
  }
  if (hasOrganization === true) financeDate.value.selectedOrganization = {
    name: organizationHas.name,
    code: organizationHas.id
  }
});
</script>

<template>
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
      <fin-button
          icon="pi pi-times"
          label="Отменить"
          severity="warning"
          class="p-button-lg"
          @click="emit('close-sidebar')"
      />
      <fin-button @click="visibleMovement = true" icon="pi pi-arrow-right-arrow-left" severity="warning"
                  class="p-button-lg btn-movement w-[158px]">
        <img src="@/assets/img/img.png" alt="" class="w-[20px]"/>
        Движение
      </fin-button>
    </div>
  </div>
  <div class="form grid grid-cols-12 gap-[16px] mt-[20px]">
    <FloatLabel class="col-span-6">
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
    <fin-input v-model="financeDate.getUser" class="col-span-6" placeholder="Получатель"/>

    <FloatLabel class="col-span-6" v-if="financeDate.operationType.id === 1 || 4 || 5 || 6">
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

    <FloatLabel class="col-span-12" v-if="financeDate.operationType.id === 1 || 4 || 5 || 6">
      <Dropdown
          v-model="financeDate.selectedAgreement"
          @click="getAgreement"
          :loading="loadingAgreement"
          :options="agreementList"
          optionLabel="name"
          class="w-full"
      >
        <template #value>{{ financeDate.selectedAgreement?.name }}</template>
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
      <fin-input v-model="financeDate.base" class="col-span-6" placeholder="Основание"/>
      <FloatLabel class="col-span-6">
        <Dropdown
            v-model="financeDate.cashRegisterId"
            @click="findCashRegister"
            :loading="loadingCash"
            :options="cashRegisterList"
            optionLabel="name"
            class="w-full"
        >
          <template #value>
            {{ financeDate.cashRegisterId?.name }}
          </template>
        </Dropdown>
        <label for="dd-city">Касса</label>
      </FloatLabel>
      <FloatLabel class="col-span-12 mt-[10px]">
        <Textarea v-model="financeDate.comments" class="w-full" style="min-height: 20px" rows="2" cols="20"/>
        <label for="dd-city">Комментарий</label>
      </FloatLabel>
      <div class="col-span-12 p-[26px] bg-[#ECF1FB] mt-[26px] rounded-[10px]">
        <div class="w-full input-finance-sum">
          <InputText v-model="financeDate.sum" :model-value="formatInputAmount(financeDate.sum)" type="text"
                     size="large" class="w-full" placeholder="Сумма"/>
        </div>

        <fin-button @click="saveFn" icon="pi pi-arrow-right" class="mt-[26px] w-full" icon-pos="left" severity="success"
                    label="Провести операцию"/>
      </div>
    </div>
  </div>
  <Dialog
      v-model:visible="store.openInfoModal"
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

<style lang="scss">
.input-finance-sum {
  .p-inputtext {
    border-radius: 10px !important;
    border-color: transparent !important;
  }
}

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