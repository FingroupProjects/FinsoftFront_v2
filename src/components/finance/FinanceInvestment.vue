<script setup>
import Dropdown from "primevue/dropdown";
import InputText from "primevue/inputtext";
import FloatLabel from "primevue/floatlabel";
import DatePicker from "primevue/datepicker";
import Textarea from "primevue/textarea";
import {reactive, ref, watch, watchEffect} from "vue";
import {useStaticApi} from "@/composable/useStaticApi.js";
import {useAxios} from "@/composable/useAxios.js";
import {useVuelidate} from "@vuelidate/core";
import {required} from "@vuelidate/validators";
import {useToast} from "primevue/usetoast";
import moment from "moment/moment.js";
import formatInputAmount from "@/constants/formatInput.js";
import Dialog from "primevue/dialog";
import {useFinanceStore} from "@/store/finance.js";

const store = useFinanceStore()

const emit = defineEmits(["closeDialog", 'close-sidebar']);
const props = defineProps({
  operationType:'',
  type:''
})

const toast = useToast();

const {
  findCurrency,
  currency,
  findCashRegister,
  cashRegisterList,
  loadingCash,
  findOrganization,
  organization,
  findCounterparty,
  counterparty,
  loadingCounterparty,
  loadingOrganization,
} = useStaticApi();

const agreementList = ref([]);
const loadingAgreement = ref(false);
const isCurrencyFetched = ref(false);
const initialValue = ref(null);

const financeDate = reactive({
  datetime24h: new Date,
  cashRegisterId: "",
  selectedAgreement: "",
  comments: "",
  selectedOrganization: "",
  selectedCounterparty: "",
  sum:'',
  base:'',
  getUser:''
});
const rules = reactive({
  datetime24h: {required},
  cashRegisterId: {required},
  selectedOrganization: {required},
  selectedCounterparty: {required},
  selectedAgreement: {required},
  sum: {required},
  base: {required},
  getUser: {required},
});

const organizationJson = localStorage.getItem('organization');
const organizationHas = JSON.parse(organizationJson);
const hasOrganization = JSON.parse(localStorage.getItem('hasOneOrganization'));
const v$ = useVuelidate(rules, financeDate);

async function getAgreement() {
  try {
    loadingAgreement.value = true;
    const res = await useAxios(
        `/cpAgreement/getAgreementByCounterpartyId/${financeDate.selectedCounterparty.code}`
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
      const res = await useAxios(`/cash-store/investment`, {
        method: "POST",
        data: {
          date: moment(financeDate.datetime24h).format("YYYY-MM-DD HH:mm:ss"),
          organization_id: financeDate.selectedOrganization.code,
          counterparty_id: financeDate.selectedCounterparty.code,
          counterparty_agreement_id: financeDate.selectedAgreement.code,
          cash_register_id: financeDate.cashRegisterId.code,
          operation_type_id:props.operationType,
          sum: financeDate.sum,
          basis:financeDate.base,
          type: props.type,
          sender: financeDate.getUser,
          comment:financeDate.comments
        },
      });
      toast.add({
        severity: "success",
        summary: "Success Message",
        detail: "Message Content",
        life: 3000,
      });
      emit("closeDialog", res.result.id);
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
}

watch(financeDate, (newVal) => {
  if (initialValue.value !== null) {
    store.isModal = true;
  }
  initialValue.value = newVal;
}, {deep: true});

watchEffect(() => {
  if (
      financeDate.selectedCounterparty &&
      financeDate.selectedCounterparty.agreement &&
      financeDate.selectedCounterparty.agreement.length > 0
  ) {
    financeDate.selectedAgreement = {
      name: financeDate.selectedCounterparty.agreement[0].name,
      code: financeDate.selectedCounterparty.agreement[0].id,
    };
  } else {
    financeDate.selectedAgreement = null;
  }
  if (hasOrganization === true) financeDate.selectedOrganization = {
    name: organizationHas.name,
    code: organizationHas.id
  }
});
watch(financeDate, (newValue) => {
  if (newValue.selectedAgreement && !isCurrencyFetched.value) {
    findCurrency(newValue.selectedAgreement).then(() => {
      financeDate.selectCurrency = currency.value[0];
    });
    isCurrencyFetched.value = true;
  }
});
</script>

<template>
  <div class="form grid grid-cols-12 gap-[16px] col-span-8 ">
    <FloatLabel class="col-span-6 datePicker">
      <DatePicker
          showIcon
          v-model="financeDate.datetime24h"
          :class="{ 'p-invalid': v$.datetime24h.$error }"
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
          :class="{ 'p-invalid': v$.selectedOrganization.$error }"
          @click="findOrganization"
          :loading="loadingOrganization"
          optionLabel="name"
          class="w-full"
      />
      <label for="dd-city">Организация</label>
    </FloatLabel>
    <fin-input v-model="financeDate.getUser" class="col-span-6" placeholder="Получатель"/>

    <FloatLabel class="col-span-6">
      <Dropdown
          v-model="financeDate.selectedCounterparty"
          :class="{ 'p-invalid': v$.selectedCounterparty.$error }"
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

    <FloatLabel class="col-span-12">
      <Dropdown
          v-model="financeDate.selectedAgreement"
          :class="{ 'p-invalid': v$.selectedAgreement.$error }"
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
    <div class="col-span-12 grid grid-cols-12 gap-[16px] border border-dashed p-[10px] rounded-[10px]">
      <fin-input v-model="financeDate.base" class="col-span-6" placeholder="Основание"/>
      <FloatLabel class="col-span-6">
        <Dropdown
            v-model="financeDate.cashRegisterId"
            :class="{ 'p-invalid': v$.cashRegisterId.$error }"
            @click="findCashRegister"
            :loading="loadingCash"
            :options="cashRegisterList"
            optionLabel="name"
            class="w-full"
        />
        <label for="dd-city">Касса</label>
      </FloatLabel>
      <FloatLabel class="col-span-12 mt-[10px]">
        <Textarea v-model="financeDate.comments" class="w-full" style="min-height: 20px" rows="2" cols="20"/>
        <label for="dd-city">Комментарий</label>
      </FloatLabel>
      <div class="col-span-12 p-[26px] bg-[#ECF1FB] mt-[26px] rounded-[10px]">
        <div class="w-full input-finance-sum">
          <InputText v-model="financeDate.sum" :model-value="formatInputAmount(financeDate.sum)" type="text" size="large" class="w-full" placeholder="Сумма"/>
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
</style>