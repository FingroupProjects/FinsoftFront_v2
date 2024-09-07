<script setup>
import Dialog from "primevue/dialog";
import {ref, watch} from "vue";
import {useAxios} from "@/composable/useAxios.js";
import PhoneNumber from "@/components/ForSale/PhoneNumber.vue";

const emit = defineEmits(['close-modal', 'postInfoUser'])
const props = defineProps({
  openDepositMoney: {
    type: Boolean,
    default: false
  },
  saleSum: {
    type: Number,
    default: 0
  },
  discountInfo:{
    type: Object,
    default: null
  }
})

const payMethods = ref([]);
const infoUser = ref();
const errorName = ref('');

async function postPhone(numbers) {
  try {
    const cleaned = numbers.replace(/\D/g, '');

    if (cleaned) {
      const res = await useAxios(`discount/+${cleaned}`, {
        method: "GET",
      });
      infoUser.value = res.result
    } else {
      console.log('Invalid number format');
    }
  } catch (e) {
    errorName.value = 'дисконтная карта для не существует'
    infoUser.value = ''
    console.log(e);
  }
}

async function cardFn() {
  try {
    const res = await useAxios(`/good-group`)
    payMethods.value = res.result.data.map(el => {
      return {
        name: el.name
      }
    })
  } catch (e) {
    console.log(e)
  }
}
watch(() => props.discountInfo, (newValue) => {
  if (newValue) {
    postPhone(newValue.phone).then(()=>{
      postFn()
    })

  }
});
function postFn() {
  if (infoUser.value) {
    emit('postInfoUser', infoUser.value)
  }
}

cardFn()
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
            Дисконтная карта
          </div>
        </div>
        <fin-button icon="pi pi-arrow-right" class="p-button-2xl" severity="info"
                    label="Применить" @click="postFn"/>
      </div>
    </template>
    <div class="grid grid-cols-12 gap-[26px] mt-[6px]">
      <PhoneNumber  @numbers-wallet="postPhone" class="col-span-6"/>
      <div class="col-span-6">
        <div
            class="https://chromewebstore.google.com/detail/dimensions/baocaagndhipibgklemoalmkljaimfdj?pli=1flex flex-col gap-[16px]">
          <div class="font-semibold text-[18px] leading-[18px] text-[#808BA0] mb-[16px]">Клиент</div>
          <div
              class="bg-[#F2F2F2] flex items-center gap-[10px] px-[16px] py-[12px] h-[50px] rounded-[12px] text-[#808BA0] text-[18px] font-semibold leading-[18px] mb-[24px]">
            <img src="@/assets/img/IconUser.svg" alt="">
            {{ infoUser?.lastname || errorName }} {{ infoUser?.name }}
          </div>
          <div class="flex justify-between items-center border-dashed border-t py-[24px] ">
            <div class="font-semibold text-[18px] leading-[18px] text-[#808BA0]">Накоплено</div>
            <div class="font-semibold text-[34px] leading-[24px] text-[#141C30]">{{ infoUser?.sum || '0.00' }} <span
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