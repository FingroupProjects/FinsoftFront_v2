<script setup>
import { reactive, ref, watch } from 'vue';
import DatePicker from 'primevue/datepicker';
import FloatLabel from 'primevue/floatlabel';
import Select from 'primevue/select';
import GoodsDiscountPercent from '@/components/discountGoods/GoodsDiccountPercent.vue';
import GoodsDiscountQuantity from '@/components/discountGoods/GoodsDiscountQuantity.vue';
import { useAxios } from '@/composable/useAxios.js';
import moment from 'moment';
import { useToast } from 'primevue/usetoast';
import { required } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';

const toast = useToast();
const emit = defineEmits(['close-sidebar', 'closeDialog']);

const sale = [
  { id: 1, name: 'Скидка в %' },
  { id: 2, name: 'Скидка в количестве товаров' },
];
const getGoods = ref([]);
const rawDateFirst = ref();
const rawDateSecond = ref();
const selectedSale = ref(1);

const selectedGoods = reactive({
  name: '',
  percent: '',
  startDate: '',
  endDate: '',
  description: '',
  type: '',
});

const rules = reactive({
  name: { required },
  percent: { required },
  startDate: { required },
  endDate: { required },
  description: { required },
  type: { required },
});
const v$ = useVuelidate(rules, selectedGoods);

const goodsDataPercent = (event) => {
  getGoods.value = event;
};

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

const getGoodsDataQuantity = (event) => {
  const result = event.map((product) => {
    if (!product.isGift) {
      return {
        good_id: product.code,
        gifted_good_id: event.find(p => p.isGift)?.code || null,
        quantity: product.quantity
      };
    }
  }).filter(item => item);

  getGoods.value = result;
  console.log('getGoods.value', result);
};

const postSale = async () => {
  selectedGoods.type = selectedSale.value === 1 ? 'percent' : 'good';
  const goods = selectedGoods.type === 'good'
      ? getGoods.value.map((item) => ({
        gifted_good_id: item.gifted_good_id,
        good_id: item.good_id,
        quantity: item.quantity,
      }))
      : getGoods.value.map((item) => ({
        good_id: item.code,
        quantity: 1,
      }));

  const result = await v$.value.$validate();
  if (result) {
    try {
      const res = await useAxios(`/sale/good`, {
        method: 'post',
        data: {
          name: selectedGoods.name,
          percent: selectedGoods.percent,
          start_date: moment(selectedGoods.startDate).format('YYYY-MM-DD HH:mm:ss'),
          end_date: moment(selectedGoods.endDate).format('YYYY-MM-DD HH:mm:ss'),
          description: selectedGoods.description,
          type: selectedGoods.type,
          goods: goods,
        },
      });

      toast.add({
        severity: 'success',
        summary: 'Success Message',
        detail: 'Message Content',
        life: 3000,
      });
      console.log('emit',res)
      emit("closeDialog",res.result);
    }catch (e){
      console.log(e)
      toast.add({
        severity: 'error',
        summary: 'Error Message',
        detail: 'Message Content',
        life: 3000,
      });
    }
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
  selectedGoods.percent = value;
};


async function infoModalClose() {
   emit('close-sidebar')
}

watch(rawDateFirst, (newValue) => {
  selectedGoods.startDate = newValue ? formatDateTime(newValue) : '';
});
watch(rawDateSecond, (newValue) => {
  selectedGoods.endDate = newValue ? formatDateTime(newValue) : '';
});

watch(() => selectedGoods.percent, (newValue) => {
  if (newValue > 100) {
    selectedGoods.percent = 100;
  }
});
</script>


<template>
  <div class="pl-6">
    <div class="header">
      <div>
        <div class="header-title">Установка скидки на товар</div>
        <div class="header-text text-[#808BA0] font-semibold text-[16px] pt-1">№32154</div>
      </div>
      <div class="flex gap-[16px]">
        <fin-button
            @click="postSale"
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
      <div >
        <fin-input v-model="selectedGoods.name" placeholder="Название скидки" :class="[{ 'p-invalid': v$.name.$error }]"  />
      </div>
      <div class="create-discount flex mt-6 gap-4">
        <FloatLabel class="w-full">
          <DatePicker
              v-model="rawDateFirst"
              showIcon
              showTime
              hourFormat="24"
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
        <FloatLabel class="w-full">
          <Select
              v-model="selectedSale"
              class="w-full"
              :options="sale"
              optionLabel="name"
              optionValue="id"
          />
          <label for="dd-city">Условия скидки</label>
        </FloatLabel>
        <fin-input
            v-model="selectedGoods.percent"
            placeholder="Процент"
            class="w-full"
            :class="[{ 'p-invalid': v$.percent.$error }]"
            type="Number"
            @input="limitPercent"
        />
      </div>
      <div class="flex mt-6 gap-4">
        <fin-input
            v-model="selectedGoods.description"
            placeholder="Описание"
            class="w-full"
            :class="[{ 'p-invalid': v$.description.$error }]"
        />
      </div>
      <div v-if="selectedSale === 1">
        <goods-discount-percent @send-data="goodsDataPercent" />
      </div>
      <div v-if="selectedSale === 2">
        <goods-discount-quantity @send-data="getGoodsDataQuantity" />
      </div>
    </div>
  </div>
</template>


<style lang="scss">
.create-discount{
  .p-datepicker {
    display: flex;
    align-items: center;

    &-input-icon-container {
      top: 15px !important;
    }
  }
  .p-invalid {
    border: 1px solid #f2376f !important;
  }
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