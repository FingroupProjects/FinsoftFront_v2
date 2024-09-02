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
import FloatLabel from "primevue/floatlabel";
import DatePicker from "primevue/datepicker";

const emit = defineEmits(['close-modal', 'postSale'])
const props = defineProps({
  openUserInfo: {
    type: Boolean,
    default: false
  }
})

</script>

<template>
  <Dialog :draggable="false" class="fast-goods-header" v-model:visible="props.openUserInfo" modal
          :style="{ width: '800px', height:'354px' }" scroll :closable="false"
          :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
    <template #header>
      <div class="flex justify-between items-center w-full ">
        <div class="flex gap-5 items-center ">
          <fin-button @click="emit('close-modal')" icon="pi pi-times" class="p-button-2xl" severity="warning"
                      label="Отменить"/>
          <div class="font-semibold text-[26px] leading-[26px] text-[#141C30]">
            Добавление клиента
          </div>
        </div>
        <fin-button icon="pi pi-arrow-right" class="p-button-2xl" severity="info"
                    label="Применить" @click="emit('postSale')"/>
      </div>
    </template>
    <div class="grid add-user-info-modal grid-cols-12 gap-[16px] mt-[6px]">
      <fin-input class="col-span-4" placeholder="Имя"/>
      <fin-input class="col-span-4" placeholder="Фамилия"/>
      <FloatLabel class="col-span-4">
        <DatePicker
            showIcon

            showTime
            hourFormat="24"
            dateFormat="dd.mm.yy,"
            fluid
            hideOnDateTimeSelect
            iconDisplay="input"
            class="w-full"
        />
        <label for="dd-city">Дата</label>
      </FloatLabel>
      <fin-input class="col-span-6" placeholder="Адрес"/>
      <fin-input class="col-span-6" placeholder="Телефон"/>
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
<style lang="scss">
.add-user-info-modal {
  .p-datepicker {
    border: none !important;
    border-radius: 14px !important;
    display: flex !important;
    align-items: center !important;


    &-input-icon-container {
      top: 18px !important;
    }
  }
  .p-inputtext{
    height: 46px !important;
    border-radius: 10px !important;
  }
}


</style>