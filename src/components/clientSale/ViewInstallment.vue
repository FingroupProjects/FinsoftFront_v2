<script setup>
import { ref, reactive, onMounted, watch, watchEffect, computed } from 'vue';
import FloatLabel from "primevue/floatlabel";
import Select from "primevue/select";
import DatePicker from "primevue/datepicker";
import { useAxios } from "@/composable/useAxios.js";
import { required } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";

const props = defineProps({
  product: ''
});
const emit = defineEmits(["sendData"]);

const maxSum = ref()
const baseBonusPayment = ref();
const monthlyPay = ref(0);
const loanTerm = [3, 6, 12];
const selectedTerm = ref(3);
const guarantor = ref();
const installmentData = ref()
const percents = ref({
  3: 10,
  6: 15,
  12: 20
});
const certificate = ref();
const dataInstallment = ref({
  guarantor_id: '',
  prepayment_sum: '',
  payment_from_bonus: 0,
  certificate_id: '',
  application_amount: '',
  monthly_payment: '',
  credit_term: '',
  denomination: 0,
  credit_sum: 0,
  data: {
    date: '',
    week_day: '',
    sum: 0
  }
});
const rules = reactive({
  guarantor_id: { required },
  prepayment_sum: { required },
  payment_from_bonus: { required },
  certificate_id: { required },
  application_amount: { required },
  monthly_payment: { required },
  credit_term: { required },
  denomination: { required },
  credit_sum: { required },
});

const weeks = reactive([
  { week_num: 1, week: 'Понедельник' },
  { week_num: 2, week: 'Вторник' },
  { week_num: 3, week: 'Среда' },
  { week_num: 4, week: 'Четверг' },
  { week_num: 5, week: 'Пятница' },
  { week_num: 6, week: 'Суббота' },
  { week_num: 7, week: 'Воскресенье' }
]);
const weekDays = ref(Array(selectedTerm.value).fill(null));
const dateValues = ref(Array(selectedTerm.value).fill(null));
const dataAmount = ref(Array(selectedTerm.value).fill(null));
const loanTermOptions = loanTerm.map(term => ({
  label: `${term}`,
  value: term
}));

const calculateInstallments = () => {
  if (selectedTerm.value) {
    const installmentAmount = dataInstallment.value.credit_sum / selectedTerm.value;
    if (installmentData !== undefined && installmentData.value) {
      installmentData.value.forEach((installmentDatum, index) => {
        if (index < selectedTerm.value) {
          installmentDatum.sum = installmentAmount.toFixed(2);
          monthlyPay.value = installmentDatum.sum
        }
      });
    }
  }
};

const v$ = useVuelidate(rules, dataInstallment.value);

const getGuarantor = async () => {
  const res = await useAxios(`/guarantor`);
  guarantor.value = res.result.data;
};

const getCertificate = async () => {
  const res = await useAxios(`/certificate`);
  certificate.value = res.result.data;

};

const formatDate = (date) => {
  if (!date) return null;
  if (Array.isArray(date)) {
    return date.map((d) => (d ? d.toISOString().slice(0, 10) : null));
  } else {
    return date.toISOString().slice(0, 10);
  }
};

const getInstallment = async () => {
  const product = await props.product;
  dataInstallment.value = {
    guarantor_id: product.guarantor?.id || '',
    prepayment_sum: product.prepayment_sum || '',
    payment_from_bonus: product.payment_from_bonus || '',
    certificate_id: product.certificate || '',
    application_amount: product.application_amount || '',
    monthly_payment: product.monthly_payment || '',
    credit_term: product.credit_term || '',
    denomination: product.denomination || '',
    credit_sum: product.credit_sum || '',
  };
  maxSum.value = product.credit_sum
  baseBonusPayment.value = parseFloat(product.credit_sum) || 0;
  selectedTerm.value = product.credit_term || 0;
  installmentData.value = product.installmentData
};

const sendData = () =>{
  dataInstallment.value.installmentData = installmentData.value;
  dataInstallment.value.credit_term = selectedTerm.value;
  if (monthlyPay.value !== 0){
    dataInstallment.value.monthly_payment = monthlyPay.value
  }
  console.log('send',dataInstallment.value)
  emit('send-data', dataInstallment.value);
  infoModalClose()
}


async function infoModalClose() {
  emit('close-sidebar');
}

const updateDateValues = (newVal) => {
  let baseDate = installmentData.value ? new Date(installmentData.value) : new Date();
  if (isNaN(baseDate)) {
    baseDate = new Date();
  }
  baseDate.setMonth(baseDate.getMonth() + 1);
  baseDate.setDate(baseDate.getDate() + 1);

  installmentData.value = Array.from({ length: newVal }, (_, i) => {
    const newDate = new Date(baseDate);
    newDate.setMonth(baseDate.getMonth() + i);
    if (newDate.getDay() === 0) {
      newDate.setDate(newDate.getDate() + 1);
    }
    if (isNaN(newDate)) {
      return null;
    }

    return {
      id: i + 1,
      date: newDate.toISOString().split('T')[0],
      weekDay: newDate.getDay(),
      sum: (Math.random() * 1000).toFixed(2),
    };

  }).filter(installment => installment !== null);
  calculateInstallments()
};

const validateInput = (field) => {
  const formatInput = (value) => {
    if (typeof value === 'string') {
      return value.replace(',', '.');
    }
    return value.toString();
  };
  let inputValue;
  if (field === 'payment_from_bonus') {
    inputValue = formatInput(dataInstallment.value.payment_from_bonus);
    inputValue = Number(inputValue);

    if (isNaN(inputValue)) {
      dataInstallment.value.payment_from_bonus = '';
      return;
    }
    inputValue = Math.min(inputValue, maxSum.value);
    dataInstallment.value.payment_from_bonus = inputValue.toFixed(2).replace(/(\.0+|(?<=[0-9])0+)$/, '');
  }
  if (field === 'denomination') {
    inputValue = formatInput(dataInstallment.value.denomination);
    inputValue = Number(inputValue);

    if (isNaN(inputValue)) {
      dataInstallment.value.denomination= '';
      return;
    }
    inputValue = Math.min(inputValue, dataInstallment.value.credit_sum);
    dataInstallment.value.denomination = inputValue.toFixed(2).replace(/(\.0+|(?<=[0-9])0+)$/, '');
  }
};

watchEffect(() => {
  dataInstallment.value.credit_sum = baseBonusPayment.value
      - dataInstallment.value.payment_from_bonus
      - dataInstallment.value.denomination;
});

watch(selectedTerm, () => {
  updateDateValues();
  console.log(dateValues.value)
}, { deep: true });

watch(selectedTerm, (newVal) => {
  updateDateValues(newVal);
});

onMounted(() => {
  getInstallment()
  getGuarantor();
  getCertificate();
});

</script>

<template>
  <div class="installment">
    <div class="header">
      <div>
        <div class="header-title">Рассрочка</div>
      </div>
      <div class="flex gap-[16px]">
        <fin-button
            @click="sendData"
            icon="pi pi-save"
            label="Сохранить"
            severity="success"
            class="p-button-lg"
        />
        <fin-button
            icon="pi pi-times"
            @click="infoModalClose"
            label="Отменить"
            severity="warning"
            class="p-button-lg"
        />

      </div>
    </div>
    <div class="flex grid-cols-4 gap-[16px] mt-[30px]">
      <fin-input
          v-model="dataInstallment.prepayment_sum"
          placeholder="Сумма передоплаты"
          class="w-full"
          type="number"
          :class="{ 'p-invalid': v$.prepayment_sum.$error }"
      />
      <FloatLabel class="w-full">
        <Select
            v-model="dataInstallment.guarantor_id"
            :options="guarantor"
            optionLabel="name"
            option-value="id"
            class="w-full"
            :class="{ 'p-invalid': v$.guarantor_id.$error }"
        />
        <label for="dd-city">Поручитель</label>
      </FloatLabel>
    </div>
    <div class="flex gap-[16px] mt-[30px]">
      <div class="w-1/2">
        <fin-input
            v-model="dataInstallment.payment_from_bonus"
            placeholder="Оплата от бонуса"
            class="w-full"
            type="number"
            :class="{ 'p-invalid': v$.payment_from_bonus.$error }"
            @input="validateInput('payment_from_bonus')"
        />
      </div>
      <div class="w-1/2 flex gap-[16px]">
        <FloatLabel class="w-1/2">
          <Select
              v-model="dataInstallment.certificate_id"
              :options="certificate"
              optionLabel="id"
              class="w-full"
              :class="{ 'p-invalid': v$.certificate_id.$error }"
          />
          <label for="dd-city">Сертификат</label>
        </FloatLabel>
        <div class="w-1/2">
          <fin-input
              placeholder="Номинал"
              class="w-full"
              v-model="dataInstallment.denomination"
              :disabled="!dataInstallment.certificate_id"
              :class="{ 'p-invalid': v$.certificate_id.$error }"
              type="number"
              @input="validateInput('denomination')"
          />
        </div>
      </div>
    </div>
    <div class="flex  mt-2">
      <div class="font-bold">Итого: {{ }}</div>
      <div class="font-bold text-green-700 ml-10">Итого бонус: {{ dataInstallment.credit_sum}}</div>
    </div>
    <div class="flex flex-col mt-8 border-[3px] rounded-2xl w-[770px] h-[580px] ml-5">
      <div class="header flex gap-4">
        <div class="header-title w-[210px] ml-8 mt-8 leading-8" style="line-height: 1.4 !important;">
          Срок кредитования и график погашения
        </div>
        <div class="mr-[300px] mt-8">
          <FloatLabel class="w-[200px]">
            <Select
                v-model="selectedTerm"
                :options="loanTermOptions"
                option-label="label"
                option-value="value"
                class="w-[150px]"
            />
            <label for="loan-term">Срок кредита</label>
          </FloatLabel>
        </div>
      </div>
      <div class="flex-grow mt-3 overflow-auto max-h-[450px]">
        <table class="w-full">
          <tbody>
          <tr
              v-for="(term, index) in installmentData"
              :key="term.id"
              class="flex justify-between w-full mt-1"
          >
            <td class="mx-4 mt-2 bg-gray-300 rounded-2xl w-[35px] h-[35px] text-blue-700 font-bold">
              <p v-if="index > 9" class="ml-[6px] pt-1">{{ index + 1 }}</p>
              <p v-if="index <= 9" class="ml-[10px] pt-1">{{ index + 1}}</p>
            </td>

            <td class="w-1/3 px-2 mb-6">
              <FloatLabel>
                <DatePicker
                    showIcon
                    v-model="term.date"
                    dateFormat="yy-mm-dd"
                    fluid
                    hideOnDateTimeSelect
                    iconDisplay="input"
                    class="w-full h-[45px] date-picker-rounded"
                />
                <label for="dd-city">Дата</label>
              </FloatLabel>
            </td>

            <td class="w-1/3 px-2">
              <FloatLabel>
                <Select
                    v-model="term.weekDay"
                    :options="weeks"
                    optionLabel="week"
                    option-value="week_num"
                    class="w-full h-[45px]"
                />
                <label for="dd-city">День недели</label>
              </FloatLabel>
            </td>

            <td class="w-1/3 px-2">
              <fin-input
                  v-model="term.sum"
                  placeholder="Сумма погашения"
                  class="w-full h-[45px]"
                  disabled
              />
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">

</style>
