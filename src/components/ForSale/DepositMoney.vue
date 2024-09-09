<script setup>
import Dialog from "primevue/dialog";
import {ref, watch, computed, watchEffect} from "vue";
import Calculate from "@/components/ForSale/Calculate.vue";
import formatPrice from "@/constants/formatNumber.js";
import {useAxios} from "@/composable/useAxios.js";
import {Swiper, SwiperSlide} from "swiper/vue";
import 'swiper/css';
import ComplexPayment from "@/components/ForSale/ComplexPayment.vue";
import ComplexPaymentInputs from "@/components/ForSale/ComplexPaymentInputs.vue";
import Toast from 'primevue/toast'
import {useToast} from "primevue/usetoast";
import {useRouter} from "vue-router";
import moment from "moment";

const emit = defineEmits(['close-modal', 'postProducts', 'closeEmpty'])
const props = defineProps({
  openDepositMoney: {
    type: Boolean,
    default: false
  },
  saleSum: {
    type: Number,
    default: 0
  },
  disCount: {
    type: Number,
    default: 0
  },
  discountId: {
    type: Number,
    default: null
  },
  typeSale: {
    type: Boolean,
    default: false
  },
  salePost: {
    type: Number,
    default: null
  },
  goodsPost: {
    type: Array,
    default: []
  }
});
const toast = useToast();
const router = useRouter()
const modules = ref([])
const selectFilter = ref(0);
const walletNumbers = ref(0);
const change = ref(0);
const cardPay = ref(0);
const walletChangeAll = ref(0);
const selectPayMethods = ref(0);
const bonusValue = ref(0);
const certificationValue = ref(0);
const idComplex = ref(null);
const cardsId = ref(null);
const cardList = ref([]);

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
    walletNumbers.value = Number(numbers);
    change.value = walletNumbers.value > props.saleSum ? walletNumbers.value - props.saleSum : 0;
  } else {
    cardPay.value = Number(numbers);
    if (cardsId.value === null) {
      cardsId.value = payMethods.value[0].code;
    }
    const existingCard = cardList.value.find(card => card.card_id === cardsId.value);
    payMethods.value[selectPayMethods.value].sum = cardPay.value
    if (!existingCard) {
      cardList.value.push({
        card_id: cardsId.value,
        sum: payMethods.value[selectPayMethods.value].sum,
        name: payMethods.value[selectPayMethods.value].name
      });
    } else {
      existingCard.sum += cardPay.value;
    }
    change.value = cardList.value.reduce((total, card) => total + card.sum, 0) > props.saleSum ? cardList.value.reduce((total, card) => total + card.sum, 0) - props.saleSum : 0;
  }

  walletChangeAll.value = walletNumbers.value + cardList.value.reduce((total, card) => total + card.sum, 0) + certificationValue.value + bonusValue.value;
}

function togglePay(index, id, info) {
  selectPayMethods.value = index;
  cardsId.value = id;
}

const deleteCard = (index) => {
  cardList.value.splice(index, 1);
};

async function cardFn() {
  try {
    const res = await useAxios(`/cards`)
    payMethods.value = res.result.map(el => {
      return {
        name: el.name,
        code: el.id,
        sum: 0
      }
    })
  } catch (e) {
    console.log(e)
  }
}

cardFn()

function getBonusCard(value) {
  bonusValue.value = Number(value)

  if (bonusValue.value > props.saleSum) {
    return change.value = bonusValue.value - props.saleSum
  } else change.value = 0
  walletChangeAll.value = walletNumbers.value + cardList.value.reduce((total, card) => total + card.sum, 0) + bonusValue.value + certificationValue.value

}

function certificationFn(value, id) {
  idComplex.value = id
  certificationValue.value = Number(value)
  if (certificationValue.value > props.saleSum) {
    return change.value = certificationValue.value - props.saleSum
  } else change.value = 0
  walletChangeAll.value = walletNumbers.value + cardList.value.reduce((total, card) => total + card.sum, 0) + certificationValue.value + bonusValue.value
}

const adjustedSaleSum = computed(() => {
  const totalPayments = walletNumbers.value + cardList.value.reduce((total, card) => total + card.sum, 0) + bonusValue.value + certificationValue.value;
  return props.saleSum - totalPayments < 0 ? 0 : props.saleSum - totalPayments;
});

async function payMethodsFn() {
  const data = {
    "date":moment().format('YYYY-DD-MM hh:mm:ss'),
    "discount_id": props.discountId,
    "certificate_id": idComplex.value,
    "cards": cardList.value,
    "discount_sum": bonusValue.value,
    "certificate_sum": certificationValue.value,
    "type": props.typeSale ? "return" : 'sale',
    "sale": props.salePost,
    "for_payment": (walletNumbers.value + cardPay.value) - change.value,
    "changes": change.value,
    "cash_sum": walletNumbers.value,
    "goods": props.goodsPost
  }
  if ((walletNumbers.value + cardList.value.reduce((total, card) => total + card.sum, 0)) >= props.saleSum) {
    try {
      const res = await useAxios(`rmk`, {
        method: 'POST',
        data: data
      })
      toast.add({severity: 'success', summary: 'Создано!', detail: 'Документ успешно создано!', life: 1500});
      emit('closeEmpty');
      setTimeout(() => {
        if (res.errors === null) {
          router.go()
        }
      }, 1000)

    } catch (e) {
      toast.add({severity: 'error', summary: e.response.data.message, life: 1500});
    }
  } else {
    toast.add({severity: 'error', summary: 'Не достатично срество ', life: 1500});
  }
}

const totalCardPay = computed(() => {
  return cardList.value.reduce((total, item) => total + item.sum, 0);
});
watch(walletChangeAll, (newValue) => {
  if (newValue > props.saleSum) {
    change.value = newValue - props.saleSum; // Calculate change without modifying walletChangeAll
  } else {
    change.value = 0; // Reset change if the condition is not met
  }
});
</script>

<template>
  <Dialog :draggable="false" class="fast-goods-header transition-all" v-model:visible="props.openDepositMoney" modal
          :style="{ width: '940px', height: selectFilter === 0 ? '620px' : selectFilter === 1 ? '720px' : '760px' }"
          scroll :closable="false"
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
        <fin-button icon="pi pi-arrow-right" class="p-button-2xl" severity="info"
                    label="Закрыть чек" @click="payMethodsFn"/>
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
                @click="togglePay(index,infoFilter.code,infoFilter)"
                class="font-semibold btn-transition text-[18px] w-[200px] leading-[20px] text-[#3935E7] bg-[#ECF1FB] h-[60px] rounded-[12px]
               px-[20px] py-[12px] flex items-center justify-center"
            >
              <span class="truncate">{{ infoFilter.name }}</span>
            </button>
          </swiper-slide>
        </swiper>
      </div>
      <ComplexPaymentInputs @post-certification="certificationFn" @post-bonus-card="getBonusCard"
                            :dis-count="props.disCount" v-if="selectFilter===2" class="col-span-12 mt-[26px]"/>
      <ComplexPayment v-if="selectFilter===2" class="col-span-6"/>
      <Calculate v-else @numbers-wallet="calculateFn" class="col-span-6" :class="{'mt-[26px]' : selectFilter === 0 }"/>
      <div class="col-span-6" :class="{'mt-[26px]' : selectFilter === 0 }">
        <div class=" mt-[5px] flex flex-col gap-[16px]">
          <div class="flex justify-between items-center border-b border-dashed border-t pt-[16px] pb-[16px]">
            <div class="font-semibold text-[18px] leading-[18px] text-[#808BA0]">К оплате</div>
            <div class="font-semibold text-[34px] leading-[24px] text-[#141C30]">{{ formatPrice(adjustedSaleSum) }}<span
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
            <div class="font-semibold text-[20px] leading-[24px] text-[#141C30]">{{ formatPrice(totalCardPay) }} <span
                class="text-[16px]">сум</span>
            </div>
          </div>
          <div class="flex justify-between" v-show="cardList.length !==0" v-for="(item,index) in cardList" :key="index">
            <div class="font-semibold text-[18px] leading-[18px] text-[#808BA0]">Внесено платежной картой
              {{ item.name }}
            </div>
            <div class="font-semibold text-[20px] leading-[24px] text-[#141C30]">{{ formatPrice(item.sum) }} <span
                class="text-[16px]">сум</span>
            </div>
            <div><span @click="deleteCard(index)" v-ripple class="pi pi-trash text-[16px] cursor-pointer"></span></div>
          </div>
          <div class="flex justify-between" v-if="bonusValue">
            <div class="font-semibold text-[18px] leading-[18px] text-[#808BA0]">Бонусы дисконтной карты</div>
            <div class="font-semibold text-[20px] leading-[24px] text-[#141C30]">{{ formatPrice(bonusValue) }} <span
                class="text-[16px]">сум</span>
            </div>
          </div>
          <div class="flex justify-between" v-if="certificationValue">
            <div class="font-semibold text-[18px] leading-[18px] text-[#808BA0]">Подарочный сертификат</div>
            <div class="font-semibold text-[20px] leading-[24px] text-[#141C30]">{{ formatPrice(certificationValue) }}
              <span
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
  <Toast/>
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
