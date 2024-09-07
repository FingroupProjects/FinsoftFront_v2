<script setup>
import {ref, watch} from 'vue';
import Dialog from 'primevue/dialog';
import Calculate from '@/components/ForSale/Calculate.vue';
import formatPrice from '@/constants/formatNumber.js';

const emit = defineEmits(['close-modal', 'postSale']);
const props = defineProps({
  openDepositMoney: {
    type: Boolean,
    default: false
  },
  getIdSale: {
    type: String,
    default: null
  }
});

const saleSum = ref(0);

function postDiscount(sale) {
  if (sale) {
    saleSum.value += Number(sale);
  } else {
    saleSum.value += Number(props.getIdSale);
  }
}

watch(() => Number(props.getIdSale), (newValue) => {
  if (newValue) {
    postDiscount();
    emit('postSale', saleSum.value); // Emit the current saleSum value
  } else if (Number(newValue) === 0) {
    saleSum.value = 0
    emit('postSale', saleSum.value);
  }
});

function applyDiscount() {
  emit('postSale', saleSum.value); // Emit the current saleSum value when applying discount
}
</script>

<template>
  <Dialog
      :draggable="false"
      class="fast-goods-header"
      v-model:visible="props.openDepositMoney"
      modal
      :style="{ width: '940px', height:'554px' }"
      scroll
      :closable="false"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
  >
    <template #header>
      <div class="flex justify-between items-center w-full ">
        <div class="flex gap-5 items-center ">
          <fin-button
              @click="emit('close-modal')"
              icon="pi pi-times"
              class="p-button-2xl"
              severity="warning"
              label="Отменить"
          />
          <div class="font-semibold text-[26px] leading-[26px] text-[#141C30]">
            Ручная скидка
          </div>
        </div>
        <fin-button
            icon="pi pi-arrow-right"
            class="p-button-2xl"
            severity="info"
            label="Применить"
            @click="applyDiscount"
        />
      </div>
    </template>
    <div class="grid grid-cols-12 gap-[26px] mt-[6px]">
      <Calculate @numbers-wallet="postDiscount" class="col-span-6"/>
      <div class="col-span-6 flex justify-between ">
        <div class="font-semibold text-[18px] leading-[18px] text-[#808BA0]">Скидка</div>
        <div class="font-semibold text-[34px] leading-[24px] text-[#141C30]">
          {{ formatPrice(saleSum) || props.getIdSale }} <span class="text-[24px]">сум</span>
        </div>
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