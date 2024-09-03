<script setup>
import Dialog from "primevue/dialog";
import {ref} from "vue";
import Calculate from "@/components/ForSale/Calculate.vue";
import formatPrice from "@/constants/formatNumber.js";
import {useAxios} from "@/composable/useAxios.js";

import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import InputText from "primevue/inputtext";
import PhoneNumber from "@/components/ForSale/PhoneNumber.vue";

const emit = defineEmits(['close-modal', 'postSale'])
const props = defineProps({
  openDepositMoney: {
    type: Boolean,
    default: false
  }
})
const saleSum = ref(0)

function postDiscount(sale) {
  saleSum.value += Number(sale)
}
</script>

<template>
  <Dialog :draggable="false" class="fast-goods-header" v-model:visible="props.openDepositMoney" modal
          :style="{ width: '940px', height:'554px' }" scroll :closable="false"
          :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
    <template #header>
      <div class="flex justify-between items-center w-full ">
        <div class="flex gap-5 items-center ">
          <fin-button @click="emit('close-modal')" icon="pi pi-times" class="p-button-2xl" severity="warning"
                      label="Отменить"/>
          <div class="font-semibold text-[26px] leading-[26px] text-[#141C30]">
            Ручная скидка
          </div>
        </div>
        <fin-button icon="pi pi-arrow-right" class="p-button-2xl" severity="info"
                    label="Применить" @click="emit('postSale',saleSum)"/>
      </div>
    </template>
    <div class="grid grid-cols-12 gap-[26px] mt-[6px]">
      <Calculate @numbers-wallet="postDiscount" class="col-span-6"/>
      <div class="col-span-6 flex justify-between ">
        <div class="font-semibold text-[18px] leading-[18px] text-[#808BA0]">Скидка</div>
        <div class="font-semibold text-[34px] leading-[24px] text-[#141C30]">{{formatPrice(saleSum) }} <span
            class="text-[24px]">сум</span></div>
      </div>
    </div>
  </Dialog>
</template>

<style scoped lang="scss">
.active {
  background: #3935E7;
  color: white;
}

.btn-transition {
  transition: 0.3s all linear;
}
</style>>