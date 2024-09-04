<script setup>
import { onMounted, reactive, ref, watch } from 'vue';
import { useAxios } from '@/composable/useAxios.js';

const props = defineProps({
  headerTitle: '',
  data: Number
});

const refreshedData = ref(props.data);

const dashboardValues = reactive({
  purchase: 0,
  purchase_percent: 0,
  return: 0,
  return_percent: 0,
  for_payment: 0,
  for_payment_percent: 0,
  avg_price: 0,
  avg_percent: 0,
  order: 0,
  order_percent: 0
});

async function getDashBoardData() {
  try {
    const res = await useAxios('/document/dashboard');

    dashboardValues.purchase = res.result.purchase;
    dashboardValues.purchase_percent = res.result.purchase_percent;
    dashboardValues.return = res.result.return
    dashboardValues.return_percent = res.result.return_percent
    dashboardValues.for_payment = res.result.for_payment
    dashboardValues.for_payment_percent = res.result.for_payment_percent
    dashboardValues.avg_price = res.result.avg_price
    dashboardValues.avg_percent = res.result.avg_percent
    dashboardValues.order = res.result.order
    dashboardValues.order_percent = res.result.order_percent
  } catch (e) {
    console.log(e);
  }
}

function animateCounter(key, targetValue) {
  const duration = 800;
  const interval = 3;
  const step = (targetValue / duration) * interval;
  let currentValue = 0;


  const update = () => {
    if (currentValue >= targetValue) {
      dashboardValues[key] = targetValue;
    } else {
      currentValue += step;
      dashboardValues[key] = Math.round(currentValue);
      setTimeout(update, interval);
    }
  };

  update();
}

defineExpose({
  getDashBoardData
});

watch(() => props.data, (newValue) => {
  refreshedData.value = newValue;
  console.log('Data refreshed:', refreshedData.value);
  getDashBoardData();
});

onMounted(() => {
  getDashBoardData();
});

</script>


<template>
  <div class="relative z-20 bottom-[40px]">
    <div class="header-text font-semibold text-[20px] leading-[20px] text-[#141C30]">
      {{props.headerTitle}}
    </div>
    <div class="grid grid-cols-5 gap-[20px]">
      <div class="card-header mt-4 mb-4 col-span-1">
        <div class="flex justify-between">
          <div class="font-semibold text-[13px] text-[#120F1F]">
            <i :class="dashboardValues.purchase_percent > 0 ? 'pi pi-arrow-up text-[#07BC51]' : 'pi pi-arrow-down text-[#EE2828]'" class="text-[10px]"></i> {{dashboardValues.purchase_percent}} %
          </div>
          <div class="font-semibold text-[13px] text-[#120F1F]">
            Покупки
          </div>
        </div>
        <div class="text-[32px] font-medium leading-[32px] text-[#141C30]">
          {{dashboardValues.purchase}}
        </div>
      </div>
      <div class="card-header mt-4 mb-4 col-span-1">
        <div class="flex justify-between">
          <div class="font-semibold text-[13px] text-[#120F1F]">
            <i :class="dashboardValues.return_percent > 0 ? 'pi pi-arrow-up text-[#07BC51]' : 'pi pi-arrow-down text-[#EE2828]'" class="text-[10px]"></i> {{dashboardValues.return_percent}}%
          </div>
          <div class="font-semibold text-[13px] text-[#120F1F]">
            Возврат
          </div>
        </div>
        <div class="text-[32px] font-medium leading-[32px] text-[#141C30] counter">
          {{dashboardValues.return}}
        </div>
      </div>
      <div class="card-header mt-4 mb-4 col-span-1">
        <div class="flex justify-between">
          <div class="font-semibold text-[13px] text-[#120F1F]">
            <i :class="dashboardValues.for_payment_percent > 0 ? 'pi pi-arrow-up text-[#07BC51]' : 'pi pi-arrow-down text-[#EE2828]'" class="text-[10px]"></i> {{dashboardValues.for_payment_percent}}%
          </div>
          <div class="font-semibold text-[13px] text-[#120F1F]">
            К оплате
          </div>
        </div>
        <div class="text-[32px] font-medium leading-[32px] text-[#141C30] counter">
          {{dashboardValues.for_payment}}
        </div>
      </div>
      <div class="card-header mt-4 mb-4 col-span-1">
        <div class="flex justify-between">
          <div class="font-semibold text-[13px] text-[#120F1F]">
            <i :class="dashboardValues.avg_percent > 0 ? 'pi pi-arrow-up text-[#07BC51]' : 'pi pi-arrow-down text-[#EE2828]'" class="text-[10px]"></i> {{dashboardValues.avg_percent}}%
          </div>
          <div class="font-semibold text-[13px] text-[#120F1F]">
            Сред. цена за ед.
          </div>
        </div>
        <div class="text-[32px] font-medium leading-[32px] text-[#141C30] counter">
          {{dashboardValues.avg_price}}
        </div>
      </div>
      <div class="card-header mt-4 mb-4 col-span-1">
        <div class="flex justify-between">
          <div class="font-semibold text-[13px] text-[#120F1F]">
            <i :class="dashboardValues.order_percent > 0 ? 'pi pi-arrow-up text-[#07BC51]' : 'pi pi-arrow-down text-[#EE2828]'" class="text-[10px]"></i> {{dashboardValues.order_percent}}%
          </div>
          <div class="font-semibold text-[13px] text-[#120F1F]">
            Заказ в пути
          </div>
        </div>
        <div class="text-[32px] font-medium leading-[32px] text-[#141C30] counter">
          {{dashboardValues.order}}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.card-header{
  //width: 258px;
  height: 86px;
  border-radius: 10px;
  padding: 16px;
  background: white;
}

</style>