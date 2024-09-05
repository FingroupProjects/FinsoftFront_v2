<script setup>
import InputText from "primevue/inputtext";
import IconField from "primevue/iconfield";
import formatInputAmount from "@/constants/formatInput.js";
import {useForSale} from "@/store/forSale.js";
import {useAxios} from "@/composable/useAxios.js";
import formatPrice from "@/constants/formatNumber.js";
import {ref, watchEffect} from 'vue'

import {useToast} from "primevue/usetoast";

const store = useForSale();
const toast = useToast()
const emit = defineEmits(['postBonusCard', 'postCertification'])
const props = defineProps({
  disCount: {
    type: Number,
    default: 0
  }
})
const bonusCard = ref(props.disCount);
const activeCertification = ref(true);
const returnFnNumber = ref(0);
const allNumberFn = ref(0);
const idCertification = ref(null);

async function certificationFn() {
  try {
    const res = await useAxios(`certificate/search-by-doc_number/${store.numberCertification}`, {
      method: "GET"
    })
    activeCertification.value = false
    store.numberCertification = ''
    returnFnNumber.value = Number(res.result.sum);
    allNumberFn.value = Number(res.result.sum);
    idCertification.value = res.result.id

  } catch (e) {
    console.log(e)
    toast.add({severity: 'error', summary: 'Сертификата такого нет', life: 3000});
  }
}

function handleKeydown(event) {
  if (event.key === 'Enter') certificationFn()
}

const validateInput = () => {
  const maxAmount = props.disCount;
  const inputValue = Number(store.bonusCard);

  if (inputValue > maxAmount) {
    store.bonusCard = ''
  }
};

function postFnBonusCard() {
  bonusCard.value = Number(props.disCount) - Number(store.bonusCard)
  emit('postBonusCard', store.bonusCard)
}

function postFnCertification() {
  allNumberFn.value = returnFnNumber.value - Number(store.numberCertification)
  emit('postCertification', store.numberCertification,idCertification.value)
}

watchEffect(() => {
  if (!activeCertification.value) {
    const inputValue = Number(store.numberCertification);
    if (inputValue > returnFnNumber.value) {
      store.numberCertification = ''
    }
  }
})
</script>

<template>
  <div class="flex gap-[26px] transition-all ">
    <div class="bg-[#F2F2F2] p-[20px] rounded-[16px] w-full">
      <div class="text-[18px] leading-[18px] text-[#141C30] font-semibold">
        Подарочный сертификат
      </div>
      <div class="flex gap-[16px] items-center justify-between complex-payment mt-[15px]">
        <div v-show="!activeCertification" class="text-[34px] leading-[34px] font-semibold text-[#141C30]">
          {{ formatPrice(allNumberFn) }} <span class="text-[24px] leading-[24px]">сум</span>
        </div>
        <IconField class="w-full" :class="{'w-[34.6%]' :!activeCertification}">
          <InputText
              class="w-full"
              v-model="store.numberCertification"
              :model-value="formatInputAmount(store.numberCertification)"
              @focus="store.activeInput = false"
              :placeholder="activeCertification ? 'Номер сертификата' : 'Кол-во'"
              @keydown="handleKeydown"
          />
        </IconField>
        <fin-button v-if="activeCertification" icon="pi pi-arrow-right" @click="certificationFn"
                    severity="success"/>
      </div>
      <fin-button @click="postFnCertification" v-show="!activeCertification"
                  class="w-full btn-animation-payment mt-[24px]"
                  icon="pi pi-arrow-right"
                  label="Списать" severity="success"/>
    </div>
    <div class="bg-[#F2F2F2] p-[20px] rounded-[16px] w-full transition-all">
      <div class="text-[18px] leading-[18px] text-[#141C30] font-semibold">
        Бонусы дисконтной карты
      </div>
      <div class="flex gap-[26px] items-center justify-between complex-payment mt-[15px]">
        <div class="text-[34px] leading-[34px] font-semibold text-[#141C30]">
          {{ formatPrice(bonusCard) }} <span
            class="text-[24px] leading-[24px]">сум</span>
        </div>
        <IconField class="w-[35%]">
          <InputText
              class="w-full"
              v-model="store.bonusCard"
              @focus="store.activeInput = true"
              :disabled="disCount === 0"
              @input="validateInput"
              :placeholder="props.disCount === 0 ? 'Кол-во' : 'Кол-во'"
              :model-value="formatInputAmount(store.bonusCard)"
          />
        </IconField>
      </div>
      <fin-button @click="postFnBonusCard" v-show="store.bonusCard" class="w-full btn-animation-payment mt-[24px]"
                  icon="pi pi-arrow-right"
                  label="Списать" severity="success"/>
    </div>
  </div>

</template>
<style lang="scss">
.btn-animation-payment {
  animation: btn-show 0.5s ease-in-out;
}

@keyframes btn-show {
  0% {
    opacity: 0.5;
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.complex-payment {
  .p-inputtext[type=text] {
    font-size: 24px !important;
    color: #808BA0;
    font-family: Manrope, sans-serif;
    font-weight: 600;
  }

  .p-inputtext {
    background: white !important;
    border: none !important;
    border-radius: 12px !important;
    padding-left: 15px !important;;
  }

  .p-inputtext::placeholder {
    color: #808BA0;
  }

  .p-button {
    height: 52px !important;
    width: 52px !important;
  }
}
</style>