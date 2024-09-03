<script setup>
import {ref} from 'vue'
import {useForSale} from "@/store/forSale.js";

const store = useForSale()

const emit = defineEmits(['numbersWallet'])

const number = ref([
  {
    code: 7
  },
  {
    code: 8
  },
  {
    code: 9
  },
  {
    code: 4
  },
  {
    code: 5
  },

  {
    code: 6
  },

  {
    code: 1
  },
  {
    code: 2
  },
  {
    code: 3
  },

  {
    code: 0
  },

  {
    code: '.'
  },
  {
    code: 'C'
  },

]);
const searchQuery = ref('');

function updateSearchQuery(code) {
  if (store.activeInput) {
    return store.bonusCard += code;
  } else {
    return store.numberCertification += code;
  }
}

function removeLastCharacter() {
  if (store.activeInput) {
    return store.bonusCard = store.bonusCard.slice(0, -1)
  } else {
    return store.numberCertification = store.numberCertification.slice(0, -1);
  }
}

function handleKeydown(event) {
  if (event.key === 'Enter') pushNumbers()
}

function pushNumbers() {
  if (store.numberCertification) {
    emit('numbersWallet', store.numberCertification)
    store.numberCertification = ''
  }
}

function allRemove() {
  if (store.activeInput) {
    return store.bonusCard = ''
  } else {
    return store.numberCertification = ''
  }
}
</script>

<template>
  <div class="grid grid-cols-12 gap-[16px]">
    <div class="col-span-9 grid grid-cols-12 gap-[16px]">
      <button v-ripple v-for="(num,index) in number" :key="index"
              :class="{'h-[174xpx]' : index === 15}"
              @click="updateSearchQuery(num.code)"
              class="h-[70px] rounded-[21px] text-center active:text-white btn-number
                 active:bg-[#3935E7] col-span-4 p-[20px] bg-[#F2F2F2] text-[30px] font-semibold leading-[30px]">
        {{ num.code }}
      </button>
    </div>
    <div class="col-span-3  gap-[16px] flex flex-col">
      <button
          @click="allRemove"
          class="h-[70px] rounded-[21px] text-[#808BA0] text-center col-span-4 p-[20px] bg-[#F2F2F2] font-semibold leading-[30px]">
        <i class="pi pi-times" style="font-size: 1.5rem !important;">
        </i>
      </button>
      <button
          @click="removeLastCharacter"
          class="h-[70px] rounded-[21px] text-[#808BA0] text-center col-span-4 p-[20px] bg-[#F2F2F2] font-semibold leading-[30px]">
        <i class="pi pi-angle-left" style="font-size: 2rem !important;">
        </i>
      </button>
      <button
          @click="pushNumbers"
          class="h-[100%] rounded-[21px] text-white text-center flex justify-center items-center col-span-4 p-[20px] bg-[#3935E7] font-semibold leading-[30px]">
        <i class="pi pi-arrow-right" style="font-size: 1.5rem !important;">
        </i>
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.btn-number {
  transition: 0.5s all linear;
}
</style>
