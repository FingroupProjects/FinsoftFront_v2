<script setup>

import FloatLabel from "primevue/floatlabel";
import DatePicker from "primevue/datepicker";
import Select from "primevue/select";
import {onMounted, ref, watch} from "vue";
import GoodsDiscountQuantity from "@/components/discountGoods/GoodsDiscountQuantity.vue";
import GoodsDiscountPercent from "@/components/discountGoods/GoodsDiccountPercent.vue";
import {useToast} from "primevue/usetoast";
import {useAxios} from "@/composable/useAxios.js";

const toast = useToast();
const emit = defineEmits(["close-sidebar"]);
const props = defineProps({
  idSale: '',
  data: ''
})
const sale = [
  { id: 1, name: 'Скидка в %' },
  { id: 2, name: 'Скидка в количестве товаров' },
];
const getSaleData = ref({})
const selectedSale = ref()
const getUpdatedData = ref({})
function getSale () {
  getSaleData.value = props.data;
  console.log(getSaleData.value)
  if (getSaleData.value.type === "percent") {
    selectedSale.value = 1
  }else {
    selectedSale.value = 2
  }
}

const getEditedGoods = (event) => {
  const result = event.map((product) => {
    if (!product.isGift) {
      return {
        id: product.id,
        good_id: product.code,
        gifted_good_id: event.find(p => p.isGift)?.code || null,
        quantity: product.quantity
      };
    }
  }).filter(item => item);
  getUpdatedData.value = result;
  console.log('getGoods.value', getUpdatedData.value);
};


const updateData = async () => {
  try {
    console.log('id', getSaleData.value.goodSaleList);
    const goodsData = Array.isArray(getUpdatedData.value) && getUpdatedData.value.length > 0
        ? getUpdatedData.value.map(item => ({
          id: item.id || null,
          good_id: item.good_id,
          ...(getSaleData.value.type === 'good' && { gifted_good_id: item.gifted_good_id }),
          quantity: item.quantity || 1
        }))
        : getSaleData.value.goodSaleList.map(item => ({
          id: item.id || null,
          good_id: item.good.id,
          ...(getSaleData.value.type === 'good' && { gifted_good_id: item.giftedGood.id }),
          quantity: item.quantity || 1
        }));
    console.log('Prepared goodsData:', goodsData);
    const res = await useAxios(`/sale/good/${props.idSale}`, {
      method: "PATCH",
      data: {
        name: getSaleData.value.name,
        percent: getSaleData.value.percent,
        start_date: getSaleData.value.start_date,
        end_date: getSaleData.value.end_date,
        description: getSaleData.value.description,
        type: getSaleData.value.type,
        goods: goodsData
      }
    });
    toast.add({
      severity: 'success',
      summary: 'Обновлено!',
      detail: 'Скидки на товар успешно обновлено!',
      life: 3000,
    });
  } catch (e) {
    console.log("Error updating data:", e);
    toast.add({
      severity: 'error',
      summary: 'Ошибка!',
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
        <div class="header-title">Просмотр скидки на товар</div>
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
        <fin-input v-model="getSaleData.name"  placeholder="Название скидки" />
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
              v-model="selectedSale"
              :options="sale"
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
      <div v-if="selectedSale === 1">
        <goods-discount-percent :goods="getSaleData.goodSaleList"  @send-data="getEditedGoods" />
      </div>
      <div v-if="selectedSale === 2">
        <goods-discount-quantity :goods="getSaleData.goodSaleList"  @send-data="getEditedGoods" />
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