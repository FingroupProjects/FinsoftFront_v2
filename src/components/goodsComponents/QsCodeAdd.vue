<script setup>
import {ref} from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import formatInputAmount from "@/constants/formatInput.js";
import moment from "moment";
import {useAxios} from "@/composable/useAxios.js";
import {useToast} from "primevue/usetoast";
import Toast from "primevue/toast";

const props = defineProps({
  productId: {
    required: true,
  }
});
const toast = useToast();

const coleVo = ref("");
const editingRows = ref([]);
const newProduct = ref();
const barCodeList = ref([]);

const clearInputValues = () => {
  newProduct.value = {};
  coleVo.value = "";
};

const confirmDeleteProduct = async (index) => {
  try {
    const res = await useAxios(`/barcode/${index}`);
    toast.add({
      severity: "success",
      summary: "Success Message",
      detail: "Message Content",
      life: 3000,
    });
    getBarcode()
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
    const res = await useAxios(`/barcode`, {
      method: "POST",
      data: {
        "barcode": coleVo.value,
        "good_id": props.productId
      },
    });
    getBarcode()
    toast.add({
      severity: "success",
      summary: "Success Message",
      detail: "Message Content",
      life: 3000,
    });
    clearInputValues();
  } catch (e) {
    console.log(e);
    toast.add({
      severity: "error",
      summary: "Error Message",
      detail: e,
      life: 3000,
    });
  }
}

async function getBarcode() {
  try {
    const res = await useAxios(`/barcode/${props.productId}`);
    barCodeList.value = res.result.data
  } catch (e) {
    console.log(e);
  }
}

getBarcode()
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
          @click="postMethod"
          label="Добавить"
          severity="success"
          class="p-button-lg"
      />
    </div>
  </div>
  <div class="table-create dropdown-status" v-if="barCodeList.length > 0">
    <DataTable
        :value="barCodeList"
        scrollable
        scrollHeight="280px"
        class="mt-[21px]"
        v-model:editingRows="editingRows"
        editMode="row"
        tableStyle="min-width: 50rem"
    >
      <Column field="coleVo" header="Наименование">
        <template #body="{ data }">
          <div class="flex items-center gap-[10px]">
            <img src="@/assets/img/shtirxImg.svg" alt="" class="me-2">
            <div>{{ data.barcode }}</div>
          </div>
        </template>
      </Column>
      <Column field="data" header="Дата создания">
        <template #body="{data}">
          {{ moment(new Date(data?.created_at)).format(" D.MM.YYYY h:mm") }}
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
}
</style>

<style scoped lang="scss">
.filter-form {
  border-top: 1px dashed #dcdfe3;
  border-bottom: 1px dashed #dcdfe3;
}
</style>