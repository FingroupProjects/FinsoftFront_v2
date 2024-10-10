<script setup>
import {computed, watchEffect, ref} from 'vue'
import formatPrice from '@/constants/formatNumber.js'
const props = defineProps({
  infoList: Object,
  priceList: Array,

})
const inputValue = Number(props.infoList.newPrice);
const allOldPrice = ref(0);
const newAllPrice = ref(null);
const isInputGreater = computed(() => {
  return inputValue.value > Number(props.infoList.oldPrice);
});
watchEffect(() => {
  allOldPrice.value = props.priceList.reduce((total, item) => {
    return total + Number(item.oldPrice);
  }, 0);
  newAllPrice.value = props.priceList.reduce((total, item) => {
    return total + Number(item.newPrice); // Ensure item.newPrice exists
  }, 0);
});
</script>

<template>
  <div class="rounded-[10px] bg-[#fff] px-4 py-3 h-[80vh] w-[17%] overflow-y-scroll div_big">
    <div class="header flex gap-[13px] items-center">
      <img class="w-[32px] h-[32px] rounded-[10px] border-2 object-cover"
           src="https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_3x4.jpg"
           alt="">
      <div class="text-[600] text-[16px] leading-[16px] text-[#000]">
        {{ props.infoList.priceType }}
      </div>
      <button class="">
        <img src="@/assets/img/trashIcon.svg" class="w-[16px] h-[16px]" alt="">
      </button>
    </div>
    <div class="flex p-3 justify-between fixed z-10 bg-white w-[190px] bottom-0" style="border-top:1px solid #DCDFE3">
      <div class="text-[#141C30] font-semibold text-[15px] leading-[15px]">
        {{ formatPrice(allOldPrice) }}
        <div class="text-[#808BA0] font-semibold text-[11px] leading-[11px] text-center">
          Старая
        </div>
      </div>
      <div class="text-[#17A825] font-semibold text-[15px] leading-[15px]">
        {{ formatPrice(newAllPrice)  }}
        <div class="text-[#808BA0] font-semibold text-[11px] leading-[11px] text-center">
          Новая
        </div>
      </div>
    </div>
    <div v-for="item in props.priceList" :key="item.id"
         class="content mt-[14px] flex gap-5 items-center overflow-y-scroll">
      <div class="text-[15px] font-medium leading-[15px] text-[#141C30]">
        {{ item.oldPrice || 0 }}
      </div>
      <div class="relative">
        <input v-model="inputValue" type="number" class="input-new" placeholder="Новая">
        <img v-if="isInputGreater" class="absolute top-[10px] right-[10px]" src="@/assets/img/arrowSuccess.svg" alt="">
        <img v-else class="absolute top-[10px] right-[10px]" src="@/assets/img/arrowDanger.svg" alt="">
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.header {
  border-bottom: 1px solid #DCDFE3;
  padding-bottom: 11px;
}

.text-container {
  font-size: 13px;
  line-height: 13px;
  color: #808BA0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 200px;
}

.input-new {
  border: 1px solid #DCDFE3;
  border-radius: 8px;
  padding: 15px 12px;
  height: 32px;
  width: 100%;
  transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
  font-size: 15px;
  font-weight: 600;
  line-height: 15px;
  color: #000000;
}

.input-new:focus {
  outline: none;
  border: 1.8px solid #3935E7;
}

.input-new::placeholder {
  color: #808BA0;
  font-weight: 600;
  font-size: 15px;
  line-height: 15px;
}

.input-new::-webkit-outer-spin-button,
.input-new::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.input-new[type=number] {
  -moz-appearance: textfield;
}
</style>