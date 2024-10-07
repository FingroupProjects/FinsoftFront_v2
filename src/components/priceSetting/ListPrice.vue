<script setup>
import DatePicker from "primevue/datepicker";
import ProductList from "@/components/priceSetting/ProductList.vue";
import CreateProduct from "@/components/priceSetting/CreateProduct.vue";
import Sidebar from "primevue/sidebar";
import {ref} from "vue";
const createModal = ref(false);
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
            @click="createModal = true"
            severity="success"
            icon="pi pi-pencil"
            class="p-button-lg"
            label="Настройка"
        />
      </div>
    </div>
    <ProductList/>
    <Sidebar
        v-model:visible="createModal"
        :show-close-icon="false"
        position="right"
        class="create-purchase"
        :dismissable="false"
    >
      <CreateProduct @close-sidebar="createModal = false"/>
    </Sidebar>
  </div>
</template>

<style scoped lang="scss">

</style>