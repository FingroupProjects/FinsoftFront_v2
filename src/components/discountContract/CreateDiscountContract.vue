<script setup>
import {ref, reactive, watch, watchEffect} from 'vue'
import DatePicker from "primevue/datepicker";
import FloatLabel from "primevue/floatlabel";
import Select from "primevue/select";
import ContractPercent from "@/components/discountContract/ContractPercent.vue";
import ContractQuantity from "@/components/discountContract/ContractQuantity.vue";
import {useAxios} from "@/composable/useAxios.js";
import {useToast} from "primevue/usetoast";
import {required} from "@vuelidate/validators";
import {useVuelidate} from "@vuelidate/core";

const emit = defineEmits(['close-sidebar', 'closeDialog']);
const toast = useToast();
const sale = [
  {id: 1, name:'Скидка в %'},
  {id: 2, name:'Скидка в количестве товаров'}
]

const rawDateFirst = ref();
const rawDateSecond = ref();
const selectedSale = ref(1)
const getAgreement = ref([])
const selectedValues = reactive({
  name:'',
  startDate: '',
  endDate:'',
  percent:'',
  description:'',
  type:''
})
const rules = reactive({
  name: { required },
  percent: { required },
  startDate: { required },
  endDate: { required },
  description: { required },
  type: { required },
});

const v$ = useVuelidate(rules, selectedValues);

function formatDateTime(date) {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

async function infoModalClose() {
  emit('close-sidebar')
}


const addFn = async () =>{
    selectedValues.type = selectedSale.value === 1 ? 'percent' : 'good';
    const agreements = selectedValues.type === 'good'
        ? getAgreement.value.map((item) => ({
          agreement_id: item.agreement_id,
          good_id: item.good_id,
          quantity: item.quantity,
        }))
        :getAgreement.value.map(agreement => ({
          agreement_id: agreement?.id
        }));
    const result = await v$.value.$validate();
      console.log(result)
    if (result){

      try {
        const res = await useAxios(`/sale/agreement`, {
          method: 'POST',
          data: {
            name: selectedValues.name,
            percent: selectedValues.percent,
            start_date: selectedValues.startDate,
            end_date: selectedValues.endDate,
            description: selectedValues.description,
            type: selectedValues.type,
            agreements: agreements
          }
        })
        toast.add({
          severity: 'success',
          summary: 'Success Message',
          detail: 'Message Content',
          life: 3000,
        });
        emit("closeDialog",res.result);
        console.log(res)
      }catch (e){
        toast.add({
          severity: 'error',
          summary: 'error Message',
          detail: 'Message Content',
          life: 3000,
        });
        console.log(e);
      }
    }
}

const limitPercent = (event) => {
  let value = event.target.value;
  value = value.replace(/\D/g, '');
  if (value.length > 3) {
    value = value.slice(0, 3);
  }
  if (parseInt(value) > 100) {
    value = '100';
  }
  selectedValues.percent = value;
};

const getAgreements = (value) =>{
  getAgreement.value = value
  console.log('get data', getAgreement.value)
}


watch(rawDateFirst, (newValue) => {
  selectedValues.startDate = newValue ? formatDateTime(newValue) : '';
});
watch(rawDateSecond, (newValue) => {
  selectedValues.endDate = newValue ? formatDateTime(newValue) : '';
});

watch(() => selectedValues.percent, (newValue) => {
  if (newValue > 100) {
    selectedValues.percent = 100;
  }
});


</script>

<template>
<div>
  <div class="header">
    <div>
      <div class="header-title">Установка скидки на договор</div>
      <div class="header-text text-[#808BA0] font-semibold text-[16px] pt-1">№32154</div>
    </div>
    <div class="flex gap-[16px]">
      <fin-button
          @click="addFn"
          icon="pi pi-save"
          label="Сохранить"
          severity="success"
          class="p-button-lg"
      />
      <fin-button
          @click="infoModalClose"
          icon="pi pi-times"
          label="Отменить"
          severity="warning"
          class="p-button-lg"
      />
    </div>
  </div>

  <div class="discount-contract mt-8">
    <div class="">
      <fin-input v-model="selectedValues.name" placeholder="Название скидки" :class="[{ 'p-invalid': v$.name.$error }]" />
    </div>
    <div class="create-discount flex mt-6 gap-4">
      <FloatLabel class="w-full">
        <DatePicker
            v-model="rawDateFirst"
            showIcon
            showTime
            hourFormat="24"
            dateFormat="dd.mm.yy,"
            fluid
            hideOnDateTimeSelect
            iconDisplay="input"
            class="w-full"
            :class="[{ 'p-invalid': v$.startDate.$error }]"
        />
        <label for="dd-city">Дата начало</label>
      </FloatLabel>
      <FloatLabel class="w-full">
        <DatePicker
            v-model="rawDateSecond"
            showIcon
            showTime
            hourFormat="24"
            dateFormat="dd.mm.yy,"
            fluid
            hideOnDateTimeSelect
            iconDisplay="input"
            class="w-full"
            :class="[{ 'p-invalid': v$.endDate.$error }]"
        />
        <label for="dd-city">Дата окончание</label>
      </FloatLabel>
    </div>
    <div class="flex mt-6 gap-4">
      <Select
          v-model="selectedSale"
          placeholder="Условия скидки"
          class="w-full"
          :options="sale"
          optionLabel="name"
          optionValue="id"
      />
      <fin-input
          v-model="selectedValues.percent"
          placeholder="Процент" class="w-full"
          :class="[{ 'p-invalid': v$.percent.$error }]"
          type="Number"
          @input="limitPercent"
      />
    </div>
    <div class="flex mt-6 gap-4">
      <fin-input v-model="selectedValues.description" placeholder="Описание" class="w-full" :class="[{ 'p-invalid': v$.description.$error }]" />
    </div>
    <div v-if="selectedSale === 1">
      <contract-percent @send-data="getAgreements"/>
    </div>
    <div v-if="selectedSale === 2">
      <contract-quantity @send-data="getAgreements"/>
    </div>
  </div>
</div>
</template>

<style lang="scss">
.create-discount{
  .p-datepicker {
    display: flex;
    &-input-icon-container {
      top: 15px !important;
    }
  }

}
.p-invalid {
  border: 1px solid #f2376f !important;
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

    &-text {
      font-family: Manrope, sans-serif;
    }
  }
}

</style>