<script setup>
import {ref, watch, watchEffect} from "vue";
import Dropdown from "primevue/dropdown";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

const emit = defineEmits(['postGoods'])

const selectedSearch = ref();
const addInput = ref(false);
const products = ref([]);
const postProducts = []
const coleVo = ref('');
const price = ref('');
const sum = ref('');
const getAllSum = ref(0);
const getAllProduct = ref(0);
const cities = ref([{
  name: 'srt',
  code: 1
}]);

function addFn() {
  const newProduct = {
    coleVo: coleVo.value,
    price: price.value,
    sum: sum.value
  };
  const postProduct = {
    amount: coleVo.value,
    good_id: price.value,
    price: sum.value
  }

  if (newProduct.coleVo && newProduct.price && newProduct.sum) {
    products.value.push(newProduct);
    postProducts.push(postProduct)
    getAllSum.value += Number(newProduct.sum);
    getAllProduct.value += Number(newProduct.coleVo);
    addInput.value = false
    emit('postGoods', postProducts);
  }
  coleVo.value = ''
  price.value = ''
  sum.value = ''
}

const confirmDeleteProduct = (index) => {
  const deletedProduct = products.value.splice(index, 1)[0];
  getAllSum.value -= Number(deletedProduct.sum);
  getAllProduct.value -= Number(deletedProduct.coleVo);
};
watchEffect(() => {
  sum.value = coleVo.value * price.value
})
</script>

<template>
  <div class="flex items-center mt-[30px] gap-[21px]">
    <div class="header-title">
      Товары
    </div>
    <fin-button @click="addInput = true" icon="pi pi-plus" severity="success" label="Добавить"/>
  </div>
  <div v-show="addInput" class="filter-form grid create-purchase grid-cols-12 gap-[16px] pt-[21px] pb-[21px] mt-[21px]">
    <Dropdown v-model="selectedSearch" :options="cities" optionLabel="name"
              placeholder="Поиск по Id, наименованию, штрих коду" class="col-span-6"/>
    <div class="col-span-6 flex gap-[16px]">
      <fin-input v-model="coleVo" placeholder="Кол-во"/>
      <fin-input v-model="price" placeholder="Цена"/>
      <fin-input v-model="sum" placeholder="Сумма"/>
      <fin-button icon="pi pi-trash" @click="addInput = false" severity="warning" class="p-button-icon-xl"/>
      <fin-button icon="pi pi-save" @click="addFn" label="Сохранить" severity="success" class="p-button-lg"/>
    </div>
  </div>
  <div class="table-create" v-if="products.length > 0">
    <DataTable :value="products" class="mt-[21px]" tableStyle="min-width: 50rem">
      <Column field="code" header="Наименование"></Column>
      <Column field="coleVo" header="Кол-во"></Column>
      <Column field="price" header="Цена"></Column>
      <Column field="sum" header="Сумма"></Column>
      <Column field="quantity" header="">
        <template #body="{index}">
          <i @click="confirmDeleteProduct(index)" class="pi pi-trash text-[#808BA0] cursor-pointer"></i>
        </template>
      </Column>
    </DataTable>
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
        {{ getAllProduct }}
      </div>
      <div class="text-[22px] text-[#141C30] leading-[22px] font-semibold">
        <div class="text-[13px] text-[#808BA0] leading-[13px] font-semibold mb-[8px]">
          Товаров
        </div>
        {{ products.length }}
      </div>
      <div class="text-[22px] text-[#141C30] leading-[22px] font-semibold">
        <div class="text-[13px] text-[#808BA0] leading-[13px] font-semibold mb-[8px]">
          Сумма
        </div>
        {{ getAllSum.toLocaleString() }}
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.table-create {
  .p-datatable-header-cell {
    background: #F6F6F6;
  }
}
</style>

<style scoped lang="scss">
.filter-form {
  border-top: 1px dashed #DCDFE3;
  border-bottom: 1px dashed #DCDFE3;
}
</style>