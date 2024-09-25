<script setup>
import { ref, reactive, watch, onMounted, watchEffect } from 'vue';
import FloatLabel from "primevue/floatlabel";
import Select from "primevue/select";
import DatePicker from "primevue/datepicker";
import { useAxios } from "@/composable/useAxios.js";
import { required, helpers  } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import {useClientSale} from "@/store/clientSale.js";

const props = defineProps({
  allSum: 0,
  products: '',
  date: ''
});
const emit = defineEmits(["sendData"]);
const store = useClientSale()

const isSaved = ref(false)
const maxSum = ref()
const denomination = ref(0)
const baseBonusPayment = props.allSum;
const bonus_payment = ref(0);
const loanTerm = [3, 6, 12];
const selectedTerm = ref(0);
const guarantor = ref();
const percentForShow = ref(0);
const percents = ref({
  3: 10,
  6: 15,
  12: 20
});
const certificate = ref();
const dataInstallment = ref({
  guarantor_id: '',
  prepayment_sum: '',
  payment_from_bonus: '',
  certificate_id: '',
  application_amount: '',
  monthly_payment: '',
  credit_term: '',
  denomination: 0,
  credit_sum: 0,
});
const rules = reactive({
  prepayment_sum: { required },
  payment_from_bonus: {
    required },
  certificate_id: { required },
  application_amount: { required },
  monthly_payment: { required },
  credit_term: { required },
  credit_sum: { required },
  guarantor_id: {required}
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
const v$ = useVuelidate(rules, dataInstallment.value);

const getWeekNumber = (date) => {
  if (!date) return null;
  const weekDaysMap = {
    0: 7,
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6
  };
  return weekDaysMap[date.getDay()];
};

const updateWeekDays = () => {
  weekDays.value = dateValues.value.map(date => {
    const weekDay = getWeekNumber(date);
    return weekDay === 7 ? 1 : weekDay;
  });
};

const getGuarantor = async () => {
  const res = await useAxios(`/guarantor`);
  guarantor.value = res.result.data;
};

const getCertificate = async () => {
  try {
    const res = await useAxios('/certificate');
    certificate.value = res.result.data;
  } catch (error) {
    console.error('Error fetching certificates:', error);
  }
};

const formatDate = (date) => {
  if (!date) return null;
  if (Array.isArray(date)) {
    return date.map((d) => (d ? d.toISOString().slice(0, 10) : null));
  } else {
    return date.toISOString().slice(0, 10);
  }
};

const sendData = async () => {
    try {
      const installmentData = dateValues.value.map((date, index) => ({
        date: formatDate(date),
        sum: parseFloat(dataAmount.value[index]).toFixed(2),
        weekDay: weekDays.value[index]
      }));
      dataInstallment.value.installmentData = installmentData;
      dataInstallment.value.monthly_payment = parseFloat(dataAmount.value[0]);
      dataInstallment.value.credit_sum = parseFloat(bonus_payment.value);
      dataInstallment.value.application_amount = parseFloat(selectedTerm.value);
      dataInstallment.value.credit_term = selectedTerm.value;
      dataInstallment.value.denomination = denomination.value;
      const result = await v$.value.$validate();
      if (result){
        console.log('Send data', dataInstallment.value);
        emit('send-data', dataInstallment.value);
        store.installment = dataInstallment.value;
        console.log('get from store',store.installment);
        isSaved.value = true
        await infoModalClose();
      }
    } catch (error) {
      console.log(error);
    }
};

const updateDateValues = (newVal) => {
  const baseDate = new Date(props.date);
  baseDate.setMonth(baseDate.getMonth() + 1);
  if (baseDate.getDay() === 0) {
    baseDate.setDate(baseDate.getDate() + 1);
  }
  dateValues.value = Array.from({ length: newVal }, (_, i) => {
    const newDate = new Date(baseDate);
    newDate.setMonth(baseDate.getMonth() + i);
    if (newDate.getDay() === 0) {
      newDate.setDate(newDate.getDate() + 1);
    }
    return newDate;
  });
  calculateInstallments();
};

const infoModalClose = async () => {
  emit('close-sidebar');
};

const getMaxSum = () => {
  const percent = percents.value[selectedTerm.value];
  maxSum.value = props.allSum
  const sumPercent = (props.allSum * percent) / 100;
  if (isNaN(maxSum.value)) {
    maxSum.value = 0;
  }
  maxSum.value = Number(maxSum.value) + Number(sumPercent);
}

const calculateInstallments = () => {
  if (selectedTerm.value && bonus_payment.value) {
    const installmentAmount = bonus_payment.value / selectedTerm.value;
    dataAmount.value = Array(selectedTerm.value).fill(installmentAmount.toFixed(2));
  }else {
    dataAmount.value = Array(selectedTerm.value || 0).fill("0.00");
  }
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

  } else if (field === 'denomination') {
    inputValue = formatInput(denomination.value);
    if (isNaN(inputValue)) {
      denomination.value = '';
      return;
    }
    inputValue = Math.min(inputValue, dataInstallment.value.certificate_id?.sum, maxSum.value, bonus_payment.value);
    denomination.value = inputValue.toFixed(2).replace(/(\.0+|(?<=[0-9])0+)$/, '');
  }
};

  watchEffect(() => {
    bonus_payment.value = typeof baseBonusPayment === 'number' ? baseBonusPayment : 0;
    const keys = Object.keys(percents.value).map(Number);
    if (keys.includes(selectedTerm.value)) {
      const percent = percents.value[selectedTerm.value];
      if (typeof percent === 'number' && !isNaN(percent)) {
        const percentageAmount = (bonus_payment.value * percent) / 100;
        bonus_payment.value += percentageAmount;
        percentForShow.value = percent;
      }
    }
    const paymentFromBonus = Number(dataInstallment.value.payment_from_bonus);
    if (!isNaN(paymentFromBonus)) {
      bonus_payment.value -= paymentFromBonus;
    }

    const denominationValue = Number(denomination.value);

    if (!isNaN(denominationValue)) {
      bonus_payment.value -= denominationValue;
    }
    bonus_payment.value = Math.max(0, parseFloat(bonus_payment.value.toFixed(2)));
    calculateInstallments();
  });

watch(() => dataInstallment.value.certificate_id, (newId) => {
  if (newId.id) {
    console.log(newId)
    const selectedCertificate = certificate.value.find(cert => cert.id === newId.id);
    if (selectedCertificate) {
      let sum = parseFloat(selectedCertificate.sum);
      denomination.value = sum;
      if (denomination.value > bonus_payment.value) {
        denomination.value = bonus_payment.value;
      }
    } else {
      denomination.value = null;
    }
  } else {
    denomination.value = null;
  }
});


watch(selectedTerm, (newVal) => {
  weekDays.value = Array(newVal).fill(null);
  dataAmount.value = Array(newVal).fill(null);
  getMaxSum()
});

watch(dateValues, () => {
  updateWeekDays();
}, { deep: true });

watch(selectedTerm, (newVal) => {
  updateDateValues(newVal);
});

onMounted(() => {
  getGuarantor();
  getCertificate();
  calculateInstallments();
  updateDateValues(selectedTerm.value);

  const baseDate = new Date(props.date);
  dateValues.value = Array.from({ length: selectedTerm.value }, (_, i) => {
    const newDate = new Date(baseDate);
    newDate.setMonth(newDate.getMonth() + i);
    return newDate;
  });

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
            icon="pi pi-save"
            @click="sendData"
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
          :class="{'input-error': v$.prepayment_sum.$error}"
      />
      <FloatLabel class="w-full">
        <Select
            v-model="dataInstallment.guarantor_id"
            :options="guarantor"
            optionLabel="name"
            option-value="id"
            class="w-full"
            :class="{'input-error': v$.guarantor_id.$error}"
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
            :class="{'input-error': v$.payment_from_bonus.$error}"
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
              v-model="denomination"
              :disabled="!dataInstallment.certificate_id"
              type="number"
              @input="validateInput('denomination')"
          />
        </div>
      </div>
    </div>
    <div class="flex  mt-2">
      <div class="font-bold">Итого: {{ props.allSum}}</div>
      <div class="font-bold text-green-700 ml-10">Итого бонус: {{ bonus_payment }}</div>
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
          <tr v-for="(i, index) in selectedTerm" :key="index" class="flex justify-between w-full mt-1">
            <td class="mx-4 mt-2 bg-gray-300 rounded-2xl w-[35px] h-[35px] text-blue-700 font-bold">
              <p v-if="i > 9" class="ml-[6px] pt-1">{{ i }}</p>
              <p v-if="i <= 9" class="ml-[10px] pt-1">{{ i }}</p>
            </td>
            <td class="w-1/3 px-2 mb-6">
              <FloatLabel>
                  <DatePicker
                      showIcon
                      v-model="dateValues[index]"
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
                    v-model="weekDays[index]"
                    :options="weeks"
                    optionLabel="week"
                    option-value="week_num"
                    class="w-full h-[45px]"
                    disabled
                    style="background-color: #fff !important; color: black !important"
                />
                <label for="dd-city">День недели</label>
              </FloatLabel>
            </td>
            <td class="w-1/3 px-2">
              <fin-input
                  v-model="dataAmount[index]"
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
.datepicker-wrapper {
  margin-bottom: 1rem; /* Space between datepickers */
}


.input-error {
  border: 2px solid red;
}
</style>
