<script setup>
import Select from "primevue/select";
import FloatLabel from "primevue/floatlabel";
import ToggleSwitch from 'primevue/toggleswitch';
import { ref } from 'vue';

const checkedTextMobile = ref("Не активно")
const checkedTextCard = ref("Не активно")
const checkedTextOrg = ref("Не активно")
const checkedTextSale = ref("Не активно")
const checkedMobile = ref(false);
const checkedCard  = ref(false)
const checkedOrg  = ref(false)
const checkedSale  = ref(false)

function checkMobile () {
  if (checkedMobile.value === false){
    checkedTextMobile.value = "Активно"
  }else{
    checkedTextMobile.value = "Не активно"
  }

}
function checkCard () {

  if (checkedCard.value === false){
    checkedTextCard.value = "Активно"
  }
  else{
    checkedTextCard.value = "Не активно"
  }

}
function checkOrg () {

  if (checkedOrg.value === false){
    checkedTextOrg.value = "Активно"
  }else{
    checkedTextOrg.value = "Не активно"
  }
}
function checkSale () {

  if (checkedSale.value === false){
    checkedTextSale.value = "Активно"
  }
  else{
    checkedTextSale.value = "Не активно"
  }
}



</script>

<template>
<div class="settings bg-white w-[790px] h-[771px] rounded-2xl ">
  <div class="flex pt-[25px] pl-[25px]">
    <div class="text-[18px] font-semibold ">Системные настройки</div>
  </div>
  <div class="mt-4">
    <FloatLabel class="col-span-4 ml-6 mr-8" >
      <Select
          class="w-[260px]"
      />
      <label for="dd-city">Язык</label>
    </FloatLabel>
  </div>
  <div class="mt-4 mx-[25px]">
    <div class="flex w-full h-[62px] bg-[#f2f2f2] rounded-2xl items-center justify-between">
      <div class=" ml-6 font-semibold text-[16px]">Мобильное приложение</div>
      <div class="flex items-center justify-end text-[16px]">
        <div :class="[checkedMobile ? 'text-green-500' : 'text-[#808ba0]']" class="font-semibold mr-3">
          {{ checkedTextMobile }}
        </div>
        <div class="mr-[25px] mt-2"> <ToggleSwitch v-model="checkedMobile" @click="checkMobile()" /></div>
      </div>
    </div>
  </div>
  <div class="mt-4 mx-[25px]">
    <div class="flex w-full h-[62px] bg-[#f2f2f2] rounded-2xl items-center justify-between">
      <div class=" ml-6 font-semibold text-[16px]">Карты лояльности</div>
      <div class="flex items-center justify-end text-[16px]">
        <div :class="[checkedCard ? 'text-green-500' : 'text-[#808ba0]']" class="font-semibold mr-3">
          {{ checkedTextCard }}
        </div>
        <div class="mr-[25px] mt-2"> <ToggleSwitch v-model="checkedCard" @click="checkCard()" /></div>
      </div>
    </div>
  </div>
  <div class="mt-4 mx-[25px]">
    <div class="flex w-full h-[62px] bg-[#f2f2f2] rounded-2xl items-center justify-between">
      <div class=" ml-6 font-semibold text-[16px]">Купля-продажа между организациями</div>
      <div class="flex items-center justify-end text-[16px]">
        <div :class="[checkedOrg ? 'text-green-500' : 'text-[#808ba0]']" class="font-semibold mr-3">
          {{ checkedTextOrg }}
        </div>
        <div class="mr-[25px] mt-2"> <ToggleSwitch v-model="checkedOrg" @click="checkOrg()" /></div>
      </div>
    </div>
  </div>
  <div class="mt-4 mx-[25px]">
    <div class="flex w-full h-[62px] bg-[#f2f2f2] rounded-2xl items-center justify-between">
      <div class=" ml-6 font-semibold text-[16px]">Розничные продажи</div>
      <div class="flex items-center justify-end text-[16px]">
        <div :class="[checkedSale ? 'text-green-500' : 'text-[#808ba0]']" class="font-semibold mr-3">
          {{ checkedTextSale }}
        </div>
        <div class="mr-[25px] mt-2"> <ToggleSwitch v-model="checkedSale" @click="checkSale()" /></div>
      </div>
    </div>
  </div>

  <div class="w-[730px] h-[134px] border-2 mx-[25px] mt-4 rounded-2xl">
    <div class="flex w-full h-[62px] rounded-2xl items-center justify-between">
      <div class=" ml-6 font-semibold text-[16px]">Продажа в рассрочку</div>
      <div class="flex items-center justify-end text-[16px]">
        <div :class="[checkedSale ? 'text-green-500' : 'text-[#808ba0]']" class="font-semibold mr-3">
          {{ checkedTextSale }}
        </div>
        <div class="mr-[25px] mt-2"> <ToggleSwitch v-model="checkedSale" @click="checkSale()" /></div>
      </div>
    </div>
    <div class="flex justify-center mx-6 gap-4">
      <fin-input placeholder="Первоначальный взнос" class="w-full"   />
      <fin-input placeholder="Добавление карт" class="w-full"  />
    </div>
  </div>

  <div class="w-[730px] h-[134px] border-2 mx-[25px] mt-4 rounded-2xl">
    <div class="flex w-full h-[62px] rounded-2xl items-center justify-between">
      <div class=" ml-6 font-semibold text-[16px]">Запрет изменении информации задних чисел</div>
      <div class="flex items-center justify-end text-[16px]">
        <div :class="[checkedSale ? 'text-green-500' : 'text-[#808ba0]']" class="font-semibold mr-3">
          {{ checkedTextSale }}
        </div>
        <div class="mr-[25px] mt-2"> <ToggleSwitch v-model="checkedSale" @click="checkSale()" /></div>
      </div>
    </div>
    <div class="flex justify-center mx-6 gap-4">
      <fin-input placeholder="Минимальное значение" class="w-full"   />
    </div>
  </div>

</div>
</template>

<style scoped lang="scss">

</style>