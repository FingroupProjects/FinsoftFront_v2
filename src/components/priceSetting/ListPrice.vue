<script setup>
import DatePicker from "primevue/datepicker";
import ProductList from "@/components/priceSetting/ProductList.vue";
</script>

<template>
  <div>
    <div class="flex justify-between">
      <div class="font-semibold text-[20px] leading-[20px] tex-[#141C30]">
        Прайс-лист ООО “ДелоВкуса”
        <div class="text-[15px] leading-[15px] text-[#808BA0] mt-[14px]">
          Последняя редакция: 11.07.2024 12:11:00
        </div>
      </div>
      <div class="flex gap-5 price-list-date-picker">
          <DatePicker
              showIcon
              showTime
              hourFormat="24"
              dateFormat="dd.mm.yy,"
              fluid
              hideOnDateTimeSelect
              iconDisplay="input"
              class="w-full"
              placeholder="Дата"
          />
        <fin-button
            severity="success"
            icon="pi pi-pencil"
            class="p-button-lg"
            label="Настройка"
        />
      </div>
    </div>
    <ProductList/>
  </div>
</template>

<style scoped lang="scss">

</style>