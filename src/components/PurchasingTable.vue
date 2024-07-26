<script setup>
import { ref } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import FinSelect from "@/components/ui/Selects.vue";

const products = ref([
  { select: null, name: 'Маслины без косточки Colossal 121-140 850мл Греция', price: '10.00', quantity: 50, summ: '500.00', deleteIcon: 'pi pi-trash' },
  { select: null, name: 'Острые чипсы Lays Чили и лайм 5 пачек по 125 грамм', price: '15.00', quantity: 30, summ: '450.00', deleteIcon: 'pi pi-trash' },
  { select: null, name: 'Соус Pesto con Basilico e Rucola 190', price: '20.00', quantity: 20, summ: '400.00', deleteIcon: 'pi pi-trash' },
]);

const options = [
  { label: 'option1', value: 1, color: '#ff0000' },
  { label: 'option2', value: 2, color: '#00ff00' },
  { label: 'option3', value: 3, color: '#ffff00' }
];

const deleteItem = (rowData) => {
  const index = products.value.indexOf(rowData.data);
  if (index !== -1) {
    products.value.splice(index, 1);
  }
};
</script>

<template>
  <div class="card-sidebar">
    <DataTable :value="products" tableStyle="min-width: 50rem">
      <Column field="select" header="Наименование">
        <template #body="rowData">
          <fin-select :options="options" v-model="rowData.data.select" optionLabel="label" >
            <template #option="{ option }">
              <div class="flex items-center">
                <span :style="{ backgroundColor: option.color }" class="color-circle"></span>
                <span>{{ option.label }}</span>
              </div>
            </template>
            <template #selectedItem="{ value }">
              <div class="flex items-center">
                <span :style="{ backgroundColor: value ? value.color : 'transparent' }" class="color-circle"></span>
              </div>
            </template>
          </fin-select>
        </template>
      </Column>
      <Column field="name" header=""></Column>
      <Column field="quantity" header="Кол-во"></Column>
      <Column field="price" header="Цена"></Column>
      <Column field="summ" header="Сумма"></Column>
      <Column header="">
        <template #body="rowData">
          <i class="pi pi-trash" style="cursor: pointer;" @click="deleteItem(rowData)"></i>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style lang="scss">
@import "@/assets/style/colors";

.card-sidebar {
  .p-datatable-header-cell{
    background-color: $table-bg-color !important;
  }
  .p-select-open{
    background-color: white !important;
    width: 20px !important;
  }
  .relative{
    width: 170px !important;
  }
  .p-focus{
    background-color: white !important;
    border: 1px solid $pi-chevron-color !important;
  }
  .p-select-option{
    border-radius: 10px !important;
    padding: 8px 16px !important;
    margin: 4px 0 !important;
    color: black !important;
  }

  .pi-trash{
    color:$text-color !important;
  }

  .p-datatable-table-container{
    border-top-right-radius: 10px !important;
  }
  .color-circle {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    margin-right: 8px;
  }
}

</style>
