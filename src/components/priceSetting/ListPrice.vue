<script setup>
import DatePicker from "primevue/datepicker";
import ProductList from "@/components/priceSetting/ProductList.vue";
import CreateProduct from "@/components/priceSetting/CreateProduct.vue";
import Sidebar from "primevue/sidebar";
import {ref} from "vue";

const createModal = ref(false);
const infoList = ref([]);

const getInfo = (info) =>{
  infoList.value = info;
  createModal.value = false;
}
</script>

<template>
  <div>
    <div class="flex justify-between">
      <div class="font-semibold text-[20px] leading-[20px] tex-[#141C30]">
        Установка цен
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
    <ProductList :products="infoList"/>
    <Sidebar
        v-model:visible="createModal"
        :show-close-icon="false"
        position="right"
        class="create-purchase"
        :dismissable="false"
    >
      <CreateProduct @close-dialog="getInfo"/>
    </Sidebar>
  </div>
</template>

<style scoped lang="scss">

</style>