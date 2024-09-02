<script setup>
import Dialog from "primevue/dialog";
import {ref, watch} from "vue";
import Calculate from "@/components/ForSale/Calculate.vue";
import formatPrice from "@/constants/formatNumber.js";
import {useAxios} from "@/composable/useAxios.js";
import {Swiper, SwiperSlide} from "swiper/vue";
import 'swiper/css';

const emit = defineEmits(['close-modal', 'postProducts'])
const props = defineProps({
  openDepositMoney: {
    type: Boolean,
    default: false
  },
  saleSum: {
    type: Number,
    default: 0
  }
})
const modules = ref([])
const selectFilter = ref(0);
const walletNumbers = ref(0);
const change = ref(0);
const cardPay = ref(0);
const walletChangeAll = ref(0);
const selectPayMethods = ref(0);
const postProducts = ref([]);
const filterList = ref([
  {
    name: 'Наличные',
    icon: 'pi pi-wallet'
  },
  {
    name: 'Платежной картой',
    icon: 'pi pi-credit-card'
  },
  {
    name: 'Сложная оплата',
    icon: 'pi pi-clone'
  }]);
const payMethods = ref([]);

const toggleFilter = (index) => {
  selectFilter.value = index;
};

function calculateFn(numbers) {
  if (selectFilter.value === 0) {
    walletNumbers.value = Number(numbers)
    if (walletNumbers.value > props.saleSum) {
      return change.value = walletNumbers.value - props.saleSum
    } else change.value = 0
  } else {
    cardPay.value = Number(numbers)
    if (cardPay.value > props.saleSum) {
      return change.value = cardPay.value - props.saleSum
    } else change.value = 0
  }
  walletChangeAll.value = walletNumbers.value + cardPay.value
}

function togglePay(index) {
  selectPayMethods.value = index;
}

async function cardFn() {
  try {
    const res = await useAxios(`/cards`)
    payMethods.value = res.result.map(el => {
      return {
        name: el.name,
        code: el.id
      }
    })
  } catch (e) {
    console.log(e)
  }
}

cardFn()
watch(walletChangeAll, (newValue) => {
  if (newValue > props.saleSum) {
    change.value = walletChangeAll.value -= props.saleSum
  }
})
</script>

<template>
  <Dialog :draggable="false" class="fast-goods-header transition-all" v-model:visible="props.openDepositMoney" modal
          :style="{ width: '940px',   height:selectFilter === 0 ? '620px' : '720px'}" scroll :closable="false"
          :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
    <template #header>
      <div class="flex justify-between items-center w-full ">
        <div class="flex gap-5 items-center ">
          <fin-button @click="emit('close-modal')" icon="pi pi-times" class="p-button-2xl" severity="warning"
                      label="Отменить"/>
          <div class="font-semibold text-[26px] leading-[26px] text-[#141C30]">
            Внесение денег
          </div>
        </div>
        <fin-button icon="pi pi-arrow-right" class="p-button-2xl" severity="primary"
                    label="Закрыть чек" @click="emit('postProducts',postProducts)"/>
      </div>
    </template>
    <div class="flex gap-4">
      <button
          v-for="(infoFilter, index) in filterList"
          :key="index"
          v-ripple
          :class="{ active: selectFilter === index }"
          @click="toggleFilter(index)"
          class="font-semibold btn-transition text-[18px] w-full leading-[20px] text-[#3935E7] bg-[#ECF1FB] h-[60px] rounded-[12px]
                 px-[20px] py-[12px]"
      >
        <i :class="infoFilter.icon"></i>
        <span class="truncate ml-2"> {{ infoFilter.name }}</span>
      </button>
    </div>
    <div class="grid grid-cols-12 gap-[26px]">
      <div class="col-span-12 mt-[26px]" v-if="selectFilter === 1">
        <swiper
            :slidesPerView="4"
            :spaceBetween="-5"
            :modules="modules"

        >
          <swiper-slide v-for="(infoFilter, index) in payMethods"
                        :key="index">
            <button
                v-ripple
                :class="{ active: selectPayMethods === index }"
                @click="togglePay(index,infoFilter.code,)"
                class="font-semibold btn-transition text-[18px] w-[200px] leading-[20px] text-[#3935E7] bg-[#ECF1FB] h-[60px] rounded-[12px]
               px-[20px] py-[12px] flex items-center justify-center"
            >
              <span class="truncate">{{ infoFilter.name }}</span>
            </button>
          </swiper-slide>
        </swiper>
      </div>
      <Calculate @numbers-wallet="calculateFn" class="col-span-6" :class="{'mt-[26px]' : selectFilter === 0 }"/>
      <div class="col-span-6" :class="{'mt-[26px]' : selectFilter === 0 }">
        <div class=" mt-[5px] flex flex-col gap-[16px]">
          <div class="flex justify-between items-center border-b border-dashed border-t pt-[16px] pb-[16px]">
            <div class="font-semibold text-[18px] leading-[18px] text-[#808BA0]">К оплате</div>
            <div class="font-semibold text-[34px] leading-[24px] text-[#141C30]">{{ formatPrice(props.saleSum) }} <span
                class="text-[24px]">сум</span></div>
          </div>
          <div class="flex justify-between">
            <div class="font-semibold text-[18px] leading-[18px] text-[#808BA0]">Внесено наличными</div>
            <div class="font-semibold text-[20px] leading-[24px] text-[#141C30]">{{ formatPrice(walletNumbers) }} <span
                class="text-[16px]">сум</span>
            </div>
          </div>
          <div class="flex justify-between">
            <div class="font-semibold text-[18px] leading-[18px] text-[#808BA0]">Внесено платежной картой</div>
            <div class="font-semibold text-[20px] leading-[24px] text-[#141C30]">{{ formatPrice(cardPay) }} <span
                class="text-[16px]">сум</span>
            </div>
          </div>
          <div class="flex justify-between items-center border-dashed border-t py-[24px] ">
            <div class="font-semibold text-[18px] leading-[18px] text-[#808BA0]">Сдача</div>
            <div class="font-semibold text-[34px] leading-[24px] text-[#141C30]">{{ formatPrice(change) }} <span
                class="text-[24px]">сум</span></div>
          </div>
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
</style>
