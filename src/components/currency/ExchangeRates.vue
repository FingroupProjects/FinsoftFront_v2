<script setup>
import {ref} from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import formatInputAmount from "@/constants/formatInput.js";
import moment from "moment";
import {useAxios} from "@/composable/useAxios.js";
import {useToast} from "primevue/usetoast";
import Toast from "primevue/toast";
import FloatLabel from "primevue/floatlabel";
import DatePicker from "primevue/datepicker";

const props = defineProps({
  productId: {
    required: true,
  },
  multiplicity: {
    required: true
  }
});
const toast = useToast();

const coleVo = ref("");
const date = ref("");
const editingRows = ref([]);
const newProduct = ref();
const currencyRateList = ref([]);

const clearInputValues = () => {
  newProduct.value = {};
  coleVo.value = "";
};

const confirmDeleteProduct = async (index) => {
  try {
    const res = await useAxios(`/currencyRate/${index}`,{
      method: "DELETE",
    });

    toast.add({
      severity: "success",
      summary: "Success Message",
      detail: "Message Content",
      life: 3000,
    });
    getExchangeRates()
  } catch (e) {
    console.log(e);
    toast.add({
      severity: "error",
      summary: "Error Message",
      detail: e,
      life: 3000,
    });
  }
};

async function postMethod() {
  try {

    const res = await useAxios(`/currencyRate/add/${props.productId}`, {
      method: "POST",
      data: {
        "date": moment(date.value).format("DD-MM-YYYY"),
        "value": coleVo.value
      },
    });

    toast.add({
      severity: "success",
      summary: "Success Message",
      detail: "Message Content",
      life: 3000,
    });
    clearInputValues();
    getExchangeRates()
  } catch (e) {
    console.log(e);
    toast.add({
      severity: "error",
      summary: "Error Message",
      detail: e.response.data.message,
      life: 3000,
    });
  }
}

async function getExchangeRates() {
  try {
    const res = await useAxios(`/currencyRate/${props.productId}`);
    currencyRateList.value = res.result.data
      console.log(currencyRateList.value)
  } catch (e) {
    console.log(e);
  }
}

getExchangeRates()
</script>

<template>
  <div class="flex items-center mt-[30px] gap-[21px]">
    <div class="header-title">Курсы валют</div>
  </div>
  <div class="filter-form grid grid-cols-12 gap-[16px] pt-[21px] pb-[21px] mt-[21px]">
    <div class="col-span-8 flex gap-[16px]">
      <fin-input v-model="coleVo" class="" :model-value="formatInputAmount(coleVo)"
                 placeholder="Курс валют"/>

      <FloatLabel class="col-span-5">
        <DatePicker
            showIcon
            v-model="date"
            dateFormat="dd.mm.yy"
            iconDisplay="input"
            class="w-full"
        >
        </DatePicker>
        <label for="dd-city">Дата</label>
      </FloatLabel>
      <fin-input disabled class="" :model-value="props.multiplicity"
                 placeholder="Кратность"/>

      <fin-button
          icon="pi pi-save"
          @click="postMethod"
          label="Добавить"
          severity="success"
          class="p-button-lg"
      />

    </div>
  </div>
  <div class="table-create dropdown-status" v-if="currencyRateList.length > 0">
    <DataTable
        :value="currencyRateList"
        scrollable
        scrollHeight="280px"
        class="mt-[21px]"
        v-model:editingRows="editingRows"
        editMode="row"
        tableStyle="min-width: 50rem"
    >
      <Column field="data" header="Дата создания">
        <template #body="{data}">
          {{ data.value }}
        </template>
      </Column>
      <Column field="data" header="Дата создания">
        <template #body="{data}">
          {{ moment(new Date(data?.date)).format("D.MM.YYYY h:mm") }}
        </template>
      </Column>
      <Column field="quantity" header="">
        <template #body="{ data }">
          <i
              @click="confirmDeleteProduct(data.id)"
              class="pi pi-trash text-[#808BA0] cursor-pointer"
          ></i>
        </template>
      </Column>
    </DataTable>
  </div>
  <Toast/>
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

.dropdown-status {
  .p-select {
    border-radius: 10px;
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