<script setup>
import {onMounted, ref, watchEffect} from "vue";
import Dropdown from "primevue/dropdown";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import {useAxios} from "@/composable/useAxios.js";
import InputText from "primevue/inputtext";
import formatInputAmount from "@/constants/formatInput.js";

const emit = defineEmits(["postGoods"]);
const props = defineProps({
      employees: Object
    },
);
const selectedProducts = ref();
const addInput = ref(false);
const products = ref([]);
const postProducts = ref([]);
const coleVo = ref("");
const price = ref("");
const sum = ref("");
const getAllSum = ref(0);
const getAllProduct = ref(0);
const productsId = ref([]);
const editingRows = ref([]);
const newProduct = ref();
const datas = ref([])
const confirmDeleteProduct = (index) => {
  const deletedProduct = products.value.splice(index, 1)[0];
  postProducts.value.splice(index, 1);
  getAllSum.value -= Number(deletedProduct.sum);
  getAllProduct.value -= Number(deletedProduct.coleVo);
};

const getIdProducts = async (inputValue) => {
  const imgURL = import.meta.env.VITE_IMG_URL;
  const res = await useAxios(`good?search=${inputValue?.srcElement.value}`);
  productsId.value = res.result.data.map((el) => ({
    products: el.name,
    code: el.id,
    img: el.images[0]?.image ? imgURL + el.images[0].image : new URL('@/assets/img/exampleImg.svg',import.meta.url)
  }));
};

const onRowEditSave = (event) => {
  const {newData, index} = event;
  const oldData = datas.value[index];

  console.log(oldData)
  products.value.splice(index, 1, newData);

  postProducts.value.splice(index, 1, {
    salary: newData.salary
  });
};
const getGood = async () => {

  const items = props.employees;
  datas.value = items.map((item) => ({
    employee_id: item.employee_id,
    employee_name: item.employee_name,
    standart_hours: item.standart_hours,
    fact_hours: item.fact_hours,
    oklad: item.salary,
    salary: item.salary,
    worked_hours: item.standart_hours,
    another_payments: 0,
    takes_from_salary: 0,
    payed_salary: item.salary
  }));
  console.log(datas.value)
};
watchEffect(() => {
  getGood();
})

onMounted(async () => {
  await getIdProducts();
});
</script>

<template>
  <div class="flex items-center mt-[30px] gap-[21px]">
    <div class="header-title">Сотрудники</div>
  </div>

  <div class="table-create" v-if="datas.length > 0">
    <DataTable
        :value="datas"
        scrollable
        scrollHeight="280px"
        class="mt-[21px]"
        v-model:editingRows="editingRows"
        @row-edit-save="onRowEditSave"
        editMode="row"
        tableStyle="min-width: 50rem"
    >
      <Column field="employee_name" header="Наименование">
        <template #editor="{ data, field }">
          <input-text v-model="data[field]" fluid :model-value="data[field]"/>
        </template>
      </Column>
      <Column field="oklad" header="Оклад">
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" :model-value="data[field]" fluid class="w-[10%]"/>
        </template>
      </Column>
      <Column field="worked_hours" header="Рабочие часы">
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" :model-value="formatInputAmount(data[field])" fluid class="w-[10%]"/>
        </template>
      </Column>
      <Column field="salary" header="Зарплата">
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" :model-value="data[field]" fluid class="w-[10%]"/>
        </template>
      </Column>
      <Column field="another_payments" header="Другие оплаты">
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" :model-value="data[field]" fluid class="w-[10%]"/>
        </template>
      </Column>
      <Column field="takes_from_salary" header="Удержания от зарплаты ">
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" :model-value="data[field]" fluid class="w-[10%]"/>
        </template>
      </Column>
      <Column field="payed_salary" header="Зарплата к оплате">
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" :model-value="data[field]" fluid class="w-[10%]"/>
        </template>
      </Column>
      <Column
          :rowEditor="true"
          style="width: 10%; min-width: 8rem;"
          bodyStyle="text-align:center"
      >
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

  .p-datatable-row-editor-init {
    right: 80px;
  }

  .p-datatable-header-cell {
    background: #f6f6f6 !important;
  }

  .p-datatable-row-editor-init {
    right: 40px;
  }

  .p-datatable-table-container::-webkit-scrollbar {
    width: 4px !important;
    height: 3px !important;
  }

  .p-datatable-table-container::-webkit-scrollbar-track {
    background-color: #f1f1f1 !important;
    height: 3px !important;
  }

  .p-datatable-table-container::-webkit-scrollbar-thumb {
    background-color: #3935E7 !important;
    border-radius: 6px !important;
    height: 3px !important;
  }

  .p-datatable-table-container::-webkit-scrollbar-thumb:hover {
    background-color: #3935E7;
    height: 3px !important;
  }
}
</style>

<style scoped lang="scss">
.filter-form {
  border-top: 1px dashed #dcdfe3;
  border-bottom: 1px dashed #dcdfe3;
}
</style>