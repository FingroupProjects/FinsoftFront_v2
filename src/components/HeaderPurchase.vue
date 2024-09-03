<script setup>
import {onMounted, reactive} from "vue";
import {useAxios} from "@/composable/useAxios.js";

const props = defineProps({
  headerTitle:''
})

const dashboardValues = reactive({
  purchase: '',
  purchase_percent: '',
  return: '',
  return_percent: '',
  for_payment: '',
  for_payment_percent: '',
  avg_price: '',
  avg_price_percent: '',
  order: '',
  order_percent: ''
})

async function getDashBoardData()
{
  try {
    const res = await useAxios(`/document/dashboard`);

    dashboardValues.purchase = res.purchase;
    dashboardValues.purchase_percent = res.purchase_percent;
    dashboardValues.return = res.return
    dashboardValues.return_percent = res.return_percent
    dashboardValues.for_payment = res.for_payment
    dashboardValues.for_payment_percent = res.for_payment_percent
    dashboardValues.avg_price = res.avg_price
    dashboardValues.avg_price_percent = res.avg_price_percent
    dashboardValues.order = res.order
    dashboardValues.order_percent = res.order_percent
  } catch (e) {
    console.log(e)
  }
}

onMounted(function () {
  getDashBoardData()
})


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
        <div class="text-[32px] font-medium leading-[32px] text-[#141C30]">
          {{dashboardValues.return}}
        </div>
      </div>
      <div class="card-header mt-4 mb-4 col-span-1">
        <div class="flex justify-between">
          <div class="font-semibold text-[13px] text-[#120F1F]">
            <i :class="dashboardValues.for_payment_percent > 0 ? 'pi pi-arrow-up text-[#07BC51]' : 'pi pi-arrow-down text-[#EE2828]'" class="text-[10px]"></i>{{dashboardValues.for_payment_percent}}%
          </div>
          <div class="font-semibold text-[13px] text-[#120F1F]">
            К оплате
          </div>
        </div>
        <div class="text-[32px] font-medium leading-[32px] text-[#141C30]">
          {{dashboardValues.for_payment}}
        </div>
      </div>
      <div class="card-header mt-4 mb-4 col-span-1">
        <div class="flex justify-between">
          <div class="font-semibold text-[13px] text-[#120F1F]">
            <i :class="dashboardValues.avg_price_percent > 0 ? 'pi pi-arrow-up text-[#07BC51]' : 'pi pi-arrow-down text-[#EE2828]'" class="text-[10px]"></i> {{dashboardValues.avg_price_percent}}%
          </div>
          <div class="font-semibold text-[13px] text-[#120F1F]">
            Сред. цена за ед.
          </div>
        </div>
        <div class="text-[32px] font-medium leading-[32px] text-[#141C30]">
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
        <div class="text-[32px] font-medium leading-[32px] text-[#141C30]">
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