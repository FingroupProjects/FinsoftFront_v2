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
import Sidebar from "primevue/sidebar";
import CreatePurchase from "@/components/CreatePurchase.vue";
import FilterPurchase from "@/components/FilterPurchase.vue";
import PurchasingTable from "@/components/PurchasingTable.vue";
import FinSelect from "@/components/ui/Selects.vue";

const visibleRight = ref(false);
const products = ref();
const selectedProduct = ref();
const value1 = ref('')
const selectedCity = ref();
const visibleFilter = ref(false)
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

      <fin-select v-model="selectedCity" :options="cities" optionLabel="name" placeholder="Склад"
                  class="w-full  col-span-2"/>
      <fin-select v-model="selectedCity" :options="cities" optionLabel="name" placeholder="Поставщик"
                  class="w-full col-span-2"/>


    <Button @click="visibleFilter = true" severity="primary" class="col-span-1">
      <img src="@/assets/img/menu.svg" alt="">
    </Button>
    <Button @click="visibleRight = true" severity="success" icon="pi pi-plus" class="col-span-1"
            label="Создать"></Button>
  </div>
  <div class="card mt-4">
    <DataTable v-model:selection="selectedProduct"
               :value="products"
               :rows="5"
               :rowsPerPageOptions="[5, 10, 25]"
               :paginator="true"
               currentPageReportTemplate="Элементов на странице:"
               paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
               dataKey="id"
               tableStyle="min-width:100%">
      <Column selectionMode="multiple"></Column>
      <Column field="code" :sortable="true" header="№"></Column>
      <Column field="name" :sortable="true" header="Дата"></Column>
      <Column field="category" :sortable="true" header="Поставщик"></Column>
      <Column field="quantity" :sortable="true" header="Организация"></Column>
      <Column field="code" :sortable="true" header="Сумма"></Column>
      <Column field="name" :sortable="true" header="Склад"></Column>
      <Column field="category" :sortable="true" header="Статус">
        <template #body>
          <Tag value="Проведен" severity="success"/>
          <Tag value="Не проведен" severity="warn"/>
        </template>
      </Column>
      <Column field="quantity" :sortable="true" header="Автор"></Column>
      <Column field="quantity" :sortable="true" header="Валюта"></Column>
    </DataTable>
  </div>
  <Sidebar v-model:visible="visibleRight" :show-close-icon="false" position="right">
    <CreatePurchase/>
  </Sidebar>
  <Sidebar v-model:visible="visibleFilter" :show-close-icon="false" position="right">
    <purchasing-table/>
  </Sidebar>
</template>
<style lang="scss">
.p-drawer-right .p-drawer {
  width: 1154px !important;
  border-top-left-radius: 30px;
}
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

.p-focus {
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

.p-select{
  border-radius: 10px !important;
}
.p-select-open{
  border-color: #3935E7 !important;
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

.p-paginator {
  justify-content: end !important;
}
</style>

