<script setup>
import {onMounted, ref} from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import FinSelect from "@/components/ui/Selects.vue";
import {useAxios} from "@/composable/useAxios.js";
const goods = ref([])



const getGood = async () => {
  try {
    const res = await useAxios('/document/show/0e97bb29-d408-4380-8c44-e0431c2db7c8');
    const items = res.result.goods;
    const sum = res.result.sum;


    const imgURL = import.meta.env.VITE_IMG_URL;

    goods.value = items.map(item => ({
      name: item.good.name,
      amount: item.amount,
      price: item.good.price,
      sum: sum,
      photo: item.image ? `${imgURL}${item.image}` : ''
    }));
  } catch (error) {
    console.log(error);
  }
};


onMounted( ()=>{
   getGood();
})


</script>

<template>
  <div class="card-sidebar">
    <DataTable :value="goods" tableStyle="min-width: 10px; height: 100px;  ">
      <Column header="Наименование">
        <template #body="slotProps">
          <div style="display: flex; align-items: center;">
            <i v-if="!slotProps.data.photo" class=" image-good pi pi-image" style="margin-right: 10px;"></i>
            <img v-else :src="slotProps.data.photo" class="image-good">
            <span class="ml-[10px]" >{{ slotProps.data.name }} </span>
          </div>
        </template>
      </Column>
      <Column field="amount" header="Кол-во" style="width: 100px;"></Column>
      <Column field="price" header="Цена" style="width: 100px;"></Column>
      <Column field="sum" header="Сумма" style="width: 100px;"></Column>
      <Column header="" style="width: 50px;">
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

  td{
    color: black !important;
    font-size: 18px !important;
    font-weight: 600 !important;
  }

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
  .image-good{
    background-color: #f6f6f6 !important;
    border-radius: 10px !important;
    padding: 3px;
    width: 50px;
    height: 50px;
  }


  .p-datatable-table-container{
    border-top-right-radius: 10px !important;
  }

}

.color-circle {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  margin-right: 8px;
}

</style>
