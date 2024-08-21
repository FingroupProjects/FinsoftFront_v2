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

const emit = defineEmits(["closeDialog", 'close-sidebar']);

const toast = useToast();

const {
  findCashRegister,
  cashRegisterList,
  loadingCash,
  findOrganization,
  organization,
  loadingOrganization,
  employeeList,
  loadingEmployee,
  findEmployee,
} = useStaticApi();

const initialValue = ref(null);
const isModal = ref(false);

const financeDate = reactive({
  datetime24h: new Date,
  cashRegisterId: "",
  balanceArticleId: "",
  comments: "",
  selectedOrganization: "",

  sum: '',
  base: '',
  getUser: ''
});
const rules = reactive({
  datetime24h: {required},
  cashRegisterId: {required},
  selectedOrganization: {required},
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
      const res = await useAxios(`/cash-store/other-incomes`, {
        method: "POST",
        data: {
          date: moment(financeDate.datetime24h).format("YYYY-MM-DD HH:mm:ss"),
          organization_id: financeDate.selectedOrganization.code,
          cash_register_id: financeDate.cashRegisterId.code,
          operation_type_id: '1',
          balance_article_id: financeDate.balanceArticleId.code,
          sum: financeDate.sum,
          basis: financeDate.base,
          type: 'PKO',
          sender: financeDate.getUser,
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
    isModal.value = true;
  }
  initialValue.value = newVal;
}, {deep: true});

watchEffect(() => {
  if (hasOrganization === true) financeDate.selectedOrganization = {
    name: organizationHas.name,
    code: organizationHas.id
  }
});
</script>

<template>
  <div class="form grid grid-cols-12 gap-[16px] col-span-8 ">
    <FloatLabel class="col-span-6">
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
          v-model="financeDate.balanceArticleId"
          :class="{ 'p-invalid': v$.balanceArticleId.$error }"
          @click="findEmployee"
          :loading="loadingEmployee"
          :options="employeeList"
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
          <InputText v-model="financeDate.sum" :model-value="formatInputAmount(financeDate.sum)" type="text"
                     size="large" class="w-full" placeholder="Сумма"/>
        </div>

        <fin-button @click="saveFn" icon="pi pi-arrow-right" class="mt-[26px] w-full" icon-pos="left" severity="success"
                    label="Провести операцию"/>
      </div>
    </div>
  </div>
</template>
