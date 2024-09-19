<script setup>
import FloatLabel from "primevue/floatlabel";
import Select from "primevue/select";
import { ref, reactive, watch, onMounted, watchEffect } from 'vue';
import DatePicker from "primevue/datepicker";
import { useAxios } from "@/composable/useAxios.js";
import {required} from "@vuelidate/validators";
import {useVuelidate} from "@vuelidate/core";

const props = defineProps({
  allSum: 0,
  products: ''
});
const emit = defineEmits(["sendData"]);

const bonus_payment =ref(0)
const loanTerm = [3, 6, 12];
const selectedTerm = ref(3);
const guarantor = ref();
const percentForShow = ref(0)
const percents = ref({
  3: 10,
  6: 15,
  12: 20
});
const certificate = ref();
const dataInstallment = reactive({
  guarantor_id: '',
  prepayment_sum: '',
  payment_from_bonus: '',
  certificate_id: '',
  application_amount: '',
  monthly_payment: '',
  credit_term: '',
  denomination: '',
  credit_sum: 0,
  data: {
    date: '',
    week_day: '',
    sum: 0
  }
});
const rules = reactive({
  guarantor_id: {required},
  prepayment_sum: {required},
  payment_from_bonus: {required},
  certificate_id: {required},
  application_amount: {required},
  monthly_payment: {required},
  credit_term: {required},
  denomination: {required},
  credit_sum: {required},
})
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
  label: `  ${term}`,
  value: term
}));

const v$ = useVuelidate(rules, dataInstallment)

const calculateInstallments = () => {
  if (selectedTerm.value && bonus_payment.value) {
    const installmentAmount = bonus_payment.value / selectedTerm.value;
    dataAmount.value = Array(selectedTerm.value).fill(installmentAmount.toFixed(2));
  }
};

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

const sendData = async () => {
  try {
    const installmentData = dateValues.value.map((date, index) => ({
      date: formatDate(date),
      sum: parseFloat(dataAmount.value).toFixed(2),
      weekDay: weekDays.value[index]
    }));

    dataInstallment.installmentData = installmentData;
    dataInstallment.monthly_payment = parseFloat(dataAmount.value);
    dataInstallment.credit_sum = bonus_payment.value;
    dataInstallment.application_amount = selectedTerm.value;
    dataInstallment.denomination = dataInstallment.certificate_id.sum;
    dataInstallment.credit_term = selectedTerm.value;

    console.log('Send data', dataInstallment);

    // Emit the data
    emit('send-data', dataInstallment);

    // Close the info modal
    await infoModalClose();
  } catch (error) {
    console.log(error);
  }
}

async function infoModalClose() {
  emit('close-sidebar')
}

onMounted(() => {
  getGuarantor();
  getCertificate();
  calculateInstallments();

  const baseDate = new Date(props.allSum[1]);
  dateValues.value = Array.from({ length: selectedTerm.value }, (_, i) => {
    const newDate = new Date(baseDate);
    newDate.setMonth(newDate.getMonth() + i);
    return newDate;
  });
});

watch(selectedTerm, (newVal) => {
  const baseDate = new Date(props.allSum[1]);
  if (baseDate.getDay() === 0) {
    baseDate.setDate(baseDate.getDate() + 1);
  }
  dateValues.value = Array.from({ length: newVal }, (_, i) => {
    const newDate = new Date(baseDate);
    newDate.setMonth(newDate.getMonth() + i);
    if (newDate.getDay() === 0) {
      newDate.setDate(newDate.getDate() + 1);
    }
    return newDate;
  });
  calculateInstallments();
});


watch(dateValues, () => {
  updateWeekDays();
}, { deep: true });
const baseBonusPayment = props.allSum[0];
watchEffect(() => {
  bonus_payment.value = baseBonusPayment;
  const keys = Object.keys(percents.value).map(Number);
  if (keys.includes(selectedTerm.value)) {
    const percent = percents.value[selectedTerm.value];
    const percentageAmount = (bonus_payment.value * percent) / 100;
    bonus_payment.value += percentageAmount;
    percentForShow.value = percent;
  }
  bonus_payment.value -= dataInstallment.payment_from_bonus;
  if (dataInstallment.certificate_id.sum) {
    bonus_payment.value -= dataInstallment.certificate_id.sum;
  }
  calculateInstallments();

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
            :class="{ 'p-invalid': v$.payment_from_bonus.$error }"
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
              v-model="dataInstallment.certificate_id.sum"
              :disabled="!dataInstallment.certificate_id"
              :class="{ 'p-invalid': v$.certificate_id.$error }"
          />
        </div>
      </div>
    </div>
    <div class="flex  mt-2">
      <div class="font-bold">Итого: {{ props.allSum[0]}}</div>
      <div class="font-bold text-green-700 ml-10">Итого бонус: {{ bonus_payment}}</div>
      <div class="font-bold text-green-700 ml-10">Процент: {{ percentForShow}}%</div>
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
              v-for="(i, index) in selectedTerm"
              :key="index"
              class="flex justify-between w-full mt-1"
          >
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

.p-invalid {
  border: 1px solid #f2376f !important;
}
</style>
