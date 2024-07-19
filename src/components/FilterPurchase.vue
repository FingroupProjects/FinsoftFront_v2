<script setup>
import {ref} from 'vue'
import Calendar from 'primevue/calendar';
import Dropdown from "primevue/dropdown";

const icondisplay = ref();
const selectedCity = ref();
const cities = ref([
  {name: 'New York', code: 'NY'},
  {name: 'Rome', code: 'RM'},
  {name: 'London', code: 'LDN'},
  {name: 'Istanbul', code: 'IST'},
  {name: 'Paris', code: 'PRS'}
]);
</script>

<template>
  <div class="create-purchase">
    <div class="header">
      <div class="flex gap-[16px]">
        <div>
          <div class="header-title">
            Закупка
          </div>
          <div class="header-text text-[#808BA0] font-semibold text-[16px]">
            №32151
          </div>
        </div>

        <Dropdown v-model="selectedCity" :options="cities" optionLabel="name" placeholder="Статус" class="col-span-4"/>
        <fin-button icon="pi pi-arrow-right" label="Провести" severity="secondary" class="p-button-lg"/>
      </div>
      <div class="flex gap-[16px]">
        <fin-button icon="pi pi-arrow-right-arrow-left" label="Движение" severity="warning" class="p-button-lg"/>
      </div>
    </div>
    <div class="form grid grid-cols-12 gap-[16px] mt-[30px] border-b border-t pt-[30px] pb-[20px]">
      <Calendar v-model="icondisplay" showIcon placeholder="Дата" iconDisplay="input" class="col-span-4"/>
      <Dropdown v-model="selectedCity" :options="cities" optionLabel="name" placeholder="Организация"
                class="col-span-4"/>
      <Dropdown v-model="selectedCity" :options="cities" optionLabel="name" placeholder="Поставщик" class="col-span-4"/>
      <Dropdown v-model="selectedCity" :options="cities" optionLabel="name" placeholder="Договор" class="col-span-3"/>
      <Dropdown v-model="selectedCity" :options="cities" optionLabel="name" placeholder="Склад" class="col-span-3"/>
      <Dropdown v-model="selectedCity" :options="cities" optionLabel="name" placeholder="Автор" class="col-span-3"/>
      <Dropdown v-model="selectedCity" :options="cities" optionLabel="name" placeholder="Валюта" class="col-span-3"/>
      <fin-input placeholder="Комментарий" class="col-span-12 mt-[10px]"/>
      <div class="col-span-12">
        <button class="text-[#808BA0] m-auto flex justify-center text-[16px] font-[Manrope] leading-[16px]">Скрыть <i class="pi pi-angle-up"></i>
        </button>
      </div>
    </div>
    <div class="flex items-center mt-[30px] gap-[21px]">
      <div class="header-title">
        Товары
      </div>
      <fin-button icon="pi pi-plus" severity="success" label="Добавить"/>
    </div>
  </div>
  <div class="rounded-[10px] flex justify-between items-center p-[18px] mt-[16px] bg-[#F6F6F6]">
    <div class="text-[#141C30] font-semibold text-[20px] leading-[20px]">
      Итого:
    </div>
    <div class="flex gap-[49px]">
      <div class="text-[22px] text-[#141C30] leading-[22px] font-semibold">
        <div class="text-[13px] text-[#808BA0] leading-[13px] font-semibold mb-[8px]">
          Кол-во
        </div>
        780
      </div>
      <div class="text-[22px] text-[#141C30] leading-[22px] font-semibold">
        <div class="text-[13px] text-[#808BA0] leading-[13px] font-semibold mb-[8px]">
          Товаров
        </div>
        4
      </div>
      <div class="text-[22px] text-[#141C30] leading-[22px] font-semibold">
        <div class="text-[13px] text-[#808BA0] leading-[13px] font-semibold mb-[8px]">
          Сумма
        </div>
        28 190
      </div>
    </div>

  </div>


</template>

<style scoped lang="scss">
.header {
  display: flex;
  justify-content: space-between;

  &-title {
    font-family: Manrope, sans-serif;
    font-weight: 600;
    font-size: 20px;
    line-height: 20px;
    color: var(--fin-text-header);

    &-text {
      font-family: Manrope, sans-serif;
    }
  }
}

.filter-form {
  border-top: 1px dashed #DCDFE3;
  border-bottom: 1px dashed #DCDFE3;
}
</style>
<style lang="scss">
.p-datepicker {
  border: 1px solid #DCDFE3 !important;
  border-radius: 10px;
  display: flex;
  align-items: center;
}

.create-purchase {
  .p-select {
    border-color: #DCDFE3 !important;
    border-radius: 10px !important;
    box-shadow: none !important;
    height: 46px;
    align-items: center;
  }
}
</style>