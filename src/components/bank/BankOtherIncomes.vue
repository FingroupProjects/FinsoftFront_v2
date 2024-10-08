<script setup>
import Dropdown from "primevue/dropdown";
import InputText from "primevue/inputtext";
import FloatLabel from "primevue/floatlabel";
import DatePicker from "primevue/datepicker";
import Textarea from "primevue/textarea";
import {onMounted, reactive, ref, watch, watchEffect} from "vue";
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
  findOrganization,
  organization,
  loadingOrganization,
  balanceList,
  loadingBalance,
  findBalance,
  findOrganizationBill,
  billList,
  loadingBill
} = useStaticApi();

const initialValue = ref(null);

const financeDate = reactive({
  datetime24h: new Date,
  balanceArticleId: "",
  comments: "",
  selectedOrganization: "",
  selectedOrganizationBill: "",

  sum: '',
  base: '',
  getUser: ''
});
const rules = reactive({
  datetime24h: {required},
  selectedOrganization: {required},
  selectedOrganizationBill: {required},
  balanceArticleId: {required},
  sum: {required},
  base: {required},
  getUser: {required},
});

const organizationJson = localStorage.getItem('organization');
const organizationHas = JSON.parse(organizationJson);
const hasOrganization = JSON.parse(localStorage.getItem('hasOneOrganization'));
const v$ = useVuelidate(rules, financeDate);

async function saveFn() {
  const result = await v$.value.$validate();
  if (result) {
    try {
      const res = await useAxios(`/checking-account/other-incomes`, {
        method: "POST",
        data: {
          date: moment(financeDate.datetime24h).format("YYYY-MM-DD HH:mm:ss"),
          organization_id: financeDate.selectedOrganization.code,
          cash_register_id: financeDate.cashRegisterId.code,
          operation_type_id: props.operationType,
          balance_article_id: financeDate.balanceArticleId.code,
          sum: financeDate.sum,
          basis: financeDate.base,
          type: props.type,
          sender: financeDate.getUser,
          comment:financeDate.comments,
          organization_bill_id: financeDate.selectedOrganizationBill.code
        },
      });
      toast.add({
        severity: "success",
        summary: "Success Message",
        detail: "Message Content",
        life: 3000,
      });
      emit("closeDialog", res.result);
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
  if (hasOrganization === true) financeDate.selectedOrganization = {
    name: organizationHas.name,
    code: organizationHas.id
  }
});
onMounted(async () => {
  try {
    await Promise.all([
      findOrganization(),
      findOrganizationBill(),
      findBalance()
    ]);
  } catch (error) {
    console.error('Error:', error);
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
    <FloatLabel class="col-span-6" >
      <Dropdown
          v-model="financeDate.selectedOrganizationBill"
          :options="billList"
          :class="{ 'p-invalid': v$.selectedOrganizationBill.$error }"
          :loading="loadingBill"
          optionLabel="name"
          class="w-full"
      />
      <label for="dd-city">Рас.Счет</label>
    </FloatLabel>
    <FloatLabel class="col-span-6" v-if="!hasOrganization">
      <Dropdown
          v-model="financeDate.selectedOrganization"
          :options="organization"
          :class="{ 'p-invalid': v$.selectedOrganization.$error }"
          :loading="loadingOrganization"
          optionLabel="name"
          class="w-full"
      />
      <label for="dd-city">Организация</label>
    </FloatLabel>
    <fin-input v-model="financeDate.getUser" class="col-span-6" :error="v$.getUser.$error" placeholder="Вноситель"/>

    <FloatLabel class="col-span-6">
      <Dropdown
          v-model="financeDate.balanceArticleId"
          :class="{ 'p-invalid': v$.balanceArticleId.$error }"
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
      <fin-input v-model="financeDate.base" class="col-span-12" :error="v$.base.$error" placeholder="Основание"/>

      <FloatLabel class="col-span-12 mt-[10px]">
        <Textarea v-model="financeDate.comments" class="w-full" style="min-height: 20px" rows="2" cols="20"/>
        <label for="dd-city">Комментарий</label>
      </FloatLabel>
      <div class="col-span-12 p-[26px] bg-[#ECF1FB] mt-[26px] rounded-[10px]">
        <div class="w-full input-finance-sum">
          <InputText v-model="financeDate.sum" :model-value="formatInputAmount(financeDate.sum)" type="text"
                     size="large" class="w-full" placeholder="Сумма"/>
        </div>

        <fin-button @click="saveFn" class="mt-[26px] w-full" icon-pos="left" severity="success"
                    label="Сохранить"/>
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
