<script setup>
import {onMounted, ref} from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Button from "primevue/button";
import Tag from 'primevue/tag';

const products = ref();
const selectedProduct = ref();
const value1 = ref('')
const selectedCity = ref();
const cities = ref([
  {name: 'New York', code: 'NY'},
  {name: 'Rome', code: 'RM'},
  {name: 'London', code: 'LDN'},
  {name: 'Istanbul', code: 'IST'},
  {name: 'Paris', code: 'PRS'}
]);

onMounted(() => {
  products.value = [{
    id: '1000',
    code: 'f230fh0g3',
    name: 'Bamboo Watch',
    description: 'Product Description',
    image: 'bamboo-watch.jpg',
    price: 65,
    category: 'Accessories',
    quantity: 24,
    inventoryStatus: 'INSTOCK',
    rating: 5
  }]
});
</script>

<template>
  <div class="grid grid-cols-12 gap-[16px]">
    <IconField class="col-span-6">
      <InputIcon class="pi pi-search"/>
      <InputText class="w-full" v-model="value1" placeholder="Поиск"/>
    </IconField>
    <Dropdown v-model="selectedCity" :options="cities" optionLabel="name" placeholder="Склад"
              class="w-full  col-span-2"/>
    <Dropdown v-model="selectedCity" :options="cities" optionLabel="name" placeholder="Поставщик"
              class="w-full col-span-2"/>
    <Button severity="primary" class="col-span-1">
      <img src="@/assets/img/menu.svg" alt="">
    </Button>
    <Button severity="success" icon="pi pi-plus" class="col-span-1" label="Создать"></Button>
  </div>
  <div class="card mt-4">
    <DataTable v-model:selection="selectedProduct"
               :value="products"
               :rowsPerPageOptions="[5, 10, 25]"
               :paginator="true"
               currentPageReportTemplate="Элементов на странице:"
               paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
               dataKey="id"
               tableStyle="min-width:100%">
      <Column selectionMode="multiple"></Column>
      <Column field="code" header="№"></Column>
      <Column field="name" header="Дата"></Column>
      <Column field="category" header="Поставщик"></Column>
      <Column field="quantity" header="Организация"></Column>
      <Column field="code" header="Сумма"></Column>
      <Column field="name" header="Склад"></Column>
      <Column field="category" header="Статус">
        <template #body>
          <Tag value="Проведен" severity="success"/>
          <Tag value="Не проведен" severity="warn"/>
        </template>
      </Column>
      <Column field="quantity" header="Автор"></Column>
      <Column field="quantity" header="Валюта"></Column>
    </DataTable>
  </div>
</template>
<style lang="scss">
.p-inputtext {
  border-color: white !important;
  border-radius: 10px !important;
  box-shadow: none !important;
}

.p-inputtext::placeholder {
  color: #808BA0 !important;
  font-size: 15px !important;
  font-weight: 600;
  font-family: Manrope, sans-serif;
  line-height: 15px;
}

.p-select {
  border-color: white !important;
  border-radius: 10px !important;
  box-shadow: none !important;

}

.p-placeholder {
  color: #808BA0 !important;
  font-size: 15px !important;
  font-weight: 600;
  font-family: Manrope, sans-serif;

}

.p-datatable-column-title {
  color: #808BA0;
  font-family: Manrope, sans-serif;
  font-weight: 600;
  font-size: 15px;
  line-height: 15px;
}

.p-datatable-table {
  border-radius: 10px;
}

.p-tag-label {
  font-size: 13px;
  line-height: 13px;
  font-weight: 600;
  font-family: Manrope, sans-serif;

}

.p-tag-success {
  background: #CBF7D2 !important;
  padding: 8px 12px 8px 12px !important;
  color: #17A825;
}
.p-tag-warn{
  background: #FFE9C9!important;
  padding: 8px 12px 8px 12px !important;
  color: #C1790C;
}
.p-datatable-tbody > tr > td{
  color: #141C30;
  font-weight: 500;
  font-family: Manrope, sans-serif;
  font-size: 15px;
  line-height: 15px;
}
.p-datatable-header-cell:nth-child(1){
  border-top-left-radius: 10px !important;
}
.p-datatable-header-cell:nth-child(10){
  border-top-right-radius: 10px !important;
}
</style>

