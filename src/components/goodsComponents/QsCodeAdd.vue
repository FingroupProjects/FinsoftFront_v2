<script setup>
import {ref} from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import formatInputAmount from "@/constants/formatInput.js";
import moment from "moment";
import Dropdown from "primevue/dropdown";

const products = ref([]);
const postProducts = ref([]);
const coleVo = ref("");
const getAllSum = ref(0);
const getAllProduct = ref(0);
const editingRows = ref([]);
const newProduct = ref();
const selectedStatus = ref({name: 'Активный', code: 'NY'},);
const listStatus = ref([
  {name: 'Активный', code: 'NY'},
  {name: 'Не Активный', code: 'RM'},

]);
const clearInputValues = () => {
  newProduct.value = {};
  coleVo.value = "";
};

const addFn = async () => {
  const product = {
    coleVo: coleVo.value,
    data: new Date
  };
  products.value.push(product);

  clearInputValues();
};

const confirmDeleteProduct = (index) => {
  const deletedProduct = products.value.splice(index, 1)[0];
  postProducts.value.splice(index, 1);
  getAllSum.value -= Number(deletedProduct.sum);
  getAllProduct.value -= Number(deletedProduct.coleVo);
};

const onRowEditSave = (event) => {
  const {newData, index} = event;
  const oldProduct = products.value[index];

  newData.sum = Number((newData.price * newData.coleVo).toFixed(2));

  products.value.splice(index, 1, newData);

  postProducts.value.splice(index, 1, {
    amount: newData.coleVo,
    good_id: newData.products.code || oldProduct.good_id,
    price: newData.price,
  });

  getAllSum.value = getAllSum.value - Number(oldProduct.sum) + Number(newData.sum);
  getAllProduct.value = getAllProduct.value - Number(oldProduct.coleVo) + Number(newData.coleVo);
};

</script>

<template>
  <div class="flex items-center mt-[30px] gap-[21px]">
    <div class="header-title">Штрих-коды</div>
  </div>
  <div class="filter-form grid grid-cols-12 gap-[16px] pt-[21px] pb-[21px] mt-[21px]">
    <div class="col-span-5 flex gap-[16px]">
      <fin-input v-model="coleVo" class="w-full" :model-value="formatInputAmount(coleVo)"
                 placeholder="Введите номер штрих-кода"/>
      <fin-button
          icon="pi pi-save"
          @click="addFn"
          label="Добавить"
          severity="success"
          class="p-button-lg"
      />
    </div>
  </div>
  <div class="table-create dropdown-status" v-if="products.length > 0">
    <DataTable
        :value="products"
        scrollable
        scrollHeight="280px"
        class="mt-[21px]"
        v-model:editingRows="editingRows"
        @row-edit-save="onRowEditSave"
        editMode="row"
        tableStyle="min-width: 50rem"
    >
      <Column field="coleVo" header="Наименование">
        <template #body="{ data }">
          <div class="flex items-center gap-[10px]">
            <img src="@/assets/img/shtirxImg.svg" alt="" class="me-2">
            <div>{{ data.coleVo }}</div>
          </div>
        </template>
      </Column>
      <Column field="data" header="Дата создания">
        <template #body="{data}">
          {{ moment(new Date(data.data)).format(" D.MM.YYYY h:mm") }}
        </template>
      </Column>
      <Column field="sum" header="Статус">
        <template #body>
          <Dropdown v-model="selectedStatus"
                    class="h-[32px] items-center" optionLabel="name" :options="listStatus">
            <template #value>
              <div class="flex gap-3 items-center">
                <img src="@/assets/img/greenActive.svg" alt="">
                <div class="text-[#000000] font-semibold">{{ selectedStatus.name }}</div>
              </div>
            </template>
          </Dropdown>
        </template>
      </Column>
      <Column field="quantity" header="">
        <template #body="{ index }">
          <i
              @click="confirmDeleteProduct(index)"
              class="pi pi-trash text-[#808BA0] cursor-pointer"
          ></i>
        </template>
      </Column>
    </DataTable>
  </div>
</template>
<style lang="scss">
.table-create {
  .p-datatable-header-cell {
    background: #f6f6f6;
  }

  .p-select-label {
    margin-top: 5px;
  }
}
.dropdown-status{
  .p-select {
    border-radius: 10px;
  }
}
</style>

<style scoped lang="scss">
.filter-form {
  border-top: 1px dashed #dcdfe3;
  border-bottom: 1px dashed #dcdfe3;
}
</style>