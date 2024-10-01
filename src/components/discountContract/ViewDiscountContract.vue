<script setup>

import FloatLabel from "primevue/floatlabel";
import DatePicker from "primevue/datepicker";
import Select from "primevue/select";
import {onMounted, ref, watch} from 'vue'
import ContractQuantity from "@/components/discountContract/ContractQuantity.vue";
import ContractPercent from "@/components/discountContract/ContractPercent.vue";
import {useAxios} from "@/composable/useAxios.js";
import {useToast} from "primevue/usetoast";

const props = defineProps({
  idSale: '',
  data: ''
})
const emit = defineEmits(["close-sidebar"]);
const toast = useToast();

const getSaleData = ref({})
const selectedSale = ref()
const getUpdatedData = ref({})
const sale = [
  { id: 1, name: 'Скидка в %' },
  { id: 2, name: 'Скидка в количестве товаров' },
];


function getSale () {
  getSaleData.value = props.data || {}
  console.log('sale',getSaleData.value)
  console.log(getSaleData.value)
  if (getSaleData.value.type === "percent") {
    selectedSale.value = 1
  }else {
    selectedSale.value = 2
  }
}

function getAgreements(event) {
  getUpdatedData.value = Array.isArray(event) ? event : [event];
  console.log('updated Data', getUpdatedData.value);
}

const updateData = async () => {
  try {
    console.log(getSaleData.value);
    const agreementsData = Array.isArray(getUpdatedData.value) && getUpdatedData.value.length > 0
        ? getUpdatedData.value
        : getSaleData.value.agreementSaleList.map(item => ({
          id: item.id || null,
          agreement_id: item.agreement.id,
          good_id: item.good.id
        }));
    const formattedAgreements = agreementsData.map(item => {
      if (getSaleData.value.type === "percent") {
        return {
          agreement_id: item.id || null
        };
      } else {
        return {
          id: item.id || null,
          agreement_id: item.agreement_id,
          good_id: item.good_id
        };
      }
    });
    const res = await useAxios(`/sale/agreement/${props.idSale}`, {
      method: 'PATCH',
      data: {
        name: getSaleData.value.title,
        percent: getSaleData.value.percent,
        start_date: getSaleData.value.start_date,
        end_date: getSaleData.value.end_date,
        description: getSaleData.value.description,
        type: getSaleData.value.type,
        agreements: formattedAgreements
      }
    });
    toast.add({
      severity: 'success',
      summary: 'Success Message',
      detail: 'Data updated successfully!',
      life: 3000,
    });
  } catch (err) {
    console.log(err);
    toast.add({
      severity: 'error',
      summary: 'Error Message',
      detail: 'An error occurred while updating the data.',
      life: 3000,
    });
  }
};

const limitPercent = (event) => {
  let value = event.target.value;
  value = value.replace(/\D/g, '');
  if (value.length > 3) {
    value = value.slice(0, 3);
  }
  if (parseInt(value) > 100) {
    value = '100';
  }
  getSaleData.value.percent = value;
};

async function infoModalClose() {
  emit('close-sidebar')
}

onMounted(()=>{
  getSale()
})

watch(() => getSaleData.value.percent, (newValue) => {
  if (newValue > 100) {
    getSaleData.value.percent = 100;
  }
});

</script>

<template>
  <div>
    <div class="header">
      <div>
        <div class="header-title">Просмотр скидки на договор</div>
        <div class="text-gray-500">№52341</div>
      </div>
      <div class="flex gap-[16px]">
        <fin-button
            @click="updateData"
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
    <div class="mt-8">
      <div >
        <fin-input  placeholder="Название скидки" v-model="getSaleData.title" />
      </div>
      <div class="create-discount flex mt-6 gap-4">
        <FloatLabel class="w-full">
          <DatePicker
              v-model="getSaleData.start_date"
              showIcon
              showTime
              hourFormat="24"
              fluid
              hideOnDateTimeSelect
              iconDisplay="input"
              class="w-full"
          />
          <label for="dd-city">Дата начало</label>
        </FloatLabel>
        <FloatLabel class="w-full">
          <DatePicker
              v-model="getSaleData.end_date"
              showIcon
              showTime
              hourFormat="24"
              fluid
              hideOnDateTimeSelect
              iconDisplay="input"
              class="w-full"
          />
          <label for="dd-city">Дата окончание</label>
        </FloatLabel>
      </div>
      <div class="flex mt-6 gap-4">
        <FloatLabel class="w-full">
          <Select
              :options="sale"
              v-model="selectedSale"
              class="w-full"
              optionLabel="name"
              optionValue="id"
          />
          <label for="dd-city">Условия скидки</label>
        </FloatLabel>
        <fin-input
            v-model="getSaleData.percent"
            placeholder="Процент"
            class="w-full"
            type="Number"
            @input="limitPercent"
        />
      </div>
      <div class="flex mt-6 gap-4">
        <fin-input
            v-model="getSaleData.description"
            placeholder="Описание"
            class="w-full"
        />
      </div>
      <div v-if="selectedSale === 2">
        <contract-quantity :contract="getSaleData.agreementSaleList" @send-data="getAgreements"/>
      </div>
      <div v-if="selectedSale === 1">
        <contract-percent :contract="getSaleData.agreementSaleList" @send-data="getAgreements"/>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
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