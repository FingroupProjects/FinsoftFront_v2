<script setup>
import Calendar from 'primevue/calendar';
import FinInput from "@/components/ui/Inputs.vue";
import Dropdown from "primevue/dropdown";
</script>

<template>
  <div class="filters-purchase">
    <div class="text-black text-2xl font-semibold ">Фильтры</div>
    <Calendar showIcon placeholder="От" iconDisplay="input" class="col-span-4 w-[500px] custom-calendar font-semibold" />
    <Calendar showIcon placeholder="По" iconDisplay="input" class="col-span-4 w-[500px] custom-calendar font-semibold" />
    <fin-input class="mt-[10px]" placeholder="Организация"/>
    <Dropdown class="mt-[10px] w-full font-semibold" placeholder="Склад"/>
    <div class="flex mt-[10px] gap-4">
      <Dropdown class="w-[300px] font-semibold" placeholder="Статус"/>
      <Dropdown class="w-[300px] font-semibold" placeholder="Удален"/>
    </div>
    <div class="flex mt-[10px] gap-4">
      <Dropdown class="w-[300px] font-semibold" placeholder="Автор"/>
      <Dropdown class="w-[300px] font-semibold" placeholder="Валюта"/>
    </div>
    <div class="flex mt-[10px] gap-4">
      <fin-button icon="pi pi-save"  label="Применить" severity="success" class="p-button-lg w-full"/>
      <fin-button icon="pi pi-times"  label="Сбросить" severity="secondary" class="p-button-lg w-full"/>
    </div>
  </div>
</template>

<style>
.filters-purchase {
  .custom-calendar {
    padding-top: 10px;
  }
  .p-component{
    border-radius: 10px !important;
    border-color: #DCDFE3 !important;
  }
  .appearance-none{
    border-radius: 10px !important;
    height: 46px !important;
    border-color: #DCDFE3 !important;
  }
  .p-button-secondary{
    color: #3935E7 !important;
    font-size: 16px !important;
  }
  .p-button-label{
    font-weight: bold !important;
  }

}


</style>