<script setup>
import {onMounted, ref, watch, watchEffect} from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import {useAxios} from "@/composable/useAxios.js";
import FloatLabel from "primevue/floatlabel";
import Select from "primevue/dropdown";
import inputText from 'primevue/inputtext'
import InputText from 'primevue/inputtext'
import formatInputAmount from "@/constants/formatInput.js";

import {usePurchaseStore} from "@/store/pruchase.js";

const emit = defineEmits(['editModal']);
const props = defineProps({
      infoGoods: Object
    },
);
const store = usePurchaseStore();
const goods = ref([]);
const selectedProducts = ref();
const addInput = ref(false);
const amount = ref("");
const price = ref("");
const sum = ref("");
const getAllSum = ref(0);
const getAllProduct = ref(0);
const productsId = ref([]);
const editingRows = ref([]);
const newProduct = ref();
const editModalOpen = ref(true);
const employees = ref([]);

const imgURL = import.meta.env.VITE_IMG_URL;


const userName = {
  name: localStorage.getItem("user_name"),
};

const getGood = async () => {

  const items = props.infoGoods;
  console.log(items)
  employees.value = items.map((item) => ({
    employee_name: item.employee_name,
    standart_hours: item.standart_hours,
    fact_hours: item.standart_hours
  }));
};

onMounted(function () {
  console.log(props.infoGoods)
})
watch(props.infoGoods, () => {
  console.log(props.infoGoods)
});
watchEffect(() => {
  getGood();
})
</script>

<template>

  <div class="purchase-table-header" v-if="employees?.length > 0">
    <DataTable
        :value="employees"
        scrollable
        scrollHeight="500px"
        class="mt-[21px]"
        editMode="row"
        tableStyle="min-width: 50rem"
    >
      <Column field="employee_name" header="Наименование">
        <template #editor="{ data, field }">
        <input-text v-model="data[field]" fluid :model-value="data[field]"/>
      </template>
      </Column>
      <Column field="standart_hours" header="Кол.во часов по стандарту">
        <template #editor="{ data, field }">
          <input-text v-model="data[field]" :model-value="formatInputAmount(data[field])" fluid/>
        </template>
      </Column>

      <Column field="fact_hours" header="Кол.во часов по факту"></Column>
    </DataTable>
  </div>

</template>

<style lang="scss">
.card-sidebar {
  .p-component {
    height: 48px !important;
    border-radius: 10px !important;
    border-color: #DCDFE3 !important;
  }
}

.purchase-table-header {
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
