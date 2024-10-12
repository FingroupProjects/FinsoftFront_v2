<script setup>
import {watchEffect, ref, onMounted, watch} from 'vue';
import formatPrice from '@/constants/formatNumber.js';

const emit = defineEmits(['delete','scrollPosition']);
const props = defineProps({
  infoList: Object,
  priceList: Array,
  priceTypeId: Number,
  scrollPosition: Number,
});

const scrollTop = ref(null);
const inputValues = ref();
const allOldPrice = ref(0);
const newAllPrice = ref(0);

const isInputGreater = (index) => {
  return inputValues.value[index] > Number(props.infoList.oldPrice);
};

const syncScroll = (event) => {
  emit('scrollPosition',event.target.scrollTop)
};

onMounted(() => {
  if (scrollTop.value) {
    scrollTop.value.scrollTop = props.scrollPosition;
  }
});

watch(() => props.scrollPosition, (newPosition) => {
  if (scrollTop.value) {
    scrollTop.value.scrollTop = newPosition;
  }
});

watchEffect(() => {
  inputValues.value=Array(props.priceList.length).fill(Number(props.infoList.newPrice))
  allOldPrice.value = props.priceList[0].reduce((total, item) => {
    return total + Number(item.oldPrice);
  }, 0);
  newAllPrice.value = props.priceList.reduce((total, item, index) => {
    return total + Number(inputValues.value[index]);
  }, 0);
  scrollTop.value
});
</script>

<template>
  <div @scroll="syncScroll" class="rounded-[10px] bg-[#fff]  h-[80vh] w-[17%] overflow-y-scroll div_big" ref="scrollTop">
    <div class="header flex gap-[13px] items-center">
      <div class="text-[600] text-[16px] leading-[16px] text-[#000] truncate ">
        {{ props.infoList.priceType }}
      </div>
      <button>
        <img src="@/assets/img/trashIcon.svg" @click="emit('delete',priceTypeId)" class="w-[16px] h-[16px]" alt="">
      </button>
    </div>
    <div v-for="(item,index) in props.priceList" :key="index"
         class="content  flex gap-5 items-center">
      <div class="text-[15px] font-medium leading-[15px] text-[#141C30]">
        {{ item.oldPrice || 0 }}
      </div>
      <div class="relative">
        <input v-model="inputValues[index]" type="number" class="input-new" placeholder="Новая">
        <img v-if="isInputGreater" class="absolute top-[10px] right-[10px]" src="@/assets/img/arrowSuccess.svg" alt="">
        <img v-else class="absolute top-[10px] right-[10px]" src="@/assets/img/arrowDanger.svg" alt="">
      </div>
    </div>
    <div class="flex p-3 justify-between fixed z-10 bg-white w-[215px] bottom-0 rounded-b-[10px]" style="border-top:1px solid #DCDFE3">
      <div class="text-[#141C30] font-semibold text-[15px] leading-[15px]">
        {{ formatPrice(allOldPrice) }}
        <div class="text-[#808BA0] font-semibold text-[11px] leading-[11px] text-center">
          Старая
        </div>
      </div>
      <div class="text-[#17A825] font-semibold text-[15px] leading-[15px]">
        {{ formatPrice(newAllPrice) }}
        <div class="text-[#808BA0] font-semibold text-[11px] leading-[11px] text-center">
          Новая
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.header {
  border-bottom: 1px solid #DCDFE3;
}
.content{
  padding: 0.75rem 1rem 0.75rem 1rem;
  //border-style: solid;
  //border-width: 0 0 1px 0;
  height: 40px;
}
.truncate {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding: 0.75rem 1rem 0.75rem 1rem;
  height: 64px;
  display: flex;
  align-items: center;
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